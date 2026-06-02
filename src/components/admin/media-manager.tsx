'use client';

import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';
import { UploadCloud, X, ArrowLeft } from 'lucide-react';
import type { MediaAsset } from '@/types';

interface Props {
  label: string;
  hint?: string;
  resourceType: 'image' | 'video';
  folder: string;
  value: MediaAsset[];
  onChange: (next: MediaAsset[]) => void;
}

interface UploadInfo {
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
}

export function MediaManager({ label, hint, resourceType, folder, value, onChange }: Props) {
  const add = (info: UploadInfo) => {
    if (value.some((m) => m.publicId === info.public_id)) return;
    onChange([
      ...value,
      {
        url: info.secure_url,
        publicId: info.public_id,
        width: info.width,
        height: info.height,
      },
    ]);
  };

  const remove = (publicId: string) =>
    onChange(value.filter((m) => m.publicId !== publicId));

  const moveToFront = (index: number) => {
    if (index <= 0) return;
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  };

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-white">{label}</span>
        {hint && <span className="text-xs text-white/40">{hint}</span>}
      </div>

      {value.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((m, i) => (
            <div
              key={m.publicId || m.url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-brand-black-elevated"
            >
              {resourceType === 'image' ? (
                <Image src={m.url} alt="" fill sizes="160px" className="object-cover" />
              ) : (
                <video src={m.url} className="h-full w-full object-cover" muted />
              )}

              {resourceType === 'image' && i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-brand-red px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  Cover
                </span>
              )}

              <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-0 transition-opacity group-hover:opacity-100">
                {resourceType === 'image' && i > 0 ? (
                  <button
                    type="button"
                    onClick={() => moveToFront(i)}
                    title="Make cover"
                    className="grid h-6 w-6 place-items-center rounded bg-black/70 text-white hover:bg-black"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={() => remove(m.publicId)}
                  title="Remove"
                  className="grid h-6 w-6 place-items-center rounded bg-black/70 text-white hover:bg-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CldUploadWidget
        signatureEndpoint="/api/admin/sign-upload"
        options={{
          folder,
          resourceType,
          multiple: true,
          sources: ['local', 'url', 'camera'],
        }}
        onSuccess={(result) => {
          if (result?.info && typeof result.info === 'object') {
            add(result.info as unknown as UploadInfo);
          }
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 py-4 text-sm text-white/60 transition-colors hover:border-brand-red/50 hover:text-white"
          >
            <UploadCloud className="h-4 w-4" />
            Upload {resourceType === 'image' ? 'photos' : 'videos'}
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
