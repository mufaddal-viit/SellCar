import 'server-only';
import { prisma, hasDb } from '@/lib/db/prisma';
import { getAllCars, type AdminCar } from './cars';

export interface DashboardMetrics {
  totalCars: number;
  available: number;
  reserved: number;
  sold: number;
  published: number;
  drafts: number;
  featured: number;
  inventoryValue: number;
  avgPrice: number;
  lowestEmi: number;
  byCategory: { label: string; count: number }[];
  byBrand: { label: string; count: number }[];
  byFuel: { label: string; count: number }[];
  recentlyAdded: AdminCar[];
  // sales
  soldThisMonth: number;
  soldValueTotal: number;
  avgDaysToSell: number | null;
  // enquiries
  enquiriesTotal: number;
  enquiriesNew: number;
  whatsappClicks: number;
  callClicks: number;
  topEnquiredCars: { carName: string; count: number }[];
}

function countBy(items: AdminCar[], key: 'category' | 'brand' | 'fuel') {
  const map = new Map<string, number>();
  for (const c of items) {
    const value = String(c[key]);
    map.set(value, (map.get(value) ?? 0) + 1);
  }
  return Array.from(map, ([label, count]) => ({ label, count })).sort(
    (a, b) => b.count - a.count,
  );
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const cars = await getAllCars();

  const unsold = cars.filter((c) => c.status !== 'sold');
  const inventoryValue = unsold.reduce((sum, c) => sum + (c.price || 0), 0);
  const availableEmis = cars
    .filter((c) => (c.status ?? 'available') === 'available' && c.emiFrom > 0)
    .map((c) => c.emiFrom);

  const base: DashboardMetrics = {
    totalCars: cars.length,
    available: cars.filter((c) => (c.status ?? 'available') === 'available').length,
    reserved: cars.filter((c) => c.status === 'reserved').length,
    sold: cars.filter((c) => c.status === 'sold').length,
    published: cars.filter((c) => c.published !== false).length,
    drafts: cars.filter((c) => c.published === false).length,
    featured: cars.filter((c) => c.featured).length,
    inventoryValue,
    avgPrice: unsold.length ? Math.round(inventoryValue / unsold.length) : 0,
    lowestEmi: availableEmis.length ? Math.min(...availableEmis) : 0,
    byCategory: countBy(cars, 'category'),
    byBrand: countBy(cars, 'brand'),
    byFuel: countBy(cars, 'fuel'),
    recentlyAdded: cars.slice(0, 5),
    soldThisMonth: 0,
    soldValueTotal: 0,
    avgDaysToSell: null,
    enquiriesTotal: 0,
    enquiriesNew: 0,
    whatsappClicks: 0,
    callClicks: 0,
    topEnquiredCars: [],
  };

  if (!hasDb) return base;

  // Sales metrics
  const soldCars = await prisma.car.findMany({
    where: { status: 'sold' },
    select: { price: true, soldAt: true, createdAt: true },
  });
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  base.soldValueTotal = soldCars.reduce((s, c) => s + (c.price || 0), 0);
  base.soldThisMonth = soldCars.filter(
    (c) => c.soldAt && c.soldAt >= monthStart,
  ).length;
  const durations = soldCars
    .filter((c) => c.soldAt)
    .map((c) => (c.soldAt!.getTime() - c.createdAt.getTime()) / 86_400_000)
    .filter((d) => d >= 0);
  base.avgDaysToSell = durations.length
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : null;

  // Enquiry / interaction metrics
  const [enquiriesTotal, enquiriesNew, whatsappClicks, callClicks, grouped] =
    await Promise.all([
      prisma.lead.count({ where: { type: 'enquiry' } }),
      prisma.lead.count({ where: { type: 'enquiry', status: 'new' } }),
      prisma.lead.count({ where: { type: 'whatsapp' } }),
      prisma.lead.count({ where: { type: 'call' } }),
      prisma.lead.groupBy({
        by: ['carName'],
        where: { carName: { not: null } },
        _count: { _all: true },
        orderBy: { _count: { carName: 'desc' } },
        take: 5,
      }),
    ]);
  base.enquiriesTotal = enquiriesTotal;
  base.enquiriesNew = enquiriesNew;
  base.whatsappClicks = whatsappClicks;
  base.callClicks = callClicks;
  base.topEnquiredCars = grouped
    .filter((g) => g.carName)
    .map((g) => ({ carName: g.carName as string, count: g._count._all }));

  return base;
}
