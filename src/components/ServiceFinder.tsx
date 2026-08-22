import { useMemo, useState } from 'react';
import { ArrowRight, Brush, Search, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCleaningServices, getPaintingServices } from '@/data/services';

type Service = ReturnType<typeof getPaintingServices>[number] & { group: 'Maalaus' | 'Siivous' };

const quickTerms = [
  { label: 'Seinien maalaus', query: 'seinä' },
  { label: 'Kotisiivous', query: 'koti' },
  { label: 'Muuttosiivous', query: 'muutto' },
  { label: 'Remonttisiivous', query: 'remontti' },
  { label: 'Ulkomaalaus', query: 'ulkomaalaus' },
];

const searchAliases: Record<string, string[]> = {
  'seinä': ['seinien maalaus', 'sisämaalaus'],
  'seinän maalaus': ['sisämaalaus'],
  'maalaus': ['maalaus', 'maalausliike', 'maalaustyöt'],
  'maalari': ['maalaus', 'maalausliike'],
  'talo': ['ulkomaalaus', 'julkisivumaalaus'],
  'julkisivu': ['julkisivumaalaus', 'julkisivun pesu'],
  'katto': ['kattomaalaus', 'kattosiivous'],
  'koti': ['kotisiivous', 'huoneistomaalaus', 'sisämaalaus'],
  'siivous': ['siivous', 'siivouspalvelu', 'kotisiivous'],
  'muutto': ['muuttosiivous', 'huoneistomaalaus'],
  'loppusiivous': ['muuttosiivous'],
  'remontti': ['remonttisiivous', 'huoneistomaalaus', 'sisämaalaus'],
  'toimisto': ['toimistosiivous', 'toimistomaalaus'],
  'yritys': ['yrityssiivous', 'toimistosiivous', 'toimistomaalaus'],
  'ikkuna': ['ikkunan-pesu', 'ikkunanpesu'],
};

export function ServiceFinder() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<'all' | 'Maalaus' | 'Siivous'>('all');

  const services = useMemo<Service[]>(
    () => [
      ...getPaintingServices().map((service) => ({ ...service, group: 'Maalaus' as const })),
      ...getCleaningServices().map((service) => ({ ...service, group: 'Siivous' as const })),
    ],
    [],
  );

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('fi-FI');
    return services
      .filter((service) => group === 'all' || service.group === group)
      .filter((service) => {
        if (!normalized) return true;
        const searchable = `${service.title} ${service.description} ${service.slug}`
          .toLocaleLowerCase('fi-FI');
        if (searchable.includes(normalized)) return true;
        return (searchAliases[normalized] ?? []).some((alias) => searchable.includes(alias));
      })
      .slice(0, 6);
  }, [group, query, services]);

  const hasQuery = query.trim().length > 0;

  return (
    <section aria-labelledby="service-finder-title" className="relative z-20 -mt-10 px-4 sm:-mt-14">
      <div className="container-base">
        <div className="rounded-3xl border border-navy-100 bg-white p-5 shadow-lift sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="eyebrow-orange">Palveluhaku</span>
              <h2 id="service-finder-title" className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
                Mitä tarvitset?
              </h2>
              <p className="mt-1 text-sm text-navy-600">Etsi palvelu tai valitse suoraan. Pääset perille muutamalla klikkauksella.</p>
            </div>

            <Link to="/yhteystiedot" className="btn-primary shrink-0">
              Pyydä tarjous
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Etsi palvelua</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Esim. seinän maalaus, kotisiivous..."
                className="h-12 w-full rounded-xl border border-navy-200 bg-navy-50/40 pl-12 pr-11 text-sm text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-navy-400 hover:bg-navy-100 hover:text-navy-700" aria-label="Tyhjennä haku">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>

            <div className="flex rounded-xl bg-navy-50 p-1" role="tablist" aria-label="Palveluryhmä">
              {(['all', 'Maalaus', 'Siivous'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={group === item}
                  onClick={() => setGroup(item)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${group === item ? 'bg-white text-navy-900 shadow-soft' : 'text-navy-500 hover:text-navy-800'}`}
                >
                  {item === 'all' ? 'Kaikki' : item}
                </button>
              ))}
            </div>
          </div>

          {!hasQuery && (
            <div className="mt-4 flex flex-wrap gap-2">
              {quickTerms.map((term) => (
                <button key={term.label} type="button" onClick={() => setQuery(term.query)} className="rounded-full border border-navy-150 bg-white px-3.5 py-2 text-xs font-semibold text-navy-700 transition hover:border-orange-300 hover:text-orange-700">
                  {term.label}
                </button>
              ))}
            </div>
          )}

          {(hasQuery || group !== 'all') && (
            <div className="mt-5 border-t border-navy-100 pt-4">
              {results.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((service) => (
                    <Link key={service.slug} to={`/palvelut/${service.slug}`} className="group flex items-center gap-3 rounded-xl border border-navy-100 p-3 transition hover:border-orange-300 hover:bg-orange-50/40">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                        {service.group === 'Maalaus' ? <Brush className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-navy-900">{service.title}</span>
                        <span className="text-xs text-navy-500">{service.group}</span>
                      </span>
                      <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-orange-500" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-navy-50 p-4 text-sm text-navy-600">
                  Palvelua ei löytynyt. <Link to="/yhteystiedot" className="font-bold text-orange-600 hover:underline">Kysy meiltä suoraan →</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
