import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { getService } from '@/data/services';
import { getCity } from '@/data/cities';

const supportedServices = new Set(['toimistosiivous', 'yrityssiivous', 'muuttosiivous']);
const supportedCities = new Set(['helsinki', 'espoo', 'vantaa']);

const cityContext: Record<string, { intro: string; areas: string; needs: string }> = {
  helsinki: {
    intro: 'Helsingissä siivouskohteet vaihtelevat keskustan toimistoista asuinalueiden koteihin ja eri kokoisiin toimitiloihin. Työ suunnitellaan tilan käytön, kulutuksen ja asiakkaan aikataulun perusteella.',
    areas: 'Palvelemme Helsingissä kohteen mukaan eri kaupunginosissa ja sovitamme käyntiajat tilan käyttöön.',
    needs: 'Keskustan ja tiiviiden toimitilojen kohdalla korostuvat sujuva aikataulutus, kulkuyhteydet ja mahdollisuus toteuttaa siivous ilman tarpeetonta häiriötä.',
  },
  espoo: {
    intro: 'Espoossa palvelemme sekä yrityksiä että kotitalouksia erilaisissa kohteissa toimistoista asuntoihin ja muihin toimitiloihin. Siivouksen sisältö määritellään aina todellisen tarpeen mukaan.',
    areas: 'Espoon laaja alue ja vaihteleva rakennuskanta huomioidaan työn suunnittelussa sekä kohdekohtaisessa tarjouksessa.',
    needs: 'Toimitilojen koko, käyttöaste ja siivouksen toistuvuus vaikuttavat siihen, millainen palvelumalli on asiakkaalle järkevin.',
  },
  vantaa: {
    intro: 'Vantaalla siivouspalvelun tarve vaihtelee pienistä toimistoista laajempiin yritystiloihin ja kotikohteisiin. Paikallinen palvelu helpottaa kohdekäyntien ja säännöllisten siivouskertojen suunnittelua.',
    areas: 'Palvelemme Vantaalla kohteen mukaan esimerkiksi Tikkurilan, Myyrmäen, Aviapoliksen ja muiden alueiden yrityksiä ja kotitalouksia.',
    needs: 'Vantaalla yrityssiivouksessa korostuvat usein joustavat työajat, tasainen työnjälki ja selkeä palvelusisältö, jotta siivous tukee tilojen päivittäistä käyttöä.',
  },
};

const serviceIntent: Record<string, { keyword: string; secondary: string; lead: string; tasks: string[] }> = {
  toimistosiivous: {
    keyword: 'Toimistosiivous',
    secondary: 'yrityssiivous ja toimiston perussiivous',
    lead: 'toimistoihin, työpisteisiin, neuvottelutiloihin, keittiöihin ja saniteettitiloihin',
    tasks: ['Työpisteiden ja yhteisten tilojen siivous', 'Lattioiden ja kosketuspintojen puhdistus', 'Keittiön ja WC-tilojen siivous', 'Sovittu ylläpito- tai perussiivous'],
  },
  yrityssiivous: {
    keyword: 'Yrityssiivous',
    secondary: 'toimistosiivous ja toimitilasiivous',
    lead: 'yritysten toimistoihin, asiakastiloihin ja muihin soveltuviin toimitiloihin',
    tasks: ['Säännöllinen tai kertaluonteinen siivous', 'Yhteiset tilat ja työympäristöt', 'Saniteetti- ja taukotilat', 'Palvelusisältö yrityksen tarpeen mukaan'],
  },
  muuttosiivous: {
    keyword: 'Muuttosiivous',
    secondary: 'loppusiivous ja asunnon perusteellinen siivous',
    lead: 'asuntoihin ja muihin soveltuviin muuttokohteisiin',
    tasks: ['Pintojen perusteellinen puhdistus', 'Keittiön ja saniteettitilojen siivous', 'Lattiat ja muut sovitut pinnat', 'Kohdekohtainen loppusiivouksen sisältö'],
  },
};

