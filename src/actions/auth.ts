'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  authConfigured,
  verifyCredentials,
  createSessionToken,
} from '@/lib/auth';

export interface LoginState {
  error?: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!authConfigured) {
    return { error: 'Admin login is not configured (set ADMIN_USERNAME, ADMIN_PASSWORD and AUTH_SECRET).' };
  }

  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!verifyCredentials(username, password)) {
    return { error: 'Invalid username or password.' };
  }

  const token = await createSessionToken();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  redirect('/admin');
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect('/admin/login');
}
