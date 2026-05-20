'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  calculateEMI,
  calculateTotalInterest,
  formatEMI,
  formatPrice,
} from '@/lib/utils';
import { siteConfig } from '@/content/site';
import { ArrowRight, MessageCircle } from 'lucide-react';

interface Props {
  initialPrice?: number;
  className?: string;
  compact?: boolean;
}

export function EMICalculator({
  initialPrice = 1500000,
  className,
  compact = false,
}: Props) {
  const [price, setPrice] = useState(initialPrice);
  const [downPct, setDownPct] = useState(15);
  const [tenure, setTenure] = useState(60);
  const [rate, setRate] = useState(8.5);

  const result = useMemo(() => {
    const down = (price * downPct) / 100;
    const principal = price - down;
    const emi = calculateEMI(principal, rate, tenure);
    const totalInterest = calculateTotalInterest(emi, tenure, principal);
    const totalPayable = principal + totalInterest;
    return { down, principal, emi, totalInterest, totalPayable };
  }, [price, downPct, tenure, rate]);

  const waMsg = encodeURIComponent(
    `Hi ${siteConfig.name}, I calculated an EMI of ${formatEMI(
      result.emi,
    )}/mo for a car worth ${formatPrice(
      price,
    )}. Please share more details on this loan.`,
  );

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-5 gap-px bg-white/[0.06] border border-white/[0.06] ${className || ''}`}>
      <div className="lg:col-span-3 bg-brand-black-soft p-6 md:p-10">
        <div className="space-y-8">
          <Field
            label="Car Price"
            value={formatPrice(price)}
            slider={
              <Slider
                value={price}
                min={500000}
                max={20000000}
                step={50000}
                onChange={setPrice}
              />
            }
            range={['₹ 5 L', '₹ 2 Cr']}
          />
          <Field
            label="Down Payment"
            value={`${downPct}% • ${formatPrice(result.down)}`}
            slider={
              <Slider
                value={downPct}
                min={0}
                max={50}
                step={1}
                onChange={setDownPct}
              />
            }
            range={['0%', '50%']}
          />
          <Field
            label="Tenure"
            value={`${tenure} months • ${(tenure / 12).toFixed(1)} years`}
            slider={
              <Slider
                value={tenure}
                min={12}
                max={84}
                step={1}
                onChange={setTenure}
              />
            }
            range={['12 mo', '84 mo']}
          />
          <Field
            label="Interest Rate"
            value={`${rate.toFixed(2)}% p.a.`}
            slider={
              <Slider
                value={rate}
                min={6.5}
                max={15}
                step={0.1}
                onChange={setRate}
              />
            }
            range={['6.5%', '15%']}
          />
        </div>
      </div>

      <div className="lg:col-span-2 bg-brand-red text-white p-6 md:p-10 flex flex-col">
        <div className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-80">
          Your Monthly EMI
        </div>
        <motion.div
          key={Math.round(result.emi)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-3 font-display text-5xl md:text-6xl font-bold leading-none"
        >
          {formatEMI(result.emi)}
        </motion.div>
        <div className="mt-1 text-sm opacity-80">per month</div>

        <div className="mt-8 space-y-4 pt-8 border-t border-white/20">
          <Row label="Loan Amount" value={formatPrice(result.principal)} />
          <Row label="Total Interest" value={formatPrice(result.totalInterest)} />
          <Row
            label="Total Payable"
            value={formatPrice(result.totalPayable)}
            strong
          />
        </div>

        {!compact && (
          <div className="mt-auto pt-8 space-y-3">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="w-full"
            >
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${waMsg}`}
                target="_blank"
                rel="noopener"
              >
                <MessageCircle className="w-4 h-4" />
                Get this Loan
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <p className="text-[11px] opacity-75 text-center">
              *Indicative only. Actual rate subject to credit profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  slider,
  range,
}: {
  label: string;
  value: string;
  slider: React.ReactNode;
  range: [string, string];
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label>{label}</Label>
        <span className="text-sm font-semibold text-white">{value}</span>
      </div>
      {slider}
      <div className="mt-2 flex items-center justify-between text-[10px] text-white/40">
        <span>{range[0]}</span>
        <span>{range[1]}</span>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs uppercase tracking-widest opacity-80">
        {label}
      </span>
      <span
        className={`font-display ${
          strong ? 'text-xl font-bold' : 'text-base font-semibold'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
