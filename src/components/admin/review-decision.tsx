'use client';

import { useEffect, useState } from 'react';
import { Gavel } from 'lucide-react';
import { ApplicationReview } from './application-review';

const STATUS_LABEL: Record<string, string> = {
  submitted: 'Decide',
  in_review: 'Decide',
  approved: 'Update decision',
  rejected: 'Update decision',
};

/** A clearly-separated "Decide" button that opens the review controls in a modal,
 *  so the decision UI doesn't blend into the read-only applicant details. */
export function ReviewDecision({
  id,
  status,
  reviewNote,
}: {
  id: string;
  status: string;
  reviewNote: string | null;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-red/90"
      >
        <Gavel className="h-4 w-4" />
        {STATUS_LABEL[status] ?? 'Decide'}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ApplicationReview
              id={id}
              status={status}
              reviewNote={reviewNote}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
