import type { Metadata } from 'next';
import { ComingSoon } from '@/components/shared/coming-soon';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <ComingSoon
      eyebrow="Legal"
      title="Our Terms & Conditions"
      description="Our full terms of service are being finalised and will be published here soon. For any questions in the meantime, please get in touch."
    />
  );
}
