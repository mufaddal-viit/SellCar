import { NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyEmailToken } from '@/lib/otp';
import {
  hasCloudinary,
  signParams,
  applicationFolder,
} from '@/lib/cloudinary';
import { DOC_KINDS } from '@/lib/validation';

const schema = z.object({
  token: z.string().min(1),
  name: z.string().default('applicant'),
  kind: z.enum(DOC_KINDS),
});

export async function POST(req: Request) {
  if (!hasCloudinary) {
    return NextResponse.json({ error: 'Uploads are not configured.' }, { status: 500 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }

  // Only a verified email (with its reserved appId) can sign an upload.
  const session = await verifyEmailToken(parsed.data.token);
  if (!session) {
    return NextResponse.json({ error: 'Please verify your email first.' }, { status: 401 });
  }

  const folder = applicationFolder(parsed.data.name, session.appId);
  const timestamp = Math.round(Date.now() / 1000);
  // Documents are stored as authenticated (private) assets.
  const paramsToSign = {
    folder,
    public_id: parsed.data.kind,
    type: 'authenticated',
    timestamp,
  };

  return NextResponse.json({
    signature: signParams(paramsToSign),
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
    publicId: parsed.data.kind,
  });
}
