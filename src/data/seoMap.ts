/**
 * SEO metadata map.
 *
 * These are page targets, not claims about search volume or rankings.
 * Validate demand, CTR and rankings in Search Console / Keyword Planner
 * before expanding the map or creating additional location pages.
 */
export type SeoTarget = {
  primaryKeyword: string;
  secondaryKeywords: string[];
  title: string;
  description: string;
};

export const serviceSeoMap: Record<string, SeoTarget> = {
  ulkomaalaus: {
    primaryKeyword: 'ulkomaalaus',
    secondaryKeywords: ['talon maalaus', 'ulkomaalaus Uusimaa', 'omakotitalon maalaus'],
    title: 'Ulkomaalaus Uusimaa – talon maalaus ja pohjatyöt',
    description: 'Talon ulkomaalaus Vantaalla, Helsingissä, Espoossa ja muualla Uudellamaalla. Huolelliset pohjatyöt, selkeä tarjous ja maksuton arvio.',
  },
  kattomaalaus: {
    primaryKeyword: 'kattomaalaus',
    secondaryKeywords: ['peltikaton maalaus', 'katon maalaus', 'kattopinnoitus'],
    title: 'Kattomaalaus Uusimaa – peltikaton pesu ja maalaus',
    description: 'Peltikaton pesu, ruostekohtien käsittely ja kattomaalaus Uudellamaalla. Pyydä Maalaus Multiväriltä maksuton arvio kohteestasi.',
  },
  julkisivumaalaus: {
    primaryKeyword: 'julkisivumaalaus',
    secondaryKeywords: ['julkisivun maalaus', 'talon julkisivumaalaus', 'julkisivun huolto'],
    title: 'Julkisivumaalaus Uusimaa – puu- ja rappauspinnat',
    description: 'Julkisivumaalaus puu- ja rappauspinnoille Vantaalla, Helsingissä, Espoossa ja Uudellamaalla. Kuntoarvio, pohjatyöt ja maksuton tarjous.',
  },
  sisamaalaus: {
    primaryKeyword: 'sisämaalaus',
    secondaryKeywords: ['seinien maalaus', 'katon maalaus sisällä', 'sisämaalaus Uusimaa'],
    title: 'Sisämaalaus Uusimaa – seinät, katot ja kodit',
    description: 'Ammattimainen sisämaalaus koteihin, asuntoihin ja toimitiloihin Uudellamaalla. Seinät, katot, listat ja ovet. Pyydä maksuton tarjous.',
  },
  huoneistomaalaus: {
    primaryKeyword: 'huoneistomaalaus',
    secondaryKeywords: ['asunnon maalaus', 'asunnon sisämaalaus', 'huoneiston maalaus'],
    title: 'Huoneistomaalaus Uusimaa – asunnon maalaus',
    description: 'Huoneistomaalaus muuton, remontin tai kodin päivityksen yhteydessä Vantaalla, Helsingissä ja Espoossa. Pyydä maksuton arvio.',
  },
  toimistomaalaus: {
    primaryKeyword: 'toimistomaalaus',
    secondaryKeywords: ['toimitilojen maalaus', 'yrityksen maalaus', 'liiketilan maalaus'],
    title: 'Toimistomaalaus Uusimaa – toimistot ja toimitilat',
    description: 'Toimistomaalaus yrityksille Uudellamaalla. Toimistot ja toimitilat joustavasti myös iltaisin ja viikonloppuisin. Pyydä maksuton tarjous.',
  },
  'aidan-maalaus': {
    primaryKeyword: 'aidan maalaus',
    secondaryKeywords: ['puuaidan maalaus', 'portin maalaus', 'metalliaidan maalaus'],
    title: 'Aidan maalaus Uusimaa – puu- ja metalli-aidat',
    description: 'Aitojen ja porttien puhdistus, pohjustus ja maalaus Uudellamaalla. Suojaa pinta säältä ja uudista pihan ilme. Pyydä arvio.',
  },
  huoltomaalaus: {
    primaryKeyword: 'huoltomaalaus',
    secondaryKeywords: ['maalaushuolto', 'pintojen huoltomaalaus', 'kiinteistön maalaushuolto'],
    title: 'Huoltomaalaus Uusimaa – pintojen kunnossapito',
    description: 'Huoltomaalaus rakennusten pinnoille Uudellamaalla. Ehkäise suurempia korjauksia ja pidä maalipinnat kunnossa. Pyydä maksuton arvio.',
  },
  'julkisivun-pesu': {
    primaryKeyword: 'julkisivun pesu',
    secondaryKeywords: ['julkisivupesu', 'seinien pesu', 'julkisivun puhdistus'],
    title: 'Julkisivun pesu Uusimaa – puhdistus ennen huoltoa',
    description: 'Ammattimainen julkisivun pesu puu-, rappaus- ja tiilipinnoille Uudellamaalla. Poistamme lian ja kasvuston pinnalle sopivalla menetelmällä.',
  },
  'ikkunan-pesu': {
    primaryKeyword: 'ikkunanpesu',
    secondaryKeywords: ['ikkunoiden pesu', 'ikkunanpesu kotiin', 'ikkunanpesu yrityksille'],
    title: 'Ikkunanpesu Uusimaa – kotiin ja yrityksille',
    description: 'Ikkunoiden, karmien ja kehysten ammattimainen pesu koteihin, taloyhtiöihin ja yrityksille Uudellamaalla. Pyydä tarjous.',
  },
  kotisiivous: {
    primaryKeyword: 'kotisiivous',
    secondaryKeywords: ['siivouspalvelu kotiin', 'kodin siivous', 'kotisiivous Uusimaa'],
    title: 'Kotisiivous Uusimaa – siivouspalvelu kotiin',
    description: 'Luotettava kotisiivous Vantaalla, Helsingissä, Espoossa ja Uudellamaalla. Säännöllinen tai kertaluonteinen siivous. Pyydä tarjous.',
  },
  toimistosiivous: {
    primaryKeyword: 'toimistosiivous',
    secondaryKeywords: ['yrityssiivous', 'toimitilasiivous', 'toimiston siivous', 'yritysten siivouspalvelu'],
    title: 'Toimistosiivous Uusimaa – yritysten siivouspalvelu',
    description: 'Toimistosiivous ja yrityssiivous Vantaalla, Helsingissä ja Espoossa. Säännöllinen tai kertaluonteinen siivous joustavilla ajoilla. Pyydä tarjous.',
  },
  rakennussiivous: {
    primaryKeyword: 'rakennussiivous',
    secondaryKeywords: ['rakennuksen loppusiivous', 'rakennussiivouspalvelu', 'työmaasiivous'],
    title: 'Rakennussiivous Uusimaa – työmaa- ja loppusiivous',
    description: 'Rakennus- ja työmaakohteiden siivous Uudellamaalla ennen luovutusta tai seuraavaa työvaihetta. Pyydä tarjous kohteestasi.',
  },
  muuttosiivous: {
    primaryKeyword: 'muuttosiivous',
    secondaryKeywords: ['loppusiivous', 'muuton jälkeinen siivous', 'muuttosiivous Uusimaa'],
    title: 'Muuttosiivous Uusimaa – huoleton loppusiivous',
    description: 'Muuttosiivous ja loppusiivous Vantaalla, Helsingissä, Espoossa ja Uudellamaalla ennen asunnon luovutusta. Pyydä nopea tarjous.',
  },
  'paivakodin-siivous': {
    primaryKeyword: 'päiväkodin siivous',
    secondaryKeywords: ['päiväkotien siivous', 'hoivasiivous', 'tilojen siivous'],
    title: 'Päiväkodin siivous Uusimaa – puhtaat tilat',
    description: 'Päiväkotien siivouspalvelut Uudellamaalla huolellisesti ja sovitun aikataulun mukaan. Pyydä tarjous kohteellesi.',
  },
  'koulun-siivous': {
    primaryKeyword: 'koulun siivous',
    secondaryKeywords: ['koulujen siivous', 'oppilaitoksen siivous', 'tilasiivous'],
    title: 'Koulun siivous Uusimaa – oppilaitosten siivous',
    description: 'Koulujen ja oppilaitosten siivouspalvelut Uudellamaalla joustavilla aikatauluilla. Pyydä tarjous kohteellesi.',
  },
  'hoivakodin-siivous': {
    primaryKeyword: 'hoivakodin siivous',
    secondaryKeywords: ['hoivakotien siivous', 'hoivasiivous', 'tilojen puhtaanapito'],
    title: 'Hoivakodin siivous Uusimaa – puhtaanapito',
    description: 'Hoivakotien ja hoivakohteiden siivouspalvelut Uudellamaalla sovittuun tarpeeseen ja aikatauluun. Pyydä tarjous.',
  },
  'pihan-kunnostus': {
    primaryKeyword: 'pihan kunnostus',
    secondaryKeywords: ['terassin puhdistus', 'pihan siivous', 'terassin kunnostus'],
    title: 'Pihan ja terassin kunnostus Uusimaa',
    description: 'Pihan ja terassin puhdistus sekä kunnostuspalvelut Uudellamaalla. Pyydä arvio kohteestasi.',
  },
  kattosiivous: {
    primaryKeyword: 'kattosiivous',
    secondaryKeywords: ['katon puhdistus', 'katon pesu', 'kattopesu'],
    title: 'Kattosiivous Uusimaa – katon puhdistus ja pesu',
    description: 'Katon puhdistus ja pesu Uudellamaalla ammattimaisesti. Poistamme lian ja kasvuston pinnalle sopivalla menetelmällä. Pyydä arvio.',
  },
  'talon-maalaus': {
    primaryKeyword: 'talon maalaus',
    secondaryKeywords: ['omakotitalon maalaus', 'pientalon maalaus', 'talon maalaus Uusimaa'],
    title: 'Talon maalaus Uusimaa – omakotitalon maalaus',
    description: 'Omakoti- ja pientalon maalaus Vantaalla, Helsingissä, Espoossa ja Uudellamaalla. Huolelliset pohjatyöt, 2 vuoden työtakuu ja maksuton arvio.',
  },
  remonttisiivous: {
    primaryKeyword: 'remonttisiivous',
    secondaryKeywords: ['remontin jälkeinen siivous', 'loppusiivous remontin jälkeen', 'rakennussiivous'],
    title: 'Remonttisiivous Uusimaa – siivous remontin jälkeen',
    description: 'Perusteellinen remonttisiivous koteihin, asuntoihin ja toimitiloihin Uudellamaalla. Poistamme remonttipölyn ja työn jäljet. Pyydä tarjous.',
  },
};

