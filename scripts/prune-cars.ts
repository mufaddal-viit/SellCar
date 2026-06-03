/**
 * Delete cars from the database (and their Cloudinary media) that are NOT present
 * in cars-import/cardetails.json. Use it to remove old/dummy cars and keep the DB
 * in sync with the manifest.
 *
 *   npm run cars:prune          # preview what would be deleted (dry run)
 *   npm run cars:prune -- --yes # actually delete
 */
import { loadEnvFile } from 'node:process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { getDatabaseUrl } from '../src/lib/db/url';
import { slugify } from '../src/lib/utils';

for (const f of ['.env', '.env.local']) {
  try {
    loadEnvFile(f);
  } catch {
    /* optional */
  }
}

const MANIFEST = join('cars-import', 'cardetails.json');
const prisma = new PrismaClient({ datasourceUrl: getDatabaseUrl() });
const confirmed = process.argv.includes('--yes') || process.argv.includes('-y');

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set.');
  if (!existsSync(MANIFEST)) throw new Error(`Manifest not found at ${MANIFEST}.`);

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const raw = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const list: Record<string, unknown>[] = Array.isArray(raw) ? raw : raw?.cars;
  const keep = new Set(
    list.map((e) => String(e.slug || slugify(`${e.name}-${e.year}`))),
  );

  const all = await prisma.car.findMany();
  const toDelete = all.filter((c) => !keep.has(c.slug));

  if (toDelete.length === 0) {
    console.log('Nothing to prune — every car in the DB is in the manifest.');
    return;
  }

  console.log(`${toDelete.length} car(s) not in the manifest:`);
  for (const c of toDelete) console.log(`  - ${c.name} (${c.slug})`);

  if (!confirmed) {
    console.log('\nDry run. Re-run with  --yes  to delete these.');
    return;
  }

  for (const c of toDelete) {
    for (const m of c.images) {
      if (m.publicId) {
        try {
          await cloudinary.uploader.destroy(m.publicId, { resource_type: 'image' });
        } catch {
          /* best-effort */
        }
      }
    }
    for (const m of c.videos) {
      if (m.publicId) {
        try {
          await cloudinary.uploader.destroy(m.publicId, { resource_type: 'video' });
        } catch {
          /* best-effort */
        }
      }
    }
    await prisma.car.delete({ where: { id: c.id } });
    console.log(`✓ deleted ${c.name}`);
  }
  console.log(`\nPruned ${toDelete.length} car(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
