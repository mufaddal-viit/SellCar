import Link from 'next/link';
import {
  Wallet,
  CreditCard,
  FileCheck,
  FileText,
  ReceiptText,
  Landmark,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Requirement {
  icon: LucideIcon;
  title: string;
  note?: string;
  highlight?: boolean;
}

const requirements: Requirement[] = [
  { icon: Wallet, title: 'Minimum AED 5,000 salary', note: 'Monthly, salary-transfer', highlight: true },
  { icon: CreditCard, title: 'Emirates ID' },
  { icon: FileCheck, title: 'Valid UAE Visa' },
  { icon: FileText, title: 'Passport copy' },
  { icon: ReceiptText, title: 'Salary certificate' },
  { icon: Landmark, title: 'Last 3 months bank statement', note: 'or your IBAN number' },
];

export function Requirements() {
  return (
    <section className="section bg-brand-black">
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
              No paperwork mountains. Bring a few essentials and we&apos;ll do the
              rest — most applications are approved within 5-7 days.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/services">
                  Start your application
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right — checklist card */}
          <div className="rounded-2xl border border-white/[0.07] bg-brand-black-soft p-2">
            <ul>
              {requirements.map((r, i) => {
                const Icon = r.icon;
                return (
                  <li
                    key={r.title}
                    className={`flex items-center gap-4 p-5 ${
                      i !== 0 ? 'border-t border-white/[0.06]' : ''
                    }`}
                  >
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                        r.highlight
                          ? 'bg-brand-red text-white'
                          : 'bg-brand-red/10 text-brand-red'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-display text-base font-bold text-white">
                        {r.title}
                      </div>
                      {r.note && (
                        <div className="text-xs text-white/45">{r.note}</div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
