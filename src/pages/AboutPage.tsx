import { ShieldCheck, Heart, Leaf, Users, ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/sections/PageHero';
import { images } from '@/config/images';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { Stats } from '@/sections/Stats';
import { ContactCTA } from '@/sections/ContactCTA';
import { company } from '@/data/company';
import { trackPhoneClick, trackEmailClick } from '@/lib/analytics';

const values = [
  {
    icon: ShieldCheck,
    title: 'Luotettavuus',
    text: 'Pidämme mitä lupaamme — aina. Aikataulu ja lopputulos sovitaan yhdessä.',
  },
  {
    icon: Heart,
    title: 'Asiakaskeskeisyys',
    text: 'Kuuntelemme toiveitasi ja pidämme sinut ajan tasalla koko projektin ajan.',
  },
  {
    icon: Leaf,
    title: 'Ympäristö',
    text: 'Käytämme ympäristöystävällisiä maaleja ja hellävaraisia puhdistusaineita.',
  },
  {
    icon: Users,
    title: 'Ammattitaito',
    text: 'Vuosien kokemus takaa laadukkaan lopputuloksen jokaisessa kohteessa.',
  },
];

export function AboutPage() {
  return (
    <>
      <Seo
        title="Meistä"
        description="Maalaus Multiväri tarjoaa laadukkaita maalaus- ja siivouspalveluja Uudellamaalla. Palvelemme sekä yksityisiä että yrityksiä. Tutustu toimintaamme."
        path="/yhteistyossa"
        breadcrumbs={[
          { name: 'Etusivu', path: '/' },
          { name: 'Meistä', path: '/yhteistyossa' },
        ]}
      />
      <PageHero
        eyebrow="Meistä"
        crumb="Meistä"
        title="Maalausta ja siivoustyötä Uudellamaalla"
        description="Olemme paikallinen palveluntarjoaja, joka tuntee Pohjolan sään ja sen vaatimat ratkaisut. Palvelemme yksityisiä ja yrityksiä koko Uudenmaan alueella."
        image={images.pages.about}
      />

      <Stats />

      <section className="section-pad bg-white">
        <div className="container-base grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-6">
            <span className="eyebrow-orange">Taustaa</span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">
              Paikallista palvelua, johon voit luottaa
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-navy-600">
              <p>
                {company.name} tarjoaa laadukkaita maalaus- ja siivouspalveluja
                yksityisille ja yrityksille Uudellamaalla. Olemme kasvaneet
                vuosien varrella pienestä toimijasta alueemme tunnetuksi nimeksi
                maalaus- ja siivousalalla.
              </p>
              <p>
                Palvelemme asiakkaita Helsingissä, Espoossa, Vantaalla, Kauniaisissa,
                Kirkkonummella, Hyvinkäällä, Keravalla ja Järvenpäässä. Teemme työtä
                kodeissa, asunnoissa, toimistoissa ja julkisissa tiloissa — jokainen
                projekti saa saman huolellisen kohtelun.
              </p>
              <p>
                Pohjoismaisiin olosuhteisiin perehtynyt tiimimme valitsee aina oikeat
                materiaalit ja menetelmät kohteen mukaan. Emme tee kompromisseja laadun
                suhteen.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={company.phoneHref} onClick={() => trackPhoneClick('about_hero')} className="btn-secondary">
                Soita meille
              </a>
              <a href={company.emailHref} onClick={() => trackEmailClick('about_hero')} className="btn-outline">
                Lähetä sähköpostia
              </a>
            </div>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-6">
            <div className="relative">
              <img
                src={images.about.portrait}
                alt="Ammattimaalari maalaamassa seinää rullalla Uudellamaalla"
                className="aspect-[4/5] w-full rounded-3xl object-cover shadow-lift"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-5 shadow-lift sm:block">
                <p className="font-display text-3xl font-extrabold text-orange-600">15+</p>
                <p className="text-xs text-navy-600">vuotta alalla</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-navy-50/60">
        <div className="container-base">
          <SectionHeading
            eyebrow="Arvomme"
            eyebrowOrange
            title="Periaatteet, jotka ohjaavat työtämme"
            description="Nämä arvot ovat mukana jokaisessa tarjouksessa, jokaisessa työvaiheessa ja jokaisessa asiakastapaamisessa."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="card h-full p-6 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <v.icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-navy-900">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-950 py-16 text-white">
        <div className="container-base flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-5">
            <Users className="h-12 w-12 text-orange-400" />
            <div>
              <h3 className="font-display text-2xl font-bold">Oletko tyytyväinen asiakkaamme?</h3>
              <p className="text-navy-200">Kuulemme mielellämme kokemustasi. Lähetä palautetta sähköpostitse!</p>
            </div>
          </div>
          <a href={company.emailHref} onClick={() => trackEmailClick('about_feedback')} className="btn-primary">
            Ota yhteyttä
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
