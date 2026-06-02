import type { LeadType } from '@/types';

/**
 * Fire-and-forget interaction tracking (WhatsApp / call clicks).
 * Uses sendBeacon so it survives the page navigating away to tel:/wa.me.
 */
export function trackInteraction(
  type: Extract<LeadType, 'whatsapp' | 'call'>,
  carId?: string,
  carName?: string,
) {
  if (typeof navigator === 'undefined') return;
  const payload = JSON.stringify({ type, carId, carName });
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', new Blob([payload], { type: 'application/json' }));
    } else {
      fetch('/api/track', { method: 'POST', body: payload, keepalive: true });
    }
  } catch {
    // Tracking must never block the user's action.
  }
}
