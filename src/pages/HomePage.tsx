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
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function HomePage() {
  return (
    <>
      <Seo
        title="Maalausliike Uudellamaalla – talon, julkisivujen ja sisätilojen maalaus"
        description="Maalaus Multiväri on maalausliike Uudellamaalla. Talon maalaus, ulkomaalaus, julkisivumaalaus, kattomaalaus ja sisämaalaus Helsingissä, Espoossa ja Vantaalla. Pyydä ilmainen tarjous."
        path="/"
        faqSchema={faqs.slice(0, 6).map((f) => ({ q: f.q, a: f.a }))}
      />
      <Hero />
      <ServiceFinder />
      <QuickQuote />
      <Stats />
      <ServicesOverview />
      <section className="section-pad bg-navy-50/60">
        <div className="container-base">
          <div className="text-center">
            <span className="eyebrow-orange">Suositut maalauspalvelut</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-navy-900">Maalauspalvelut Helsingissä, Espoossa ja Vantaalla</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-navy-600">Tutustu tärkeimpiin palveluihimme aluekohtaisesti ja siirry suoraan oman kohteesi palvelusivulle.</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['Talon maalaus Helsinki', '/talon-maalaus-helsinki'],
              ['Talon maalaus Espoo', '/talon-maalaus-espoo'],
              ['Talon maalaus Vantaa', '/talon-maalaus-vantaa'],
              ['Sisämaalaus Helsinki', '/sisamaalaus-helsinki'],
              ['Julkisivumaalaus Helsinki', '/julkisivumaalaus-helsinki'],
              ['Kattomaalaus Helsinki', '/kattomaalaus-helsinki'],
            ].map(([label, href]) => (
              <Link key={href} to={href} className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
                <span className="font-display text-base font-bold text-navy-900">{label}</span>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600">Tutustu palveluun <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <BeforeAfterGallery />
      <Testimonials />
      <Process />
      <ServiceAreas />
      <FAQSection />
      <ContactCTA />
      <MobileStickyCTA />
    </>
  );
}
