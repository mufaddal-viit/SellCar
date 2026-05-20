'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Fuel, Gauge, Users, ArrowUpRight } from 'lucide-react';
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08 }}
      className="group h-full"
    >
      <Link
        href={`/cars/${car.slug}`}
        className="flex h-full flex-col bg-brand-black-soft transition-all duration-500 hover:bg-brand-black-elevated"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-black-elevated">
          <Image
            src={car.images[0]}
            alt={car.name}
            fill
            sizes="(min-width:1280px) 25vw, (min-width:768px) 33vw, 100vw"
            className="object-cover transition-transform duration-[800ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/10 to-transparent" />

          {car.badge && (
            <div className="absolute top-4 left-4">
              <Badge
                variant={car.badge === 'Best Deal' ? 'success' : 'default'}
              >
                {car.badge}
              </Badge>
            </div>
          )}

          <div className="absolute top-4 right-4 grid place-items-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
                {car.brand}
              </div>
              <h3 className="mt-1 font-display text-xl font-bold text-white leading-tight">
                {car.name}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="grid grid-cols-3 gap-2 mb-5">
            <Spec icon={<Fuel className="w-3.5 h-3.5" />} label={car.fuel} />
            <Spec
              icon={<Gauge className="w-3.5 h-3.5" />}
              label={car.transmission}
            />
            <Spec
              icon={<Users className="w-3.5 h-3.5" />}
              label={`${car.seating} Seat`}
            />
          </div>

          <div className="mt-auto pt-5 border-t border-white/[0.06] flex items-end justify-between">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-widest text-white/50">
                EMI from
              </div>
              <div className="mt-0.5 font-display text-2xl font-bold text-white">
                {formatEMI(car.emiFrom)}
                <span className="text-xs font-medium text-white/50">
                  /mo
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-medium uppercase tracking-widest text-white/50">
                On-Road
              </div>
              <div className="mt-0.5 text-sm font-semibold text-white/80">
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
    <div className="flex items-center gap-1.5 text-xs text-white/60">
      <span className="text-brand-red">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}
