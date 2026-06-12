import type { MediaAsset } from '@/types';

/**
 * Upload a car photo/video straight from the browser to Cloudinary, into the
 * given folder. The signature is issued by /api/admin/sign-upload (admin-only),
 * which signs exactly the params we pass.
 *
 * Used by the car form's "upload on save" flow: media is held locally until the
 * admin saves, so nothing reaches Cloudinary unless the car is actually saved
 * (no orphaned uploads from abandoned/never-saved forms).
 */
export async function uploadCarMedia(
  file: File,
  folder: string,
  resourceType: 'image' | 'video',
): Promise<MediaAsset> {
  // Cloudinary signed-upload contract: only the params included in the
  // signature may be sent. We sign { folder, timestamp }.
  const timestamp = Math.round(Date.now() / 1000);

  const signRes = await fetch('/api/admin/sign-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paramsToSign: { folder, timestamp } }),
  });
  if (!signRes.ok) {
    const e = await signRes.json().catch(() => ({}));
    throw new Error(e.error || 'Could not start the upload.');
  }
  const sig = await signRes.json();
  const signature = sig.signature as string;
  const cloudName =
    sig.cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = sig.apiKey || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  if (!cloudName || !apiKey) {
    throw new Error('Cloudinary is not configured for uploads.');
  }

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('signature', signature);
  form.append('folder', folder);

  const upRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: 'POST', body: form },
  );
  if (!upRes.ok) {
    throw new Error('Upload failed. Please try again.');
  }
  const data = await upRes.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
  };
}
