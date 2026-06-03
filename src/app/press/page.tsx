import type { Metadata } from 'next';
import { ComingSoon } from '@/components/shared/coming-soon';

export const metadata: Metadata = {
  title: 'Press & Media',
  robots: { index: false, follow: true },
};

export default function PressPage() {
  return (
    <ComingSoon
      eyebrow="Press & Media"
      title="Press kit & media coverage,"
      description="Logos, brand assets and media enquiries will be available here soon. For press requests, please reach us via the contact page."
    />
  );
}
