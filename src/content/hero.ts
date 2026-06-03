import type { HeroSlide } from '@/types';

export const heroSlides: HeroSlide[] = [
  {
    id: 'h1',
    title: 'Own the road.',
    highlight: 'Pay Monthly.',
    subtitle:
      'Drive home your dream car today with installments starting as low as AED 899/month. Zero down payment options available across the UAE.',
    image: '/hero/slide1.avif',
    cta: { label: 'Browse Cars', href: '/cars' },
    // secondaryCta: { label: 'Calculate EMI', href: '/emi-calculator' },
  },
  {
    id: 'h2',
    title: 'The keys are closer.',
    highlight: 'Than you think.',
    subtitle:
      'Premium mobility made accessible. Low monthly installments, flexible tenures, and a seamless approval journey from start to finish.',
    image: '/hero/slide2.avif',
    cta: { label: 'View Luxury Cars', href: '/cars?category=Luxury' },
  },
  {
    id: 'h3',
    title: 'Luxury, redefined.',
    highlight: 'Within your budget.',
    subtitle:
    'Discover a smarter way to own the car you deserve. No compromises on quality, just smarter payments that fit your lifestyle.',
    image: '/hero/slide3.avif',
    cta: { label: 'Explore EVs', href: '/cars?category=Electric' },
  },
];
