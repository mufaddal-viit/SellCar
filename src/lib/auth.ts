import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'admin_session';
const ISSUER = 'driveeasy-admin';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export const authConfigured = Boolean(
  process.env.AUTH_SECRET && process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD,
);

/** Length-aware, non-short-circuiting string comparison. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function verifyCredentials(username: string, password: string): boolean {
  const u = process.env.ADMIN_USERNAME || '';
  const p = process.env.ADMIN_PASSWORD || '';
  if (!u || !p) return false;
  // Evaluate both to avoid leaking which field was wrong via timing.
  const okU = safeEqual(username, u);
  const okP = safeEqual(password, p);
  return okU && okP;
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
