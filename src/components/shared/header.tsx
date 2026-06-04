'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Logo } from './logo';
import { SocialLinks } from './social-links';
import { Button } from '@/components/ui/button';
import { mainNav, siteConfig } from '@/content/site';
import { useUI } from '@/context';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { mobileMenuOpen, toggleMobileMenu } = useUI();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    toggleMobileMenu(false);
  }, [pathname, toggleMobileMenu]);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-brand-black/85 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent',
      )}
    >
      <div className="container-wide flex h-16 md:h-20 items-center justify-between">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          {mainNav.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors rounded-full',
                  active ? 'text-white' : 'text-white/60 hover:text-white',
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-px w-6 bg-brand-red" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <SocialLinks size="sm" className="hidden xl:flex" />
          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="hidden md:inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="font-medium">{siteConfig.contact.phone}</span>
          </a>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/cars">Get Started</Link>
          </Button>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => toggleMobileMenu()}
            className="lg:hidden grid place-items-center w-10 h-10 rounded-full border border-white/10 text-white hover:bg-white/5"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'lg:hidden absolute left-0 right-0 top-full bg-brand-black border-b border-white/[0.06] transition-all duration-300 overflow-hidden',
          mobileMenuOpen
            ? 'max-h-[600px] opacity-100'
            : 'max-h-0 opacity-0 pointer-events-none',
        )}
      >
        <div className="container-wide py-6 space-y-1">
          {mainNav.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block px-4 py-3 text-base font-medium rounded-lg transition-colors',
                  active
                    ? 'bg-brand-red/10 text-brand-red'
                    : 'text-white/80 hover:bg-white/5',
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-3 mt-3 border-t border-white/10 space-y-3">
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="flex items-center gap-3 px-4 py-3 text-white/80"
            >
              <Phone className="w-4 h-4 text-brand-red" />
              <span>{siteConfig.contact.phone}</span>
            </a>
            <Button asChild className="w-full">
              <Link href="/cars">Get Started</Link>
            </Button>
            <SocialLinks className="px-4 pt-1" />
          </div>
        </div>
      </div>
    </header>
  );
}
