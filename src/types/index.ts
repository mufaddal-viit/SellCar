export interface Car {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: 'Sedan' | 'SUV' | 'Hatchback' | 'Luxury' | 'Electric' | 'Sports';
  price: number;
  downPayment: number;
  emiFrom: number;
  tenure: number;
  year: number;
  fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
  transmission: 'Manual' | 'Automatic';
  mileage: string;
  seating: number;
  engine: string;
  power: string;
  images: string[];
  videos?: string[];
  features: string[];
  description: string;
  badge?: 'Hot' | 'New' | 'Popular' | 'Best Deal';
  featured?: boolean;
  status?: CarStatus;
  published?: boolean;
  soldAt?: string;
  // Finance offers / selling points
  priceType?: 'Price' | 'Finance';
  monthlyApprox?: boolean;
  freeInsurance?: boolean;
  freeRegistration?: boolean;
  zeroDownpayment?: boolean;
  firstPaymentAfter2Months?: boolean;
}

export type CarStatus = 'available' | 'reserved' | 'sold';

/** A single uploaded asset as stored in the DB (publicId lets us delete from Cloudinary). */
export interface MediaAsset {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

export type LeadType = 'enquiry' | 'whatsapp' | 'call';
export type LeadStatus = 'new' | 'contacted' | 'closed';

export interface Lead {
  id: string;
  type: LeadType;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  carId?: string;
  carName?: string;
  status: LeadStatus;
  createdAt: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  ogImage: string;
  keywords: string[];
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    mapUrl: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin: string;
  };
  business: {
    name: string;
    foundedYear: number;
    customers: string;
    carsSold: string;
  };
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  car: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Brand {
  name: string;
  logo: string;
}

export interface EMIPlan {
  id: string;
  title: string;
  rate: number;
  tenureMin: number;
  tenureMax: number;
  downPaymentMin: number;
  features: string[];
  highlight?: boolean;
}

export interface HeroSlide {
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  image: string;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface ImageAsset {
  key: string;
  url: string;
  alt: string;
  label: string;
  category: 'hero' | 'car' | 'brand' | 'testimonial' | 'general';
}
