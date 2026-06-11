import type { Metadata } from 'next';
import { CarGrid } from '@/components/cars/car-grid';
import { getCars } from '@/server/cars';

export const metadata: Metadata = {
  title: 'Browse Cars',
  description:
    'Browse our certified cars available on flexible EMI. Filter by brand, category and fuel type, and compare prices and monthly installments instantly.',
  alternates: { canonical: '/cars' },
};

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const cars = await getCars();
  const { q } = await searchParams;
  return (
    <div className="bg-brand-black min-h-screen">
      <CarGrid cars={cars} initialQuery={q ?? ''} />
    </div>
  );
}
