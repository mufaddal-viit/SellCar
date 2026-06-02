import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCarById } from '@/server/cars';
import { CarForm } from '@/components/admin/car-form';
import { CLOUDINARY_FOLDER } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCarPage({ params }: PageProps) {
  const { id } = await params;
  const car = await getCarById(id);
  if (!car) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/cars"
        className="mb-4 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cars
      </Link>
      <h1 className="display-heading mb-8 text-3xl text-white">{car.name}</h1>
      <CarForm car={car} uploadFolder={CLOUDINARY_FOLDER} />
    </div>
  );
}
