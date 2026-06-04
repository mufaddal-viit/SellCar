import type { Metadata } from 'next';
import { SectionHeading } from '@/components/shared/section-heading';
import { ApplicationForm } from '@/components/services/application-form';

export const metadata: Metadata = {
  title: 'Apply for Car Finance',
  description:
    'Submit your details and documents to get pre-approved for car finance with Buy&Drive Cars. Zero down payment options, free insurance and registration.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <div className="bg-brand-black">
      <section className="container-wide pt-16 md:pt-24 pb-12">
        <SectionHeading
          eyebrow="Get Started"
          title="Apply for"
          highlight="car finance."
          description="Fill in your details and upload your documents below. Our team will review your application and call you with a personalised offer — usually within 5-7 days."
        />
      </section>
      <section className="container-wide pb-24">
        <div className="mx-auto max-w-5xl">
          <ApplicationForm />
        </div>
      </section>
    </div>
  );
}
