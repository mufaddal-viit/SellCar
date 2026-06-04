import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/shared/section-heading';
import { ApplicationForm, type CarOption } from '@/components/services/application-form';
import { getCars } from '@/server/cars';

export const metadata: Metadata = {
  title: 'Apply for Car Finance',
  description:
    'Submit your details and documents to get pre-approved for car finance with Buy&Drive Cars. Zero down payment options, free insurance and registration.',
  alternates: { canonical: '/services' },
};

export default async function ServicesPage() {
  // Available + reserved cars (exclude sold) for the application dropdown.
  const cars = await getCars();
  const options: CarOption[] = cars
    .filter((c) => c.status !== 'sold')
    .map((c) => ({ id: c.id, name: c.name, year: c.year, status: c.status }));

  return (
    <div className="bg-brand-black">
      <section className="container-wide pt-16 md:pt-24 pb-12">
        <SectionHeading
          eyebrow="Get Started"
          title="Apply for"
          highlight="car finance."
          description="Pick your car, fill in your details, verify your email and upload your documents. Our team will review your application and call you with a personalised offer — usually within 5-7 days."
        />
        <div className="mt-6">
          <Link
            href="/application-status"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-red hover:underline"
          >
            Already applied? Check your status
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <section className="container-wide pb-24">
        <div className="mx-auto max-w-5xl">
          <ApplicationForm cars={options} />
        </div>
      </section>
    </div>
  );
}
