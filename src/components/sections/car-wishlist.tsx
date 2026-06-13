'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { CheckCircle2, BellRing, Search } from 'lucide-react';
import { registerCarWish, type CarWishState } from '@/actions/leads';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      <BellRing className="h-4 w-4" />
      {pending ? 'Submitting…' : 'Notify me'}
    </Button>
  );
}

export function CarWishlist() {
  const [state, formAction] = useActionState<CarWishState, FormData>(
    registerCarWish,
    {},
  );
  const err = (f: string) => state.fieldErrors?.[f]?.[0];

  return (
    <section className="section bg-brand-black">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-brand-black-soft via-brand-black-soft to-brand-red/[0.06] p-8 sm:p-12 lg:p-16">
          {/* Subtle decorative grid + glow */}
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:48px_48px] opacity-[0.12]" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-red/20 blur-[120px]" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            {/* Copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                <Search className="h-3.5 w-3.5 text-brand-red" />
                Car finder
              </span>
              <h2 className="display-heading mt-5 text-3xl text-white sm:text-4xl lg:text-5xl">
                Didn&apos;t find your match?
                <br />
                <span className="italic text-brand-red">We&apos;ll hunt it down.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/65">
                Tell us the car you&apos;re after. The moment it lands on our lot —
                at the right price, on easy monthly finance — you&apos;ll be the
                first to know. No spam, just your car.
              </p>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-white/[0.08] bg-brand-black/40 p-6 backdrop-blur-sm sm:p-8">
              {state.ok ? (
                <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-200">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />
                  <div>
                    <p className="font-semibold text-white">You&apos;re on the list!</p>
                    <p className="mt-1 text-sm">
                      We&apos;ll reach out the moment a matching car arrives.
                    </p>
                  </div>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">
                  <div>
                    <Label htmlFor="wish-name" className="mb-2 block">
                      Your name
                    </Label>
                    <Input id="wish-name" name="name" placeholder="Full name" autoComplete="name" />
                    {err('name') && <p className="mt-1 text-xs text-red-400">{err('name')}</p>}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="wish-email" className="mb-2 block">
                        Email
                      </Label>
                      <Input
                        id="wish-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                      {err('email') && <p className="mt-1 text-xs text-red-400">{err('email')}</p>}
                    </div>
                    <div>
                      <Label htmlFor="wish-phone" className="mb-2 block">
                        Mobile
                      </Label>
                      <Input
                        id="wish-phone"
                        name="phone"
                        type="tel"
                        placeholder="+971 5x xxx xxxx"
                        autoComplete="tel"
                      />
                      {err('phone') && <p className="mt-1 text-xs text-red-400">{err('phone')}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="wish-car" className="mb-2 block">
                      Which car are you looking for?
                    </Label>
                    <Input
                      id="wish-car"
                      name="desiredCar"
                      placeholder="e.g. Toyota Camry 2022, or 7-seater SUV"
                    />
                    {err('desiredCar') && (
                      <p className="mt-1 text-xs text-red-400">{err('desiredCar')}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="wish-budget" className="mb-2 block">
                        Budget / monthly EMI{' '}
                        <span className="font-normal text-white/35">(optional)</span>
                      </Label>
                      <Input
                        id="wish-budget"
                        name="budget"
                        placeholder="e.g. AED 80k, or 1,500/mo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="wish-timeframe" className="mb-2 block">
                        When are you buying?{' '}
                        <span className="font-normal text-white/35">(optional)</span>
                      </Label>
                      <select
                        id="wish-timeframe"
                        name="timeframe"
                        defaultValue=""
                        className="h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-base text-white focus:border-brand-red focus:outline-none"
                      >
                        <option value="" className="bg-brand-black">
                          Select…
                        </option>
                        <option value="Ready now" className="bg-brand-black">
                          Ready now
                        </option>
                        <option value="1–3 months" className="bg-brand-black">
                          1–3 months
                        </option>
                        <option value="Just browsing" className="bg-brand-black">
                          Just browsing
                        </option>
                      </select>
                    </div>
                  </div>

                  {state.error && !state.fieldErrors && (
                    <p className="text-sm text-red-400">{state.error}</p>
                  )}

                  <SubmitButton />
                  <p className="text-xs text-white/40">
                    We&apos;ll only contact you about cars matching your interest.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
