import { Link } from 'react-router-dom';
import { ArrowRight, Brush, CheckCircle2, Layers3, PaintRoller, ShieldCheck, UserRound } from 'lucide-react';
import { Seo } from '@/components/Seo';

const benefits = [
  'Oma kuva ja maalaussuunnitelma samassa paikassa',
  'Ei-tuhoava maski- ja historiapohjainen työskentely',
  'Suojaus, valinta, muodot, tapetti ja valmistelutyökalut',
  'Smart Paint toimii turvallisella paikallisella varatilalla',
  'Valmis suunnitelma voidaan käyttää tarjouspyynnön visuaalisena ohjeena',
];

export function KamuStudioPage() {
  const description = 'VäriKamu on Maalaus Multivärin maalaussuunnittelusovellus. Kokeile värejä, suojaa alueita, käytä tapettia ja tee valmis visuaalinen suunnitelma omalla kuvallasi.';

  return (
    <>
      <Seo title="VäriKamu – maalaussuunnittelu omalla kuvalla" description={description} path="/kamu" breadcrumbs={[{ name: 'Etusivu', path: '/' }, { name: 'VäriKamu', path: '/kamu' }]} serviceSchema={{ name: 'VäriKamu', description, areaServed: 'Helsinki, Espoo, Vantaa ja Uusimaa' }} />
      <main className="pb-24 sm:pb-0">
        <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-5 py-14 text-white sm:py-24">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl" />
          <div className="container-base relative grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-300"><PaintRoller className="size-4" /> VäriKamu</div>
              <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">Suunnittele maalaus omalla kuvallasi.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-navy-100">Valitse pinta, suojaa rajat, kokeile värejä ja tapetteja, tee valmistelut ja vertaa lopputulosta ennen oikeaa maalaustyötä.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link to="/app/varikamu" className="btn-primary">Avaa VäriKamu <ArrowRight className="size-5" /></Link><Link to="/app/login" className="btn-ghost-light"><UserRound className="size-4" /> Kirjaudu</Link></div>
            </div>
            <Link to="/varikamu" className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-0.5 hover:bg-white/10"><div className="flex items-start justify-between gap-4"><div className="flex size-12 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300"><PaintRoller className="size-6" /></div><ArrowRight className="size-5 text-navy-400 transition group-hover:translate-x-1 group-hover:text-orange-300" /></div><h2 className="mt-5 font-display text-2xl font-bold">VäriKamu</h2><p className="mt-2 text-sm leading-6 text-navy-200">Maalauskerrokset, maskit, suojaus, valinta, tapetti, valmistelutyökalut ja Smart Paint samassa editorissa.</p></Link>
          </div>
        </section>

        <section className="section-pad bg-white"><div className="container-base"><div className="mx-auto max-w-3xl text-center"><span className="eyebrow-orange">Maalaussuunnittelu</span><h2 className="mt-4 font-display text-3xl font-bold text-navy-950 sm:text-4xl">Yksi selkeä työkalu maalausta varten</h2><p className="mt-4 leading-7 text-navy-600">VäriKamu pitää alkuperäisen kuvan tallessa ja rakentaa muutokset maskeista, kerroksista ja säädöistä.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3"><FeatureCard icon={Layers3} title="Kerroksittainen työ" text="Värit, tapetti ja valmistelu voidaan tehdä valitulle alueelle rikkomatta alkuperäistä kuvaa." /><FeatureCard icon={Brush} title="Työkalut käden ulottuvilla" text="Sivellin, tela, maalisuihke, kulmasivellin, suojaus, pyyhin, muodot ja valinta." /><FeatureCard icon={ShieldCheck} title="Turvallinen Smart" text="Smart täydentää valintaa, mutta manuaalinen työ säilyy ja suojaus rajaa muutokset pois suojatuilta pinnoilta." /></div></div></section>

        <section className="section-pad bg-navy-50/70"><div className="container-base grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><ShieldCheck className="size-9 text-orange-600" /><span className="eyebrow-orange mt-5">Asiakaspolku</span><h2 className="mt-4 font-display text-3xl font-bold text-navy-950">Suunnitelmasta tarjouspyyntöön</h2><p className="mt-4 leading-7 text-navy-600">Tee visuaalinen suunnitelma, tallenna projekti ja käytä lopputulosta Maalaus Multivärille lähetettävän tarjouspyynnön tukena.</p></div><div className="card p-6 sm:p-8"><div className="space-y-4">{benefits.map((item) => <div key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-orange-600" /><span className="font-medium text-navy-800">{item}</span></div>)}</div><div className="mt-8 rounded-2xl bg-navy-950 p-5 text-white"><p className="text-xs font-bold uppercase tracking-wider text-orange-300">Helppo käyttö</p><p className="mt-2 font-display text-xl font-bold">Kuva → valinta → suojaus → valmistelu → väri/tapetti → tarkistus</p></div></div></div></section>
      </main>
    </>
  );
}

function FeatureCard({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return <div className="card p-6"><div className="flex size-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Icon className="size-5" /></div><h3 className="mt-4 font-display text-xl font-bold text-navy-950">{title}</h3><p className="mt-2 text-sm leading-6 text-navy-600">{text}</p></div>;
}
