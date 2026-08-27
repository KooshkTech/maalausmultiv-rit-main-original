import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ImagePlus, Palette, PaintRoller, Sparkles } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/sections/PageHero';
import { SimplePaintPlannerModal } from '@/components/SimplePaintPlannerModal';
import { images } from '@/config/images';

const faq = [
  { q: 'Voinko ladata oman kuvan huoneesta?', a: 'Kyllä. Lataa JPG-, PNG- tai WebP-kuva huoneestasi. Kuvaa käytetään selaimessa värien suuntaa-antavaan esikatseluun.' },
  { q: 'Voinko vaihtaa seinien värin?', a: 'Kyllä. Valitse seinille valmis sävy tai oma väri. Esikatselu päivittyy heti.' },
  { q: 'Voinko vaihtaa katon ja ovien tai listojen värin?', a: 'Kyllä. Seinien lisäksi voit valita erikseen katon sekä ovien ja listojen värin.' },
  { q: 'Onko maalisuunnittelija maksuton?', a: 'Kyllä. Voit kokeilla värejä ilman käyttäjätiliä tai kirjautumista.' },
  { q: 'Onko esikatselu sama kuin lopullinen maalipinta?', a: 'Ei. Esikatselu on suuntaa-antava. Todellinen sävy voi vaihdella valaistuksen, pinnan ja näytön mukaan, joten lopullinen väri kannattaa varmistaa fyysisellä värimallilla.' },
  { q: 'Voiko Maalaus Multiväri toteuttaa suunnitelman?', a: 'Kyllä. Kun löydät sopivan värisuunnitelman, voit lähettää lyhyen tarjouspyynnön suoraan suunnittelijasta.' },
  { q: 'Millä alueilla palvelua saa?', a: 'Palvelemme Helsingissä, Espoossa, Vantaalla ja muualla Uudellamaalla kohteen mukaan.' },
];

const steps = [
  { icon: ImagePlus, title: '1. Lataa kuva', text: 'Valitse selkeä kuva huoneestasi puhelimelta tai tietokoneelta.' },
  { icon: Palette, title: '2. Valitse värit', text: 'Kokeile seinien, katon sekä ovien ja listojen sävyjä.' },
  { icon: Sparkles, title: '3. Katso lopputulos', text: 'Vaihda ennen/jälkeen-näkymää ja vertaile valintaasi.' },
  { icon: PaintRoller, title: '4. Pyydä tarjous', text: 'Lähetä suunnitelman värit meille lyhyellä lomakkeella.' },
];

