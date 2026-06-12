import 'server-only';
import { unstable_cache } from 'next/cache';
import type { Car as DbCar } from '@prisma/client';
import { prisma, hasDb } from '@/lib/db/prisma';
import { cars as SEED_CARS } from '@/content/cars';
import type { Car, CarStatus, MediaAsset } from '@/types';

export const CARS_TAG = 'cars';

/** Public car shape (media flattened to URLs) plus full media for the admin editor. */
export interface AdminCar extends Car {
  imagesFull: MediaAsset[];
  videosFull: MediaAsset[];
  /** ISO creation timestamp — shown in the admin cars table. */
  createdAt: string;
}

function toMedia(list: { url: string; publicId: string; width?: number | null; height?: number | null }[]): MediaAsset[] {
  return list.map((m) => ({
    url: m.url,
    publicId: m.publicId,
    width: m.width ?? undefined,
    height: m.height ?? undefined,
  }));
}

function serialize(doc: DbCar): AdminCar {
  const imagesFull = toMedia(doc.images);
  const videosFull = toMedia(doc.videos);
  return {
    id: doc.id,
    slug: doc.slug,
    name: doc.name,
    brand: doc.brand,
    category: doc.category as Car['category'],
    price: doc.price,
    downPayment: doc.downPayment,
    emiFrom: doc.emiFrom,
    tenure: doc.tenure,
    year: doc.year,
    fuel: doc.fuel as Car['fuel'],
    transmission: doc.transmission as Car['transmission'],
    mileage: doc.mileage,
    seating: doc.seating,
    engine: doc.engine,
    power: doc.power,
    images: imagesFull.map((m) => m.url),
    videos: videosFull.map((m) => m.url),
    features: doc.features,
    description: doc.description,
    badge: (doc.badge as Car['badge']) || undefined,
    featured: doc.featured,
    status: doc.status as CarStatus,
    published: doc.published,
    soldAt: doc.soldAt ? doc.soldAt.toISOString() : undefined,
    priceType: doc.priceType as 'Price' | 'Finance',
    monthlyApprox: doc.monthlyApprox,
    freeInsurance: doc.freeInsurance,
    freeRegistration: doc.freeRegistration,
    zeroDownpayment: doc.zeroDownpayment,
    firstPaymentAfter2Months: doc.firstPaymentAfter2Months,
    imagesFull,
    videosFull,
    createdAt: doc.createdAt.toISOString(),
  };
}

// ── Public reads (cached, tag-invalidated on admin writes) ───────────────────

const getPublishedCarsCached = unstable_cache(
  async (): Promise<Car[]> => {
    const docs = await prisma.car.findMany({
      where: { published: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });
    return docs.map(serialize);
  },
  ['published-cars'],
  { tags: [CARS_TAG], revalidate: 300 },
);

/** All cars shown on the public site (published; any status). Falls back to seed data. */
export async function getCars(): Promise<Car[]> {
  if (!hasDb) return SEED_CARS.filter((c) => c.published !== false);
  return getPublishedCarsCached();
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  const all = await getCars();
  return all.find((c) => c.slug === slug) ?? null;
}

export async function getFeaturedCars(): Promise<Car[]> {
  const all = await getCars();
  return all.filter((c) => c.featured);
}

export async function getRelatedCars(slug: string, limit = 3): Promise<Car[]> {
  const all = await getCars();
  const car = all.find((c) => c.slug === slug);
  if (!car) return [];
  return all
    .filter((c) => c.slug !== slug && c.category === car.category)
    .slice(0, limit);
}

// ── Admin reads (always fresh) ───────────────────────────────────────────────

export async function getAllCars(): Promise<AdminCar[]> {
  if (!hasDb) {
    return SEED_CARS.map((c) => ({
      ...c,
      status: c.status ?? 'available',
      published: c.published ?? true,
      imagesFull: c.images.map((url) => ({ url, publicId: '' })),
      videosFull: (c.videos ?? []).map((url) => ({ url, publicId: '' })),
      createdAt: '', // seed data has no DB timestamp
    }));
  }
  const docs = await prisma.car.findMany({ orderBy: { createdAt: 'desc' } });
  return docs.map(serialize);
}

export async function getCarById(id: string): Promise<AdminCar | null> {
  if (!hasDb) return null;
  const doc = await prisma.car.findUnique({ where: { id } });
  return doc ? serialize(doc) : null;
}
