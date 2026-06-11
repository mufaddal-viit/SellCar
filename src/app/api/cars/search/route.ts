import { NextResponse } from 'next/server';
import { getCars } from '@/server/cars';

export const runtime = 'nodejs';

/** Lightweight result shape — only what the hero search dropdown renders. */
export interface CarSearchHit {
  slug: string;
  name: string;
  brand: string;
  category: string;
  year: number;
  price: number;
  emiFrom: number;
  image: string | null;
  status: string;
}

const LIMIT = 8;

/**
 * Public typeahead for the hero search bar.
 *   GET /api/cars/search?q=toyota  →  { total, hits: CarSearchHit[] }
 *
 * Reads from the same cached, published-cars source as the rest of the site, so
 * it adds no extra DB load per keystroke (the cache absorbs the fan-out).
 */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')?.trim().toLowerCase() ?? '';
  const cars = await getCars();

  if (!q) {
    return NextResponse.json({ total: cars.length, hits: [] });
  }

  // Split into terms so "toyota 2022" matches a car whose name+brand+year
  // contains both tokens, in any order.
  const terms = q.split(/\s+/).filter(Boolean);
  const matches = cars
    .map((c) => {
      const haystack =
        `${c.name} ${c.brand} ${c.category} ${c.fuel} ${c.year}`.toLowerCase();
      if (!terms.every((t) => haystack.includes(t))) return null;
      // Rank: prefix match on name/brand first, available before sold.
      const starts =
        c.name.toLowerCase().startsWith(q) ||
        c.brand.toLowerCase().startsWith(q);
      const score =
        (starts ? 0 : 10) +
        (c.status === 'sold' ? 5 : 0) +
        (c.featured ? -1 : 0);
      return { c, score };
    })
    .filter((m): m is { c: (typeof cars)[number]; score: number } => m !== null)
    .sort((a, b) => a.score - b.score);

  const hits: CarSearchHit[] = matches.slice(0, LIMIT).map(({ c }) => ({
    slug: c.slug,
    name: c.name,
    brand: c.brand,
    category: c.category,
    year: c.year,
    price: c.price,
    emiFrom: c.emiFrom,
    image: c.images[0] ?? null,
    status: c.status ?? 'available',
  }));

  return NextResponse.json({ total: cars.length, matched: matches.length, hits });
}
