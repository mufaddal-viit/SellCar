import type { SiteConfig, NavItem } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'DriveEasy EMI',
  tagline: 'Drive Your Dream. Pay With Ease.',
  description:
    'India\'s most trusted car-on-EMI platform. Choose from 500+ certified vehicles with flexible EMI plans starting at just 0% down payment. Fastest approvals, lowest interest rates.',
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://driveeasy-emi.com'),
  ogImage: '/og-image.jpg',
  keywords: [
    'car loan',
    'car emi',
    'buy car on emi',
    'used car finance',
    'new car loan',
    'auto loan',
    'car financing India',
    'low down payment car',
    'cheap car emi',
    'car loan calculator',
  ],
  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE || '+91 99999 99999',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '919999999999',
    email: 'hello@driveeasy-emi.com',
    address: '24 Auto Plaza, MG Road, Bengaluru, Karnataka 560001',
    mapUrl: 'https://maps.google.com/?q=MG+Road+Bengaluru',
  },
  social: {
    facebook: 'https://facebook.com/driveeasyemi',
    instagram: 'https://instagram.com/driveeasyemi',
    twitter: 'https://twitter.com/driveeasyemi',
    youtube: 'https://youtube.com/@driveeasyemi',
    linkedin: 'https://linkedin.com/company/driveeasyemi',
  },
  business: {
    name: 'DriveEasy Auto Finance Pvt. Ltd.',
    foundedYear: 2014,
    branches: 42,
    customers: '50,000+',
    carsSold: '1.2 Lakh+',
  },
};

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Browse Cars', href: '/cars' },
  { label: 'EMI Calculator', href: '/emi-calculator' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Branches', href: '/about#branches' },
    { label: 'Careers', href: '/about#careers' },
    { label: 'Press & Media', href: '/about#press' },
  ],
  services: [
    { label: 'New Car EMI', href: '/cars?type=new' },
    { label: 'Used Car EMI', href: '/cars?type=used' },
    { label: 'EMI Calculator', href: '/emi-calculator' },
    { label: 'Insurance', href: '/services/insurance' },
  ],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/#faq' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export const heroStats = [
  { label: 'Happy Customers', value: '50K+' },
  { label: 'Cars Delivered', value: '1.2L+' },
  { label: 'Branches', value: '42' },
  { label: 'Avg. Approval', value: '24 hrs' },
];
