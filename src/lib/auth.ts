import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'admin_session';
const ISSUER = 'driveeasy-admin';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is not set');
  return new TextEncoder().encode(secret);
}

/** Admin login is email-OTP based — requires the secret + the allowed email. */
export const authConfigured = Boolean(process.env.AUTH_SECRET && process.env.ADMIN_EMAIL);

/** True only for the single configured admin email (case-insensitive). */
export function isAdminEmail(email: string): boolean {
  const allowed = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  return Boolean(allowed) && email.toLowerCase().trim() === allowed;
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setSubject('admin')
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecretKey(), { issuer: ISSUER });
    return true;
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
