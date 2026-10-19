'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  images: string[];
  alt: string;
}

export function CarGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const thumbRef = useRef<HTMLDivElement>(null);

  const handleThumbClick = (i: number) => {
    setActive(i);
    // Scroll the clicked thumbnail into view within the sidebar.
    const container = thumbRef.current;
    if (!container) return;
    const btn = container.children[i] as HTMLElement | undefined;
    btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_100px] md:grid-rows-[1fr] gap-3">
      {/* Main image — its aspect ratio sets the row height for the thumbnail column */}
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

      {/* Thumbnails: horizontal scroll on mobile, vertical scroll on md+ constrained to main image height */}
      <div
        ref={thumbRef}
        className="flex gap-2 overflow-x-auto no-scrollbar md:flex-col md:overflow-y-auto md:overflow-x-hidden"
      >
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleThumbClick(i)}
            aria-label={`View image ${i + 1}`}
            className={`relative shrink-0 w-20 md:w-full aspect-square overflow-hidden bg-brand-black-soft transition-all ${
              i === active
                ? 'ring-2 ring-brand-red opacity-100'
                : 'opacity-50 hover:opacity-80'
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="100px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
