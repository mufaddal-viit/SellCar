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

export { cloudinary };
