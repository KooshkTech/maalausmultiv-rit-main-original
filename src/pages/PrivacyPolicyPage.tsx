import { Seo } from '@/components/Seo';
import { company } from '@/data/company';
import { trackEmailClick, trackPhoneClick } from '@/lib/analytics';

export function PrivacyPolicyPage() {
  return (
    <>
      <Seo
        title="Tietosuojaseloste"
        description="Maalaus Multivärin tietosuojaseloste: mitä henkilötietoja käsittelemme, mihin tarkoitukseen ja mitkä oikeudet sinulla on rekisteröitynä."
        path="/tietosuojaseloste"
      />
      <section className="bg-navy-50/60 px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">Tietosuojaseloste</h1>
          <p className="mt-3 text-sm text-navy-500">Päivitetty viimeksi: 25.8.2026</p>

          <div className="prose prose-navy mt-8 max-w-none space-y-8 text-navy-700">
            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">1. Rekisterinpitäjä</h2>
              <p className="mt-2 leading-relaxed">
                {company.name}<br />{company.city}, {company.region}, {company.country}<br />
                Sähköposti: <a href={company.emailHref} onClick={() => trackEmailClick('privacy_policy_registrar')} className="text-orange-600 underline">{company.email}</a><br />
                Puhelin: <a href={company.phoneHref} onClick={() => trackPhoneClick('privacy_policy')} className="text-orange-600 underline">{company.phone}</a>
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">2. Käsiteltävät henkilötiedot</h2>
              <p className="mt-2 leading-relaxed">Kun otat meihin yhteyttä tarjouspyyntö- tai yhteydenottolomakkeella, voimme käsitellä nimeä, sähköpostiosoitetta, puhelinnumeroa, osoitetta (jos annettu), lomakkeeseen kirjoittamaasi viestiä ja projektin tietoja. Verkkosivuston käytöstä voidaan kerätä teknisiä tietoja evästeiden avulla, mikäli olet antanut tähän suostumuksesi.</p>
              <p className="mt-3 leading-relaxed">Kun käytät Maalaus Multivärin maalaussuunnittelijaa, käsittelemme lisäksi käyttäjätilin tunnistetietoja, tallennettuja maalaussuunnitelmia, valittuja pintoja ja värejä, mitta- ja kuntotietoja, alustavia hinta-arvioita sekä käyttäjän itse lataamia projektikuvia. Älä lataa sovellukseen kuvia tai tietoja, joiden käsittelyyn sinulla ei ole oikeutta.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">3. Käsittelyn tarkoitus ja peruste</h2>
              <p className="mt-2 leading-relaxed">Tietoja käsitellään tarjouspyyntöihin vastaamiseksi, asiakassuhteen hoitamiseksi, käyttäjätilin ja tallennettujen suunnitelmien tarjoamiseksi, hinta-arvioiden muodostamiseksi sekä palveluidemme kehittämiseksi. Käsittelyn peruste voi olla sopimusta edeltävien toimenpiteiden toteuttaminen käyttäjän pyynnöstä, oikeutettu etu asiakaspalvelussa tai suostumus silloin, kun laki sitä edellyttää.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">4. Tietojen säilytys, palveluntarjoajat ja luovutus</h2>
              <p className="mt-2 leading-relaxed">Emme myy henkilötietojasi kolmansille osapuolille markkinointitarkoituksiin. Tietoja voidaan käsitellä teknisten palveluntarjoajien, kuten verkkopalvelun, sähköpostin, analytiikan, tunnistautumisen, tietokannan ja tiedostotallennuksen palveluntarjoajien toimesta vain palvelun toteuttamiseksi tarvittavassa laajuudessa.</p>
              <p className="mt-3 leading-relaxed">Maalaussuunnittelijan käyttäjätilit, projektit ja kuvat tallennetaan tuotantoympäristössä suojattuun tietokanta- ja tiedostopalveluun. Projektikuvat on tarkoitettu vain kirjautuneen käyttäjän ja palvelun toteuttamisen kannalta tarpeellisten käsittelijöiden käyttöön. Säilytysajat määritetään käyttötarkoituksen, asiakassuhteen ja lakisääteisten velvoitteiden perusteella; tarpeettomat tiedot poistetaan.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">5. Tietoturva</h2>
              <p className="mt-2 leading-relaxed">Käyttäjätilin salasanaa ei tallenneta Maalaus Multivärin sovelluskoodiin tai omaan tietokantatauluun, vaan tunnistautumisesta vastaa siihen tarkoitettu palvelu. Projektit on rajattu käyttäjäkohtaisilla käyttöoikeussäännöillä, ja projektikuvien tallennustila on yksityinen. Käyttäjän tulee pitää omat kirjautumistietonsa salassa ja ilmoittaa epäillystä väärinkäytöstä viipymättä.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">6. Rekisteröidyn oikeudet</h2>
              <p className="mt-2 leading-relaxed">Sinulla on oikeus tarkastaa itseäsi koskevat tiedot, pyytää niiden oikaisua tai poistoa sekä vastustaa tai rajoittaa käsittelyä soveltuvan lainsäädännön mukaisesti. Voit käyttää oikeuksiasi ottamalla yhteyttä osoitteeseen <a href={company.emailHref} onClick={() => trackEmailClick('privacy_policy_rights_request')} className="text-orange-600 underline">{company.email}</a>. Sinulla on myös oikeus tehdä valitus tietosuojavaltuutetun toimistolle.</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">7. Evästeet</h2>
              <p className="mt-2 leading-relaxed">Sivustolla käytettävistä evästeistä kerrotaan tarkemmin <a href="/evastekaytanto" className="text-orange-600 underline">evästekäytännössämme</a>. Asiakassovellus voi käyttää välttämätöntä selaintallennusta kirjautumisistunnon ylläpitämiseksi.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
