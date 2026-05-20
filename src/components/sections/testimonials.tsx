'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { testimonials } from '@/content/testimonials';

export function TestimonialsSection() {
  return (
    <section className="section bg-brand-black overflow-hidden">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Real Stories"
          title="From driveway"
          highlight="to dream way."
          description="Over 50,000 happy customers across India. Here's what they have to say."
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-brand-black-soft p-8 md:p-10 transition-colors hover:bg-brand-black-elevated"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-brand-red/20 group-hover:text-brand-red/40 transition-colors" />

              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="w-4 h-4 text-brand-red"
                    fill="currentColor"
                  />
                ))}
              </div>

              <blockquote className="text-lg md:text-xl text-white/90 leading-relaxed font-light">
                "{t.text}"
              </blockquote>

              <figcaption className="mt-8 flex items-center gap-4 pt-6 border-t border-white/[0.06]">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-black-elevated">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate">
                    {t.name}
                  </div>
                  <div className="text-xs text-white/50 truncate">
                    {t.role}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-medium uppercase tracking-widest text-white/40">
                    Drives
                  </div>
                  <div className="text-sm font-semibold text-brand-red">
                    {t.car}
                  </div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
