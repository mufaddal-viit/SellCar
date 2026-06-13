'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Send, Loader2, Mail, X } from 'lucide-react';
import {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  sendPromo,
} from '@/actions/customers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { CopyPhone } from '@/components/admin/copy-phone';
import {
  DateCell,
  SortHeader,
  StatusCounts,
  type SortDir,
} from '@/components/admin/table-bits';
import { toTimestamp } from '@/lib/utils';
import type { AdminCustomer } from '@/server/customers';

const STATUS_OPTIONS = [
  { value: 'lead', label: 'Lead' },
  { value: 'active', label: 'Active' },
  { value: 'customer', label: 'Customer' },
  { value: 'closed', label: 'Closed' },
  { value: 'no_deal', label: 'No deal' },
  { value: 'other', label: 'Other' },
];

const TEMPLATE_OPTIONS = [
  { value: 'new_arrivals', label: 'New Arrivals' },
  { value: 'special_offer', label: 'Special Finance Offer' },
  { value: 'follow_up', label: 'Follow-up / Still Looking?' },
];

const statusStyle: Record<string, string> = {
  lead: 'border-brand-red/40 bg-brand-red/15 text-brand-red',
  active: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  customer: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  closed: 'border-white/10 bg-white/5 text-white/50',
  no_deal: 'border-white/10 bg-white/5 text-white/50',
  other: 'border-white/10 bg-white/5 text-white/60',
};

