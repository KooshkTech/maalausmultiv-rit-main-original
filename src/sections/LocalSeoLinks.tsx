import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';

const cities = [
  { slug: 'helsinki', name: 'Helsinki' },
  { slug: 'espoo', name: 'Espoo' },
  { slug: 'vantaa', name: 'Vantaa' },
] as const;

const services = [
  { slug: 'talon-maalaus', name: 'Talon maalaus' },
  { slug: 'ulkomaalaus', name: 'Ulkomaalaus' },
  { slug: 'sisamaalaus', name: 'Sisämaalaus' },
  { slug: 'julkisivumaalaus', name: 'Julkisivumaalaus' },
  { slug: 'kattomaalaus', name: 'Kattomaalaus' },
] as const;

export function LocalSeoLinks() {
  return (
    <section className="section-pad bg-navy-50/60" aria-labelledby="local-services-title">
      <div className="container-base">
        <SectionHeading
          eyebrow="Maalaus lähelläsi"
          eyebrowOrange
          title="Maalauspalvelut Helsingissä, Espoossa ja Vantaalla"
          description="Tutustu aluekohtaisiin maalauspalveluihin. Jokaisella sivulla kerromme työn sisällöstä, paikallisista olosuhteista ja maksuttomasta arviosta."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {cities.map((city, cityIndex) => (
            <Reveal key={city.slug} delay={cityIndex * 70}>
              <div className="card h-full p-6">
                <div className="flex items-center gap-2 text-sm font-bold text-orange-600">
                  <MapPin className="h-4 w-4" />
                  {city.name}
                </div>
                <h3 id={cityIndex === 0 ? 'local-services-title' : undefined} className="mt-2 font-display text-xl font-bold text-navy-900">
                  Maalaus {city.name}
                </h3>
                <div className="mt-5 space-y-2">
                  {services.map((service) => (
                    <Link
                      key={`${service.slug}-${city.slug}`}
                      to={`/palvelut/${service.slug}/${city.slug}`}
                      className="flex items-center justify-between rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm font-semibold text-navy-700 transition hover:border-orange-200 hover:text-orange-600"
                    >
                      <span>{service.name} {city.name}</span>
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </Link>
                  ))}
                </div>
                <Link to={`/palvelualueet/${city.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:underline">
                  Kaikki palvelut {city.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
