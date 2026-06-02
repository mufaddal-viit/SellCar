import type { LucideIcon } from 'lucide-react';

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent
          ? 'border-brand-red/30 bg-brand-red/10'
          : 'border-white/[0.07] bg-brand-black-soft'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/45">
          {label}
        </span>
        {Icon && <Icon className="h-4 w-4 text-brand-red" />}
      </div>
      <div className="mt-2 font-display text-2xl font-bold text-white">{value}</div>
      {hint && <div className="mt-1 text-xs text-white/45">{hint}</div>}
    </div>
  );
}
