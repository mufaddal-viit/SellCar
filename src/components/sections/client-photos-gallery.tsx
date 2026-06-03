'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  width: number;
  height: number;
  title?: string;
  subtitle?: string;
}

// Used for the hover overlay when a photo has no Cloudinary caption/alt set.
const FALLBACK_CAPTIONS = [
  { t: 'Another happy customer', s: 'Drove home with Buy&Drive Cars' },
  { t: 'Keys handed over', s: 'Zero down payment, instant approval' },
  { t: 'Dream car, delivered', s: 'Flexible EMI made it easy' },
  { t: 'Smiles all round', s: 'Free insurance & registration included' },
];

// Varied skeleton heights to mimic a real masonry layout while loading.
const SKELETON_HEIGHTS = [220, 300, 180, 260, 340, 200, 280, 240];

export function ClientPhotosGallery() {
  const [items, setItems] = useState<Photo[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPage = useCallback(async (c?: string) => {
    const res = await fetch(
      `/api/testimonials${c ? `?cursor=${encodeURIComponent(c)}` : ''}`,
    );
    return (await res.json()) as { items: Photo[]; nextCursor: string | null };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const d = await fetchPage();
        if (!active) return;
        setItems(d.items);
        setCursor(d.nextCursor);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [fetchPage]);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const d = await fetchPage(cursor);
      setItems((prev) => [...prev, ...d.items]);
      setCursor(d.nextCursor);
    } finally {
      setLoadingMore(false);
    }
  };

  // Initial load → skeletons
  if (loading) {
    return (
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {SKELETON_HEIGHTS.concat(SKELETON_HEIGHTS).map((h, i) => (
          <div
            key={i}
            style={{ height: h }}
            className="w-full animate-pulse rounded-2xl bg-white/[0.05]"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-white/40">
        Customer photos coming soon.
      </p>
    );
  }

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {items.map((p, i) => {
          const fb = FALLBACK_CAPTIONS[i % FALLBACK_CAPTIONS.length];
          return (
            <div
              key={p.id}
              className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-brand-black-soft"
            >
              <Image
                src={p.url}
                alt={p.title || 'Buy&Drive Cars customer'}
                width={p.width || 800}
                height={p.height || 800}
                sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                className="h-auto w-full object-cover"
              />
              {/* Hover overlay: 2-line caption */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="line-clamp-1 font-display text-sm font-bold text-white">
                  {p.title || fb.t}
                </p>
                <p className="line-clamp-1 text-xs text-white/70">
                  {p.subtitle || fb.s}
                </p>
              </div>
            </div>
          );
        })}

        {loadingMore &&
          SKELETON_HEIGHTS.slice(0, 4).map((h, i) => (
            <div
              key={`more-${i}`}
              style={{ height: h }}
              className="w-full animate-pulse rounded-2xl bg-white/[0.05]"
            />
          ))}
      </div>

      {cursor && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5 disabled:opacity-60"
          >
            {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </>
  );
}
