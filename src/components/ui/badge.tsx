import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-brand-red text-white',
        outline: 'border border-white/20 text-white/80',
        muted: 'bg-white/10 text-white',
        success: 'bg-emerald-500/20 text-emerald-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
