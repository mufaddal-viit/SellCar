'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CarSearch } from '@/components/cars/car-search';
import { heroSlides } from '@/content/hero';
import { heroStats } from '@/content/site';

export function Hero({ carCount }: { carCount?: number }) {
  const [active, setActive] = useState(0);
  // Paused while the user is interacting with the search bar on slide 0, so the
  // slideshow doesn't swap slides (and unmount the search) mid-interaction.
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(
      () => setActive((i) => (i + 1) % heroSlides.length),
      6000,
    );
    return () => clearInterval(t);
  }, [paused]);

  const slide = heroSlides[active];

  return (
    <section className="relative min-h-screen min-h-[100svh] w-full overflow-hidden bg-brand-black">
      {/* Full-bleed background slideshow — crossfades between hero slides every 6s */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Left-to-right + bottom dark gradients keep the white text readable over any photo */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Decorative grid texture, faded out toward the bottom */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:64px_64px] opacity-30 mask-fade-bottom" />

      {/* Foreground content column (label, title, subtitle, CTA).
          z-30 keeps the search dropdown above the bottom stats strip (z-10). */}
      <div className="container-wide relative z-30 flex min-h-screen min-h-[100svh] flex-col justify-center pt-24 pb-32">
        <div className="max-w-3xl">
          {/* Eyebrow: pulsing dot + per-slide tag text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`label-${slide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span className="grid place-items-center w-2 h-2 rounded-full bg-brand-red">
                <span className="absolute w-3 h-3 rounded-full bg-brand-red animate-ping" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                {slide.tag}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Animated headline — title line + red italic highlight line */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${slide.id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="display-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[0.95]"
            >
              {slide.title}
              <br />
              <span className="italic font-display text-brand-red">
                {slide.highlight}
              </span>
            </motion.h1>
          </AnimatePresence>

          {/* Animated supporting paragraph for the active slide */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${slide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-7 max-w-xl text-base sm:text-lg text-white/70 leading-relaxed"
            >
              {slide.subtitle}
            </motion.p>
          </AnimatePresence>

          {/* First slide gets the live car-search bar; the rest keep the
              per-slide call-to-action button. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="relative z-50 mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            {active === 0 ? (
              <CarSearch
                total={carCount}
                className="max-w-xl"
                onActiveChange={setPaused}
              />
            ) : (
              <Button asChild size="lg">
                <Link href={slide.cta.href}>
                  {slide.cta.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </motion.div>
        </div>

        {/* Vertical slide navigation (desktop) — click a number to jump to that slide */}
        <div className="absolute right-4 sm:right-8 lg:right-12 bottom-32 hidden md:flex flex-col gap-3 z-20">
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              className="group flex items-center gap-3"
            >
              <span className="text-xs font-medium text-white/40 group-hover:text-white transition-colors">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`h-px transition-all duration-500 ${
                  i === active
                    ? 'w-12 bg-brand-red'
                    : 'w-6 bg-white/20 group-hover:bg-white/50'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Stats strip pinned to the bottom of the hero (cars financed, approval rate, …).
          Uses gap-px over a hairline background so dividers are perfect on every
          side in both the 2-col (mobile) and 4-col (desktop) grids. */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/[0.08] bg-white/[0.08]">
        <div className="grid grid-cols-2 gap-px md:grid-cols-4">
          {heroStats.map((s) => (
            <div
              key={s.label}
              className="bg-brand-black/70 px-4 py-3.5 backdrop-blur-xl sm:px-6 sm:py-5 md:py-7"
            >
              <div className="display-heading text-lg leading-none text-white sm:text-2xl md:text-4xl">
                {s.value}
              </div>
              <div className="mt-1.5 text-[10px] font-medium uppercase tracking-widest text-white/50 sm:text-xs">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
