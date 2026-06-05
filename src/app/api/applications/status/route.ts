import { NextResponse } from 'next/server';
import { verifyEmailToken } from '@/lib/otp';
import { getApplicationsByEmail } from '@/server/applications';

/** Returns the verified applicant's applications (privacy-safe subset). */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const session = await verifyEmailToken(body?.token);
  if (!session) {
    return NextResponse.json({ error: 'Please verify your email first.' }, { status: 401 });
  }
  const applications = await getApplicationsByEmail(session.email);
  return NextResponse.json({ applications });
}
