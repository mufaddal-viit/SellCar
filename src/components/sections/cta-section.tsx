import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/content/site';

export function CTASection() {
  return (
    <section className="relative bg-brand-black overflow-hidden">
      <div className="container-wide py-24 md:py-32">
        <div className="relative overflow-hidden bg-brand-red">
          <div className="absolute inset-0 opacity-30">
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
              alt=""
              fill
              sizes="100vw"
              className="object-cover mix-blend-overlay"
            />
          </div>
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 80% 20%, rgba(0,0,0,0.6), transparent 60%)',
            }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 p-10 md:p-16 lg:p-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="h-px w-8 bg-white" />
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white">
                  Ready to drive?
                </span>
              </div>
              <h2 className="display-heading text-4xl md:text-5xl lg:text-6xl text-white leading-[0.95]">
                Your dream car
                <br />
                <span className="italic">is one EMI away.</span>
              </h2>
              <p className="mt-6 max-w-md text-white/90 text-lg leading-relaxed">
                Get personalized EMI offers tailored to your profile. Approval in under 24 hours, zero hidden fees.
              </p>
            </div>

            <div className="lg:justify-self-end space-y-4 w-full lg:max-w-sm">
              <Button asChild size="lg" variant="secondary" className="w-full">
                <Link href="/cars">
                  Browse 500+ Cars
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <a href={`tel:${siteConfig.contact.phone}`}>
                  <Phone className="w-4 h-4" />
                  {siteConfig.contact.phone}
                </a>
              </Button>
              <p className="text-xs text-white/80 text-center pt-2">
                No spam. No commitment. Just answers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
