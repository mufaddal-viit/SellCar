'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { Trash2, Mail, MessageCircle, Phone, FileText, UserPlus, Check } from 'lucide-react';
import { updateLeadStatus, deleteLead, convertLeadToCustomer } from '@/actions/leads';
import { SelectField } from '@/components/ui/select-field';
import { CopyPhone } from '@/components/admin/copy-phone';
import { StatusCounts } from '@/components/admin/table-bits';
import { Button } from '@/components/ui/button';
import { formatDate, relativeTime, toTimestamp } from '@/lib/utils';
import type { Lead, LeadStatus } from '@/types';

const PAGE = 10;
const STATUSES: LeadStatus[] = ['new', 'contacted', 'closed'];

const TYPE_FILTERS = [
  { value: 'all', label: 'All leads' },
  { value: 'enquiry', label: 'Enquiries' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'call', label: 'Calls' },
];

const TYPE_META: Record<string, { label: string; cls: string; Icon: typeof Mail }> = {
  enquiry: { label: 'Enquiry', cls: 'border-brand-red/30 bg-brand-red/10 text-brand-red', Icon: FileText },
  whatsapp: { label: 'WhatsApp', cls: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300', Icon: MessageCircle },
  call: { label: 'Call', cls: 'border-sky-500/30 bg-sky-500/10 text-sky-300', Icon: Phone },
};

const statusStyle: Record<LeadStatus, string> = {
  new: 'border-brand-red/40 bg-brand-red/15 text-brand-red',
  contacted: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  closed: 'border-white/10 bg-white/5 text-white/50',
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [visible, setVisible] = useState(PAGE);
  const [convertMsg, setConvertMsg] = useState<Record<string, string>>({});
  const [convertErr, setConvertErr] = useState<Record<string, string>>({});

  useEffect(() => setVisible(PAGE), [filter, sort]);

  const filtered = useMemo(() => {
    const base =
      filter === 'all' ? leads : leads.filter((l) => l.type === filter);
    return [...base].sort((a, b) =>
      sort === 'oldest'
        ? toTimestamp(a.createdAt) - toTimestamp(b.createdAt)
        : toTimestamp(b.createdAt) - toTimestamp(a.createdAt),
    );
  }, [leads, filter, sort]);
  const shown = filtered.slice(0, visible);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const l of leads) c[l.status] = (c[l.status] ?? 0) + 1;
    return c;
  }, [leads]);

  const run = (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id);
    startTransition(async () => {
      await fn();
      router.refresh();
      setBusyId(null);
    });
  };

  const convert = (id: string) => {
    setBusyId(id);
    setConvertErr((m) => ({ ...m, [id]: '' }));
    startTransition(async () => {
      const res = await convertLeadToCustomer(id);
      if (res?.error) setConvertErr((m) => ({ ...m, [id]: res.error! }));
      else {
        setConvertMsg((m) => ({
          ...m,
          [id]: res?.created ? 'Added to customers' : 'Marked as customer',
        }));
        router.refresh();
      }
      setBusyId(null);
    });
  };

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex flex-wrap items-center gap-3">
        <SelectField
          value={filter}
          onValueChange={setFilter}
          options={TYPE_FILTERS}
          className="h-10 w-44"
        />
        <SelectField
          value={sort}
          onValueChange={(v) => setSort(v as 'newest' | 'oldest')}
          options={[
            { value: 'newest', label: 'Newest first' },
            { value: 'oldest', label: 'Oldest first' },
          ]}
          className="h-10 w-40"
        />
        <span className="text-sm text-white/45">
          {filtered.length} {filter === 'all' ? 'total' : TYPE_FILTERS.find((t) => t.value === filter)?.label.toLowerCase()}
        </span>
        <StatusCounts counts={counts} />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-brand-black-soft py-20 text-center">
          <p className="text-white/55">No leads to show.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((lead) => {
            const busy = pending && busyId === lead.id;
            const status = lead.status as LeadStatus;
            const meta = TYPE_META[lead.type] ?? TYPE_META.enquiry;
            const cleanPhone = lead.phone?.replace(/[^0-9]/g, '');
            const hasContact = lead.phone || lead.email;
            return (
              <div
                key={lead.id}
                className={`rounded-2xl border border-white/[0.07] bg-brand-black-soft p-5 ${busy ? 'opacity-50' : ''}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-white">
                        {lead.name || `${meta.label} lead`}
                      </h3>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.cls}`}>
                        <meta.Icon className="h-3 w-3" />
                        {meta.label}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusStyle[status]}`}>
                        {status}
                      </span>
                    </div>
                    {lead.carName && (
                      <p className="mt-0.5 text-xs text-white/45">
                        {lead.type === 'enquiry' ? 'Interested in: ' : 'Car: '}
                        {lead.carName}
                      </p>
                    )}
                  </div>
                  <span className="text-right text-xs text-white/40">
                    <span className="block">{formatDate(lead.createdAt)}</span>
                    {relativeTime(lead.createdAt) && (
                      <span className="block text-[11px] text-white/30">
                        {relativeTime(lead.createdAt)}
                      </span>
                    )}
                  </span>
                </div>

                {hasContact && (
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    {lead.phone && <CopyPhone phone={lead.phone} className="text-white/75" />}
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}`}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-1.5 text-white/75 hover:text-white"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                        WhatsApp
                      </a>
                    )}
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 text-white/75 hover:text-white">
                        <Mail className="h-3.5 w-3.5 text-brand-red" />
                        {lead.email}
                      </a>
                    )}
                  </div>
                )}

                {lead.message && (
                  <p className="mt-3 rounded-lg bg-white/[0.03] p-3 text-sm text-white/70">{lead.message}</p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <SelectField
                    value={status}
                    disabled={busy}
                    onValueChange={(v) => run(lead.id, () => updateLeadStatus(lead.id, v as LeadStatus))}
                    options={STATUSES}
                    className="h-9 px-3 text-xs capitalize"
                  />
                  <div className="flex items-center gap-4">
                    {hasContact &&
                      (convertMsg[lead.id] ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                          <Check className="h-3.5 w-3.5" />
                          {convertMsg[lead.id]}
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => convert(lead.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-brand-red disabled:opacity-50"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          Convert to customer
                        </button>
                      ))}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        if (confirm('Delete this lead?')) run(lead.id, () => deleteLead(lead.id));
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
                {convertErr[lead.id] && (
                  <p className="mt-2 text-right text-xs text-red-400">{convertErr[lead.id]}</p>
                )}
              </div>
            );
          })}

          {visible < filtered.length && (
            <div className="pt-2 text-center">
              <Button type="button" variant="outline" onClick={() => setVisible((v) => v + PAGE)}>
                Load more ({filtered.length - visible} left)
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
