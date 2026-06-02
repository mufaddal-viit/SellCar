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
| `MONGODB_URI` | ✅ for admin/DB | `mongodb+srv://…` | MongoDB Atlas connection string. If unset, the site serves the static seed data and the admin can't persist changes. |
| `MONGODB_DB` | optional | `driveeasy` | Database name override |
| `CLOUDINARY_CLOUD_NAME` | ✅ for media | `mycloud` | Cloudinary cloud name (server) |
| `CLOUDINARY_API_KEY` | ✅ for media | `1234…` | Cloudinary API key (server) |
| `CLOUDINARY_API_SECRET` | ✅ for media | `abcd…` | Cloudinary API secret — **server only, never public** |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅ for media | `mycloud` | Same cloud name, exposed to the upload widget |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY` | ✅ for media | `1234…` | Same API key, exposed to the upload widget |
| `ADMIN_USERNAME` | ✅ for admin | `admin` | Admin login username |
| `ADMIN_PASSWORD` | ✅ for admin | strong password | Admin login password |
| `AUTH_SECRET` | ✅ for admin | 32-byte hex | Signs the admin session cookie. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

For each variable, tick **Production**, **Preview**, and **Development** so it's available everywhere.

---

## Step 3.5 — Database & Cloudinary setup

The admin panel (`/admin`) is backed by **MongoDB** (data) and **Cloudinary** (photos/videos).

1. **MongoDB Atlas** — create a free cluster, a database user, and allow network access (`0.0.0.0/0` for Vercel, or Vercel's IP ranges). Copy the `mongodb+srv://…` connection string into `MONGODB_URI`.
2. **Cloudinary** — create a free account; copy the cloud name, API key, and API secret from the dashboard into the matching env vars.
3. **Seed the initial inventory** (one-time) — with `MONGODB_URI` set in your local `.env`, run:
   ```bash
   npm run db:seed
   ```
   This upserts the 8 demo cars into the DB (idempotent — safe to re-run). After seeding, manage everything from `/admin`.

> The Prisma client is generated automatically on `npm install` (`postinstall`) and during the build, so no manual `prisma generate` is needed on Vercel.

---

## Step 4 — Custom Domain

1. In Vercel → **Settings → Domains**, add your domain (e.g. `driveeasy-emi.com`).
2. Vercel shows you DNS records to add at your registrar.
3. Once verified, update `NEXT_PUBLIC_SITE_URL` to your live domain and redeploy.

---

## What's Pre-Configured

`vercel.json` already sets up:

- **Region**: `fra1` (Frankfurt) — low latency for a UAE audience.
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
7. Visit `/admin` — should redirect to `/admin/login`; sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
8. In the admin, add/edit a car and upload a photo — confirm it appears on the public `/cars` page within a few seconds (cache revalidates on save).

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

**`/admin` redirects to login even with correct credentials** — ensure `AUTH_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` are all set in Vercel env vars and redeploy. The cookie is signed with `AUTH_SECRET`, so changing it invalidates existing sessions.

**Cars don't appear after seeding** — confirm `MONGODB_URI` is set in the same environment (Production) the site runs in, and that you ran `npm run db:seed` against that database.

**Upload widget fails** — all four Cloudinary vars (incl. both `NEXT_PUBLIC_` ones) must be set. The signature endpoint also requires a valid admin session.
