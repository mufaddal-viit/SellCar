import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma, hasDb } from '@/lib/db/prisma';
import { hasEmail, sendOtpEmail } from '@/lib/email';
import {
  generateOtp,
  hashOtp,
  OTP_TTL_MS,
  OTP_RESEND_COOLDOWN_MS,
  OTP_MAX_SENDS_PER_WINDOW,
  OTP_SEND_WINDOW_MS,
} from '@/lib/otp';

const schema = z.object({ email: z.string().trim().email() });

export async function POST(req: Request) {
  if (!hasDb || !hasEmail) {
    return NextResponse.json(
      { error: 'Email verification is not configured.' },
      { status: 503 },
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase();
  const now = new Date();

  const existing = await prisma.otpToken.findUnique({ where: { email } });
  if (existing && now.getTime() - existing.lastSentAt.getTime() < OTP_RESEND_COOLDOWN_MS) {
    return NextResponse.json(
      { error: 'Please wait a few seconds before requesting another code.' },
      { status: 429 },
    );
  }
  const withinWindow =
    existing && now.getTime() - existing.lastSentAt.getTime() < OTP_SEND_WINDOW_MS;
  const sentCount = withinWindow ? existing!.sentCount : 0;
  if (sentCount >= OTP_MAX_SENDS_PER_WINDOW) {
    return NextResponse.json(
      { error: 'Too many codes requested. Please try again later.' },
      { status: 429 },
    );
  }

  const code = generateOtp();
  const data = {
    codeHash: hashOtp(code, email),
    expiresAt: new Date(now.getTime() + OTP_TTL_MS),
    attempts: 0,
    sentCount: sentCount + 1,
    lastSentAt: now,
  };
  await prisma.otpToken.upsert({
    where: { email },
    create: { email, ...data },
    update: data,
  });

  try {
    await sendOtpEmail(email, code);
  } catch {
    return NextResponse.json(
      { error: 'Could not send the email. Please try again.' },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
