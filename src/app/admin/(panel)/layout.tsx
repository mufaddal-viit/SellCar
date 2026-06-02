import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth-guard';
import { Sidebar } from '@/components/admin/sidebar';

export const dynamic = 'force-dynamic';

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already gates this, but double-check (defense in depth).
  if (!(await isAdmin())) redirect('/admin/login');

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 px-5 py-6 md:px-8 md:py-10">{children}</main>
    </div>
  );
}
