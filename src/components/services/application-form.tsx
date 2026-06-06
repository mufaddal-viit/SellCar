'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Send,
  ShieldCheck,
  Loader2,
  Mail,
  UploadCloud,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { submitApplication } from '@/actions/applications';
import { uploadDocument, type UploadedDoc } from '@/lib/upload-doc';
import { DOC_KINDS, type DocKind } from '@/lib/validation';

export interface CarOption {
  id: string;
  name: string;
  year: number;
  status?: string;
}

const fieldBase =
  'h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-base text-white placeholder:text-white/40 focus:border-brand-red focus:outline-none transition-colors';

const DOC_FIELDS: { kind: DocKind; label: string; required: boolean }[] = [
  { kind: 'emirates_id', label: 'Emirates ID', required: true },
  { kind: 'visa', label: 'Visa', required: true },
  { kind: 'passport', label: 'Passport Copy', required: true },
  { kind: 'salary_certificate', label: 'Salary Certificate', required: true },
  { kind: 'bank_statement', label: 'Last 3 Months Bank Statement', required: false },
];

type DocState = Record<string, { status: 'idle' | 'uploading' | 'done' | 'error'; error?: string }>;

const initialText = {
  name: '',
  mobile: '',
  email: '',
  homeMobile: '',
  mother: '',
  flat: '',
  building: '',
  street: '',
  area: '',
  city: '',
  homeAddress: '',
  officeAddress: '',
  officeLandline: '',
  salaryDate: '',
  bankName: '',
  iban: '',
  loanInstallment: '',
  hasCards: 'No',
  cardLimit: '',
  cashLoan: 'No',
  ref1Name: '',
  ref1Mobile: '',
  ref2Name: '',
  ref2Mobile: '',
};

