'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { CheckCircle2, Send, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const fieldBase =
  'h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-base text-white placeholder:text-white/40 focus:border-brand-red focus:outline-none transition-colors';

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
      <legend className="px-2 font-display text-lg font-bold text-white">
        {legend}
      </legend>
      {description && <p className="mb-5 text-sm text-white/50">{description}</p>}
      <div className="mt-2 grid grid-cols-1 gap-5">{children}</div>
    </fieldset>
  );
}

function FileField({ label, name }: { label: string; name: string }) {
  return (
    <Field label={label} htmlFor={name}>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*,application/pdf"
        className="block w-full cursor-pointer rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-2.5 text-sm text-white/70 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-brand-red file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:border-brand-red/50"
      />
    </Field>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      <Send className="h-4 w-4" />
      {pending ? 'Submitting…' : 'Submit Application'}
    </Button>
  );
}

export function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);

  // UI only for now — details will be linked to a user account once auth/login ships.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-400" />
        <h2 className="font-display text-2xl font-bold text-white">Application received</h2>
        <p className="mx-auto mt-3 max-w-md text-white/70">
          Thank you! Our finance team will review your details and documents and
          get back to you shortly. You&apos;ll be able to track your application
          once accounts go live.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-start gap-3 rounded-xl border border-brand-red/20 bg-brand-red/[0.06] p-4 text-sm text-white/75">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
        <p>
          A minimum salary of <strong className="text-white">AED 5,000</strong> is
          required. Your information is kept confidential and used only to process
          your car finance application.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
      <div className="space-y-6">
      <Section legend="Contact Details">
        <Field label="Mobile Number" htmlFor="mobile" required>
          <Input id="mobile" name="mobile" type="tel" required placeholder="+971 5x xxx xxxx" />
        </Field>
        <Field label="Email ID" htmlFor="email" required>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </Field>
        <Field label="Home Country Mobile Number" htmlFor="homeMobile">
          <Input id="homeMobile" name="homeMobile" type="tel" placeholder="+__ xxx xxx xxxx" />
        </Field>
      </Section>

      <Section legend="Residential Address (UAE)">
        <Field label="Flat / Villa Number" htmlFor="flat">
          <Input id="flat" name="flat" />
        </Field>
        <Field label="Building Name" htmlFor="building">
          <Input id="building" name="building" />
        </Field>
        <Field label="Street Name" htmlFor="street">
          <Input id="street" name="street" />
        </Field>
        <Field label="Area Name" htmlFor="area">
          <Input id="area" name="area" />
        </Field>
        <Field label="City Name" htmlFor="city">
          <Input id="city" name="city" />
        </Field>
      </Section>

      <Section legend="Personal & Home Country">
        <Field label="Mother's Name" htmlFor="mother">
          <Input id="mother" name="mother" />
        </Field>
        <Field label="Home Country Address" htmlFor="homeAddress" hint="Include a nearby landmark" className="sm:col-span-2">
          <textarea id="homeAddress" name="homeAddress" rows={3} className={`${fieldBase} h-auto py-3`} />
        </Field>
      </Section>

      <Section legend="Employment">
        <Field label="Office Address" htmlFor="officeAddress" className="sm:col-span-2">
          <textarea id="officeAddress" name="officeAddress" rows={2} className={`${fieldBase} h-auto py-3`} />
        </Field>
        <Field label="Office Landline Number" htmlFor="officeLandline">
          <Input id="officeLandline" name="officeLandline" type="tel" />
        </Field>
      </Section>
      </div>

      <div className="space-y-6">
      <Section legend="Salary & Banking">
        <Field label="Salary Credit Date" htmlFor="salaryDate" hint="e.g. 25th of each month">
          <Input id="salaryDate" name="salaryDate" placeholder="Day of month" />
        </Field>
        <Field label="Salary Bank Name" htmlFor="bankName">
          <Input id="bankName" name="bankName" />
        </Field>
        <Field label="IBAN Number" htmlFor="iban" className="sm:col-span-2">
          <Input id="iban" name="iban" placeholder="AE__ ____ ____ ____ ____ ___" />
        </Field>
      </Section>

      <Section legend="Existing Obligations" description="Leave blank or select “No” if not applicable.">
        <Field label="Existing Loan Installment (if any)" htmlFor="loanInstallment">
          <Input id="loanInstallment" name="loanInstallment" placeholder="Monthly amount in AED" />
        </Field>
        <Field label="Existing Credit Cards?" htmlFor="hasCards">
          <select id="hasCards" name="hasCards" className={fieldBase} defaultValue="No">
            <option>No</option>
            <option>Yes</option>
          </select>
        </Field>
        <Field label="If yes, total credit limit" htmlFor="cardLimit">
          <Input id="cardLimit" name="cardLimit" placeholder="Total limit in AED" />
        </Field>
        <Field label="Any Cash-Now Loan?" htmlFor="cashLoan">
          <select id="cashLoan" name="cashLoan" className={fieldBase} defaultValue="No">
            <option>No</option>
            <option>Yes</option>
          </select>
        </Field>
      </Section>

      <Section legend="References" description="Two friends or relatives we can contact.">
        <Field label="Reference 1 — Name" htmlFor="ref1Name">
          <Input id="ref1Name" name="ref1Name" />
        </Field>
        <Field label="Reference 1 — Mobile" htmlFor="ref1Mobile">
          <Input id="ref1Mobile" name="ref1Mobile" type="tel" />
        </Field>
        <Field label="Reference 2 — Name" htmlFor="ref2Name">
          <Input id="ref2Name" name="ref2Name" />
        </Field>
        <Field label="Reference 2 — Mobile" htmlFor="ref2Mobile">
          <Input id="ref2Mobile" name="ref2Mobile" type="tel" />
        </Field>
      </Section>

      <Section
        legend="Documents"
        description="Upload clear photos or PDFs. Last 3 months' bank statement can be replaced with your IBAN above."
      >
        <FileField label="Emirates ID" name="docEmiratesId" />
        <FileField label="Visa" name="docVisa" />
        <FileField label="Passport Copy" name="docPassport" />
        <FileField label="Salary Certificate" name="docSalaryCert" />
        <FileField label="Last 3 Months Bank Statement" name="docBankStatement" />
      </Section>
      </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-xs text-white/40">
          By submitting, you agree to be contacted about your application.
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
