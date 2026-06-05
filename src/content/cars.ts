import type { Car } from '@/types';

/**
 * Offline fallback / seed dataset.
 *
 * Live car data is served from the database via `@/server/cars`. This list is
 * only used as a fallback when no database is configured. It is intentionally
 * empty so the site never shows placeholder cars — real inventory comes from
 * the admin or `npm run import:cars`.
 */
export const cars: Car[] = [];
