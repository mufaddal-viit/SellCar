import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Fuel,
  Gauge,
  Users,
  Calendar,
  Cog,
  Zap,
} from 'lucide-react';
import { CarGallery } from '@/components/cars/car-gallery';
import { CarCard } from '@/components/cars/car-card';
import { CarCta } from '@/components/cars/car-cta';
import { EnquiryForm } from '@/components/shared/enquiry-form';
import { EMICalculator } from '@/components/emi/emi-calculator';
import { Badge } from '@/components/ui/badge';
import { VehicleJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';
import { getCarBySlug, getRelatedCars, getCars } from '@/server/cars';
import { formatPrice, formatEMI } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const cars = await getCars();
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return { title: 'Car not found' };
  return {
    title: `${car.name} on EMI from ${formatEMI(car.emiFrom)}/mo`,
    description: `${car.description} Available on flexible EMI starting at ${formatEMI(car.emiFrom)}/month. Get approved in 24 hours.`,
    alternates: { canonical: `/cars/${car.slug}` },
    openGraph: {
      title: `${car.name} — ${formatPrice(car.price)} | EMI from ${formatEMI(car.emiFrom)}/mo`,
      description: car.description,
      images: car.images,
    },
  };
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) notFound();

  const related = await getRelatedCars(slug);
  const isSold = car.status === 'sold';
  const isReserved = car.status === 'reserved';

  return (
    <article className="bg-brand-black">
      <VehicleJsonLd car={car} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Cars', href: '/cars' },
          { name: car.name, href: `/cars/${car.slug}` },
        ]}
      />

      <div className="container-wide pt-8 pb-4">
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all cars
        </Link>
      </div>

      <div className="container-wide py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-14">
          <div>
            <CarGallery images={car.images} alt={car.name} />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-red">
                {car.brand} · {car.year}
              </span>
              {isSold ? (
                <Badge variant="muted">Sold</Badge>
              ) : isReserved ? (
                <Badge variant="outline">Reserved</Badge>
              ) : (
                car.badge && <Badge>{car.badge}</Badge>
              )}
            </div>

            <h1 className="display-heading text-4xl md:text-5xl text-white leading-tight">
              {car.name}
            </h1>

            <p className="mt-5 text-white/70 leading-relaxed">
              {car.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-px bg-white/[0.06] border border-white/[0.06]">
              <Spec
                icon={<Fuel className="w-4 h-4" />}
                label="Fuel"
                value={car.fuel}
              />
              <Spec
                icon={<Cog className="w-4 h-4" />}
                label="Transmission"
                value={car.transmission}
              />
              <Spec
                icon={<Gauge className="w-4 h-4" />}
                label="Mileage"
                value={car.mileage}
              />
              <Spec
                icon={<Users className="w-4 h-4" />}
                label="Seating"
                value={`${car.seating} People`}
              />
              <Spec
                icon={<Zap className="w-4 h-4" />}
                label="Power"
                value={car.power}
              />
              <Spec
                icon={<Calendar className="w-4 h-4" />}
                label="Engine"
                value={car.engine}
              />
            </div>

            <div className="mt-8 bg-brand-black-soft border border-white/[0.06] p-6">
              <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                    EMI from
                  </div>
                  <div className="mt-1 font-display text-4xl font-bold text-brand-red">
                    {formatEMI(car.emiFrom)}
                    <span className="text-sm text-white/50 font-medium">
                      /month
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                    On-Road Price
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold text-white">
                    {formatPrice(car.price)}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.06] text-xs text-white/50">
                Down payment from {formatPrice(car.downPayment)} · Tenure up to {car.tenure} months
              </div>
            </div>

            <CarCta
              carId={car.id}
              carName={car.name}
              emiFrom={car.emiFrom}
              status={car.status}
            />
          </div>
        </div>
      </div>

      <section className="border-t border-white/[0.06] bg-brand-black-soft">
        <div className="container-wide py-16 md:py-24">
          <h2 className="display-heading text-3xl md:text-4xl text-white mb-10">
            Features &{' '}
            <span className="italic text-brand-red">specifications</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4">
            {car.features.map((f) => (
              <div
                key={f}
                className="flex items-center gap-3 py-3 border-b border-white/[0.06]"
              >
                <Check
                  className="w-5 h-5 text-brand-red shrink-0"
                  strokeWidth={2.5}
                />
                <span className="text-white/85">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06]">
        <div className="container-wide py-16 md:py-24">
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-brand-red" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
                Customize Your Plan
              </span>
            </span>
            <h2 className="display-heading text-3xl md:text-4xl text-white">
              Tailor the EMI to{' '}
              <span className="italic text-brand-red">your budget.</span>
            </h2>
          </div>
          <EMICalculator initialPrice={car.price} />
        </div>
      </section>

      <section className="border-t border-white/[0.06] bg-brand-black-soft">
        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8">
              <h2 className="display-heading text-3xl md:text-4xl text-white">
                Enquire about this{' '}
                <span className="italic text-brand-red">{car.name}.</span>
              </h2>
              <p className="mt-3 text-white/60">
                Share your details and our team will get back to you with availability and the best finance plan.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.07] bg-brand-black p-6 md:p-8">
              <EnquiryForm carId={car.id} carName={car.name} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-white/[0.06] bg-brand-black-soft">
          <div className="container-wide py-16 md:py-24">
            <div className="flex items-end justify-between mb-10">
              <h2 className="display-heading text-3xl md:text-4xl text-white">
                You may also{' '}
                <span className="italic text-brand-red">like.</span>
              </h2>
              <Link
                href="/cars"
                className="hidden md:inline-flex items-center gap-1 text-sm text-white/70 hover:text-brand-red"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {related.map((c, i) => (
                <CarCard key={c.id} car={c} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-brand-black-soft p-5">
      <div className="flex items-center gap-2 text-brand-red mb-2">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="font-display text-base font-semibold text-white">
        {value}
      </div>
    </div>
  );
}
