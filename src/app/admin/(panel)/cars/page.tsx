import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAllCars } from '@/server/cars';
import { CarsTable } from '@/components/admin/cars-table';

export const dynamic = 'force-dynamic';

export default async function AdminCarsPage() {
  const cars = await getAllCars();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="display-heading text-3xl text-white">Cars</h1>
          <p className="mt-1 text-sm text-white/50">{cars.length} in inventory</p>
        </div>
        <Link
          href="/admin/cars/new"
          className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-dark"
        >
          <Plus className="h-4 w-4" />
          Add Car
        </Link>
      </div>
      <CarsTable cars={cars} />
    </div>
  );
}
