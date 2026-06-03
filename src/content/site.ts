import type { SiteConfig, NavItem } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'Buy&Drive Cars',
  tagline: 'Drive Your Dream. Pay With Ease.',
  description:
    "The UAE's most trusted car finance platform. Choose from 500+ certified vehicles with flexible monthly installments starting at just 0% down payment. Fastest approvals, lowest profit rates.",
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
    foundedYear: 2014,
    branches: 12,
    customers: '35,000+',
    carsSold: '85,000+',
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
    { label: 'Our Showrooms', href: '/about#branches' },
    { label: 'Careers', href: '/about#careers' },
    { label: 'Press & Media', href: '/about#press' },
  ],
  services: [
    { label: 'New Car Finance', href: '/cars?type=new' },
    { label: 'Used Car Finance', href: '/cars?type=used' },
    { label: 'Islamic Finance', href: '/services/islamic-finance' },
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
  { label: 'Happy Customers', value: '35K+' },
  { label: 'Cars Delivered', value: '85K+' },
  { label: 'Showrooms', value: '12' },
  { label: 'Avg. Approval', value: '24 hrs' },
];
