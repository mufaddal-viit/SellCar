'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

export function TestimonialsCarousel({ images }: { images: string[] }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);

  if (images.length === 0) return null;

  const count = images.length;
  const current = ((index % count) + count) % count;

  const paginate = (d: number) => setState([index + d, d]);

  return (
    <div className="relative mx-auto max-w-3xl">
      {/* Stage — fixed height so the portrait screenshot shows uncropped (object-contain) */}
      <div className="relative h-[68vh] max-h-[640px] min-h-[420px] overflow-hidden rounded-3xl border border-white/[0.08] bg-brand-black-soft">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={current}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80 || info.velocity.x < -400) paginate(1);
              else if (info.offset.x > 80 || info.velocity.x > 400) paginate(-1);
            }}
            className="absolute inset-0 cursor-grab p-3 active:cursor-grabbing sm:p-5"
          >
            <div className="relative h-full w-full">
              <Image
                src={images[current]}
                alt={`Customer feedback ${current + 1}`}
                fill
                draggable={false}
                sizes="(min-width:768px) 700px, 100vw"
                className="select-none object-contain"
                priority={current === 0}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Glassy direction buttons */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Previous"
            className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:-left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Next"
            className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:-right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
