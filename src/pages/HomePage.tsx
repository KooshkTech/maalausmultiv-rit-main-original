import { Seo } from '@/components/Seo';
import { Hero } from '@/sections/Hero';
import { Stats } from '@/sections/Stats';
import { ServicesOverview } from '@/sections/ServicesOverview';
import { BeforeAfterGallery } from '@/sections/BeforeAfterGallery';
import { Testimonials } from '@/sections/Testimonials';
import { Process } from '@/sections/Process';
import { ServiceAreas } from '@/sections/ServiceAreas';
import { FAQSection } from '@/sections/FAQSection';
import { ContactCTA } from '@/sections/ContactCTA';
import { faqs } from '@/data/faqs';
import { ServiceFinder } from '@/components/ServiceFinder';
import { QuickQuote } from '@/components/QuickQuote';
import { MobileStickyCTA } from '@/components/MobileStickyCTA';
import { LocalSeoLinks } from '@/sections/LocalSeoLinks';
import { LocalProjectProof } from '@/sections/LocalProjectProof';
import { PaintPlannerPromo } from '@/sections/PaintPlannerPromo';
import { StudioIntroPopup } from '@/components/StudioIntroPopup';

export function HomePage() {
  return (
    <>
      <Seo
        title="Maalaus Uusimaa – talon maalaus, ulkomaalaus ja siivous"
        description="Maalaus Multiväri tarjoaa talon maalausta, ulkomaalausta, sisämaalausta, julkisivu- ja kattomaalausta Helsingissä, Espoossa, Vantaalla ja Uudellamaalla. Pyydä maksuton arvio."
        path="/"
        faqSchema={faqs.slice(0, 6).map((f) => ({ q: f.q, a: f.a }))}
      />
      <Hero />
      <ServiceFinder />
      <QuickQuote />
      <PaintPlannerPromo />
      <Stats />
      <ServicesOverview />
      <BeforeAfterGallery />
      <LocalProjectProof />
      <Testimonials />
      <Process />
      <ServiceAreas />
      <LocalSeoLinks />
      <FAQSection />
      <ContactCTA />
      <MobileStickyCTA />
      <StudioIntroPopup />
    </>
  );
}
