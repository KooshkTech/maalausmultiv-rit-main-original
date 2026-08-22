import { Link, useParams, Navigate } from 'react-router-dom';
import {
  ArrowRight, Check, Phone, ShieldCheck, ClipboardList, Sparkles,
  Paintbrush, BadgeCheck, HelpCircle,
} from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Reveal } from '@/components/Reveal';
import { ContactCTA } from '@/sections/ContactCTA';
import { SeoInternalLinks } from '@/components/SeoInternalLinks';
import { getService, getServicesByCategory, services } from '@/data/services';
import { getIndustriesForService } from '@/data/industries';
import { company } from '@/data/company';
import { images } from '@/config/images';
import { serviceSeoMap } from '@/data/seoMap';
import { cities } from '@/data/cities';

const processSteps = [
  { icon: ClipboardList, title: 'Arvio ja tarjous', desc: 'Käymme paikan päällä ja laadimme ilmaisen, sitouttamattoman tarjouksen.' },
  { icon: Sparkles, title: 'Esikäsittely', desc: 'Puhdistamme pinnat, poistamme irtoavan maalin ja korjaamme halkeamat.' },
  { icon: Paintbrush, title: 'Toteutus', desc: 'Pohjustamme ja maalaamme ammattimaisesti, siististi ja aikataulussa.' },
  { icon: BadgeCheck, title: 'Takuu ja lopetus', desc: 'Tarkistamme lopputuloksen ja annamme kirjallisen takuun jopa 5 v.' },
];

