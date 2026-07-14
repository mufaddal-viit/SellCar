/**
 * Recompute every car's stored `emiFrom` using the flat-rate finance model.
 *
 * Basis for the "EMI from" (cheapest) monthly:
 *   - 60 months tenure
 *   - 0 down payment (profit on full price)
 *   - 5.15% flat per annum
 *
 *   emiFrom = price × (1 + 0.0515 × 5) / 60  =  price × 1.2575 / 60
 *
 *   npm run cars:emi            # preview old → new (dry run, no writes)
 *   npm run cars:emi -- --yes   # write the new emiFrom values
 */
import { loadEnvFile } from 'node:process';
import { PrismaClient } from '@prisma/client';
import { getDatabaseUrl } from '../src/lib/db/url';
import { calculateFlatEMI, FLAT_RATE, formatEMI } from '../src/lib/utils';

for (const f of ['.env', '.env.local']) {
  try {
    loadEnvFile(f);
  } catch {
    /* optional */
  }
}

const TENURE_MONTHS = 60;
const DOWN_PAYMENT = 0;

const prisma = new PrismaClient({ datasourceUrl: getDatabaseUrl() });
const confirmed = process.argv.includes('--yes') || process.argv.includes('-y');

function newEmiFor(price: number): number {
  const { monthly } = calculateFlatEMI(
    price,
    DOWN_PAYMENT,
    TENURE_MONTHS,
    FLAT_RATE,
  );
  return Math.round(monthly);
}

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set.');

  const cars = await prisma.car.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, slug: true, name: true, price: true, emiFrom: true },
  });

  if (cars.length === 0) {
    console.log('No cars in the database.');
    return;
  }

  console.log(
    `Flat model: ${FLAT_RATE}% p.a. · ${TENURE_MONTHS} months · ${DOWN_PAYMENT} down\n`,
  );
  console.log(
    'name'.padEnd(34) +
      'price'.padStart(12) +
      'old emiFrom'.padStart(14) +
      'new emiFrom'.padStart(14),
  );
  console.log('-'.repeat(74));

  const updates: { id: string; newEmi: number }[] = [];
  for (const c of cars) {
    const newEmi = newEmiFor(c.price);
    updates.push({ id: c.id, newEmi });
    const changed = Math.round(c.emiFrom) !== newEmi ? '  *' : '';
    console.log(
      c.name.slice(0, 33).padEnd(34) +
        formatEMI(c.price).padStart(12) +
        formatEMI(c.emiFrom).padStart(14) +
        (formatEMI(newEmi) + changed).padStart(14),
    );
  }

  const changedCount = cars.filter(
    (c, i) => Math.round(c.emiFrom) !== updates[i].newEmi,
  ).length;
  console.log('-'.repeat(74));
  console.log(`${changedCount} of ${cars.length} car(s) would change (marked *).`);

  if (!confirmed) {
    console.log('\nDry run. Re-run with  --yes  to write these values.');
    return;
  }

  let written = 0;
  for (const u of updates) {
    await prisma.car.update({
      where: { id: u.id },
      data: { emiFrom: u.newEmi },
    });
    written++;
  }
  console.log(`\n✓ Updated emiFrom on ${written} car(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
