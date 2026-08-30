import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, CheckCircle2, Home, Layers3, PaintRoller, Ruler, ShieldCheck } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { MobileStickyCTA } from '@/components/MobileStickyCTA';

const priceFactors = [
  { icon: Ruler, title: 'Pinta-ala', text: 'Maalattavan alueen koko vaikuttaa työn määrään, materiaaleihin ja aikatauluun.' },
  { icon: Layers3, title: 'Pinnan kunto', text: 'Pesu, kaavinta, tasoitus, hionta ja muut pohjatyöt määrittävät suuren osan kokonaisuudesta.' },
  { icon: Home, title: 'Kohteen rakenne', text: 'Korkeus, kulmat, ikkunat, ovet ja vaikeat työskentelyalueet vaikuttavat toteutustapaan.' },
  { icon: PaintRoller, title: 'Maalausjärjestelmä', text: 'Pohjamaali, pintamaali, käsittelykertojen määrä ja valittu tuote huomioidaan tarjouksessa.' },
];

export function PricingHubPage() {
  return (
    <>
      <Seo
        title="Maalauksen hinta ja hinta-arvio | Maalaus Multiväri"
        description="Mistä maalauksen hinta muodostuu? Katso tärkeimmät hintaan vaikuttavat tekijät ja pyydä kohteeseesi maksuton arvio Helsingissä, Espoossa, Vantaalla ja Uudellamaalla."
        path="/hinnat"
      />

      <main>
        <section className="bg-navy-950 pb-16 pt-28 text-white sm:pb-20 sm:pt-32">
          <div className="container-base grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="text-sm font-bold uppercase tracking-widest text-orange-400">Maalauksen hinta</span>
              <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Selkeä arvio ennen päätöstä</h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-100 sm:text-lg">
                Maalaustyön hinta riippuu kohteesta, pintojen kunnosta, pohjatöistä ja työn laajuudesta. Emme julkaise keksittyjä neliöhintoja — pyydä arvio, joka perustuu omaan kohteeseesi.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to="/kustannuslaskuri" className="btn-primary">
                  Laske alustava arvio <Calculator className="h-4 w-4" />
                </Link>
                <Link to="/yhteystiedot" className="btn-ghost-light">
                  Pyydä maksuton tarjous <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur sm:p-8">
                <ShieldCheck className="h-9 w-9 text-orange-400" />
                <h2 className="mt-4 font-display text-2xl font-bold">Mitä hyvä tarjous kertoo?</h2>
                <ul className="mt-5 space-y-3 text-sm text-navy-100">
                  {['Työn laajuuden ja pohjatyöt', 'Käytettävät materiaalit ja käsittelyt', 'Arvioidun aikataulun', 'Sovitut rajaukset ja ehdot'].map((item) => (
                    <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="container-base">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl font-extrabold text-navy-950 sm:text-4xl">Mitkä asiat vaikuttavat maalauksen hintaan?</h2>
              <p className="mt-4 text-slate-600">Sama neliömäärä voi tarkoittaa hyvin erilaista työmäärää. Siksi tarkka hinta kannattaa muodostaa kohteen todellisista lähtötiedoista.</p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {priceFactors.map((factor) => (
                <article key={factor.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600"><factor.icon className="h-5 w-5" /></span>
                  <h3 className="mt-4 font-display text-lg font-bold text-navy-950">{factor.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{factor.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-20">
          <div className="container-base grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-7 shadow-sm sm:p-8">
              <span className="text-sm font-bold uppercase tracking-wider text-orange-600">Vaihtoehto 1</span>
              <h2 className="mt-2 font-display text-2xl font-extrabold text-navy-950">Arvioi projektin laajuus</h2>
              <p className="mt-3 text-slate-600">Käytä kustannuslaskuria, kun haluat ensin hahmottaa projektin kokoa ja antaa meille jäsennellyt lähtötiedot.</p>
              <Link to="/kustannuslaskuri" className="mt-6 inline-flex items-center gap-2 font-bold text-orange-600 hover:text-orange-700">Avaa kustannuslaskuri <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="rounded-3xl bg-navy-950 p-7 text-white shadow-sm sm:p-8">
              <span className="text-sm font-bold uppercase tracking-wider text-orange-400">Vaihtoehto 2</span>
              <h2 className="mt-2 font-display text-2xl font-extrabold">Suunnittele värit ennen tarjousta</h2>
              <p className="mt-3 text-navy-100">VäriKamulla voit kokeilla värejä omaan kuvaasi ja käyttää suunnitelmaa keskustelun pohjana ennen maalaustyötä.</p>
              <Link to="/varikamu" className="mt-6 inline-flex items-center gap-2 font-bold text-orange-400 hover:text-orange-300">Kokeile VäriKamua <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="container-base">
            <div className="rounded-3xl border border-orange-100 bg-orange-50 p-7 text-center sm:p-10">
              <h2 className="font-display text-3xl font-extrabold text-navy-950">Haluatko tarkan tarjouksen?</h2>
              <p className="mx-auto mt-3 max-w-2xl text-slate-700">Kerro kohteesta, sijainnista, pintojen kunnosta ja toivotusta aikataulusta. Kuvat auttavat arvioinnissa.</p>
              <Link to="/yhteystiedot" className="btn-primary mt-7">Pyydä maksuton arvio <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </main>
      <MobileStickyCTA />
    </>
  );
}
