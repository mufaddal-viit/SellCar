'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  GripVertical,
  Clock,
} from 'lucide-react';
import type { MediaAsset } from '@/types';

/**
 * A media item is either already saved (real Cloudinary url + publicId) or
 * "pending" — a locally-picked file held in the browser with a blob preview
 * url and `file` set. Pending items are uploaded only when the car is saved, so
 * nothing reaches Cloudinary from an abandoned/never-saved form.
 */
export interface MediaItem extends MediaAsset {
  /** Present only for not-yet-uploaded local files. */
  file?: File;
}

interface Props {
  label: string;
  hint?: string;
  resourceType: 'image' | 'video';
  /** Destination folder; empty disables uploads until the car name is entered. */
  folder: string;
  value: MediaItem[];
  onChange: (next: MediaItem[] | ((prev: MediaItem[]) => MediaItem[])) => void;
  /** Disable picking while a save/upload is in progress. */
  disabled?: boolean;
}

export function MediaManager({
  label,
  hint,
  resourceType,
  folder,
  value,
  onChange,
  disabled,
}: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isImage = resourceType === 'image';

  // Revoke blob URLs we created for pending previews when unmounting, to avoid
  // leaking object URLs.
  const blobUrls = useRef<string[]>([]);
  useEffect(() => {
    const urls = blobUrls.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const items: MediaItem[] = Array.from(files).map((file) => {
      const url = URL.createObjectURL(file);
      blobUrls.current.push(url);
      return { url, publicId: '', file };
    });
    onChange((prev) => [...prev, ...items]);
    if (inputRef.current) inputRef.current.value = '';
  };

  // Pending items have no publicId, so identify everything by index.
  const removeAt = (idx: number) =>
    onChange((prev) => prev.filter((_, i) => i !== idx));

  /** Move the item at `from` to position `to` (drag-drop and arrows). */
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

  const pendingCount = value.filter((m) => m.file).length;

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
            const pending = Boolean(m.file);
            return (
              <div
                key={m.publicId || m.url}
                draggable={!disabled}
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
                  // Pending previews are blob: URLs — use a plain img (next/image
                  // can't optimize blobs); saved items use next/image.
                  pending ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Image src={m.url} alt="" fill sizes="160px" className="object-cover" />
                  )
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

                {/* Pending (not-yet-uploaded) marker */}
                {pending && (
                  <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black">
                    <Clock className="h-2.5 w-2.5" /> New
                  </span>
                )}

                {/* Drag affordance (hidden when a pending badge occupies the corner) */}
                {!pending && (
                  <span className="absolute right-1.5 top-1.5 text-white/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <GripVertical className="h-4 w-4" />
                  </span>
                )}

                {/* Controls */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0 || disabled}
                    title="Move left"
                    className={`${ctrlBtn} hover:bg-black`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {isImage && (
                    <button
                      type="button"
                      onClick={() => reorder(i, 0)}
                      disabled={i === 0 || disabled}
                      title="Set as cover"
                      className={`${ctrlBtn} hover:bg-brand-red`}
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === value.length - 1 || disabled}
                    title="Move right"
                    className={`${ctrlBtn} hover:bg-black`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    disabled={disabled}
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

      {/* Picking is gated on a destination folder. The car form leaves `folder`
          empty until a car name is entered, so each car's media lands in its
          own named folder. Files are held locally and uploaded on save. */}
      {!folder ? (
        <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/10 py-4 text-sm text-white/35">
          <UploadCloud className="h-4 w-4" />
          Enter the car name first to add {isImage ? 'photos' : 'videos'}
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept={isImage ? 'image/*' : 'video/*'}
            multiple
            disabled={disabled}
            onChange={(e) => addFiles(e.target.files)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 py-4 text-sm text-white/60 transition-colors hover:border-brand-red/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <UploadCloud className="h-4 w-4" />
            Add {isImage ? 'photos' : 'videos'}
          </button>
          {pendingCount > 0 && (
            <p className="mt-1.5 text-xs text-amber-400/80">
              {pendingCount} {isImage ? 'photo' : 'video'}
              {pendingCount === 1 ? '' : 's'} will upload when you save.
            </p>
          )}
        </>
      )}
    </div>
  );
}
