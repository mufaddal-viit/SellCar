import type { Metadata, Viewport } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';

import { Providers } from '@/context';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { FloatingCTA } from '@/components/shared/floating-cta';
import {
  GoogleAnalytics,
} from '@/components/analytics/google-analytics';
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from '@/components/analytics/google-tag-manager';
import { MetaPixel } from '@/components/analytics/meta-pixel';
import { OrganizationJsonLd } from '@/components/seo/json-ld';
import { siteConfig } from '@/content/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const display = Manrope({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.business.name }],
  creator: siteConfig.business.name,
  publisher: siteConfig.business.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <head>
        <GoogleTagManager />
        <OrganizationJsonLd />
      </head>
      <body className="min-h-screen bg-brand-black antialiased font-sans">
        <GoogleTagManagerNoScript />
        <Providers>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <FloatingCTA />
        </Providers>
        <GoogleAnalytics />
        <MetaPixel />
      </body>
    </html>
  );
}
