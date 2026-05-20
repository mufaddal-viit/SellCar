'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Twitter, Youtube, Linkedin, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { Logo } from './logo';
import { siteConfig, footerLinks } from '@/content/site';

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const year = new Date().getFullYear();

  const socialIcons = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube,
    linkedin: Linkedin,
  };

  return (
    <footer className="relative bg-brand-black-soft border-t border-white/[0.06] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, #E10600 0%, transparent 50%)',
        }}
      />

      <div className="container-wide relative pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-16">
          <div className="md:col-span-5">
            <Logo size="lg" />
            <p className="mt-6 max-w-md text-white/60 leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="mt-8 space-y-3">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors group"
              >
                <span className="grid place-items-center w-9 h-9 rounded-full bg-white/5 group-hover:bg-brand-red transition-colors">
                  <Phone className="w-4 h-4" />
                </span>
                {siteConfig.contact.phone}
              </a>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors group"
              >
                <span className="grid place-items-center w-9 h-9 rounded-full bg-white/5 group-hover:bg-brand-red transition-colors">
                  <Mail className="w-4 h-4" />
                </span>
                {siteConfig.contact.email}
              </a>
              <a
                href={siteConfig.contact.mapUrl}
                target="_blank"
                rel="noopener"
                className="flex items-start gap-3 text-sm text-white/70 hover:text-white transition-colors group"
              >
                <span className="grid place-items-center w-9 h-9 shrink-0 rounded-full bg-white/5 group-hover:bg-brand-red transition-colors">
                  <MapPin className="w-4 h-4" />
                </span>
                <span className="pt-2">{siteConfig.contact.address}</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterCol title="Company" links={footerLinks.company} />
            <FooterCol title="Services" links={footerLinks.services} />
            <FooterCol title="Support" links={footerLinks.support} />
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.06] flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-xs text-white/40">
            © {year} {siteConfig.business.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {Object.entries(siteConfig.social).map(([k, url]) => {
              const Icon = socialIcons[k as keyof typeof socialIcons];
              if (!Icon) return null;
              return (
                <a
                  key={k}
                  href={url}
                  target="_blank"
                  rel="noopener"
                  aria-label={k}
                  className="grid place-items-center w-9 h-9 rounded-full bg-white/[0.04] hover:bg-brand-red text-white/70 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group inline-flex items-center gap-1 text-sm text-white/80 hover:text-brand-red transition-colors"
            >
              {l.label}
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 translate-x-0 group-hover:opacity-100 transition" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
