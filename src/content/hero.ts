import type { HeroSlide } from '@/types';

export const heroSlides: HeroSlide[] = [
  {
    id: 'h1',
    title: 'Own the road.',
    highlight: 'Pay Monthly.',
    subtitle:
      'Drive home your dream car today with installments starting as low as AED 899/month. Zero down payment options available across the UAE.',
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
      'Premium sedans and SUVs at unbelievable monthly payments. Tenure up to 60 months with the lowest profit rates in the Emirates.',
    image:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1920&q=80',
    cta: { label: 'View Luxury Cars', href: '/cars?category=Luxury' },
  },
  {
    id: 'h3',
    title: 'Electric future.',
    highlight: 'Affordable Now.',
    subtitle:
      'Switch to electric without the upfront sting. Special green-finance plans on all EV models with extended warranty across Dubai and Abu Dhabi.',
    image:
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1920&q=80',
    cta: { label: 'Explore EVs', href: '/cars?category=Electric' },
  },
];
