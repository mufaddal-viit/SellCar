import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `AED ${amount.toLocaleString('en-AE')}`;
}

export function formatEMI(amount: number): string {
  return `AED ${Math.round(amount).toLocaleString('en-AE')}`;
}

/** "12 Jun 2026" — short, locale-stable absolute date. Returns '—' if invalid. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Human "time ago" — "just now", "3h ago", "5d ago", "2mo ago". '' if invalid. */
export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const secs = Math.round((Date.now() - then) / 1000);
  if (secs < 0) return 'just now';
  if (secs < 60) return 'just now';
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

/** Epoch ms for sorting; 0 for missing/invalid so they sink predictably. */
export function toTimestamp(iso: string | null | undefined): number {
  if (!iso) return 0;
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number,
): number {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / tenureMonths;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return emi;
}

export function calculateTotalInterest(
  emi: number,
  tenureMonths: number,
  principal: number,
): number {
  return emi * tenureMonths - principal;
}

interface OfferFlags {
  zeroDownpayment?: boolean;
  freeInsurance?: boolean;
  freeRegistration?: boolean;
  firstPaymentAfter2Months?: boolean;
}

/** Active finance offers for a car, as short display labels. */
export function carHighlights(car: OfferFlags): string[] {
  const out: string[] = [];
  if (car.zeroDownpayment) out.push('0% Down Payment');
  if (car.freeInsurance) out.push('Free Insurance');
  if (car.freeRegistration) out.push('Free Registration');
  if (car.firstPaymentAfter2Months) out.push('1st Payment in 2 Months');
  return out;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
