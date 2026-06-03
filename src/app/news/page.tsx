import type { Metadata } from 'next';
import { ComingSoon } from '@/components/shared/coming-soon';

export const metadata: Metadata = {
  title: 'News & Updates',
  robots: { index: false, follow: true },
};

export default function NewsPage() {
  return (
    <ComingSoon
      eyebrow="News & Updates"
      title="Our newsroom is on its way."
      description="Fresh arrivals, finance offers and company news will live here shortly. In the meantime, browse our latest cars or get in touch."
    />
  );
}
