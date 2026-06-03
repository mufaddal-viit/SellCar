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
  process.env.CLOUDINARY_FOLDER_NAME || 'driveeasy/cars';

/** Sign the exact params the upload widget asks us to sign (signed-upload contract). */
export function signParams(paramsToSign: Record<string, unknown>): string {
  return cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string,
  );
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

export const TESTIMONIALS_FOLDER = `${CLOUDINARY_FOLDER}/testimonials`;

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
    // `folder:foo/*` matches the folder and any sub-folders.
    .expression(`folder:${TESTIMONIALS_FOLDER}/*`)
    .with_field('context')
    .sort_by('created_at', 'desc')
    .max_results(opts.limit ?? 12);
  if (opts.cursor) search = search.next_cursor(opts.cursor);

  const res = await search.execute();

  type Resource = {
    asset_id?: string;
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    context?: { custom?: Record<string, string> } & Record<string, string>;
  };

  const items: ClientPhoto[] = (res.resources as Resource[]).map((r) => {
    const ctx = r.context?.custom ?? r.context ?? {};
    return {
      id: r.asset_id || r.public_id,
      url: r.secure_url,
      width: r.width,
      height: r.height,
      title: ctx.caption || ctx.title || undefined,
      subtitle: ctx.alt || ctx.subtitle || undefined,
    };
  });

  return { items, nextCursor: (res.next_cursor as string) ?? null };
}

export { cloudinary };
