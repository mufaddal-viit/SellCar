'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Segment-level error boundary. Catches errors thrown while rendering a route's
 * page/children and shows a recoverable fallback inside the normal layout
 * (header + footer stay intact) instead of crashing to a blank screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('Page error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] grid place-items-center bg-brand-black px-4">
      <div className="text-center max-w-md">
        <div className="display-heading text-[8rem] md:text-[11rem] leading-none font-bold text-brand-red opacity-90">
          !
        </div>
        <h1 className="display-heading text-3xl md:text-4xl text-white mt-4">
          Something{' '}
          <span className="italic text-brand-red">broke.</span>
        </h1>
        <p className="mt-4 text-white/60">
          We hit an unexpected error loading this page. You can try again or head
          back to safer ground.
        </p>
        {error?.digest && (
          <p className="mt-2 text-xs text-white/30">Reference: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => reset()}>
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
