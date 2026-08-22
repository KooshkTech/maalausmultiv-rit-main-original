import { SectionHeading } from '@/components/SectionHeading';
import { TestimonialSlider } from '@/components/TestimonialSlider';

export function Testimonials() {
  return (
    <section className="section-pad bg-white">
      <div className="container-base">
        <SectionHeading
          eyebrow="Asiakkaiden ääni"
          eyebrowOrange
          title="Mitä asiakkaamme kertovat"
          description="Tässä on valikoima palautteita eri puolilta Uuttamaata. Ota yhteyttä ja kokeile itse."
        />
        <div className="mt-14">
          <TestimonialSlider />
        </div>
      </div>
    </section>
  );
}
