import { SectionHeading } from '@/components/shared/section-heading';
import { ClientPhotosGallery } from './client-photos-gallery';

export function ClientPhotos() {
  return (
    <section className="section bg-brand-black-soft border-y border-white/[0.06]">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Our Community"
          title="Happy customers,"
          highlight="real smiles."
          description="A look at some of the people who drove home with Buy&Drive Cars."
          align="center"
        />
        <div className="mt-14">
          <ClientPhotosGallery />
        </div>
      </div>
    </section>
  );
}
