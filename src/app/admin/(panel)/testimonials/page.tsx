import { Images, MessageSquareQuote, Smile } from 'lucide-react';
import { listFeedback, listFaces } from '@/server/testimonials';
import {
  hasCloudinary,
  TESTIMONIAL_FEEDBACK_FOLDER,
  TESTIMONIAL_FACES_FOLDER,
} from '@/lib/cloudinary';
import { TestimonialManager } from '@/components/admin/testimonial-manager';
import { StatCard } from '@/components/admin/stat-card';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const [feedback, faces] = await Promise.all([listFeedback(), listFaces()]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="display-heading text-3xl text-white">Testimonials</h1>
        <p className="mt-1 text-sm text-white/50">
          Manage what shows in the testimonials section — kept separate so each is used correctly.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Photos" value={feedback.length + faces.length} icon={Images} />
        <StatCard label="Feedback Screenshots" value={feedback.length} icon={MessageSquareQuote} />
        <StatCard label="Customer Photos" value={faces.length} icon={Smile} />
      </div>

      {!hasCloudinary && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          Cloudinary is not configured — set the <code>CLOUDINARY_*</code> variables to upload photos.
        </div>
      )}

      <TestimonialManager
        title="Feedback Screenshots"
        description="Customer feedback screenshots from WhatsApp/SMS. These appear in the swipable carousel on the home page (shown uncropped)."
        folder={TESTIMONIAL_FEEDBACK_FOLDER}
        photos={feedback}
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
