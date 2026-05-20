'use client';

import { createContext, useContext, type ReactNode } from 'react';

interface AdminContextValue {
  authenticated: boolean;
}

const AdminContext = createContext<AdminContextValue>({
  authenticated: false,
});

export function AdminProvider({ children }: { children: ReactNode }) {
  return (
    <AdminContext.Provider value={{ authenticated: false }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
