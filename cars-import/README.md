# Bulk car import

Upload car photos/videos to Cloudinary and create/update the cars in the database
in one command, driven by **`cardetails.json`**.

## 1. Add images — one folder per car

The folder name must match each car's `imagesFolder` in `cardetails.json`:

```
cars-import/
  jac/                    ← imagesFolder: "jac"
    01-front.jpg          ← order is by filename; the FIRST image is the cover
    02-side.jpg
    walkaround.mp4        ← videos (.mp4 .mov .webm .m4v) detected automatically
  Mitsubishiattrage/
    01.jpg
```

Supported images: `.jpg .jpeg .png .webp .avif .gif` · videos: `.mp4 .mov .webm .m4v`

## 2. Finalize the details — `cars-import/cardetails.json`

Shape: `{ "dealership": {...}, "cars": [ ... ] }`. Edit the values per car.

**Your original keys are mapped automatically** to the car fields:

| In `cardetails.json` | Maps to | Notes |
| --- | --- | --- |
| `priceAed` | `price` | AED |
| `monthlyAed` | `emiFrom` | "EMI from" / month |
| `imagesFolder` | image folder | folder name under `cars-import/` |
| `zeroDownpayment: true` | `downPayment: 0` | unless `downPayment` is set explicitly |

**Detail fields used directly** (added during enrichment — finalize these):

| Field | Required | Notes |
| --- | --- | --- |
| `name`, `year` | ✅ | `slug` auto-derived as `name-year` |
| `brand` | ✅ | e.g. `"Toyota"` |
| `category` | ✅ | Sedan · SUV · Hatchback · Luxury · Electric · Sports |
| `fuel` | ✅ | Petrol · Diesel · Electric · Hybrid · CNG |
| `transmission` | ✅ | Automatic · Manual |
| `engine`, `power`, `mileage` | – | Strings, e.g. `"1.5L Turbo"`, `"134 bhp"`, `"17 km/l"` |
| `seating`, `downPayment`, `tenure` | – | Numbers |
| `features` | – | Array of strings |
| `description` | – | String |
| `badge` | – | `Hot` · `New` · `Popular` · `Best Deal` · `null` |
| `featured`, `published`, `status` | – | `featured`/`published` boolean; `status` = available · reserved · sold |

> The offer flags (`freeInsurance`, `freeRegistration`, `zeroDownpayment`,
> `firstPaymentAfter2Months`, `priceType`, `monthlyApprox`) are kept in the file
> but are **not shown on the site yet** — ask to surface them as badges/highlights.

## 3. Run

```bash
npm run import:cars
```

Requires `MONGODB_URI` and the server `CLOUDINARY_*` vars in your `.env`.

## Notes
- **Idempotent.** Deterministic Cloudinary `public_id`s → re-running overwrites the
  same assets instead of duplicating. Cars are matched/updated by `slug`.
- **Folder is the source of truth.** Each run sets the car's media to exactly the
  files in its folder; files you remove are deleted from Cloudinary too.
- Image folders are git-ignored; `cardetails.json` is committed.
