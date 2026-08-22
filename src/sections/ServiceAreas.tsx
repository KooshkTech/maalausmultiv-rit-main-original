import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { serviceAreas } from '@/data/site';
import { company } from '@/data/company';

const growthAreas = ['Porvoo', 'Lohja', 'Vihti', 'Tuusula', 'Mäntsälä', 'Riihimäki'];

export function ServiceAreas() {
  return (
    <section className="section-pad bg-white" aria-labelledby="service-areas-title">
      <div className="container-base">
        <SectionHeading
          eyebrow="Toimialue"
          eyebrowOrange
          title="Palvelemme Uudellamaalla ja laajennamme 200 km säteelle"
          description="Aloitamme vahvasta lähialueestamme ja palvelemme myös kauempana sijaitsevissa kohteissa projektin ja sijainnin mukaan. Tarkistamme aina kohteen ennen tarjousta."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-navy-100 bg-navy-50/60 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">Lähialueet</p>
            <p className="mt-1 text-sm text-navy-600">Ensisijainen Local SEO -alue</p>
          </div>
          <div className="rounded-2xl border border-navy-100 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">Kasvualueet</p>
            <p className="mt-1 text-sm text-navy-600">Seuraavat kaupungit tutkitaan ensin</p>
          </div>
          <div className="rounded-2xl border border-navy-100 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">200 km</p>
            <p className="mt-1 text-sm text-navy-600">Laajempi kaupallinen palvelualue</p>
          </div>
        </div>

        <div className="mt-10">
          <h3 id="service-areas-title" className="text-lg font-bold text-navy-900">Nykyiset palvelualueet</h3>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {serviceAreas.map((area, i) => (
              <Reveal key={area.name} delay={i * 35}>
                <Link
                  to={`/palvelualueet/${area.name.toLocaleLowerCase('fi-FI').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/[^a-z0-9]+/g, '-')}`}
                  className="card flex items-center gap-3 p-4 transition hover:border-orange-200 hover:shadow-soft"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-bold text-navy-900">{area.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-orange-100 bg-orange-50/60 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">Kasvualueet</p>
              <h3 className="mt-1 text-lg font-bold text-navy-900">Seuraavaksi tutkittavat kaupungit</h3>
              <p className="mt-1 text-sm text-navy-600">Näitä alueita ei vielä käsitellä automaattisesti SEO-kohdesivuina. Kysyntä ja toteutettavuus varmistetaan ensin.</p>
            </div>
            <Link to="/yhteystiedot" className="btn-secondary shrink-0">
              Tarkista oma alueesi
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {growthAreas.map((area) => (
              <span key={area} className="rounded-full border border-orange-200 bg-white px-3 py-1.5 text-sm font-semibold text-navy-700">
                {area}
              </span>
            ))}
          </div>
        </div>

        <Reveal className="mt-8 text-center">
          <p className="text-sm text-navy-600">
            Etkö löydä kotikuntaasi listasta?{' '}
            <a href={company.emailHref} className="font-semibold text-orange-600 hover:underline">
              Ota yhteyttä
            </a>{' '}
            — tarkistamme mielellämme kohteesi ja palvelumahdollisuuden.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
