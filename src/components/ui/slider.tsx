'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  className?: string;
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  className,
}: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn('relative w-full', className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-input w-full appearance-none bg-transparent cursor-pointer focus:outline-none"
        style={{
          background: `linear-gradient(to right, #E10600 0%, #E10600 ${percent}%, rgba(255,255,255,0.08) ${percent}%, rgba(255,255,255,0.08) 100%)`,
          height: '6px',
          borderRadius: '999px',
        }}
      />
      <style jsx>{`
        .slider-input::-webkit-slider-thumb {
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #e10600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(225, 6, 0, 0.5);
        }
        .slider-input::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #e10600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(225, 6, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
