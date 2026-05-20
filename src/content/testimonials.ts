import type { Testimonial } from '@/types';

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Arjun Mehta',
    role: 'Software Engineer, Bengaluru',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'Got my Hyundai Creta within 36 hours. Zero hidden charges, and the EMI is exactly what was quoted. Their team made the entire process effortless.',
    car: 'Hyundai Creta',
  },
  {
    id: 't2',
    name: 'Priya Sharma',
    role: 'Doctor, Delhi',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'I was nervous about getting a luxury car on EMI. DriveEasy made it feel like a regular purchase. Transparent rates, friendly staff, and a brand-new BMW in my driveway.',
    car: 'BMW 3 Series',
  },
  {
    id: 't3',
    name: 'Rohan Iyer',
    role: 'Entrepreneur, Mumbai',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'Switched to EV without any upfront stress. The green-EMI plan saved me almost 1.5L over the loan period. Highly recommend for anyone considering Tesla.',
    car: 'Tesla Model 3',
  },
  {
    id: 't4',
    name: 'Kavita Reddy',
    role: 'Marketing Director, Hyderabad',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    text: 'After being rejected by 3 banks due to my freelance income, DriveEasy approved my loan in a single day. Genuinely customer-first organization.',
    car: 'Mahindra Thar',
  },
];

export const brands = [
  { name: 'BMW', logo: '/brands/bmw.svg' },
  { name: 'Mercedes-Benz', logo: '/brands/mercedes.svg' },
  { name: 'Audi', logo: '/brands/audi.svg' },
  { name: 'Porsche', logo: '/brands/porsche.svg' },
  { name: 'Tesla', logo: '/brands/tesla.svg' },
  { name: 'Hyundai', logo: '/brands/hyundai.svg' },
  { name: 'Maruti Suzuki', logo: '/brands/maruti.svg' },
  { name: 'Mahindra', logo: '/brands/mahindra.svg' },
  { name: 'Toyota', logo: '/brands/toyota.svg' },
  { name: 'Honda', logo: '/brands/honda.svg' },
];
