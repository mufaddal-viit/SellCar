'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma, hasDb } from '@/lib/db/prisma';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  authConfigured,
  isAdminEmail,
  createSessionToken,
} from '@/lib/auth';
import { hasEmail, sendOtpEmail } from '@/lib/email';
import {
  generateOtp,
  hashOtp,
  verifyOtpHash,
  OTP_TTL_MS,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_MS,
} from '@/lib/otp';

export interface AdminOtpState {
  ok?: boolean;
  error?: string;
}

/** Step 1 — email a one-time code, but only to the configured admin email. */
export async function requestAdminOtp(email: string): Promise<AdminOtpState> {
  if (!authConfigured) {
    return { error: 'Admin login is not configured (set ADMIN_EMAIL and AUTH_SECRET).' };
  }
  if (!hasDb || !hasEmail) {
    return { error: 'Login is unavailable right now. Please try again later.' };
  }
  const e = email.toLowerCase().trim();
  if (!isAdminEmail(e)) {
    return { error: 'This email is not authorized to access the admin.' };
  }

  const now = new Date();
  const existing = await prisma.otpToken.findUnique({ where: { email: e } });
  if (existing && now.getTime() - existing.lastSentAt.getTime() < OTP_RESEND_COOLDOWN_MS) {
    return { error: 'Please wait a few seconds before requesting another code.' };
  }

  const code = generateOtp();
  const data = {
    codeHash: hashOtp(code, e),
    expiresAt: new Date(now.getTime() + OTP_TTL_MS),
    attempts: 0,
    sentCount: (existing?.sentCount ?? 0) + 1,
    lastSentAt: now,
  };
  await prisma.otpToken.upsert({ where: { email: e }, create: { email: e, ...data }, update: data });

  try {
    await sendOtpEmail(e, code);
  } catch {
    return { error: 'Could not send the code. Please try again.' };
  }
  return { ok: true };
}

/** Step 2 — verify the code and start the admin session. */
export async function verifyAdminOtp(email: string, code: string): Promise<AdminOtpState> {
  if (!authConfigured || !hasDb) {
    return { error: 'Login is unavailable right now.' };
  }
  const e = email.toLowerCase().trim();
  if (!isAdminEmail(e)) {
    return { error: 'This email is not authorized.' };
  }

  const rec = await prisma.otpToken.findUnique({ where: { email: e } });
  if (!rec) return { error: 'Please request a code first.' };
  if (rec.expiresAt < new Date()) {
    await prisma.otpToken.delete({ where: { email: e } }).catch(() => {});
    return { error: 'Code expired. Request a new one.' };
  }
  if (rec.attempts >= OTP_MAX_ATTEMPTS) {
    return { error: 'Too many incorrect attempts. Request a new code.' };
  }
  if (!verifyOtpHash(code, e, rec.codeHash)) {
    await prisma.otpToken.update({ where: { email: e }, data: { attempts: rec.attempts + 1 } });
    return { error: 'Incorrect code. Please try again.' };
  }

  await prisma.otpToken.delete({ where: { email: e } }).catch(() => {});

  const token = await createSessionToken();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return { ok: true };
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect('/admin/login');
}
