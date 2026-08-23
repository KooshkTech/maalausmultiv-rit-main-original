import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MapPin, Phone } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/sections/PageHero';
import { ContactCTA } from '@/sections/ContactCTA';
import { getCity, cities } from '@/data/cities';
import { services } from '@/data/services';
import { company } from '@/data/company';
import { locationSeoMap } from '@/data/seoMap';
import { trackPhoneClick } from '@/lib/analytics';
import { localServicePath } from '@/data/localSeo';

export function CityPage() {
  const { slug } = useParams<{ slug: string }>();
  const city = getCity(slug ?? '');

  if (!city) {
    return <Navigate to="/404" replace />;
  }

  const seo = locationSeoMap[city.slug];

  const otherCities = cities
    .filter((otherCity) => otherCity.slug !== city.slug)
    .slice(0, 6);

  const pageTitle =
    seo?.title || `Maalaus- ja siivouspalvelut ${city.locative}`;

  const pageDescription =
    seo?.description ||
    `${city.intro} Pyydä ilmainen tarjous Maalaus Multiväriltä.`;

  const cityFaqs = [
    {
      q: `Palveletteko ${city.locative}?`,
      a: `Kyllä. ${city.name} on Maalaus Multivärin palvelualue. Tarjoamme maalaus- ja siivouspalveluita kotitalouksille, yrityksille ja kiinteistöille. Ota yhteyttä, niin arvioimme kohteesi ja teemme tarjouksen.`,
    },
    {
      q: `Mitä maalaus- ja siivouspalveluita tarjoatte ${city.locative}?`,
      a: 'Maalauspalveluihimme kuuluvat muun muassa ulkomaalaus, sisämaalaus, julkisivumaalaus, kattomaalaus, huoneistomaalaus ja toimistomaalaus. Siivouspalveluihimme kuuluvat toimistosiivous, yrityssiivous, rakennussiivous, muuttosiivous sekä päiväkotien, koulujen ja hoivakotien siivous.',
    },
    {
      q: `Kuinka nopeasti voitte aloittaa työn ${city.locative}?`,
      a: 'Aikataulu riippuu kohteen koosta, työn laajuudesta ja ajankohdasta. Ota yhteyttä ja kerro kohteestasi, niin arvioimme sopivan aikataulun mahdollisimman nopeasti.',
    },
    {
      q: `Voinko pyytää tarjouksen ${city.genitive} kohteeseen?`,
      a: 'Kyllä. Voit pyytää maksuttoman tarjouksen ottamalla yhteyttä puhelimitse tai yhteydenottolomakkeen kautta. Kerro kohteen sijainti, työn tyyppi ja mahdollisuuksien mukaan työn laajuus.',
    },
  ];

  return (
    <>
      <Seo
        title={pageTitle}
        description={pageDescription}
        path={`/palvelualueet/${city.slug}`}
        breadcrumbs={[
          {
            name: 'Palvelualueet',
            path: '/palvelualueet',
          },
          {
            name: city.name,
            path: `/palvelualueet/${city.slug}`,
          },
        ]}
        faqSchema={cityFaqs}
      />

      <PageHero
        eyebrow={city.region}
        title={pageTitle}
        description={pageDescription}
        crumb={city.name}
        image={city.image}
      />

      <section className="section-pad">
        <div className="container-base grid gap-12 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">
                Maalaus- ja siivouspalvelut {city.locative}
              </h2>

              <p className="mt-4 leading-relaxed text-navy-600">
                {city.description}
              </p>
            </div>

            <div className="rounded-2xl bg-navy-50 p-6">
              <h3 className="font-display text-lg font-bold text-navy-900">
                {city.genitive} erityispiirteet
              </h3>

              <p className="mt-3 leading-relaxed text-navy-600">
                {city.localFacts}
              </p>
            </div>

            <div>
              <h3 className="font-display text-lg font-bold text-navy-900">
                Palvelut {city.locative}
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {city.highlights.map((highlight, index) => (
                  <div
                    key={`${city.slug}-highlight-${index}`}
                    className="flex items-start gap-2 text-sm text-navy-700"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-navy-100 p-6">
              <h3 className="font-display text-lg font-bold text-navy-900">
                Kaikki palvelumme {city.locative}
              </h3>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    to={localServicePath(service.slug, city.slug)}
                    className="flex items-center gap-2 text-sm text-navy-600 transition hover:text-orange-600"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-orange-400" />
                    <span>
                      {service.title} {city.locative}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg font-bold text-navy-900">
                Usein kysytyt kysymykset
              </h3>

              <div className="mt-4 space-y-3">
                {cityFaqs.map((faq, index) => (
                  <details
                    key={`${city.slug}-faq-${index}`}
                    className="group rounded-xl border border-navy-100 p-4"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-navy-800">
                      <span>{faq.q}</span>

                      <span
                        aria-hidden="true"
                        className="shrink-0 text-navy-400 transition group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>

                    <p className="mt-3 text-sm leading-relaxed text-navy-600">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h3 className="font-display text-lg font-bold text-navy-900">
                Ota yhteyttä
              </h3>

              <p className="mt-2 text-sm text-navy-600">
                Pyydä ilmainen arvio {city.genitive} kohteeseesi.
              </p>

              <div className="mt-4 space-y-3">
                <a
                  href={company.phoneHref}
                  onClick={() => trackPhoneClick('city_page_sidebar')}
                  className="btn-primary w-full"
                  aria-label={`Soita Maalaus Multivärille, ${company.phone}`}
                >
                  <Phone className="h-4 w-4" />
                  Soita {company.phone}
                </a>

                <Link to="/yhteystiedot" className="btn-outline w-full">
                  Pyydä tarjous
                </Link>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-navy-500">
                <MapPin className="h-4 w-4" />
                <span>
                  Palvelemme koko {city.genitive} alueella
                </span>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-display text-sm font-bold text-navy-900">
                Muut palvelualueet
              </h3>

              <div className="mt-3 grid gap-2">
                {otherCities.map((otherCity) => (
                  <Link
                    key={otherCity.slug}
                    to={`/palvelualueet/${otherCity.slug}`}
                    className="flex items-center gap-2 text-sm text-navy-600 transition hover:text-orange-600"
                  >
                    <MapPin className="h-3.5 w-3.5 text-navy-400" />
                    <span>{otherCity.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
