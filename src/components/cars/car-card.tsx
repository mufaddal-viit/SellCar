'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Fuel, Cog, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatEMI } from '@/lib/utils';
import type { Car } from '@/types';

interface CarCardProps {
  car: Car;
  index?: number;
}

export function CarCard({ car, index = 0 }: CarCardProps) {
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
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-brand-black-soft transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.85)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={car.images[0]}
            alt={car.name}
            fill
            sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 100vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              car.status === 'sold' ? 'opacity-60 grayscale' : ''
            }`}
          />
          <div className="absolute left-4 top-4">
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

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              {car.brand}
            </span>
            <span className="text-[11px] font-medium text-white/40">
              {car.year}
            </span>
          </div>

          <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-white transition-colors group-hover:text-brand-red">
            {car.name}
          </h3>

          <div className="mt-4 flex items-center gap-4 text-xs text-white/55">
            <Spec icon={<Fuel className="h-3.5 w-3.5" />} label={car.fuel} />
            <Spec
              icon={<Cog className="h-3.5 w-3.5" />}
              label={car.transmission}
            />
            <Spec
              icon={<Users className="h-3.5 w-3.5" />}
              label={`${car.seating} Seats`}
            />
          </div>

          <div className="mt-auto flex items-end justify-between border-t border-white/[0.06] pt-5">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-widest text-white/40">
                EMI from
              </div>
              <div className="mt-0.5 font-display text-xl font-bold text-white">
                {formatEMI(car.emiFrom)}
                <span className="text-xs font-medium text-white/45">/mo</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-medium uppercase tracking-widest text-white/40">
                On-Road
              </div>
              <div className="mt-0.5 text-sm font-semibold text-white/75">
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
    <span className="inline-flex items-center gap-1.5">
      <span className="text-brand-red">{icon}</span>
      <span className="truncate">{label}</span>
    </span>
  );
}
