/**
 * Seed 2 sample applications for testing the admin. Idempotent (fixed ids).
 *   npx tsx prisma/seed-applications.ts
 * Note: document links are placeholders — real files only exist after a real
 * upload through the /services form.
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

const docs = [
  { kind: 'emirates_id', publicId: 'applications/seed/emirates_id', resourceType: 'image', format: 'jpg' },
  { kind: 'visa', publicId: 'applications/seed/visa', resourceType: 'image', format: 'jpg' },
  { kind: 'passport', publicId: 'applications/seed/passport', resourceType: 'image', format: 'pdf' },
  { kind: 'salary_certificate', publicId: 'applications/seed/salary_certificate', resourceType: 'image', format: 'pdf' },
];

async function main() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set.');

  const cars = await prisma.car.findMany({ where: { published: true }, take: 2 });
  const car0 = cars[0] ?? null;
  const car1 = cars[1] ?? car0;

  const samples = [
    {
      id: 'aaaaaaaaaaaaaaaaaaaaaaa1',
      slug: 'ahmed-hassan-0001',
      name: 'Ahmed Hassan',
      mobile: '+971501112233',
      email: 'ahmed.test@example.com',
      homeMobile: '+92 300 1234567',
      mother: 'Fatima Hassan',
      flat: '1203',
      building: 'Burj Al Salam',
      street: 'Sheikh Zayed Road',
      area: 'Trade Centre',
      city: 'Dubai',
      homeAddress: 'House 12, Street 5, Lahore (near Liberty Market)',
      officeAddress: 'Office 805, Boulevard Plaza, Downtown Dubai',
      officeLandline: '+971 4 555 1234',
      salaryDate: '25th',
      bankName: 'Emirates NBD',
      iban: 'AE070331234567890123456',
      loanInstallment: '',
      hasCards: 'Yes',
      cardLimit: '30000',
      cashLoan: 'No',
      ref1Name: 'Bilal Ahmed',
      ref1Mobile: '+971502223344',
      ref2Name: 'Omar Sheikh',
      ref2Mobile: '+971503334455',
      status: 'submitted',
      car: car0,
    },
    {
      id: 'aaaaaaaaaaaaaaaaaaaaaaa2',
      slug: 'sara-khan-0002',
      name: 'Sara Khan',
      mobile: '+971554445566',
      email: 'sara.test@example.com',
      homeMobile: '+91 98 7654 3210',
      mother: 'Ayesha Khan',
      flat: 'Villa 7',
      building: '',
      street: 'Al Wasl Road',
      area: 'Jumeirah 1',
      city: 'Dubai',
      homeAddress: 'Flat 4B, MG Road, Mumbai (near City Mall)',
      officeAddress: 'Floor 3, JLT Cluster F, Dubai',
      officeLandline: '+971 4 555 9876',
      salaryDate: '1st',
      bankName: 'ADCB',
      iban: 'AE120030009876543210987',
      loanInstallment: '1200',
      hasCards: 'No',
      cardLimit: '',
      cashLoan: 'Yes',
      ref1Name: 'Nadia Ali',
      ref1Mobile: '+971555556677',
      ref2Name: 'Imran Malik',
      ref2Mobile: '+971556667788',
      status: 'in_review',
      car: car1,
    },
  ];

  for (const s of samples) {
    const { id, car, ...rest } = s;
    const data = {
      ...rest,
      carId: car?.id ?? null,
      carName: car?.name ?? null,
      documents: docs,
      emailVerified: true,
    };
    await prisma.application.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
    console.log(`✓ ${s.name} → ${car?.name ?? 'no car'} (${s.status})`);
  }

  const total = await prisma.application.count();
  console.log(`\nDone. ${total} application(s) in the database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
