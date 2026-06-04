import type { Metadata } from 'next';
import { SectionHeading } from '@/components/shared/section-heading';
import { ApplicationStatus } from '@/components/services/application-status';

export const metadata: Metadata = {
  title: 'Check Application Status',
  description: 'Track the status of your Buy&Drive Cars finance application.',
  robots: { index: false, follow: true },
};

export default function ApplicationStatusPage() {
  return (
    <div className="bg-brand-black">
      <section className="container-wide pt-16 md:pt-24 pb-16 md:pb-24">
        <SectionHeading
          eyebrow="Application Status"
          title="Track your"
          highlight="application."
          description="Enter the email you applied with, verify it, and we'll show you exactly where your finance application stands."
          align="center"
        />
        <div className="mt-12">
          <ApplicationStatus />
        </div>
      </section>
    </div>
  );
}
