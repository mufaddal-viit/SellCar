/**
 * Bulk car importer.
 *
 * Reads cars-import/cars.json (details) + one image folder per car, uploads the
 * media to Cloudinary, and upserts each car (by slug) into the database.
 *
 *   1. Put images in   cars-import/<folder>/   (one folder per car)
 *   2. Describe each car in  cars-import/cars.json  (see cars-import/README.md)
 *   3. Run:  npm run import:cars
 *
 * Idempotent: uses deterministic Cloudinary public_ids (overwrite) and replaces
 * the car's media with exactly what's in the folder. Re-run as often as you like.
 * Requires MONGODB_URI + CLOUDINARY_* in your .env.
 */
import { loadEnvFile } from 'node:process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { getDatabaseUrl } from '../src/lib/db/url';
import { carInputSchema } from '../src/lib/validation';
import { slugify } from '../src/lib/utils';

for (const f of ['.env', '.env.local']) {
  try {
    loadEnvFile(f);
  } catch {
    /* optional */
  }
}

const IMPORT_DIR = 'cars-import';
const MANIFEST = join(IMPORT_DIR, 'cardetails.json');
const ROOT_FOLDER = process.env.CLOUDINARY_FOLDER_NAME || 'driveeasy/cars';
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);
const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm', '.m4v']);

const naturalSort = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

const prisma = new PrismaClient({ datasourceUrl: getDatabaseUrl() });

interface Asset {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set.');
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error('Cloudinary credentials (CLOUDINARY_*) are not set.');
  }
  if (!existsSync(MANIFEST)) {
    throw new Error(`Manifest not found at ${MANIFEST}. See cars-import/README.md.`);
  }

  // Map the inventory JSON's field names onto the car schema fields.
  const normalize = (entry: Record<string, unknown>) => ({
    ...entry,
    price: entry.price ?? entry.priceAed,
    emiFrom: entry.emiFrom ?? entry.monthlyAed,
    downPayment: entry.downPayment ?? (entry.zeroDownpayment ? 0 : 0),
    tenure: entry.tenure ?? 60,
  });

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const raw = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const manifest: Record<string, unknown>[] = Array.isArray(raw) ? raw : raw?.cars;
  if (!Array.isArray(manifest)) {
    throw new Error('cardetails.json must be an array or an object with a "cars" array.');
  }

  let imported = 0;
  let skipped = 0;

  for (const entry of manifest) {
    const name = String(entry.name ?? '').trim();
    const year = Number(entry.year ?? 0);
    if (!name) {
      console.warn('⚠ Skipping entry with no "name".');
      skipped++;
      continue;
    }
    const slug = String(entry.slug || slugify(`${name}-${year}`));
    const folderName = String(entry.imagesFolder || entry.folder || slug);
    const folderPath = join(IMPORT_DIR, folderName);

    if (!existsSync(folderPath)) {
      console.warn(`⚠ ${name}: image folder not found (${folderPath}) — skipping.`);
      skipped++;
      continue;
    }

    const files = readdirSync(folderPath)
      .filter((f) => statSync(join(folderPath, f)).isFile())
      .filter((f) => {
        const ext = extname(f).toLowerCase();
        return IMAGE_EXT.has(ext) || VIDEO_EXT.has(ext);
      })
      .sort(naturalSort);

    console.log(`\n→ ${name} (${slug}) — ${files.length} file(s)`);

    const images: Asset[] = [];
    const videos: Asset[] = [];
    for (const file of files) {
      const ext = extname(file).toLowerCase();
      const isVideo = VIDEO_EXT.has(ext);
      const res = await cloudinary.uploader.upload(join(folderPath, file), {
        folder: `${ROOT_FOLDER}/${slug}`,
        public_id: basename(file, extname(file)),
        overwrite: true,
        unique_filename: false,
        resource_type: isVideo ? 'video' : 'image',
      });
      const asset: Asset = {
        url: res.secure_url,
        publicId: res.public_id,
        width: res.width,
        height: res.height,
      };
      (isVideo ? videos : images).push(asset);
      console.log(`   ↑ ${file}`);
    }

    // Validate details (+ uploaded media) against the same schema the admin uses.
    const parsed = carInputSchema.safeParse({ ...normalize(entry), images, videos });
    if (!parsed.success) {
      console.error(`   ✗ ${name}: invalid details`, parsed.error.flatten().fieldErrors);
      skipped++;
      continue;
    }
    const { images: imgs, videos: vids, badge, status, ...rest } = parsed.data;

    // Clean up any media removed from the folder since the last run.
    const existing = await prisma.car.findUnique({ where: { slug } });
    if (existing) {
      const keep = new Set([...imgs, ...vids].map((m) => m.publicId));
      const removedImg = existing.images.filter((m) => m.publicId && !keep.has(m.publicId));
      const removedVid = existing.videos.filter((m) => m.publicId && !keep.has(m.publicId));
      for (const m of removedImg) {
        try {
          await cloudinary.uploader.destroy(m.publicId, { resource_type: 'image' });
        } catch {
          /* best-effort */
        }
      }
      for (const m of removedVid) {
        try {
          await cloudinary.uploader.destroy(m.publicId, { resource_type: 'video' });
        } catch {
          /* best-effort */
        }
      }
    }

    const soldAt =
      status === 'sold' ? existing?.soldAt ?? new Date() : null;
    const common = { ...rest, badge: badge ?? null, status };

    await prisma.car.upsert({
      where: { slug },
      update: { ...common, images: { set: imgs }, videos: { set: vids }, soldAt },
      create: { slug, ...common, images: imgs, videos: vids, soldAt },
    });

    console.log(`   ✓ saved (${imgs.length} image(s), ${vids.length} video(s))`);
    imported++;
  }

  console.log(`\nDone. ${imported} car(s) imported, ${skipped} skipped.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
