import { siteConfig } from '@/content/site';
import { emailShell, esc, button } from './layout';
import type { EmailContent } from './otp-email';

/** Sent when an admin rejects an application (with an optional reason). */
export function rejectionEmail({
  name,
  carName,
  reason,
}: {
  name: string;
  carName?: string | null;
  reason?: string | null;
}): EmailContent {
  const carText = carName ? ` for the ${carName}` : '';
  const carHtml = carName ? ` for the <strong>${esc(carName)}</strong>` : '';

  const reasonRow = reason
    ? `<tr><td style="padding:0 32px 12px;">
         <div style="background:#fafafa;border:1px solid #eeeeee;border-radius:12px;padding:14px 16px;">
           <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999999;margin-bottom:4px;">Reason</div>
           <div style="color:#444444;font-size:14px;line-height:1.6;">${esc(reason)}</div>
         </div>
       </td></tr>`
    : '';

  return {
    subject: `Update on your ${siteConfig.name} application`,
    text: `Hi ${name}, thank you for applying. Unfortunately your application${carText} was not approved at this time.${reason ? ` Reason: ${reason}.` : ''} You're welcome to reapply or contact us. Check your status at ${siteConfig.url}/services/application-status`,
    html: emailShell(`
      <tr><td style="padding:36px 32px 8px;">
        <div style="display:inline-block;background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;border-radius:999px;padding:4px 12px;font-size:11px;font-weight:800;letter-spacing:1px;">UPDATE</div>
        <h1 style="margin:14px 0 8px;font-size:22px;color:#111111;">Application update</h1>
        <p style="margin:0;color:#555555;font-size:14px;line-height:1.7;">
          Hi ${esc(name)}, thank you for applying. Unfortunately your application${carHtml} was
          <strong>not approved</strong> at this time.
        </p>
      </td></tr>
      ${reasonRow}
      <tr><td style="padding:8px 32px 0;">
        <p style="margin:0;color:#555555;font-size:14px;line-height:1.7;">
          You're welcome to reapply or speak with our team — we're happy to help find an option that works.
        </p>
      </td></tr>
      <tr><td style="padding:22px 32px 32px;">
        ${button(`${siteConfig.url}/contact`, 'Talk to us')}
      </td></tr>
    `),
  };
}
