import { PrismaClient } from '@prisma/client';
import { getDatabaseUrl } from './url';

/** True when a database is configured. Public reads fall back to seed data when false. */
export const hasDb = Boolean(process.env.MONGODB_URI);

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Instantiate only when a DB is configured; the data layer guards every use with `hasDb`.
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  (hasDb
    ? new PrismaClient({
        datasourceUrl: getDatabaseUrl(),
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    : (undefined as unknown as PrismaClient));

if (hasDb && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
