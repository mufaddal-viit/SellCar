import { siteConfig } from '@/content/site';
import type { Car } from '@/types';

export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: siteConfig.business.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    foundingDate: String(siteConfig.business.foundedYear),
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address,
      addressCountry: 'AE',
    },
    sameAs: Object.values(siteConfig.social).filter(Boolean),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function VehicleJsonLd({ car }: { car: Car }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: car.name,
    brand: { '@type': 'Brand', name: car.brand },
    model: car.name,
    vehicleModelDate: String(car.year),
    fuelType: car.fuel,
    vehicleTransmission: car.transmission,
    vehicleEngine: { '@type': 'EngineSpecification', name: car.engine },
    numberOfDoors: car.seating >= 5 ? 4 : 2,
    seatingCapacity: car.seating,
    image: car.images,
    description: car.description,
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'AED',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'AutoDealer', name: siteConfig.name },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
