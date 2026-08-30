import { Link } from 'react-router-dom';
import { ArrowRight, Brush, CheckCircle2, PaintRoller, ShieldCheck, Sparkles } from 'lucide-react';
import { Seo } from '@/components/Seo';

const paintFaq = [
  { q: 'Mikä VäriKamu on?', a: 'VäriKamu on Maalaus Multivärin visuaalinen maalisuunnittelija. Ota tai lataa kuva, valitse väri ja merkitse siveltimellä tai telalla juuri se pinta tai esineen osa, jonka haluat maalata.' },
  { q: 'Voinko suunnitella muutakin kuin seinien maalausta?', a: 'Kyllä. VäriKamu on tarkoitettu kaikille kuvassa näkyville maalattaville pinnoille, kuten seinille, katoille, oville, listoille, ikkuna- ja ovikehyksille, kaapeille, puuosille, kalusteille, kaiteille, pattereille ja muille maalaukseen soveltuville pinnoille.' },
  { q: 'Miten älykäs täyttö toimii?', a: 'Tavoitteena on, että sinun tarvitsee merkitä vain osa maalattavasta pinnasta. Älykäs täyttö auttaa täydentämään valinnan pinnan todellisiin reunoihin ja suojaamaan viereisiä osia, kuten lasia, kangasta ja muita pintoja. Valintaa voi korjata lisäämällä tai poistamalla aluetta.' },
  { q: 'Voiko lapsi suunnitella oman huoneensa?', a: 'Kyllä. VäriKamun helppo käyttö sopii myös perheen yhteiseen huonesuunnitteluun. Lapsi voi kokeilla värejä kuvassa, mutta yhteystiedot, tallennus ja tarjouspyyntö hoidetaan aikuisen kanssa.' },
  { q: 'Voinko ladata ja lähettää suunnitelman?', a: 'Kyllä. Valmis visualisointi voidaan ladata, ja tavoitteena on lähettää tarjouspyynnön mukana alkuperäinen kuva, valmis suunnitelma, valitut värit ja maalattavat kohteet.' },
  { q: 'Onko VäriKamun hinta-arvio lopullinen tarjous?', a: 'Ei. Mahdollinen hinta-arvio on alustava. Lopullinen tarjous vahvistetaan kohteen mittojen, pintojen kunnon, pohjatöiden ja työn todellisen laajuuden perusteella.' },
];

const cleaningFaq = [
  { q: 'Mikä SiivousKamu on?', a: 'SiivousKamu on visuaalinen siivouksen suunnittelutyökalu. Kuvasta voidaan merkitä puhdistettavia pintoja ja koota työn sisältö ennen tarjouspyyntöä.' },
  { q: 'Mitä pintoja voin merkitä?', a: 'Työkalu on tarkoitettu esimerkiksi ikkunoille ja lasipinnoille, lattioille, kaappien pinnoille, keittiöön, kylpyhuoneeseen, peileille ja muille puhdistettaville pinnoille.' },
  { q: 'Miten älykäs täyttö auttaa siivouksessa?', a: 'Tavoitteena on, että pieni pyyhkäisy toimii valinnan ohjeena: työkalu auttaa tunnistamaan tarkoitetun pinnan ja täydentämään valinnan sen reunoihin ilman, että viereisiä pintoja muutetaan.' },
  { q: 'Onko SiivousKamun hinta-arvio lopullinen tarjous?', a: 'Ei. Arvio on suuntaa-antava ja lopullinen hinta riippuu kohteen koosta, kunnosta, työn sisällöstä ja toistuvuudesta.' },
];

