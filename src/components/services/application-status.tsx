'use client';

import { useEffect, useState } from 'react';
import {
  Mail,
  Loader2,
  Check,
  CheckCircle2,
  Clock,
  Search,
  FileText,
  XCircle,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PublicApp {
  ref: string;
  carName: string | null;
  status: string;
  reviewNote: string | null;
  documents: string[];
  createdAt: string;
}

const DOC_LABELS: Record<string, string> = {
  emirates_id: 'Emirates ID',
  visa: 'Visa',
  passport: 'Passport',
  salary_certificate: 'Salary Certificate',
  bank_statement: 'Bank Statement',
};

const STATUS_INFO: Record<
  string,
  { label: string; badge: string; icon: typeof Clock; message: string }
> = {
  submitted: {
    label: 'Submitted',
    badge: 'border-brand-red/40 bg-brand-red/10 text-brand-red',
    icon: Clock,
    message: "We've received your application and it's in the queue for review.",
  },
  in_review: {
    label: 'In Review',
    badge: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    icon: Search,
    message: 'Our finance team is currently reviewing your application.',
  },
  approved: {
    label: 'Approved',
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    icon: CheckCircle2,
    message: "Congratulations — you're approved! Our team will contact you to finalise the details.",
  },
  rejected: {
    label: 'Not Approved',
    badge: 'border-white/15 bg-white/5 text-white/60',
    icon: XCircle,
    message: 'Unfortunately your application was not approved at this time.',
  },
};

export function ApplicationStatus() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [apps, setApps] = useState<PublicApp[] | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendCode = async () => {
    setMsg(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMsg('Enter a valid email address.');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setMsg(data.error || 'Could not send the code.');
      else {
        setOtpSent(true);
        setCooldown(30);
        setMsg('Code sent — check your inbox (and spam).');
      }
    } finally {
      setSending(false);
    }
  };

  const verifyAndLoad = async () => {
    setMsg(null);
    setVerifying(true);
    try {
      const vRes = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      });
      const vData = await vRes.json().catch(() => ({}));
      if (!vRes.ok) {
        setMsg(vData.error || 'Incorrect code.');
        return;
      }
      const sRes = await fetch('/api/applications/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: vData.token }),
      });
      const sData = await sRes.json().catch(() => ({}));
      setApps(sData.applications ?? []);
    } finally {
      setVerifying(false);
    }
  };

  // ── Results ────────────────────────────────────────────────────────────────
  if (apps) {
    if (apps.length === 0) {
      return (
        <div className="rounded-2xl border border-white/[0.07] bg-brand-black-soft p-10 text-center">
          <Search className="mx-auto mb-4 h-10 w-10 text-white/30" />
          <h2 className="font-display text-xl font-bold text-white">No applications found</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/55">
            We couldn&apos;t find any applications for <strong className="text-white">{email}</strong>.
          </p>
          <Button asChild className="mt-6">
            <Link href="/services">Start an application</Link>
          </Button>
        </div>
      );
    }
    return (
      <div className="space-y-5">
        <p className="text-sm text-white/50">
          Showing {apps.length} application{apps.length > 1 ? 's' : ''} for{' '}
          <strong className="text-white">{email}</strong>.
        </p>
        {apps.map((a) => {
          const info = STATUS_INFO[a.status] ?? STATUS_INFO.submitted;
          const Icon = info.icon;
          return (
            <div key={a.ref} className="rounded-2xl border border-white/[0.07] bg-brand-black-soft p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-display text-lg font-bold text-white">
                    {a.carName || 'Car finance application'}
                  </div>
                  <div className="mt-0.5 text-xs text-white/45">
                    Ref #{a.ref} · Submitted {new Date(a.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${info.badge}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {info.label}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-white/70">{info.message}</p>

              {a.status === 'rejected' && a.reviewNote && (
                <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                  <div className="text-[11px] uppercase tracking-widest text-white/40">Note from our team</div>
                  <p className="mt-1 text-sm text-white/75">{a.reviewNote}</p>
                </div>
              )}

              {a.documents.length > 0 && (
                <div className="mt-4 border-t border-white/[0.06] pt-4">
                  <div className="mb-2 text-[11px] uppercase tracking-widest text-white/40">
                    Documents received
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {a.documents.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70"
                      >
                        <FileText className="h-3 w-3 text-emerald-400" />
                        {DOC_LABELS[d] ?? d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <p className="text-center text-xs text-white/35">
          Questions about your application?{' '}
          <Link href="/contact" className="text-brand-red hover:underline">
            Contact us
          </Link>
          .
        </p>
      </div>
    );
  }

  // ── Email + OTP gate ─────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-white/[0.07] bg-brand-black-soft p-6 md:p-8">
      <div className="mb-5 flex items-start gap-3 text-sm text-white/65">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
        <p>Verify the email you applied with to view your application status securely.</p>
      </div>

      <Label className="mb-2 block">Email</Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={otpSent}
        />
        {!otpSent && (
          <Button type="button" variant="outline" onClick={sendCode} disabled={sending}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Send code
          </Button>
        )}
      </div>

      {otpSent && (
        <div className="mt-4">
          <Label className="mb-2 block">Verification code</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="6-digit code"
              className="tracking-[0.4em]"
            />
            <Button type="button" onClick={verifyAndLoad} disabled={verifying || otp.length !== 6}>
              {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              View status
            </Button>
          </div>
          <button
            type="button"
            onClick={sendCode}
            disabled={cooldown > 0 || sending}
            className="mt-2 text-xs text-white/45 hover:text-white disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
          </button>
        </div>
      )}

      {msg && <p className="mt-3 text-xs text-white/55">{msg}</p>}
    </div>
  );
}
