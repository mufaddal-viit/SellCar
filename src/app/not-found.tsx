import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] grid place-items-center bg-brand-black px-4">
      <div className="text-center max-w-md">
        <div className="display-heading text-[10rem] md:text-[14rem] leading-none font-bold text-brand-red opacity-90">
          404
        </div>
        <h1 className="display-heading text-3xl md:text-4xl text-white mt-4">
          Wrong turn,{' '}
          <span className="italic text-brand-red">friend.</span>
        </h1>
        <p className="mt-4 text-white/60">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on the road.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/cars">
              <ArrowLeft className="w-4 h-4" />
              Browse Cars
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