export function ApplicationForm({ cars }: { cars: CarOption[] }) {
  const [carId, setCarId] = useState('');
  const [f, setF] = useState(initialText);
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  // Email verification
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [hp, setHp] = useState(''); // honeypot
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otpMsg, setOtpMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Documents
  const [docState, setDocState] = useState<DocState>({});
  const [uploaded, setUploaded] = useState<Partial<Record<DocKind, UploadedDoc>>>({});

  // Submit
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendOtp = async () => {
    setOtpMsg(null);
    if (!/^\S+@\S+\.\S+$/.test(f.email)) {
      setOtpMsg('Enter a valid email address first.');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: f.email, hp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setOtpMsg(data.error || 'Could not send the code.');
      } else {
        setOtpSent(true);
        setCooldown(30);
        setOtpMsg('Code sent — check your inbox (and spam).');
      }
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    setOtpMsg(null);
    setVerifying(true);
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: f.email, code: otp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setOtpMsg(data.error || 'Incorrect code.');
      } else {
        setVerified(true);
        setToken(data.token);
        setOtpMsg(null);
      }
    } finally {
      setVerifying(false);
    }
  };

  const pickDoc = async (kind: DocKind, file: File | undefined) => {
    if (!file || !token) return;
    setDocState((s) => ({ ...s, [kind]: { status: 'uploading' } }));
    try {
      const doc = await uploadDocument(file, kind, f.name || 'applicant', token);
      setUploaded((u) => ({ ...u, [kind]: doc }));
      setDocState((s) => ({ ...s, [kind]: { status: 'done' } }));
    } catch (e) {
      setDocState((s) => ({
        ...s,
        [kind]: { status: 'error', error: e instanceof Error ? e.message : 'Upload failed' },
      }));
    }
  };

  const requiredDocsDone = DOC_FIELDS.filter((d) => d.required).every((d) => uploaded[d.kind]);
  const canSubmit =
    verified && !!carId && f.name.trim().length > 1 && f.mobile.trim().length > 5 && requiredDocsDone;

  const submit = async () => {
    if (!token) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const car = cars.find((c) => c.id === carId);
      const res = await submitApplication(token, {
        ...f,
        carId,
        carName: car ? car.name : undefined,
        documents: DOC_KINDS.map((k) => uploaded[k]).filter(Boolean),
      });
      if (res?.error) setSubmitError(res.error);
      else {
        setSubmitted(true);
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
        <h2 className="font-display text-2xl font-bold text-white">Application received</h2>
        <p className="mx-auto mt-3 max-w-md text-white/70">
          Thank you! Our finance team will review your details and documents and get back to you
          shortly. We&apos;ll email you when there&apos;s an update.
        </p>
        <a
          href="/services/application-status"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-red hover:underline"
        >
          Check your application status →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Honeypot — hidden from real users, catches bots */}
      <input
        type="text"
        name="company"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="flex items-start gap-3 rounded-xl w-fit border bg-brand-red/[0.06] p-4 text-sm text-white/75">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
        <p>
           Your
          information and documents are kept confidential and used only to process your application.
        </p>
      </div>

      {/* Car + contact + email verification */}
      <Section legend="Your Car & Contact">
        <Field label="Choose your car" required className="sm:col-span-2">
          <SelectField
            value={carId}
            onValueChange={setCarId}
            placeholder="Select a car…"
            options={cars.map((c) => ({
              value: c.id,
              label: `${c.name} · ${c.year}${c.status === 'reserved' ? ' (Reserved)' : ''}`,
            }))}
          />
        </Field>

        <Field label="Full Name" htmlFor="name" required>
          <Input id="name" value={f.name} onChange={(e) => set('name', e.target.value)} />
        </Field>
        <Field label="Mobile Number" htmlFor="mobile" required>
          <Input id="mobile" type="tel" value={f.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="+971 5x xxx xxxx" />
        </Field>

        {/* Email + OTP */}
        <div className="sm:col-span-2">
          <Label className="mb-2 block">
            Email <span className="text-brand-red">*</span>
          </Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Input
                type="email"
                value={f.email}
                onChange={(e) => set('email', e.target.value)}
                disabled={verified}
                placeholder="you@example.com"
              />
              {verified && (
                <CheckCircle2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-400" />
              )}
            </div>
            {!verified && (
              <Button type="button" variant="outline" onClick={sendOtp} disabled={sending || cooldown > 0}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                {cooldown > 0 ? `Resend in ${cooldown}s` : otpSent ? 'Resend code' : 'Send code'}
              </Button>
            )}
          </div>

          {verified ? (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <Check className="h-3.5 w-3.5" /> Email verified
            </p>
          ) : (
            otpSent && (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Input
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit code"
                  className="sm:max-w-[180px] tracking-[0.4em]"
                />
                <Button type="button" onClick={verifyOtp} disabled={verifying || otp.length !== 6}>
                  {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Verify
                </Button>
              </div>
            )
          )}
          {otpMsg && (
            <p className={`mt-2 text-xs ${verified ? 'text-emerald-400' : 'text-white/55'}`}>{otpMsg}</p>
          )}
        </div>

        <Field label="Home Country Mobile" htmlFor="homeMobile">
          <Input id="homeMobile" type="tel" value={f.homeMobile} onChange={(e) => set('homeMobile', e.target.value)} />
        </Field>
        <Field label="Mother's Name" htmlFor="mother">
          <Input id="mother" value={f.mother} onChange={(e) => set('mother', e.target.value)} />
        </Field>
      </Section>

      {/* Standard sections in two columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <Section legend="Residential Address (UAE)">
            <Field label="Flat / Villa Number" htmlFor="flat"><Input id="flat" value={f.flat} onChange={(e) => set('flat', e.target.value)} /></Field>
            <Field label="Building Name" htmlFor="building"><Input id="building" value={f.building} onChange={(e) => set('building', e.target.value)} /></Field>
            <Field label="Street Name" htmlFor="street"><Input id="street" value={f.street} onChange={(e) => set('street', e.target.value)} /></Field>
            <Field label="Area Name" htmlFor="area"><Input id="area" value={f.area} onChange={(e) => set('area', e.target.value)} /></Field>
            <Field label="City Name" htmlFor="city" className="sm:col-span-2"><Input id="city" value={f.city} onChange={(e) => set('city', e.target.value)} /></Field>
          </Section>

          <Section legend="Personal & Home Country">
            <Field label="Home Country Address" htmlFor="homeAddress" hint="Include a nearby landmark" className="sm:col-span-2">
              <textarea id="homeAddress" rows={3} value={f.homeAddress} onChange={(e) => set('homeAddress', e.target.value)} className={`${fieldBase} h-auto py-3`} />
            </Field>
          </Section>

          <Section legend="Employment">
            <Field label="Office Address" htmlFor="officeAddress" className="sm:col-span-2">
              <textarea id="officeAddress" rows={2} value={f.officeAddress} onChange={(e) => set('officeAddress', e.target.value)} className={`${fieldBase} h-auto py-3`} />
            </Field>
            <Field label="Office Landline" htmlFor="officeLandline"><Input id="officeLandline" type="tel" value={f.officeLandline} onChange={(e) => set('officeLandline', e.target.value)} /></Field>
          </Section>
        </div>

        <div className="space-y-6">
          <Section legend="Salary & Banking">
            <Field label="Salary Credit Date" htmlFor="salaryDate" hint="e.g. 25th of each month"><Input id="salaryDate" value={f.salaryDate} onChange={(e) => set('salaryDate', e.target.value)} /></Field>
            <Field label="Salary Bank Name" htmlFor="bankName"><Input id="bankName" value={f.bankName} onChange={(e) => set('bankName', e.target.value)} /></Field>
            <Field label="IBAN Number" htmlFor="iban" className="sm:col-span-2"><Input id="iban" value={f.iban} onChange={(e) => set('iban', e.target.value)} placeholder="AE__ ____ ____ ____ ____ ___" /></Field>
          </Section>

          <Section legend="Existing Obligations" description="Leave blank or select “No” if not applicable.">
            <Field label="Existing Loan Installment" htmlFor="loanInstallment"><Input id="loanInstallment" value={f.loanInstallment} onChange={(e) => set('loanInstallment', e.target.value)} placeholder="Monthly amount (AED)" /></Field>
            <Field label="Existing Credit Cards?">
              <SelectField value={f.hasCards} onValueChange={(v) => set('hasCards', v)} options={['No', 'Yes']} />
            </Field>
            <Field label="If yes, total limit" htmlFor="cardLimit"><Input id="cardLimit" value={f.cardLimit} onChange={(e) => set('cardLimit', e.target.value)} placeholder="Total limit (AED)" /></Field>
            <Field label="Any Cash-Now Loan?">
              <SelectField value={f.cashLoan} onValueChange={(v) => set('cashLoan', v)} options={['No', 'Yes']} />
            </Field>
          </Section>

          <Section legend="References" description="Two friends or relatives we can contact.">
            <Field label="Reference 1 — Name" htmlFor="ref1Name"><Input id="ref1Name" value={f.ref1Name} onChange={(e) => set('ref1Name', e.target.value)} /></Field>
            <Field label="Reference 1 — Mobile" htmlFor="ref1Mobile"><Input id="ref1Mobile" type="tel" value={f.ref1Mobile} onChange={(e) => set('ref1Mobile', e.target.value)} /></Field>
            <Field label="Reference 2 — Name" htmlFor="ref2Name"><Input id="ref2Name" value={f.ref2Name} onChange={(e) => set('ref2Name', e.target.value)} /></Field>
            <Field label="Reference 2 — Mobile" htmlFor="ref2Mobile"><Input id="ref2Mobile" type="tel" value={f.ref2Mobile} onChange={(e) => set('ref2Mobile', e.target.value)} /></Field>
          </Section>
        </div>
      </div>

      {/* Documents */}
      <Section
        legend="Documents"
        description={
          verified
            ? "Upload clear photos or PDFs. Bank statement is optional if you've provided your IBAN."
            : 'Verify your email above to enable document uploads.'
        }
      >
        {DOC_FIELDS.map((d) => (
          <DocUpload
            key={d.kind}
            label={d.label}
            required={d.required}
            disabled={!verified}
            state={docState[d.kind]?.status ?? 'idle'}
            error={docState[d.kind]?.error}
            onPick={(file) => pickDoc(d.kind, file)}
          />
        ))}
      </Section>

      {submitError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {submitError}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-xs text-white/40">
          {verified
            ? 'By submitting, you agree to be contacted about your application.'
            : 'Verify your email and upload the required documents to submit.'}
        </p>
        <Button type="button" size="lg" onClick={submit} disabled={!canSubmit || submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {submitting ? 'Submitting…' : 'Submit Application'}
        </Button>
      </div>
    </div>
  );
}

function Section({
  legend,
  description,
  children,
}: {
  legend: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-white/[0.07] bg-brand-black-soft p-6 md:p-8">
      <legend className="px-2 font-display text-lg font-bold text-white">{legend}</legend>
      {description && <p className="mb-5 text-sm text-white/50">{description}</p>}
      <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-2 block">
        {label}
        {required && <span className="text-brand-red"> *</span>}
      </Label>
      {children}
      {hint && <p className="mt-1 text-xs text-white/40">{hint}</p>}
    </div>
  );
}

function DocUpload({
  label,
  required,
  disabled,
  state,
  error,
  onPick,
}: {
  label: string;
  required: boolean;
  disabled: boolean;
  state: 'idle' | 'uploading' | 'done' | 'error';
  error?: string;
  onPick: (file: File | undefined) => void;
}) {
  return (
    <div>
      <Label className="mb-2 flex items-center gap-2">
        {label}
        {required && <span className="text-brand-red">*</span>}
        {state === 'done' && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
            <Check className="h-3 w-3" /> Uploaded
          </span>
        )}
        {state === 'uploading' && <Loader2 className="h-3.5 w-3.5 animate-spin text-white/50" />}
      </Label>
      <input
        type="file"
        accept="image/*,application/pdf"
        disabled={disabled || state === 'uploading'}
        onChange={(e) => onPick(e.target.files?.[0])}
        className={`block w-full cursor-pointer rounded-lg border border-dashed p-2.5 text-sm text-white/70 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-brand-red/50 disabled:cursor-not-allowed disabled:opacity-40 ${
          state === 'done'
            ? 'border-emerald-500/40 bg-emerald-500/[0.04] file:bg-emerald-600'
            : 'border-white/15 bg-white/[0.03] file:bg-brand-red'
        }`}
      />
      {state === 'error' && <p className="mt-1 text-xs text-red-400">{error || 'Upload failed.'}</p>}
    </div>
  );
}
