import { siteConfig } from '@/content/site';
import { emailShell, esc, button } from './layout';
import type { EmailContent } from './otp-email';

export interface PromoTemplate {
  id: string;
  label: string;
}

export const PROMO_TEMPLATES: PromoTemplate[] = [
  { id: 'new_arrivals', label: 'New Arrivals' },
  { id: 'special_offer', label: 'Special Finance Offer' },
  { id: 'follow_up', label: 'Follow-up / Still Looking?' },
];

interface PromoArgs {
  name?: string | null;
  unsubscribeUrl?: string;
}

export function promoEmail(templateId: string, args: PromoArgs): EmailContent {
  const name = (args.name || '').trim() || 'there';
  const url = siteConfig.url;
  const shell = (rows: string, preheader: string) =>
    emailShell(rows, { unsubscribeUrl: args.unsubscribeUrl, preheader });

  switch (templateId) {
    case 'special_offer':
      return {
        subject: `A special finance offer from ${siteConfig.name}`,
        text: `Hi ${name}, for a limited time enjoy zero down payment and free insurance & registration on selected cars. Browse: ${url}/cars`,
        html: shell(
          `<tr><td style="padding:36px 32px 8px;">
             <div style="display:inline-block;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;border-radius:999px;padding:4px 12px;font-size:11px;font-weight:800;letter-spacing:1px;">SPECIAL OFFER</div>
             <h1 style="margin:14px 0 8px;font-size:22px;color:#111111;">A deal worth driving home, ${esc(name)}.</h1>
             <p style="margin:0;color:#555555;font-size:14px;line-height:1.7;">For a limited time, drive away with <strong>zero down payment</strong> and <strong>free insurance &amp; registration</strong> on selected cars — with easy monthly installments and fast approvals.</p>
           </td></tr>
           <tr><td style="padding:22px 32px 36px;">${button(`${url}/cars`, 'Browse cars')}</td></tr>`,
          'A special car finance offer for you',
        ),
      };
    case 'follow_up':
      return {
        subject: 'Still looking for your next car?',
        text: `Hi ${name}, just checking in — whenever you're ready we'll help you find the right car with easy monthly finance. Start here: ${url}/services`,
        html: shell(
          `<tr><td style="padding:36px 32px 8px;">
             <h1 style="margin:0 0 8px;font-size:22px;color:#111111;">Still thinking it over, ${esc(name)}?</h1>
             <p style="margin:0;color:#555555;font-size:14px;line-height:1.7;">No rush — when you're ready, our team will help you find the right car and a monthly plan that fits. Fast approvals, no hidden fees.</p>
           </td></tr>
           <tr><td style="padding:22px 32px 36px;">${button(`${url}/services`, 'Start your application')}</td></tr>`,
          "We're here whenever you're ready",
        ),
      };
    case 'new_arrivals':
    default:
      return {
        subject: `New cars just arrived at ${siteConfig.name}`,
        text: `Hi ${name}, fresh stock just landed — available on flexible monthly installments. Browse the latest cars: ${url}/cars`,
        html: shell(
          `<tr><td style="padding:36px 32px 8px;">
             <h1 style="margin:0 0 8px;font-size:22px;color:#111111;">Fresh arrivals, ${esc(name)} 🚗</h1>
             <p style="margin:0;color:#555555;font-size:14px;line-height:1.7;">New cars just landed on our lot, available on flexible monthly installments. Take a look before they're gone.</p>
           </td></tr>
           <tr><td style="padding:22px 32px 36px;">${button(`${url}/cars`, 'See the latest cars')}</td></tr>`,
          'New cars just arrived',
        ),
      };
  }
}
