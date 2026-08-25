import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Download, ImagePlus, LogIn, Palette, PaintRoller, Save, ShieldCheck } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/sections/PageHero';
import { images } from '@/config/images';

const faq = [
  { q: 'Mikä on maalauslaskuri ja värisuunnittelija?', a: 'Työkalulla voit suunnitella maalausprojektin, valita maalattavat pinnat ja värit, lisätä oman kuvan sekä saada alustavan hinta-arvion. Tallennus, kuvat, lataukset ja tarjouspyynnöt toimivat maksuttoman käyttäjätilin kautta.' },
  { q: 'Voinko suunnitella talon ulkomaalauksen ja katon värin?', a: 'Kyllä. Voit valita esimerkiksi julkisivun, maalattavan peltikaton, ulko-ovet, ikkunanpuitteet, räystäät, sokkelin, aidan ja muut soveltuvat ulkopinnat omiksi värialueikseen.' },
  { q: 'Sopiiko työkalu sisämaalauksen suunnitteluun?', a: 'Kyllä. Voit suunnitella seinien, sisäkattojen, ovien, karmien, ikkunoiden, listojen, kaappien, portaiden ja muiden maalattavaksi soveltuvien sisäpintojen värejä.' },
  { q: 'Onko laskurin antama hinta lopullinen tarjous?', a: 'Ei. Hinta-arvio on suuntaa-antava. Lopullinen hinta vahvistetaan vasta, kun kohteen todellinen kunto, pinta-alat, materiaalit, esityöt, turvallisuus ja työn laajuus on varmistettu.' },
  { q: 'Voinko ladata valmiin suunnitelman?', a: 'Kyllä. Kirjautunut käyttäjä voi tallentaa projektin ja ladata suunnitelmasta PDF-yhteenvedon sekä oman värisuunnitelmakuvan.' },
  { q: 'Miksi suunnittelija vaatii käyttäjätilin?', a: 'Käyttäjätilin avulla kuvat ja suunnitelmat voidaan liittää turvallisesti oikeaan asiakkaaseen, niitä voi jatkaa myöhemmin ja sama suunnitelma voidaan lähettää Maalaus Multivärille tarjouspyynnön yhteydessä.' },
];

const categories = [
  { title: 'Sisämaalaus', text: 'Seinät, katot, ovet, karmit, ikkunat, listat, kaapit, portaat ja muut maalattavat sisäpinnat.', icon: PaintRoller },
  { title: 'Talon ulkomaalaus', text: 'Julkisivu, sokkeli, ulko-ovet, ikkunanpuitteet, räystäät, aidat, portit ja piharakennukset.', icon: Palette },
  { title: 'Kattomaalaus', text: 'Maalattavan peltikaton värisuunnittelu sekä pesun, ruostekäsittelyn, pohjustuksen ja pinnoituksen arvio.', icon: ShieldCheck },
  { title: 'Muut maalattavat kohteet', text: 'Autotallit, varastot, hallit, pergolat, kaiteet ja muut maalaamiseen soveltuvat pinnat.', icon: Calculator },
];

