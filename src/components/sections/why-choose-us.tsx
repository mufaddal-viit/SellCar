'use client';

import { motion } from 'framer-motion';
import {
  Zap,
  ShieldCheck,
  Wallet,
  HeartHandshake,
  Clock,
  TrendingDown,
} from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';

const features = [
  {
    icon: Zap,
    title: '24-hour Approvals',
    desc: 'Get approved in a single day with our AI-powered underwriting and digital documentation.',
  },
  {
    icon: TrendingDown,
    title: 'Lowest Rates',
    desc: 'Profit rates starting at 2.99% — significantly below market average across UAE banks.',
  },
  {
    icon: Wallet,
    title: 'Zero Hidden Charges',
    desc: 'What we quote is what you pay. All processing, registration and insurance fees included upfront.',
  },
  {
    icon: ShieldCheck,
    title: '200-Point Inspection',
    desc: 'Every certified pre-owned car passes our rigorous mechanical and safety inspection.',
  },
  {
    icon: HeartHandshake,
    title: 'Lifetime Service',
    desc: 'Free annual servicing and roadside assistance for the entire duration of your loan.',
  },
  {
    icon: Clock,
    title: 'Flexible Tenures',
    desc: 'Choose anything from 12 to 60 months. Step-up installment plans available for first-time UAE buyers.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="section bg-brand-black-soft border-y border-white/[0.06]">
      <div className="container-wide">
        <SectionHeading
          eyebrow="The DriveEasy Edge"
          title="Why thousands trust us"
          highlight="every single day."
          description="We've reimagined car financing from the ground up. No paperwork mountains, no surprise fees, no waiting weeks."
          align="center"
        />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06]">
          {features.map((f, i) => {
            const Icon = f.icon;
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
                <p className="text-sm text-white/60 leading-relaxed">
                  {f.desc}
                </p>
                <div className="absolute top-6 right-6 font-display text-5xl font-bold text-white/[0.04] group-hover:text-brand-red/20 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
