import { brands } from '@/content/testimonials';

export function BrandsMarquee() {
  const repeated = [...brands, ...brands];
  return (
    <section className="py-16 bg-brand-black border-y border-white/[0.06]">
      <div className="container-wide text-center mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
          Authorized financing partner for every major brand
        </p>
      </div>

      <div className="relative overflow-hidden mask-fade-r">
        <div className="flex w-fit gap-16 animate-marquee">
          {repeated.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="shrink-0 flex items-center justify-center min-w-[160px]"
            >
              <span className="font-display text-2xl md:text-3xl font-bold text-white/30 hover:text-white transition-colors tracking-tight">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
