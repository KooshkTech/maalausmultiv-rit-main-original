import { Link } from 'react-router-dom';
import { ArrowRight, Brush, CheckCircle2, PaintRoller, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { Seo } from '@/components/Seo';

const sharedBenefits = [
  'Yksi asiakastili molemmille työkaluille',
  'Omat kuvat ja suunnitelmat samassa paikassa',
  'Ennen / jälkeen -vertailu ja ladattava lopputulos',
  'Suunnitelma voidaan käyttää tarjouspyynnön visuaalisena ohjeena',
];

export function KamuStudioPage() {
  const description = 'Kamu Studio yhdistää VäriKamun ja SiivousKamun yhdeksi helpoksi asiakassovellukseksi. Suunnittele maalaus tai siivous omalla kuvalla ja lähetä valmis suunnitelma Maalaus Multivärille.';

  return (
    <>
      <Seo
        title="Kamu Studio – VäriKamu ja SiivousKamu samassa sovelluksessa"
        description={description}
        path="/kamu"
        breadcrumbs={[{ name: 'Etusivu', path: '/' }, { name: 'Kamu Studio', path: '/kamu' }]}
        serviceSchema={{ name: 'Kamu Studio', description, areaServed: 'Helsinki, Espoo, Vantaa ja Uusimaa' }}
      />

      <main className="pb-24 sm:pb-0">
        <section className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-5 py-14 text-white sm:py-24">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl" />
          <div className="container-base relative grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
                <Sparkles className="size-4" /> Kamu Studio
              </div>
              <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
                Kaksi suunnittelutyökalua. Yksi helppo sovellus.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-navy-100">
                Valitse VäriKamu maalauksen suunnitteluun tai SiivousKamu siivouksen suunnitteluun. Käytä omaa kuvaasi, tee suunnitelma ja siirry tarjouspyyntöön samasta palvelusta.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/app" className="btn-primary">Avaa Kamu Studio <ArrowRight className="size-5" /></Link>
                <Link to="/app/login" className="btn-ghost-light"><UserRound className="size-4" /> Kirjaudu</Link>
              </div>
              <p className="mt-4 text-sm text-navy-300">Esikatselut ovat suunnitteluapu. Lopullinen tarjous ja työn toteutus vahvistetaan aina erikseen.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Link to="/varikamu" className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-0.5 hover:bg-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300"><PaintRoller className="size-6" /></div>
                  <ArrowRight className="size-5 text-navy-400 transition group-hover:translate-x-1 group-hover:text-orange-300" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-bold">VäriKamu</h2>
                <p className="mt-2 text-sm leading-6 text-navy-200">Kokeile värejä omassa kuvassa, suojaa rajat, maalaa haluttuja pintoja ja vertaa ennen / jälkeen.</p>
              </Link>

              <Link to="/siivouskamu" className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-0.5 hover:bg-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-white"><Sparkles className="size-6" /></div>
                  <ArrowRight className="size-5 text-navy-400 transition group-hover:translate-x-1 group-hover:text-orange-300" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-bold">SiivousKamu</h2>
                <p className="mt-2 text-sm leading-6 text-navy-200">Merkitse siivottavat pinnat omasta kuvasta, tee visuaalinen suunnitelma ja lähetä työn tarve selkeästi.</p>
              </Link>
            </div>
          </div>
        </section>

        <section className="section-pad bg-white">
          <div className="container-base">
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow-orange">Valitse tehtävä</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-navy-950 sm:text-4xl">Sama Kamu Studio, kaksi erikoistunutta työtilaa</h2>
              <p className="mt-4 leading-7 text-navy-600">Asiakkaan ei tarvitse opetella kahta eri palvelua. Käyttölogiikka, tili ja tarjouspolku pysyvät yhtenäisinä.</p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <article className="card overflow-hidden">
                <div className="bg-orange-50 p-7 sm:p-8">
                  <div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-orange-500 text-white"><Brush className="size-6" /></div><div><p className="text-xs font-bold uppercase tracking-wider text-orange-700">Maalaus</p><h3 className="font-display text-2xl font-bold text-navy-950">VäriKamu</h3></div></div>
                  <p className="mt-5 leading-7 text-navy-700">Ota kuva, valitse väri, maalaa vähän ja viimeistele suunnitelma. Suojaus, Smart-toiminnot, korjaustyökalut ja ennen / jälkeen -vertailu pysyvät osana nykyistä tehokasta VäriKamua.</p>
                  <div className="mt-6 flex flex-wrap gap-3"><Link to="/app/varikamu" className="btn-primary">Avaa VäriKamu <ArrowRight className="size-4" /></Link><Link to="/varikamu" className="btn-outline">Lue lisää</Link></div>
                </div>
              </article>

              <article className="card overflow-hidden">
                <div className="bg-navy-50 p-7 sm:p-8">
                  <div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-2xl bg-navy-900 text-white"><Sparkles className="size-6" /></div><div><p className="text-xs font-bold uppercase tracking-wider text-navy-500">Siivous</p><h3 className="font-display text-2xl font-bold text-navy-950">SiivousKamu</h3></div></div>
                  <p className="mt-5 leading-7 text-navy-700">Ota kuva, valitse puhdistettava pinta ja tee visuaalinen siivoussuunnitelma. Lopputuloksen on tarkoitus näyttää puhdistetulta valokuvalta eikä värilliseltä peittokuvalta.</p>
                  <div className="mt-6 flex flex-wrap gap-3"><Link to="/app/siivouskamu" className="btn-primary">Avaa SiivousKamu <ArrowRight className="size-4" /></Link><Link to="/siivouskamu" className="btn-outline">Lue lisää</Link></div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section-pad bg-navy-50/70">
          <div className="container-base grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <ShieldCheck className="size-9 text-orange-600" />
              <span className="eyebrow-orange mt-5">Yhteinen asiakaspolku</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-navy-950">Suunnitelmasta tarjouspyyntöön ilman hyppimistä palvelusta toiseen</h2>
              <p className="mt-4 leading-7 text-navy-600">Kamu Studio toimii verkkosivuston yhteisenä sovelluskeskuksena. VäriKamu ja SiivousKamu käyttävät nykyistä asiakassovelluksen kirjautumista ja tarjouspolkua sen sijaan, että verkkosivulle tuotaisiin kaksi erillistä, päällekkäistä järjestelmää.</p>
            </div>
            <div className="card p-6 sm:p-8">
              <div className="space-y-4">{sharedBenefits.map((item) => <div key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-orange-600" /><span className="font-medium text-navy-800">{item}</span></div>)}</div>
              <div className="mt-8 rounded-2xl bg-navy-950 p-5 text-white"><p className="text-xs font-bold uppercase tracking-wider text-orange-300">Yksinkertainen käyttö</p><p className="mt-2 font-display text-xl font-bold">Kuva → työkalu → suunnitelma → tarkistus → tarjouspyyntö</p></div>
            </div>
          </div>
        </section>

        <section className="section-pad bg-white">
          <div className="container-base rounded-3xl bg-navy-950 p-8 text-white sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-300">Kamu Studio</p><h2 className="mt-3 font-display text-3xl font-bold">Aloita yhdestä paikasta</h2><p className="mt-3 max-w-2xl leading-7 text-navy-200">Valitse maalaus tai siivous ja jatka samalla asiakastilillä. Tämä sivu toimii verkkosivuston yhteisenä sisäänkäyntinä molempiin sovelluksiin.</p></div>
              <Link to="/app" className="btn-primary whitespace-nowrap">Avaa oma Kamu Studio <ArrowRight className="size-5" /></Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
