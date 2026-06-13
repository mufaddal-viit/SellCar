'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { Eye, Trash2, FileText } from 'lucide-react';
import { deleteApplication } from '@/actions/applications';
import { CopyPhone } from '@/components/admin/copy-phone';
import {
  DateCell,
  SortHeader,
  StatusCounts,
  type SortDir,
} from '@/components/admin/table-bits';
import { toTimestamp } from '@/lib/utils';
import type { AdminApplication } from '@/server/applications';

const statusStyle: Record<string, string> = {
  submitted: 'border-brand-red/40 bg-brand-red/15 text-brand-red',
  in_review: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  approved: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  rejected: 'border-white/10 bg-white/5 text-white/50',
};

export function ApplicationsTable({ apps }: { apps: AdminApplication[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  // Date sort: null = server order (newest first); click cycles desc → asc.
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const toggleSort = () => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));

  const sorted = useMemo(() => {
    if (!sortDir) return apps;
    return [...apps].sort((a, b) =>
      sortDir === 'asc'
        ? toTimestamp(a.createdAt) - toTimestamp(b.createdAt)
        : toTimestamp(b.createdAt) - toTimestamp(a.createdAt),
    );
  }, [apps, sortDir]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const a of apps) c[a.status] = (c[a.status] ?? 0) + 1;
    return c;
  }, [apps]);

  const run = (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id);
    startTransition(async () => {
      await fn();
      router.refresh();
      setBusyId(null);
    });
  };

  if (apps.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-brand-black-soft py-20 text-center">
        <p className="text-white/55">No applications yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <StatusCounts
        counts={counts}
        labels={{ in_review: 'In review' }}
      />
      <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-left text-[11px] uppercase tracking-widest text-white/40">
            <th className="p-4 font-semibold">Applicant</th>
            <th className="p-4 font-semibold">Car</th>
            <th className="p-4 font-semibold">Docs</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold">
              <SortHeader label="Date" dir={sortDir} onToggle={toggleSort} />
            </th>
            <th className="p-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {sorted.map((a) => {
            const busy = pending && busyId === a.id;
            return (
              <tr key={a.id} className={busy ? 'opacity-50' : undefined}>
                <td className="p-4">
                  <div className="font-medium text-white">{a.name}</div>
                  <div className="text-xs text-white/40">{a.email}</div>
                  <CopyPhone phone={a.mobile} className="text-xs text-white/40" />
                </td>
                <td className="p-4 text-white/80">{a.carName || '—'}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 text-white/60">
                    <FileText className="h-3.5 w-3.5" />
                    {a.documents.length}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusStyle[a.status] ?? 'border-white/10 text-white/60'}`}
                  >
                    {a.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-xs">
                  <DateCell iso={a.createdAt} />
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/applications/${a.slug ?? a.id}`}
                      aria-label="View"
                      className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/70 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      disabled={busy}
                      aria-label="Delete"
                      onClick={() => {
                        if (confirm(`Delete ${a.name}'s application and its documents?`)) {
                          run(a.id, () => deleteApplication(a.id));
                        }
                      }}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/70 hover:border-red-500/40 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}
