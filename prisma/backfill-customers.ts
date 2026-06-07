/**
 * Backfill the Customer table from existing applications + enquiry leads.
 * Safe to re-run (dedupes by email/phone).
 *   npx tsx prisma/backfill-customers.ts
 */
import { loadEnvFile } from 'node:process';
import { PrismaClient } from '@prisma/client';
import { getDatabaseUrl } from '../src/lib/db/url';

for (const f of ['.env', '.env.local']) {
  try {
    loadEnvFile(f);
  } catch {
    /* ignore */
  }
}

const prisma = new PrismaClient({ datasourceUrl: getDatabaseUrl() });

const RANK: Record<string, number> = {
  lead: 1,
  active: 2,
  customer: 3,
  no_deal: 2,
  closed: 2,
  other: 1,
};

async function upsert(data: {
  name: string;
  email?: string | null;
  phone?: string | null;
  source?: string;
  carInterest?: string | null;
  status?: string;
}) {
  const email = data.email?.toLowerCase().trim() || null;
  const phone = data.phone?.trim() || null;
  if (!email && !phone) return;

  const existing = await prisma.customer.findFirst({
    where: { OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])] },
  });

  if (!existing) {
    await prisma.customer.create({
      data: {
        name: data.name,
        email,
        phone,
        status: data.status || 'lead',
        source: data.source || 'manual',
        carInterest: data.carInterest || null,
      },
    });
    return;
  }

  const keep =
    (RANK[data.status ?? 'lead'] ?? 0) > (RANK[existing.status] ?? 0)
      ? data.status!
      : existing.status;

  await prisma.customer.update({
    where: { id: existing.id },
    data: {
      name: data.name || existing.name,
      email: email ?? existing.email,
      phone: phone ?? existing.phone,
      carInterest: data.carInterest ?? existing.carInterest,
      status: keep,
      source: existing.source ?? data.source ?? null,
    },
  });
}

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set.');

  const apps = await prisma.application.findMany();
  for (const a of apps) {
    await upsert({
      name: a.name,
      email: a.email,
      phone: a.mobile,
      source: 'application',
      carInterest: a.carName,
      status: 'active',
    });
  }

  const leads = await prisma.lead.findMany({ where: { type: 'enquiry' } });
  for (const l of leads) {
    await upsert({
      name: l.name || 'Customer',
      email: l.email,
      phone: l.phone,
      source: 'enquiry',
      carInterest: l.carName,
      status: 'lead',
    });
  }

  console.log(
    `Backfilled from ${apps.length} application(s) + ${leads.length} enquiry lead(s).`,
  );
  console.log(`Customers in DB now: ${await prisma.customer.count()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
