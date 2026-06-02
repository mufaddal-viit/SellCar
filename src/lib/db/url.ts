/**
 * Prisma (MongoDB) requires a database name in the connection URI path.
 * Atlas connection strings copied from the dashboard often omit it
 * (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true`).
 * This injects MONGODB_DB (default "driveeasy") when no db name is present.
 */
export function getDatabaseUrl(): string | undefined {
  const uri = process.env.MONGODB_URI;
  if (!uri) return undefined;
  const dbName = process.env.MONGODB_DB || 'driveeasy';

  const [base, query = ''] = uri.split('?');
  const trimmed = base.replace(/\/+$/, '');
  const schemeIdx = trimmed.indexOf('://');
  if (schemeIdx === -1) return uri; // not a recognizable URI — leave untouched

  const afterScheme = trimmed.slice(schemeIdx + 3);
  const slashIdx = afterScheme.indexOf('/');
  const hasDbName = slashIdx !== -1 && afterScheme.slice(slashIdx + 1).length > 0;

  const newBase = hasDbName ? trimmed : `${trimmed}/${dbName}`;
  return query ? `${newBase}?${query}` : newBase;
}
