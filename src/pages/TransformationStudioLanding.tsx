import { Link } from 'react-router-dom';
import { ArrowRight, Brush, CheckCircle2, PaintRoller, ShieldCheck, Sparkles } from 'lucide-react';
import { Seo } from '@/components/Seo';

const paintFaq = [
  { q: 'Mikä VäriKamu on?', a: 'VäriKamu on Maalaus Multivärin maalisuunnittelija, jolla voit kokeilla värejä omassa huonekuvassa ennen tarjouspyyntöä.' },
  { q: 'Voinko suunnitella seinän värin omalla kuvalla?', a: 'Kyllä. Kirjautumisen jälkeen voit ladata JPG-, PNG- tai WebP-kuvan ja käyttää maalaustyökaluja suunnitteluun.' },
  { q: 'Onko VäriKamun esikatselu sitova?', a: 'Ei. Näytön, valaistuksen ja pinnan ominaisuudet vaikuttavat värin kokemiseen. Lopullinen sävy kannattaa varmistaa fyysisellä värimallilla.' },
  { q: 'Voinko pyytää tarjouksen suunnitelman jälkeen?', a: 'Kyllä. VäriKamu ohjaa valmiin suunnitelman jälkeen maalaustarjouksen pyytämiseen.' },
];

const cleaningFaq = [
  { q: 'Mikä SiivousKamu on?', a: 'SiivousKamu on siivouksen suunnittelutyökalu, jolla voit kuvata tilan, valita tehtävät ja jäsentää siivoustarpeen ennen tarjouspyyntöä.' },
  { q: 'Voinko käyttää SiivousKamua kotisiivoukseen ja yrityssiivoukseen?', a: 'Kyllä. Työkalu soveltuu esimerkiksi kotiin, WC- ja kylpyhuonetiloihin, keittiöön, toimistoon ja yritystilaan.' },
  { q: 'Onko SiivousKamun hinta-arvio lopullinen tarjous?', a: 'Ei. Arvio on suuntaa-antava ja lopullinen hinta riippuu kohteen koosta, kunnosta, työn sisällöstä ja toistuvuudesta.' },
  { q: 'Voinko lähettää siivoustarjouspyynnön työkalusta?', a: 'Kyllä. Suunnittelun jälkeen voit lähettää tarjouspyynnön Maalaus Multivärille.' },
];

