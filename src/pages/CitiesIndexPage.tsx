import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/sections/PageHero';
import { ContactCTA } from '@/sections/ContactCTA';
import { cities } from '@/data/cities';
import { images } from '@/config/images';


export function CitiesIndexPage() {
  return (
    <>
      <Seo
        title="Palvelualueet — Maalaus ja siivous Uudellamaalla"
        description="Palvelemme Helsingissä, Espoossa, Vantaalla, Kauniaisissa, Kirkkonummella, Keravalla, Järvenpäässä, Hyvinkäällä, Nurmijärvellä ja Sipoossa. Katso palvelualueesi."
        path="/palvelualueet"
        breadcrumbs={[{ name: 'Palvelualueet', path: '/palvelualueet' }]}
      />
      <PageHero
        eyebrow="Uusimaa"
        title="Palvelualueemme"
        description="Maalaus Multiväri palvelee koko Uudenmaan aluetta. Valitse kaupunkisi alta ja lue paikallisesta palvelustamme."
        crumb="Palvelualueet"
        image={images.hero.main}
      />

      <section className="section-pad">
        <div className="container-base">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <Link
                key={city.slug}
                to={`/palvelualueet/${city.slug}`}
                className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={city.image}
                    alt={`${city.name} — maalauspalvelut`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
                    <MapPin className="h-4 w-4 text-orange-400" />
                    <span className="font-display text-lg font-bold">{city.name}</span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="line-clamp-2 text-sm text-navy-600">{city.intro}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600">
                    Lue lisää
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
