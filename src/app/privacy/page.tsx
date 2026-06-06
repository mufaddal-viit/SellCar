import type { Metadata } from 'next';
import { ComingSoon } from '@/components/shared/coming-soon';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <ComingSoon
      eyebrow="Legal"
      title="Our Privacy Policy"
      description="We're finalising our privacy policy, which explains how we handle your data. It will be published here soon. For any questions, please contact us."
    />
  );
}
