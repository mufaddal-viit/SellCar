import type { Testimonial } from '@/types';

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Ahmed Al Mansoori',
    role: 'Government Officer, Abu Dhabi',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'Got my Toyota Land Cruiser within 36 hours. Zero hidden charges, and the monthly installment is exactly what was quoted. Their team made the entire process effortless.',
    car: 'Toyota Land Cruiser',
  },
  {
    id: 't2',
    name: 'Sarah Thompson',
    role: 'Marketing Director, Dubai',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'I was nervous about financing a luxury car as an expat. DriveEasy made it feel like a regular purchase. Transparent rates, friendly staff, and a brand-new BMW in my driveway within a week.',
    car: 'BMW 3 Series',
  },
  {
    id: 't3',
    name: 'Rohan Iyer',
    role: 'Entrepreneur, Dubai Marina',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'Switched to EV without any upfront stress. The green-finance plan saved me almost AED 12,000 over the loan period. Highly recommend for anyone considering a Tesla in the UAE.',
    car: 'Tesla Model 3',
  },
  {
    id: 't4',
    name: 'Fatima Al Hashimi',
    role: 'Architect, Sharjah',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'After being rejected by 2 banks due to my freelance income, DriveEasy approved my finance in a single day. They genuinely understand the UAE market and self-employed customers.',
    car: 'Nissan Patrol',
  },
];

export const brands = [
  { name: 'BMW', logo: '/brands/bmw.svg' },
  { name: 'Mercedes-Benz', logo: '/brands/mercedes.svg' },
  { name: 'Audi', logo: '/brands/audi.svg' },
  { name: 'Porsche', logo: '/brands/porsche.svg' },
  { name: 'Tesla', logo: '/brands/tesla.svg' },
  { name: 'Toyota', logo: '/brands/toyota.svg' },
  { name: 'Nissan', logo: '/brands/nissan.svg' },
  { name: 'Lexus', logo: '/brands/lexus.svg' },
  { name: 'Hyundai', logo: '/brands/hyundai.svg' },
  { name: 'Honda', logo: '/brands/honda.svg' },
];
