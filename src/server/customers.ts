import 'server-only';
import type { Customer as DbCustomer } from '@prisma/client';
import { prisma, hasDb } from '@/lib/db/prisma';

export const CUSTOMER_STATUSES = [
  'lead',
  'active',
  'customer',
  'closed',
  'no_deal',
  'other',
] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export interface AdminCustomer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  source: string | null;
  carInterest: string | null;
  notes: string | null;
  emailOptOut: boolean;
  /** Opted in via the home-page "notify me when my car arrives" form. */
  futureInterest: boolean;
  createdAt: string;
  /** Last time a promo/email was sent to this customer (null if never). */
  lastContactedAt: string | null;
}

function serialize(c: DbCustomer): AdminCustomer {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    status: c.status,
    source: c.source,
    carInterest: c.carInterest,
    notes: c.notes,
    emailOptOut: c.emailOptOut,
    futureInterest: c.futureInterest,
    createdAt: c.createdAt.toISOString(),
    lastContactedAt: c.lastContactedAt ? c.lastContactedAt.toISOString() : null,
  };
}

export async function listCustomers(): Promise<AdminCustomer[]> {
  if (!hasDb) return [];
  const rows = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1000,
  });
  return rows.map(serialize);
}

// Status precedence — a richer relationship shouldn't be downgraded by a later
// casual touch (e.g. an enquiry shouldn't overwrite an admin-set "closed").
const RANK: Record<string, number> = {
  lead: 1,
  active: 2,
  customer: 3,
  no_deal: 2,
  closed: 2,
  other: 1,
};

/**
 * Insert or update a customer by email (or phone). Called from the public
 * enquiry & application flows so the customer DB stays the single source.
 */
export async function upsertCustomer(data: {
  name: string;
  email?: string | null;
  phone?: string | null;
  source?: string;
  carInterest?: string | null;
  status?: string;
  /** Set true to opt the customer into future-stock alerts (sticky once on). */
  futureInterest?: boolean;
  /** Extra context (e.g. budget/timeframe) appended to the customer's notes. */
  notes?: string | null;
}): Promise<void> {
  if (!hasDb) return;
  const email = data.email?.toLowerCase().trim() || null;
  const phone = data.phone?.trim() || null;
  if (!email && !phone) return;

  const existing = await prisma.customer.findFirst({
    where: {
      OR: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    },
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
        futureInterest: data.futureInterest ?? false,
        notes: data.notes?.trim() || null,
      },
    });
    return;
  }

  const keepStatus =
    (RANK[data.status ?? 'lead'] ?? 0) > (RANK[existing.status] ?? 0)
      ? data.status!
      : existing.status;

  // Append new context to existing notes (don't clobber what's already there).
  const addNote = data.notes?.trim();
  const mergedNotes = addNote
    ? existing.notes
      ? `${existing.notes}\n${addNote}`
      : addNote
    : existing.notes;

  await prisma.customer.update({
    where: { id: existing.id },
    data: {
      name: data.name || existing.name,
      email: email ?? existing.email,
      phone: phone ?? existing.phone,
      carInterest: data.carInterest ?? existing.carInterest,
      source: existing.source ?? data.source ?? null,
      status: keepStatus,
      // Sticky: never flip an opted-in customer back off.
      futureInterest: existing.futureInterest || (data.futureInterest ?? false),
      notes: mergedNotes,
    },
  });
}
