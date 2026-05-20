import { Hero } from '@/components/sections/hero';
import { FeaturedCars } from '@/components/sections/featured-cars';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { EMISection } from '@/components/sections/emi-section';
import { EMIPlansSection } from '@/components/sections/emi-plans';
import { BrandsMarquee } from '@/components/sections/brands-marquee';
import { TestimonialsSection } from '@/components/sections/testimonials';
import { FAQSection } from '@/components/sections/faq-section';
import { CTASection } from '@/components/sections/cta-section';

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandsMarquee />
      <FeaturedCars />
      <WhyChooseUs />
      <EMISection />
      <EMIPlansSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
