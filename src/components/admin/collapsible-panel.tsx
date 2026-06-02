'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsiblePanel({ title, subtitle, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-brand-black-soft">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
      >
        <span className="font-display text-lg font-bold text-white">{title}</span>
        <span className="flex items-center gap-3">
          {subtitle && <span className="text-xs text-white/40">{subtitle}</span>}
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-white/50 transition-transform duration-300 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
