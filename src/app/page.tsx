import { Hero } from '@/components/sections/hero';
import { getCars } from '@/server/cars';
import { FeaturedCars } from '@/components/sections/featured-cars';
import { CarWishlist } from '@/components/sections/car-wishlist';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { Requirements } from '@/components/sections/requirements';
import { BrandsMarquee } from '@/components/sections/brands-marquee';
import { TestimonialsSection } from '@/components/sections/testimonials';
import { ClientPhotos } from '@/components/sections/client-photos';
import { FAQSection } from '@/components/sections/faq-section';
import { CTASection } from '@/components/sections/cta-section';

export default async function HomePage() {
  const cars = await getCars();
  return (
    <>
      <Hero carCount={cars.length} />
      <BrandsMarquee />
      <FeaturedCars />
      <CarWishlist />
      <WhyChooseUs />
      <Requirements />
      <TestimonialsSection />
      <ClientPhotos />
      <FAQSection />
      <CTASection />
    </>
  );
}
