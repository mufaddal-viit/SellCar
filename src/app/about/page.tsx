import type { Metadata } from 'next';
import Image from 'next/image';
import {
  Award,
  Building2,
  Heart,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { CTASection } from '@/components/sections/cta-section';
import { TestimonialsSection } from '@/components/sections/testimonials';
import { siteConfig } from '@/content/site';
import {
  aboutMeta,
  aboutHero,
  aboutStats,
  aboutStory,
  aboutValuesHeading,
  aboutValues,
} from '@/content/about';

export const metadata: Metadata = {
  title: 'About Us',
  description: aboutMeta.description,
  alternates: { canonical: '/about' },
};

// Maps icon names in content/about.ts to their lucide components.
const ICONS: Record<string, LucideIcon> = {
  Award,
  Building2,
  Heart,
  Sparkles,
  Target,
  Users,
};

export default function AboutPage() {
  return (
    <div className="bg-brand-black">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={aboutHero.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/70 to-brand-black/40" />
        </div>
        <div className="container-wide relative py-24 md:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-8 bg-brand-red" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
                Since {siteConfig.business.foundedYear}
              </span>
            </div>
            <h1 className="display-heading text-5xl md:text-7xl text-white leading-[0.95]">
              {aboutHero.title}
              <br />
              <span className="italic text-brand-red">{aboutHero.highlight}</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-white/70 leading-relaxed">
              {aboutHero.intro}
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-brand-black-soft">
        <div className="container-wide grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.06]">
          {aboutStats.map((s) => {
            const Icon = ICONS[s.icon] ?? Sparkles;
            return (
              <div key={s.label} className="px-6 py-10 md:py-14 text-center">
                <Icon className="w-6 h-6 text-brand-red mx-auto mb-4" />
                <div className="display-heading text-3xl md:text-5xl font-bold text-white">
                  {s.value}
                </div>
                <div className="mt-2 text-xs uppercase tracking-widest text-white/50">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="relative aspect-[4/3] overflow-hidden bg-brand-black-soft">
            <Image
              src={aboutStory.image}
              alt="Our showroom"
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow={aboutStory.eyebrow}
              title={aboutStory.title}
              highlight={aboutStory.highlight}
              description={aboutStory.description}
            />
            <p className="mt-6 text-white/60 leading-relaxed">{aboutStory.paragraph}</p>
          </div>
        </div>
      </section>

      <section id="branches" className="section bg-brand-black-soft border-y border-white/[0.06]">
        <div className="container-wide">
          <SectionHeading
            eyebrow={aboutValuesHeading.eyebrow}
            title={aboutValuesHeading.title}
            highlight={aboutValuesHeading.highlight}
            align="center"
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06]">
            {aboutValues.map((v) => {
              const Icon = ICONS[v.icon] ?? Sparkles;
              return (
                <div key={v.title} className="bg-brand-black p-8 md:p-10">
                  <Icon className="w-8 h-8 text-brand-red mb-6" />
                  <h3 className="font-display text-xl font-bold text-white mb-3">
                    {v.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
