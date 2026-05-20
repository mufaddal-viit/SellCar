import type { Metadata } from 'next';
import { Mail, MapPin, MessageCircle, Phone, Clock } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with our car-on-EMI experts. Available 7 days a week via phone, WhatsApp, or visit any of our nationwide branches.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const waMsg = encodeURIComponent(
    `Hi ${siteConfig.name}, I have a question about your EMI plans.`,
  );

  return (
    <div className="bg-brand-black">
      <section className="container-wide pt-16 md:pt-24 pb-16">
        <SectionHeading
          eyebrow="Get in touch"
          title="We're here,"
          highlight="all week."
          description="Our finance experts are available 7 days a week. Call, WhatsApp, or visit any of our branches — whichever works best for you."
        />

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ContactCard
            icon={<Phone className="w-5 h-5" />}
            label="Call Us"
            value={siteConfig.contact.phone}
            href={`tel:${siteConfig.contact.phone}`}
            cta="Dial now"
            highlight
          />
          <ContactCard
            icon={<MessageCircle className="w-5 h-5" />}
            label="WhatsApp"
            value="Instant replies, 7 days a week"
            href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${waMsg}`}
            cta="Open WhatsApp"
            external
          />
          <ContactCard
            icon={<Mail className="w-5 h-5" />}
            label="Email"
            value={siteConfig.contact.email}
            href={`mailto:${siteConfig.contact.email}`}
            cta="Send email"
          />
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-brand-black-soft">
        <div className="container-wide py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="h-px w-8 bg-brand-red" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
                  Visit Us
                </span>
              </div>
              <h2 className="display-heading text-3xl md:text-4xl text-white">
                Our flagship branch
              </h2>
              <div className="mt-6 space-y-4">
                <Detail
                  icon={<MapPin className="w-4 h-4" />}
                  label="Address"
                  value={siteConfig.contact.address}
                />
                <Detail
                  icon={<Clock className="w-4 h-4" />}
                  label="Hours"
                  value="Mon – Sun · 9:00 AM to 8:00 PM"
                />
                <Detail
                  icon={<Phone className="w-4 h-4" />}
                  label="Phone"
                  value={siteConfig.contact.phone}
                />
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <a
                    href={siteConfig.contact.mapUrl}
                    target="_blank"
                    rel="noopener"
                  >
                    Get Directions
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={`tel:${siteConfig.contact.phone}`}>
                    <Phone className="w-4 h-4" />
                    Call Branch
                  </a>
                </Button>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden bg-brand-black border border-white/[0.06]">
              <iframe
                title="Branch location"
                src="https://www.google.com/maps?q=MG+Road+Bengaluru&output=embed"
                className="absolute inset-0 w-full h-full"
                style={{ border: 0, filter: 'invert(0.92) hue-rotate(180deg) saturate(0.4)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
  cta,
  external,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  cta: string;
  external?: boolean;
  highlight?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
      className={`group flex flex-col p-8 md:p-10 transition-all ${
        highlight
          ? 'bg-brand-red text-white hover:bg-brand-red-dark'
          : 'bg-brand-black-soft text-white border border-white/[0.06] hover:bg-brand-black-elevated hover:border-white/15'
      }`}
    >
      <span
        className={`grid place-items-center w-12 h-12 rounded-lg mb-6 ${
          highlight ? 'bg-white/20' : 'bg-brand-red/10 text-brand-red'
        }`}
      >
        {icon}
      </span>
      <div
        className={`text-[10px] font-semibold uppercase tracking-[0.25em] ${
          highlight ? 'opacity-80' : 'text-white/40'
        }`}
      >
        {label}
      </div>
      <div className="mt-2 font-display text-xl md:text-2xl font-bold">
        {value}
      </div>
      <div
        className={`mt-auto pt-6 text-sm font-medium inline-flex items-center gap-2 ${
          highlight ? 'text-white' : 'text-brand-red'
        }`}
      >
        {cta}
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </a>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid place-items-center w-9 h-9 rounded-full bg-brand-red/10 text-brand-red shrink-0">
        {icon}
      </span>
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
          {label}
        </div>
        <div className="mt-1 text-white">{value}</div>
      </div>
    </div>
  );
}
