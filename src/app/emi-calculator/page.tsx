import type { Metadata } from 'next';
import { EMICalculator } from '@/components/emi/emi-calculator';
import { SectionHeading } from '@/components/shared/section-heading';
import { EMIPlansSection } from '@/components/sections/emi-plans';
import { FAQSection } from '@/components/sections/faq-section';

export const metadata: Metadata = {
  title: 'EMI Calculator — Instant Car Loan EMI in Seconds',
  description:
    'Calculate your car loan EMI in real-time. Free, interactive EMI calculator with adjustable price, tenure, down payment and interest rate.',
  alternates: { canonical: '/emi-calculator' },
};

export default function EMICalculatorPage() {
  return (
    <div className="bg-brand-black">
      <section className="container-wide pt-16 md:pt-24 pb-12 md:pb-16">
        <SectionHeading
          eyebrow="Tools"
          title="Plan your"
          highlight="perfect EMI."
          description="Adjust the sliders to see your monthly payment, total interest, and total payable in real time. No sign-up, no spam."
        />
        <div className="mt-14">
          <EMICalculator />
        </div>
      </section>
      <EMIPlansSection />
      <FAQSection />
    </div>
  );
}
