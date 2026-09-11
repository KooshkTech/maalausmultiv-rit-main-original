import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const BASE_URL = 'https://maalausmultivari.fi';
const BRAND = 'Maalaus Multiväri';
const DIST = 'dist';

const cities = {
  helsinki: { name: 'Helsinki', locative: 'Helsingissä' },
  espoo: { name: 'Espoo', locative: 'Espoossa' },
  vantaa: { name: 'Vantaa', locative: 'Vantaalla' },
};

const services = {
  'talon-maalaus': {
    label: 'Talon maalaus',
    suffix: 'omakoti- ja pientaloille',
    description: (city) => `Omakoti- ja pientalon maalaus ${city.locative}. Kohdekohtaiset pohjatyöt, selkeä tarjous ja 2 vuoden kirjallinen takuu maalaustyöjäljestä. Pyydä maksuton arvio.`,
  },
  ulkomaalaus: {
    label: 'Ulkomaalaus',
    suffix: 'kestävät pohjatyöt ja maalaus',
    description: (city) => `Ulkomaalaus ${city.locative}. Kohdekohtaiset pohjatyöt, selkeä tarjous ja 2 vuoden kirjallinen takuu maalaustyöjäljestä. Pyydä maksuton arvio.`,
  },
  sisamaalaus: {
    label: 'Sisämaalaus',
    suffix: 'kodit ja toimitilat',
    description: (city) => `Sisämaalaus koteihin ja toimitiloihin ${city.locative}. Huolellinen suojaus, selkeä tarjous ja 2 vuoden kirjallinen takuu maalaustyöjäljestä. Pyydä maksuton arvio.`,
  },
  julkisivumaalaus: {
    label: 'Julkisivumaalaus',
    suffix: 'puu- ja rappauspinnat',
    description: (city) => `Julkisivumaalaus puu- ja rappauspinnoille ${city.locative}. Kohdekohtaiset pohjatyöt, selkeä tarjous ja 2 vuoden kirjallinen takuu maalaustyöjäljestä. Pyydä maksuton arvio.`,
  },
  kattomaalaus: {
    label: 'Kattomaalaus',
    suffix: 'peltikaton pesu ja pinnoitus',
    description: (city) => `Peltikaton pesu ja kattomaalaus ${city.locative}. Kuntoarvio, huolelliset pohjatyöt ja selkeä tarjous. Pyydä maksuton arvio.`,
  },
};

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function replaceMeta(html, { title, description, url }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeUrl = escapeHtml(url);

  let output = html
    .replace(/<title>[^<]*<\/title>/i, `<title>${safeTitle}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/i, `<meta name="description" content="${safeDescription}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/i, `<meta property="og:url" content="${safeUrl}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/i, `<meta property="og:title" content="${safeTitle}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/i, `<meta property="og:description" content="${safeDescription}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/i, `<meta name="twitter:title" content="${safeTitle}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/i, `<meta name="twitter:description" content="${safeDescription}" />`);

  const canonical = `<link rel="canonical" href="${safeUrl}" />`;
  if (/<link rel="canonical"/i.test(output)) {
    output = output.replace(/<link rel="canonical" href="[^"]*"\s*\/>/i, canonical);
  } else {
    output = output.replace('</head>', `    ${canonical}\n  </head>`);
  }

  return output;
}

const template = await readFile(join(DIST, 'index.html'), 'utf8');
let generated = 0;

for (const [serviceSlug, service] of Object.entries(services)) {
  for (const [citySlug, city] of Object.entries(cities)) {
    const path = `/palvelut/${serviceSlug}/${citySlug}`;
    const url = `${BASE_URL}${path}`;
    const title = `${service.label} ${city.name} – ${service.suffix} | ${BRAND}`;
    const description = service.description(city);
    const html = replaceMeta(template, { title, description, url });
    const target = join(DIST, '_seo', 'palvelut', serviceSlug, `${citySlug}.html`);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, html, 'utf8');
    generated += 1;
  }
}

console.log(`Generated ${generated} static SEO entry documents.`);
