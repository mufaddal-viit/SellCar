import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/content/site';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { wrap: 'gap-2', mark: 28, text: 'text-base' },
    md: { wrap: 'gap-2.5', mark: 34, text: 'text-lg' },
    lg: { wrap: 'gap-3', mark: 44, text: 'text-2xl' },
  }[size];

  // "Buy&Drive Cars" → first word in white, the rest in brand red.
  const [first, ...rest] = siteConfig.name.split(' ');

  return (
    <Link
      href="/"
      aria-label={siteConfig.name}
      className={cn('group flex items-center', sizes.wrap, className)}
    >
      <Image
        src="/logo-mark.png"
        alt=""
        width={sizes.mark}
        height={sizes.mark}
        priority
        aria-hidden
        className="shrink-0 transition-transform group-hover:rotate-3"
      />
      <span
        className={cn(
          'font-display font-bold leading-none tracking-tight text-white',
          sizes.text,
        )}
      >
        {first}
        {rest.length > 0 && (
          <span className="text-brand-red"> {rest.join(' ')}</span>
        )}
      </span>
    </Link>
  );
}
