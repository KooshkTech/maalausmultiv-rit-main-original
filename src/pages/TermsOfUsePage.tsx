import { Seo } from '@/components/Seo';
import { company } from '@/data/company';
import { trackEmailClick } from '@/lib/analytics';

export function TermsOfUsePage() {
  return (
    <>
      <Seo
        title="Käyttöehdot"
        description="Maalaus Multivärin verkkosivuston käyttöehdot sekä palveluiden yleiset toimitusehdot."
        path="/kayttoehdot"
      />
      <section className="bg-navy-50/60 px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Käyttöehdot
          </h1>
          <p className="mt-3 text-sm text-navy-500">Päivitetty viimeksi: 14.8.2026</p>

          <div className="prose prose-navy mt-8 max-w-none space-y-8 text-navy-700">
            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">1. Yleistä</h2>
              <p className="mt-2 leading-relaxed">
                Näitä käyttöehtoja sovelletaan {company.name}n (&quot;{company.name}&quot;,
                &quot;me&quot;) verkkosivuston{' '}
                <span className="whitespace-nowrap">maalausmultivari.fi</span> käyttöön.
                Käyttämällä sivustoa hyväksyt nämä ehdot.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">
                2. Sivuston sisältö
              </h2>
              <p className="mt-2 leading-relaxed">
                Sivuston sisältö, kuten tekstit, kuvat ja hinta-arviot, on tarkoitettu
                yleisluontoiseksi tiedoksi palveluistamme. Lopullinen hinta ja aikataulu sovitaan
                aina erikseen kohdekäynnin ja tarjouksen perusteella. Pidätämme oikeuden päivittää
                sivuston sisältöä ilman erillistä ilmoitusta.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">
                3. Tarjouspyynnöt ja sopimukset
              </h2>
              <p className="mt-2 leading-relaxed">
                Verkkosivuston kautta lähetetty tarjous- tai yhteydenottopyyntö ei ole sitova
                tilaus, vaan pyyntö saada tarjous. Sitova sopimus syntyy vasta, kun molemmat
                osapuolet ovat hyväksyneet tarjouksen ehdot kirjallisesti.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">
                4. Vastuunrajoitus
              </h2>
              <p className="mt-2 leading-relaxed">
                Pyrimme pitämään sivuston sisällön ajantasaisena ja virheettömänä, mutta emme
                vastaa mahdollisista sisällön virheistä tai sivuston tilapäisistä
                saavuttamattomuuksista aiheutuvista vahingoista.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">
                5. Tekijänoikeudet
              </h2>
              <p className="mt-2 leading-relaxed">
                Sivuston sisältö on {company.name}n tai sen yhteistyökumppaneiden omaisuutta, eikä
                sitä saa kopioida tai käyttää ilman lupaa.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">
                6. Sovellettava laki
              </h2>
              <p className="mt-2 leading-relaxed">
                Näihin käyttöehtoihin sovelletaan Suomen lakia. Mahdolliset erimielisyydet
                pyritään ensisijaisesti ratkaisemaan neuvottelemalla.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">7. Yhteystiedot</h2>
              <p className="mt-2 leading-relaxed">
                Kysymyksissä käyttöehdoista ota yhteyttä:{' '}
                <a href={company.emailHref} onClick={() => trackEmailClick('terms_of_use')} className="text-orange-600 underline">
                  {company.email}
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
