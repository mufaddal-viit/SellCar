import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';
import { siteConfig } from '@/content/site';
import { otpEmail, type EmailContent } from '@/emails/otp-email';
import { approvedEmail } from '@/emails/approved-email';
import { rejectionEmail } from '@/emails/rejection-email';
import { promoEmail } from '@/emails/promo-email';

export const hasEmail = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD,
);

let transporter: Transporter | null = null;
function getTransport(): Transporter {
  if (!transporter) {
    // SMTP via the Tasjeel-hosted mailbox. Port 587 with secure:false uses
    // STARTTLS (nodemailer upgrades the connection automatically); port 465
    // would use secure:true.
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

async function send(to: string, content: EmailContent): Promise<void> {
  const from =
    process.env.EMAIL_FROM || `"${siteConfig.name}" <${process.env.SMTP_USER}>`;
  await getTransport().sendMail({ from, to, ...content });
}

export async function sendOtpEmail(to: string, code: string): Promise<void> {
  await send(to, otpEmail(code));
}

export async function sendApprovedEmail(
  to: string,
  data: { name: string; carName?: string | null },
): Promise<void> {
  await send(to, approvedEmail(data));
}

export async function sendRejectedEmail(
  to: string,
  data: { name: string; carName?: string | null; reason?: string | null },
): Promise<void> {
  await send(to, rejectionEmail(data));
}

export async function sendPromoEmail(
  to: string,
  templateId: string,
  args: { name?: string | null; unsubscribeUrl?: string },
): Promise<void> {
  await send(to, promoEmail(templateId, args));
}
