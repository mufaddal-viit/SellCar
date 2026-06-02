import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { CarCard } from '@/components/cars/car-card';
import { Button } from '@/components/ui/button';
import { getFeaturedCars } from '@/server/cars';

export async function FeaturedCars() {
  const featured = await getFeaturedCars();
  return (
    <section className="section bg-brand-black">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <SectionHeading
            eyebrow="Trending Now"
            title="Featured cars,"
            highlight="hand-picked."
            description="Our most-loved vehicles this season — premium quality, irresistible EMIs."
          />
          <Button asChild variant="outline" size="sm" className="self-start md:self-end">
            <Link href="/cars">
              View All Cars
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {featured.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
