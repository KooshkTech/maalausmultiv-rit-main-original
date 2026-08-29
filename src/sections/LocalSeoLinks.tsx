import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';

const cities = [
  { slug: 'helsinki', name: 'Helsinki', locative: 'Helsingissä' },
  { slug: 'espoo', name: 'Espoo', locative: 'Espoossa' },
  { slug: 'vantaa', name: 'Vantaa', locative: 'Vantaalla' },
] as const;

const paintingServices = [
  { slug: 'talon-maalaus', name: 'Talon maalaus' },
  { slug: 'julkisivumaalaus', name: 'Julkisivumaalaus' },
  { slug: 'sisamaalaus', name: 'Sisämaalaus' },
] as const;

const cleaningServices = [
  { slug: 'toimistosiivous', name: 'Toimistosiivous' },
  { slug: 'yrityssiivous', name: 'Yrityssiivous' },
  { slug: 'muuttosiivous', name: 'Muuttosiivous' },
] as const;

export function LocalSeoLinks() {
  return (
    <section className="section-pad bg-navy-50/60" aria-labelledby="local-services-title">
      <div className="container-base">
        <SectionHeading
          eyebrow="Palvelut lähelläsi"
          eyebrowOrange
          title="Maalari ja siivouspalvelu Helsingissä, Espoossa ja Vantaalla"
          description="Tutustu tärkeimpiin paikallisiin maalaus- ja siivouspalveluihin. Sivut on rakennettu todellisen palvelutarpeen ympärille, ei pelkästään kaupungin nimeä vaihtamalla."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {cities.map((city, cityIndex) => (
            <Reveal key={city.slug} delay={cityIndex * 70}>
              <div className="card h-full p-6">
                <div className="flex items-center gap-2 text-sm font-bold text-orange-600"><MapPin className="h-4 w-4" />{city.name}</div>
                <h3 id={cityIndex === 0 ? 'local-services-title' : undefined} className="mt-2 font-display text-xl font-bold text-navy-900">Maalari ja siivous {city.locative}</h3>

                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-navy-500">Maalaus</p>
                <div className="mt-2 space-y-2">
                  {paintingServices.map((service) => (
                    <Link key={`${service.slug}-${city.slug}`} to={`/palvelut/${service.slug}/${city.slug}`} className="flex items-center justify-between rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm font-semibold text-navy-700 transition hover:border-orange-200 hover:text-orange-600">
                      <span>{service.name} {city.name}</span><ArrowRight className="h-4 w-4 shrink-0" />
                    </Link>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-6 text-navy-600">Etsitkö <strong>maalaria {city.locative}</strong>? Alue- ja palvelusivut kokoavat talon maalauksen, sisämaalauksen ja julkisivumaalauksen samaan paikalliseen kokonaisuuteen.</p>

                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-navy-500">Siivous</p>
                <div className="mt-2 space-y-2">
                  {cleaningServices.map((service) => (
                    <Link key={`${service.slug}-${city.slug}`} to={`/palvelut/${service.slug}/${city.slug}`} className="flex items-center justify-between rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm font-semibold text-navy-700 transition hover:border-orange-200 hover:text-orange-600">
                      <span>{service.name} {city.name}</span><ArrowRight className="h-4 w-4 shrink-0" />
                    </Link>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-orange-600">
                  <Link to={`/palvelualueet/${city.slug}`} className="inline-flex items-center gap-1.5 hover:underline">Kaikki palvelut {city.locative}<ArrowRight className="h-4 w-4" /></Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/varikamu" className="btn-outline">Suunnittele maalaus VäriKamussa</Link><Link to="/siivouskamu" className="btn-outline">Suunnittele siivous SiivousKamussa</Link></div>
      </div>
    </section>
  );
}
