import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Mail } from 'lucide-react';
import { prisma, hasDb } from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Unsubscribe',
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const { c } = await searchParams;
  let ok = false;
  if (hasDb && typeof c === 'string' && /^[a-f0-9]{24}$/i.test(c)) {
    try {
      await prisma.customer.update({ where: { id: c }, data: { emailOptOut: true } });
      ok = true;
    } catch {
      ok = false;
    }
  }

  return (
    <div className="grid min-h-[60vh] place-items-center bg-brand-black px-4 py-20 md:py-28">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-brand-red/10 text-brand-red">
          {ok ? <CheckCircle2 className="h-6 w-6" /> : <Mail className="h-6 w-6" />}
        </div>
        <h1 className="display-heading text-3xl text-white md:text-4xl">
          {ok ? 'You’ve been unsubscribed.' : 'Unsubscribe'}
        </h1>
        <p className="mt-4 leading-relaxed text-white/60">
          {ok
            ? "You won't receive any more promotional emails from us. You'll still get important updates about any active application."
            : "We couldn't process this request. The link may be invalid or expired — please contact us and we'll remove you right away."}
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
