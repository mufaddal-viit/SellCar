import 'server-only';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Lists customer-feedback screenshots from /public/testimonials.
 * Drop images in that folder — no code change needed (picked up on build).
 */
export function getTestimonialImages(): string[] {
  try {
    const dir = join(process.cwd(), 'public', 'testimonials');
    return readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort()
      .map((f) => `/testimonials/${f}`);
  } catch {
    return [];
  }
}
