import { z } from 'zod';

const mediaSchema = z.object({
  url: z.string().url(),
  // May be empty for seed/external images (Unsplash) that aren't Cloudinary uploads.
  publicId: z.string().default(''),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const carInputSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.enum(['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Electric', 'Sports']),
  price: z.coerce.number().min(0, 'Price must be positive'),
  downPayment: z.coerce.number().min(0).default(0),
  emiFrom: z.coerce.number().min(0).default(0),
  tenure: z.coerce.number().min(1).max(120).default(60),
  year: z.coerce.number().min(1990).max(2100),
  fuel: z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG']),
  transmission: z.enum(['Manual', 'Automatic']),
  mileage: z.string().default(''),
  seating: z.coerce.number().min(1).max(20).default(5),
  engine: z.string().default(''),
  power: z.string().default(''),
  features: z.array(z.string().min(1)).default([]),
  description: z.string().default(''),
  badge: z.enum(['Hot', 'New', 'Popular', 'Best Deal']).nullish(),
  featured: z.coerce.boolean().default(false),
  status: z.enum(['available', 'reserved', 'sold']).default('available'),
  published: z.coerce.boolean().default(true),
  // Finance offers
  priceType: z.enum(['Price', 'Finance']).default('Price'),
  monthlyApprox: z.coerce.boolean().default(true),
  freeInsurance: z.coerce.boolean().default(false),
  freeRegistration: z.coerce.boolean().default(false),
  zeroDownpayment: z.coerce.boolean().default(false),
  firstPaymentAfter2Months: z.coerce.boolean().default(false),
  images: z.array(mediaSchema).default([]),
  videos: z.array(mediaSchema).default([]),
});

export type CarInput = z.infer<typeof carInputSchema>;

export const leadInputSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  phone: z.string().min(6, 'Please enter a valid phone number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  message: z.string().max(2000).optional().or(z.literal('')),
  carId: z.string().optional(),
  carName: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;
