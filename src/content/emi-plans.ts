import type { EMIPlan } from '@/types';

export const emiPlans: EMIPlan[] = [
  {
    id: 'p1',
    title: 'Starter EMI',
    rate: 8.5,
    tenureMin: 12,
    tenureMax: 36,
    downPaymentMin: 20,
    features: [
      'Quick 24-hr approval',
      'Minimal documentation',
      'No prepayment penalty',
      'Free credit check',
    ],
  },
  {
    id: 'p2',
    title: 'Smart EMI',
    rate: 7.99,
    tenureMin: 24,
    tenureMax: 60,
    downPaymentMin: 10,
    features: [
      'Lowest interest in segment',
      'Step-up EMI option',
      'Free insurance Y1',
      'Doorstep documentation',
      'Same-day disbursal',
    ],
    highlight: true,
  },
  {
    id: 'p3',
    title: 'Premium EMI',
    rate: 7.49,
    tenureMin: 36,
    tenureMax: 84,
    downPaymentMin: 0,
    features: [
      'Zero down payment',
      'Up to 84-month tenure',
      'Free 3-yr insurance',
      'Dedicated relationship manager',
      'Complimentary servicing',
      'Loyalty cashback',
    ],
  },
];
