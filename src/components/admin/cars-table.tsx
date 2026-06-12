'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import {
  Pencil,
  Trash2,
  Star,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react';
import {
  setStatus,
  toggleFeatured,
  togglePublished,
  deleteCar,
} from '@/actions/cars';
import { formatPrice, formatEMI } from '@/lib/utils';
import { SelectField } from '@/components/ui/select-field';
import type { AdminCar } from '@/server/cars';
import type { CarStatus } from '@/types';

const STATUSES: CarStatus[] = ['available', 'reserved', 'sold'];

/** "12 Jun 2026" — short, locale-stable date for the table. */
function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

type SortDir = 'asc' | 'desc' | null;

export function CarsTable({ cars }: { cars: AdminCar[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  // null → server order (newest first); click cycles desc → asc → desc.
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const toggleSort = () =>
    setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));

  const sortedCars = useMemo(() => {
    if (!sortDir) return cars;
    const ts = (c: AdminCar) => {
      const t = new Date(c.createdAt).getTime();
      return Number.isNaN(t) ? 0 : t; // undated (seed) rows sink to the bottom on desc
    };
    return [...cars].sort((a, b) =>
      sortDir === 'asc' ? ts(a) - ts(b) : ts(b) - ts(a),
    );
  }, [cars, sortDir]);

  const run = (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id);
    startTransition(async () => {
      await fn();
      router.refresh();
      setBusyId(null);
    });
  };

  if (cars.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-brand-black-soft py-20 text-center">
        <p className="text-white/55">No cars yet.</p>
        <Link href="/admin/cars/new" className="mt-3 inline-block text-sm font-medium text-brand-red">
          Add your first car →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
      <table className="w-full min-w-[940px] text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-left text-[11px] uppercase tracking-widest text-white/40">
            <th className="p-4 font-semibold">Car</th>
            <th className="p-4 font-semibold">Price / EMI</th>
            <th className="p-0 font-semibold">
              <button
                type="button"
                onClick={toggleSort}
                aria-label="Sort by date created"
                title="Sort by date created"
                className="flex w-full items-center gap-1.5 p-4 uppercase tracking-widest transition-colors hover:text-white"
              >
                Created
                {sortDir === 'asc' ? (
                  <ChevronUp className="h-3.5 w-3.5 text-brand-red" />
                ) : sortDir === 'desc' ? (
                  <ChevronDown className="h-3.5 w-3.5 text-brand-red" />
                ) : (
                  <ChevronsUpDown className="h-3.5 w-3.5 text-white/30" />
                )}
              </button>
            </th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold">Featured</th>
            <th className="p-4 font-semibold">Live</th>
            <th className="p-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {sortedCars.map((car) => {
            const busy = pending && busyId === car.id;
            return (
              <tr key={car.id} className={busy ? 'opacity-50' : undefined}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-brand-black-elevated">
                      {car.images[0] && (
                        <Image src={car.images[0]} alt="" fill sizes="64px" className="object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">{car.name}</div>
                      <div className="text-xs text-white/40">
                        {car.brand} · {car.year} · {car.category}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-white">{formatPrice(car.price)}</div>
                  <div className="text-xs text-white/40">{formatEMI(car.emiFrom)}/mo</div>
                </td>
                <td className="p-4">
                  <div className="whitespace-nowrap text-white/70">{formatDate(car.createdAt)}</div>
                </td>
                <td className="p-4">
                  <SelectField
                    value={car.status ?? 'available'}
                    disabled={busy}
                    onValueChange={(v) => run(car.id, () => setStatus(car.id, v as CarStatus))}
                    options={STATUSES}
                    className="h-8 px-2 text-xs capitalize"
                  />
                </td>
                <td className="p-4">
                  <button
                    type="button"
                    disabled={busy}
                    aria-label="Toggle featured"
                    onClick={() => run(car.id, () => toggleFeatured(car.id, !car.featured))}
                    className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors ${
                      car.featured
                        ? 'border-brand-red/40 bg-brand-red/15 text-brand-red'
                        : 'border-white/10 text-white/40 hover:text-white'
                    }`}
                  >
                    <Star className="h-4 w-4" fill={car.featured ? 'currentColor' : 'none'} />
                  </button>
                </td>
                <td className="p-4">
                  <button
                    type="button"
                    disabled={busy}
                    aria-label="Toggle published"
                    onClick={() => run(car.id, () => togglePublished(car.id, !car.published))}
                    className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors ${
                      car.published !== false
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-white/10 text-white/40 hover:text-white'
                    }`}
                  >
                    {car.published !== false ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/cars/${car.id}/edit`}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/70 transition-colors hover:text-white"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      disabled={busy}
                      aria-label="Delete"
                      onClick={() => {
                        if (confirm(`Delete "${car.name}"? This also removes its media.`)) {
                          run(car.id, () => deleteCar(car.id));
                        }
                      }}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/70 transition-colors hover:border-red-500/40 hover:text-red-400"
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
  );
}
