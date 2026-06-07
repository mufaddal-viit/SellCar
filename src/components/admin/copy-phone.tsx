'use client';

import { useState } from 'react';
import { Copy, Check, Phone } from 'lucide-react';

/** Phone number with click-to-call + a one-tap copy button (for admin). */
export function CopyPhone({ phone, className }: { phone: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${className ?? ''}`}>
      <a href={`tel:${phone}`} className="inline-flex items-center gap-1 hover:text-white" title="Call">
        <Phone className="h-3 w-3 text-brand-red" />
        {phone}
      </a>
      <button
        type="button"
        onClick={copy}
        title={copied ? 'Copied' : 'Copy number'}
        aria-label="Copy number"
        className="text-white/40 transition-colors hover:text-brand-red"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
    </span>
  );
}
