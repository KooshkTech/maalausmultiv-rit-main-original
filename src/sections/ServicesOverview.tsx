import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { serviceCategories, getServicesByCategory, type Service } from '@/data/services';

type TabId = 'all' | 'painting' | 'cleaning';

const tabs: { id: TabId; label: string }[] = [
  { id: 'all', label: 'Kaikki' },
  { id: 'painting', label: 'Maalaus' },
  { id: 'cleaning', label: 'Siivous' },
];

function ServiceCard({ service }: { service: Service }) {
  return (
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
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
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
  );
}

export function ServicesOverview() {
  const [tab, setTab] = useState<TabId>('all');

  const visibleServices =
    tab === 'all'
      ? serviceCategories.flatMap((c) => getServicesByCategory(c.id))
      : getServicesByCategory(tab);

  return (
    <section className="section-pad bg-white">
      <div className="container-base">
        <SectionHeading
          eyebrow="Palvelumme"
          eyebrowOrange
          title="Maalaus ja siivous yhdestä paikasta"
          description="Tarjoamme kodin ja yrityksen maalaustyöt, kunnostuksen, hoidon ja siivoustyöt kokonaisvaltaisesti — tarjouspyynnöstä takuuaikaan asti."
        />

        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full border border-navy-100 bg-navy-50 p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                  tab === t.id
                    ? 'bg-white text-navy-900 shadow-soft'
                    : 'text-navy-500 hover:text-navy-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleServices.map((service, i) => (
            <Reveal key={service.slug} delay={i * 80}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/palvelut" className="btn-secondary">
            Katso kaikki palvelut
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
