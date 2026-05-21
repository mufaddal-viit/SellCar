import type { Metadata } from 'next';
import Image from 'next/image';
import { Award, Building2, Heart, Sparkles, Target, Users } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { CTASection } from '@/components/sections/cta-section';
import { TestimonialsSection } from '@/components/sections/testimonials';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Founded in ${siteConfig.business.foundedYear}, ${siteConfig.business.name} is the UAE's most trusted car finance platform with ${siteConfig.business.branches} showrooms across all 7 emirates.`,
  alternates: { canonical: '/about' },
};

const stats = [
  { icon: Users, value: siteConfig.business.customers, label: 'Happy Customers' },
  { icon: Building2, value: siteConfig.business.branches, label: 'Branches' },
  { icon: Award, value: siteConfig.business.carsSold, label: 'Cars Delivered' },
  {
    icon: Sparkles,
    value: `${new Date().getFullYear() - siteConfig.business.foundedYear}+`,
    label: 'Years of Trust',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Customer First',
    desc: 'Every decision we make starts with one question: is this better for our customer? We win when you drive away smiling.',
  },
  {
    icon: Target,
    title: 'Radical Transparency',
    desc: 'No fine print. No surprise fees. The quote we give is the quote you pay — in writing, every single time.',
  },
  {
    icon: Sparkles,
    title: 'Built for the UAE',
    desc: 'From Sheikh Zayed Road to the dunes, our process is designed for the realities of UAE residents — Emiratis, expats and freelancers alike.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-brand-black">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/70 to-brand-black/40" />
        </div>
        <div className="container-wide relative py-32 md:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-8 bg-brand-red" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-red">
                Since {siteConfig.business.foundedYear}
              </span>
            </div>
            <h1 className="display-heading text-5xl md:text-7xl text-white leading-[0.95]">
              We help the UAE
              <br />
              <span className="italic text-brand-red">drive home.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-white/70 leading-relaxed">
              {siteConfig.business.name} was founded with a simple belief: owning
              a car shouldn't require a fortune up front. Today, we're the
              fastest-growing auto-finance company in the Emirates.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-brand-black-soft">
        <div className="container-wide grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/[0.06]">
          {stats.map((s) => {
            const Icon = s.icon;
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
              src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1600&q=80"
              alt="Our showroom"
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Our Story"
              title="From one showroom to"
              highlight={`${siteConfig.business.branches} locations.`}
              description={`What started as a single showroom in 2014 has grown into the UAE's most trusted car finance platform. We've reimagined automotive finance from the ground up — replacing paperwork with one-day approvals, hidden fees with up-front quotes, and queue-based service with dedicated relationship managers.`}
            />
            <p className="mt-6 text-white/60 leading-relaxed">
              Today, we serve customers across all 7 emirates through{' '}
              {siteConfig.business.branches} showrooms, partner with every
              major auto brand, and have helped more than{' '}
              {siteConfig.business.customers} families bring home their dream
              car.
            </p>
          </div>
        </div>
      </section>

      <section id="branches" className="section bg-brand-black-soft border-y border-white/[0.06]">
        <div className="container-wide">
          <SectionHeading
            eyebrow="What we stand for"
            title="Three values."
            highlight="Zero exceptions."
            align="center"
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06]">
            {values.map((v) => {
              const Icon = v.icon;
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
