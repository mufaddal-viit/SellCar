import { listApplications } from '@/server/applications';
import { hasDb } from '@/lib/db/prisma';
import { ApplicationsTable } from '@/components/admin/applications-table';

export const dynamic = 'force-dynamic';

export default async function AdminApplicationsPage() {
  const apps = await listApplications();
  const newCount = apps.filter((a) => a.status === 'submitted').length;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="display-heading text-3xl text-white">Applications</h1>
        <p className="mt-1 text-sm text-white/50">
          {apps.length} total · {newCount} new
        </p>
      </div>

      {!hasDb && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          No database configured — applications are not being stored.
        </div>
      )}

      <ApplicationsTable apps={apps} />
    </div>
  );
}
