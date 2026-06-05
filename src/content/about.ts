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
    'Buy&Drive Cars is a UAE car finance partner serving customers across all 7 emirates with flexible, transparent car finance.',
};

export const aboutHero = {
  title: 'We help the UAE',
  highlight: 'drive home.',
  intro:
    "We were founded on a simple belief: owning a car shouldn't require a fortune up front. We help UAE residents drive home the car they want with finance that's simple and transparent.",
  image: '/about/hero.jpg',
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
  title: 'Car finance,',
  highlight: 'made simple.',
  description:
    "We've made car finance simpler in the UAE — fast approvals, up-front quotes with no hidden fees, and a dedicated team that guides you from your first enquiry through to delivery.",
  paragraph:
    'We serve customers across all 7 emirates and work with a wide range of brands to help you drive home the car you want.',
  image: '/about/story.jpg',
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
