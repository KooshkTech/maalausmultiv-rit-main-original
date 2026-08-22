import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Check, Phone, ShieldCheck } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Reveal } from '@/components/Reveal';
import { company } from '@/data/company';
import { cities, getCity } from '@/data/cities';
import { getService } from '@/data/services';
import { getServiceLocationTarget } from '@/data/serviceLocationSeo';
import { images } from '@/config/images';
import { SeoInternalLinks } from '@/components/SeoInternalLinks';

const priorityCities = ['helsinki', 'espoo', 'vantaa'];

export function ServiceLocationPage() {
  const { slug } = useParams<{ slug: string }>();
  const target = slug ? getServiceLocationTarget(slug) : undefined;
  if (!target) return <Navigate to="/palvelut" replace />;

  const service = getService(target.serviceSlug);
  const city = getCity(target.citySlug);
  if (!service || !city) return <Navigate to="/palvelut" replace />;

  const serviceImage = images.services[service.slug as keyof typeof images.services] || service.image;
  const otherCities = cities.filter((item) =>
    priorityCities.includes(item.slug) && item.slug !== city.slug
  );

  const faqs = [
    {
      q: `Paljonko ${service.title.toLowerCase()} ${city.locative} maksaa?`,
      a: `Hinta riippuu kohteen koosta, pintojen kunnosta, esikäsittelystä ja työn laajuudesta. Teemme kohdekohtaisen arvion ja ilmaisen tarjouksen ennen työn aloittamista.`,
    },
    {
      q: `Kuinka nopeasti ${service.title.toLowerCase()} voidaan aloittaa ${city.locative}?`,
      a: `Aikataulu sovitaan kohteen laajuuden ja sesongin mukaan. Ota yhteyttä, niin arvioimme sopivan aloitusajan ja käymme tarvittaessa kohteessa paikan päällä.`,
    },
    {
      q: `Mitä ${service.title.toLowerCase()} sisältää?`,
      a: service.description,
    },
  ];

  return (
    <>
      <Seo
        title={target.title}
        description={target.description}
        path={`/${target.slug}`}
        image={serviceImage}
        breadcrumbs={[
          { name: 'Etusivu', path: '/' },
          { name: 'Palvelut', path: '/palvelut' },
          { name: service.title, path: `/palvelut/${service.slug}` },
          { name: `${service.title} ${city.name}`, path: `/${target.slug}` },
        ]}
        serviceSchema={{
          name: `${service.title} ${city.name}`,
          description: target.description,
          areaServed: city.name,
        }}
        faqSchema={faqs}
      />

      <section className="bg-navy-950 pt-16 text-white lg:pt-20">
        <div className="container-base grid gap-12 py-16 lg:grid-cols-12 lg:items-center lg:py-24">
          <Reveal className="lg:col-span-6">
            <nav className="flex flex-wrap items-center gap-1.5 text-xs text-navy-300">
              <Link to="/" className="hover:text-white">Etusivu</Link>
              <span>/</span>
              <Link to="/palvelut" className="hover:text-white">Palvelut</Link>
              <span>/</span>
              <Link to={`/palvelut/${service.slug}`} className="hover:text-white">{service.title}</Link>
              <span>/</span>
              <span className="text-orange-400">{city.name}</span>
            </nav>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {service.title} {city.name}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg">
              {target.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/yhteystiedot" className="btn-primary">
                Pyydä ilmainen tarjous <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={company.phoneHref} className="btn-ghost-light">
                <Phone className="h-4 w-4" /> Soita {company.phone}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-navy-200">
              <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-orange-400" />Takuu työjäljestä jopa 5 v</span>
              <span className="flex items-center gap-2"><Check className="h-5 w-5 text-orange-400" />Ilmainen ja sitoutumaton arvio</span>
            </div>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
              <img src={serviceImage} alt={`${service.title} ${city.name}`} className="h-full w-full object-cover" loading="eager" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-base grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <span className="eyebrow-orange">{city.name} · Uusimaa</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
              {service.title} {city.locative}
            </h2>
            <p className="mt-5 text-navy-600 leading-relaxed">{target.intro}</p>
            <p className="mt-4 text-navy-600 leading-relaxed">{city.localFacts}</p>

            <h3 className="mt-8 font-display text-2xl font-bold text-navy-900">Mitä palveluun kuuluu?</h3>
            <ul className="mt-5 grid gap-3">
              {service.bullets.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-navy-100 bg-navy-50/50 p-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white"><Check className="h-4 w-4" /></span>
                  <span className="text-sm font-medium text-navy-800 sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="card sticky top-24 p-8">
              <h3 className="font-display text-xl font-bold text-navy-900">Pyydä ilmainen arvio</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy-600">
                Kerro meille kohteesta {city.locative}. Arvioimme työn laajuuden ja laadimme selkeän tarjouksen.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link to="/yhteystiedot" className="btn-primary w-full">Pyydä tarjous <ArrowRight className="h-4 w-4" /></Link>
                <a href={company.phoneHref} className="btn-outline w-full"><Phone className="h-4 w-4" />{company.phone}</a>
                <Link to="/kustannuslaskuri" className="text-center text-sm font-semibold text-orange-600 hover:text-orange-700">Laske alustava kustannus →</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-navy-50/60">
        <div className="container-base">
          <div className="text-center">
            <span className="eyebrow-orange">Paikallinen palvelu</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-navy-900">Miksi valita Maalaus Multiväri?</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Paikallinen palvelu', `Palvelemme ${city.locative} ja tunnemme Uudenmaan kohteet.`],
              ['Huolellinen esikäsittely', 'Pintojen valmistelu on osa kestävää lopputulosta.'],
              ['Selkeä tarjous', 'Saat kohdekohtaisen arvion ennen työn aloittamista.'],
              ['Takuu', 'Kirjallinen takuu työjäljestä sovitun mukaisesti.'],
            ].map(([title, text]) => (
              <div key={title} className="card p-6">
                <h3 className="font-display font-bold text-navy-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-base max-w-3xl">
          <div className="text-center">
            <span className="eyebrow-orange">FAQ</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-navy-900">Usein kysytyt kysymykset</h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="rounded-xl border border-navy-100 p-5">
                <summary className="cursor-pointer text-sm font-semibold text-navy-800">{faq.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-navy-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <SeoInternalLinks serviceSlug={service.slug} citySlug={city.slug} />

      <section className="section-pad bg-navy-950 text-white">
        <div className="container-base">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="eyebrow-orange">Muut alueet</span>
              <h2 className="mt-4 font-display text-3xl font-bold">{service.title} myös lähialueilla</h2>
            </div>
            <Link to={`/palvelut/${service.slug}`} className="btn-outline border-white/20 text-white hover:bg-white/10">Katso yleinen palvelusivu →</Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {otherCities.map((otherCity) => {
              const otherTarget = getServiceLocationTarget(`${service.slug}-${otherCity.slug}`);
              if (!otherTarget) return null;
              return (
                <Link key={otherCity.slug} to={`/${otherTarget.slug}`} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
                  <span className="font-display text-lg font-bold">{service.title} {otherCity.name}</span>
                  <span className="mt-2 block text-sm text-navy-200">Katso paikallinen palvelusivu →</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
