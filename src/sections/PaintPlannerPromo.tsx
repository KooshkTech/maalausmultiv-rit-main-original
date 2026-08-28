import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, ImagePlus, Palette } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

export function PaintPlannerPromo() {
  return (
    <section className="section-pad bg-white">
      <div className="container-base">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-navy-950 p-7 text-white shadow-lift sm:p-10 lg:p-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-500/15" aria-hidden="true" />
            <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-300"><Palette className="h-4 w-4" />Uusi asiakastyökalu</span>
                <h2 className="mt-5 font-display text-3xl font-extrabold leading-tight sm:text-4xl">Kokeile värejä omassa kuvassasi ja arvioi maalaustyön hinta</h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-navy-100">Suunnittele talon ulkomaalaus, peltikaton maalaus tai sisätilojen väritys. Valitse julkisivu, katto, ovet, ikkunat, seinät ja muut maalattavat pinnat, lisää mitat ja saat alustavan hintahaarukan.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link to="/paint-studio" className="btn-primary">Kokeile värejä ja laske hinta <ArrowRight className="h-4 w-4" /></Link>
                  <Link to="/app/login" className="btn-ghost-light">Oma tili</Link>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <PromoItem icon={ImagePlus} title="Lataa kuva" text="Käytä omaa talo-, huone- tai kattokuvaa." />
                  <PromoItem icon={Palette} title="Suunnittele värit" text="Anna eri pinnoille omat sävyt." />
                  <PromoItem icon={Calculator} title="Näe hinta-arvio" text="Saat valintoihin perustuvan alustavan hintahaarukan." />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PromoItem({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300"><Icon className="h-5 w-5" /></span><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-xs leading-relaxed text-navy-200">{text}</p></div></div>;
}
