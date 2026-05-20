'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { emiPlans } from '@/content/emi-plans';
import { siteConfig } from '@/content/site';
import { cn } from '@/lib/utils';

export function EMIPlansSection() {
  return (
    <section className="section bg-brand-black-soft border-y border-white/[0.06]">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Built for every budget"
          title="Three plans."
          highlight="Zero compromises."
          description="Whether you want the lowest EMI or fastest tenure, we've designed plans that match your life."
          align="center"
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {emiPlans.map((plan, i) => {
            const waMsg = encodeURIComponent(
              `Hi ${siteConfig.name}, I'm interested in the ${plan.title} plan. Please share details.`,
            );
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={cn(
                  'relative flex flex-col p-8 md:p-10 transition-all',
                  plan.highlight
                    ? 'bg-brand-red text-white -mt-4 md:-mt-8 shadow-[0_30px_80px_-20px_rgba(225,6,0,0.5)]'
                    : 'bg-brand-black border border-white/[0.06] hover:border-white/15',
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-brand-red text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                )}
                <div
                  className={cn(
                    'text-[10px] font-semibold uppercase tracking-[0.25em]',
                    plan.highlight ? 'opacity-80' : 'text-brand-red',
                  )}
                >
                  {plan.title}
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-5xl md:text-6xl font-bold leading-none">
                    {plan.rate}%
                  </span>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      plan.highlight ? 'opacity-80' : 'text-white/50',
                    )}
                  >
                    p.a.
                  </span>
                </div>
                <p
                  className={cn(
                    'mt-2 text-sm',
                    plan.highlight ? 'opacity-90' : 'text-white/60',
                  )}
                >
                  Starting rate · {plan.tenureMin}–{plan.tenureMax} months · {plan.downPaymentMin}% down
                </p>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className={cn(
                        'flex items-start gap-3 text-sm',
                        plan.highlight ? 'text-white' : 'text-white/80',
                      )}
                    >
                      <Check
                        className={cn(
                          'w-5 h-5 shrink-0 mt-px',
                          plan.highlight ? 'text-white' : 'text-brand-red',
                        )}
                        strokeWidth={2.5}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <Button
                    asChild
                    variant={plan.highlight ? 'secondary' : 'default'}
                    size="lg"
                    className="w-full"
                  >
                    <a
                      href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${waMsg}`}
                      target="_blank"
                      rel="noopener"
                    >
                      Choose {plan.title}
                    </a>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
