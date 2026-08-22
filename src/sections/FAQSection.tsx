import { Link } from 'react-router-dom';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { FAQAccordion } from '@/components/FAQAccordion';
import { faqs } from '@/data/faqs';

export function FAQSection() {
  return (
    <section className="section-pad bg-navy-50/60">
      <div className="container-base">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <SectionHeading
              align="left"
              eyebrow="Usein kysyttyä"
              eyebrowOrange
              title="Vastaukset yleisimpiin kysymyksiin"
              description="Kokoamme tähän ne kysymykset, jotka asiakkaat kysyvät meiltä useimmiten. Jos et löydä vastausta, ota yhteyttä — autamme mielellämme."
            />
            <Reveal delay={200}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/yhteystiedot" className="btn-primary">
                  Kysy asiantuntijalta
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/blogi" className="btn-outline">
                  <HelpCircle className="h-4 w-4" />
                  Lue blogistamme
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={150} className="lg:col-span-7">
            <FAQAccordion faqs={faqs.slice(0, 6)} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
