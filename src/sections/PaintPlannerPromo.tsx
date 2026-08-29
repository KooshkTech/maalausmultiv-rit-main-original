import { Link } from 'react-router-dom';
import { ArrowRight, ImagePlus, Palette, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

export function PaintPlannerPromo() {
  return (
    <section className="section-pad bg-white" aria-labelledby="studio-promo-title">
      <div className="container-base">
        <Reveal>
          <div className="mb-10 max-w-3xl">
            <span className="eyebrow-orange"><Palette className="h-4 w-4" />Ilmaiset suunnittelutyökalut</span>
            <h2 id="studio-promo-title" className="mt-4 font-display text-3xl font-extrabold leading-tight text-navy-950 sm:text-4xl">Suunnittele ennen kuin aloitat</h2>
            <p className="mt-4 text-lg leading-relaxed text-navy-600">Kokeile, suunnittele ja arvioi projektisi helposti ennen kuin pyydät tarjouksen.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <StudioCard
              icon={Palette}
              iconLabel="VäriKamu"
              category="Maalaussuunnittelija"
              title="Suunnittele maalaus ennen kuin aloitat"
              description="VäriKamu auttaa sinua hahmottamaan, miltä uusi väri näyttää tilassasi, suunnittelemaan maalauksen ja arvioimaan projektin laajuuden helposti."
              detail="Valitse tila, kokeile värejä ja tee oma suunnitelmasi ennen kuin pyydät tarjousta."
              primaryHref="/paint-studio"
              primaryLabel="Aloita maalaussuunnittelu"
              secondaryHref="/varikamu"
              secondaryLabel="Tutustu VäriKamuun"
              tone="orange"
            />
            <StudioCard
              icon={ImagePlus}
              iconLabel="SiivousKamu"
              category="Siivoussuunnittelija"
              title="Suunnittele siivous helposti etukäteen"
              description="SiivousKamu auttaa määrittämään, mitä tiloja ja pintoja haluat puhdistaa, kuinka perusteellinen siivous tarvitaan ja millainen työ kokonaisuudesta muodostuu."
              detail="Valitse tila, määritä siivouksen laajuus ja tarkista arvio ennen tarjouspyyntöä."
              primaryHref="/cleaning-studio"
              primaryLabel="Aloita siivoussuunnittelu"
              secondaryHref="/siivouskamu"
              secondaryLabel="Tutustu SiivousKamuun"
              tone="navy"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StudioCard({ icon: Icon, iconLabel, category, title, description, detail, primaryHref, primaryLabel, secondaryHref, secondaryLabel, tone }: {
  icon: LucideIcon;
  iconLabel: string;
  category: string;
  title: string;
  description: string;
  detail: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  tone: 'orange' | 'navy';
}) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden p-6 shadow-card sm:p-8">
      <div className={`mb-8 flex min-h-28 items-end justify-between rounded-2xl p-5 ${tone === 'orange' ? 'bg-orange-50' : 'bg-navy-50'}`}>
        <div className={`flex size-14 items-center justify-center rounded-2xl ${tone === 'orange' ? 'bg-orange-500 text-white' : 'bg-navy-900 text-white'}`} aria-hidden="true"><Icon className="h-7 w-7" /></div>
        <span className={`text-4xl font-display font-extrabold ${tone === 'orange' ? 'text-orange-200' : 'text-navy-200'}`} aria-hidden="true">{tone === 'orange' ? '01' : '02'}</span>
      </div>
      <div className="flex items-center gap-2 text-sm font-bold text-navy-700"><Icon className="h-4 w-4 text-orange-500" aria-hidden="true" />{iconLabel}<span className="text-navy-300">·</span><span className="font-medium text-navy-500">{category}</span></div>
      <h3 className="mt-4 text-2xl font-extrabold leading-tight text-navy-950">{title}</h3>
      <p className="mt-4 leading-relaxed text-navy-600">{description}</p>
      <p className="mt-3 leading-relaxed text-navy-600">{detail}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link to={primaryHref} className="btn-primary flex-1">{primaryLabel} <ArrowRight className="h-4 w-4" /></Link>
        <Link to={secondaryHref} className="text-center text-sm font-bold text-navy-700 underline decoration-orange-300 underline-offset-4 transition hover:text-orange-600">{secondaryLabel}</Link>
      </div>
    </article>
  );
}
