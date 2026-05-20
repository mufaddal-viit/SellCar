'use client';

import { usePathname } from 'next/navigation';
import { Phone, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/content/site';

export function FloatingCTA() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const waMsg = encodeURIComponent(
    `Hi ${siteConfig.name}, I'm interested in financing a car on EMI. Please share more details.`,
  );

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${waMsg}`}
        target="_blank"
        rel="noopener"
        aria-label="WhatsApp us"
        className="group relative grid place-items-center w-14 h-14 rounded-full bg-emerald-500 text-white shadow-[0_12px_30px_-8px_rgba(16,185,129,0.6)] hover:scale-110 transition-transform"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
        <MessageCircle className="w-6 h-6 relative" fill="currentColor" />
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-full bg-brand-black-elevated text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          Chat on WhatsApp
        </span>
      </a>
      <a
        href={`tel:${siteConfig.contact.phone}`}
        aria-label="Call us"
        className="group relative grid place-items-center w-14 h-14 rounded-full bg-brand-red text-white shadow-[0_12px_30px_-8px_rgba(225,6,0,0.6)] hover:scale-110 transition-transform"
      >
        <Phone className="w-5 h-5" />
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-full bg-brand-black-elevated text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          Call Now
        </span>
      </a>
    </div>
  );
}
