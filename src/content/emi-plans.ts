import type { EMIPlan } from '@/types';

export const emiPlans: EMIPlan[] = [
  {
    id: 'p1',
    title: 'Starter Plan',
    rate: 4.49,
    tenureMin: 12,
    tenureMax: 36,
    downPaymentMin: 20,
    features: [
      'Quick 24-hr approval',
      'Minimal documentation',
      'No early settlement penalty after 6 months',
      'Free credit check',
    ],
  },
  {
    id: 'p2',
    title: 'Smart Plan',
    rate: 2.99,
    tenureMin: 24,
    tenureMax: 60,
    downPaymentMin: 10,
    features: [
      'Lowest profit rate in the UAE',
      'Step-up installment option',
      'Free comprehensive insurance Y1',
      'Doorstep documentation',
      'Same-day disbursal',
    ],
    highlight: true,
  },
  {
    id: 'p3',
    title: 'Premium Plan',
    rate: 3.49,
    tenureMin: 36,
    tenureMax: 60,
    downPaymentMin: 0,
    features: [
      'Zero down payment',
      'Sharia-compliant option available',
      'Free 3-yr comprehensive insurance',
      'Dedicated relationship manager',
      'Complimentary servicing package',
      'Loyalty cashback',
    ],
  },
];
