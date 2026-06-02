'use client';

import type { ReactNode } from 'react';
import { UIProvider } from './ui-context';

export function Providers({ children }: { children: ReactNode }) {
  return <UIProvider>{children}</UIProvider>;
}

export { useUI } from './ui-context';
