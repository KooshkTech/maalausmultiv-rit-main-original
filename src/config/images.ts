/**
 * Central image manifest — every image path in the site is defined here.
 *
 * To replace an image: swap the file in public/images/ with the same filename.
 * To change which file a slot points to: edit only this file.
 *
 * All images use local files (no remote CDN). Paths are relative to the
 * web root, so they work on both the Vite dev server and HostGator (Apache).
 */

const BASE = '/images';

export type ImageMeta = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const images = {
  hero: {
    main: `${BASE}/hero/hero-house-painting.webp`,
    mobile: `${BASE}/hero/hero-house-painting.webp`,
    team: `${BASE}/hero/hero-painters-team.webp`,
    nordicHouse: `${BASE}/hero/hero-nordic-house.webp`,
  },
  og: `${BASE}/hero/og-share.webp`,
  favicon: '/favicon.svg',
  logo: '/OY.png',
  logoDark: '/OY.png',

  services: {
    ulkomaalaus: `${BASE}/services/exterior-painting.webp`,
    kattomaalaus: `${BASE}/services/roof-painting.webp`,
    julkisivumaalaus: `${BASE}/services/facade-painting.webp`,
    sisamaalaus: `${BASE}/services/interior-painting.webp`,
    huoneistomaalaus: `${BASE}/services/apartment-painting.webp`,
    toimistomaalaus: `${BASE}/services/office-painting.webp`,
    aidanMaalaus: `${BASE}/services/fence-painting.webp`,
    huoltomaalaus: `${BASE}/services/maintenance-painting.webp`,
    julkisivunPesu: `${BASE}/services/facade-washing.webp`,
    ikkunanPesu: `${BASE}/services/window-cleaning.webp`,
    kotisiivous: `${BASE}/services/home-cleaning.webp`,
    toimistosiivous: `${BASE}/services/office-cleaning.webp`,
    rakennussiivous: `${BASE}/services/construction-cleaning.webp`,
    muuttosiivous: `${BASE}/services/move-cleaning.webp`,
    paivakodinSiivous: `${BASE}/services/daycare-cleaning.webp`,
    koulunSiivous: `${BASE}/services/school-cleaning.webp`,
    hoivakodinSiivous: `${BASE}/services/elderly-care-cleaning.webp`,
    pihanKunnostus: `${BASE}/services/yard-restoration.webp`,
    kattosiivous: `${BASE}/services/roof-cleaning.webp`,
  },

  pages: {
    about: `${BASE}/hero/about-page.webp`,
    blog: `${BASE}/hero/blog-page.webp`,
    cleaning: `${BASE}/hero/cleaning-page.webp`,
    contact: `${BASE}/hero/contact-page.webp`,
    projects: `${BASE}/hero/projects-page.webp`,
    reviews: `${BASE}/hero/reviews-page.webp`,
    services: `${BASE}/hero/services-page.webp`,
    calculator: `${BASE}/hero/calculator-page.webp`,
  },

  cities: {
    helsinki: `${BASE}/cities/helsinki.webp`,
    espoo: `${BASE}/cities/espoo.webp`,
    vantaa: `${BASE}/cities/vantaa.webp`,
    kauniainen: `${BASE}/cities/kauniainen.webp`,
    kirkkonummi: `${BASE}/cities/kirkkonummi.webp`,
    kerava: `${BASE}/cities/kerava.webp`,
    jarvenpaa: `${BASE}/cities/jarvenpaa.webp`,
    hyvinkaa: `${BASE}/cities/hyvinkaa.webp`,
    nurmijarvi: `${BASE}/cities/nurmijarvi.webp`,
    sipoo: `${BASE}/cities/sipoo.webp`,
  },

  about: {
    portrait: `${BASE}/team/team-portrait.webp`,
    team: `${BASE}/team/team-group.webp`,
  },

  projects: {
    'project-01': `${BASE}/projects/exterior-house-painting.webp`,
    'project-02': `${BASE}/projects/roof-coating.webp`,
    'project-03': `${BASE}/projects/facade-painting-apartment.webp`,
    'project-04': `${BASE}/projects/fence-painting.webp`,
    'project-05': `${BASE}/projects/interior-painting-home.webp`,
    'project-06': `${BASE}/projects/office-painting.webp`,
    'project-07': `${BASE}/projects/apartment-painting.webp`,
    'project-08': `${BASE}/projects/window-cleaning.webp`,
    'project-09': `${BASE}/projects/office-cleaning.webp`,
    'project-10': `${BASE}/projects/move-cleaning.webp`,
    'project-11': `${BASE}/projects/construction-cleaning.webp`,
    'project-12': `${BASE}/projects/roof-cleaning.webp`,
  },

  beforeAfter: {
    'ba-01-before': `${BASE}/before-after/interior-before.webp`,
    'ba-01-after': `${BASE}/before-after/interior-after.webp`,
    'ba-02-before': `${BASE}/before-after/exterior-before.webp`,
    'ba-02-after': `${BASE}/before-after/exterior-after.webp`,
    'ba-03-before': `${BASE}/before-after/apartment-before.webp`,
    'ba-03-after': `${BASE}/before-after/apartment-after.webp`,
    'ba-04-before': `${BASE}/before-after/facade-before.webp`,
    'ba-04-after': `${BASE}/before-after/facade-after.webp`,
    'ba-05-before': `${BASE}/before-after/office-before.webp`,
    'ba-05-after': `${BASE}/before-after/office-after.webp`,
    'ba-06-before': `${BASE}/before-after/office-cleaning-before.webp`,
    'ba-06-after': `${BASE}/before-after/office-cleaning-after.webp`,
    'ba-07-before': `${BASE}/before-after/move-cleaning-before.webp`,
    'ba-07-after': `${BASE}/before-after/move-cleaning-after.webp`,
    'ba-08-before': `${BASE}/before-after/construction-cleaning-before.webp`,
    'ba-08-after': `${BASE}/before-after/construction-cleaning-after.webp`,
    'ba-09-before': `${BASE}/before-after/fence-before.webp`,
    'ba-09-after': `${BASE}/before-after/fence-after.webp`,
  },

  blog: {
    'ulkomaalauksen-ajankohta': `${BASE}/blog/painting-timing.webp`,
    'julkisivun-hoito-ja-pesu': `${BASE}/blog/facade-care.webp`,
    'mita-valita-puunsuoja-tiili': `${BASE}/blog/paint-types.webp`,
    'valitse-vari-julkisivuun': `${BASE}/blog/choose-color.webp`,
    'sisamaalauksen-kustannukset': `${BASE}/blog/interior-painting-cost.webp`,
    'tapetin-poisto-ja-pinnan-valmistelu': `${BASE}/blog/wallpaper-removal.webp`,
    'kattomaalauksen-tarve': `${BASE}/blog/roof-painting-guide.webp`,
  },
} as const;

