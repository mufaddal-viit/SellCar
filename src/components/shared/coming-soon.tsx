import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ComingSoon({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-brand-black px-4">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-brand-red/10 text-brand-red">
          <Clock className="h-6 w-6" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
          {eyebrow}
        </p>
        <h1 className="display-heading mt-4 text-4xl text-white md:text-5xl">
          {title} <span className="italic text-brand-red">Coming soon.</span>
        </h1>
        <p className="mt-5 leading-relaxed text-white/60">{description}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/cars">Browse cars</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
