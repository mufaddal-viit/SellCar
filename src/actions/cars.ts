'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma, hasDb } from '@/lib/db/prisma';
import { CARS_TAG } from '@/server/cars';
import { carInputSchema } from '@/lib/validation';
import { destroyAsset } from '@/lib/cloudinary';
import { assertAdmin } from '@/lib/auth-guard';
import { slugify } from '@/lib/utils';
import type { MediaAsset } from '@/types';

export interface SaveCarState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

function revalidateCars(slug?: string) {
  revalidateTag(CARS_TAG);
  revalidatePath('/');
  revalidatePath('/cars');
  if (slug) revalidatePath(`/cars/${slug}`);
}

async function uniqueSlug(name: string, year: number, currentId?: string): Promise<string> {
  const baseRaw = slugify(`${name}-${year}`) || slugify(name) || 'car';
  let candidate = baseRaw;
  let n = 2;
  // Loop until we find a slug not used by another car.
  // (Small inventory — a handful of iterations at most.)
  while (true) {
    const existing = await prisma.car.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === currentId) return candidate;
    candidate = `${baseRaw}-${n++}`;
  }
}

const mediaForDb = (list: MediaAsset[]) =>
  list.map((m) => ({
    url: m.url,
    publicId: m.publicId,
    width: m.width ?? null,
    height: m.height ?? null,
  }));

export async function saveCar(
  id: string | null,
  input: unknown,
): Promise<SaveCarState> {
  await assertAdmin();
  if (!hasDb) return { error: 'Database is not configured (MONGODB_URI missing).' };

  const parsed = carInputSchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Please fix the highlighted fields.', fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const slug = await uniqueSlug(data.name, data.year, id ?? undefined);

  const common = {
    slug,
    name: data.name,
    brand: data.brand,
    category: data.category,
    price: data.price,
    downPayment: data.downPayment,
    emiFrom: data.emiFrom,
    tenure: data.tenure,
    year: data.year,
    fuel: data.fuel,
    transmission: data.transmission,
    mileage: data.mileage,
    seating: data.seating,
    engine: data.engine,
    power: data.power,
    features: data.features,
    description: data.description,
    badge: data.badge ?? null,
    featured: data.featured,
    status: data.status,
    published: data.published,
  };

  if (!id) {
    await prisma.car.create({
      data: {
        ...common,
        images: mediaForDb(data.images),
        videos: mediaForDb(data.videos),
        soldAt: data.status === 'sold' ? new Date() : null,
      },
    });
  } else {
    const existing = await prisma.car.findUnique({ where: { id } });
    if (!existing) return { error: 'Car not found.' };

    // Delete media that was removed in this edit.
    const keptIds = new Set([...data.images, ...data.videos].map((m) => m.publicId));
    const removedImages = existing.images.filter((m) => m.publicId && !keptIds.has(m.publicId));
    const removedVideos = existing.videos.filter((m) => m.publicId && !keptIds.has(m.publicId));
    await Promise.all([
      ...removedImages.map((m) => destroyAsset(m.publicId, 'image')),
      ...removedVideos.map((m) => destroyAsset(m.publicId, 'video')),
    ]);

    const soldAt =
      data.status === 'sold'
        ? existing.soldAt ?? new Date()
        : null;

    await prisma.car.update({
      where: { id },
      data: {
        ...common,
        images: { set: mediaForDb(data.images) },
        videos: { set: mediaForDb(data.videos) },
        soldAt,
      },
    });
  }

  revalidateCars(slug);
  redirect('/admin/cars');
}

export async function deleteCar(id: string) {
  await assertAdmin();
  if (!hasDb) return;
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) return;
  await Promise.all([
    ...car.images.map((m) => m.publicId && destroyAsset(m.publicId, 'image')),
    ...car.videos.map((m) => m.publicId && destroyAsset(m.publicId, 'video')),
  ]);
  await prisma.car.delete({ where: { id } });
  revalidateCars(car.slug);
  revalidatePath('/admin/cars');
}

export async function setStatus(id: string, status: 'available' | 'reserved' | 'sold') {
  await assertAdmin();
  if (!hasDb) return;
  const car = await prisma.car.update({
    where: { id },
    data: {
      status,
      soldAt: status === 'sold' ? new Date() : null,
    },
  });
  revalidateCars(car.slug);
  revalidatePath('/admin/cars');
}

export async function toggleFeatured(id: string, featured: boolean) {
  await assertAdmin();
  if (!hasDb) return;
  const car = await prisma.car.update({ where: { id }, data: { featured } });
  revalidateCars(car.slug);
  revalidatePath('/admin/cars');
}

export async function togglePublished(id: string, published: boolean) {
  await assertAdmin();
  if (!hasDb) return;
  const car = await prisma.car.update({ where: { id }, data: { published } });
  revalidateCars(car.slug);
  revalidatePath('/admin/cars');
}
