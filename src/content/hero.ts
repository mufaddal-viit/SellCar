import type { HeroSlide } from '@/types';

export const heroSlides: HeroSlide[] = [
  {
    id: 'h1',
    title: 'Own the road.',
    highlight: 'Pay Monthly.',
    subtitle:
      'Drive home your dream car today with EMIs starting as low as ₹8,999/month. Zero down payment options available.',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80',
    cta: { label: 'Browse Cars', href: '/cars' },
    secondaryCta: { label: 'Calculate EMI', href: '/emi-calculator' },
  },
  {
    id: 'h2',
    title: 'Luxury within reach.',
    highlight: 'No Compromises.',
    subtitle:
      'Premium sedans and SUVs at unbelievable monthly payments. Tenure up to 84 months with the lowest interest rates in India.',
    image:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1920&q=80',
    cta: { label: 'View Luxury Cars', href: '/cars?category=Luxury' },
  },
  {
    id: 'h3',
    title: 'Electric future.',
    highlight: 'Affordable Now.',
    subtitle:
      'Switch to electric without the upfront sting. Special green-EMI plans on all EV models with extended warranty.',
    image:
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1920&q=80',
    cta: { label: 'Explore EVs', href: '/cars?category=Electric' },
  },
];
