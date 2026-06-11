import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Requirement {
  title: string;
  note: string;
}

const requirements: Requirement[] = [
  { title: 'Salary of AED 5,000+', note: 'Only AED 4,000 if you bank with Emirates NBD' },
  { title: 'Emirates ID', note: 'Valid and ready — that\'s it' },
  { title: 'UAE residence visa', note: 'Stamped in your passport' },
  { title: 'Passport copy', note: 'Just the photo page — a phone snap works' },
  { title: 'Salary certificate', note: 'One quick request to your employer' },
  { title: 'Bank statement or IBAN', note: 'Last 3 months — or simply share your IBAN' },
];

export function Requirements() {
  return (
    <section id="eligibility" className="section scroll-mt-24 bg-brand-black">
      <div className="container-wide">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left — headline + CTA */}
          <div>
            <span className="inline-flex items-center gap-2">
              <span className="h-px w-8 bg-brand-red" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">
                Eligibility
              </span>
            </span>
            <h2 className="display-heading mt-5 text-4xl text-white md:text-5xl">
              Simple requirements.{' '}
              <span className="italic text-brand-red">Quick approval.</span>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/60">
              No paperwork mountains. Bring a few essentials and we handle the rest
              — most applications are approved within five to seven days.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/services">
                  Start your application
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 text-xs text-white/45">
              <span className="relative grid h-2 w-2 place-items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400/40" />
              </span>
              No impact on your credit score to check eligibility
            </div>
          </div>

          {/* Right — checklist card */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-brand-black-soft">
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                What you&apos;ll need
              </span>
              <span className="font-display text-sm italic text-brand-red">
                Six essentials
              </span>
            </div>

            {/* Rows */}
            <ul className="divide-y divide-white/[0.06]">
              {requirements.map((r, i) => (
                <li key={r.title} className="group flex items-center gap-4 px-6 py-4">
                  <span className="font-display text-sm font-bold tabular-nums text-white/25">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-base font-bold text-white">
                      {r.title}
                    </div>
                    <div className="text-xs text-white/45">{r.note}</div>
                  </div>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
