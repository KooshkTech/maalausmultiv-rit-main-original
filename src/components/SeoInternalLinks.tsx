import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { cities } from '@/data/cities';
import { getServiceLocationTarget } from '@/data/serviceLocationSeo';
import { getService } from '@/data/services';

type Props = {
  serviceSlug: string;
  citySlug?: string;
  title?: string;
};

const priorityCities = ['helsinki', 'espoo', 'vantaa'];

export function SeoInternalLinks({ serviceSlug, citySlug, title }: Props) {
  const service = getService(serviceSlug);
  if (!service) return null;

  const linkedCities = cities.filter((city) => priorityCities.includes(city.slug));

  return (
    <section className="section-pad bg-white">
      <div className="container-base">
        <div className="text-center">
          <span className="eyebrow-orange">Palvelualueet</span>
          <h2 className="mt-4 font-display text-3xl font-bold text-navy-900">
            {title || `${service.title} Helsingissä, Espoossa ja Vantaalla`}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-navy-600">
            Tutustu palveluun omalla alueellasi ja pyydä kohdekohtainen, maksuton tarjous.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {linkedCities.map((city) => {
            const target = getServiceLocationTarget(`${service.slug}-${city.slug}`);
            if (!target || city.slug === citySlug) return null;
            return (
              <Link
                key={target.slug}
                to={`/${target.slug}`}
                className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-lg font-bold text-navy-900">
                      {service.title} {city.name}
                    </p>
                    <p className="mt-2 text-sm text-navy-600">
                      Paikallinen palvelusivu ja tarjouspyyntö.
                    </p>
                  </div>
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-orange-500" />
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600">
                  Katso palvelu → <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold">
          <Link to={`/palvelut/${service.slug}`} className="text-navy-700 hover:text-orange-600">
            {service.title} yleisesti →
          </Link>
          <Link to="/palvelualueet" className="text-navy-700 hover:text-orange-600">
            Kaikki palvelualueet →
          </Link>
          <Link to="/projektit" className="text-navy-700 hover:text-orange-600">
            Katso projektit →
          </Link>
          <Link to="/kustannuslaskuri" className="text-orange-600 hover:text-orange-700">
            Laske kustannusarvio →
          </Link>
        </div>
      </div>
    </section>
  );
}
