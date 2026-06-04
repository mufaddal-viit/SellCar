'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Trash2, Phone, Mail, MessageCircle } from 'lucide-react';
import { updateLeadStatus, deleteLead } from '@/actions/leads';
import { SelectField } from '@/components/ui/select-field';
import type { Lead, LeadStatus } from '@/types';

const STATUSES: LeadStatus[] = ['new', 'contacted', 'closed'];

const statusStyle: Record<LeadStatus, string> = {
  new: 'border-brand-red/40 bg-brand-red/15 text-brand-red',
  contacted: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  closed: 'border-white/10 bg-white/5 text-white/50',
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const run = (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id);
    startTransition(async () => {
      await fn();
      router.refresh();
      setBusyId(null);
    });
  };

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-brand-black-soft py-20 text-center">
        <p className="text-white/55">No enquiries yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => {
        const busy = pending && busyId === lead.id;
        const status = lead.status as LeadStatus;
        return (
          <div
            key={lead.id}
            className={`rounded-2xl border border-white/[0.07] bg-brand-black-soft p-5 ${busy ? 'opacity-50' : ''}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-white">{lead.name}</h3>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusStyle[status]}`}>
                    {status}
                  </span>
                </div>
                {lead.carName && (
                  <p className="mt-0.5 text-xs text-white/45">Interested in: {lead.carName}</p>
                )}
              </div>
              <span className="text-xs text-white/40">
                {new Date(lead.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              {lead.phone && (
                <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 text-white/75 hover:text-white">
                  <Phone className="h-3.5 w-3.5 text-brand-red" />
                  {lead.phone}
                </a>
              )}
              {lead.phone && (
                <a
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
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

            {lead.message && (
              <p className="mt-3 rounded-lg bg-white/[0.03] p-3 text-sm text-white/70">{lead.message}</p>
            )}

            <div className="mt-4 flex items-center justify-between gap-3">
              <SelectField
                value={status}
                disabled={busy}
                onValueChange={(v) => run(lead.id, () => updateLeadStatus(lead.id, v as LeadStatus))}
                options={STATUSES}
                className="h-9 px-3 text-xs capitalize"
              />
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  if (confirm('Delete this enquiry?')) run(lead.id, () => deleteLead(lead.id));
                }}
                className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
