import type { SiteConfig, NavItem } from '@/types';
import { contactNumbers } from './social';

export const siteConfig: SiteConfig = {
  name: 'Buy&Drive Cars',
  tagline: 'Drive Your Dream. Pay With Ease.',
  description:
    'Drive home your next car in the UAE with flexible monthly installments. Options like zero down payment and free insurance & registration on selected cars, with fast, hassle-free approvals.',
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
    phone: contactNumbers.phone,
    whatsapp: contactNumbers.whatsapp,
    email: 'info@buyanddrive.ae',
    address: 'Burjuman, Dubai, UAE',
    mapUrl: 'https://maps.google.com/?q=burjuman+Dubai',
    mapUrliframe:"https://www.google.com/maps?q=burjuman+Dubai&output=embed"
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
    foundedYear: 2022,
    customers: '1500+',
    carsSold: '1100+',
  },
};

export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Browse Cars', href: '/cars' },
  { label: 'Services', href: '/services' },
  { label: 'Application Status', href: '/services/application-status' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const footerLinks = {
  company: [
    { label: 'Who We Are', href: '/about' },
    { label: 'News & Updates', href: '/news', soon: true },
    // { label: 'Careers', href: '/about#careers' },
    { label: 'Press & Media', href: '/press', soon: true },
  ],
  services: [
    { label: 'Submit Documents', href: '/services' },
    { label: 'Application Status', href: '/services/application-status' },
    // { label: 'Insurance', href: '/services/insurance' },
  ],
  financing: [
  { label: 'Check Eligibility', href: '/#eligibility' },
  { label: 'How EMI Works', href: '/financing', soon: true },
  // { label: 'Required Documents', href: '/financing#documents' },
  // { label: 'Profit Rates', href: '/financing#rates' },
],
  support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/#faq' },
    // { label: 'Privacy Policy', href: '/privacy' },
    // { label: 'Terms of Service', href: '/terms' },
  ],
  legal: [
  { label: 'Terms & Conditions', href: '/terms', soon: true },
  { label: 'Privacy Policy', href: '/privacy', soon: true },
  // { label: 'Cookie Policy', href: '/cookies' },
  // { label: 'Sharia Compliance', href: '/sharia' },
],
};

export const heroStats = [
  { label: 'Cars Financed', value: '1,100+' },
  { label: 'Approval Rate', value: '94%' },
  { label: 'Down Payment From', value: '0%' },
  { label: 'Avg. Approval', value: '5-7 days' },
];
