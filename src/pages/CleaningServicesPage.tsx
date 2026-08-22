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
  {
    icon: Sparkles,
    title: 'Hellävaraiset menetelmät',
    text: 'Käytämme materiaaliystävällisiä pesuaineita ja oikeita paineita, jotka eivät vahingoita pintaa.',
  },
  {
    icon: Shield,
    title: 'Pintojen suojaus',
    text: 'Pesun jälkeen suojamme puupinnat ja varmistamme, että lopputulos kestää sää- ja likahaittoja.',
  },
  {
    icon: Clock,
    title: 'Joustavat ajat',
    text: 'Sopimusasiakkaille kausivaraus ja joustavat toteutusajat häiritsemättä arkeanne.',
  },
];

export function CleaningServicesPage() {
  const services = getCleaningServices();

  return (
    <>
      <Seo
        title="Siivouspalvelut Uudellamaalla"
        description="Ammattimaiset siivouspalvelut Uudellamaalla: kotisiivous, toimistosiivous, rakennussiivous, muuttosiivous, ikkunanpesu, päiväkotien, koulujen ja hoivakotien siivous. Pyydä ilmainen arvio."
        path="/palvelut/siivous"
        breadcrumbs={[
          { name: 'Etusivu', path: '/' },
          { name: 'Palvelut', path: '/palvelut' },
          { name: 'Siivouspalvelut', path: '/palvelut/siivous' },
        ]}
      />
      <PageHero
        eyebrow="Siivouspalvelut"
        crumb="Siivouspalvelut"
        title="Pinnat kirkkaiksi — ammattimaisella siivouksella"
        description="Julkisivujen, ikkunoiden, pihojen ja kattojen ammattimainen puhdistus ja kunnostus Uudenmaan alueella. Hellävaraiset menetelmät ja materiaaliystävälliset pesuaineet."
        image={images.pages.cleaning}
      />

      <section className="section-pad bg-white">
        <div className="container-base">
          <SectionHeading
            eyebrow="Palvelut"
            eyebrowOrange
            title="Siivouspalvelut yksityisille ja yrityksille"
            description="Räätälöidään tarpeisiisi — tilaa yksittäinen työ tai kokonainen kunnossapitosopimus."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 80}>
                <Link
                  to={`/palvelut/${service.slug}`}
                  className="card group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      width="800"
                      height="500"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-800">
                      Pyydä tarjous
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-bold text-navy-900">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-600">
                      {service.short}
                    </p>
                    <ul className="mt-4 flex flex-col gap-2">
                      {service.bullets.slice(0, 3).map((b) => (
                        <li key={b} className="flex items-start gap-2 text-xs text-navy-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition group-hover:gap-2.5">
                      Lue lisää
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy-50">
        <div className="container-base">
          <SectionHeading
            eyebrow="Miksi valita meidät"
            eyebrowOrange
            title="Siivous ammattilaisten toteuttamana"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 100}>
                <div className="card h-full">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <b.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-navy-900">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">
                    {b.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
