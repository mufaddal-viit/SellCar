'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';
import {
  UploadCloud,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  GripVertical,
} from 'lucide-react';
import type { MediaAsset } from '@/types';

interface Props {
  label: string;
  hint?: string;
  resourceType: 'image' | 'video';
  folder: string;
  value: MediaAsset[];
  // Accepts a functional updater (like React's setState) so rapid, successive
  // uploads each append to the freshest array instead of racing on a stale one.
  onChange: (next: MediaAsset[] | ((prev: MediaAsset[]) => MediaAsset[])) => void;
}

interface UploadInfo {
  secure_url: string;
  public_id: string;
  width?: number;
  height?: number;
}

export function MediaManager({ label, hint, resourceType, folder, value, onChange }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const isImage = resourceType === 'image';

  const add = (info: UploadInfo) => {
    // Functional updater: each upload's onSuccess fires separately and in quick
    // succession (esp. on mobile), so appending to a captured `value` would let
    // later callbacks overwrite earlier ones — only the last photo survived.
    // Building from `prev` keeps every uploaded photo. De-dupe here too.
    onChange((prev) =>
      prev.some((m) => m.publicId === info.public_id)
        ? prev
        : [
            ...prev,
            {
              url: info.secure_url,
              publicId: info.public_id,
              width: info.width,
              height: info.height,
            },
          ],
    );
  };

  const remove = (publicId: string) =>
    onChange((prev) => prev.filter((m) => m.publicId !== publicId));

  /** Move the item at `from` to position `to` (used by drag-drop and arrows). */
  const reorder = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= value.length || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };
  const move = (i: number, dir: -1 | 1) => reorder(i, i + dir);

  const handleDrop = (to: number) => {
    if (dragIndex !== null) reorder(dragIndex, to);
    setDragIndex(null);
    setOverIndex(null);
  };

  const ctrlBtn =
    'grid h-7 w-7 place-items-center rounded-md bg-black/70 text-white transition-colors disabled:opacity-30 disabled:hover:bg-black/70';

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-xs text-white/40">
          {hint ?? (isImage ? 'Drag to reorder · first photo is the cover' : 'Drag to reorder')}
        </span>
      </div>

      {value.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((m, i) => {
            const isCover = isImage && i === 0;
            return (
              <div
                key={m.publicId || m.url}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverIndex(i);
                }}
                onDrop={() => handleDrop(i)}
                onDragEnd={() => {
                  setDragIndex(null);
                  setOverIndex(null);
                }}
                className={`group relative aspect-square cursor-grab overflow-hidden rounded-lg border bg-brand-black-elevated active:cursor-grabbing ${
                  overIndex === i && dragIndex !== i
                    ? 'border-brand-red'
                    : 'border-white/10'
                } ${dragIndex === i ? 'opacity-40' : ''}`}
              >
                {isImage ? (
                  <Image src={m.url} alt="" fill sizes="160px" className="object-cover" />
                ) : (
                  <video src={m.url} className="h-full w-full object-cover" muted />
                )}

                {/* Order badge / cover label */}
                <span
                  className={`absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    isCover ? 'bg-brand-red text-white' : 'bg-black/70 text-white/90'
                  }`}
                >
                  {isCover ? (
                    <>
                      <Star className="h-2.5 w-2.5" fill="currentColor" /> Cover
                    </>
                  ) : (
                    i + 1
                  )}
                </span>

                {/* Drag affordance */}
                <span className="absolute right-1.5 top-1.5 text-white/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <GripVertical className="h-4 w-4" />
                </span>

                {/* Controls */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    title="Move left"
                    className={`${ctrlBtn} hover:bg-black`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {isImage && (
                    <button
                      type="button"
                      onClick={() => reorder(i, 0)}
                      disabled={i === 0}
                      title="Set as cover"
                      className={`${ctrlBtn} hover:bg-brand-red`}
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === value.length - 1}
                    title="Move right"
                    className={`${ctrlBtn} hover:bg-black`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(m.publicId)}
                    title="Remove"
                    className={`${ctrlBtn} hover:bg-red-600`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Uploads are gated on a destination folder. The car form leaves `folder`
          empty until a car name is entered, so each car's media lands in its own
          named folder rather than a shared/unnamed one. */}
      {!folder ? (
        <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/10 py-4 text-sm text-white/35">
          <UploadCloud className="h-4 w-4" />
          Enter the car name first to upload {isImage ? 'photos' : 'videos'}
        </div>
      ) : (
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
              Upload {isImage ? 'photos' : 'videos'}
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}
