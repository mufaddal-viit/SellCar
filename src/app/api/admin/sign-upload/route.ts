import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth-guard';
import { signParams, hasCloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!hasCloudinary) {
    return NextResponse.json({ error: 'Cloudinary is not configured.' }, { status: 500 });
  }
  const body = await req.json().catch(() => ({}));
  const paramsToSign = body?.paramsToSign;
  if (!paramsToSign || typeof paramsToSign !== 'object') {
    return NextResponse.json({ error: 'Missing paramsToSign' }, { status: 400 });
  }
  const signature = signParams(paramsToSign);
  // Also return the public upload config so the client can post to Cloudinary
  // without relying on NEXT_PUBLIC_* being set.
  return NextResponse.json({
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}
