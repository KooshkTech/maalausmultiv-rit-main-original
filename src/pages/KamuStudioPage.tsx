import { Link } from 'react-router-dom';
import { ArrowRight, Brush, CheckCircle2, Cpu, Layers3, PaintRoller, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { Seo } from '@/components/Seo';

const sharedBenefits = [
  'Yksi asiakastili molemmille työkaluille',
  'Omat kuvat ja suunnitelmat samassa paikassa',
  'Ei-tuhoava maski- ja historiapohjainen työskentely',
  'Älykkäät työkalut toimivat myös verkkohäiriössä paikallisella varatilalla',
  'Suunnitelma voidaan käyttää tarjouspyynnön visuaalisena ohjeena',
];

export function KamuStudioPage() {
  const description = 'Kamu Studio yhdistää VäriKamun ja SiivousKamun yhdeksi helpoksi asiakassovellukseksi. Suunnittele maalaus tai siivous omalla kuvalla ja lähetä valmis suunnitelma Maalaus Multivärille.';

  return (
    <>
      <Seo title="Kamu Studio – VäriKamu ja SiivousKamu samassa sovelluksessa" description={description} path="/kamu" breadcrumbs={[{ name: 'Etusivu', path: '/' }, { name: 'Kamu Studio', path: '/kamu' }]} serviceSchema={{ name: 'Kamu Studio', description, areaServed: 'Helsinki, Espoo, Vantaa ja Uusimaa' }} />
      <main className="pb-24 sm:pb-0">
        <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-5 py-14 text-white sm:py-24">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl" />
          <div className="container-base relative grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-300"><Sparkles className="size-4" /> Kamu Studio Enterprise Engine</div>
              <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">Kaksi suunnittelutyökalua. Yksi helppo sovellus.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-navy-100">Valitse VäriKamu maalauksen suunnitteluun tai SiivousKamu siivouksen suunnitteluun. Uusi renderöintiarkkitehtuuri säilyttää pinnan valon ja tekstuurin, Smart-työkalut käyttävät etäsegmentointia turvallisella paikallisella varatilalla ja työ pysyy palautettavana.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link to="/app" className="btn-primary">Avaa Kamu Studio <ArrowRight className="size-5" /></Link><Link to="/app/login" className="btn-ghost-light"><UserRound className="size-4" /> Kirjaudu</Link></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Link to="/varikamu" className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-0.5 hover:bg-white/10"><div className="flex items-start justify-between gap-4"><div className="flex size-12 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300"><PaintRoller className="size-6" /></div><ArrowRight className="size-5 text-navy-400 transition group-hover:translate-x-1 group-hover:text-orange-300" /></div><h2 className="mt-5 font-display text-2xl font-bold">VäriKamu</h2><p className="mt-2 text-sm leading-6 text-navy-200">Kolme maalauskerrosta, luminanssia säilyttävä sävytys, maskit, suojaus ja Smart-segmentointi.</p></Link>
              <Link to="/siivouskamu" className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-0.5 hover:bg-white/10"><div className="flex items-start justify-between gap-4"><div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-white"><Sparkles className="size-6" /></div><ArrowRight className="size-5 text-navy-400 transition group-hover:translate-x-1 group-hover:text-orange-300" /></div><h2 className="mt-5 font-display text-2xl font-bold">SiivousKamu</h2><p className="mt-2 text-sm leading-6 text-navy-200">Luonnollinen puhdistus ilman värikalvoa, säädettävä intensiteetti ja reunat säilyttävä työnkulku.</p></Link>
            </div>
          </div>
        </section>

        <section className="section-pad bg-white"><div className="container-base"><div className="mx-auto max-w-3xl text-center"><span className="eyebrow-orange">Uusi moottori</span><h2 className="mt-4 font-display text-3xl font-bold text-navy-950 sm:text-4xl">Sama helppo käyttö, vahvempi tekninen perusta</h2><p className="mt-4 leading-7 text-navy-600">Käyttöliittymä pidetään asiakkaalle yksinkertaisena, mutta kuvan alla oleva moottori on nyt erotettu renderöinti-, maski-, segmentointi- ja SaaS-kerroksiin.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3"><EngineCard icon={Layers3} title="Ei-tuhoava renderöinti" text="Alkuperäinen kuva säilyy lähteenä. Maalaus- ja siivousmuutokset syntyvät maskeista ja parametreista." /><EngineCard icon={Cpu} title="Smart + varatila" text="Etäsegmentointi on ensisijainen, mutta paikallinen väripohjainen flood-fill pitää työkalun käytettävänä myös ilman verkkoa." /><EngineCard icon={ShieldCheck} title="Tenant-turvallinen" text="Uusi tietomalli tukee organisaatioita, rooleja, RLS-eristystä, auditointia ja tenant-kohtaista hinnoittelua." /></div></div></section>

        <section className="section-pad bg-navy-50/70"><div className="container-base grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><ShieldCheck className="size-9 text-orange-600" /><span className="eyebrow-orange mt-5">Yhteinen asiakaspolku</span><h2 className="mt-4 font-display text-3xl font-bold text-navy-950">Suunnitelmasta tarjouspyyntöön ilman hyppimistä palvelusta toiseen</h2><p className="mt-4 leading-7 text-navy-600">Kamu Studio toimii verkkosivuston yhteisenä sovelluskeskuksena. VäriKamu ja SiivousKamu jakavat tilin, projektit, hinnoittelukontekstin ja tarjouspolun.</p></div><div className="card p-6 sm:p-8"><div className="space-y-4">{sharedBenefits.map((item) => <div key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-orange-600" /><span className="font-medium text-navy-800">{item}</span></div>)}</div><div className="mt-8 rounded-2xl bg-navy-950 p-5 text-white"><p className="text-xs font-bold uppercase tracking-wider text-orange-300">Yksinkertainen käyttö</p><p className="mt-2 font-display text-xl font-bold">Kuva → työkalu → Smart/maski → tarkistus → tarjouspyyntö</p></div></div></div></section>

        <section className="section-pad bg-white"><div className="container-base grid gap-6 lg:grid-cols-2"><article className="card overflow-hidden"><div className="bg-orange-50 p-7 sm:p-8"><div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-orange-500 text-white"><Brush className="size-6" /></div><div><p className="text-xs font-bold uppercase tracking-wider text-orange-700">Maalaus</p><h3 className="font-display text-2xl font-bold text-navy-950">VäriKamu</h3></div></div><p className="mt-5 leading-7 text-navy-700">Ota kuva, valitse väri, maalaa vähän, suojaa rajat ja anna Smart-työkalun täydentää valintaa. Kolmen kerroksen renderöinti säilyttää alkuperäisen pinnan valon ja varjot.</p><div className="mt-6 flex flex-wrap gap-3"><Link to="/app/varikamu" className="btn-primary">Avaa VäriKamu <ArrowRight className="size-4" /></Link><Link to="/varikamu" className="btn-outline">Lue lisää</Link></div></div></article><article className="card overflow-hidden"><div className="bg-navy-50 p-7 sm:p-8"><div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-navy-900 text-white"><Sparkles className="size-6" /></div><div><p className="text-xs font-bold uppercase tracking-wider text-navy-500">Siivous</p><h3 className="font-display text-2xl font-bold text-navy-950">SiivousKamu</h3></div></div><p className="mt-5 leading-7 text-navy-700">Merkitse puhdistettava pinta ja säädä puhdistuksen voimakkuutta. Lopputulos tähtää samaan valokuvaan puhtaampana, ei värilliseen peittokuvaan.</p><div className="mt-6 flex flex-wrap gap-3"><Link to="/app/siivouskamu" className="btn-primary">Avaa SiivousKamu <ArrowRight className="size-4" /></Link><Link to="/siivouskamu" className="btn-outline">Lue lisää</Link></div></div></article></div></section>
      </main>
    </>
  );
}

function EngineCard({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return <div className="card p-6"><div className="flex size-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Icon className="size-5" /></div><h3 className="mt-4 font-display text-xl font-bold text-navy-950">{title}</h3><p className="mt-2 text-sm leading-6 text-navy-600">{text}</p></div>;
}
