import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma, hasDb } from '@/lib/db/prisma';
import {
  verifyOtpHash,
  createEmailToken,
  newAppId,
  OTP_MAX_ATTEMPTS,
} from '@/lib/otp';

const schema = z.object({
  email: z.string().trim().email(),
  code: z.string().trim().regex(/^\d{6}$/, 'Enter the 6-digit code'),
});

export async function POST(req: Request) {
  if (!hasDb) {
    return NextResponse.json({ error: 'Verification is not configured.' }, { status: 503 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter the 6-digit code.' }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase();
  const { code } = parsed.data;

  const rec = await prisma.otpToken.findUnique({ where: { email } });
  if (!rec) {
    return NextResponse.json({ error: 'Please request a code first.' }, { status: 400 });
  }
  if (rec.expiresAt < new Date()) {
    await prisma.otpToken.delete({ where: { email } }).catch(() => {});
    return NextResponse.json({ error: 'Code expired. Request a new one.' }, { status: 400 });
  }
  if (rec.attempts >= OTP_MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: 'Too many incorrect attempts. Request a new code.' },
      { status: 429 },
    );
  }
  if (!verifyOtpHash(code, email, rec.codeHash)) {
    await prisma.otpToken.update({
      where: { email },
      data: { attempts: rec.attempts + 1 },
    });
    return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 400 });
  }

  // Success → single-use, mint the reserved app id + verification token.
  await prisma.otpToken.delete({ where: { email } }).catch(() => {});
  const appId = newAppId();
  const token = await createEmailToken(email, appId);
  return NextResponse.json({ ok: true, token });
}
