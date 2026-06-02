'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  authConfigured,
  createSessionToken,
  verifyCredentials,
} from '@/lib/auth';

export interface LoginState {
  error?: string;
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!authConfigured) {
    return {
      error:
        'Admin login is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD and AUTH_SECRET in your environment.',
    };
  }

  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');

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
