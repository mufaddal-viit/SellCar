export interface Feature {
  /** lucide-react icon name — mapped to a component in the section */
  icon: string;
  title: string;
  desc: string;
}

/** Headline selling points shown in the "Why choose us" grid. */
export const whyChooseUs: Feature[] = [
  {
    icon: 'ShieldCheck',
    title: 'Free Insurance',
    desc: 'Comprehensive insurance included free with your car — fully covered from day one.',
  },
  {
    icon: 'FileCheck',
    title: 'Free Registration',
    desc: 'We handle and cover all RTA registration paperwork and fees for you.',
  },
  {
    icon: 'Wallet',
    title: 'Zero Down Payment',
    desc: 'Drive home with 0% down on eligible cars — keep your savings in your pocket.',
  },
  {
    icon: 'CalendarClock',
    title: 'First Payment After 2 Months',
    desc: 'Start driving now and make your first installment two months later.',
  },
  {
    icon: 'ReceiptText',
    title: 'Insurance & RTA in Your EMI',
    desc: 'Insurance and RTA fees are built into one simple monthly EMI — no separate bills.',
  },
  {
    icon: 'TrendingDown',
    title: 'Lowest Rates',
    desc: 'Profit rates starting at 2.99% — significantly below market average across UAE banks.',
  },
  {
    icon: 'Wallet',
    title: 'Zero Hidden Charges',
    desc: 'What we quote is what you pay. All processing, registration and insurance fees included upfront.',
  },
  {
    icon: 'ShieldCheck',
    title: '140+ Point Inspection',
    desc: 'Every certified pre-owned car passes our rigorous mechanical and safety inspection.',
  },
  {
    icon: 'HeartHandshake',
    title: 'Dedicated Support',
    desc: 'A personal advisor guides you from your first enquiry through to delivery — and beyond.',
  },
  {
    icon: 'Clock',
    title: 'Flexible Tenures',
    desc: 'Choose anything from 12 to 60 months. Step-up installment plans available for first-time UAE buyers.',
  },
];

/** Quality / inspection guarantees — the "Assurance Cover" band. */
export const assuranceCover: Feature[] = [
  {
    icon: 'Activity',
    title: '100% Diagnostics Passed',
    desc: 'Every car clears a full mechanical and electronic health check.',
  },
  {
    icon: 'CarFront',
    title: 'No Accident History',
    desc: 'Verified accident-free, with a clean ownership record.',
  },
  {
    icon: 'Car',
    title: 'No Structural Damage',
    desc: 'Chassis and frame inspected and confirmed intact.',
  },
  {
    icon: 'Gauge',
    title: 'No Odometer Tampering',
    desc: 'Genuine, verified mileage on every vehicle.',
  },
  {
    icon: 'Droplets',
    title: 'No Flood Damage',
    desc: 'Checked and cleared for any water or flood damage.',
  },
  {
    icon: 'ListChecks',
    title: '140+ Check Points',
    desc: 'A thorough 140-point inspection before any car is listed.',
  },
  {
    icon: 'BadgeCheck',
    title: 'Exceeds RTA Standards',
    desc: 'Guaranteed to pass RTA testing.',
  },
];
