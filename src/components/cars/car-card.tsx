'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Fuel, Cog, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatEMI, carHighlights } from '@/lib/utils';
import type { Car } from '@/types';

interface CarCardProps {
  car: Car;
  index?: number;
}

export function CarCard({ car, index = 0 }: CarCardProps) {
  const highlights = carHighlights(car);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className="group h-full"
    >
      <Link
        href={`/cars/${car.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl border border-white/[0.07] bg-brand-black-soft transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.85)]"
      >
        <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden">
          <Image
            src={car.images[0]}
            alt={car.name}
            fill
            sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              car.status === 'sold' ? 'opacity-60 grayscale' : ''
            }`}
          />
          <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
            {car.status === 'sold' ? (
              <Badge variant="muted">Sold</Badge>
            ) : car.status === 'reserved' ? (
              <Badge variant="outline">Reserved</Badge>
            ) : (
              car.badge && (
                <Badge variant={car.badge === 'Best Deal' ? 'success' : 'default'}>
                  {car.badge}
                </Badge>
              )
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-3.5 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40 truncate">
              {car.brand}
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-white/40 shrink-0">
              {car.year}
            </span>
          </div>

          <h3 className="mt-1 sm:mt-1.5 font-display text-base sm:text-lg font-bold leading-snug text-white transition-colors group-hover:text-brand-red line-clamp-2">
            {car.name}
          </h3>

          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-4 text-[11px] sm:text-xs text-white/55">
            <Spec icon={<Fuel className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} label={car.fuel} />
            <Spec
              icon={<Cog className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
              label={car.transmission}
            />
            <Spec
              icon={<Users className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
              label={`${car.seating} Seats`}
            />
          </div>

          {highlights.length > 0 && (
            <div className="mt-2.5 sm:mt-3 flex flex-wrap gap-1 sm:gap-1.5">
              {highlights.slice(0, 2).map((h) => (
                <span
                  key={h}
                  className="rounded-full bg-brand-red/10 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-brand-red"
                >
                  {h}
                </span>
              ))}
              {highlights.length > 2 && (
                <span className="rounded-full bg-white/5 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-white/50">
                  +{highlights.length - 2}
                </span>
              )}
            </div>
          )}

          <div className="mt-auto flex items-end justify-between gap-2 border-t border-white/[0.06] pt-3 sm:pt-4">
            <div className="min-w-0">
              <div className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-white/40">
                EMI from
              </div>
              <div className="mt-0.5 font-display text-lg sm:text-xl font-bold text-white">
                {car.monthlyApprox && <span className="text-white/45">≈ </span>}
                {formatEMI(car.emiFrom)}
                <span className="text-[10px] sm:text-xs font-medium text-white/45">/mo</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-white/40">
                {car.priceType === 'Finance' ? 'Finance' : 'Price'}
              </div>
              <div className="mt-0.5 text-xs sm:text-sm font-semibold text-white/75">
                {formatPrice(car.price)}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 sm:gap-1.5">
      <span className="text-brand-red">{icon}</span>
      <span className="truncate">{label}</span>
    </span>
  );
}
