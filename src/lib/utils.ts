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
