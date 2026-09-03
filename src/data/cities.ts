import { images } from '@/config/images';

export type CityInfo = {
  slug: string;
  name: string;
  region: string;
  intro: string;
  description: string;
  highlights: string[];
  localFacts: string;
  image: string;
  locative: string;
  genitive: string;
};

export const cities: CityInfo[] = [
  {
    slug: 'helsinki',
    name: 'Helsinki',
    region: 'Uusimaa',
    locative: 'Helsingissä',
    genitive: 'Helsingin',
    intro:
      'Ammattimaista maalauspalvelua Helsingissä koteihin, taloyhtiöille ja yrityksille.',
    description:
      'Maalaus Multiväri palvelee koko Helsinkiä Kalliosta Munkkivuoreen ja Töölöstä Vuosaareen. Helsinkiläiset kohteet vaihtelevat historiallisista puutaloista moderneihin kerrostaloasuntoihin, ja jokainen kohde vaatii omanlaisensa pintakäsittelyn. Tunnemme Helsingin asuinkerrostalojen rappauspinnat, tiilijulkisivut ja puutaloalueiden erityisvaatimukset. Toimimme myös Helsingin keskusta-alueen toimitiloissa häiritsemättä yritysten arkea.',
    highlights: [
      'Kerrostalojen julkisivumaalaus ja pesu',
      'Puutaloalueiden perinteinen ulkomaalaus',
      'Toimistotilojen maalaus työajan ulkopuolella',
      'Asuntojen sisämaalaus muuton yhteydessä',
    ],
    localFacts:
      'Helsingin erilaiset rakennustyypit ja vaihtelevat sääolosuhteet asettavat maalipinnoille erityisiä vaatimuksia. Talven pakkaset, kevään kosteus ja vuodenaikojen vaihtelut korostavat oikean maalityypin ja ammattimaisen esikäsittelyn merkitystä.',
    image: images.cities.helsinki,
  },
  {
    slug: 'espoo',
    name: 'Espoo',
    region: 'Uusimaa',
    locative: 'Espoossa',
    genitive: 'Espoon',
    intro:
      'Laadukasta maalauspalvelua Espoossa — omakotitaloista kerrostaloihin ja toimitiloihin.',
    description:
      'Espoon laajat pientaloalueet ja kerrostalokeskukset Tapiolasta Matinkylään tarjoavat monipuolisia maalauskohteita. Maalaus Multiväri tekee Espoossa omakotitalojen ulkomaalausta, asuntojen sisämaalausta ja toimitilojen pintakäsittelyä. Työt suunnitellaan aina kohteen rakennustyypin ja pintamateriaalien mukaan.',
    highlights: [
      'Omakotitalojen ulkomaalaus ja julkisivun hoito',
      'Tapiolan ja Otaniemen kohteiden maalaus',
      'Rivitalojen yhteismaalaukset taloyhtiöille',
      'Sisämaalaus kerrostaloasunnoissa',
    ],
    localFacts:
      'Espoon rannikko- ja meriympäristö sekä vaihtelevat sääolosuhteet asettavat ulkomaalaukselle erityisiä vaatimuksia. Oikea maalityyppi, huolellinen esikäsittely ja laadukas pintakäsittely auttavat varmistamaan kestävän lopputuloksen.',
    image: images.cities.espoo,
  },
  {
  slug: 'vantaa',
  name: 'Vantaa',
  region: 'Uusimaa',
  locative: 'Vantaalla',
  genitive: 'Vantaan',
  intro:
    'Paikallinen maalari Vantaalla koteihin, taloyhtiöille ja yrityksille.',
  description:
    'Maalaus Multivärin kotikaupunki on Vantaa, ja palvelemme koko kaupungin aluetta Tikkurilasta Myyrmäkeen ja Hakunilasta Aviapolikseen. Vantaan kerrostaloasunnot, omakotitalot ja toimitilat ovat tyypillisiä maalauskohteita. Toteutamme talon maalausta, ulko- ja sisämaalausta sekä julkisivumaalausta kohteen materiaalin ja kunnon mukaan.',
  highlights: [
    'Vantaan kerrostalojen ja asuntojen sisämaalaus',
    'Omakotitalojen ulkomaalaus Tikkurilan ja Myyrmäen alueella',
    'Toimitilojen ja yrityskohteiden maalaus lentoaseman tuntumassa',
    'Paikallinen yritys ja kohdekohtainen arvio',
  ],
  localFacts:
    'Vantaalla on monipuolisesti kerrostalo-, rivitalo- ja pientaloalueita sekä runsaasti toimitiloja. Paikallinen palvelu mahdollistaa joustavan yhteydenpidon ja kohteen arvioinnin eri puolilla kaupunkia.',
  image: images.cities.vantaa,
 },
  {
    slug: 'kauniainen',
    name: 'Kauniainen',
    region: 'Uusimaa',
    locative: 'Kauniaisissa',
    genitive: 'Kauniaisten',
    intro:
      'Premium-tason maalauspalvelua Kauniaisissa — arvoasuntojen hienomaalausta.',
    description:
      'Kauniainen on tunnettu viihtyisistä pientaloalueistaan ja arvoasunnoistaan. Maalaus Multiväri tarjoaa Kauniaisissa huolellista maalauspalvelua: hienomaalausta arvoasuntoihin, omakotitalojen ulkomaalausta ja julkisivujen pintakäsittelyä. Kiinnitämme erityistä huomiota valmisteluun, yksityiskohtiin ja siistiin lopputulokseen.',
    highlights: [
      'Arvoasuntojen hienomaalaus',
      'Omakotitalojen ulkomaalaus ja listojen maalaus',
      'Julkisivujen pesu ja pinnoitus',
      'Värikonsultaatio ja näytemaalaus',
    ],
    localFacts:
      'Kauniaisten pientaloissa laadukas pintakäsittely ja yksityiskohtien huolellinen viimeistely ovat erityisen tärkeitä. Oikea maalityyppi, hyvä esikäsittely ja siisti työnjälki muodostavat kestävän kokonaisuuden.',
    image: images.cities.kauniainen,
  },
  {
    slug: 'kirkkonummi',
    name: 'Kirkkonummi',
    region: 'Uusimaa',
    locative: 'Kirkkonummella',
    genitive: 'Kirkkonummen',
    intro:
      'Maalaus- ja siivouspalvelua Kirkkonummella — rannikko-olosuhteisiin tottunut tiimi.',
    description:
      'Kirkkonummen laaja alue rannikolta sisämaahan tarjoaa monipuolisia maalauskohteita. Maalaus Multiväri tekee Kirkkonummella omakotitalojen ulkomaalausta, asuntojen sisämaalausta ja toimitilojen pintakäsittelyä. Rannikkoalueiden kohteissa huomioimme erityisesti rakennuksen pintamateriaalin ja sääolosuhteet.',
    highlights: [
      'Rannikkoalueen omakotitalojen ulkomaalaus',
      'Kirkkonummen asuntojen sisämaalaus',
      'Puujulkisivujen pesu ja hoito',
      'Aitojen ja porttien maalaus',
    ],
    localFacts:
      'Kirkkonummen rannikkoalueiden meri-ilmasto ja vaihtelevat sääolosuhteet voivat asettaa ulkomaalaukselle erityisiä vaatimuksia. Huolellinen esikäsittely ja oikeiden materiaalien käyttö ovat tärkeä osa kestävää lopputulosta.',
    image: images.cities.kirkkonummi,
  },
  {
    slug: 'kerava',
    name: 'Kerava',
    region: 'Uusimaa',
    locative: 'Keravalla',
    genitive: 'Keravan',
    intro:
      'Nopeaa ja ammattimaista maalauspalvelua Keravan asukkaille ja yrityksille.',
    description:
      'Kerava on Helsingin lähialueen kaupunki, jonka asukkaille tarjoamme maalaus- ja siivouspalveluita. Teemme Keravalla kerrostaloasuntojen sisämaalausta, omakotitalojen ulkomaalausta ja toimitilojen pintakäsittelyä. Työt suunnitellaan kohteen tarpeiden ja asiakkaan aikataulun mukaan.',
    highlights: [
      'Kerrostaloasuntojen sisämaalaus ja muuttosiivous',
      'Omakotitalojen ulkomaalaus',
      'Toimitilojen maalaus',
      'Julkisivujen pesu ja hoito',
    ],
    localFacts:
      'Keravan asuinalueilla on monipuolisesti kerrostaloja, rivitaloja ja pientaloja. Kohteen rakennustyyppi ja pintamateriaali huomioidaan aina työn suunnittelussa, jotta lopputulos on siisti ja kestävä.',
    image: images.cities.kerava,
  },
  {
    slug: 'jarvenpaa',
    name: 'Järvenpää',
    region: 'Uusimaa',
    locative: 'Järvenpäässä',
    genitive: 'Järvenpään',
    intro:
      'Maalaus- ja siivouspalvelua Järvenpäässä — pientaloalueiden ja kerrostalojen kumppani.',
    description:
      'Järvenpään pientaloalueet ja kerrostalokeskukset tarjoavat monipuolisia maalauskohteita. Maalaus Multiväri tekee Järvenpäässä omakotitalojen ulkomaalausta, asuntojen sisämaalausta ja toimitilojen pintakäsittelyä. Toimimme koko Järvenpään alueella ja suunnittelemme työn kohteen mukaan.',
    highlights: [
      'Pientalojen ulkomaalaus ja julkisivun hoito',
      'Kerrostaloasuntojen sisämaalaus',
      'Aitojen ja porttien maalaus',
      'Muuttosiivous ja rakennussiivous',
    ],
    localFacts:
      'Järvenpään pientaloalueet tarjoavat paljon erilaisia ulkomaalauskohteita. Rakennuksen pintamateriaali, kunto ja sääolosuhteet huomioidaan työn valmistelussa ja materiaalien valinnassa.',
    image: images.cities.jarvenpaa,
  },
  {
    slug: 'hyvinkaa',
    name: 'Hyvinkää',
    region: 'Uusimaa',
    locative: 'Hyvinkäällä',
    genitive: 'Hyvinkään',
    intro:
      'Maalaus- ja siivouspalvelua Hyvinkäällä — teollisuus- ja asuinkohteisiin.',
    description:
      'Hyvinkään teollisuusalueet ja asuinalueet tarjoavat monipuolisia maalauskohteita. Maalaus Multiväri tekee Hyvinkäällä teollisuustilojen maalausta, toimitilojen pintakäsittelyä, asuntojen sisämaalausta ja omakotitalojen ulkomaalausta. Yrityksille tarjoamme joustavaa palvelua ja kotitalouksille huolellista sisä- ja ulkomaalausta.',
    highlights: [
      'Teollisuus- ja toimitilojen maalaus',
      'Omakotitalojen ulkomaalaus',
      'Asuntojen sisämaalaus',
      'Julkisivujen pesu ja hoito',
    ],
    localFacts:
      'Hyvinkään erilaiset teollisuus-, toimitila- ja asuinkohteet vaativat erilaisia pintakäsittelyratkaisuja. Työssä huomioidaan kohteen käyttötarkoitus, pintamateriaali ja vaadittu kestävyys.',
    image: images.cities.hyvinkaa,
  },
  {
    slug: 'nurmijarvi',
    name: 'Nurmijärvi',
    region: 'Uusimaa',
    locative: 'Nurmijärvellä',
    genitive: 'Nurmijärven',
    intro:
      'Maalauspalvelua Nurmijärvelle — pientaloalueiden kumppani.',
    description:
      'Nurmijärven laajat pientaloalueet Klaukkalasta Rajamäkeen tarjoavat monipuolisia maalauskohteita. Maalaus Multiväri tekee Nurmijärvellä omakotitalojen ulkomaalausta, sisämaalausta, aitojen maalausta ja julkisivujen pesua. Toimimme koko Nurmijärven alueella.',
    highlights: [
      'Omakotitalojen ulkomaalaus',
      'Sisämaalaus ja huoneistomaalaus',
      'Aitojen ja porttien maalaus',
      'Julkisivujen pesu ja hoito',
    ],
    localFacts:
      'Nurmijärven pientaloalueet ovat laajoja, ja omakotitalojen ulkomaalaus on yksi tyypillisistä kohteistamme. Paikalliset sääolosuhteet ja rakennuksen pintamateriaali huomioidaan työn suunnittelussa.',
    image: images.cities.nurmijarvi,
  },
  {
    slug: 'sipoo',
    name: 'Sipoo',
    region: 'Uusimaa',
    locative: 'Sipoossa',
    genitive: 'Sipoon',
    intro:
      'Maalauspalvelua Sipoolle — rannikko- ja maaseutualueiden erityisosaajana.',
    description:
      'Sipoon rannikko- ja maaseutualueet vaativat tottunutta tiimiä. Maalaus Multiväri tekee Sipoossa omakotitalojen ulkomaalausta, rannikkoalueiden puujulkisivujen pintakäsittelyä ja sisämaalausta. Sipoon asukkaat voivat luottaa paikalliseen tuntemukseen ja joustavaan palveluun.',
    highlights: [
      'Rannikkoalueiden omakotitalojen ulkomaalaus',
      'Puujulkisivujen pesu ja hoito',
      'Sisämaalaus ja huoneistomaalaus',
      'Aitojen ja porttien maalaus',
    ],
    localFacts:
      'Sipoon rannikkoalueiden meri-ilmasto ja maaseutualueiden vaihtelevat sääolosuhteet asettavat ulkomaalaukselle erityisvaatimuksia. Paikallinen tuntemus ja huolellinen esikäsittely ovat tärkeä osa laadukasta lopputulosta.',
    image: images.cities.sipoo,
  },
];

export const getCity = (slug: string) =>
  cities.find((city) => city.slug === slug);
