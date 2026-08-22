import { Link } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/sections/PageHero';
import { ContactCTA } from '@/sections/ContactCTA';
import { activeIndustries } from '@/data/industries';
import { images } from '@/config/images';

export function IndustriesIndexPage() {
  return (
    <>
      <Seo
        title="Toimialat — maalaus ja siivous yrityksille"
        description="Maalaus- ja siivouspalvelut toimistoille, myymälöille, ravintoloille, hotelleille, taloyhtiöille ja vapaa-ajan asunnoille Uudellamaalla. Katso toimialasi."
        path="/toimialat"
        breadcrumbs={[{ name: 'Toimialat', path: '/toimialat' }]}
      />
      <PageHero
        eyebrow="Yrityksille"
        title="Toimialat, joita palvelemme"
        description="Jokaisella toimialalla on omat vaatimuksensa aikataululle, suojaukselle ja pinnoille. Valitse toimialasi ja lue, miten toteutamme työn juuri sinun tilassasi."
        crumb="Toimialat"
        image={images.hero.main}
      />

      <section className="section-pad">
        <div className="container-base">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeIndustries.map((industry) => (
              <Link
                key={industry.slug}
                to={`/toimialat/${industry.slug}`}
                className="card group flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <Building2 className="h-6 w-6" />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-navy-900">
                  {industry.name}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">
                  {industry.intro}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600">
                  Lue lisää
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-navy-500">
            Etkö löytänyt omaa toimialaasi?{' '}
            <Link to="/yhteystiedot" className="font-semibold text-orange-600 hover:text-orange-700">
              Ota yhteyttä
            </Link>{' '}
            — kerromme mielellämme, sopiiko kohteesi palveluihimme.
          </p>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
