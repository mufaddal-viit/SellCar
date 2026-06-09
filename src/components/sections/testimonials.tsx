import { SectionHeading } from '@/components/shared/section-heading';
import { TestimonialsCarousel } from './testimonials-carousel';
import { getTestimonialFeedback } from '@/server/testimonials';

export async function TestimonialsSection() {
  const feedback = await getTestimonialFeedback();
  const feedbackUrls = feedback.map((s) => s.url);

  if (feedbackUrls.length === 0) return null;

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
        <div className="mt-14">
          <TestimonialsCarousel images={feedbackUrls} />
        </div>
      </div>
    </section>
  );
}
