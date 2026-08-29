import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Camera, CheckCircle2, FileText, MapPin, Paintbrush } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { trackCtaClick } from '@/lib/analytics';

const steps = [
  {
    icon: Paintbrush,
    title: '1. Valitse kohde',
    text: 'Kerro, onko kyse sisämaalauksesta, talon ulkomaalauksesta, julkisivusta, katosta, ovista tai ikkunoista.',
  },
  {
    icon: MapPin,
    title: '2. Kerro sijainti',
    text: 'Helsinki, Espoo, Vantaa tai muu Uudenmaan kohde. Sijainti auttaa arvioimaan työn käytännön toteutusta.',
  },
  {
    icon: Camera,
    title: '3. Lisää kuvat',
    text: 'Kuvat auttavat hahmottamaan pintojen kuntoa ja työn laajuutta. VäriKamulla voit myös kokeilla uutta ilmettä etukäteen.',
  },
  {
    icon: Calculator,
    title: '4. Saat alustavan arvion',
    text: 'Arvio perustuu antamiisi tietoihin. Lopullinen tarjous vahvistetaan kohteen ja tarvittavien pohjatöiden perusteella.',
  },
  {
    icon: FileText,
    title: '5. Pyydä tarjous',
    text: 'Lähetä tiedot yhdellä kertaa. Saat selkeän tarjouksen, jossa työn sisältö ja aikataulu voidaan sopia ennen aloitusta.',
  },
];

export function PaintingJourney() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-base">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-orange-600">Maalauspolku</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
              Ideasta tarjoukseen ilman turhaa edestakaista viestittelyä
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Kokoa kohteen tärkeimmät tiedot, kuvat ja väritoiveet samaan polkuun. Näin saat hyödyllisemmän arvion ja me saamme paremman lähtötiedon tarjousta varten.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 70}>
              <article className="h-full rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <step.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-navy-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150}>
          <div className="mt-10 rounded-3xl bg-navy-950 p-6 text-white sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8">
            <div>
              <div className="flex items-center gap-2 text-orange-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Kaksi tapaa aloittaa</span>
              </div>
              <h3 className="mt-3 font-display text-2xl font-extrabold">Suunnittele ensin tai pyydä arvio heti</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-100 sm:text-base">
                Jos väri on vielä auki, aloita VäriKamusta. Jos tiedät jo mitä tarvitset, siirry suoraan tarjouspyyntöön.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
              <Link to="/varikamu" onClick={() => trackCtaClick('Aloita VäriKamulla', 'painting_journey')} className="btn-primary">
                Aloita VäriKamulla <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/yhteystiedot" onClick={() => trackCtaClick('Pyydä arvio', 'painting_journey')} className="btn-ghost-light">
                Pyydä arvio
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
