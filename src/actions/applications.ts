'use server';

import { revalidatePath } from 'next/cache';
import { prisma, hasDb } from '@/lib/db/prisma';
import { destroyDoc } from '@/lib/cloudinary';
import { verifyEmailToken } from '@/lib/otp';
import { hasEmail, sendApprovedEmail, sendRejectedEmail } from '@/lib/email';
import { assertAdmin } from '@/lib/auth-guard';
import { applicationSubmitSchema, REQUIRED_DOC_KINDS } from '@/lib/validation';

export interface SubmitState {
  ok?: boolean;
  error?: string;
}

/** Public: final submission of a verified application. */
export async function submitApplication(
  token: string,
  input: unknown,
): Promise<SubmitState> {
  if (!hasDb) return { error: 'Service temporarily unavailable. Please try again later.' };

  const session = await verifyEmailToken(token);
  if (!session) {
    return { error: 'Your verification expired. Please verify your email again.' };
  }

  const parsed = applicationSubmitSchema.safeParse(input);
  if (!parsed.success) return { error: 'Please check the highlighted fields and try again.' };
  const d = parsed.data;

  if (d.email.toLowerCase() !== session.email.toLowerCase()) {
    return { error: 'Email does not match the verified address.' };
  }

  const have = new Set(d.documents.map((x) => x.kind));
  if (REQUIRED_DOC_KINDS.some((k) => !have.has(k))) {
    return { error: 'Please upload all required documents.' };
  }

  // Link the selected car (snapshot its name).
  let carId: string | null = null;
  let carName: string | null = d.carName ?? null;
  if (d.carId && /^[a-f0-9]{24}$/i.test(d.carId)) {
    const car = await prisma.car.findUnique({ where: { id: d.carId } });
    if (car) {
      carId = car.id;
      carName = car.name;
    }
  }

  try {
    await prisma.application.create({
      data: {
        id: session.appId,
        name: d.name,
        mobile: d.mobile,
        email: session.email,
        homeMobile: d.homeMobile || null,
        mother: d.mother || null,
        flat: d.flat || null,
        building: d.building || null,
        street: d.street || null,
        area: d.area || null,
        city: d.city || null,
        homeAddress: d.homeAddress || null,
        officeAddress: d.officeAddress || null,
        officeLandline: d.officeLandline || null,
        salaryDate: d.salaryDate || null,
        bankName: d.bankName || null,
        iban: d.iban || null,
        loanInstallment: d.loanInstallment || null,
        hasCards: d.hasCards || null,
        cardLimit: d.cardLimit || null,
        cashLoan: d.cashLoan || null,
        ref1Name: d.ref1Name || null,
        ref1Mobile: d.ref1Mobile || null,
        ref2Name: d.ref2Name || null,
        ref2Mobile: d.ref2Mobile || null,
        documents: d.documents.map((x) => ({
          kind: x.kind,
          publicId: x.publicId,
          resourceType: x.resourceType,
          format: x.format,
        })),
        carId,
        carName,
        status: 'submitted',
        emailVerified: true,
      },
    });
  } catch {
    return { error: 'Could not submit your application. Please try again.' };
  }

  revalidatePath('/admin/applications');
  revalidatePath('/admin');
  return { ok: true };
}

// ── Admin ────────────────────────────────────────────────────────────────────

export type AppStatus = 'submitted' | 'in_review' | 'approved' | 'rejected';

export interface ReviewState {
  ok?: boolean;
  error?: string;
  emailed?: boolean;
}

/**
 * Update an application's status + review note. When set to approved/rejected,
 * the applicant is emailed (rejection includes the note as the reason).
 */
export async function reviewApplication(
  id: string,
  status: AppStatus,
  note: string,
): Promise<ReviewState> {
  await assertAdmin();
  if (!hasDb) return { error: 'Database not configured.' };

  const app = await prisma.application.findUnique({ where: { id } });
  if (!app) return { error: 'Application not found.' };

  await prisma.application.update({
    where: { id },
    data: { status, reviewNote: note.trim() || null },
  });

  let emailed = false;
  if (hasEmail && (status === 'approved' || status === 'rejected')) {
    try {
      if (status === 'approved') {
        await sendApprovedEmail(app.email, { name: app.name, carName: app.carName });
      } else {
        await sendRejectedEmail(app.email, {
          name: app.name,
          carName: app.carName,
          reason: note.trim() || null,
        });
      }
      emailed = true;
    } catch {
      // status was still saved; surface that the email didn't go out
      revalidatePath('/admin/applications');
      revalidatePath(`/admin/applications/${id}`);
      return { ok: true, emailed: false, error: 'Status saved, but the email could not be sent.' };
    }
  }

  revalidatePath('/admin/applications');
  revalidatePath(`/admin/applications/${id}`);
  return { ok: true, emailed };
}

export async function deleteApplication(id: string) {
  await assertAdmin();
  if (!hasDb) return;
  const app = await prisma.application.findUnique({ where: { id } });
  if (!app) return;
  await Promise.all(
    app.documents.map((doc) => destroyDoc(doc.publicId, doc.resourceType)),
  );
  await prisma.application.delete({ where: { id } });
  revalidatePath('/admin/applications');
}
