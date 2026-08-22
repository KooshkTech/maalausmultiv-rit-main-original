import { ArrowRight, Brush, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const options = [
  {
    title: 'Maalaus',
    description: 'Sisä-, ulko- ja remonttimaalaus',
    icon: Brush,
    href: '/yhteystiedot?service=maalaus',
  },
  {
    title: 'Siivous',
    description: 'Koti-, yritys- ja remonttisiivous',
    icon: Sparkles,
    href: '/yhteystiedot?service=siivous',
  },
  {
    title: 'Molemmat',
    description: 'Maalaus ja siivous samaan projektiin',
    icon: Sparkles,
    href: '/yhteystiedot?service=molemmat',
  },
];

export function QuickQuote() {
  return (
    <section aria-labelledby="quick-quote-title" className="bg-navy-50/60 py-12 sm:py-16">
      <div className="container-base">
        <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-soft sm:p-8 lg:p-10">
          <div className="max-w-2xl">
            <span className="eyebrow-orange">Nopea tarjouspyyntö</span>
            <h2 id="quick-quote-title" className="mt-2 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
              Tiedätkö jo, mitä tarvitset?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-600 sm:text-base">
              Valitse palvelu ja kerro kohteesta. Voit lisätä kuvat ja tarkemmat tiedot seuraavassa vaiheessa.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {options.map(({ title, description, icon: Icon, href }) => (
              <Link
                key={title}
                to={href}
                className="group flex min-h-28 items-center gap-4 rounded-2xl border border-navy-100 bg-navy-50/40 p-4 transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50/50 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-orange-100"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-base font-bold text-navy-900">{title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-navy-600">{description}</span>
                </span>
                <ArrowRight className="ml-auto h-5 w-5 shrink-0 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-orange-500" />
              </Link>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-2 text-xs text-navy-500 sm:flex-row sm:items-center sm:justify-between">
            <span>✓ Ei sitoutumista · ✓ Voit liittää kuvia · ✓ Vastaamme mahdollisimman nopeasti</span>
            <Link to="/yhteystiedot" className="font-bold text-orange-600 hover:text-orange-700">
              Avaa tarjouslomake →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