/** Descriptive alt text for every image slot, keyed the same as `images`. */
export const altText: Record<string, string> = {
  'hero/main': 'Ammattimaalari maalaamassa puutalon julkisivua rullalla Uudellamaalla',
  'hero/mobile': 'Ammattimaalarit maalaamassa puutalon julkisivua',
  'hero/team': 'Maalari maalaamassa talon julkisivua ulkona',
  'hero/nordicHouse': 'Pohjoismainen puutalo ulkomaalauksen jälkeen',

  'services/ulkomaalaus': 'Ulkomaalaus — ammattilaiset maalaamassa talon julkisivua',
  'services/kattomaalaus': 'Kattomaalaus — peltokaton pinnoitus ja kunnostus',
  'services/julkisivumaalaus': 'Julkisivumaalaus — rappauspinnan maalaus',
  'services/sisamaalaus': 'Sisämaalaus — seinien maalaus rullalla',
  'services/huoneistomaalaus': 'Huoneistomaalaus — asunnon sisämaalaus',
  'services/toimistomaalaus': 'Toimistomaalaus — toimitilojen maalaus',
  'services/aidanMaalaus': 'Aidan maalaus — puuaidan maalaus siveltimellä',
  'services/huoltomaalaus': 'Huoltomaalaus — pintojen kunnossapito',
  'services/julkisivunPesu': 'Julkisivun pesu — painepesu ja puhdistus',
  'services/ikkunanPesu': 'Ikkunanpesu — ammattimainen ikkunoiden puhdistus',
  'services/kotisiivous': 'Kotisiivous — ammattimainen kotisiivous',
  'services/toimistosiivous': 'Toimistosiivous — toimitilojen siivous',
  'services/rakennussiivous': 'Rakennussiivous — loppusiivous valmiissa kohteessa',
  'services/muuttosiivous': 'Muuttosiivous — asunnon siivous muuton yhteydessä',
  'services/paivakodinSiivous': 'Päiväkodin siivous — turvallinen ja hellävarainen',
  'services/koulunSiivous': 'Koulun siivous — oppilaitosten siivous',
  'services/hoivakodinSiivous': 'Hoivakodin siivous — herkkä ja ammattimainen',
  'services/pihanKunnostus': 'Pihan kunnostus — terassin ja piha-alueen pesu',
  'services/kattosiivous': 'Katon siivous — sammaleen poisto katolta',

  'pages/about': 'Maalaus Multivärin tiimi työssä',
  'pages/blog': 'Sisämaalaus — seinien maalaus rullalla',
  'pages/cleaning': 'Ammattimainen siivouspalvelu',
  'pages/contact': 'Yhteystiedot — Maalaus Multiväri',
  'pages/projects': 'Ulkomaalausprojekti — puutalon maalaus',
  'pages/reviews': 'Asiakastyytyväisyys — kädenpuristus sopimuksen jälkeen',
  'pages/services': 'Maalaus- ja siivouspalvelut',
  'pages/calculator': 'Maalaustarvikkeet — rullat, siveltimet ja maalit',

  'cities/helsinki': 'Helsinki — kaupunkinäkymä Tuomiokirkolta',
  'cities/espoo': 'Espoo — merenläheinen asuinalue',
  'cities/vantaa': 'Vantaa — tiilitalo kaupungin alueella',
   'cities/kauniainen': 'Kauniainen — Uudenmaan pientaloalue',
   'cities/kirkkonummi': 'Kirkkonummi — Uudenmaan rannikkoalueen asuinympäristö',
   'cities/kerava': 'Kerava — Uudenmaan asuinalue',
   'cities/jarvenpaa': 'Järvenpää — Uudenmaan asuinalue',
   'cities/hyvinkaa': 'Hyvinkää — Uudenmaan asuinympäristö',
   'cities/nurmijarvi': 'Nurmijärvi — Uudenmaan pientaloalue',
   'cities/sipoo': 'Sipoo — Uudenmaan pientalo- ja maaseutuympäristö',

  'about/portrait': 'Maalaus Multivärin ammattimaalari työssä',
  'about/team': 'Maalaus Multivärin maalari työssä julkisivun parissa',

  'projects/project-01': 'Omakotitalon ulkomaalaus Helsingissä',
  'projects/project-02': 'Peltokaton pinnoitus Espoossa',
  'projects/project-03': 'Rapatun julkisivun maalaus kerrostalossa',
  'projects/project-04': 'Puuaidan ja portin maalaus Vantaalla',
  'projects/project-05': 'Sisämaalaus omakotitalossa Kirkkonummella',
  'projects/project-06': 'Toimistomaalaus viikonloppuna Helsingissä',
  'projects/project-07': 'Huoneistomaalaus muuton yhteydessä Vantaalla',
  'projects/project-08': 'Kerrostalon ikkunoiden pesu Helsingissä',
  'projects/project-09': 'Toimistosiivous säännöllisellä sopimuksella Espoossa',
  'projects/project-10': 'Muuttosiivous Vantaalla',
  'projects/project-11': 'Rakennussiivous valmiissa kohteessa Hyvinkäällä',
  'projects/project-12': 'Katon siivous ja sammaleen poisto Järvenpäässä',

  'blog/ulkomaalauksen-ajankohta': 'Ulkomaalaus — oikea ajankohta on ratkaiseva',
  'blog/julkisivun-hoito-ja-pesu': 'Julkisivun hoito ja painepesu',
  'blog/mita-valita-puunsuoja-tiili': 'Maalityypin valinta — tarvikkeet ja työkalut',
  'blog/valitse-vari-julkisivuun': 'Värin valinta julkisivuun',
  'blog/sisamaalauksen-kustannukset': 'Sisämaalaus — seinien maalaus rullalla',
  'blog/tapetin-poisto-ja-pinnan-valmistelu': 'Tapetin poisto ja pinnan valmistelu',
  'blog/kattomaalauksen-tarve': 'Peltokaton pinnoitus ja kunnostus',
};

