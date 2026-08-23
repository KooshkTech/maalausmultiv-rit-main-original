import { useMemo, useState } from 'react';
import { Calculator, CheckCircle2, Phone, Send, TrendingUp } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/sections/PageHero';
import { ContactCTA } from '@/sections/ContactCTA';
import { images } from '@/config/images';
import { company } from '@/data/company';
import { services } from '@/data/services';
import { Link } from 'react-router-dom';
import { trackCalcComplete } from '@/lib/leadPopupEvents';
import { trackPhoneClick, trackCtaClick } from '@/lib/analytics';

const propertyTypes = [
  { id: 'apartment', label: 'Kerrostalo-asunto', factor: 1.0 },
  { id: 'house', label: 'Omakotitalo', factor: 1.3 },
  { id: 'townhouse', label: 'Rivitalo', factor: 1.15 },
  { id: 'office', label: 'Toimisto / toimitila', factor: 1.2 },
  { id: 'other', label: 'Muu', factor: 1.1 },
];

const paintQuality = [
  { id: 'standard', label: 'Vakio', pricePerSqm: 7 },
  { id: 'premium', label: 'Premium', pricePerSqm: 10 },
  { id: 'luxury', label: 'Luksus', pricePerSqm: 14 },
];

const wallConditions = [
  { id: 'good', label: 'Hyvä — maalataan suoraan', multiplier: 1.0 },
  { id: 'fair', label: 'Kohtalainen — pieni tasoitus', multiplier: 1.2 },
  { id: 'poor', label: 'Huono — paljon tasoitusta', multiplier: 1.45 },
  { id: 'wallpaper', label: 'Tapetti poistettava', multiplier: 1.6 },
];

type CalcState = {
  propertyType: string;
  service: string;
  area: number;
  rooms: number;
  ceilings: boolean;
  paintQuality: string;
  wallCondition: string;
};

const initialState: CalcState = {
  propertyType: 'apartment',
  service: 'sisamaalaus',
  area: 50,
  rooms: 2,
  ceilings: false,
  paintQuality: 'standard',
  wallCondition: 'good',
};

