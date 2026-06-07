'use server';

import { revalidatePath } from 'next/cache';
import { prisma, hasDb } from '@/lib/db/prisma';
import { hasEmail, sendPromoEmail } from '@/lib/email';
import { assertAdmin } from '@/lib/auth-guard';
import { siteConfig } from '@/content/site';

export interface ActionState {
  ok?: boolean;
  error?: string;
}

export async function createCustomer(input: {
  name: string;
  email?: string;
  phone?: string;
  status?: string;
  notes?: string;
}): Promise<ActionState> {
  await assertAdmin();
  if (!hasDb) return { error: 'Database not configured.' };
  if (!input.name?.trim()) return { error: 'Name is required.' };
  if (!input.email?.trim() && !input.phone?.trim()) {
    return { error: 'Add an email or phone number.' };
  }
  await prisma.customer.create({
    data: {
      name: input.name.trim(),
      email: input.email?.toLowerCase().trim() || null,
      phone: input.phone?.trim() || null,
      status: input.status || 'lead',
      source: 'manual',
      notes: input.notes?.trim() || null,
    },
  });
  revalidatePath('/admin/customers');
  return { ok: true };
}

export async function updateCustomer(
  id: string,
  data: Partial<{ name: string; email: string; phone: string; status: string; notes: string }>,
): Promise<ActionState> {
  await assertAdmin();
  if (!hasDb) return { error: 'Database not configured.' };
  await prisma.customer.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.email !== undefined ? { email: data.email.toLowerCase().trim() || null } : {}),
      ...(data.phone !== undefined ? { phone: data.phone.trim() || null } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.notes !== undefined ? { notes: data.notes.trim() || null } : {}),
    },
  });
  revalidatePath('/admin/customers');
  return { ok: true };
}

export async function deleteCustomer(id: string) {
  await assertAdmin();
  if (!hasDb) return;
  await prisma.customer.delete({ where: { id } });
  revalidatePath('/admin/customers');
}

export interface SendPromoState {
  ok?: boolean;
  error?: string;
  sent?: number;
  skipped?: number;
  failed?: number;
}

/** Send a promotional template to the selected customers (individual or bulk). */
export async function sendPromo(
  ids: string[],
  templateId: string,
): Promise<SendPromoState> {
  await assertAdmin();
  if (!hasDb) return { error: 'Database not configured.' };
  if (!hasEmail) return { error: 'Email is not configured.' };
  if (!ids.length) return { error: 'Select at least one customer.' };
  if (ids.length > 200) return { error: 'Please send to 200 customers or fewer at a time.' };

  const customers = await prisma.customer.findMany({ where: { id: { in: ids } } });

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const c of customers) {
    if (!c.email || c.emailOptOut) {
      skipped++;
      continue;
    }
    try {
      await sendPromoEmail(c.email, templateId, {
        name: c.name,
        unsubscribeUrl: `${siteConfig.url}/unsubscribe?c=${c.id}`,
      });
      sent++;
    } catch {
      failed++;
    }
  }

  if (sent > 0) {
    await prisma.customer.updateMany({
      where: { id: { in: customers.filter((c) => c.email && !c.emailOptOut).map((c) => c.id) } },
      data: { lastContactedAt: new Date() },
    });
  }

  revalidatePath('/admin/customers');
  return { ok: true, sent, skipped, failed };
}