export function PaintPlannerLandingPage() {
  const [plannerOpen, setPlannerOpen] = useState(false);

  return (
    <>
      <Seo
        title="Suunnittele huoneen värit helposti | Maalaus Multiväri"
        description="Lataa kuva huoneestasi, kokeile seinien, katon ja ovien värejä ja näe uusi ilme helposti. Kun löydät sopivan vaihtoehdon, pyydä tarjous maalauksesta."
        path="/maalauslaskuri"
        breadcrumbs={[{ name: 'Etusivu', path: '/' }, { name: 'Maalisuunnittelija', path: '/maalauslaskuri' }]}
        faqSchema={faq}
      />

      <PageHero
        eyebrow="Maksuton maalisuunnittelija"
        crumb="Maalisuunnittelija"
        title="Suunnittele huoneesi värit helposti"
        description="Lataa kuva huoneestasi, kokeile uusia seinä-, katto- ja ovi-/listavärejä ja näe suuntaa-antava lopputulos muutamassa minuutissa — ilman kirjautumista."
        image={images.pages.calculator}
      />

      <section className="relative z-20 -mt-9 px-5">
        <div className="container-base">
          <div className="card grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
            <div>
              <span className="eyebrow-orange">UPLOAD → CHOOSE → SEE → QUOTE</span>
              <h2 className="mt-3 font-display text-2xl font-bold text-navy-950 sm:text-3xl">Näe uusi väri omassa huoneessasi</h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-navy-600">Ei käyttäjätiliä. Ei pitkää kyselyä. Lataa kuva, valitse värit ja pyydä tarjous vain, jos pidät lopputuloksesta.</p>
            </div>
            <button type="button" onClick={() => setPlannerOpen(true)} className="btn-primary min-h-12 px-7 text-base"><ImagePlus className="h-5 w-5" /> Kokeile maalisuunnittelijaa</button>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-base">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow-orange">Näin se toimii</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-navy-950 sm:text-4xl">Neljä helppoa vaihetta</h2>
            <p className="mt-4 leading-relaxed text-navy-600">Työkalu on suunniteltu maalausasiakkaalle, ei sisustussuunnittelijalle. Sinun ei tarvitse opetella monimutkaista ohjelmaa.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><Icon className="h-6 w-6" /></span>
                <h3 className="mt-4 font-display text-lg font-bold text-navy-950">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy-50/60">
        <div className="container-base grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow-orange">Suunnittelun apuväline</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-navy-950 sm:text-4xl">Kokeile seinien, katon ja ovien värejä ennen päätöstä</h2>
            <p className="mt-4 leading-relaxed text-navy-600">Pelkkä värikartta ei aina kerro, miltä sävy tuntuu omassa huoneessa. Maalisuunnittelija auttaa vertailemaan muutamaa selkeää vaihtoehtoa omassa kuvassasi ennen kuin otat yhteyttä maalausliikkeeseen.</p>
            <div className="mt-6 space-y-3">
              {['Valmiiksi valittu helppo väripaletti', 'Seinät, katto ja ovet/listat erikseen', 'Ennen / jälkeen -vertailu', 'Ei pakollista rekisteröitymistä', 'Lyhyt tarjouspyyntö lopuksi'].map((item) => <div key={item} className="flex items-center gap-3 text-sm font-semibold text-navy-800"><CheckCircle2 className="h-5 w-5 text-orange-500" />{item}</div>)}
            </div>
            <button type="button" onClick={() => setPlannerOpen(true)} className="btn-primary mt-7">Lataa kuva ja aloita <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="overflow-hidden rounded-3xl bg-navy-950 p-7 text-white shadow-lift sm:p-9">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-400">Esimerkki</p>
            <h3 className="mt-3 font-display text-2xl font-bold">Pehmeä, moderni värimaailma</h3>
            <div className="mt-6 space-y-3">
              {[['Seinät', '#D8C9B5', 'Pehmeä beige'], ['Katto', '#FFFFFF', 'Valkoinen'], ['Ovet/listat', '#FFFFFF', 'Valkoinen']].map(([label, color, name]) => <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"><span className="h-10 w-10 rounded-full border-2 border-white/30" style={{ backgroundColor: color }} /><div><p className="text-xs uppercase tracking-wide text-navy-300">{label}</p><p className="font-bold">{name}</p></div></div>)}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-navy-200">Esikatselu on suuntaa-antava. Todellinen maalisävy voi näyttää erilaiselta huoneen valaistuksessa ja eri pinnoilla.</p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-base grid gap-8 lg:grid-cols-2">
          <div className="card p-7 sm:p-8">
            <span className="eyebrow-orange">Sisämaalaus Uudellamaalla</span>
            <h2 className="mt-4 font-display text-3xl font-bold text-navy-950">Pidätkö suunnitelmasta? Me voimme toteuttaa sen.</h2>
            <p className="mt-4 leading-relaxed text-navy-600">Maalaus Multiväri toteuttaa sisämaalausta koteihin ja muihin kohteisiin Helsingissä, Espoossa, Vantaalla ja muualla Uudellamaalla. Suunnittelijan jälkeen voit lähettää värivalinnat suoraan tarjouspyynnön mukana.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/palvelut/sisamaalaus" className="btn-outline">Tutustu sisämaalaukseen</Link>
              <Link to="/palvelualueet/helsinki" className="btn-outline">Helsinki</Link>
              <Link to="/palvelualueet/espoo" className="btn-outline">Espoo</Link>
              <Link to="/palvelualueet/vantaa" className="btn-outline">Vantaa</Link>
            </div>
          </div>
          <div className="rounded-3xl bg-orange-50 p-7 sm:p-8">
            <span className="eyebrow-orange">Yksityisyys</span>
            <h2 className="mt-4 font-display text-2xl font-bold text-navy-950">Kuva pysyy selaimessa suunnittelun aikana</h2>
            <p className="mt-3 leading-relaxed text-navy-700">Tässä kevyessä versiossa ladattua kuvaa käytetään paikallisesti selaimen esikatseluun. Tarjouspyyntöön liitetään valitut värit ja yhteystiedot, ei itse kuvaa. Jos kuvien tallennus tai AI-käsittely lisätään myöhemmin, siitä kerrotaan käyttäjälle erikseen ennen käsittelyä.</p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy-50/60">
        <div className="container-base max-w-4xl">
          <div className="text-center"><span className="eyebrow-orange">Usein kysyttyä</span><h2 className="mt-4 font-display text-3xl font-bold text-navy-950">Maalisuunnittelija ja huoneen värien suunnittelu</h2></div>
          <div className="mt-8 space-y-3">{faq.map((item) => <details key={item.q} className="card p-5"><summary className="cursor-pointer font-semibold text-navy-950">{item.q}</summary><p className="mt-3 text-sm leading-relaxed text-navy-600">{item.a}</p></details>)}</div>
          <div className="mt-10 rounded-3xl bg-navy-950 p-8 text-center text-white sm:p-10">
            <h2 className="font-display text-3xl font-bold">Valmis kokeilemaan?</h2>
            <p className="mx-auto mt-3 max-w-xl text-navy-200">Lataa kuva, valitse värit ja katso uusi ilme. Rekisteröitymistä ei tarvita.</p>
            <button type="button" onClick={() => setPlannerOpen(true)} className="btn-primary mt-6">Kokeile maalisuunnittelijaa <ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>

      <SimplePaintPlannerModal open={plannerOpen} onClose={() => setPlannerOpen(false)} />
    </>
  );
}
