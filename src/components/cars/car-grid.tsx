'use client';

import { useMemo, useState } from 'react';
import { CarCard } from './car-card';
import { CarFilters } from './car-filters';
import { cars } from '@/content/cars';
import { SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Electric', 'Sports'];
const FUELS = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const BRANDS = Array.from(new Set(cars.map((c) => c.brand))).sort();

export function CarGrid() {
  const [filters, setFilters] = useState({
    category: 'all',
    fuel: 'all',
    brand: 'all',
    sort: 'featured',
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = useMemo(() => {
    let arr = cars.filter((c) => {
      if (filters.category !== 'all' && c.category !== filters.category)
        return false;
      if (filters.fuel !== 'all' && c.fuel !== filters.fuel) return false;
      if (filters.brand !== 'all' && c.brand !== filters.brand) return false;
      return true;
    });
    switch (filters.sort) {
      case 'price-asc':
        arr = arr.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        arr = arr.sort((a, b) => b.price - a.price);
        break;
      case 'emi-asc':
        arr = arr.sort((a, b) => a.emiFrom - b.emiFrom);
        break;
      default:
        arr = arr.sort((a, b) =>
          a.featured === b.featured ? 0 : a.featured ? -1 : 1,
        );
    }
    return arr;
  }, [filters]);

  const update = (next: Partial<typeof filters>) =>
    setFilters((f) => ({ ...f, ...next }));
  const reset = () =>
    setFilters({ category: 'all', fuel: 'all', brand: 'all', sort: 'featured' });

  return (
    <div className="container-wide py-10 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="display-heading text-3xl md:text-4xl text-white">
            Browse Cars
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Showing {filtered.length} of {cars.length} vehicles
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-sm text-white hover:bg-white/5"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <CarFilters
              categories={CATEGORIES}
              fuels={FUELS}
              brands={BRANDS}
              active={filters}
              onChange={update}
              onReset={reset}
            />
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="bg-brand-black-soft border border-white/[0.06] py-24 text-center">
              <p className="text-white/60">No cars match your filters.</p>
              <button
                type="button"
                onClick={reset}
                className="mt-4 text-brand-red font-medium text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06]">
              {filtered.map((car, i) => (
                <CarCard key={car.id} car={car} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-[88vw] max-w-sm bg-brand-black overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-display text-lg font-bold text-white">
                Filters
              </h3>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close filters"
                className="grid place-items-center w-9 h-9 rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="p-4">
              <CarFilters
                categories={CATEGORIES}
                fuels={FUELS}
                brands={BRANDS}
                active={filters}
                onChange={update}
                onReset={reset}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
