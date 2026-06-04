import type { DocKind } from '@/lib/validation';

export interface UploadedDoc {
  kind: DocKind;
  publicId: string;
  resourceType: string;
  format: string;
}

/**
 * Upload a KYC document straight from the browser to Cloudinary as a private
 * (authenticated) asset. The signature is issued by /api/applications/sign-upload,
 * which only signs for the verified applicant's folder.
 */
export async function uploadDocument(
  file: File,
  kind: DocKind,
  name: string,
  token: string,
): Promise<UploadedDoc> {
  const signRes = await fetch('/api/applications/sign-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, name, kind }),
  });
  if (!signRes.ok) {
    const e = await signRes.json().catch(() => ({}));
    throw new Error(e.error || 'Could not start the upload.');
  }
  const sig = await signRes.json();

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', sig.apiKey);
  form.append('timestamp', String(sig.timestamp));
  form.append('signature', sig.signature);
  form.append('folder', sig.folder);
  form.append('public_id', sig.publicId);
  form.append('type', 'authenticated');

  const upRes = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`,
    { method: 'POST', body: form },
  );
  if (!upRes.ok) throw new Error('Upload failed. Please try again.');
  const data = await upRes.json();

  return {
    kind,
    publicId: data.public_id,
    resourceType: data.resource_type || 'image',
    format: data.format || '',
  };
}
