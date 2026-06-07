'use server';

import { revalidatePath } from 'next/cache';
import { prisma, hasDb } from '@/lib/db/prisma';
import { leadInputSchema } from '@/lib/validation';
import { assertAdmin } from '@/lib/auth-guard';
import { upsertCustomer } from '@/server/customers';
import type { LeadStatus } from '@/types';

export interface EnquiryState {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/** Public: submit an enquiry from the contact / car page form. */
export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const parsed = leadInputSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email') ?? '',
    message: formData.get('message') ?? '',
    carId: formData.get('carId') ?? undefined,
    carName: formData.get('carName') ?? undefined,
  });

  if (!parsed.success) {
    return { error: 'Please check your details.', fieldErrors: parsed.error.flatten().fieldErrors };
  }

  if (!hasDb) {
    // Without a DB we can't store the lead; surface a graceful message.
    return { error: 'Enquiries are temporarily unavailable. Please call or WhatsApp us.' };
  }

  const d = parsed.data;
  await prisma.lead.create({
    data: {
      type: 'enquiry',
      name: d.name,
      phone: d.phone,
      email: d.email || null,
      message: d.message || null,
      carId: d.carId || null,
      carName: d.carName || null,
      status: 'new',
    },
  });

  // Mirror into the master customer database.
  await upsertCustomer({
    name: d.name,
    email: d.email || null,
    phone: d.phone,
    source: 'enquiry',
    carInterest: d.carName || null,
    status: 'lead',
  });

  revalidatePath('/admin/leads');
  revalidatePath('/admin/customers');
  revalidatePath('/admin');
  return { ok: true };
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await assertAdmin();
  if (!hasDb) return;
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath('/admin/leads');
}

export async function deleteLead(id: string) {
  await assertAdmin();
  if (!hasDb) return;
  await prisma.lead.delete({ where: { id } });
  revalidatePath('/admin/leads');
}

/** Add a lead to the master customer database (manual conversion). */
export async function convertLeadToCustomer(
  id: string,
): Promise<{ ok?: boolean; error?: string; created?: boolean }> {
  await assertAdmin();
  if (!hasDb) return { error: 'Database not configured.' };

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return { error: 'Lead not found.' };

  const email = lead.email?.toLowerCase().trim() || null;
  const phone = lead.phone?.trim() || null;
  if (!email && !phone) {
    return { error: 'This lead has no email or phone to convert.' };
  }

  // Enquiry leads are auto-mirrored into customers, so one may already exist —
  // promote it to "customer" rather than creating a duplicate.
  const existing = await prisma.customer.findFirst({
    where: { OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])] },
  });

  if (existing) {
    await prisma.customer.update({
      where: { id: existing.id },
      data: {
        status: 'customer',
        name: existing.name || lead.name || 'Customer',
        phone: existing.phone ?? phone,
        carInterest: existing.carInterest ?? lead.carName,
      },
    });
  } else {
    await prisma.customer.create({
      data: {
        name: lead.name || 'Customer',
        email,
        phone,
        status: 'customer',
        source: lead.type === 'enquiry' ? 'enquiry' : lead.type,
        carInterest: lead.carName,
      },
    });
  }

  // Mark the lead as worked so it leaves the "new" queue.
  await prisma.lead.update({ where: { id }, data: { status: 'contacted' } });

  revalidatePath('/admin/customers');
  revalidatePath('/admin/leads');
  revalidatePath('/admin');
  return { ok: true, created: !existing };
}
