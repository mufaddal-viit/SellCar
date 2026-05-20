'use client';

import type { ReactNode } from 'react';
import { UIProvider } from './ui-context';
import { AdminProvider } from './admin-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <AdminProvider>{children}</AdminProvider>
    </UIProvider>
  );
}

export { useUI } from './ui-context';
export { useAdmin } from './admin-context';
