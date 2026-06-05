import type { Metadata } from 'next';
import { CarGrid } from '@/components/cars/car-grid';
import { getCars } from '@/server/cars';

export const metadata: Metadata = {
  title: 'Browse Cars',
  description:
    'Browse our certified cars available on flexible EMI. Filter by brand, category and fuel type, and compare prices and monthly installments instantly.',
  alternates: { canonical: '/cars' },
};

export default async function CarsPage() {
  const cars = await getCars();
  return (
    <div className="bg-brand-black min-h-screen">
      <CarGrid cars={cars} />
    </div>
  );
}
