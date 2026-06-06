import type { Metadata } from 'next';
import { ComingSoon } from '@/components/shared/coming-soon';

export const metadata: Metadata = {
  title: 'How EMI Works',
  robots: { index: false, follow: true },
};

export default function FinancingPage() {
  return (
    <ComingSoon
      eyebrow="Financing"
      title="A clear guide to how our EMI works"
      description="We're putting together a simple breakdown of how car finance, profit rates and monthly installments work with us. In the meantime, check your eligibility or start an application."
    />
  );
}
