import { listLeads } from '@/server/leads';
import { hasDb } from '@/lib/db/prisma';
import { LeadsTable } from '@/components/admin/leads-table';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const leads = await listLeads();
  const newCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="display-heading text-3xl text-white">Leads</h1>
        <p className="mt-1 text-sm text-white/50">
          {leads.length} leads · {newCount} new
        </p>
      </div>

      {!hasDb && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          No database configured — enquiries are not being stored. Set <code>MONGODB_URI</code> to enable the inbox.
        </div>
      )}

      <LeadsTable leads={leads} />
    </div>
  );
}
