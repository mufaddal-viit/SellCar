import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import { ReviewCarousel } from '@/components/review/review-carousel';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Share Your Experience',
  description:
    'Loved buying your car with Buy&Drive? Tap a review that matches your experience and post it to Google in seconds.',
  alternates: { canonical: '/review' },
  // Keep this conversion page out of search — it's a share link for happy customers.
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-brand-black">
      {/* Animated red-glow backdrop (CSS only, GPU-friendly) */}
      <div className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(120%_120%_at_80%_0%,#2a0805_0%,#0a0a0a_55%,#070707_100%)]">
        <span className="review-orb absolute -left-[10vmax] -top-[16vmax] h-[46vmax] w-[46vmax] rounded-full bg-brand-red opacity-[0.18] blur-[80px] [animation:reviewDrift1_22s_ease-in-out_infinite]" />
        <span className="review-orb absolute -bottom-[18vmax] -right-[8vmax] h-[40vmax] w-[40vmax] rounded-full bg-brand-red-light opacity-[0.14] blur-[80px] [animation:reviewDrift2_26s_ease-in-out_infinite]" />
        <span className="review-orb absolute left-[42%] top-[38%] h-[32vmax] w-[32vmax] rounded-full bg-brand-red-dark opacity-[0.12] blur-[80px] [animation:reviewDrift3_30s_ease-in-out_infinite]" />
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-5 pb-8 pt-12 text-center sm:pt-16">
        {/* Rating pill */}
        <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-sm backdrop-blur-md">
          <span className="font-semibold text-white/60">Google</span>
          <span className="flex gap-0.5 text-brand-red">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5" fill="currentColor" />
            ))}
          </span>
          <b className="font-display font-semibold text-white">4.9</b>
          <span className="font-medium text-white/50">· trusted by 1,200+ drivers</span>
        </div>

        {/* Heading */}
        <h1 className="display-heading max-w-[16ch] text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
          Loved your new ride?{' '}
          <span className="font-display italic text-brand-red">Tell Google.</span>
        </h1>
        <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-white/60 sm:text-lg">
          Tap the note that sounds most like you — we&apos;ll copy it instantly.
          Then just paste it on Google and hit post. Takes about 15 seconds.
        </p>

        {/* Interactive carousel + submit */}
        <ReviewCarousel />
      </div>

      <p className="pb-6 text-center text-xs text-white/30">
        {siteConfig.name} · Thank you for driving with us
      </p>
    </section>
  );
}
