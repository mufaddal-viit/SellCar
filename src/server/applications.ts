import 'server-only';
import type { Application as DbApplication } from '@prisma/client';
import { prisma, hasDb } from '@/lib/db/prisma';
import { signedDocUrl } from '@/lib/cloudinary';

export interface AppDoc {
  kind: string;
  publicId: string;
  resourceType: string;
  format: string;
}

export interface AdminApplication {
  id: string;
  slug: string | null;
  name: string;
  mobile: string;
  email: string;
  homeMobile: string | null;
  mother: string | null;
  flat: string | null;
  building: string | null;
  street: string | null;
  area: string | null;
  city: string | null;
  homeAddress: string | null;
  officeAddress: string | null;
  officeLandline: string | null;
  salaryDate: string | null;
  bankName: string | null;
  iban: string | null;
  loanInstallment: string | null;
  hasCards: string | null;
  cardLimit: string | null;
  cashLoan: string | null;
  ref1Name: string | null;
  ref1Mobile: string | null;
  ref2Name: string | null;
  ref2Mobile: string | null;
  documents: AppDoc[];
  /** Signed, time-limited URLs — only populated on the detail view. */
  documentUrls?: { kind: string; url: string }[];
  carId: string | null;
  carName: string | null;
  status: string;
  reviewNote: string | null;
  createdAt: string;
}

export interface PublicApplication {
  ref: string;
  carName: string | null;
  status: string;
  reviewNote: string | null;
  documents: string[];
  createdAt: string;
}

function serialize(a: DbApplication): AdminApplication {
  return {
    id: a.id,
    slug: a.slug,
    name: a.name,
    mobile: a.mobile,
    email: a.email,
    homeMobile: a.homeMobile,
    mother: a.mother,
    flat: a.flat,
    building: a.building,
    street: a.street,
    area: a.area,
    city: a.city,
    homeAddress: a.homeAddress,
    officeAddress: a.officeAddress,
    officeLandline: a.officeLandline,
    salaryDate: a.salaryDate,
    bankName: a.bankName,
    iban: a.iban,
    loanInstallment: a.loanInstallment,
    hasCards: a.hasCards,
    cardLimit: a.cardLimit,
    cashLoan: a.cashLoan,
    ref1Name: a.ref1Name,
    ref1Mobile: a.ref1Mobile,
    ref2Name: a.ref2Name,
    ref2Mobile: a.ref2Mobile,
    documents: a.documents.map((d) => ({
      kind: d.kind,
      publicId: d.publicId,
      resourceType: d.resourceType,
      format: d.format,
    })),
    carId: a.carId,
    carName: a.carName,
    status: a.status,
    reviewNote: a.reviewNote,
    createdAt: a.createdAt.toISOString(),
  };
}

export async function listApplications(): Promise<AdminApplication[]> {
  if (!hasDb) return [];
  const docs = await prisma.application.findMany({
    orderBy: { createdAt: 'desc' },
    take: 300,
  });
  return docs.map(serialize);
}

/** Public, privacy-safe lookup by verified email (for the status page). */
export async function getApplicationsByEmail(email: string): Promise<PublicApplication[]> {
  if (!hasDb) return [];
  const docs = await prisma.application.findMany({
    where: { email: email.toLowerCase() },
    orderBy: { createdAt: 'desc' },
  });
  return docs.map((a) => ({
    ref: a.id.slice(-6).toUpperCase(),
    carName: a.carName,
    status: a.status,
    reviewNote: a.reviewNote,
    documents: a.documents.map((d) => d.kind),
    createdAt: a.createdAt.toISOString(),
  }));
}

function withDocUrls(a: DbApplication): AdminApplication {
  const app = serialize(a);
  app.documentUrls = a.documents.map((d) => ({
    kind: d.kind,
    url: signedDocUrl(d.publicId, d.resourceType, d.format),
  }));
  return app;
}

export async function getApplicationById(id: string): Promise<AdminApplication | null> {
  if (!hasDb) return null;
  const a = await prisma.application.findUnique({ where: { id } });
  return a ? withDocUrls(a) : null;
}

/** Look up by the human-friendly slug used in admin URLs (falls back to id). */
export async function getApplicationBySlug(slug: string): Promise<AdminApplication | null> {
  if (!hasDb) return null;
  let a = await prisma.application.findFirst({ where: { slug } });
  if (!a && /^[a-f0-9]{24}$/i.test(slug)) {
    a = await prisma.application.findUnique({ where: { id: slug } });
  }
  return a ? withDocUrls(a) : null;
}
