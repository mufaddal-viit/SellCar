import { listCustomers } from '@/server/customers';
import { hasDb } from '@/lib/db/prisma';
import { CustomersTable } from '@/components/admin/customers-table';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const customers = await listCustomers();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="display-heading text-3xl text-white">Customers</h1>
        <p className="mt-1 text-sm text-white/50">
          {customers.length} in your database · leads, applicants, closed and more
        </p>
      </div>

      {!hasDb && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          No database configured — the customer database is unavailable.
        </div>
      )}

      <CustomersTable customers={customers} />
    </div>
  );
}
