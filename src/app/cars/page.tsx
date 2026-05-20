import type { Metadata } from 'next';
import { CarGrid } from '@/components/cars/car-grid';

export const metadata: Metadata = {
  title: 'Browse Cars',
  description:
    'Browse 500+ certified cars available on flexible EMI. Filter by brand, category, fuel type. Compare prices and EMI plans instantly.',
  alternates: { canonical: '/cars' },
};

export default function CarsPage() {
  return (
    <div className="bg-brand-black min-h-screen">
      <CarGrid />
    </div>
  );
}
