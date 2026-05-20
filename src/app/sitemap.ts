import type { MetadataRoute } from 'next';
import { siteConfig } from '@/content/site';
import { cars } from '@/content/cars';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const routes = [
    '',
    '/cars',
    '/emi-calculator',
    '/about',
    '/contact',
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const carRoutes = cars.map((c) => ({
    url: `${base}/cars/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...carRoutes];
}
