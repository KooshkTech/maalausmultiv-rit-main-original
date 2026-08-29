import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles, Shield, Clock } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/sections/PageHero';
import { images } from '@/config/images';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { ContactCTA } from '@/sections/ContactCTA';
import { getCleaningServices } from '@/data/services';

const benefits = [
  { icon: Sparkles, title: 'Selkeä palvelusisältö', text: 'Sovimme etukäteen mitä siivotaan, kuinka usein ja mihin tiloihin palvelu kohdistuu.' },
  { icon: Shield, title: 'Kohteen mukaan', text: 'Palvelu mitoitetaan tilan, materiaalien, käyttöasteen ja todellisen siivoustarpeen perusteella.' },
  { icon: Clock, title: 'Joustavat ajat', text: 'Ajankohta sovitaan asiakkaan ja kohteen tarpeen mukaan, myös yritystilojen käyttö huomioiden.' },
];

const localCleaning = [
  { city: 'Helsinki', slug: 'helsinki' },
  { city: 'Espoo', slug: 'espoo' },
  { city: 'Vantaa', slug: 'vantaa' },
] as const;

export function CleaningServicesPage() {
  const services = getCleaningServices();

  return (
    <>
      <Seo
        title="Siivouspalvelut Uusimaa – koti-, toimisto- ja yrityssiivous"
        description="Siivouspalvelut Helsingissä, Espoossa, Vantaalla ja Uudellamaalla. Toimistosiivous, yrityssiivous, muuttosiivous ja muut tarjolla olevat siivouspalvelut. Pyydä tarjous."
        path="/palvelut/siivous"
        breadcrumbs={[{ name: 'Etusivu', path: '/' }, { name: 'Palvelut', path: '/palvelut' }, { name: 'Siivouspalvelut', path: '/palvelut/siivous' }]}
      />
      <PageHero
        eyebrow="Siivouspalvelut Uudellamaalla"
        crumb="Siivouspalvelut"
        title="Siivouspalvelut koteihin, toimistoihin ja yrityksille"
        description="Tarjoamme kohteen mukaan toimistosiivousta, yrityssiivousta, muuttosiivousta ja muita siivouspalveluja Helsingissä, Espoossa, Vantaalla ja muualla Uudellamaalla."
        image={images.pages.cleaning}
      />

      <section className="relative z-20 -mt-9 px-5">
        <div className="container-base"><div className="card grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8"><div><span className="eyebrow-orange">SiivousKamu</span><h2 className="mt-3 font-display text-2xl font-bold text-navy-950">Suunnittele siivoustarve ennen tarjouspyyntöä</h2><p className="mt-2 max-w-2xl leading-relaxed text-navy-600">Valitse tila, tehtävät, arvioitu pinta-ala ja siivouksen toistuvuus. Halutessasi lisää kuva ja merkitse erityiskohdat.</p></div><Link to="/siivouskamu" className="btn-primary">Avaa SiivousKamu <ArrowRight className="size-4" /></Link></div></div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-base">
          <SectionHeading eyebrow="Palvelut" eyebrowOrange title="Siivouspalvelut yksityisille ja yrityksille" description="Valitse palvelu todellisen tarpeen mukaan. Hinta vahvistetaan kohdekohtaisessa tarjouksessa, eikä sivusto keksi yhtä hintaa kaikille tiloille." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 60}>
                <Link to={`/palvelut/${service.slug}`} className="card group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative aspect-[16/10] overflow-hidden"><img src={service.image} alt={service.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" width="800" height="500" /><span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-800">Pyydä tarjous</span></div>
                  <div className="flex flex-1 flex-col p-6"><h3 className="font-display text-xl font-bold text-navy-900">{service.title}</h3><p className="mt-2 text-sm leading-relaxed text-navy-600">{service.short}</p><ul className="mt-4 flex flex-col gap-2">{service.bullets.slice(0, 3).map((b) => <li key={b} className="flex items-start gap-2 text-xs text-navy-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />{b}</li>)}</ul><span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition group-hover:gap-2.5">Lue lisää<ArrowRight className="h-4 w-4" /></span></div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy-50">
        <div className="container-base">
          <SectionHeading eyebrow="Paikallinen siivous" eyebrowOrange title="Toimisto- ja yrityssiivous Helsingissä, Espoossa ja Vantaalla" description="Hakudatan perusteella vahvistamme erityisesti toimistosiivouksen ja yrityssiivouksen paikallista palvelusisältöä ilman ohuita kopiosivuja." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">{localCleaning.map((city) => <div key={city.slug} className="card p-6"><h3 className="font-display text-xl font-bold text-navy-950">Siivous {city.city}</h3><div className="mt-4 space-y-2"><Link to={`/palvelut/toimistosiivous/${city.slug}`} className="flex items-center justify-between rounded-xl bg-navy-50 px-4 py-3 text-sm font-semibold text-navy-700 hover:text-orange-600">Toimistosiivous {city.city}<ArrowRight className="size-4" /></Link><Link to={`/palvelut/yrityssiivous/${city.slug}`} className="flex items-center justify-between rounded-xl bg-navy-50 px-4 py-3 text-sm font-semibold text-navy-700 hover:text-orange-600">Yrityssiivous {city.city}<ArrowRight className="size-4" /></Link><Link to={`/palvelut/muuttosiivous/${city.slug}`} className="flex items-center justify-between rounded-xl bg-navy-50 px-4 py-3 text-sm font-semibold text-navy-700 hover:text-orange-600">Muuttosiivous {city.city}<ArrowRight className="size-4" /></Link></div></div>)}</div>
        </div>
      </section>

      <section className="section-pad bg-white"><div className="container-base"><SectionHeading eyebrow="Miksi valita meidät" eyebrowOrange title="Siivous ammattilaisten toteuttamana" /><div className="mt-12 grid gap-6 md:grid-cols-3">{benefits.map((b, i) => <Reveal key={b.title} delay={i * 100}><div className="card h-full"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><b.icon className="h-6 w-6" /></span><h3 className="mt-5 font-display text-lg font-bold text-navy-900">{b.title}</h3><p className="mt-2 text-sm leading-relaxed text-navy-600">{b.text}</p></div></Reveal>)}</div></div></section>

      <ContactCTA />
    </>
  );
}
