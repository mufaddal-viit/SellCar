'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  images: string[];
  alt: string;
}

/** Max thumbnails visible in the sidebar before showing "+X more". */
const MAX_THUMBS = 4;

export function CarGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const hasOverflow = images.length > MAX_THUMBS;
  const visibleThumbs = showAll ? images : images.slice(0, MAX_THUMBS);
  const remaining = images.length - MAX_THUMBS;

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

      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-hidden no-scrollbar">
        {visibleThumbs.map((src, i) => {
          const isLast = !showAll && hasOverflow && i === MAX_THUMBS - 1;
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (isLast) {
                  setShowAll(true);
                } else {
                  setActive(i);
                }
              }}
              aria-label={isLast ? `Show ${remaining} more images` : `View image ${i + 1}`}
              className={`relative shrink-0 w-20 md:w-full aspect-square overflow-hidden bg-brand-black-soft transition-all ${
                i === active && !isLast
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
              {isLast && (
                <div className="absolute inset-0 bg-brand-black/70 grid place-items-center">
                  <span className="font-display text-lg font-bold text-white">+{remaining}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
