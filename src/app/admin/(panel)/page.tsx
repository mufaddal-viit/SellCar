import Link from 'next/link';
import {
  Car,
  CheckCircle2,
  Clock,
  BadgeCheck,
  Wallet,
  Star,
  EyeOff,
  Inbox,
  MessageCircle,
  Phone,
  TrendingUp,
  Tag,
  Gauge,
  Layers,
  Building2,
  FileText,
  XCircle,
  Users,
} from 'lucide-react';
import { getDashboardMetrics } from '@/server/metrics';
import { hasDb } from '@/lib/db/prisma';
import { StatCard } from '@/components/admin/stat-card';
import { CollapsiblePanel } from '@/components/admin/collapsible-panel';
import { formatPrice, formatEMI } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const m = await getDashboardMetrics();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="display-heading text-3xl text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">Inventory, sales and enquiry overview.</p>
      </div>

      {!hasDb && (
        <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          No database configured. Showing seed data — set <code>MONGODB_URI</code> to enable
          live editing and persistence.
        </div>
      )}

      {/* Sales */}
      <Group title="Sales">
        <StatCard label="Sold This Month" value={m.soldThisMonth} icon={TrendingUp} />
        <StatCard label="Total Sold Value" value={formatPrice(m.soldValueTotal)} icon={Wallet} />
        <StatCard label="Avg. Days to Sell" value={m.avgDaysToSell ?? '—'} icon={Clock} />
        <StatCard
          label="CTA Clicks"
          value={m.whatsappClicks + m.callClicks}
          hint={`${m.whatsappClicks} WhatsApp · ${m.callClicks} call`}
          icon={MessageCircle}
        />
      </Group>

      {/* Applications */}
      <Group title="Applications">
        <StatCard label="Total Applications" value={m.applicationsTotal} icon={FileText} />
        <StatCard
          label="New"
          value={m.applicationsNew}
          hint="Awaiting review"
          icon={Inbox}
          accent={m.applicationsNew > 0}
        />
        <StatCard label="In Review" value={m.applicationsInReview} icon={Clock} />
        <StatCard label="Approved" value={m.applicationsApproved} icon={BadgeCheck} />
        <StatCard label="Rejected" value={m.applicationsRejected} icon={XCircle} />
      </Group>

      {/* Cars */}
      <Group title="Cars">
        <StatCard label="Total Cars" value={m.totalCars} icon={Car} />
        <StatCard label="Available" value={m.available} icon={CheckCircle2} />
        <StatCard label="Reserved" value={m.reserved} icon={Clock} />
        <StatCard label="Sold" value={m.sold} icon={BadgeCheck} />
        <StatCard label="Inventory Value" value={formatPrice(m.inventoryValue)} hint="Unsold stock" icon={Wallet} />
        <StatCard label="Avg. Price" value={formatPrice(m.avgPrice)} hint="Unsold stock" icon={Tag} />
        <StatCard label="Lowest EMI" value={m.lowestEmi ? `${formatEMI(m.lowestEmi)}/mo` : '—'} icon={Gauge} />
        <StatCard label="Featured" value={m.featured} icon={Star} />
        <StatCard label="Drafts" value={m.drafts} hint="Unpublished" icon={EyeOff} />
        <StatCard label="Brands" value={m.byBrand.length} icon={Building2} />
        <StatCard label="Categories" value={m.byCategory.length} icon={Layers} />
      </Group>

      {/* Other */}
      <Group title="Other">
        <StatCard label="Customers" value={m.customersTotal} icon={Users} />
        <StatCard
          label="New Enquiries"
          value={m.enquiriesNew}
          hint={`${m.enquiriesTotal} total`}
          icon={Inbox}
          accent={m.enquiriesNew > 0}
        />
        <StatCard label="WhatsApp Clicks" value={m.whatsappClicks} icon={MessageCircle} />
        <StatCard label="Call Clicks" value={m.callClicks} icon={Phone} />
      </Group>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CollapsiblePanel title="By Category" subtitle={`${m.byCategory.length} types`}>
          <Breakdown items={m.byCategory} />
        </CollapsiblePanel>
        <CollapsiblePanel title="By Brand" subtitle={`${m.byBrand.length} brands`}>
          <Breakdown items={m.byBrand} />
        </CollapsiblePanel>
        <CollapsiblePanel title="By Fuel" subtitle={`${m.byFuel.length} types`}>
          <Breakdown items={m.byFuel} />
        </CollapsiblePanel>

        <CollapsiblePanel
          title="Recently Added"
          subtitle={`${m.recentlyAdded.length} shown`}
        >
          {m.recentlyAdded.length === 0 ? (
            <Empty>No cars yet.</Empty>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {m.recentlyAdded.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-3">
                  <Link
                    href={`/admin/cars/${c.id}/edit`}
                    className="text-sm text-white hover:text-brand-red"
                  >
                    {c.name}
                  </Link>
                  <span className="text-xs text-white/45">{formatPrice(c.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </CollapsiblePanel>

        <CollapsiblePanel
          title="Most Enquired"
          subtitle={m.topEnquiredCars.length ? undefined : 'No data'}
        >
          {m.topEnquiredCars.length === 0 ? (
            <Empty>No enquiries tracked yet.</Empty>
          ) : (
            <ul className="divide-y divide-white/[0.06]">
              {m.topEnquiredCars.map((c) => (
                <li key={c.carName} className="flex items-center justify-between py-3">
                  <span className="text-sm text-white">{c.carName}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-white/45">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <Phone className="h-3.5 w-3.5" />
                    {c.count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CollapsiblePanel>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{children}</div>
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-sm text-white/40">{children}</p>;
}

function Breakdown({ items }: { items: { label: string; count: number }[] }) {
  if (items.length === 0) return <Empty>No data.</Empty>;
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-white/80">{i.label}</span>
            <span className="text-white/45">{i.count}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-brand-red"
              style={{ width: `${(i.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
