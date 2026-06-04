import { siteConfig } from '@/content/site';

/** Escape user/admin-provided text before interpolating into email HTML. */
export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Shared branded wrapper for all emails. Each template supplies the inner
 * `<tr>…</tr>` content rows. Edit per-email content in the template files;
 * edit the overall frame here.
 */
export function emailShell(innerRows: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
      <tr><td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">
          <tr><td style="background:#0A0A0A;padding:24px 32px;">
            <span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.02em;">Buy&amp;Drive <span style="color:#E10600;">Cars</span></span>
          </td></tr>
          ${innerRows}
          <tr><td style="background:#fafafa;border-top:1px solid #eeeeee;padding:16px 32px;">
            <p style="margin:0;color:#aaaaaa;font-size:11px;">© ${new Date().getFullYear()} ${esc(siteConfig.business.name)}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export const button = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#E10600;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:999px;">${esc(label)}</a>`;
