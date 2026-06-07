import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Car, FileText, ExternalLink } from 'lucide-react';
import { getApplicationBySlug } from '@/server/applications';
import { ApplicationReview } from '@/components/admin/application-review';
import { CopyPhone } from '@/components/admin/copy-phone';

export const dynamic = 'force-dynamic';

const DOC_LABELS: Record<string, string> = {
  emirates_id: 'Emirates ID',
  visa: 'Visa',
  passport: 'Passport',
  salary_certificate: 'Salary Certificate',
  bank_statement: 'Bank Statement',
};

const STATUS_STYLE: Record<string, string> = {
  submitted: 'border-brand-red/40 bg-brand-red/15 text-brand-red',
  in_review: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  approved: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  rejected: 'border-white/15 bg-white/5 text-white/60',
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const app = await getApplicationBySlug(slug);
  if (!app) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/applications"
        className="mb-4 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to applications
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="display-heading text-3xl text-white">{app.name}</h1>
          <p className="mt-1 text-sm text-white/50">
            Submitted {new Date(app.createdAt).toLocaleString()}
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${STATUS_STYLE[app.status] ?? 'border-white/15 text-white/60'}`}
        >
          {app.status.replace('_', ' ')}
        </span>
      </div>

      <div className="mb-6">
        <ApplicationReview id={app.id} status={app.status} reviewNote={app.reviewNote} />
      </div>

      {/* Linked car */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-brand-black-soft p-5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-red/10 text-brand-red">
          <Car className="h-5 w-5" />
        </span>
        <div>
          <div className="text-[11px] uppercase tracking-widest text-white/40">Interested car</div>
          {app.carId ? (
            <Link
              href={`/admin/cars/${app.carId}/edit`}
              className="font-display text-lg font-bold text-white hover:text-brand-red"
            >
              {app.carName}
            </Link>
          ) : (
            <div className="font-display text-lg font-bold text-white">{app.carName || '—'}</div>
          )}
        </div>
      </div>

      {/* Documents */}
      <Panel title="Documents">
        {app.documentUrls && app.documentUrls.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {app.documentUrls.map((d) => (
              <a
                key={d.kind}
                href={d.url}
                target="_blank"
                rel="noopener"
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/80 transition-colors hover:border-brand-red/40 hover:text-white"
              >
                <span className="inline-flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-red" />
                  {DOC_LABELS[d.kind] ?? d.kind}
                </span>
                <ExternalLink className="h-4 w-4 text-white/40" />
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/40">No documents uploaded.</p>
        )}
        <p className="mt-3 text-xs text-white/35">
          Document links are private and expire — open them while signed in.
        </p>
      </Panel>

      {/* Details */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Contact">
          <Rows
            rows={[
              ['Mobile', <CopyPhone key="m" phone={app.mobile} />],
              ['Email', app.email],
              [
                'Home-country mobile',
                app.homeMobile ? <CopyPhone key="hm" phone={app.homeMobile} /> : null,
              ],
              ["Mother's name", app.mother],
            ]}
          />
        </Panel>
        <Panel title="Address">
          <Rows
            rows={[
              ['Flat / Villa', app.flat],
              ['Building', app.building],
              ['Street', app.street],
              ['Area', app.area],
              ['City', app.city],
              ['Home-country address', app.homeAddress],
            ]}
          />
        </Panel>
        <Panel title="Employment & Banking">
          <Rows
            rows={[
              ['Office address', app.officeAddress],
              ['Office landline', app.officeLandline],
              ['Salary date', app.salaryDate],
              ['Bank', app.bankName],
              ['IBAN', app.iban],
            ]}
          />
        </Panel>
        <Panel title="Obligations & References">
          <Rows
            rows={[
              ['Existing loan installment', app.loanInstallment],
              ['Has credit cards', app.hasCards],
              ['Total card limit', app.cardLimit],
              ['Cash-now loan', app.cashLoan],
              ['Reference 1', join(app.ref1Name, app.ref1Mobile)],
              ['Reference 2', join(app.ref2Name, app.ref2Mobile)],
            ]}
          />
        </Panel>
      </div>
    </div>
  );
}

function join(a: string | null, b: string | null) {
  return [a, b].filter(Boolean).join(' · ') || null;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-brand-black-soft p-6">
      <h2 className="mb-4 font-display text-lg font-bold text-white">{title}</h2>
      {children}
    </div>
  );
}

function Rows({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="divide-y divide-white/[0.06]">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4 py-2.5 text-sm">
          <dt className="text-white/45">{label}</dt>
          <dd className="text-right text-white/85">{value || '—'}</dd>
        </div>
      ))}
    </dl>
  );
}
