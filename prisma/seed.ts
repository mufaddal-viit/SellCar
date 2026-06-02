/**
 * Seed the database from the static car list in src/content/cars.ts.
 * Run with:  npm run db:seed   (requires MONGODB_URI in your environment)
 *
 * Idempotent: upserts by slug, so re-running updates existing cars rather than
 * creating duplicates. Existing Cloudinary media (publicId) is preserved.
 */
import { loadEnvFile } from 'node:process';
import { PrismaClient } from '@prisma/client';
import { cars } from '../src/content/cars';
import { getDatabaseUrl } from '../src/lib/db/url';

// tsx doesn't auto-load .env files the way Next.js does — load them manually.
for (const file of ['.env', '.env.local']) {
  try {
    loadEnvFile(file);
  } catch {
    // file may not exist — ignore
  }
}

const prisma = new PrismaClient({ datasourceUrl: getDatabaseUrl() });

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Add it to your environment before seeding.');
  }

  for (const car of cars) {
    const images = car.images.map((url) => ({ url, publicId: '' }));
    const videos = (car.videos ?? []).map((url) => ({ url, publicId: '' }));

    const data = {
      name: car.name,
      brand: car.brand,
      category: car.category,
      price: car.price,
      downPayment: car.downPayment,
      emiFrom: car.emiFrom,
      tenure: car.tenure,
      year: car.year,
      fuel: car.fuel,
      transmission: car.transmission,
      mileage: car.mileage,
      seating: car.seating,
      engine: car.engine,
      power: car.power,
      features: car.features,
      description: car.description,
      badge: car.badge ?? null,
      featured: car.featured ?? false,
      status: car.status ?? 'available',
      published: car.published ?? true,
    };

    // Don't clobber real Cloudinary uploads: only (re)set media when the
    // existing record still holds seed placeholders (empty publicId) or is new.
    const existing = await prisma.car.findUnique({ where: { slug: car.slug } });
    const hasRealMedia =
      existing && [...existing.images, ...existing.videos].some((m) => m.publicId);
    const update = hasRealMedia ? data : { ...data, images, videos };

    await prisma.car.upsert({
      where: { slug: car.slug },
      update,
      create: { slug: car.slug, ...data, images, videos },
    });
    console.log(`✓ ${car.name}`);
  }

  const total = await prisma.car.count();
  console.log(`\nSeed complete. ${total} cars in the database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