export function CostCalculatorPage() {
  const [state, setState] = useState<CalcState>(initialState);

  const estimate = useMemo(() => {
    const propFactor = propertyTypes.find((p) => p.id === state.propertyType)?.factor ?? 1;
    const quality = paintQuality.find((q) => q.id === state.paintQuality)?.pricePerSqm ?? 7;
    const condition = wallConditions.find((w) => w.id === state.wallCondition)?.multiplier ?? 1;
    const ceilingArea = state.ceilings ? state.area * 0.3 : 0;
    const totalArea = state.area + ceilingArea;
    const roomExtra = state.rooms > 3 ? (state.rooms - 3) * 40 : 0;
    const base = totalArea * quality * propFactor * condition + roomExtra;
    const low = Math.round((base * 0.85) / 10) * 10;
    const high = Math.round((base * 1.2) / 10) * 10;
    return { low, high, totalArea: Math.round(totalArea) };
  }, [state]);

  const update = <K extends keyof CalcState>(key: K, value: CalcState[K]) => {
    setState((s) => ({ ...s, [key]: value }));
    trackCalcComplete();
  };

  const selectedService = services.find((s) => s.slug === state.service);

  return (
    <>
      <Seo
        title="Maalauskustannuslaskuri"
        description="Laske arvio maalaustyön kustannuksista ilmaisella laskurilla. Saat heti arvion ja voit pyytää virallisen tarjouksen."
        path="/kustannuslaskuri"
        breadcrumbs={[{ name: 'Kustannuslaskuri', path: '/kustannuslaskuri' }]}
      />
      <PageHero
        eyebrow="Ilmainen laskuri"
        title="Maalauskustannuslaskuri"
        description="Saat heti arvion maalaustyön kustannuksista. Täytä tiedot alla ja pyydä tarjous tarkalla hinnalla."
        crumb="Kustannuslaskuri"
        image={images.pages.calculator}
      />

      <section className="section-pad">
        <div className="container-base grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Calculator className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-navy-900">Syötä tiedot</h2>
                <p className="text-sm text-navy-500">Mitä enemmän tietoja, sitä tarkempi arvio</p>
              </div>
            </div>

            <div className="space-y-6">
              <FieldGroup label="Kiinteistön tyyppi">
                <select
                  value={state.propertyType}
                  onChange={(e) => update('propertyType', e.target.value)}
                  className={selectClass}
                >
                  {propertyTypes.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </FieldGroup>

              <FieldGroup label="Palvelu">
                <select
                  value={state.service}
                  onChange={(e) => update('service', e.target.value)}
                  className={selectClass}
                >
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.title}</option>
                  ))}
                </select>
              </FieldGroup>

              <div className="grid gap-6 sm:grid-cols-2">
                <FieldGroup label={`Maalattava pinta-ala: ${state.area} m²`}>
                  <input
                    type="range"
                    min={10}
                    max={500}
                    step={5}
                    value={state.area}
                    onChange={(e) => update('area', Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                  <div className="mt-1 flex justify-between text-xs text-navy-400">
                    <span>10 m²</span>
                    <span>500 m²</span>
                  </div>
                </FieldGroup>

                <FieldGroup label={`Huoneiden lukumäärä: ${state.rooms}`}>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    step={1}
                    value={state.rooms}
                    onChange={(e) => update('rooms', Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                  <div className="mt-1 flex justify-between text-xs text-navy-400">
                    <span>1</span>
                    <span>15</span>
                  </div>
                </FieldGroup>
              </div>

              <FieldGroup label="Maalattavat pinnat">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-navy-200 px-4 py-3 transition hover:border-orange-300">
                  <input
                    type="checkbox"
                    checked={state.ceilings}
                    onChange={(e) => update('ceilings', e.target.checked)}
                    className="h-5 w-5 accent-orange-500"
                  />
                  <span className="text-sm font-medium text-navy-800">Maalataan myös katot</span>
                </label>
              </FieldGroup>

              <div className="grid gap-6 sm:grid-cols-2">
                <FieldGroup label="Maalin laatu">
                  <select
                    value={state.paintQuality}
                    onChange={(e) => update('paintQuality', e.target.value)}
                    className={selectClass}
                  >
                    {paintQuality.map((q) => (
                      <option key={q.id} value={q.id}>{q.label}</option>
                    ))}
                  </select>
                </FieldGroup>

                <FieldGroup label="Pintojen kunto">
                  <select
                    value={state.wallCondition}
                    onChange={(e) => update('wallCondition', e.target.value)}
                    className={selectClass}
                  >
                    {wallConditions.map((w) => (
                      <option key={w.id} value={w.id}>{w.label}</option>
                    ))}
                  </select>
                </FieldGroup>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="card overflow-hidden">
              <div className="bg-navy-900 p-6 text-white">
                <div className="flex items-center gap-2 text-orange-400">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Arvio</span>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold font-display">
                    {estimate.low}–{estimate.high} €
                  </span>
                </div>
                <p className="mt-2 text-sm text-navy-200">
                  Arvioitu hinta {selectedService?.title.toLowerCase()}-työlle
                </p>
                <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-navy-200">
                  <div className="flex justify-between">
                    <span>Maalattava pinta-ala</span>
                    <span className="font-semibold text-white">{estimate.totalArea} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kiinteistön tyyppi</span>
                    <span className="font-semibold text-white">
                      {propertyTypes.find((p) => p.id === state.propertyType)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maalin laatu</span>
                    <span className="font-semibold text-white">
                      {paintQuality.find((q) => q.id === state.paintQuality)?.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="mb-4 text-xs text-navy-500">
                  Arvio on suuntaa-antava. Lopullinen hinta määräytyy kohteen tarkastuksen
                  perusteella. Pyydä ilmainen tarjous tarkalla hinnalla.
                </p>
                <Link to="/yhteystiedot" onClick={() => trackCtaClick('Pyydä virallinen tarjous', 'cost_calculator_result')} className="btn-primary w-full">
                  <Send className="h-4 w-4" />
                  Pyydä virallinen tarjous
                </Link>
                <a href={company.phoneHref} onClick={() => trackPhoneClick('cost_calculator_result')} className="btn-outline mt-3 w-full">
                  <Phone className="h-4 w-4" />
                  Soita {company.phone}
                </a>
                <div className="mt-5 space-y-2">
                  <Bullet text="Ilmainen paikallinen arviokäynti" />
                  <Bullet text="Sitouttamaton tarjous 24 h sisällä" />
                  <Bullet text="Kirjallinen takuu 2 vuotta" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}

const selectClass =
  'w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy-900 transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400';

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-navy-800">{label}</label>
      {children}
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-navy-600">
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      {text}
    </div>
  );
}
