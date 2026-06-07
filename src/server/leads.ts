import 'server-only';
import type { Lead as DbLead } from '@prisma/client';
import { prisma, hasDb } from '@/lib/db/prisma';
import type { Lead, LeadStatus, LeadType } from '@/types';

export const LEADS_TAG = 'leads';

function serialize(doc: DbLead): Lead {
  return {
    id: doc.id,
    type: doc.type as LeadType,
    name: doc.name ?? undefined,
    phone: doc.phone ?? undefined,
    email: doc.email ?? undefined,
    message: doc.message ?? undefined,
    carId: doc.carId ?? undefined,
    carName: doc.carName ?? undefined,
    status: doc.status as LeadStatus,
    createdAt: doc.createdAt.toISOString(),
  };
}

/** Enquiry-form submissions for the admin inbox (excludes click events). */
export async function listEnquiries(): Promise<Lead[]> {
  if (!hasDb) return [];
  const docs = await prisma.lead.findMany({
    where: { type: 'enquiry' },
    orderBy: { createdAt: 'desc' },
    take: 300,
  });
  return docs.map(serialize);
}

/**
 * All leads of every type (enquiry forms + WhatsApp/call click events) for the
 * admin inbox. Fetches the latest batch; the UI filters by type client-side.
 */
export async function listLeads(): Promise<Lead[]> {
  if (!hasDb) return [];
  const docs = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    take: 300,
  });
  return docs.map(serialize);
}
