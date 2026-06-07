import { listScreenshots, listFaces } from '@/server/testimonials';
import {
  hasCloudinary,
  TESTIMONIAL_SCREENSHOTS_FOLDER,
  TESTIMONIAL_FACES_FOLDER,
} from '@/lib/cloudinary';
import { TestimonialManager } from '@/components/admin/testimonial-manager';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const [screenshots, faces] = await Promise.all([listScreenshots(), listFaces()]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="display-heading text-3xl text-white">Testimonials</h1>
        <p className="mt-1 text-sm text-white/50">
          Manage what shows in the testimonials section — kept separate so each is used correctly.
        </p>
      </div>

      {!hasCloudinary && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          Cloudinary is not configured — set the <code>CLOUDINARY_*</code> variables to upload photos.
        </div>
      )}

      <TestimonialManager
        title="Feedback Screenshots"
        description="Customer feedback screenshots from WhatsApp/SMS. These appear in the swipable carousel on the home page (shown uncropped)."
        folder={TESTIMONIAL_SCREENSHOTS_FOLDER}
        photos={screenshots}
        aspect="aspect-[3/4]"
      />

      <TestimonialManager
        title="Customer Photos (Happy Faces)"
        description="Photos of happy customers with their cars. These appear as a gallery below the carousel."
        folder={TESTIMONIAL_FACES_FOLDER}
        photos={faces}
        aspect="aspect-square"
      />
    </div>
  );
}
