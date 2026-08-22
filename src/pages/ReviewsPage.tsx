import { Quote, MapPin, PenLine } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/sections/PageHero';
import { images } from '@/config/images';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { ContactCTA } from '@/sections/ContactCTA';
import { testimonials } from '@/data/testimonials';
import { company } from '@/data/company';

export function ReviewsPage() {
  return (
    <>
      <Seo
        title="Asiakkaiden kokemuksia"
        description="Lue asiakkaidemme kokemuksia maalaus- ja siivouspalveluistamme Uudellamaalla. Oletko asiakkaamme? Jätä meille palautetta."
        path="/arvostelut"
        breadcrumbs={[
          { name: 'Etusivu', path: '/' },
          { name: 'Arvostelut', path: '/arvostelut' },
        ]}
      />
      <PageHero
        eyebrow="Asiakkaiden ääni"
        crumb="Arvostelut"
        title="Mitä asiakkaamme kertovat"
        description="Kokoamme tähän palautteita eri puolilta Uuttamaata. Olemme kiitollisia jokaisesta luottamuksesta."
        image={images.pages.reviews}
      />

      <section className="section-pad bg-white">
        <div className="container-base">
          <SectionHeading
            eyebrow="Kokemuksia"
            eyebrowOrange
            title="Palautetta maalauksesta ja siivouksesta"
            description="Tässä on valikoima palautteita asiakkailtamme eri puolilta Uuttamaata."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 80}>
                <article className="card flex h-full flex-col p-6">
                  <Quote className="h-8 w-8 text-orange-200" />
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-navy-700">
                    {t.text}
                  </p>
                  <div className="mt-6 border-t border-navy-100 pt-4">
                    <div className="flex items-center gap-2 text-xs text-navy-500">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <span className="font-semibold text-navy-700">{t.service}</span>
                      <span>· {t.location}</span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-14 text-center">
            <div className="card mx-auto inline-flex flex-col items-center gap-3 px-8 py-6">
              <PenLine className="h-8 w-8 text-orange-500" />
              <h3 className="font-display text-lg font-bold text-navy-900">
                Oletko asiakkaamme? Jätä palautetta!
              </h3>
              <p className="max-w-md text-sm text-navy-600">
                Kuulemme mielellämme kokemustasi. Lähetä palautetta sähköpostitse,
                niin julkaisemme sen sivuillamme.
              </p>
              <a href={company.emailHref} className="btn-primary mt-2">
                Lähetä palautetta
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
