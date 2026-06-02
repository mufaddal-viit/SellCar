'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Pencil, Trash2, Star, Eye, EyeOff } from 'lucide-react';
import {
  setStatus,
  toggleFeatured,
  togglePublished,
  deleteCar,
} from '@/actions/cars';
import { formatPrice, formatEMI } from '@/lib/utils';
import type { AdminCar } from '@/server/cars';
import type { CarStatus } from '@/types';

const STATUSES: CarStatus[] = ['available', 'reserved', 'sold'];

export function CarsTable({ cars }: { cars: AdminCar[] }) {
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
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-left text-[11px] uppercase tracking-widest text-white/40">
            <th className="p-4 font-semibold">Car</th>
            <th className="p-4 font-semibold">Price / EMI</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold">Featured</th>
            <th className="p-4 font-semibold">Live</th>
            <th className="p-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {cars.map((car) => {
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
                  <select
                    value={car.status ?? 'available'}
                    disabled={busy}
                    onChange={(e) =>
                      run(car.id, () => setStatus(car.id, e.target.value as CarStatus))
                    }
                    className="rounded-lg border border-white/10 bg-brand-black px-2 py-1.5 text-xs capitalize text-white focus:border-brand-red focus:outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
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
