import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, AlertTriangle, MapPin, Phone, Building2 } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/sections/PageHero';
import { ContactCTA } from '@/sections/ContactCTA';
import { getIndustry, activeIndustries } from '@/data/industries';
import { getService } from '@/data/services';
import { cities } from '@/data/cities';
import { company } from '@/data/company';
import { images } from '@/config/images';
import { trackPhoneClick } from '@/lib/analytics';

export function IndustryPage() {
  const { slug } = useParams<{ slug: string }>();
  const industry = slug ? getIndustry(slug) : undefined;

  // Only 'active-page' industries have real content and should render.
  // Anything else (covered-by-service / flagged-review / too-broad, or an
  // unknown slug) redirects to the industries hub rather than showing thin
  // or unverified content.
  if (!industry || industry.status !== 'active-page') {
    return <Navigate to="/toimialat" replace />;
  }

  const relevantServices = (industry.relevantServiceSlugs ?? [])
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const priorityCities = cities.filter((city) =>
    ['vantaa', 'helsinki', 'espoo'].includes(city.slug),
  );

  const otherIndustries = activeIndustries
    .filter((i) => i.slug !== industry.slug)
    .slice(0, 6);

  const pageTitle = `${industry.name} — maalaus ja siivous yrityksille`;
  const pageDescription =
    industry.intro ??
    `Maalaus- ja siivouspalvelut ${industry.name.toLowerCase()}-toimialalle Uudellamaalla.`;

  return (
    <>
      <Seo
        title={pageTitle}
        description={pageDescription}
        path={`/toimialat/${industry.slug}`}
        breadcrumbs={[
          { name: 'Toimialat', path: '/toimialat' },
          { name: industry.name, path: `/toimialat/${industry.slug}` },
        ]}
        serviceSchema={{
          name: `Maalaus ja siivous — ${industry.name}`,
          description: pageDescription,
          areaServed: 'Uusimaa',
        }}
        faqSchema={industry.faqs}
      />

      <PageHero
        eyebrow="Yrityksille"
        title={industry.name}
        description={industry.intro}
        crumb={industry.name}
        image={images.hero.main}
      />

      <section className="section-pad">
        <div className="container-base grid gap-12 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy-900">
                Maalaus ja siivous — {industry.name.toLowerCase()}
              </h2>
              <p className="mt-4 leading-relaxed text-navy-600">
                {industry.description}
              </p>
            </div>

            {industry.challenges && industry.challenges.length > 0 && (
              <div className="rounded-2xl bg-navy-50 p-6">
                <h3 className="font-display text-lg font-bold text-navy-900">
                  Tyypilliset haasteet
                </h3>
                <ul className="mt-4 space-y-2">
                  {industry.challenges.map((challenge) => (
                    <li key={challenge} className="flex items-start gap-2 text-sm text-navy-700">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {industry.highlights && industry.highlights.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-bold text-navy-900">
                  Miten toteutamme työn
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {industry.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-start gap-2 text-sm text-navy-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {relevantServices.length > 0 && (
              <div className="rounded-2xl border border-navy-100 p-6">
                <h3 className="font-display text-lg font-bold text-navy-900">
                  Palvelut, joita käytämme tähän toimialaan
                </h3>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {relevantServices.map((service) => (
                    <Link
                      key={service.slug}
                      to={`/palvelut/${service.slug}`}
                      className="flex items-center gap-2 text-sm text-navy-600 transition hover:text-orange-600"
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-orange-400" />
                      <span>{service.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {industry.faqs && industry.faqs.length > 0 && (
              <div>
                <h3 className="font-display text-lg font-bold text-navy-900">
                  Usein kysytyt kysymykset
                </h3>
                <div className="mt-4 space-y-3">
                  {industry.faqs.map((faq, index) => (
                    <details
                      key={`${industry.slug}-faq-${index}`}
                      className="group rounded-xl border border-navy-100 p-4"
                    >
                      <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-navy-800">
                        <span>{faq.q}</span>
                        <span aria-hidden="true" className="shrink-0 text-navy-400 transition group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-navy-600">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-display text-lg font-bold text-navy-900">
                Palvelemme koko Uudellamaalla
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {priorityCities.map((city) => (
                  <Link
                    key={city.slug}
                    to={`/palvelualueet/${city.slug}`}
                    className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <p className="font-display text-base font-bold text-navy-900">
                      {industry.name} {city.locative}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600">
                      Katso palvelualue <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h3 className="font-display text-lg font-bold text-navy-900">Pyydä tarjous</h3>
              <p className="mt-2 text-sm text-navy-600">
                Kerro kohteestasi, niin laadimme ilmaisen, sitouttamattoman tarjouksen.
              </p>
              <div className="mt-4 space-y-3">
                <a
                  href={company.phoneHref}
                  onClick={() => trackPhoneClick('industry_page_sidebar')}
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
                <span>Palvelemme koko Uudenmaan aluetta</span>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-display text-sm font-bold text-navy-900">Muut toimialat</h3>
              <div className="mt-3 grid gap-2">
                {otherIndustries.map((other) => (
                  <Link
                    key={other.slug}
                    to={`/toimialat/${other.slug}`}
                    className="flex items-center gap-2 text-sm text-navy-600 transition hover:text-orange-600"
                  >
                    <Building2 className="h-3.5 w-3.5 text-navy-400" />
                    <span>{other.name}</span>
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