const serviceFaqs = [
  { q: 'Kuinka pian pääsette aloittamaan?', a: 'Aikataulu riippuu sesongista ja työn laajuudesta. Parhaimmillaan aloitamme muutaman päivän kuluessa tarjouksen hyväksymisestä.' },
  { q: 'Annaatteko takuun työjäljestä?', a: 'Kyllä. Annamme kirjallisen takuun maalaustyöjäljestä jopa 5 vuotta. Takuu kattaa maalipinnan kestävyyden normaaleissa sääolosuhteissa.' },
  { q: 'Maksatteko arviokäynnin?', a: 'Ei, arviokäynti on aina ilmainen ja sitouttamaton. Et sitoudu mihinkään arviokäynnin perusteella.' },
  { q: 'Voitteko työskennellä asutussa asunnossa?', a: 'Kyllä. Suojamme kalusteet ja lattiat huolellisesti ja käytämme matalahajuisia maaleja. Voimme maalata huone kerrallaan.' },
];

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getService(slug) : undefined;

  if (!service) return <Navigate to="/palvelut" replace />;

  const categoryServices = getServicesByCategory(service.category);
  const related = services
    .filter((s) => s.slug !== service.slug && s.category === service.category)
    .slice(0, 3);
  const catIndex = categoryServices.findIndex((s) => s.slug === service.slug);
  const next = categoryServices[(catIndex + 1) % categoryServices.length];
  const serviceImage = images.services[service.slug as keyof typeof images.services] || service.image;
  const seo = serviceSeoMap[service.slug];
  const priorityCities = cities.filter((city) => ['vantaa', 'helsinki', 'espoo'].includes(city.slug));
  const relevantIndustries = getIndustriesForService(service.slug);

  return (
    <>
      <Seo
        title={seo?.title || `${service.title} — ${company.name}`}
        description={seo?.description || service.short}
        path={`/palvelut/${service.slug}`}
        image={serviceImage}
        breadcrumbs={[
          { name: 'Etusivu', path: '/' },
          { name: 'Palvelut', path: '/palvelut' },
          { name: service.title, path: `/palvelut/${service.slug}` },
        ]}
        serviceSchema={{
          name: service.title,
          description: service.short,
          areaServed: 'Uusimaa',
        }}
        faqSchema={serviceFaqs}
      />

      {/* Hero */}
      <section className="bg-navy-950 pt-16 text-white lg:pt-20">
        <div className="container-base grid gap-12 py-16 lg:grid-cols-12 lg:items-center lg:py-24">
          <Reveal className="lg:col-span-6">
            <nav className="flex items-center gap-1.5 text-xs text-navy-300">
              <Link to="/" className="transition hover:text-white">Etusivu</Link>
              <span>/</span>
              <Link to="/palvelut" className="transition hover:text-white">Palvelut</Link>
              <span>/</span>
              <span className="text-orange-400">{service.title}</span>
            </nav>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-100 sm:text-lg">
              {service.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/yhteystiedot" className="btn-primary">
                Pyydä ilmainen tarjous
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={company.phoneHref} className="btn-ghost-light">
                <Phone className="h-4 w-4" />
                Soita {company.phone}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-navy-200">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-orange-400" />
                Takuu työjäljestä jopa 5 v
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-5 w-5 text-orange-400" />
                Ilmainen ja sitoutumaton arvio
              </span>
            </div>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
              <img src={serviceImage} alt={service.title} className="h-full w-full object-cover" loading="eager" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-pad bg-white">
        <div className="container-base grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <span className="eyebrow-orange">Mitä sisältyy</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
              Työvaiheet, joista vastuamme
            </h2>
            <p className="mt-4 text-navy-600">
              Jokainen {service.title.toLowerCase()}-työmme sisältää seuraavat vaiheet.
              Näin taatumme, että lopputulos kestää sään ja ajan.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {service.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 rounded-xl border border-navy-100 bg-navy-50/50 p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-navy-800 sm:text-base">{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-5">
            <div className="card sticky top-24 p-8">
              <h3 className="font-display text-xl font-bold text-navy-900">Pyydä tarjous</h3>
              <p className="mt-3 text-sm text-navy-600">
                Tarjous on ilmainen ja sitouttomaton. Käymme paikan päällä tutkimassa kohteen
                ja laadimme tarkan aikataulun ja hinta-arvion.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link to="/yhteystiedot" className="btn-primary w-full">
                  Täytä tarjouspyyntö
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href={company.phoneHref} className="btn-outline w-full">
                  <Phone className="h-4 w-4" />
                  {company.phone}
                </a>
                <Link to="/kustannuslaskuri" className="text-center text-sm font-semibold text-orange-600 transition hover:text-orange-700">
                  Tai laske arvio kustannuslaskurilla →
                </Link>
              </div>
              <p className="mt-5 text-center text-xs text-navy-500">
                Vastaamme 24 tunnin sisällä.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="section-pad bg-navy-50/60">
        <div className="container-base">
          <div className="text-center">
            <span className="eyebrow-orange">Prosessi</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-navy-900 sm:text-4xl">
              Näin teemme {service.title.toLowerCase()}-työn
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div className="card h-full p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                      <step.icon className="h-6 w-6" />
                    </span>
                    <span className="font-display text-2xl font-extrabold text-navy-200">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-navy-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad bg-white">
        <div className="container-base max-w-3xl">
          <div className="text-center">
            <span className="eyebrow-orange flex items-center justify-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Kysymyksiä ja vastauksia
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-navy-900">
              Usein kysytyt kysymykset
            </h2>
          </div>
          <div className="mt-10 space-y-3">
            {serviceFaqs.map((f, i) => (
              <details key={i} className="group rounded-xl border border-navy-100 p-5">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-navy-800">
                  {f.q}
                  <span className="text-navy-400 transition group-open:rotate-45 text-xl">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-navy-600">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/yhteystiedot" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
              Kysy lisää — ota yhteyttä →
            </Link>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="section-pad bg-navy-50/60">
        <div className="container-base">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-navy-900">Liittyvät palvelut</h2>
            <Link to="/palvelut" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
              Kaikki palvelut →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s, i) => (
              <Reveal key={s.slug} delay={i * 80}>
                <Link
                  to={`/palvelut/${s.slug}`}
                  className="card group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={images.services[s.slug as keyof typeof images.services] || s.image}
                      alt={s.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-base font-bold text-navy-900">{s.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">{s.short}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600">
                      Lue lisää
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Relevant industries */}
      {relevantIndustries.length > 0 && (
        <section className="section-pad bg-white">
          <div className="container-base">
            <div className="text-center">
              <span className="eyebrow-orange">Yrityksille</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-navy-900">
                Sopii erityisesti näille toimialoille
              </h2>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relevantIndustries.map((industry) => (
                <Link
                  key={industry.slug}
                  to={`/toimialat/${industry.slug}`}
                  className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <p className="font-display text-base font-bold text-navy-900">{industry.name}</p>
                  <p className="mt-1 text-sm text-navy-600 line-clamp-2">{industry.intro}</p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600">
                    Lue lisää <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SeoInternalLinks serviceSlug={service.slug} />

      {/* Next service */}
      <section className="border-t border-navy-100 bg-white py-12">
        <div className="container-base flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <p className="text-sm text-navy-500">Seuraava palvelu</p>
            <p className="font-display text-2xl font-bold text-navy-900">{next.title}</p>
          </div>
          <Link to={`/palvelut/${next.slug}`} className="btn-secondary">
            <ArrowRight className="h-4 w-4" />
            Jatka seuraavaan
          </Link>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
