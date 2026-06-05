import { siteConfig } from '@/content/site';
import { emailShell } from './layout';

export interface EmailContent {
  subject: string;
  text: string;
  html: string;
}

/** OTP / email-verification code. Edit copy & styling freely. */
export function otpEmail(code: string): EmailContent {
  return {
    subject: `${code} is your ${siteConfig.name} verification code`,
    text: `Your ${siteConfig.name} verification code is ${code}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
    html: emailShell(`
      <tr><td style="padding:36px 32px 12px;">
        <h1 style="margin:0 0 8px;font-size:20px;color:#111111;">Verify your email</h1>
        <p style="margin:0;color:#555555;font-size:14px;line-height:1.6;">
          Use the code below to verify your email and continue your car finance application.
        </p>
      </td></tr>
      <tr><td align="center" style="padding:8px 32px 24px;">
        <div style="display:inline-block;background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:16px 28px;">
          <span style="font-size:34px;font-weight:800;letter-spacing:10px;color:#E10600;">${code}</span>
        </div>
      </td></tr>
      <tr><td style="padding:0 32px 32px;">
        <p style="margin:0;color:#888888;font-size:12px;line-height:1.6;">
          This code expires in 10 minutes. If you didn't request it, you can safely ignore this email.
        </p>
      </td></tr>
    `),
  };
}
