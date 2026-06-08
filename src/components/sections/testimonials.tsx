import Image from 'next/image';
import { SectionHeading } from '@/components/shared/section-heading';
import { TestimonialsCarousel } from './testimonials-carousel';
import {
  getTestimonialFeedback,
  getTestimonialFaces,
  type FolderImage,
} from '@/server/testimonials';

export async function TestimonialsSection() {
  const [feedback, faces] = await Promise.all([
    getTestimonialFeedback(),
    getTestimonialFaces(),
  ]);

  const feedbackUrls = feedback.map((s) => s.url);

  if (feedbackUrls.length === 0 && faces.length === 0) return null;

  return (
    <section className="section overflow-hidden bg-brand-black">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Real Stories"
          title="What our"
          highlight="customers say."
          description="Real feedback from customers who drove home with Buy&Drive Cars."
          align="center"
        />

        {feedbackUrls.length > 0 && (
          <div className="mt-14">
            <TestimonialsCarousel images={feedbackUrls} />
          </div>
        )}

        {faces.length > 0 && <HappyCustomers photos={faces} />}
      </div>
    </section>
  );
}

function HappyCustomers({ photos }: { photos: FolderImage[] }) {
  return (
    <div className="mt-16">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
        Happy customers
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {photos.map((p) => (
          <div
            key={p.publicId}
            className="relative aspect-square overflow-hidden rounded-2xl border border-white/[0.08]"
          >
            <Image
              src={p.url}
              alt="Happy Buy&Drive Cars customer"
              fill
              sizes="(min-width:1024px) 220px, (min-width:640px) 30vw, 45vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
