import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/sections/PageHero';
import { images } from '@/config/images';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { ContactCTA } from '@/sections/ContactCTA';
import { serviceCategories, getServicesByCategory } from '@/data/services';

export function ServicesPage() {
  return (
    <>
      <Seo
        title="Palvelut — maalaus ja siivous"
        description="Maalauspalvelut ja siivouspalvelut Uudellamaalla: ulkomaalaus, sisämaalaus, julkisivumaalaus, kattomaalaus, kotisiivous, toimistosiivous, rakennussiivous, muuttosiivous ja ikkunanpesu. Pyydä ilmainen arvio."
        path="/palvelut"
        breadcrumbs={[
          { name: 'Etusivu', path: '/' },
          { name: 'Palvelut', path: '/palvelut' },
        ]}
      />
      <PageHero
        eyebrow="Palvelut"
        crumb="Palvelut"
        title="Maalaus ja siivous yhdestä paikasta"
        description="Tarjoamme kodin ja yrityksen maalaustyöt, kunnostuksen, hoidon ja siivoustyöt kokonaisvaltaisesti — tarjouspyynnöstä takuuaikaan asti."
        image={images.pages.services}
      />

      <section className="section-pad bg-white">
        <div className="container-base">
          <SectionHeading
            align="left"
            title="Valitse oikea palvelu"
            description="Klikkaa palvelua saadaksesi yksityiskohtaisen kuvauksen ja sisältyvät työvaiheet. Hinta-arvio aina ilmaisena ja sitouttamattomana."
          />

          <div className="mt-12 flex flex-col gap-12">
            {serviceCategories.map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-2xl font-bold text-navy-900 sm:text-3xl">{cat.label}</h2>
                  <span className="h-px flex-1 bg-navy-100" />
                </div>
                <div className="mt-6 flex flex-col gap-8">
                  {getServicesByCategory(cat.id).map((service, i) => (
                    <Reveal key={service.slug} delay={i * 60}>
                      <div
                        className={`card grid gap-8 overflow-hidden p-4 sm:p-6 lg:grid-cols-12 lg:items-center ${
                          i % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''
                        }`
                      }
                      >
                        <div className="lg:col-span-5">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-800">
                              Pyydä tarjous
                            </span>
                          </div>
                        </div>
                        <div className="lg:col-span-7">
                          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                            {cat.shortLabel} · Palvelu
                          </span>
                    <h3 className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-navy-600 sm:text-base">
                      {service.description}
                    </p>
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {service.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-navy-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link to={`/palvelut/${service.slug}`} className="btn-primary">
                        Lue lisää
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link to="/yhteystiedot" className="btn-outline">
                        Pyydä tarjous
                      </Link>
                    </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