/** Default dimensions per image category (for width/height attributes). */
export const defaultDimensions = {
  hero: { width: 1920, height: 1280 },
  services: { width: 800, height: 600 },
  pages: { width: 1920, height: 1080 },
  cities: { width: 1920, height: 1080 },
  about: { width: 900, height: 1100 },
  projects: { width: 900, height: 700 },
  beforeAfter: { width: 900, height: 700 },
  blog: { width: 900, height: 600 },
} as const;

/**
 * Resolve an image path by dot-notation key (e.g. 'services/sisamaalaus').
 * Returns the local file path — no remote fallbacks.
 */
export function img(key: string): string {
  const parts = key.split('/');
  let current: Record<string, unknown> = images as unknown as Record<string, unknown>;
  for (const part of parts) {
    if (current[part] === undefined) return '';
    current = current[part] as Record<string, unknown>;
  }
  return typeof current === 'string' ? current : '';
}

/** Get alt text for an image key. */
export function alt(key: string): string {
  return altText[key] ?? '';
}

/** Get dimensions for an image key based on its category. */
export function dims(key: string): { width: number; height: number } {
  const category = key.split('/')[0] as keyof typeof defaultDimensions;
  return defaultDimensions[category] ?? { width: 800, height: 600 };
}

export const ogImage = images.og;
