'use client';

import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { formatDate, relativeTime } from '@/lib/utils';

export type SortDir = 'asc' | 'desc' | null;

/** A date cell showing the absolute date with a relative "3d ago" subline. */
export function DateCell({ iso }: { iso: string | null | undefined }) {
  const rel = relativeTime(iso);
  return (
    <div className="whitespace-nowrap">
      <div className="text-white/70">{formatDate(iso)}</div>
      {rel && <div className="text-[11px] text-white/35">{rel}</div>}
    </div>
  );
}

/** Clickable column header that cycles desc → asc and shows the direction. */
export function SortHeader({
  label,
  dir,
  onToggle,
  className,
}: {
  label: string;
  dir: SortDir;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Sort by ${label.toLowerCase()}`}
      title={`Sort by ${label.toLowerCase()}`}
      className={`flex items-center gap-1.5 uppercase tracking-widest transition-colors hover:text-white ${className ?? ''}`}
    >
      {label}
      {dir === 'asc' ? (
        <ChevronUp className="h-3.5 w-3.5 text-brand-red" />
      ) : dir === 'desc' ? (
        <ChevronDown className="h-3.5 w-3.5 text-brand-red" />
      ) : (
        <ChevronsUpDown className="h-3.5 w-3.5 text-white/30" />
      )}
    </button>
  );
}

/** Inline pipeline summary: "Submitted 4 · In review 2 · Approved 7". */
export function StatusCounts({
  counts,
  labels,
}: {
  counts: Record<string, number>;
  labels?: Record<string, string>;
}) {
  const entries = Object.entries(counts).filter(([, n]) => n > 0);
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50">
      {entries.map(([key, n], i) => (
        <span key={key} className="inline-flex items-center gap-1.5">
          {i > 0 && <span className="text-white/20">·</span>}
          <span className="capitalize text-white/70">
            {labels?.[key] ?? key.replace('_', ' ')}
          </span>
          <span className="rounded-full bg-white/10 px-1.5 py-0.5 font-semibold text-white">
            {n}
          </span>
        </span>
      ))}
    </div>
  );
}
