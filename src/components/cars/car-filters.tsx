'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterProps {
  categories: string[];
  fuels: string[];
  brands: string[];
  active: {
    category: string;
    fuel: string;
    brand: string;
    sort: string;
  };
  onChange: (next: Partial<FilterProps['active']>) => void;
  onReset: () => void;
}

const sorts = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'emi-asc', label: 'EMI: Low to High' },
];

export function CarFilters({
  categories,
  fuels,
  brands,
  active,
  onChange,
  onReset,
}: FilterProps) {
  const hasActive =
    active.category !== 'all' ||
    active.fuel !== 'all' ||
    active.brand !== 'all';

  return (
    <div className="bg-brand-black-soft border border-white/[0.06] p-6 md:p-8 space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-white">
          Filters
        </h3>
        {hasActive && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-white/50 hover:text-brand-red flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      <FilterGroup
        label="Category"
        options={['all', ...categories]}
        active={active.category}
        onSelect={(v) => onChange({ category: v })}
      />
      <FilterGroup
        label="Fuel Type"
        options={['all', ...fuels]}
        active={active.fuel}
        onSelect={(v) => onChange({ fuel: v })}
      />
      <FilterGroup
        label="Brand"
        options={['all', ...brands]}
        active={active.brand}
        onSelect={(v) => onChange({ brand: v })}
      />

      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
          Sort by
        </div>
        <div className="space-y-2">
          {sorts.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => onChange({ sort: s.key })}
              className={cn(
                'block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors',
                active.sort === s.key
                  ? 'bg-brand-red text-white'
                  : 'text-white/70 hover:bg-white/5',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  active,
  onSelect,
}: {
  label: string;
  options: string[];
  active: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-full border transition-all',
              active === opt
                ? 'bg-brand-red text-white border-brand-red'
                : 'bg-transparent text-white/70 border-white/10 hover:border-white/30 hover:text-white',
            )}
          >
            {opt === 'all' ? `All ${label}` : opt}
          </button>
        ))}
      </div>
    </div>
  );
}
