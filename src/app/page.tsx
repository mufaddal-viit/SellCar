import { Hero } from '@/components/sections/hero';
import { FeaturedCars } from '@/components/sections/featured-cars';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { Requirements } from '@/components/sections/requirements';
import { BrandsMarquee } from '@/components/sections/brands-marquee';
import { TestimonialsSection } from '@/components/sections/testimonials';
import { ClientPhotos } from '@/components/sections/client-photos';
import { FAQSection } from '@/components/sections/faq-section';
import { CTASection } from '@/components/sections/cta-section';

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandsMarquee />
      <FeaturedCars />
      <WhyChooseUs />
      <Requirements />
      <TestimonialsSection />
      <ClientPhotos />
      <FAQSection />
      <CTASection />
    </>
  );
}
