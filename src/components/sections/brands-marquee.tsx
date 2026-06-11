import { brands } from '@/content/testimonials';

export function BrandsMarquee() {
  const repeated = [...brands, ...brands];
  return (
    <section className="py-12 md:py-16 bg-brand-black border-y border-white/[0.06]">
      <div className="container-wide text-center mb-8 md:mb-10">
        <p className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
          Cars with all UAE brands available
        </p>
      </div>

      <div className="relative overflow-hidden mask-fade-r">
        <div className="flex w-fit gap-7 sm:gap-10 animate-marquee">
          {repeated.map((brand, i) => (
            <div 
              key={`${brand.name}-${i}`}
              className="shrink-0 flex items-center justify-center"
            >
              <span className="font-display text-lg sm:text-xl md:text-2xl font-bold text-white/30 hover:text-white transition-colors tracking-tight whitespace-nowrap">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
