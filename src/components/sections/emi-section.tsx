import { SectionHeading } from '@/components/shared/section-heading';
import { EMICalculator } from '@/components/emi/emi-calculator';

export function EMISection() {
  return (
    <section className="section bg-brand-black">
      <div className="container-wide">
        <SectionHeading
          eyebrow="EMI Calculator"
          title="See your EMI in"
          highlight="real time."
          description="Drag the sliders. See exactly what you'll pay each month — no calls, no forms."
        />
        <div className="mt-14">
          <EMICalculator />
        </div>
      </div>
    </section>
  );
}
