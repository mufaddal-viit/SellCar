'use client';

import { LogOut } from 'lucide-react';
import { logout } from '@/actions/auth';

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </form>
  );
}
