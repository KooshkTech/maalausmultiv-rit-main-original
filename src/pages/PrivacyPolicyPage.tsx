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
          <h1 className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Tietosuojaseloste
          </h1>
          <p className="mt-3 text-sm text-navy-500">Päivitetty viimeksi: 14.8.2026</p>

          <div className="prose prose-navy mt-8 max-w-none space-y-8 text-navy-700">
            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">1. Rekisterinpitäjä</h2>
              <p className="mt-2 leading-relaxed">
                {company.name}
                <br />
                {company.city}, {company.region}, {company.country}
                <br />
                Sähköposti:{' '}
                <a href={company.emailHref} onClick={() => trackEmailClick('privacy_policy_registrar')} className="text-orange-600 underline">
                  {company.email}
                </a>
                <br />
                Puhelin:{' '}
                <a href={company.phoneHref} onClick={() => trackPhoneClick('privacy_policy')} className="text-orange-600 underline">
                  {company.phone}
                </a>
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">
                2. Käsiteltävät henkilötiedot
              </h2>
              <p className="mt-2 leading-relaxed">
                Kun otat meihin yhteyttä tarjouspyyntö- tai yhteydenottolomakkeella, käsittelemme
                seuraavia tietoja: nimi, sähköpostiosoite, puhelinnumero, osoite (jos annettu),
                sekä lomakkeeseen kirjoittamasi viesti ja projektin tiedot. Verkkosivuston
                käytöstä voidaan kerätä myös teknisiä tietoja (esim. IP-osoite, selain, käytetyt
                sivut) evästeiden avulla, mikäli olet antanut tähän suostumuksesi.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">
                3. Käsittelyn tarkoitus ja peruste
              </h2>
              <p className="mt-2 leading-relaxed">
                Tietoja käsitellään tarjouspyyntöihin vastaamiseksi, asiakassuhteen hoitamiseksi
                ja palveluidemme kehittämiseksi. Käsittelyn peruste on oikeutettu etu
                (yhteydenottoon vastaaminen) tai suostumus (analytiikka- ja
                markkinointievästeet).
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">
                4. Tietojen säilytys ja luovutus
              </h2>
              <p className="mt-2 leading-relaxed">
                Emme myy tai luovuta henkilötietojasi kolmansille osapuolille markkinointi­
                tarkoituksiin. Tietoja voidaan käsitellä palveluntarjoajiemme (esim.
                sähköpostipalvelu, analytiikkatyökalut) toimesta niiden tarjoamien palveluiden
                edellyttämässä laajuudessa. Säilytämme yhteydenottolomakkeen tiedot niin kauan
                kuin se on asiakassuhteen hoitamisen kannalta tarpeellista.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">
                5. Rekisteröidyn oikeudet
              </h2>
              <p className="mt-2 leading-relaxed">
                Sinulla on oikeus tarkastaa itseäsi koskevat tiedot, pyytää niiden oikaisua tai
                poistoa, sekä vastustaa tai rajoittaa käsittelyä soveltuvan lainsäädännön
                mukaisesti. Voit käyttää oikeuksiasi ottamalla yhteyttä osoitteeseen{' '}
                <a href={company.emailHref} onClick={() => trackEmailClick('privacy_policy_rights_request')} className="text-orange-600 underline">
                  {company.email}
                </a>
                . Sinulla on myös oikeus tehdä valitus tietosuojavaltuutetun toimistolle.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">6. Evästeet</h2>
              <p className="mt-2 leading-relaxed">
                Sivustolla käytettävistä evästeistä kerrotaan tarkemmin{' '}
                <a href="/evastekaytanto" className="text-orange-600 underline">
                  evästekäytännössämme
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
