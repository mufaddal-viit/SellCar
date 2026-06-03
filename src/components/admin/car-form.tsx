'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Save } from 'lucide-react';
import { saveCar, type SaveCarState } from '@/actions/cars';
import { MediaManager } from './media-manager';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { AdminCar } from '@/server/cars';
import type { CarInput } from '@/lib/validation';
import type { MediaAsset } from '@/types';

const CATEGORIES = ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Electric', 'Sports'];
const FUELS = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
const TRANSMISSIONS = ['Automatic', 'Manual'];
const BADGES = ['Hot', 'New', 'Popular', 'Best Deal'];
const STATUSES = ['available', 'reserved', 'sold'];

const selectClass =
  'h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-base text-white focus:border-brand-red focus:outline-none';

export function CarForm({ car, uploadFolder }: { car?: AdminCar; uploadFolder: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<SaveCarState>({});

  const [f, setF] = useState({
    name: car?.name ?? '',
    brand: car?.brand ?? '',
    category: car?.category ?? 'Sedan',
    price: String(car?.price ?? ''),
    downPayment: String(car?.downPayment ?? ''),
    emiFrom: String(car?.emiFrom ?? ''),
    tenure: String(car?.tenure ?? '60'),
    year: String(car?.year ?? new Date().getFullYear()),
    fuel: car?.fuel ?? 'Petrol',
    transmission: car?.transmission ?? 'Automatic',
    mileage: car?.mileage ?? '',
    seating: String(car?.seating ?? '5'),
    engine: car?.engine ?? '',
    power: car?.power ?? '',
    description: car?.description ?? '',
    badge: car?.badge ?? '',
    status: car?.status ?? 'available',
    featured: car?.featured ?? false,
    published: car?.published ?? true,
    priceType: car?.priceType ?? 'Price',
    monthlyApprox: car?.monthlyApprox ?? true,
    freeInsurance: car?.freeInsurance ?? false,
    freeRegistration: car?.freeRegistration ?? false,
    zeroDownpayment: car?.zeroDownpayment ?? false,
    firstPaymentAfter2Months: car?.firstPaymentAfter2Months ?? false,
  });

  const [features, setFeatures] = useState<string[]>(car?.features ?? []);
  const [featureInput, setFeatureInput] = useState('');
  const [images, setImages] = useState<MediaAsset[]>(car?.imagesFull ?? []);
  const [videos, setVideos] = useState<MediaAsset[]>(car?.videosFull ?? []);

  const set = (k: keyof typeof f, v: string | boolean) =>
    setF((prev) => ({ ...prev, [k]: v }));

  const addFeature = () => {
    const v = featureInput.trim();
    if (v && !features.includes(v)) setFeatures([...features, v]);
    setFeatureInput('');
  };

  const submit = () => {
    const payload: CarInput = {
      name: f.name,
      brand: f.brand,
      category: f.category as CarInput['category'],
      price: Number(f.price || 0),
      downPayment: Number(f.downPayment || 0),
      emiFrom: Number(f.emiFrom || 0),
      tenure: Number(f.tenure || 60),
      year: Number(f.year || 0),
      fuel: f.fuel as CarInput['fuel'],
      transmission: f.transmission as CarInput['transmission'],
      mileage: f.mileage,
      seating: Number(f.seating || 5),
      engine: f.engine,
      power: f.power,
      features,
      description: f.description,
      badge: (f.badge || null) as CarInput['badge'],
      featured: f.featured,
      status: f.status as CarInput['status'],
      published: f.published,
      priceType: f.priceType as CarInput['priceType'],
      monthlyApprox: f.monthlyApprox,
      freeInsurance: f.freeInsurance,
      freeRegistration: f.freeRegistration,
      zeroDownpayment: f.zeroDownpayment,
      firstPaymentAfter2Months: f.firstPaymentAfter2Months,
      images,
      videos,
    };
    startTransition(async () => {
      const res = await saveCar(car?.id ?? null, payload);
      if (res?.error) setState(res);
    });
  };

  const err = (field: string) => state.fieldErrors?.[field]?.[0];

  return (
    <div className="space-y-6">
      {state.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <p>{state.error}</p>
          {state.fieldErrors && (
            <ul className="mt-2 list-inside list-disc space-y-0.5 text-red-300/80">
              {Object.entries(state.fieldErrors).map(([field, msgs]) => (
                <li key={field}>
                  <span className="capitalize">{field}</span>: {msgs?.[0]}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Section title="Basics">
        <Grid>
          <FieldWrap label="Name" error={err('name')} className="sm:col-span-2">
            <Input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="BMW 3 Series" />
          </FieldWrap>
          <FieldWrap label="Brand" error={err('brand')}>
            <Input value={f.brand} onChange={(e) => set('brand', e.target.value)} placeholder="BMW" />
          </FieldWrap>
          <FieldWrap label="Year" error={err('year')}>
            <Input type="number" value={f.year} onChange={(e) => set('year', e.target.value)} />
          </FieldWrap>
          <FieldWrap label="Category">
            <select className={selectClass} value={f.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FieldWrap>
        </Grid>
      </Section>

      <Section title="Pricing & Finance">
        <Grid>
          <FieldWrap label="Price (AED)" error={err('price')}>
            <Input type="number" value={f.price} onChange={(e) => set('price', e.target.value)} />
          </FieldWrap>
          <FieldWrap label="Down Payment (AED)">
            <Input type="number" value={f.downPayment} onChange={(e) => set('downPayment', e.target.value)} />
          </FieldWrap>
          <FieldWrap label="EMI From (AED/mo)">
            <Input type="number" value={f.emiFrom} onChange={(e) => set('emiFrom', e.target.value)} />
          </FieldWrap>
          <FieldWrap label="Tenure (months)">
            <Input type="number" value={f.tenure} onChange={(e) => set('tenure', e.target.value)} />
          </FieldWrap>
        </Grid>
      </Section>

      <Section title="Specifications">
        <Grid>
          <FieldWrap label="Fuel">
            <select className={selectClass} value={f.fuel} onChange={(e) => set('fuel', e.target.value)}>
              {FUELS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FieldWrap>
          <FieldWrap label="Transmission">
            <select className={selectClass} value={f.transmission} onChange={(e) => set('transmission', e.target.value)}>
              {TRANSMISSIONS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FieldWrap>
          <FieldWrap label="Mileage / Range">
            <Input value={f.mileage} onChange={(e) => set('mileage', e.target.value)} placeholder="14.5 km/l" />
          </FieldWrap>
          <FieldWrap label="Seating">
            <Input type="number" value={f.seating} onChange={(e) => set('seating', e.target.value)} />
          </FieldWrap>
          <FieldWrap label="Engine">
            <Input value={f.engine} onChange={(e) => set('engine', e.target.value)} placeholder="2.0L Turbo" />
          </FieldWrap>
          <FieldWrap label="Power">
            <Input value={f.power} onChange={(e) => set('power', e.target.value)} placeholder="255 bhp" />
          </FieldWrap>
        </Grid>
      </Section>

      <Section title="Description">
        <textarea
          value={f.description}
          onChange={(e) => set('description', e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-white/10 bg-white/5 p-4 text-base text-white placeholder:text-white/40 focus:border-brand-red focus:outline-none"
          placeholder="A short, compelling description of the car…"
        />
      </Section>

      <Section title="Features">
        <div className="flex gap-2">
          <Input
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addFeature();
              }
            }}
            placeholder="e.g. Panoramic Sunroof"
          />
          <Button type="button" variant="outline" onClick={addFeature}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {features.map((feat) => (
              <span key={feat} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80">
                {feat}
                <button type="button" onClick={() => setFeatures(features.filter((x) => x !== feat))} className="text-white/40 hover:text-red-400">
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </Section>

      <Section title="Media">
        <div className="space-y-6">
          <MediaManager label="Photos" hint="First photo is the cover" resourceType="image" folder={uploadFolder} value={images} onChange={setImages} />
          <MediaManager label="Videos" resourceType="video" folder={uploadFolder} value={videos} onChange={setVideos} />
        </div>
      </Section>

      <Section title="Listing Settings">
        <Grid>
          <FieldWrap label="Badge">
            <select className={selectClass} value={f.badge} onChange={(e) => set('badge', e.target.value)}>
              <option value="">None</option>
              {BADGES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FieldWrap>
          <FieldWrap label="Status">
            <select className={`${selectClass} capitalize`} value={f.status} onChange={(e) => set('status', e.target.value)}>
              {STATUSES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </FieldWrap>
          <FieldWrap label="Featured">
            <Toggle checked={f.featured} onChange={(v) => set('featured', v)} label="Show in featured" />
          </FieldWrap>
          <FieldWrap label="Published">
            <Toggle checked={f.published} onChange={(v) => set('published', v)} label="Visible on site" />
          </FieldWrap>
        </Grid>
      </Section>

      <Section title="Offers & Finance">
        <Grid>
          <FieldWrap label="Price Type">
            <select className={selectClass} value={f.priceType} onChange={(e) => set('priceType', e.target.value)}>
              <option value="Price">Cash Price</option>
              <option value="Finance">Finance Price</option>
            </select>
          </FieldWrap>
          <FieldWrap label="Monthly is approx.">
            <Toggle checked={f.monthlyApprox} onChange={(v) => set('monthlyApprox', v)} label="Show ≈ on EMI" />
          </FieldWrap>
          <FieldWrap label="Zero Down Payment">
            <Toggle checked={f.zeroDownpayment} onChange={(v) => set('zeroDownpayment', v)} label="0% down" />
          </FieldWrap>
          <FieldWrap label="Free Insurance">
            <Toggle checked={f.freeInsurance} onChange={(v) => set('freeInsurance', v)} label="Included" />
          </FieldWrap>
          <FieldWrap label="Free Registration">
            <Toggle checked={f.freeRegistration} onChange={(v) => set('freeRegistration', v)} label="Included" />
          </FieldWrap>
          <FieldWrap label="1st Payment in 2 Months">
            <Toggle
              checked={f.firstPaymentAfter2Months}
              onChange={(v) => set('firstPaymentAfter2Months', v)}
              label="Deferred start"
            />
          </FieldWrap>
        </Grid>
      </Section>

      <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] pt-6">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/cars')}>
          Cancel
        </Button>
        <Button type="button" onClick={submit} disabled={pending}>
          <Save className="h-4 w-4" />
          {pending ? 'Saving…' : car ? 'Save Changes' : 'Create Car'}
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-brand-black-soft p-6">
      <h2 className="mb-5 font-display text-lg font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}

function FieldWrap({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-2 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex h-12 w-full items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 text-left"
    >
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-brand-red' : 'bg-white/15'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
            checked ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </span>
      <span className="text-sm text-white/70">{label}</span>
    </button>
  );
}
