'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  FileCheck,
  Wallet,
  CalendarClock,
  ReceiptText,
  TrendingDown,
  HeartHandshake,
  Clock,
  Activity,
  CarFront,
  Car,
  Gauge,
  Droplets,
  ListChecks,
  BadgeCheck,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { whyChooseUs, assuranceCover } from '@/content/features';

// Maps the icon names in content/features.ts to their lucide components.
const ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  FileCheck,
  Wallet,
  CalendarClock,
  ReceiptText,
  TrendingDown,
  HeartHandshake,
  Clock,
  Activity,
  CarFront,
  Car,
  Gauge,
  Droplets,
  ListChecks,
  BadgeCheck,
};

export function WhyChooseUs() {
  return (
    <section className="section bg-brand-black-soft border-y border-white/[0.06]">
      <div className="container-wide">
        <SectionHeading
          eyebrow="The Buy&Drive Edge"
          title="Why thousands trust us"
          highlight="every single day."
          description="Certified pre-owned cars, transparent pricing, and support that lasts the entire life of your loan. Here's what sets us apart."
          align="center"
        />

        {/* Headline selling points */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06]">
          {whyChooseUs.map((f, i) => {
            const Icon = ICONS[f.icon] ?? Check;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="group relative bg-brand-black p-8 lg:p-10 transition-colors hover:bg-brand-black-elevated"
              >
                <div className="grid place-items-center w-12 h-12 rounded-lg bg-brand-red/10 text-brand-red mb-6 transition-all group-hover:bg-brand-red group-hover:text-white group-hover:scale-110">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  {f.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">{f.desc}</p>
                <div className="absolute top-6 right-6 font-display text-5xl font-bold text-white/[0.04] group-hover:text-brand-red/20 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Assurance Cover — quality / inspection guarantees */}
        <div className="mt-20">
          <div className="text-center">
            <span className="inline-flex items-center gap-2">
              <span className="h-px w-8 bg-brand-red" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">
                Buy&amp;Drive Assurance Cover
              </span>
              <span className="h-px w-8 bg-brand-red" />
            </span>
            <h3 className="mt-4 display-heading text-2xl md:text-3xl text-white">
              Every car, fully inspected &amp;{' '}
              <span className="italic text-brand-red">guaranteed.</span>
            </h3>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assuranceCover.map((f, i) => {
              const Icon = ICONS[f.icon] ?? Check;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                  className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-brand-black p-5"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="font-display text-base font-bold text-white">
                      {f.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-white/55">
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
