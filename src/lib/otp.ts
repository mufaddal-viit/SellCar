import 'server-only';
import { createHmac, randomInt, randomBytes, timingSafeEqual } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';

const ISSUER = 'buyanddrive-app';
const TOKEN_TTL = '30m';
export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_MS = 30 * 1000; // 30s between sends
export const OTP_MAX_SENDS_PER_WINDOW = 5;
export const OTP_SEND_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function secretKey(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error('AUTH_SECRET is not set');
  return new TextEncoder().encode(s);
}

/** Cryptographically-random 6-digit code. */
export function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

/** HMAC of the code, bound to the email so a hash can't be reused elsewhere. */
export function hashOtp(code: string, email: string): string {
  return createHmac('sha256', process.env.AUTH_SECRET || '')
    .update(`${email.toLowerCase()}:${code}`)
    .digest('hex');
}

export function verifyOtpHash(code: string, email: string, hash: string): boolean {
  const a = Buffer.from(hashOtp(code, email));
  const b = Buffer.from(hash);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Mint a Mongo-compatible ObjectId (24 hex) up front for the document folder. */
export function newAppId(): string {
  return randomBytes(12).toString('hex');
}

/** Signed proof that an email was verified, carrying the reserved application id. */
export async function createEmailToken(email: string, appId: string): Promise<string> {
  return new SignJWT({ email: email.toLowerCase(), appId, purpose: 'application-email' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(secretKey());
}

export async function verifyEmailToken(
  token: string | undefined | null,
): Promise<{ email: string; appId: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { issuer: ISSUER });
    if (
      payload.purpose !== 'application-email' ||
      typeof payload.email !== 'string' ||
      typeof payload.appId !== 'string'
    ) {
      return null;
    }
    return { email: payload.email, appId: payload.appId };
  } catch {
    return null;
  }
}