export const locationSeoMap: Record<string, { primaryKeywords: string[]; title: string; description: string }> = {
  helsinki: {
    primaryKeywords: ['maalari Helsinki', 'maalaus Helsinki', 'talon maalaus Helsinki'],
    title: 'Maalari Helsinki – talon maalaus ja maalauspalvelut',
    description: 'Maalari Helsingissä: talon maalaus, ulkomaalaus, sisämaalaus ja julkisivumaalaus. Huolelliset pohjatyöt, 2 vuoden työtakuu ja maksuton arvio.',
  },
  vantaa: {
    primaryKeywords: ['maalari Vantaa', 'maalaus Vantaa', 'talon maalaus Vantaa'],
    title: 'Maalari Vantaa – talon maalaus ja maalauspalvelut',
    description: 'Paikallinen maalari Vantaalla: talon maalaus, ulkomaalaus, sisämaalaus ja julkisivumaalaus. 2 vuoden työtakuu ja maksuton arvio.',
  },
  espoo: {
    primaryKeywords: ['maalari Espoo', 'maalaus Espoo', 'talon maalaus Espoo'],
    title: 'Maalari Espoo – talon maalaus ja maalauspalvelut',
    description: 'Maalari Espoossa: omakotitalon maalaus, ulkomaalaus, sisämaalaus ja julkisivumaalaus. Huolelliset pohjatyöt ja maksuton arvio.',
  },
};