export function CleaningLocationSeoPage() {
  const { serviceSlug = '', citySlug = '' } = useParams<{ serviceSlug: string; citySlug: string }>();
  const service = getService(serviceSlug);
  const city = getCity(citySlug);
  if (!service || service.category !== 'cleaning' || !city || !supportedServices.has(serviceSlug) || !supportedCities.has(citySlug)) return <Navigate to="/404" replace />;

  const cityCopy = cityContext[citySlug];
  const intent = serviceIntent[serviceSlug];
  const path = `/palvelut/${serviceSlug}/${citySlug}`;
  const title = `${intent.keyword} ${city.name} – luotettava siivouspalvelu`;
  const description = `${intent.keyword} ${city.locative} yrityksille ja asiakkaille tarpeen mukaan. Selkeä palvelusisältö, joustava toteutus ja maksuton tarjous. Pyydä arvio Maalaus Multiväriltä.`;
  const faq = [
    { q: `Mitä ${intent.keyword.toLowerCase()} ${city.locative} maksaa?`, a: 'Hinta riippuu tilan koosta, siivouksen sisällöstä, nykyisestä kunnosta ja toistuvuudesta. Pyydä kohdekohtainen tarjous, jotta arvio perustuu todellisiin tietoihin.' },
    { q: `Mitä ${intent.keyword.toLowerCase()} ${city.locative} sisältää?`, a: `Palvelu sovitaan kohteen mukaan. Työ voi sisältää esimerkiksi ${intent.tasks.slice(0, 3).join(', ').toLowerCase()} sekä muut etukäteen sovitut tehtävät.` },
    { q: 'Voiko siivouksen ajoittaa työajan ulkopuolelle?', a: 'Mahdollinen ajankohta sovitaan kohteen, palvelun ja saatavuuden mukaan. Kerro tarjouspyynnössä toivottu aikataulu.' },
    { q: 'Mitä tietoja tarjouspyyntöön kannattaa lisätä?', a: 'Kerro tilan tyyppi ja koko, tärkeimmät tehtävät, toistuvuus, toivottu ajankohta sekä mahdolliset erityiskohdat. Näin tarjous voidaan valmistella todellisten tietojen perusteella.' },
  ];

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={path}
        breadcrumbs={[{ name: 'Etusivu', path: '/' }, { name: 'Siivouspalvelut', path: '/palvelut/siivous' }, { name: service.title, path: `/palvelut/${service.slug}` }, { name: city.name, path }]}
        faqSchema={faq}
        serviceSchema={{ name: `${intent.keyword} ${city.name}`, description, areaServed: city.name }}
      />

      <main>
        <section className="bg-navy-950 px-5 py-14 text-white sm:py-20">
          <div className="container-base max-w-5xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-300"><MapPin className="size-4" />{city.name}, Uusimaa</div>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{intent.keyword} {city.locative} – luotettava siivouspalvelu</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-navy-100">Tarjoamme {intent.keyword.toLowerCase()}a {city.locative} {intent.lead}. Sovimme työn sisällön, aikataulun ja toistuvuuden kohteen todellisen tarpeen mukaan.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Link to="/yhteystiedot" className="btn-primary">Pyydä tarjous <ArrowRight className="size-4" /></Link><Link to="/palvelut/siivous" className="btn-outline border-white/20 text-white hover:bg-white/10">Kaikki siivouspalvelut</Link></div>
          </div>
        </section>

        <section className="section-pad bg-white">
          <div className="container-base grid gap-10 lg:grid-cols-[1.1fr_.9fr]">
            <article>
              <h2 className="font-display text-3xl font-bold text-navy-950">{intent.keyword} {city.locative} yrityksesi tai kohteesi tarpeiden mukaan</h2>
              <p className="mt-4 leading-7 text-navy-700">{cityCopy.intro} {cityCopy.needs}</p>
              <p className="mt-4 leading-7 text-navy-700">Hyvä siivouspalvelu ei tarkoita mahdollisimman pitkää tehtävälistaa, vaan oikein mitoitettua palvelua. Ennen tarjousta on hyödyllistä tietää tilan koko, käyttö, tärkeimmät siivottavat alueet, toivottu toistuvuus ja mahdolliset erityistarpeet. Näin {intent.keyword.toLowerCase()} {city.locative} voidaan suunnitella ilman tarpeettomia oletuksia.</p>

              <h2 className="mt-9 font-display text-3xl font-bold text-navy-950">Mitä palveluun voidaan sisällyttää?</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">{intent.tasks.map((task) => <div key={task} className="flex gap-3 rounded-2xl bg-navy-50 p-4 text-sm font-semibold text-navy-800"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-orange-500" />{task}</div>)}</div>

              <h2 className="mt-9 font-display text-3xl font-bold text-navy-950">Luotettavuus, työn laatu ja selkeä hinnoittelu</h2>
              <p className="mt-4 leading-7 text-navy-700">Yritys- ja toimistosiivouksessa asiakkaan suurimpia huolia ovat yleensä työn tasaisuus, sovittujen tehtävien toteutuminen, aikataulujen pitävyys ja se, että hinta vastaa työn todellista laajuutta. Siksi emme lupaa yhdellä sivulla samaa hintaa kaikille kohteille. Tarjous muodostetaan tilan, tehtävien ja toistuvuuden perusteella.</p>
              <p className="mt-4 leading-7 text-navy-700">{cityCopy.areas} Jos tarvitset {intent.secondary}a, kerro tarjouspyynnössä mahdollisimman selkeästi tilojen käyttötarkoitus ja nykyinen siivoustarve. Se auttaa arvioimaan palvelun järkevästi jo ennen mahdollista kohdekäyntiä.</p>

              <h2 className="mt-9 font-display text-3xl font-bold text-navy-950">Valmistele selkeä tarjouspyyntö</h2>
              <p className="mt-4 leading-7 text-navy-700">Kirjaa tarjouspyyntöön tilan tyyppi, arvioitu pinta-ala, tärkeimmät siivoustehtävät, toistuvuus ja mahdolliset erityiskohdat. Tiedot eivät korvaa kohdekohtaista arviota, mutta ne auttavat mitoittamaan palvelun järkevästi.</p>
            </article>

            <aside className="space-y-5">
              <div className="card p-6"><ShieldCheck className="size-8 text-orange-600" /><h2 className="mt-4 font-display text-2xl font-bold text-navy-950">Miksi selkeä tarjouspyyntö kannattaa?</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-navy-700"><li>• Vähemmän arvailua työn laajuudesta</li><li>• Helpompi vertailla sovittua palvelusisältöä</li><li>• Toistuvuus ja aikataulu voidaan huomioida alusta asti</li><li>• Mahdolliset erityiskohdat voidaan kuvata etukäteen</li></ul></div>
              <div className="rounded-3xl bg-orange-50 p-6"><h2 className="font-display text-2xl font-bold text-navy-950">Aloita ilman hinnan arvaamista</h2><p className="mt-3 text-sm leading-6 text-navy-700">Kerro kohteen tiedot tarjouspyynnössä. Vahvistamme hinnan palvelun sisällön, laajuuden ja toistuvuuden perusteella.</p><Link to="/yhteystiedot" className="btn-primary mt-5">Pyydä tarjous <ArrowRight className="size-4" /></Link></div>
            </aside>
          </div>
        </section>

        <section className="section-pad bg-navy-50/60"><div className="container-base max-w-4xl"><h2 className="text-center font-display text-3xl font-bold text-navy-950">Usein kysyttyä – {intent.keyword.toLowerCase()} {city.name}</h2><div className="mt-8 space-y-3">{faq.map((item) => <details key={item.q} className="card p-5"><summary className="cursor-pointer font-semibold text-navy-950">{item.q}</summary><p className="mt-3 text-sm leading-7 text-navy-600">{item.a}</p></details>)}</div></div></section>
      </main>
    </>
  );
}
