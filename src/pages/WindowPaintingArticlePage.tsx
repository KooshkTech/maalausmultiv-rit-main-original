import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Calendar, Clock, Paintbrush, PlayCircle } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Reveal } from '@/components/Reveal';
import { ContactCTA } from '@/sections/ContactCTA';
import { images } from '@/config/images';

const VIDEO_BASE = '/videos/window-painting';

const stages = [
  {
    number: '01',
    title: 'Vanhan maalin poisto, hionta ja pohjamaalaus',
    description:
      'Työ alkaa irtoavan ja heikosti kiinni olevan vanhan maalin poistolla. Sen jälkeen pinta hiotaan ja puhdistetaan huolellisesti. Paljaat tai käsittelyä vaativat kohdat pohjamaalataan ennen seuraavia työvaiheita.',
    src: `${VIDEO_BASE}/01-pohjatyot-scraping-sanding-primer.mp4`,
    schemaTitle: 'Ikkunoiden pohjatyöt: maalin poisto, hionta ja pohjamaalaus',
  },
  {
    number: '02',
    title: 'Kittaus, hionta ja korjaus',
    description:
      'Pinnan epätasaisuudet ja korjausta vaativat kohdat kitataan. Kuivunut kitti hiotaan tasaiseksi, pinta tarkastetaan ja tarvittaessa korjaus tehdään uudelleen ennen pintamaalausta.',
    src: `${VIDEO_BASE}/02-kittaus-sanding-repair.mp4`,
    schemaTitle: 'Ikkunoiden kittaus, hionta ja korjaus',
  },
  {
    number: '03',
    title: 'Ikkunoiden maalaus ja viimeistely',
    description:
      'Kun pohjatyöt ja korjaukset ovat valmiit, pinta maalataan peittävästi ja yksityiskohdat viimeistellään. Tavoitteena on siisti, tasainen ja huoliteltu maalipinta.',
    src: `${VIDEO_BASE}/03-maalaus-final-coat.mp4`,
    schemaTitle: 'Ikkunoiden maalaus ja viimeistely',
  },
];

