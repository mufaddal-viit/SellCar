import { siteConfig } from './site';

export interface AboutValue {
  /** lucide-react icon name — mapped to a component in the page */
  icon: string;
  title: string;
  desc: string;
}

export interface AboutStat {
  icon: string;
  value: string;
  label: string;
}

export const aboutMeta = {
  description:
    "Buy&Drive Cars is one of the UAE's most trusted car finance platforms, serving customers across all 7 emirates with flexible, transparent car finance.",
};

export const aboutHero = {
  title: 'We help the UAE',
  highlight: 'drive home.',
  intro:
    "We were founded on a simple belief: owning a car shouldn't require a fortune up front. Today, we're one of the fastest-growing auto-finance companies in the Emirates.",
  image:
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80',
};

export const aboutStats: AboutStat[] = [
  { icon: 'Users', value: siteConfig.business.customers, label: 'Happy Customers' },
  { icon: 'Building2', value: '7', label: 'Emirates Served' },
  { icon: 'Award', value: siteConfig.business.carsSold, label: 'Cars Delivered' },
  {
    icon: 'Sparkles',
    value: `${new Date().getFullYear() - siteConfig.business.foundedYear}+`,
    label: 'Years of Trust',
  },
];

export const aboutStory = {
  eyebrow: 'Our Story',
  title: 'From one showroom to',
  highlight: 'all 7 emirates.',
  description:
    "What started as a single showroom has grown into one of the UAE's most trusted car finance platforms. We've reimagined automotive finance from the ground up — replacing paperwork with fast approvals, hidden fees with up-front quotes, and queue-based service with dedicated relationship managers.",
  paragraph:
    'Today, we serve customers across all 7 emirates, partner with every major auto brand, and have helped thousands of families bring home their dream car.',
  image:
    'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1600&q=80',
};

export const aboutValuesHeading = {
  eyebrow: 'What we stand for',
  title: 'Three values.',
  highlight: 'Zero exceptions.',
};

export const aboutValues: AboutValue[] = [
  {
    icon: 'Heart',
    title: 'Customer First',
    desc: 'Every decision we make starts with one question: is this better for our customer? We win when you drive away smiling.',
  },
  {
    icon: 'Target',
    title: 'Radical Transparency',
    desc: 'No fine print. No surprise fees. The quote we give is the quote you pay — in writing, every single time.',
  },
  {
    icon: 'Sparkles',
    title: 'Built for the UAE',
    desc: 'From Sheikh Zayed Road to the dunes, our process is designed for the realities of UAE residents — Emiratis, expats and freelancers alike.',
  },
];
