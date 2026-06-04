'use client';

import { MessageCircle, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/content/site';
import { formatEMI, cn } from '@/lib/utils';
import { trackInteraction } from '@/lib/track';
import type { CarStatus } from '@/types';

interface Props {
  carId: string;
  carName: string;
  emiFrom: number;
  status?: CarStatus;
  size?: 'sm' | 'lg';
  className?: string;
}

export function CarCta({
  carId,
  carName,
  emiFrom,
  status = 'available',
  size = 'lg',
  className,
}: Props) {
  if (status === 'sold') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-white/10 bg-brand-black-soft px-4 py-2 text-sm text-white/70',
          className,
        )}
      >
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
        This car has been sold
      </div>
    );
  }

  const waMsg = encodeURIComponent(
    `Hi ${siteConfig.name}, I'm interested in the ${carName} (EMI from ${formatEMI(
      emiFrom,
    )}/mo). Please share more details.`,
  );

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {status === 'reserved' && (
        <span className="text-xs font-medium uppercase tracking-widest text-amber-400">
          Reserved
        </span>
      )}
      <Button asChild size={size}>
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
      <Button asChild variant="outline" size={size}>
        <a
          href={`tel:${siteConfig.contact.phone}`}
          onClick={() => trackInteraction('call', carId, carName)}
        >
          <Phone className="h-4 w-4" />
          Call Now
        </a>
      </Button>
    </div>
  );
}
