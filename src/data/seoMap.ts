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
    title: 'Ulkomaalaus – talon maalaus Uudellamaalla',
    description: 'Ammattimainen ulkomaalaus ja talon maalaus Uudellamaalla. Huolellinen esikäsittely, pohjustus ja kestävä maalipinta. Pyydä ilmainen tarjous.',
  },
  kattomaalaus: {
    primaryKeyword: 'kattomaalaus',
    secondaryKeywords: ['peltikaton maalaus', 'katon maalaus', 'kattopinnoitus'],
    title: 'Kattomaalaus – katon pesu ja pinnoitus',
    description: 'Kattomaalaus, katon pesu ja pinnoitus ammattimaisesti. Pyydä Maalaus Multiväriltä ilmainen arvio kohteestasi Uudellamaalla.',
  },
  julkisivumaalaus: {
    primaryKeyword: 'julkisivumaalaus',
    secondaryKeywords: ['julkisivun maalaus', 'talon julkisivumaalaus', 'julkisivun huolto'],
    title: 'Julkisivumaalaus Uusimaa – pyydä arvio',
    description: 'Julkisivumaalaus puu-, rappaus- ja tiilipinnoille Uudellamaalla. Kuntoarvio, pesu, pohjatyöt ja pintamaalaus kohteen mukaan. Pyydä maksuton arvio.',
  },
  sisamaalaus: {
    primaryKeyword: 'sisämaalaus',
    secondaryKeywords: ['seinien maalaus', 'katon maalaus sisällä', 'sisämaalaus Uusimaa'],
    title: 'Sisämaalaus – seinien ja kattojen maalaus',
    description: 'Siisti ja ammattimainen sisämaalaus koteihin, asuntoihin ja toimitiloihin. Seinät, katot, listat ja ovet. Pyydä ilmainen tarjous.',
  },
  huoneistomaalaus: {
    primaryKeyword: 'huoneistomaalaus',
    secondaryKeywords: ['asunnon maalaus', 'asunnon sisämaalaus', 'huoneiston maalaus'],
    title: 'Huoneistomaalaus – asunnon maalaus',
    description: 'Huoneistomaalaus muuton, remontin tai kodin päivityksen yhteydessä. Koko asunto tai yksittäiset huoneet ammattimaisesti.',
  },
  toimistomaalaus: {
    primaryKeyword: 'toimistomaalaus',
    secondaryKeywords: ['toimitilojen maalaus', 'yrityksen maalaus', 'liiketilan maalaus'],
    title: 'Toimistomaalaus – toimitilojen maalaus',
    description: 'Toimistojen ja toimitilojen maalaus joustavasti myös iltaisin ja viikonloppuisin. Pyydä yrityksellesi tarjous.',
  },
  'aidan-maalaus': {
    primaryKeyword: 'aidan maalaus',
    secondaryKeywords: ['puuaidan maalaus', 'portin maalaus', 'metalliaidan maalaus'],
    title: 'Aidan maalaus – puu- ja metalli-aidat',
    description: 'Aitojen ja porttien puhdistus, pohjustus ja maalaus. Siisti tapa uudistaa pihan ilme ja suojata pinnat säältä.',
  },
  huoltomaalaus: {
    primaryKeyword: 'huoltomaalaus',
    secondaryKeywords: ['maalaushuolto', 'pintojen huoltomaalaus', 'kiinteistön maalaushuolto'],
    title: 'Huoltomaalaus – pintojen kunnossapito',
    description: 'Huoltomaalaus auttaa pitämään rakennuksen pinnat kunnossa ja ehkäisemään suurempia korjauksia. Pyydä arvio kohteesta.',
  },
  'julkisivun-pesu': {
    primaryKeyword: 'julkisivun pesu',
    secondaryKeywords: ['julkisivupesu', 'seinien pesu', 'julkisivun puhdistus'],
    title: 'Julkisivun pesu – puhdas ja hoidettu julkisivu',
    description: 'Ammattimainen julkisivun pesu puu-, rappaus- ja tiilipinnoille. Poistamme lian, levän ja sammaleen oikeilla menetelmillä.',
  },
  'ikkunan-pesu': {
    primaryKeyword: 'ikkunanpesu',
    secondaryKeywords: ['ikkunoiden pesu', 'ikkunanpesu kotiin', 'ikkunanpesu yrityksille'],
    title: 'Ikkunanpesu – kotiin, taloyhtiöön ja yrityksille',
    description: 'Ikkunoiden, karmien ja kehysten ammattimainen pesu koteihin, taloyhtiöihin ja yrityksille.',
  },
  kotisiivous: {
    primaryKeyword: 'kotisiivous',
    secondaryKeywords: ['siivouspalvelu kotiin', 'kodin siivous', 'kotisiivous Uusimaa'],
    title: 'Kotisiivous – siivouspalvelu kotiin',
    description: 'Luotettava kotisiivous kotiin Uudellamaalla. Säännöllinen tai kertaluonteinen siivous. Pyydä helposti tarjous.',
  },
  toimistosiivous: {
    primaryKeyword: 'toimistosiivous',
    secondaryKeywords: ['yrityssiivous', 'toimitilasiivous', 'toimiston siivous'],
    title: 'Toimistosiivous – yritysten siivouspalvelu',
    description: 'Säännöllinen ja kertaluonteinen toimistosiivous yrityksille. Joustavat ajat ja selkeä tarjous.',
  },
  rakennussiivous: {
    primaryKeyword: 'rakennussiivous',
    secondaryKeywords: ['rakennuksen loppusiivous', 'rakennussiivouspalvelu', 'työmaasiivous'],
    title: 'Rakennussiivous – työmaiden siivous',
    description: 'Rakennus- ja työmaakohteiden siivous ennen luovutusta tai seuraavaa työvaihetta. Pyydä tarjous kohteestasi.',
  },
  muuttosiivous: {
    primaryKeyword: 'muuttosiivous',
    secondaryKeywords: ['loppusiivous', 'muuton jälkeinen siivous', 'muuttosiivous Uusimaa'],
    title: 'Muuttosiivous – huoleton loppusiivous',
    description: 'Muuttosiivous ja loppusiivous ennen muuttoa tai asunnon luovutusta. Pyydä nopea tarjous.',
  },
  'paivakodin-siivous': {
    primaryKeyword: 'päiväkodin siivous',
    secondaryKeywords: ['päiväkotien siivous', 'hoivasiivous', 'tilojen siivous'],
    title: 'Päiväkodin siivous – puhtaat ja turvalliset tilat',
    description: 'Päiväkotien siivouspalvelut huolellisesti ja sovitun aikataulun mukaan. Pyydä tarjous kohteellesi.',
  },
  'koulun-siivous': {
    primaryKeyword: 'koulun siivous',
    secondaryKeywords: ['koulujen siivous', 'oppilaitoksen siivous', 'tilasiivous'],
    title: 'Koulun siivous – siivouspalvelu oppilaitoksille',
    description: 'Koulujen ja oppilaitosten siivouspalvelut joustavilla aikatauluilla. Pyydä tarjous.',
  },
  'hoivakodin-siivous': {
    primaryKeyword: 'hoivakodin siivous',
    secondaryKeywords: ['hoivakotien siivous', 'hoivasiivous', 'tilojen puhtaanapito'],
    title: 'Hoivakodin siivous – puhtaanapito hoivakohteisiin',
    description: 'Hoivakotien ja hoivakohteiden siivouspalvelut sovittuun tarpeeseen ja aikatauluun.',
  },
  'pihan-kunnostus': {
    primaryKeyword: 'pihan kunnostus',
    secondaryKeywords: ['terassin puhdistus', 'pihan siivous', 'terassin kunnostus'],
    title: 'Pihan ja terassin kunnostus',
    description: 'Pihan ja terassin puhdistus sekä kunnostuspalvelut. Pyydä arvio kohteestasi.',
  },
  kattosiivous: {
    primaryKeyword: 'kattosiivous',
    secondaryKeywords: ['katon puhdistus', 'katon pesu', 'kattopesu'],
    title: 'Kattosiivous – katon puhdistus ja pesu',
    description: 'Katon puhdistus ja pesu ammattimaisesti. Poistamme lian ja kasvuston oikeilla menetelmillä.',
  },
  'talon-maalaus': {
    primaryKeyword: 'talon maalaus',
    secondaryKeywords: ['omakotitalon maalaus', 'pientalon maalaus', 'talon maalaus Uusimaa'],
    title: 'Talon maalaus Uusimaa – pyydä maksuton arvio',
    description: 'Omakoti- ja pientalon maalaus Vantaalla, Helsingissä, Espoossa ja Uudellamaalla. Kuntoarvio, huolelliset pohjatyöt ja selkeä tarjous.',
  },
  yrityssiivous: {
    primaryKeyword: 'yrityssiivous',
    secondaryKeywords: ['toimistosiivous', 'toimitilasiivous', 'yrityksen siivous'],
    title: 'Yrityssiivous – siivouspalvelu yrityksille',
    description: 'Yrityssiivous toimistoihin ja toimitiloihin säännöllisesti tai kertaluonteisesti. Joustava aikataulu ja selkeä tarjous Helsingissä, Espoossa, Vantaalla ja Uudellamaalla.',
  },
  remonttisiivous: {
    primaryKeyword: 'remonttisiivous',
    secondaryKeywords: ['remontin jälkeinen siivous', 'loppusiivous remontin jälkeen', 'rakennussiivous'],
    title: 'Remonttisiivous – puhdas tila remontin jälkeen',
    description: 'Perusteellinen remonttisiivous koteihin, asuntoihin ja toimitiloihin. Poistamme remonttipölyn ja työn jäljet ennen käyttöönottoa tai luovutusta. Pyydä tarjous.',
  },
};

