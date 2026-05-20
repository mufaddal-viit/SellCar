import Link from 'next/link';
import { siteConfig } from '@/content/site';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { wrap: 'gap-2', mark: 'w-7 h-7', text: 'text-base' },
    md: { wrap: 'gap-2.5', mark: 'w-9 h-9', text: 'text-lg' },
    lg: { wrap: 'gap-3', mark: 'w-11 h-11', text: 'text-2xl' },
  }[size];

  return (
    <Link
      href="/"
      aria-label={siteConfig.name}
      className={cn(
        'flex items-center group',
        sizes.wrap,
        className,
      )}
    >
      <span
        className={cn(
          'relative grid place-items-center rounded-lg bg-brand-red text-white font-bold transition-transform group-hover:rotate-3',
          sizes.mark,
        )}
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-1/2 h-1/2"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 17h14M7 17v-5l2-4h6l2 4v5M9 17v2M15 17v2" />
          <circle cx="8" cy="14" r="1" />
          <circle cx="16" cy="14" r="1" />
        </svg>
      </span>
      <span
        className={cn(
          'font-display font-bold tracking-tight text-white leading-none',
          sizes.text,
        )}
      >
        {siteConfig.name.split(' ')[0]}
        <span className="text-brand-red">.</span>
      </span>
    </Link>
  );
}