function Landing({ kind }: { kind: 'paint' | 'cleaning' }) {
  const paint = kind === 'paint';
  const path = paint ? '/varikamu' : '/siivouskamu';
  const appPath = paint ? '/app/varikamu' : '/app/siivouskamu';
  const title = paint ? 'VäriKamu – kokeile värejä ja suunnittele maalattavat pinnat' : 'SiivousKamu – merkitse puhdistettavat pinnat ja suunnittele siivous';
  const description = paint
    ? 'Kokeile värejä omassa kuvassasi ja suunnittele seinien, ovien, ikkunoiden, kalusteiden, puuosien ja muiden maalattavien pintojen uudistus. VäriKamu auttaa ennen maalaustarjousta Helsingissä, Espoossa, Vantaalla ja Uudellamaalla.'
    : 'Merkitse kuvasta puhdistettavat pinnat, vertaile ennen ja jälkeen -näkymää ja kokoa siivoustarve ennen tarjouspyyntöä Uudellamaalla.';
  const faq = paint ? paintFaq : cleaningFaq;

  const steps = paint
    ? ['Ota tai lataa kuva omasta tilasta tai kohteesta', 'Valitse väri ja maalaa vähän sormella, siveltimellä tai telalla', 'Älykäs täyttö auttaa viimeistelemään tarkoitetun maalattavan pinnan', 'Korjaa tarvittaessa Lisää alue / Poista alue -toiminnoilla', 'Vertaa ennen ja jälkeen, lataa suunnitelma ja pyydä tarjous']
    : ['Ota tai lataa kuva siivottavasta kohteesta', 'Pyyhkäise vähän sitä pintaa, jonka haluat puhdistettavan', 'Älykäs täyttö auttaa täydentämään tarkoitetun puhdistettavan pinnan', 'Korjaa valintaa tarvittaessa lisäämällä tai poistamalla aluetta', 'Vertaa ennen ja jälkeen, lataa suunnitelma ja pyydä tarjous'];

  return (
    <>
      <Seo title={title} description={description} path={path} breadcrumbs={[{ name: 'Etusivu', path: '/' }, { name: paint ? 'VäriKamu' : 'SiivousKamu', path }]} faqSchema={faq} serviceSchema={{ name: paint ? 'VäriKamu maalisuunnittelija' : 'SiivousKamu siivoussuunnittelija', description, areaServed: 'Helsinki, Espoo, Vantaa ja Uusimaa' }} />
      <main className="pb-24 sm:pb-0">
        <section className="bg-gradient-to-b from-navy-950 to-navy-900 px-5 py-12 text-white sm:py-24">
          <div className="container-base grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">Maalaus Multiväri Kamu Studio</p>
              <h1 className="mt-4 max-w-4xl font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-6xl">{paint ? 'Maalaa kuvassa mitä haluat – suunnittele ennen oikeaa maalausta' : 'Näytä kuvasta, mitä haluat puhdistettavan'}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-navy-100">{description}</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link to={appPath} className="btn-primary">{paint ? 'Kokeile VäriKamua' : 'Kokeile SiivousKamua'} <ArrowRight className="size-5" /></Link><Link to={paint ? '/palvelut/sisamaalaus' : '/palvelut/siivous'} className="btn-ghost-light">Tutustu palveluihin</Link></div>
              <p className="mt-3 text-sm text-navy-300">Suunnittelutyökalu on tehty asiakkaan omaksi luonnostelutilaksi. Lopullinen tarjous ja työn toteutus vahvistetaan aina erikseen.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300">{paint ? <PaintRoller className="size-7" /> : <Sparkles className="size-7" />}</div>
              <h2 className="mt-5 font-display text-2xl font-bold">{paint ? 'Yksi työkalu kaikille maalattaville pinnoille' : 'Helppo tapa näyttää siivoustarve'}</h2>
              <div className="mt-5 space-y-3 text-sm text-navy-100">{steps.map((item) => <div key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-orange-300" /><span>{item}</span></div>)}</div>
            </div>
          </div>
        </section>

        {paint && <section className="section-pad bg-white"><div className="container-base"><span className="eyebrow-orange">Maalaa muutakin kuin seinät</span><h2 className="mt-4 max-w-4xl font-display text-3xl font-bold text-navy-950">Seinät, katot, ovet, ikkunakehykset, kalusteet, puuosat ja muut maalattavat kohteet</h2><p className="mt-4 max-w-4xl leading-7 text-navy-600">VäriKamun idea on seurata asiakkaan tarkoitusta, ei pakottaa valitsemaan vain muutamaa ennalta määritettyä pintaa. Jos merkitset ikkunan karmia, lasi pitää jättää rauhaan. Jos merkitset puista tuolia, kangasosa pitää suojata. Jos merkitset lasiovea, väri kuuluu kehykseen eikä lasiin. Siveltimen tai telan jälki toimii ohjeena, jota älykäs pintavalinta voi käyttää todellisten rajojen löytämiseen.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{['Seinät ja katot', 'Ovet, karmit ja listat', 'Ikkunakehykset ja puuosat', 'Kaapit, kalusteet ja rakenteet'].map((item) => <div key={item} className="card p-5"><Brush className="size-6 text-orange-600" /><h3 className="mt-3 font-bold text-navy-950">{item}</h3></div>)}</div></div></section>}

        {paint && <section className="section-pad bg-orange-50"><div className="container-base grid gap-8 lg:grid-cols-2 lg:items-center"><div><span className="eyebrow-orange">Perheen yhteinen suunnittelu</span><h2 className="mt-4 font-display text-3xl font-bold text-navy-950">Anna lapsen kokeilla oman huoneensa värejä</h2><p className="mt-4 leading-7 text-navy-700">Lapsi voi kokeilla kuvassa lempivärejä seinään, oveen, sopivaan kalusteeseen tai muuhun maalattavaan pintaan. Suunnittelu pidetään hauskana ja helppona, mutta yhteystiedot, tallennus ja tarjouspyyntö tehdään aikuisen kanssa.</p></div><div className="card p-6"><h3 className="font-display text-xl font-bold text-navy-950">🎨 Valitse väri → 🖌️ maalaa vähän → ✨ viimeistele pinta → 👨‍👩‍👧 näytä vanhemmalle</h3><p className="mt-3 text-sm leading-6 text-navy-600">Tavoite ei ole kerätä lapselta henkilötietoja, vaan tehdä värien kokeilemisesta perheelle helppo tapa suunnitella oikeaa maalausprojektia.</p></div></div></section>}

        <section className="section-pad bg-navy-50/60"><div className="container-base max-w-4xl"><div className="text-center"><span className="eyebrow-orange">Usein kysyttyä</span><h2 className="mt-4 font-display text-3xl font-bold text-navy-950">{paint ? 'VäriKamu ja maalisuunnittelu' : 'SiivousKamu ja siivouksen suunnittelu'}</h2></div><div className="mt-8 space-y-3">{faq.map((item) => <details key={item.q} className="card p-5"><summary className="cursor-pointer font-semibold text-navy-950">{item.q}</summary><p className="mt-3 text-sm leading-7 text-navy-600">{item.a}</p></details>)}</div></div></section>

        <section className="section-pad bg-white"><div className="container-base grid gap-10 lg:grid-cols-2"><div><ShieldCheck className="size-8 text-orange-600" /><h2 className="mt-4 font-display text-2xl font-bold text-navy-950">Suunnitelma muuttuu hyödylliseksi tarjouspyynnöksi</h2><p className="mt-3 leading-7 text-navy-600">Valmis suunnitelma auttaa näyttämään Maalaus Multivärille mahdollisimman selkeästi, mitä asiakas haluaa. Visualisointi ja mahdollinen hinta-arvio ovat suuntaa-antavia; lopullinen työ vahvistetaan kohteen todellisten tietojen perusteella.</p></div><div className="rounded-3xl bg-navy-950 p-8 text-white"><h2 className="font-display text-3xl font-bold">{paint ? 'Suunnittele. Kokeile. Näytä. Pyydä tarjous.' : 'Merkitse. Vertaa. Lähetä tarjouspyyntö.'}</h2><p className="mt-3 text-navy-200">Aloita omalla kuvalla ja tee suunnitelmasta tarjouspyynnön visuaalinen ohje.</p><div className="mt-6 flex flex-wrap gap-3"><Link to={appPath} className="btn-primary">Avaa {paint ? 'VäriKamu' : 'SiivousKamu'} <ArrowRight className="size-4" /></Link><Link to="/yhteystiedot" className="btn-ghost-light">Pyydä tarjous</Link></div></div></div></section>
      </main>
    </>
  );
}

export function VarikamuLanding() { return <Landing kind="paint" />; }
export function SiivouskamuLanding() { return <Landing kind="cleaning" />; }
export function StudioIcon() { return <Brush className="size-5" />; }
