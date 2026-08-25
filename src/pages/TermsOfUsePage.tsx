import { Seo } from '@/components/Seo';
import { company } from '@/data/company';
import { trackEmailClick } from '@/lib/analytics';

export function TermsOfUsePage() {
  return (
    <>
      <Seo
        title="Käyttöehdot"
        description="Maalaus Multivärin verkkosivuston, maalaussuunnittelijan ja palveluiden yleiset käyttöehdot."
        path="/kayttoehdot"
      />
      <section className="bg-navy-50/60 px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">Käyttöehdot</h1>
          <p className="mt-3 text-sm text-navy-500">Päivitetty viimeksi: 25.8.2026</p>

          <div className="prose prose-navy mt-8 max-w-none space-y-8 text-navy-700">
            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">1. Yleistä</h2>
              <p className="mt-2 leading-relaxed">Näitä käyttöehtoja sovelletaan {company.name}n (&quot;{company.name}&quot;, &quot;me&quot;) verkkosivuston <span className="whitespace-nowrap">maalausmultivari.fi</span>, maalauslaskurin ja kirjautumista vaativan asiakassovelluksen käyttöön. Käyttämällä palvelua hyväksyt nämä ehdot.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">2. Sivuston sisältö ja suunnitteluvisualisointi</h2>
              <p className="mt-2 leading-relaxed">Sivuston tekstit, kuvat, värisuunnitelmat ja hinta-arviot ovat suunnittelua ja yleistä tiedonsaantia varten. Värisuunnittelijan näytöllä esittämä väri ei ole värintarkka lupaus lopullisesta maalipinnasta, koska näyttö, valaistus, valokuva, alusta, kiiltoaste ja maalituote vaikuttavat havaittuun sävyyn. Lopullinen väri tulee varmistaa soveltuvasta fyysisestä värimallista ja tarvittaessa koemaalauksella.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">3. Hinta-arviot</h2>
              <p className="mt-2 leading-relaxed">Maalauslaskurin antama hintahaarukka on alustava arvio eikä sitova tarjous. Arvio muodostuu käyttäjän antamista pinta-aloista, kappalemääristä, pintojen kunnosta, esikäsittelyistä, maalauskerroista, laatutasosta ja muista valinnoista. Lopulliseen hintaan voivat vaikuttaa esimerkiksi todelliset mitat, materiaalit, suojaustarve, telineet tai henkilönostimet, työskentelykorkeus, korjaukset, sääolosuhteet, saavutettavuus ja muut kohdekohtaiset tekijät.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">4. Käyttäjätili ja käyttäjän vastuu</h2>
              <p className="mt-2 leading-relaxed">Käyttäjä vastaa antamiensa tietojen oikeellisuudesta, käyttäjätilinsä tunnusten suojaamisesta sekä siitä, että hänellä on oikeus ladata sovellukseen toimittamansa kuvat ja muut aineistot. Palveluun ei tule ladata tarpeettomia henkilötietoja, arkaluonteista sisältöä tai kuvia tunnistettavista henkilöistä ilman asianmukaista oikeutta.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">5. Tarjouspyynnöt ja sopimukset</h2>
              <p className="mt-2 leading-relaxed">Verkkosivuston tai maalaussuunnittelijan kautta lähetetty tarjous- tai yhteydenottopyyntö ei ole sitova tilaus, vaan pyyntö saada tarkempi tarjous. Sitova sopimus syntyy vasta, kun osapuolet ovat hyväksyneet tarjouksen ehdot sovitulla tavalla.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">6. Soveltuvuus ja turvallisuus</h2>
              <p className="mt-2 leading-relaxed">Kaikkia pintoja tai materiaaleja ei voida maalata samalla menetelmällä. Erityisesti kattojen, märkätilojen, vanhojen pinnoitteiden ja vaurioituneiden pintojen soveltuvuus tulee tarkistaa ennen työn tilaamista. Sovellus ei korvaa ammattilaisen kuntotarkastusta, turvallisuussuunnittelua tai materiaalivalmistajan ohjeita.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">7. Vastuunrajoitus</h2>
              <p className="mt-2 leading-relaxed">Pyrimme pitämään sivuston ja sovelluksen toimivina ja tiedot ajantasaisina, mutta emme takaa keskeytyksetöntä toimintaa tai sitä, että automaattinen suunnittelu- tai hinta-arvio vastaisi täsmälleen kohteen lopullista toteutusta. Pakottavasta lainsäädännöstä johtuvia oikeuksia ei rajoiteta näillä ehdoilla.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">8. Tekijänoikeudet</h2>
              <p className="mt-2 leading-relaxed">Sivuston oma sisältö, ohjelmiston käyttöliittymä ja Maalaus Multivärin aineisto ovat {company.name}n tai sen yhteistyökumppaneiden omaisuutta. Käyttäjä säilyttää oikeutensa itse lataamaansa aineistoon ja antaa meille oikeuden käsitellä sitä vain palvelun ja siihen liittyvän tarjousprosessin toteuttamiseksi tietosuojaselosteen mukaisesti.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">9. Sovellettava laki</h2>
              <p className="mt-2 leading-relaxed">Näihin käyttöehtoihin sovelletaan Suomen lakia. Mahdolliset erimielisyydet pyritään ensisijaisesti ratkaisemaan neuvottelemalla.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">10. Yhteystiedot</h2>
              <p className="mt-2 leading-relaxed">Kysymyksissä käyttöehdoista ota yhteyttä: <a href={company.emailHref} onClick={() => trackEmailClick('terms_of_use')} className="text-orange-600 underline">{company.email}</a>.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
