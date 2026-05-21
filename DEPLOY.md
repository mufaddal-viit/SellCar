# Deploying to Vercel

This project is configured for one-click Vercel deployment. The recommended path is **Git-based deployment** (push to GitHub, Vercel auto-deploys).

---

## Prerequisites

- A [Vercel](https://vercel.com) account (free Hobby tier works).
- A GitHub / GitLab / Bitbucket repository for this project.

---

## Step 1 — Push the code

```bash
git add .
git commit -m "Production-ready build"
git push origin master
```

> Make sure `.env.local` is **not** committed (already in `.gitignore`).

---

## Step 2 — Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Click **Import Project** and select your Git repository.
3. Vercel auto-detects Next.js — leave the framework preset alone.
4. Click **Environment Variables** and add the ones below.
5. Click **Deploy**.

---

## Step 3 — Environment Variables

Add these in **Project Settings → Environment Variables** (or during the import step). All are optional except the ones marked **required for production**.

| Variable | Required? | Example | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | ✅ once domain is set | `https://driveeasy-emi.com` | Used for SEO canonicals, sitemap, OG tags |
| `NEXT_PUBLIC_PHONE` | ✅ | `+919999999999` | Click-to-call number |
| `NEXT_PUBLIC_WHATSAPP` | ✅ | `919999999999` | WhatsApp number — country code, no `+` or spaces |
| `NEXT_PUBLIC_GA_ID` | optional | `G-XXXXXXXXXX` | Google Analytics 4 — leave blank to disable |
| `NEXT_PUBLIC_GTM_ID` | optional | `GTM-XXXXXXX` | Google Tag Manager — leave blank to disable |
| `NEXT_PUBLIC_META_PIXEL_ID` | optional | `1234567890` | Meta (Facebook) Pixel — leave blank to disable |

For each variable, tick **Production**, **Preview**, and **Development** so it's available everywhere.

---

## Step 4 — Custom Domain

1. In Vercel → **Settings → Domains**, add your domain (e.g. `driveeasy-emi.com`).
2. Vercel shows you DNS records to add at your registrar.
3. Once verified, update `NEXT_PUBLIC_SITE_URL` to your live domain and redeploy.

---

## What's Pre-Configured

`vercel.json` already sets up:

- **Region**: `bom1` (Mumbai) — closest for an India-focused audience.
- **Security headers**: `X-Frame-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy`, `X-Content-Type-Options`.
- **Image caching**: 1-year immutable cache for `.jpg/.png/.webp/.avif/.svg/.ico/.woff2`.

Next.js Image Optimization, sitemap, robots, and static page generation work out of the box on Vercel — no extra config needed.

---

## Verifying the Deployment

After the first deploy completes:

1. Open the Vercel-assigned URL (`<project>.vercel.app`).
2. Check the home page hero animates.
3. Visit `/cars` — listing should render with filters.
4. Visit `/cars/bmw-3-series-2024` — detail page with EMI calculator.
5. Visit `/sitemap.xml` — should list all car routes.
6. Visit `/robots.txt` — should disallow `/admin` and `/api`.

If GA / GTM / Pixel are configured, verify in their respective real-time dashboards.

---

## Subsequent Deploys

- **Push to `master`** → production deploy.
- **Push to any other branch / PR** → preview deploy with its own URL.

No manual steps. Every push triggers a build automatically.

---

## Common Issues

**Build fails with "Module not found"** — run `npm install` locally, commit the updated `package-lock.json`, push again.

**Images don't load from Unsplash** — the demo data uses `images.unsplash.com`, already whitelisted in `next.config.mjs`. If you swap to a different host, add it to `images.remotePatterns`.

**OG tags show wrong URL** — set `NEXT_PUBLIC_SITE_URL` to your production domain in Vercel env vars, then redeploy.

**`/admin` is publicly accessible** — that's intentional for now (placeholder page). Real auth will be added in the future-functionality phase.