export function WindowPaintingArticlePage() {
  const pageUrl = 'https://maalausmultivari.fi/blogi/ikkunoiden-maalaus';
  const poster = images.services['ulkomaalaus'] ?? images.pages.blog;

  const videoSchema = {
    '@context': 'https://schema.org',
    '@graph': stages.map((stage) => ({
      '@type': 'VideoObject',
      name: stage.schemaTitle,
      description: stage.description,
      thumbnailUrl: `https://maalausmultivari.fi${poster}`,
      uploadDate: '2026-09-13',
      duration: 'PT29S',
      contentUrl: `https://maalausmultivari.fi${stage.src}`,
      embedUrl: pageUrl,
    })),
  };

  return (
    <>
      <Seo
        title="Ikkunoiden maalaus vaihe vaiheelta – pohjatöistä viimeistelyyn"
        description="Katso kolmesta videosta, miten ikkunoiden maalaus etenee vanhan maalin poistosta ja hionnasta kittaukseen, korjaukseen ja viimeistelymaalaukseen. Palvelemme Vantaalla, Helsingissä, Espoossa ja muualla Uudellamaalla."
        path="/blogi/ikkunoiden-maalaus"
        image={poster}
        type="article"
        breadcrumbs={[
          { name: 'Etusivu', path: '/' },
          { name: 'Blogi', path: '/blogi' },
          { name: 'Ikkunoiden maalaus', path: '/blogi/ikkunoiden-maalaus' },
        ]}
        articleSchema={{
          headline: 'Ikkunoiden maalaus vaihe vaiheelta – pohjatöistä viimeistelyyn',
          description:
            'Ikkunoiden maalauksen työvaiheet vanhan maalin poistosta, hionnasta ja pohjamaalauksesta kittaukseen, korjaukseen ja viimeistelymaalaukseen.',
          image: poster,
          datePublished: '2026-09-13',
          dateModified: '2026-09-13',
          author: 'Maalaus Multiväri',
        }}
      />

      <Helmet>
        <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>
      </Helmet>

      <article>
        <header className="bg-navy-950 pt-16 text-white lg:pt-20">
          <div className="container-base py-14 lg:py-20">
            <nav className="flex flex-wrap items-center gap-2 text-xs text-navy-300">
              <Link to="/" className="transition hover:text-white">Etusivu</Link>
              <span>/</span>
              <Link to="/blogi" className="transition hover:text-white">Blogi</Link>
              <span>/</span>
              <span className="text-orange-300">Ikkunoiden maalaus</span>
            </nav>

            <span className="eyebrow-orange mt-6 bg-white/10 text-orange-300">Projektivideo · Ikkunoiden maalaus</span>
            <h1 className="mt-5 max-w-4xl font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Ikkunoiden maalaus vaihe vaiheelta – pohjatöistä viimeistelyyn
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-navy-200 sm:text-lg">
              Tässä oikeasta maalausprojektista tehdyssä videosarjassa näet kolme tärkeää työvaihetta: vanhan maalipinnan käsittelyn ja pohjatyöt, kittauksen ja korjauksen sekä lopullisen pintamaalauksen.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-300">
              <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-orange-400" />13.9.2026</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-orange-400" />5 min</span>
              <span className="inline-flex items-center gap-2"><PlayCircle className="h-4 w-4 text-orange-400" />3 työvaihevideota</span>
            </div>
          </div>
        </header>

        <section className="section-pad bg-white">
          <div className="container-base">
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <p className="text-lg font-medium leading-8 text-navy-800">
                  Ikkunoiden maalaus ei tarkoita vain uuden maalin levittämistä vanhan pinnan päälle. Kestävä ja siisti lopputulos syntyy huolellisista pohjatöistä, oikea-aikaisista korjauksista ja tarkasta viimeistelystä.
                </p>
                <p className="mt-5 leading-7 text-navy-600">
                  Maalaus Multivari tekee ikkunoiden ja ovien maalausta Vantaalla, Helsingissä, Espoossa ja muualla Uudellamaalla. Työn laajuus arvioidaan aina ikkunoiden nykyisen kunnon perusteella.
                </p>
              </Reveal>

              <div className="mt-12 space-y-12">
                {stages.map((stage, index) => (
                  <Reveal key={stage.number} delay={index * 80}>
                    <section className="overflow-hidden rounded-3xl border border-navy-100 bg-navy-50/60 shadow-soft">
                      <div className="grid gap-0 lg:grid-cols-[.72fr_1fr]">
                        <div className="flex items-center justify-center bg-navy-950 p-4 sm:p-6">
                          <div className="w-full max-w-[360px] overflow-hidden rounded-2xl bg-black shadow-lift">
                            <video
                              className="aspect-[9/16] w-full object-cover"
                              controls
                              preload="metadata"
                              playsInline
                              poster={poster}
                              aria-label={stage.schemaTitle}
                            >
                              <source src={stage.src} type="video/mp4" />
                              Selaimesi ei tue videotoistoa.
                            </video>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center p-7 sm:p-9">
                          <span className="text-sm font-extrabold tracking-[0.22em] text-orange-600">VAIHE {stage.number}</span>
                          <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-navy-900 sm:text-3xl">
                            {stage.title}
                          </h2>
                          <p className="mt-4 leading-7 text-navy-600">{stage.description}</p>
                        </div>
                      </div>
                    </section>
                  </Reveal>
                ))}
              </div>

              <Reveal>
                <section className="mt-14 rounded-3xl bg-white p-7 ring-1 ring-navy-100 sm:p-9">
                  <h2 className="font-display text-2xl font-bold text-navy-900">Milloin ikkunoiden maalaus kannattaa tehdä?</h2>
                  <p className="mt-4 leading-7 text-navy-600">
                    Maalipinnan kunto kannattaa tarkistaa säännöllisesti. Hilseily, halkeilu, kuluminen ja paljastuva puupinta kertovat siitä, että huoltomaalaus tai perusteellisempi kunnostus voi olla ajankohtainen. Kaikki ikkunat eivät tarvitse yhtä laajaa käsittelyä, joten työmenetelmä valitaan kohteen mukaan.
                  </p>
                </section>
              </Reveal>

              <Reveal>
                <section className="mt-10 rounded-3xl bg-navy-950 p-7 text-white sm:p-9">
                  <span className="eyebrow-orange bg-white/10 text-orange-300">Paikallinen maalauspalvelu</span>
                  <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">Ikkunoiden maalaus Vantaa, Helsinki ja Espoo</h2>
                  <p className="mt-4 max-w-3xl leading-7 text-navy-200">
                    Jos etsit palvelua hakusanoilla ikkunoiden maalaus Vantaa, ikkunoiden maalaus Helsinki, ikkunoiden maalaus Espoo, ikkunan maalaus tai ikkunoiden kunnostus, pyydä arvio, joka perustuu kohteen todelliseen kuntoon ja tarvittaviin työvaiheisiin.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/palvelut/ikkunoiden-ja-ovien-maalaus" className="btn-primary">
                      <Paintbrush className="h-4 w-4" /> Ikkunoiden ja ovien maalaus
                    </Link>
                    <Link to="/yhteystiedot" className="btn-ghost-light">
                      Pyydä arvio <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </section>
              </Reveal>

              <Reveal>
                <div className="mt-10 border-t border-navy-100 pt-7">
                  <p className="text-sm font-bold text-navy-900">Aiheeseen liittyvät palvelut ja alueet</p>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {[
                      ['/palvelut/ulkomaalaus', 'Ulkomaalaus'],
                      ['/palvelut/huoltomaalaus', 'Huoltomaalaus'],
                      ['/palvelualueet/vantaa', 'Maalaus Vantaa'],
                      ['/palvelualueet/helsinki', 'Maalaus Helsinki'],
                      ['/palvelualueet/espoo', 'Maalaus Espoo'],
                    ].map(([to, label]) => (
                      <Link key={to} to={to} className="rounded-full border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700">
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </article>

      <ContactCTA />
    </>
  );
}