function Landing({ kind }: { kind: 'paint' | 'cleaning' }) {
  const paint = kind === 'paint';
  const path = paint ? '/varikamu' : '/siivouskamu';
  const appPath = paint ? '/app/varikamu' : '/app/siivouskamu';
  const title = paint ? 'VäriKamu – maalisuunnittelija ja huoneen värisuunnittelu' : 'SiivousKamu – siivouksen suunnittelu ja alustava arvio';
  const description = paint
    ? 'Suunnittele seinän ja huoneen värit omalla kuvallasi. VäriKamu auttaa maalin värin suunnittelussa ennen maalaustarjousta Helsingissä, Espoossa, Vantaalla ja Uudellamaalla.'
    : 'Suunnittele kotisiivous tai yrityssiivous selkeästi. SiivousKamu auttaa valitsemaan tilat, tehtävät ja siivouksen tason ennen tarjouspyyntöä Uudellamaalla.';
  const faq = paint ? paintFaq : cleaningFaq;

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={path}
        breadcrumbs={[{ name: 'Etusivu', path: '/' }, { name: paint ? 'VäriKamu' : 'SiivousKamu', path }]}
        faqSchema={faq}
        serviceSchema={{ name: paint ? 'VäriKamu maalisuunnittelija' : 'SiivousKamu siivoussuunnittelija', description, areaServed: 'Helsinki, Espoo, Vantaa ja Uusimaa' }}
      />

      <main className="pb-24 sm:pb-0">
        <section className="bg-gradient-to-b from-navy-950 to-navy-900 px-5 py-12 text-white sm:py-24">
          <div className="container-base grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">Maalaus Multiväri Kamu Studio</p>
              <h1 className="mt-4 max-w-4xl font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-6xl">{paint ? 'VäriKamu – suunnittele huoneen värit omalla kuvallasi' : 'SiivousKamu – suunnittele siivous ennen tarjouspyyntöä'}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-navy-100">{description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={appPath} className="btn-primary">{paint ? 'Kokeile VäriKamua' : 'Kokeile SiivousKamua'} <ArrowRight className="size-5" /></Link>
                <Link to={paint ? '/palvelut/sisamaalaus' : '/palvelut/siivous'} className="btn-ghost-light">Tutustu palveluihin</Link>
              </div>
              <p className="mt-3 text-sm text-navy-300">Editorin käyttö vaatii sähköpostilla ja salasanalla kirjautumisen. Julkinen esittelysivu on avoin kaikille.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300">{paint ? <PaintRoller className="size-7" /> : <Sparkles className="size-7" />}</div>
              <h2 className="mt-5 font-display text-2xl font-bold">{paint ? 'Helppo oletuksena, tarkka tarvittaessa' : 'Selkeä siivoussuunnitelma ilman raskasta lomaketta'}</h2>
              <div className="mt-5 space-y-3 text-sm text-navy-100">
                {(paint
                  ? ['Simple Mode käynnistyy automaattisesti', 'Seinät, katto, ovet ja listat omiksi pinnoiksi', 'Advanced Mode avaa siveltimen, rullan, pyyhekumin, kerrokset ja läpinäkyvyyden', 'Ennen/jälkeen, vertailu, tallennus ja vienti']
                  : ['Valitse tila, tehtävät, pinta-ala ja siivouksen taso', 'Lisää halutessasi oma kuva ja merkinnät', 'Advanced Mode avaa annotointi- ja kerrostyökalut', 'Saat suuntaa-antavan arvion ja tarjouspolun']
                ).map((item) => <div key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-orange-300" /><span>{item}</span></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad bg-white">
          <div className="container-base grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="eyebrow-orange">{paint ? 'Maalin värin suunnittelu' : 'Siivouksen suunnittelu'}</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-navy-950">{paint ? 'Parempi päätös ennen kuin maalari aloittaa' : 'Kerro siivoustarve niin, että tarjous on helpompi arvioida'}</h2>
              <p className="mt-4 leading-7 text-navy-600">{paint
                ? 'Pelkkä värikartta ei aina kerro, miltä seinän väri näyttää omassa huoneessa. VäriKamu yhdistää huoneen värin suunnittelun, omat sävyt ja käsin tehtävän maalausesikatselun. Työkalu sopii sisämaalauksen suunnitteluun, kun haluat vertailla vaihtoehtoja ennen yhteydenottoa maalariin.'
                : 'Siivouspalvelun tarve voi olla hyvin erilainen pienessä kodissa, WC-tilassa, toimistossa tai yritystilassa. SiivousKamu auttaa kokoamaan tilat, tehtävät, toistuvuuden ja erityiskohdat yhteen ennen kuin pyydät tarjouksen.'}</p>
              <p className="mt-4 leading-7 text-navy-600">{paint
                ? 'Maalaus Multiväri palvelee Helsingissä, Espoossa, Vantaalla ja muualla Uudellamaalla kohteen mukaan. VäriKamu ei korvaa ammattilaisen kohdearviota, mutta auttaa valmistautumaan siihen huomattavasti paremmin.'
                : 'Työkalu sopii muun muassa kotisiivouksen, toimistosiivouksen, yrityssiivouksen, muuttosiivouksen sekä kylpyhuoneen ja keittiön siivouksen suunnitteluun silloin, kun palvelu vastaa todellista tarjontaamme.'}</p>
            </div>
            <div className="card p-6 sm:p-8">
              <ShieldCheck className="size-8 text-orange-600" />
              <h2 className="mt-4 font-display text-2xl font-bold text-navy-950">Turvallinen ja läpinäkyvä käyttö</h2>
              <p className="mt-3 leading-7 text-navy-600">Kirjautuminen käyttää projektin olemassa olevaa Supabase-tunnistautumista. Salasanoja ei tallenneta sovelluksen omaan koodiin eikä niitä käsitellä selväkielisinä. Hinta-arviot ja visualisoinnit ovat aina suuntaa-antavia.</p>
              <Link to="/tietosuojaseloste" className="mt-5 inline-flex font-semibold text-orange-600">Lue tietosuojasta <ArrowRight className="ml-2 size-4" /></Link>
            </div>
          </div>
        </section>

        <section className="section-pad bg-navy-50/60">
          <div className="container-base max-w-4xl">
            <div className="text-center"><span className="eyebrow-orange">Usein kysyttyä</span><h2 className="mt-4 font-display text-3xl font-bold text-navy-950">{paint ? 'VäriKamu ja maalisuunnittelu' : 'SiivousKamu ja siivouspalvelun suunnittelu'}</h2></div>
            <div className="mt-8 space-y-3">{faq.map((item) => <details key={item.q} className="card p-5"><summary className="cursor-pointer font-semibold text-navy-950">{item.q}</summary><p className="mt-3 text-sm leading-7 text-navy-600">{item.a}</p></details>)}</div>
          </div>
        </section>

        <section className="section-pad bg-white">
          <div className="container-base max-w-4xl rounded-3xl bg-navy-950 p-8 text-center text-white sm:p-12">
            <h2 className="font-display text-3xl font-bold">{paint ? 'Valmis suunnittelemaan värit?' : 'Valmis suunnittelemaan siivouksen?'}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-navy-200">Avaa työkalu, kirjaudu sisään ja tee suunnitelma rauhassa. Tarjouspyyntö on vasta viimeinen vaihe.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to={appPath} className="btn-primary">Avaa {paint ? 'VäriKamu' : 'SiivousKamu'} <ArrowRight className="size-4" /></Link>
              <Link to="/yhteystiedot" className="btn-ghost-light">Pyydä tarjous suoraan</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export function VarikamuLanding() { return <Landing kind="paint" />; }
export function SiivouskamuLanding() { return <Landing kind="cleaning" />; }

export function StudioIcon() { return <Brush className="size-5" />; }
