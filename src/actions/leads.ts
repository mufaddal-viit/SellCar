'use server';

import { revalidatePath } from 'next/cache';
import { prisma, hasDb } from '@/lib/db/prisma';
import { leadInputSchema } from '@/lib/validation';
import { assertAdmin } from '@/lib/auth-guard';
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

  revalidatePath('/admin/leads');
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
