import { ArrowRight, Camera, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/Reveal';

const checks = [
  'Maalipinnan hilseily tai halkeilu',
  'Puun tai alustan näkyminen',
  'Tummumat, lika tai kosteuden jäljet',
  'Epävarmuus edellisestä maalausajankohdasta',
];

export function AssessmentCTA() {
  return (
    <section className="section-pad bg-white">
      <div className="container-base">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-navy-100 bg-navy-950 text-white shadow-lift">
            <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:p-12">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-300">
                  <Camera className="h-4 w-4" /> Maksuton arvio
                </span>
                <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">Tarvitseeko talosi tai pintasi maalausta?</h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-navy-100">
                  Jos et tiedä onko nyt oikea aika maalata, kerro kohteesta ja pyydä ammattilaisen arvio. Saat kohdekohtaisen suosituksen ilman että sivusto arvaa työn tarvetta automaattisesti.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/yhteystiedot?service=maalaus" className="btn-primary">Pyydä maksuton arvio <ArrowRight className="h-4 w-4" /></Link>
                  <Link to="/hinnat" className="btn-ghost-light">Katso hinnan muodostuminen</Link>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
                <p className="font-display text-lg font-bold">Tarkista ainakin nämä merkit</p>
                <ul className="mt-4 grid gap-3">
                  {checks.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-navy-100">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs leading-relaxed text-navy-300">Arvio perustuu oikeisiin kohdetietoihin ja tarvittaessa tarkastukseen — ei automaattiseen tai tekaistuun “AI-diagnoosiin”.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
