import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const hasCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);

export const CLOUDINARY_FOLDER =
  process.env.CLOUDINARY_FOLDER_NAME || 'carimages';

/** Sign the exact params the upload widget asks us to sign (signed-upload contract). */
export function signParams(paramsToSign: Record<string, unknown>): string {
  return cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string,
  );
}

export const APPLICATIONS_FOLDER = 'applications';

export function slugifyName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'applicant'
  );
}

/** Per-applicant private document folder: applications/<name>_<appId>. */
export function applicationFolder(name: string, appId: string): string {
  return `${APPLICATIONS_FOLDER}/${slugifyName(name)}_${appId}`;
}

/** Signed delivery URL for a private (authenticated) KYC document — expires in 15 min. */
export function signedDocUrl(
  publicId: string,
  resourceType = 'image',
  format = '',
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60; // 15 minutes
  return cloudinary.utils.private_download_url(publicId, format || 'jpg', {
    resource_type: resourceType || 'image',
    type: 'authenticated',
    expires_at: expiresAt,
  });
}

/** Fetch the byte size of a private asset (server-side document-size enforcement). */
export async function getAssetBytes(
  publicId: string,
  resourceType = 'image',
): Promise<number | null> {
  if (!hasCloudinary || !publicId) return null;
  try {
    const r = await cloudinary.api.resource(publicId, {
      resource_type: resourceType || 'image',
      type: 'authenticated',
    });
    return typeof r.bytes === 'number' ? r.bytes : null;
  } catch {
    return null;
  }
}

/** Remove an asset from Cloudinary (best-effort). */
export async function destroyAsset(
  publicId: string,
  resourceType: 'image' | 'video' = 'image',
) {
  if (!hasCloudinary || !publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch {
    // Non-fatal: the DB record is the source of truth for the site.
  }
}

/** Remove a private (authenticated) document asset. */
export async function destroyDoc(publicId: string, resourceType = 'image') {
  if (!hasCloudinary || !publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || 'image',
      type: 'authenticated',
    });
  } catch {
    // best-effort
  }
}

export const TESTIMONIALS_FOLDER = `${CLOUDINARY_FOLDER}/testimonials`;
/** Customer feedback screenshots shown in the carousel (sub-folder). */
export const TESTIMONIAL_FEEDBACK_FOLDER = `${TESTIMONIALS_FOLDER}/feedback`;
/** Happy-customer / WhatsApp photos shown as a gallery — live in the root. */
export const TESTIMONIAL_FACES_FOLDER = TESTIMONIALS_FOLDER;

export interface FolderImage {
  publicId: string;
  url: string;
  width: number;
  height: number;
}

/** Insert f_auto,q_auto so Cloudinary serves the smallest modern format. */
function optimized(url: string): string {
  return url.includes('/upload/') ? url.replace('/upload/', '/upload/f_auto,q_auto/') : url;
}

/**
 * List every image in a single Cloudinary folder (oldest first), via Search API.
 * Pass `excludeFolder` to drop assets that live in a given sub-folder (so the
 * faces root doesn't pull in the feedback sub-folder).
 */
export async function listFolderImages(
  folder: string,
  opts?: { excludeFolder?: string },
): Promise<FolderImage[]> {
  if (!hasCloudinary) return [];
  try {
    let expression = `folder:${folder}`;
    if (opts?.excludeFolder) expression += ` AND NOT folder:${opts.excludeFolder}`;
    const res = await cloudinary.search
      .expression(expression)
      .sort_by('created_at', 'asc')
      .max_results(100)
      .execute();
    type R = { public_id: string; secure_url: string; width: number; height: number };
    return (res.resources as R[]).map((r) => ({
      publicId: r.public_id,
      url: optimized(r.secure_url),
      width: r.width,
      height: r.height,
    }));
  } catch {
    return [];
  }
}

export interface ClientPhoto {
  id: string;
  url: string;
  width: number;
  height: number;
  title?: string;
  subtitle?: string;
}

/**
 * Paginated list of client/testimonial photos from carimages/testimonials.
 * Uses the Search API (works with both fixed- and dynamic-folder accounts —
 * unlike api.resources({prefix}), which only matches the public_id prefix).
 */
export async function listTestimonialPhotos(opts: {
  cursor?: string;
  limit?: number;
}): Promise<{ items: ClientPhoto[]; nextCursor: string | null }> {
  if (!hasCloudinary) return { items: [], nextCursor: null };

  let search = cloudinary.search
    // Customer photos = the testimonials root, excluding the feedback sub-folder
    // (feedback screenshots are shown separately in the testimonials carousel).
    .expression(`folder:${TESTIMONIALS_FOLDER} AND NOT folder:${TESTIMONIAL_FEEDBACK_FOLDER}`)
    .with_field('context')
    .sort_by('created_at', 'desc')
    .max_results(opts.limit ?? 12);
  if (opts.cursor) search = search.next_cursor(opts.cursor);

  const res = await search.execute();

  type Resource = {
    asset_id?: string;
    public_id: string;
    asset_folder?: string;
    secure_url: string;
    width: number;
    height: number;
    context?: { custom?: Record<string, string> } & Record<string, string>;
  };

  const items: ClientPhoto[] = (res.resources as Resource[])
    // Belt-and-suspenders: drop anything that lives in the feedback sub-folder,
    // regardless of how the Search API interprets the folder expression.
    .filter(
      (r) =>
        !`${r.asset_folder ?? ''}/${r.public_id}`.includes(`${TESTIMONIALS_FOLDER}/feedback`),
    )
    .map((r) => {
      const ctx = r.context?.custom ?? r.context ?? {};
      return {
        id: r.asset_id || r.public_id,
        url: optimized(r.secure_url),
        width: r.width,
        height: r.height,
        title: ctx.caption || ctx.title || undefined,
        subtitle: ctx.alt || ctx.subtitle || undefined,
      };
    });

  return { items, nextCursor: (res.next_cursor as string) ?? null };
}

export { cloudinary };
