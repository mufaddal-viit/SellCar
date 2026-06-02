'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { CheckCircle2, Send } from 'lucide-react';
import { submitEnquiry, type EnquiryState } from '@/actions/leads';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      <Send className="h-4 w-4" />
      {pending ? 'Sending…' : 'Send Enquiry'}
    </Button>
  );
}

interface Props {
  carId?: string;
  carName?: string;
  title?: string;
}

export function EnquiryForm({ carId, carName, title }: Props) {
  const [state, formAction] = useActionState<EnquiryState, FormData>(submitEnquiry, {});

  if (state.ok) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-emerald-200">
        <CheckCircle2 className="h-6 w-6 shrink-0" />
        <div>
          <p className="font-semibold text-white">Thank you!</p>
          <p className="text-sm">We&apos;ve received your enquiry and will be in touch shortly.</p>
        </div>
      </div>
    );
  }

  const err = (f: string) => state.fieldErrors?.[f]?.[0];

  return (
    <form action={formAction} className="space-y-4">
      {title && <h3 className="font-display text-xl font-bold text-white">{title}</h3>}
      {carId && <input type="hidden" name="carId" value={carId} />}
      {carName && <input type="hidden" name="carName" value={carName} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eq-name">Name</Label>
          <Input id="eq-name" name="name" required placeholder="Your name" />
          {err('name') && <p className="text-xs text-red-400">{err('name')}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="eq-phone">Phone</Label>
          <Input id="eq-phone" name="phone" required placeholder="+971 5x xxx xxxx" />
          {err('phone') && <p className="text-xs text-red-400">{err('phone')}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="eq-email">Email (optional)</Label>
        <Input id="eq-email" name="email" type="email" placeholder="you@example.com" />
        {err('email') && <p className="text-xs text-red-400">{err('email')}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="eq-message">Message (optional)</Label>
        <textarea
          id="eq-message"
          name="message"
          rows={3}
          placeholder="Tell us what you're looking for…"
          className="w-full rounded-lg border border-white/10 bg-white/5 p-4 text-base text-white placeholder:text-white/40 focus:border-brand-red focus:outline-none"
        />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
