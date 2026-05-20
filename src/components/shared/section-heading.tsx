import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'text-center mx-auto',
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            'inline-flex items-center gap-2 mb-5',
            align === 'center' && 'justify-center',
          )}
        >
          <span className="h-px w-8 bg-brand-red" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="display-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white">
        {title}{' '}
        {highlight && (
          <span className="italic font-display text-brand-red">
            {highlight}
          </span>
        )}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-5 text-base md:text-lg text-white/60 leading-relaxed',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
