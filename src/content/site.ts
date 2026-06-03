import type { SiteConfig, NavItem } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'Buy&Drive Cars',
  tagline: 'Drive Your Dream. Pay With Ease.',
  description:
    "A fresh way to drive home your next car in the UAE. Hand-picked vehicles with flexible monthly installments, zero down payment, and free insurance & registration. Fast approvals, honest profit rates, zero hassle.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://buyanddrivecars.ae'),
  ogImage: '/logo.png',
  keywords: [
    'car finance UAE',
    'car loan Dubai',
    'car installment UAE',
    'buy car on EMI UAE',
    'used car finance Dubai',
    'new car loan UAE',
    'auto finance Dubai',
    'car financing Abu Dhabi',
    'low down payment car UAE',
    'cheap car installment Dubai',
    'car loan calculator UAE',
    'Islamic car finance',
  ],
  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE || '+971 4 555 0000',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '971555550000',
    email: 'hello@buyanddrivecars.ae',
    address: 'Office 1204, Burj Al Salam, Sheikh Zayed Road, Dubai, UAE',
    mapUrl: 'https://maps.google.com/?q=Sheikh+Zayed+Road+Dubai',
  },
  social: {
    facebook: 'https://www.facebook.com/share/18dCeUbmJp/?mibextid=wwXIfr',
    instagram:
      'https://www.instagram.com/buyndriveusedcars?igsh=YWttbjgxZ3dianFt&utm_source=qr',
    twitter: '',
    youtube: '',
    linkedin: '',
  },
  business: {
    name: 'Buy&Drive Cars Auto Finance LLC',
    foundedYear: 2024,
    customers: '15,00+',
    carsSold: '15,00+',
  },
};

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Browse Cars', href: '/cars' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const footerLinks = {
  company: [
    { label: 'Who We Are', href: '/about' },
    { label: 'News & Updates', href: '/news', soon: true },
    { label: 'Careers', href: '/about#careers' },
    { label: 'Press & Media', href: '/press', soon: true },
  ],
  services: [
    { label: 'Submit Documents', href: '/services' },
    { label: 'Check Documents', href: '/services/check-status' },
    { label: 'Insurance', href: '/services/insurance' },
  ],
  financing: [
  { label: 'How EMI Works', href: '/financing' },
  { label: 'Check Eligibility', href: '/financing#eligibility' },
  { label: 'Required Documents', href: '/financing#documents' },
  { label: 'Profit Rates', href: '/financing#rates' },
],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/#faq' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  legal: [
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Sharia Compliance', href: '/sharia' },
],
};

export const heroStats = [
  { label: 'Cars Financed', value: '1,200+' },
  { label: 'Approval Rate', value: '94%' },
  { label: 'Profit Rate From', value: '1.99%' },
  { label: 'Avg. Approval', value: '24 hrs' },
];
