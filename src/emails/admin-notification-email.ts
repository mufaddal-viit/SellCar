import { siteConfig } from '@/content/site';
import { emailShell, esc } from './layout';
import type { EmailContent } from './otp-email';

type FormType = 'enquiry' | 'application' | 'wishlist';

const FORM_LABELS: Record<FormType, string> = {
  enquiry: 'New Enquiry',
  application: 'New Finance Application',
  wishlist: 'New Car Wishlist Signup',
};

const BADGE_COLORS: Record<FormType, { bg: string; border: string; text: string }> = {
  enquiry: { bg: '#eff6ff', border: '#93c5fd', text: '#1d4ed8' },
  application: { bg: '#fefce8', border: '#fde047', text: '#a16207' },
  wishlist: { bg: '#f0fdf4', border: '#86efac', text: '#15803d' },
};

interface NotificationData {
  type: FormType;
  name: string;
  phone?: string | null;
  email?: string | null;
  carName?: string | null;
  message?: string | null;
  extras?: Record<string, string>;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 12px 6px 0;font-size:13px;color:#888888;white-space:nowrap;vertical-align:top;">${esc(label)}</td>
    <td style="padding:6px 0;font-size:14px;color:#222222;font-weight:600;">${esc(value)}</td>
  </tr>`;
}

export function adminNotificationEmail(data: NotificationData): EmailContent {
  const badge = BADGE_COLORS[data.type];
  const label = FORM_LABELS[data.type];

  const rows: string[] = [];
  rows.push(row('Name', data.name));
  if (data.phone) rows.push(row('Phone', data.phone));
  if (data.email) rows.push(row('Email', data.email));
  if (data.carName) rows.push(row('Car Interest', data.carName));
  if (data.message) rows.push(row('Message', data.message));
  if (data.extras) {
    for (const [k, v] of Object.entries(data.extras)) {
      if (v) rows.push(row(k, v));
    }
  }

  const textParts = [
    `${label} on ${siteConfig.name}`,
    `Name: ${data.name}`,
    data.phone ? `Phone: ${data.phone}` : '',
    data.email ? `Email: ${data.email}` : '',
    data.carName ? `Car: ${data.carName}` : '',
    data.message ? `Message: ${data.message}` : '',
  ].filter(Boolean);

  return {
    subject: `${label} — ${data.name} | ${siteConfig.name}`,
    text: textParts.join('\n'),
    html: emailShell(
      `
      <tr><td style="padding:36px 32px 8px;">
        <div style="display:inline-block;background:${badge.bg};border:1px solid ${badge.border};color:${badge.text};border-radius:999px;padding:4px 14px;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">${esc(label)}</div>
        <h1 style="margin:14px 0 6px;font-size:20px;color:#111111;">New lead from the website</h1>
        <p style="margin:0;color:#555555;font-size:14px;line-height:1.6;">
          A visitor just submitted the <strong>${esc(label.toLowerCase())}</strong> form on your website.
        </p>
      </td></tr>
      <tr><td style="padding:16px 32px 32px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#fafafa;border:1px solid #eeeeee;border-radius:12px;padding:16px;">
          ${rows.join('')}
        </table>
      </td></tr>
      <tr><td style="padding:0 32px 32px;">
        <p style="margin:0;color:#888888;font-size:12px;line-height:1.6;">
          Log in to the <a href="${siteConfig.url}/admin" style="color:#E10600;text-decoration:none;font-weight:600;">admin panel</a> to follow up.
        </p>
      </td></tr>
    `,
      { preheader: `${label} from ${data.name}` },
    ),
  };
}
