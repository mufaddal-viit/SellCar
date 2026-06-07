import { siteConfig } from '@/content/site';
import { socialLinks } from '@/content/social';

/** Escape user/admin-provided text before interpolating into email HTML. */
export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const button = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#E10600;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:13px 26px;border-radius:999px;">${esc(label)}</a>`;

const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
};

function footer(unsubscribeUrl?: string): string {
  const phone = siteConfig.contact.phone;
  const email = siteConfig.contact.email;
  const social = socialLinks
    .map(
      (s) =>
        `<a href="${s.href}" style="color:#E10600;text-decoration:none;font-weight:600;">${SOCIAL_LABELS[s.platform] ?? s.label}</a>`,
    )
    .join('&nbsp;&nbsp;·&nbsp;&nbsp;');

  return `
  <tr><td style="background:#0A0A0A;padding:28px 32px;">
    <div style="font-size:16px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">Buy&amp;Drive <span style="color:#E10600;">Cars</span></div>
    <div style="margin-top:4px;font-size:12px;color:#9a9a9a;">${esc(siteConfig.tagline)}</div>

    <div style="margin-top:16px;font-size:12px;line-height:1.8;color:#bdbdbd;">
      ${esc(siteConfig.contact.address)}<br/>
      <a href="tel:${phone}" style="color:#bdbdbd;text-decoration:none;">${esc(phone)}</a>
      &nbsp;·&nbsp;
      <a href="mailto:${email}" style="color:#bdbdbd;text-decoration:none;">${esc(email)}</a>
    </div>

    <div style="margin-top:14px;font-size:12px;">${social}</div>

    <div style="margin-top:18px;border-top:1px solid #232323;padding-top:14px;font-size:11px;color:#777777;">
      © ${new Date().getFullYear()} ${esc(siteConfig.business.name)}. All rights reserved.${
        unsubscribeUrl
          ? `<br/>You're receiving this because you enquired with us. <a href="${unsubscribeUrl}" style="color:#999999;text-decoration:underline;">Unsubscribe</a>.`
          : ''
      }
    </div>
  </td></tr>`;
}

/**
 * Premium branded email frame: header → body (innerRows) → footer with business
 * contact details. Pass `opts.unsubscribeUrl` to include an unsubscribe line
 * (promotional emails only).
 */
export function emailShell(
  innerRows: string,
  opts?: { unsubscribeUrl?: string; preheader?: string },
): string {
  const pre = opts?.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}</div>`
    : '';

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f1f1f3;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    ${pre}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f1f3;padding:32px 12px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e6e6e9;box-shadow:0 10px 40px -12px rgba(0,0,0,0.18);">
          <!-- Header -->
          <tr><td style="background:#0A0A0A;background-image:linear-gradient(120deg,#0A0A0A 60%,#2a0a0a 100%);padding:26px 32px;">
            <div style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.03em;">Buy&amp;Drive <span style="color:#E10600;">Cars</span></div>
          </td></tr>
          <!-- Body -->
          ${innerRows}
          <!-- Footer -->
          ${footer(opts?.unsubscribeUrl)}
        </table>
        <div style="margin-top:14px;font-size:11px;color:#9a9a9a;">${esc(siteConfig.contact.address)}</div>
      </td></tr>
    </table>
  </body>
</html>`;
}
