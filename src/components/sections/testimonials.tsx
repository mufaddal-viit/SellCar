import { SectionHeading } from '@/components/shared/section-heading';
import { TestimonialsCarousel } from './testimonials-carousel';
import { getTestimonialImages } from '@/lib/testimonial-images';

export function TestimonialsSection() {
  const images = getTestimonialImages();
  if (images.length === 0) return null;

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
          <TestimonialsCarousel images={images} />
        </div>
      </div>
    </section>
  );
}