export function CustomersTable({ customers }: { customers: AdminCustomer[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [template, setTemplate] = useState('new_arrivals');
  const [sendMsg, setSendMsg] = useState<string | null>(null);
  const [sendingPromo, setSendingPromo] = useState(false);

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [nf, setNf] = useState({ name: '', email: '', phone: '', status: 'lead' });
  const [addErr, setAddErr] = useState<string | null>(null);

  // Sort by "added" or "last contacted"; null = default (server order).
  const [sortKey, setSortKey] = useState<'created' | 'contacted'>('created');
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const toggleSort = (key: 'created' | 'contacted') =>
    setSortDir((d) => {
      if (sortKey !== key) {
        setSortKey(key);
        return 'desc';
      }
      return d === 'desc' ? 'asc' : 'desc';
    });

  const rows = useMemo(() => {
    const base =
      filter === 'all'
        ? customers
        : filter === 'future_interest'
          ? customers.filter((c) => c.futureInterest)
          : customers.filter((c) => c.status === filter);
    if (!sortDir) return base;
    const pick = (c: AdminCustomer) =>
      sortKey === 'contacted' ? c.lastContactedAt : c.createdAt;
    return [...base].sort((a, b) =>
      sortDir === 'asc'
        ? toTimestamp(pick(a)) - toTimestamp(pick(b))
        : toTimestamp(pick(b)) - toTimestamp(pick(a)),
    );
  }, [customers, filter, sortKey, sortDir]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const cust of customers) c[cust.status] = (c[cust.status] ?? 0) + 1;
    return c;
  }, [customers]);

  const futureInterestCount = useMemo(
    () => customers.filter((c) => c.futureInterest).length,
    [customers],
  );

  const run = (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id);
    startTransition(async () => {
      await fn();
      router.refresh();
      setBusyId(null);
    });
  };

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const allShownSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const toggleAll = () =>
    setSelected((s) => {
      const n = new Set(s);
      if (allShownSelected) rows.forEach((r) => n.delete(r.id));
      else rows.forEach((r) => n.add(r.id));
      return n;
    });

  const addCustomer = () => {
    setAddErr(null);
    startTransition(async () => {
      const res = await createCustomer(nf);
      if (res?.error) setAddErr(res.error);
      else {
        setNf({ name: '', email: '', phone: '', status: 'lead' });
        setShowAdd(false);
        router.refresh();
      }
    });
  };

  const send = () => {
    setSendMsg(null);
    setSendingPromo(true);
    startTransition(async () => {
      const res = await sendPromo([...selected], template);
      setSendingPromo(false);
      if (res?.error) setSendMsg(res.error);
      else {
        setSendMsg(`Sent ${res.sent}, skipped ${res.skipped} (no email/opted-out), failed ${res.failed}.`);
        setSelected(new Set());
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <SelectField
          value={filter}
          onValueChange={setFilter}
          options={[
            { value: 'all', label: 'All statuses' },
            {
              value: 'future_interest',
              label: `★ Awaiting their car${futureInterestCount ? ` (${futureInterestCount})` : ''}`,
            },
            ...STATUS_OPTIONS,
          ]}
          className="h-10 w-56 capitalize"
        />
        <span className="text-sm text-white/45">{rows.length} shown</span>
        <StatusCounts counts={counts} labels={{ no_deal: 'No deal' }} />
        <div className="ml-auto flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setShowAdd((v) => !v)}>
            <Plus className="h-4 w-4" />
            Add customer
          </Button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-xl border border-white/[0.08] bg-brand-black-soft p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <Input placeholder="Name *" value={nf.name} onChange={(e) => setNf({ ...nf, name: e.target.value })} />
            <Input placeholder="Email" value={nf.email} onChange={(e) => setNf({ ...nf, email: e.target.value })} />
            <Input placeholder="Phone" value={nf.phone} onChange={(e) => setNf({ ...nf, phone: e.target.value })} />
            <SelectField value={nf.status} onValueChange={(v) => setNf({ ...nf, status: v })} options={STATUS_OPTIONS} className="capitalize" />
          </div>
          {addErr && <p className="mt-2 text-xs text-red-400">{addErr}</p>}
          <div className="mt-3 flex gap-2">
            <Button type="button" size="sm" onClick={addCustomer} disabled={pending}>Save</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Bulk email bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-brand-red/30 bg-brand-red/[0.06] p-3">
          <span className="text-sm font-medium text-white">{selected.size} selected</span>
          <SelectField
            value={template}
            onValueChange={setTemplate}
            options={TEMPLATE_OPTIONS}
            className="h-9 w-56"
          />
          <Button type="button" size="sm" onClick={send} disabled={sendingPromo}>
            {sendingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send email
          </Button>
          <button type="button" onClick={() => setSelected(new Set())} className="text-white/50 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {sendMsg && <p className="text-sm text-emerald-400">{sendMsg}</p>}

      {/* Table */}
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.07] bg-brand-black-soft py-16 text-center text-white/55">
          No customers yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-[11px] uppercase tracking-widest text-white/40">
                <th className="p-4">
                  <input type="checkbox" checked={allShownSelected} onChange={toggleAll} className="accent-brand-red" />
                </th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Interest</th>
                <th className="p-4 font-semibold">Source</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">
                  <SortHeader
                    label="Added"
                    dir={sortKey === 'created' ? sortDir : null}
                    onToggle={() => toggleSort('created')}
                  />
                </th>
                <th className="p-4 font-semibold">
                  <SortHeader
                    label="Last contacted"
                    dir={sortKey === 'contacted' ? sortDir : null}
                    onToggle={() => toggleSort('contacted')}
                  />
                </th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {rows.map((c) => {
                const busy = pending && busyId === c.id;
                return (
                  <tr key={c.id} className={busy ? 'opacity-50' : undefined}>
                    <td className="p-4">
                      <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="accent-brand-red" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{c.name}</span>
                        {c.futureInterest && (
                          <span
                            title="Opted in to be notified when their car arrives"
                            className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-300"
                          >
                            ★ Awaiting car
                          </span>
                        )}
                      </div>
                      {c.email && (
                        <div className="text-xs text-white/45">
                          {c.email}
                          {c.emailOptOut && <span className="ml-1 text-red-400">(opted out)</span>}
                        </div>
                      )}
                      {c.phone && <CopyPhone phone={c.phone} className="text-xs text-white/45" />}
                    </td>
                    <td className="p-4 text-white/70">{c.carInterest || '—'}</td>
                    <td className="p-4 text-xs capitalize text-white/45">{c.source || '—'}</td>
                    <td className="p-4">
                      <SelectField
                        value={c.status}
                        disabled={busy}
                        onValueChange={(v) => run(c.id, () => updateCustomer(c.id, { status: v }))}
                        options={STATUS_OPTIONS}
                        className={`h-8 px-2 text-xs capitalize ${statusStyle[c.status] ?? ''}`}
                      />
                    </td>
                    <td className="p-4 text-xs">
                      <DateCell iso={c.createdAt} />
                    </td>
                    <td className="p-4 text-xs">
                      {c.lastContactedAt ? (
                        <DateCell iso={c.lastContactedAt} />
                      ) : (
                        <span className="text-white/30">Never</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {c.email && !c.emailOptOut && (
                          <button
                            type="button"
                            title="Email this customer"
                            onClick={() => {
                              setSelected(new Set([c.id]));
                            }}
                            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/70 hover:text-white"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={busy}
                          title="Delete"
                          onClick={() => {
                            if (confirm(`Delete ${c.name}?`)) run(c.id, () => deleteCustomer(c.id));
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
      )}
    </div>
  );
}
