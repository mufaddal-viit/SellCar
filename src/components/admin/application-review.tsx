'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Trash2, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { reviewApplication, deleteApplication, type AppStatus } from '@/actions/applications';
import { SelectField } from '@/components/ui/select-field';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export function ApplicationReview({
  id,
  status: initStatus,
  reviewNote,
  onClose,
}: {
  id: string;
  status: string;
  reviewNote: string | null;
  onClose?: () => void;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initStatus);
  const [note, setNote] = useState(reviewNote ?? '');
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok?: boolean; error?: string; emailed?: boolean } | null>(null);

  const willEmail = status === 'approved' || status === 'rejected';

  const save = () => {
    setMsg(null);
    startTransition(async () => {
      const res = await reviewApplication(id, status as AppStatus, note);
      setMsg(res);
      if (res.ok) router.refresh();
    });
  };

  const remove = () => {
    if (confirm('Delete this application and its documents?')) {
      startTransition(async () => {
        await deleteApplication(id);
        router.push('/admin/applications');
      });
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-brand-black-soft p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-white">Review decision</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-red-500/40 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid items-start gap-4 sm:grid-cols-[200px_1fr]">
        <div>
          <Label className="mb-2 block">Status</Label>
          <SelectField
            value={status}
            onValueChange={setStatus}
            options={STATUS_OPTIONS}
            className="capitalize"
          />
        </div>
        <div>
          <Label className="mb-2 block">
            Note / reason{willEmail ? ' — emailed to applicant' : ''}
          </Label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Add a note. On rejection this is shown to the applicant as the reason."
            className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/40 focus:border-brand-red focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="button" onClick={save} disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {willEmail ? 'Update & notify applicant' : 'Update status'}
        </Button>
        {msg?.ok && (
          <span className="inline-flex items-center gap-1.5 text-sm text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Saved{msg.emailed ? ' · applicant emailed' : ''}.
          </span>
        )}
        {msg?.error && (
          <span className="inline-flex items-center gap-1.5 text-sm text-amber-400">
            <AlertCircle className="h-4 w-4" />
            {msg.error}
          </span>
        )}
      </div>

      <p className="mt-3 text-xs text-white/40">
        Approving or rejecting emails the applicant. On rejection, the note above is included as the reason.
      </p>
    </div>
  );
}
