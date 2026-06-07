'use client';

import Image from 'next/image';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { deleteTestimonialImage, refreshTestimonials } from '@/actions/testimonials';
import type { FolderImage } from '@/server/testimonials';

interface Props {
  title: string;
  description: string;
  folder: string;
  photos: FolderImage[];
  aspect?: string;
}

export function TestimonialManager({ title, description, folder, photos, aspect = 'aspect-[3/4]' }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);

  const afterUpload = () =>
    startTransition(async () => {
      await refreshTestimonials();
      router.refresh();
    });

  const remove = (publicId: string) => {
    if (!confirm('Remove this photo?')) return;
    setBusy(publicId);
    startTransition(async () => {
      await deleteTestimonialImage(publicId);
      router.refresh();
      setBusy(null);
    });
  };

  return (
    <section className="rounded-2xl border border-white/[0.07] bg-brand-black-soft p-6">
      <h2 className="font-display text-lg font-bold text-white">{title}</h2>
      <p className="mt-1 text-sm text-white/50">{description}</p>

      {photos.length > 0 ? (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {photos.map((p) => (
            <div
              key={p.publicId}
              className={`group relative ${aspect} overflow-hidden rounded-lg border border-white/10 bg-brand-black-elevated ${
                busy === p.publicId ? 'opacity-50' : ''
              }`}
            >
              <Image src={p.url} alt="" fill sizes="160px" className="object-cover" />
              <button
                type="button"
                onClick={() => remove(p.publicId)}
                disabled={busy === p.publicId}
                title="Remove"
                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-md bg-black/70 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
              >
                {busy === p.publicId ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-dashed border-white/10 py-6 text-center text-sm text-white/40">
          No photos yet.
        </p>
      )}

      <div className="mt-4">
        <CldUploadWidget
          signatureEndpoint="/api/admin/sign-upload"
          options={{ folder, resourceType: 'image', multiple: true, sources: ['local', 'url', 'camera'] }}
          onSuccess={afterUpload}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              disabled={pending}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 py-4 text-sm text-white/60 transition-colors hover:border-brand-red/50 hover:text-white disabled:opacity-50"
            >
              <UploadCloud className="h-4 w-4" />
              Add photos
            </button>
          )}
        </CldUploadWidget>
      </div>
    </section>
  );
}
