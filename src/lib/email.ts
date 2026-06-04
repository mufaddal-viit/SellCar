import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';
import { siteConfig } from '@/content/site';
import { otpEmail, type EmailContent } from '@/emails/otp-email';
import { approvedEmail } from '@/emails/approved-email';
import { rejectionEmail } from '@/emails/rejection-email';

export const hasEmail = Boolean(
  process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD,
);

let transporter: Transporter | null = null;
function getTransport(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

async function send(to: string, content: EmailContent): Promise<void> {
  const from =
    process.env.EMAIL_FROM || `"${siteConfig.name}" <${process.env.EMAIL_USER}>`;
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
