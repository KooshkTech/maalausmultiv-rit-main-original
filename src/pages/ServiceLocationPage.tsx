import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Check, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Reveal } from '@/components/Reveal';
import { ContactCTA } from '@/sections/ContactCTA';
import { getService } from '@/data/services';
import { getCity } from '@/data/cities';
import { company } from '@/data/company';
import { images } from '@/config/images';
import { trackCtaClick, trackPhoneClick } from '@/lib/analytics';
import { priorityLocalServiceSlugs } from '@/data/localSeo';
import { projects } from '@/data/projects';

const supportedServices = new Set<string>(priorityLocalServiceSlugs);
const supportedCities = new Set(['helsinki', 'espoo', 'vantaa']);

const localCopy: Record<string, Record<string, { intro: string; consideration: string }>> = {
  helsinki: {
    'talon-maalaus': {
      intro: 'Helsingin talokanta vaihtelee puutaloista rapattuihin ja moderneihin pientaloihin. Talon maalaus suunnitellaan aina julkisivumateriaalin, nykyisen maalipinnan ja kohteen kunnon mukaan.',
      consideration: 'Helsingissä rannikon kosteus, tuuli ja vaihtelevat sääolot korostavat pesun, irtoavan maalin poiston ja oikean pohjustuksen merkitystä.',
    },
    ulkomaalaus: {
      intro: 'Ulkomaalaus Helsingissä alkaa pintojen kunnon arvioinnista. Puujulkisivut, listat ja muut ulkopinnat käsitellään materiaalille sopivalla tavalla ennen pintamaalausta.',
      consideration: 'Meri-ilma ja vuodenaikojen vaihtelut rasittavat Helsingin ulkopintoja, joten esikäsittely ja sääolosuhteisiin sopiva maalausajankohta ovat keskeisiä.',
    },
    sisamaalaus: {
      intro: 'Sisämaalaus Helsingissä sopii niin kerrostaloasuntoihin, pientaloihin kuin toimitiloihin. Suojaamme tilat huolellisesti ja sovitamme työn asumisen tai liiketoiminnan aikatauluun.',
      consideration: 'Vanhemmissa helsinkiläisissä asunnoissa pohjatyöt, tasoitukset ja aiempien pintojen kunto vaikuttavat erityisesti lopputulokseen.',
    },
    julkisivumaalaus: {
      intro: 'Julkisivumaalaus Helsingissä suunnitellaan rakennuksen materiaalin, vanhan pinnoitteen ja ympäristön rasituksen mukaan. Toteutamme puu-, rappaus- ja muita soveltuvia julkisivuja huolellisilla pohjatöillä.',
      consideration: 'Helsingin merellinen ilmasto, tuuli ja kosteus korostavat hengittävän pintakäsittelyn, halkeamien korjauksen ja oikean sääikkunan merkitystä julkisivumaalauksessa.',
    },
    kattomaalaus: {
      intro: 'Kattomaalaus Helsingissä auttaa suojaamaan peltikattoa ruosteelta ja säältä. Katon kunto tarkistetaan, pinta pestään ja ruostekohdat käsitellään ennen soveltuvaa kattopinnoitetta.',
      consideration: 'Rannikon kosteus, ilmansaasteet ja vaihtelevat sääolosuhteet voivat rasittaa kattopintoja Helsingissä, joten pesu, ruosteenpoisto ja kuivumisolosuhteet tarkistetaan ennen maalausta.',
    },
  },
  espoo: {
    'talon-maalaus': {
      intro: 'Espoon pientaloalueilla talon maalaus tehdään rakennuksen materiaalin ja ympäristön mukaan. Arvioimme julkisivun, listat ja muut sovitut pinnat ennen työn aloitusta.',
      consideration: 'Espoon rannikkoalueilla kosteus ja merellinen ilmasto voivat rasittaa maalipintaa, kun taas sisämaan pientaloalueilla auringon ja sään vaihtelut korostuvat.',
    },
    ulkomaalaus: {
      intro: 'Ulkomaalaus Espoossa toteutetaan puu-, rappaus- ja muille soveltuville julkisivupinnoille huolellisen esikäsittelyn jälkeen.',
      consideration: 'Tapiolan, Matinkylän ja muiden Espoon alueiden rakennuskanta on monipuolinen, joten maalityyppi ja työmenetelmä valitaan aina pinnan mukaan.',
    },
    sisamaalaus: {
      intro: 'Sisämaalaus Espoossa uudistaa kodin, asunnon tai toimitilan nopeasti ilman raskasta remonttia. Maalaamme seinät, katot ja sovitut yksityiskohdat siististi.',
      consideration: 'Kerrostalo- ja pientalokohteissa suojaus, pölynhallinta ja pohjatöiden oikea laajuus suunnitellaan erikseen ennen maalausta.',
    },
    julkisivumaalaus: {
      intro: 'Julkisivumaalaus Espoossa toteutetaan rakennuksen materiaalin ja ympäristön mukaan. Käsittelemme puu- ja rappausjulkisivuja sekä muita soveltuvia pintoja huolellisella esikäsittelyllä.',
      consideration: 'Espoon rannikkoalueilla kosteus ja merellinen ilmasto lisäävät julkisivujen rasitusta, kun taas sisämaan pientaloalueilla UV-säteily ja lämpötilavaihtelut korostuvat.',
    },
    kattomaalaus: {
      intro: 'Kattomaalaus Espoossa sisältää katon kunnon arvioinnin, pesun, ruostekohtien käsittelyn ja sovitun pinnoituksen. Työmenetelmä valitaan kattomateriaalin ja nykyisen pinnan mukaan.',
      consideration: 'Espoon merellisillä alueilla katto altistuu kosteudelle ja tuulelle, joten pesun jälkeinen kuivuminen ja ruostesuojauksen laatu ovat erityisen tärkeitä.',
    },
  },
  vantaa: {
    'talon-maalaus': {
      intro: 'Vantaa on kotimarkkinaamme. Talon maalaus Vantaalla kattaa omakoti- ja pientalojen pintojen arvioinnin, esikäsittelyn ja sovitut maalaustyöt.',
      consideration: 'Tikkurilan, Myyrmäen, Hakunilan ja muiden Vantaan alueiden pientalokanta vaihtelee, joten tarkistamme aina materiaalin ja vanhan maalipinnan ennen työmenetelmän valintaa.',
    },
    ulkomaalaus: {
      intro: 'Ulkomaalaus Vantaalla tehdään kohteen kunnon perusteella: pinnat pestään, irtoava maali poistetaan ja tarvittavat kohdat pohjustetaan ennen maalausta.',
      consideration: 'Paikallinen sijaintimme helpottaa kohdekäyntiä ja työn suunnittelua Vantaan eri alueilla sekä auttaa ajoittamaan ulkomaalauksen sopiviin sääolosuhteisiin.',
    },
    sisamaalaus: {
      intro: 'Sisämaalaus Vantaalla palvelee asuntoja, omakotitaloja ja toimitiloja. Työ voidaan toteuttaa huone kerrallaan tai laajempana kokonaisuutena.',
      consideration: 'Asutuissa kohteissa painotamme huolellista suojausta, siisteyttä ja vaiheistusta, jotta arki voi jatkua mahdollisimman normaalisti.',
    },
    julkisivumaalaus: {
      intro: 'Julkisivumaalaus Vantaalla tehdään pientaloihin, taloyhtiöihin ja muihin kiinteistöihin materiaalikohtaisilla menetelmillä. Arvioimme pinnan kunnon ja tarvittavat korjaukset ennen maalausta.',
      consideration: 'Vantaan vaihteleva pientalo- ja kiinteistökanta edellyttää oikeaa maalityyppiä sekä riittäviä pohjatöitä. Paikallinen sijaintimme helpottaa kohdekäyntiä ja työn ajoitusta.',
    },
    kattomaalaus: {
      intro: 'Kattomaalaus Vantaalla uudistaa ja suojaa peltikaton pintaa. Pesemme katon, käsittelemme ruostekohdat ja toteutamme pinnoituksen kohteen kunnon mukaan.',
      consideration: 'Vantaalla lämpötilavaihtelut, puuston aiheuttama lika ja kosteus voivat rasittaa kattoa. Siksi katon puhdistus, ruosteenesto ja oikea maalausajankohta tarkistetaan ennen työtä.',
    },
  },
};

