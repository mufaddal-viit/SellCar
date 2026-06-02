'use client';

import { MessageCircle, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/content/site';
import { formatEMI } from '@/lib/utils';
import { trackInteraction } from '@/lib/track';
import type { CarStatus } from '@/types';

interface Props {
  carId: string;
  carName: string;
  emiFrom: number;
  status?: CarStatus;
}

export function CarCta({ carId, carName, emiFrom, status = 'available' }: Props) {
  if (status === 'sold') {
    return (
      <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-brand-black-soft p-5 text-white/70">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
        <p className="text-sm">
          This vehicle has been <span className="font-semibold text-white">sold</span>.
          Browse our available inventory or contact us for a similar model.
        </p>
      </div>
    );
  }

  const waMsg = encodeURIComponent(
    `Hi ${siteConfig.name}, I'm interested in the ${carName} (EMI from ${formatEMI(
      emiFrom,
    )}/mo). Please share more details.`,
  );

  return (
    <div className="mt-6">
      {status === 'reserved' && (
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-amber-400">
          Reserved — enquire to join the waitlist
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button asChild size="lg">
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${waMsg}`}
            target="_blank"
            rel="noopener"
            onClick={() => trackInteraction('whatsapp', carId, carName)}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Us
          </a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a
            href={`tel:${siteConfig.contact.phone}`}
            onClick={() => trackInteraction('call', carId, carName)}
          >
            <Phone className="h-4 w-4" />
            Call Now
          </a>
        </Button>
      </div>
    </div>
  );
}
