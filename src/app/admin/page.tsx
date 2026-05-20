import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="min-h-screen grid place-items-center px-4 bg-brand-black">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, #E10600 0%, transparent 60%)',
        }}
      />
      <div className="relative w-full max-w-lg text-center">
        <div className="flex justify-center mb-10">
          <Logo size="lg" />
        </div>
        <div className="bg-brand-black-soft border border-white/[0.06] p-10 md:p-14">
          <div className="grid place-items-center w-14 h-14 mx-auto rounded-full bg-brand-red/10 text-brand-red mb-6">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="display-heading text-3xl md:text-4xl text-white">
            Admin Panel
          </h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
            Coming Soon
          </p>
          <p className="mt-6 text-white/60 leading-relaxed">
            This area is reserved for future functionality — image management,
            content editing, lead inbox and analytics dashboards will live
            here.
          </p>
          <div className="mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
                Back to Site
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