export function PaintPlannerLandingPage() {
  return (
    <>
      <Seo
        title="Maalauslaskuri & värisuunnittelija — kokeile värejä ja arvioi hinta"
        description="Lataa kuva kohteesta, suunnittele talon, peltikaton, seinien, ovien ja ikkunoiden värit ja saat alustavan maalaustyön hinta-arvion. Tallenna ja lataa suunnitelma."
        path="/maalauslaskuri"
        breadcrumbs={[{ name: 'Etusivu', path: '/' }, { name: 'Maalauslaskuri', path: '/maalauslaskuri' }]}
        faqSchema={faq}
      />
      <PageHero
        eyebrow="Maalauslaskuri & värisuunnittelija"
        crumb="Maalauslaskuri"
        title="Suunnittele maalaus, kokeile värejä ja arvioi hinta"
        description="Lataa kuva omasta kohteestasi, valitse maalattavat pinnat ja värit, määritä työn laajuus ja saat alustavan hinta-arvion. Tallenna suunnitelma tilillesi ja lähetä se tarjouspyyntönä."
        image={images.pages.calculator}
      />

      <section className="relative z-20 -mt-8 px-5">
        <div className="container-base">
          <div className="card grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            <Feature icon={ImagePlus} title="Lataa oma kuva" text="Talo, huone, katto tai muu maalattava kohde." />
            <Feature icon={Palette} title="Valitse värit" text="Eri sävy julkisivulle, katolle, oville ja muille pinnoille." />
            <Feature icon={Calculator} title="Näe hinta-arvio" text="Työn laajuuteen ja valintoihin perustuva alustava hintahaarukka." />
            <Feature icon={Download} title="Tallenna ja lataa" text="PDF-yhteenveto sekä oma suunnitelmakuva." />
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-base grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <span className="eyebrow-orange">Näe idea ennen maalausta</span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">Kokeile talon, katon ja sisätilojen värejä omassa suunnitelmassasi</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-navy-600">
              <p>Värin valitseminen pelkän värikartan perusteella voi olla vaikeaa. Maalaus Multivärin värisuunnittelijassa voit käyttää omaa kuvaasi, merkitä maalattavia alueita ja kokeilla eri sävyjä ennen lopullista päätöstä.</p>
              <p>Voit suunnitella esimerkiksi vaalean julkisivun ja tumman peltikaton, vaihtaa ulko-oven värin, korostaa ikkunanpuitteita tai tehdä sisätiloihin useita vaihtoehtoja. Visualisointi on suunnittelun apuväline — lopullinen sävy kannattaa aina varmistaa fyysisestä värimallista todellisessa valaistuksessa.</p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/app/register" className="btn-primary">Aloita maksutta <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/app/login" className="btn-outline"><LogIn className="h-4 w-4" />Kirjaudu sisään</Link>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-navy-950 p-6 text-white shadow-lift sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Esimerkkisuunnitelma</p>
              <h3 className="mt-3 font-display text-2xl font-bold">Omakotitalon ulkomaalaus + peltikatto</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[['Julkisivu', '#C9CBC8', 'Vaalea harmaa'], ['Peltikatto', '#3D4142', 'Grafiitti'], ['Ulko-ovi', '#17191A', 'Musta'], ['Ikkunanpuitteet', '#F7F5EF', 'Valkoinen']].map(([label, color, name]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3"><span className="h-8 w-8 rounded-full border-2 border-white/30" style={{ backgroundColor: color }} /><div><p className="text-sm font-bold">{label}</p><p className="text-xs text-navy-200">{name}</p></div></div>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-sm text-navy-200">Hinta-arvio näkyy projektissa hintahaarukkana ja tarkentuu valittujen pintojen, pinta-alojen, kunnon ja esikäsittelyjen mukaan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy-50/60">
        <div className="container-base">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow-orange">Mitä voit suunnitella?</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-navy-900 sm:text-4xl">Yksi maalauslaskuri sisä-, ulko- ja kattomaalaukseen</h2>
            <p className="mt-4 text-navy-600">Työkalu kokoaa suunnittelun ja hinta-arvion samaan projektiin, jotta tarjouspyyntö sisältää alusta alkaen enemmän hyödyllistä tietoa.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(({ title, text, icon: Icon }) => <div key={title} className="card p-6"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Icon className="h-6 w-6" /></span><h3 className="mt-4 font-display text-lg font-bold text-navy-900">{title}</h3><p className="mt-2 text-sm leading-relaxed text-navy-600">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-base grid gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow-orange">Maalaustyön hinta</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-navy-900">Arvioi maalauksen hintaa ennen tarjouspyyntöä</h2>
            <p className="mt-4 leading-relaxed text-navy-600">Maalauksen hintaan vaikuttavat pinta-ala ja kappalemäärät, pinnan kunto, pesu ja muut pohjatyöt, maalauskertojen määrä, käytettävä laatutaso, työskentelykorkeus ja kohteen muut erityispiirteet. Laskuri käyttää näitä valintoja alustavan hintahaarukan muodostamiseen.</p>
            <p className="mt-4 rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm leading-relaxed text-navy-700"><strong>Tärkeää:</strong> laskurin tulos ei ole sitova tarjous. Lopullinen hinta vahvistetaan vasta kohteen ja todellisen työmäärän tarkistamisen jälkeen.</p>
          </div>
          <div>
            <span className="eyebrow-orange">Tallennettu projekti</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-navy-900">Jatka myöhemmin ja lähetä sama suunnitelma meille</h2>
            <div className="mt-5 space-y-4">
              <Step icon={Save} title="Tallenna suunnitelma" text="Pinnat, sävyt, mitat, esikäsittelyt ja hinta-arvio säilyvät omalla tililläsi." />
              <Step icon={Download} title="Lataa PDF ja kuva" text="Saat projektista selkeän yhteenvedon ja oman värisuunnitelmakuvan." />
              <Step icon={ArrowRight} title="Pyydä tarkka tarjous" text="Lähetä valmis projekti Maalaus Multivärille, jotta tarjous voidaan valmistella paremmilla lähtötiedoilla." />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy-50/60">
        <div className="container-base max-w-4xl">
          <div className="text-center"><span className="eyebrow-orange">Usein kysyttyä</span><h2 className="mt-4 font-display text-3xl font-bold text-navy-900">Maalauslaskuri ja värisuunnittelu</h2></div>
          <div className="mt-8 space-y-3">{faq.map((item) => <details key={item.q} className="card p-5"><summary className="cursor-pointer font-semibold text-navy-900">{item.q}</summary><p className="mt-3 text-sm leading-relaxed text-navy-600">{item.a}</p></details>)}</div>
          <div className="mt-10 rounded-3xl bg-navy-950 p-7 text-center text-white sm:p-10"><h2 className="font-display text-3xl font-bold">Valmis kokeilemaan?</h2><p className="mx-auto mt-3 max-w-xl text-navy-200">Luo maksuton käyttäjätili, lataa kuva kohteestasi ja rakenna ensimmäinen maalaussuunnitelmasi.</p><Link to="/app/register" className="btn-primary mt-6">Aloita suunnittelu <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>
    </>
  );
}

function Feature({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return <div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Icon className="h-5 w-5" /></span><div><h2 className="text-sm font-bold text-navy-900">{title}</h2><p className="mt-1 text-xs leading-relaxed text-navy-500">{text}</p></div></div>;
}

function Step({ icon: Icon, title, text }: { icon: React.ComponentType<{ className?: string }>; title: string; text: string }) {
  return <div className="flex gap-4 rounded-2xl border border-navy-100 p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Icon className="h-5 w-5" /></span><div><h3 className="font-bold text-navy-900">{title}</h3><p className="mt-1 text-sm leading-relaxed text-navy-600">{text}</p></div></div>;
}
