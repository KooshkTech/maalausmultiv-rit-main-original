import { Seo } from '@/components/Seo';
import { company } from '@/data/company';

export function CookiePolicyPage() {
  return (
    <>
      <Seo
        title="Evästekäytäntö"
        description="Miten Maalaus Multiväri käyttää evästeitä verkkosivustollaan, ja miten voit hallita evästeasetuksiasi."
        path="/evastekaytanto"
      />
      <section className="bg-navy-50/60 px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-navy-900 sm:text-4xl">
            Evästekäytäntö
          </h1>
          <p className="mt-3 text-sm text-navy-500">Päivitetty viimeksi: 14.8.2026</p>

          <div className="prose prose-navy mt-8 max-w-none space-y-8 text-navy-700">
            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">Mitä evästeet ovat?</h2>
              <p className="mt-2 leading-relaxed">
                Evästeet ovat pieniä tekstitiedostoja, jotka tallentuvat laitteellesi vieraillessasi
                verkkosivustolla. Ne auttavat sivustoa muistamaan asetuksesi ja ymmärtämään, miten
                sivustoa käytetään.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">
                Käyttämämme evästeet
              </h2>
              <div className="mt-3 overflow-x-auto rounded-xl border border-navy-100 bg-white">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-navy-100 bg-navy-50/60">
                      <th className="px-4 py-3 font-semibold text-navy-900">Tyyppi</th>
                      <th className="px-4 py-3 font-semibold text-navy-900">Tarkoitus</th>
                      <th className="px-4 py-3 font-semibold text-navy-900">Vaatii suostumuksen</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-navy-100">
                      <td className="px-4 py-3 font-medium">Välttämättömät</td>
                      <td className="px-4 py-3">
                        Sivuston perustoiminnot, mm. evästeasetusten muistaminen.
                      </td>
                      <td className="px-4 py-3">Ei</td>
                    </tr>
                    <tr className="border-b border-navy-100">
                      <td className="px-4 py-3 font-medium">Analytiikka</td>
                      <td className="px-4 py-3">
                        Google Analytics — auttaa ymmärtämään sivuston käyttöä ja parantamaan
                        sisältöä.
                      </td>
                      <td className="px-4 py-3">Kyllä</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Markkinointi</td>
                      <td className="px-4 py-3">
                        Meta Pixel ja vastaavat työkalut mainonnan kohdentamiseen ja mittaamiseen.
                      </td>
                      <td className="px-4 py-3">Kyllä</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">
                Evästeasetusten hallinta
              </h2>
              <p className="mt-2 leading-relaxed">
                Voit hyväksyä tai hylätä ei-välttämättömät evästeet sivun alareunassa näkyvästä
                evästeilmoituksesta ensimmäisellä käynnilläsi. Valintasi tallennetaan 180 päiväksi.
                Voit muuttaa selaimesi asetuksista myös evästeiden hallintaa laajemmin, mutta tämä
                voi vaikuttaa sivuston toimivuuteen.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-navy-900">Yhteystiedot</h2>
              <p className="mt-2 leading-relaxed">
                Kysymyksissä evästeiden käytöstä ota yhteyttä:{' '}
                <a href={company.emailHref} className="text-orange-600 underline">
                  {company.email}
                </a>
                . Lue myös{' '}
                <a href="/tietosuojaseloste" className="text-orange-600 underline">
                  tietosuojaselosteemme
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
