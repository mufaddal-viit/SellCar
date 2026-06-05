import { siteConfig } from '@/content/site';
import { emailShell, esc, button } from './layout';
import type { EmailContent } from './otp-email';

/** Sent when an admin approves an application. Edit copy & styling freely. */
export function approvedEmail({
  name,
  carName,
}: {
  name: string;
  carName?: string | null;
}): EmailContent {
  const carText = carName ? ` for the ${carName}` : '';
  const carHtml = carName ? ` for the <strong>${esc(carName)}</strong>` : '';

  return {
    subject: `Good news — your ${siteConfig.name} application is approved`,
    text: `Hi ${name}, great news! Your car finance application${carText} has been approved. Our team will contact you shortly with the next steps. Check your status at ${siteConfig.url}/application-status`,
    html: emailShell(`
      <tr><td style="padding:36px 32px 8px;">
        <div style="display:inline-block;background:#ecfdf5;border:1px solid #a7f3d0;color:#047857;border-radius:999px;padding:4px 12px;font-size:11px;font-weight:800;letter-spacing:1px;">APPROVED</div>
        <h1 style="margin:14px 0 8px;font-size:22px;color:#111111;">You're approved, ${esc(name)}! 🎉</h1>
        <p style="margin:0;color:#555555;font-size:14px;line-height:1.7;">
          Great news — your car finance application${carHtml} has been <strong>approved</strong>.
          Our team will reach out shortly to finalise the paperwork and arrange your delivery.
        </p>
      </td></tr>
      <tr><td style="padding:22px 32px 32px;">
        ${button(`${siteConfig.url}/application-status`, 'Check your status')}
      </td></tr>
    `),
  };
}