export const locationSeoMap: Record<string, { primaryKeywords: string[]; title: string; description: string }> = {
  helsinki: {
    primaryKeywords: ['maalari Helsinki', 'maalaus Helsinki', 'talon maalaus Helsinki'],
    title: 'Maalari Helsinki – talon maalaus',
    description: 'Maalari Helsingissä talon maalaukseen, ulko-, sisä- ja julkisivumaalaukseen. Kohdekohtaiset pohjatyöt ja maksuton arvio Maalaus Multiväriltä.',
  },
  vantaa: {
    primaryKeywords: ['maalari Vantaa', 'maalaus Vantaa', 'talon maalaus Vantaa'],
    title: 'Maalari Vantaa – talon maalaus',
    description: 'Paikallinen maalari Vantaalla: talon maalaus, ulko-, sisä- ja julkisivumaalaus koteihin, taloyhtiöille ja yrityksille. Pyydä maksuton arvio.',
  },
  espoo: {
    primaryKeywords: ['maalari Espoo', 'maalaus Espoo', 'talon maalaus Espoo'],
    title: 'Maalari Espoo – talon maalaus',
    description: 'Maalari Espoossa omakotitaloihin, asuntoihin, taloyhtiöille ja yrityksille. Ulko-, sisä- ja julkisivumaalaus sekä maksuton arvio.',
  },
};
