import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const warnings = [];
const services = ['talon-maalaus', 'ulkomaalaus', 'sisamaalaus', 'julkisivumaalaus', 'kattomaalaus'];
const cities = ['helsinki', 'espoo', 'vantaa'];
const expectedLocalPaths = services.flatMap((service) => cities.map((city) => `/palvelut/${service}/${city}`));

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function fail(message) { failures.push(message); }
function warn(message) { warnings.push(message); }

const sitemap = read('public/sitemap.xml');
const sitemapUrls = [...sitemap.matchAll(/<loc>https:\/\/maalausmultivari\.fi(.*?)<\/loc>/g)].map((m) => m[1] || '/');

for (const route of expectedLocalPaths) {
  if (!sitemapUrls.includes(route)) fail(`Priority local page missing from sitemap: ${route}`);
}

const duplicates = [...new Set(sitemapUrls.filter((url, index) => sitemapUrls.indexOf(url) !== index))];
for (const route of duplicates) fail(`Duplicate sitemap path: ${route}`);

const cityPage = read('src/pages/CityPage.tsx');
if (!cityPage.includes('localServicePath(service.slug, city.slug)')) {
  fail('CityPage does not use centralized local service routing.');
}

const servicePage = read('src/pages/ServiceDetailPage.tsx');
if (!servicePage.includes('hasPriorityLocalPage(service.slug, city.slug)')) {
  fail('ServiceDetailPage does not route priority services to local landing pages.');
}

const localPage = read('src/pages/ServiceLocationPage.tsx');
for (const token of ['Muut maalauspalvelut', 'pääpalvelu', 'Palvelut {city.locative}']) {
  if (!localPage.includes(token)) fail(`ServiceLocationPage missing architecture element: ${token}`);
}

const localSeo = read('src/data/localSeo.ts');
for (const service of services) if (!localSeo.includes(`'${service}'`)) fail(`localSeo.ts missing service: ${service}`);
for (const city of cities) if (!localSeo.includes(`'${city}'`)) fail(`localSeo.ts missing city: ${city}`);

const locationTitles = [];
const localCopy = read('src/pages/ServiceLocationPage.tsx');
if ((localCopy.match(/const title =/g) || []).length !== 1) warn('Unexpected local title construction; inspect manually.');

console.log(`V17 architecture audit: ${expectedLocalPaths.length} priority service × city pages checked.`);
if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  warnings.forEach((w) => console.log(`- ${w}`));
}
if (failures.length) {
  console.error(`Failures (${failures.length}):`);
  failures.forEach((f) => console.error(`- ${f}`));
  process.exit(1);
}
console.log('V17 architecture audit passed: priority local pages, sitemap coverage and internal routing are consistent.');