export function ServiceLocationPage() {
  const { serviceSlug = '', citySlug = '' } = useParams<{ serviceSlug: string; citySlug: string }>();
  const service = getService(serviceSlug);
  const city = getCity(citySlug);

  if (!service || !city || !supportedServices.has(serviceSlug) || !supportedCities.has(citySlug)) {
    return <Navigate to="/404" replace />;
  }

  const copy = localCopy[citySlug][serviceSlug];
  const serviceImage = images.services[service.slug as keyof typeof images.services] || service.image;
  const localProjects = projects
    .filter((project) => project.location === city.name)
    .filter((project) => project.services.some((projectService) =>
      projectService.toLowerCase().includes(service.title.toLowerCase().replace('talon maalaus', 'ulkomaalaus')) ||
      service.title.toLowerCase().includes(projectService.toLowerCase())
    ))
    .slice(0, 2);
  const title = `${service.title} ${city.name}`;
  const titleSuffix: Record<string, string> = {
    'talon-maalaus': 'omakoti- ja pientaloille',
    ulkomaalaus: 'kestävät pohjatyöt ja maalaus',
    sisamaalaus: 'kodit ja toimitilat',
    julkisivumaalaus: 'puu- ja rappauspinnat',
    kattomaalaus: 'peltikaton pesu ja pinnoitus',
  };
  const descriptionLead: Record<string, string> = {
    'talon-maalaus': 'Omakoti- ja pientalon maalaus',
    ulkomaalaus: 'Ulkomaalaus',
    sisamaalaus: 'Sisämaalaus koteihin ja toimitiloihin',
    julkisivumaalaus: 'Julkisivumaalaus puu- ja rappauspinnoille',
    kattomaalaus: 'Peltikaton pesu ja kattomaalaus',
  };
  const seoTitle = `${title} – ${titleSuffix[service.slug]}`;
  const description = `${descriptionLead[service.slug]} ${city.locative}. Kohdekohtaiset pohjatyöt, selkeä tarjous ja 2 vuoden kirjallinen takuu maalaustyöjäljestä. Pyydä maksuton arvio.`;
  const serviceIntentFaq: Record<string, { q: string; a: string }> = {
    'talon-maalaus': { q: `Milloin talon maalaus ${city.locative} kannattaa tehdä?`, a: 'Ulkomaalaus ajoitetaan kuivalle kaudelle, jolloin pinta on riittävän kuiva ja lämpötila sopii käytettävälle maalille. Tarkistamme olosuhteet ennen työn aloitusta.' },
    ulkomaalaus: { q: `Miten ulkomaalauksen pohjatyöt arvioidaan ${city.locative}?`, a: 'Tarkistamme vanhan maalipinnan, lian, irtoavan maalin ja mahdolliset vauriot. Pesu, kaavinta, korjaukset ja pohjustus määritellään pinnan todellisen kunnon mukaan.' },
    sisamaalaus: { q: `Voiko sisämaalauksen tehdä asutussa kodissa ${city.locative}?`, a: 'Usein kyllä. Työ voidaan vaiheistaa huoneittain, ja lattiat sekä kalusteet suojataan huolellisesti. Aikataulu sovitaan kohteen käytön mukaan.' },
    julkisivumaalaus: { q: `Miten julkisivun materiaali vaikuttaa maalaukseen ${city.locative}?`, a: 'Puu-, rappaus- ja muut julkisivut vaativat materiaalille ja vanhalle pinnoitteelle sopivan esikäsittelyn sekä maalityypin. Tarkistamme nämä ennen tarjousta.' },
    kattomaalaus: { q: `Mitä tarkistetaan ennen kattomaalausta ${city.locative}?`, a: 'Tarkistamme kattopinnan kunnon, ruostekohdat, puhdistustarpeen ja nykyisen pinnoitteen. Maalaus tehdään vasta puhtaalle ja riittävän kuivalle pinnalle sopivissa sääolosuhteissa.' },
  };
  const faqs = [
    serviceIntentFaq[service.slug],
    { q: `Mitä ${service.title.toLowerCase()} ${city.locative} sisältää?`, a: `Työn sisältö sovitaan kohteen mukaan. Arvioimme pinnat, tarvittavat pohjatyöt, suojaukset, materiaalit ja maalausvaiheet ennen tarjousta.` },
    { q: `Onko arvio ${city.locative} maksuton?`, a: 'Kyllä. Arviokäynti ja tarjous ovat maksuttomia ja sitoutumattomia.' },
    { q: 'Kuinka pitkä takuu maalaustyöllä on?', a: 'Annamme maalaustyöjäljelle 2 vuoden kirjallisen takuun sovittujen takuuehtojen mukaisesti.' },
    { q: `Miten työn ajankohta sovitaan ${city.locative}?`, a: 'Sovimme aikataulun kohteen, työn laajuuden ja maalausolosuhteiden mukaan. Ulkotöissä huomioimme erityisesti sään ja pintojen kuivumisen.' },
  ];

  return (
    <>
      <Seo
        title={seoTitle}
        description={description}
        path={`/palvelut/${service.slug}/${city.slug}`}
        image={serviceImage}
        breadcrumbs={[
          { name: 'Etusivu', path: '/' },
          { name: 'Palvelut', path: '/palvelut' },
          { name: service.title, path: `/palvelut/${service.slug}` },
          { name: city.name, path: `/palvelut/${service.slug}/${city.slug}` },
        ]}
        serviceSchema={{ name: title, description, areaServed: city.name }}
        faqSchema={faqs}
      />

      <section className="bg-navy-950 text-white">
        <div className="container-base grid gap-10 py-16 lg:grid-cols-12 lg:items-center lg:py-24">
          <Reveal className="lg:col-span-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-400"><MapPin className="h-4 w-4" />{city.name}, {city.region}</div>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-navy-100">{copy.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/yhteystiedot" onClick={() => trackCtaClick('Pyydä tarjous', 'service_location_hero')} className="btn-primary">Pyydä maksuton tarjous <ArrowRight className="h-4 w-4" /></Link>
              <a href={company.phoneHref} onClick={() => trackPhoneClick('service_location_hero')} className="btn-ghost-light"><Phone className="h-4 w-4" />{company.phone}</a>
            </div>
            <div className="mt-7 flex items-center gap-2 text-sm text-navy-200"><ShieldCheck className="h-5 w-5 text-orange-400" />2 vuoden kirjallinen takuu maalaustyöjäljestä</div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-6">
            <img src={serviceImage} alt={`${service.title} ${city.locative}`} className="aspect-[4/3] w-full rounded-3xl object-cover" loading="eager" fetchPriority="high" />
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-base grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="font-display text-3xl font-bold text-navy-900">{service.title} {city.locative} – mitä työ sisältää?</h2>
            <p className="mt-4 leading-relaxed text-navy-600">{service.description}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {service.bullets.map((bullet) => <li key={bullet} className="flex gap-2 rounded-xl bg-navy-50 p-4 text-sm text-navy-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />{bullet}</li>)}
            </ul>
            <div className="mt-10 rounded-2xl border border-navy-100 p-6">
              <h2 className="font-display text-2xl font-bold text-navy-900">{city.genitive} kohteissa huomioitavaa</h2>
              <p className="mt-3 leading-relaxed text-navy-600">{copy.consideration}</p>
              <p className="mt-3 leading-relaxed text-navy-600">{city.localFacts}</p>
            </div>
          </div>
          <aside className="card h-fit p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-bold text-navy-900">Pyydä arvio {city.locative}</h2>
            <p className="mt-3 text-sm leading-relaxed text-navy-600">Kerro kohteen sijainti, pintamateriaali ja työn arvioitu laajuus. Saat selkeän tarjouksen ennen työn aloitusta.</p>
            <Link to="/yhteystiedot" onClick={() => trackCtaClick('Pyydä maksuton tarjous', 'service_location_sidebar')} className="btn-primary mt-5 w-full">Pyydä maksuton tarjous <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/maalauslaskuri" onClick={() => trackCtaClick('Laske maalauksen hinta', 'service_location_sidebar')} className="btn-outline mt-3 w-full">Laske maalauksen hinta</Link>
            <Link to={`/palvelualueet/${city.slug}`} className="mt-4 block text-center text-sm font-semibold text-orange-600">Kaikki palvelut {city.locative} →</Link>
          </aside>
        </div>
      </section>

      {localProjects.length > 0 && (
        <section className="section-pad bg-navy-50/60">
          <div className="container-base">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <span className="eyebrow-orange">Paikallista näyttöä</span>
                <h2 className="mt-3 font-display text-3xl font-bold text-navy-900">Toteutettuja kohteita {city.locative}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-600">Katso esimerkkejä alueella toteutetuista töistä. Projektit auttavat arvioimaan työn laajuutta ja toteutustapaa ennen tarjouspyyntöä.</p>
              </div>
              <Link to="/projektit" className="text-sm font-bold text-orange-600 hover:underline">Kaikki projektit →</Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {localProjects.map((project) => (
                <article key={project.id} className="card overflow-hidden">
                  <img src={project.image} alt={`${project.title}, ${project.location}`} className="aspect-[16/9] w-full object-cover" loading="lazy" />
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-orange-600"><MapPin className="h-3.5 w-3.5" />{project.location} · {project.year}</div>
                    <h3 className="mt-2 font-display text-lg font-bold text-navy-900">{project.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-600">{project.description}</p>
                    {project.review && (
                      <blockquote className="mt-4 border-l-2 border-orange-300 pl-4 text-sm italic text-navy-600">
                        “{project.review.text}” <span className="not-italic font-semibold text-navy-700">— {project.review.author}</span>
                      </blockquote>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-pad bg-white">
        <div className="container-base">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold text-navy-900">Tutustu palveluun ja alueeseen</h2>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">Pääpalvelusivu kertoo työn yleisestä sisällöstä. {city.name}-sivu kokoaa kaikki alueella tarjoamamme palvelut.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to={`/palvelut/${service.slug}`} className="text-sm font-bold text-orange-600 hover:underline">{service.title} – pääpalvelu →</Link>
                <Link to={`/palvelualueet/${city.slug}`} className="text-sm font-bold text-orange-600 hover:underline">Palvelut {city.locative} →</Link>
              </div>
            </div>
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold text-navy-900">Muut maalauspalvelut {city.locative}</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {priorityLocalServiceSlugs.filter((slug) => slug !== service.slug).map((slug) => {
                  const relatedService = getService(slug);
                  if (!relatedService) return null;
                  return (
                    <Link key={slug} to={`/palvelut/${slug}/${city.slug}`} className="flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-orange-600">
                      <ArrowRight className="h-3.5 w-3.5 text-orange-400" />
                      {relatedService.title} {city.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy-50/60">
        <div className="container-base max-w-3xl">
          <h2 className="text-center font-display text-3xl font-bold text-navy-900">Usein kysyttyä – {service.title.toLowerCase()} {city.locative}</h2>
          <div className="mt-8 space-y-3">{faqs.map((faq) => <details key={faq.q} className="rounded-xl border border-navy-100 bg-white p-5"><summary className="cursor-pointer font-semibold text-navy-800">{faq.q}</summary><p className="mt-3 text-sm leading-relaxed text-navy-600">{faq.a}</p></details>)}</div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
