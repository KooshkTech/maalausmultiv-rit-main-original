import { getService } from '@/data/services';
import { getCity } from '@/data/cities';

export type ServiceLocationTarget = {
  slug: string;
  serviceSlug: string;
  citySlug: string;
  keyword: string;
  title: string;
  description: string;
  intro: string;
  localAngle: string;
};

const targets: Array<[string, string]> = [
  ['talon-maalaus', 'helsinki'],
  ['talon-maalaus', 'espoo'],
  ['talon-maalaus', 'vantaa'],
  ['sisamaalaus', 'helsinki'],
  ['sisamaalaus', 'espoo'],
  ['sisamaalaus', 'vantaa'],
  ['julkisivumaalaus', 'helsinki'],
  ['julkisivumaalaus', 'espoo'],
  ['julkisivumaalaus', 'vantaa'],
  ['kattomaalaus', 'helsinki'],
  ['kattomaalaus', 'espoo'],
  ['kattomaalaus', 'vantaa'],
  ['ulkomaalaus', 'helsinki'],
  ['ulkomaalaus', 'espoo'],
  ['ulkomaalaus', 'vantaa'],
];

const serviceAngles: Record<string, string> = {
  'talon-maalaus':
    'Kokonaisuus alkaa pintojen kuntotarkastuksesta ja esityöarviosta. Pesu, irtoavan maalin poisto, korjaukset ja pohjustus tehdään ennen varsinaista maalausta kohteen tarpeen mukaan.',
  sisamaalaus:
    'Sisämaalauksessa huomioimme tilan käytön, pintamateriaalit, kalusteiden suojauksen ja asiakkaan aikataulun. Työ voidaan suunnitella koko asuntoon tai yksittäisiin huoneisiin.',
  julkisivumaalaus:
    'Julkisivumaalauksen tärkein vaihe on oikea esikäsittely. Arvioimme alustan, poistamme irtoavan pinnoitteen ja valitsemme julkisivulle sopivan pohjustuksen ja pintamaalin.',
  kattomaalaus:
    'Kattomaalauksessa tarkistamme katon materiaalin ja pinnan kunnon ennen työn aloittamista. Tarvittavat puhdistus-, kaapimis- ja pohjustustyöt tehdään ennen uutta pinnoitetta.',
  ulkomaalaus:
    'Ulkomaalaus suunnitellaan Suomen sääolosuhteisiin sopivaksi. Kohteen pesu, suojaus, esikäsittely ja maalaus ajoitetaan materiaalin ja sään mukaan kestävän lopputuloksen saavuttamiseksi.',
};

const cityAngles: Record<string, string> = {
  helsinki:
    'Helsingissä kohteiden ikä, rakennustyyppi ja ympäristö vaihtelevat paljon. Siksi arvio tehdään aina kohdekohtaisesti eikä pelkän neliömäärän perusteella.',
  espoo:
    'Espoossa palvelemme omakotitaloja, rivitaloja, asuntoja ja yritysten toimitiloja. Kohteen sijainti ja pintojen kunto huomioidaan jo tarjousvaiheessa.',
  vantaa:
    'Vantaalla palvelemme sekä pientaloja että yritys- ja kiinteistökohteita. Sovimme työn rajauksen, valmistelut ja aikataulun selkeästi ennen toteutusta.',
};

export const serviceLocationTargets: ServiceLocationTarget[] = targets.flatMap(([serviceSlug, citySlug]) => {
  const service = getService(serviceSlug);
  const city = getCity(citySlug);
  if (!service || !city) return [];

  const keyword = `${service.title.toLowerCase()} ${city.name}`;
  const slug = `${serviceSlug}-${citySlug}`;
  const serviceAngle = serviceAngles[serviceSlug] ?? service.description;
  const cityAngle = cityAngles[citySlug] ?? city.localFacts;

  return [{
    slug,
    serviceSlug,
    citySlug,
    keyword,
    title: `${service.title} ${city.name}`,
    description: `${service.title} ${city.locative} – kohdekohtainen arvio, huolellinen esikäsittely ja siisti toteutus. Maalaus Multiväri palvelee kotitalouksia, yrityksiä ja kiinteistöjä ${city.locative}. Pyydä ilmainen tarjous.`,
    intro: `${service.title} ${city.locative} suunnitellaan kohteen, pintamateriaalin ja aikataulun mukaan. ${city.description}`,
    localAngle: `${serviceAngle} ${cityAngle}`,
  }];
});

export const getServiceLocationTarget = (slug: string) =>
  serviceLocationTargets.find((target) => target.slug === slug);
