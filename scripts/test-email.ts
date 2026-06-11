/**
 * SMTP credential check.
 *
 * Sends a single test email using the exact same Gmail + nodemailer config the
 * app uses, so you can confirm EMAIL_USER + EMAIL_APP_PASSWORD actually work
 * (and see the real Gmail error if they don't — the OTP route swallows it).
 *
 *   npx tsx scripts/test-email.ts you@example.com
 *
 * If no recipient is given, it sends to EMAIL_USER (yourself).
 * Requires EMAIL_USER + EMAIL_APP_PASSWORD in .env / .env.local.
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
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;
  const to = process.argv[2] || user;

  if (!user || !pass) {
    console.error('❌ EMAIL_USER and/or EMAIL_APP_PASSWORD are not set.');
    process.exit(1);
  }

  // Surface obvious credential-shape problems before hitting Gmail.
  console.log(`EMAIL_USER     : ${user}`);
  console.log(`APP_PASSWORD   : ${pass.length} chars` + (/\s/.test(pass) ? ' ⚠️  contains whitespace — Google App Passwords have no spaces' : ''));
  console.log(`Sending to     : ${to}\n`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  console.log('→ Verifying SMTP connection / auth...');
  await transporter.verify();
  console.log('✓ Auth OK. Sending test email...');

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Email Test" <${user}>`,
    to,
    subject: 'SMTP test — Buy&Drive',
    text: 'If you can read this, EMAIL_USER + EMAIL_APP_PASSWORD work correctly.',
  });

  console.log(`✓ Sent. messageId: ${info.messageId}`);
  console.log(`  accepted: ${JSON.stringify(info.accepted)}`);
  console.log(`  rejected: ${JSON.stringify(info.rejected)}`);
}

main().catch((err) => {
  console.error('\n❌ FAILED — this is the real error the OTP route hides:\n');
  console.error(err);
  process.exit(1);
});
