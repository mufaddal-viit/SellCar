'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { assertAdmin } from '@/lib/auth-guard';
import { destroyAsset } from '@/lib/cloudinary';
import { TESTIMONIALS_TAG } from '@/server/testimonials';

function bust() {
  revalidateTag(TESTIMONIALS_TAG);
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
}

/** Remove a testimonial/customer photo from Cloudinary. */
export async function deleteTestimonialImage(publicId: string) {
  await assertAdmin();
  await destroyAsset(publicId, 'image');
  bust();
}

/** Bust caches after new uploads (the widget uploads straight to Cloudinary). */
export async function refreshTestimonials() {
  await assertAdmin();
  bust();
}
