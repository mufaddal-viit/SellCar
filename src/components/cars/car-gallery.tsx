'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  images: string[];
  alt: string;
}

export function CarGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-3">
      <div className="relative aspect-[16/11] bg-brand-black-soft overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <Image
              src={images[active]}
              alt={`${alt} - ${active + 1}`}
              fill
              priority={active === 0}
              sizes="(min-width:1024px) 60vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible no-scrollbar">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={`relative shrink-0 w-24 md:w-full aspect-square overflow-hidden bg-brand-black-soft transition-all ${
              i === active
                ? 'ring-2 ring-brand-red opacity-100'
                : 'opacity-50 hover:opacity-80'
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="120px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
