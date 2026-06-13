/**
 * SMTP credential check.
 *
 * Sends a single test email using the exact same SMTP + nodemailer config the
 * app uses, so you can confirm the Tasjeel-hosted SMTP_* credentials actually
 * work (and see the real server error if they don't — the OTP route swallows it).
 *
 *   npx tsx scripts/test-email.ts you@example.com
 *
 * If no recipient is given, it sends to SMTP_USER (yourself).
 * Requires SMTP_HOST, SMTP_USER, SMTP_PASSWORD in .env / .env.local
 * (SMTP_PORT defaults to 587, SMTP_SECURE to false).
 */
import { loadEnvFile } from 'node:process';
import nodemailer from 'nodemailer';

for (const f of ['.env', '.env.local']) {
  try {
    loadEnvFile(f);
  } catch {
    /* optional */
  }
}

async function main() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const to = process.argv[2] || user;

  if (!host || !user || !pass) {
    console.error('❌ SMTP_HOST, SMTP_USER and/or SMTP_PASSWORD are not set.');
    process.exit(1);
  }

  console.log(`SMTP_HOST   : ${host}`);
  console.log(`SMTP_PORT   : ${port} (secure: ${secure})`);
  console.log(`SMTP_USER   : ${user}`);
  console.log(`PASSWORD    : ${pass.length} chars`);
  console.log(`Sending to  : ${to}\n`);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  console.log('→ Verifying SMTP connection / auth...');
  await transporter.verify();
  console.log('✓ Auth OK. Sending test email...');

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Email Test" <${user}>`,
    to,
    subject: 'SMTP test — Buy&Drive',
    text: 'If you can read this, the SMTP_* credentials work correctly.',
  });

  console.log(`✓ Sent. messageId: ${info.messageId}`);
  console.log(`  accepted: ${JSON.stringify(info.accepted)}`);
  console.log(`  rejected: ${JSON.stringify(info.rejected)}`);
}

main().catch((err) => {
  console.error('\n❌ FAILED — this is the real error the OTP route hides:\n');
  console.error(err);
  console.error(
    '\nIf this is a TLS/self-signed certificate error, the host may present a' +
      '\nmismatched cert. Try adding `tls: { rejectUnauthorized: false }` to the' +
      '\ntransport in src/lib/email.ts (and here) as a first diagnostic step.',
  );
  process.exit(1);
});
