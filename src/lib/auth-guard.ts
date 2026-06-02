import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from './auth';

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function assertAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error('Unauthorized');
}
