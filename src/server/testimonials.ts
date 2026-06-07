import 'server-only';
import { unstable_cache } from 'next/cache';
import {
  listFolderImages,
  TESTIMONIAL_SCREENSHOTS_FOLDER,
  TESTIMONIAL_FACES_FOLDER,
  type FolderImage,
} from '@/lib/cloudinary';

export const TESTIMONIALS_TAG = 'testimonials';
export type { FolderImage };

// Cached for the public site (busted by the admin add/remove actions).
export const getTestimonialScreenshots = unstable_cache(
  () => listFolderImages(TESTIMONIAL_SCREENSHOTS_FOLDER),
  ['testimonial-screenshots'],
  { tags: [TESTIMONIALS_TAG], revalidate: 600 },
);

export const getTestimonialFaces = unstable_cache(
  () => listFolderImages(TESTIMONIAL_FACES_FOLDER),
  ['testimonial-faces'],
  { tags: [TESTIMONIALS_TAG], revalidate: 600 },
);

// Uncached — used by the admin page so add/remove reflect immediately.
export function listScreenshots(): Promise<FolderImage[]> {
  return listFolderImages(TESTIMONIAL_SCREENSHOTS_FOLDER);
}
export function listFaces(): Promise<FolderImage[]> {
  return listFolderImages(TESTIMONIAL_FACES_FOLDER);
}
