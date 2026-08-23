import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const warnings = [];

const services = [
  { slug: 'talon-maalaus', title: 'Talon maalaus', suffix: 'omakoti- ja pientaloille', lead: 'Omakoti- ja pientalon maalaus' },
  { slug: 'ulkomaalaus', title: 'Ulkomaalaus', suffix: 'kestävät pohjatyöt ja maalaus', lead: 'Ulkomaalaus' },
  { slug: 'sisamaalaus', title: 'Sisämaalaus', suffix: 'kodit ja toimitilat', lead: 'Sisämaalaus koteihin ja toimitiloihin' },
  { slug: 'julkisivumaalaus', title: 'Julkisivumaalaus', suffix: 'puu- ja rappauspinnat', lead: 'Julkisivumaalaus puu- ja rappauspinnoille' },
  { slug: 'kattomaalaus', title: 'Kattomaalaus', suffix: 'peltikaton pesu ja pinnoitus', lead: 'Peltikaton pesu ja kattomaalaus' },
];

const cities = [
  { slug: 'helsinki', name: 'Helsinki', locative: 'Helsingissä' },
  { slug: 'espoo', name: 'Espoo', locative: 'Espoossa' },
  { slug: 'vantaa', name: 'Vantaa', locative: 'Vantaalla' },
];

const localPages = services.flatMap((service) => cities.map((city) => ({
  path: `/palvelut/${service.slug}/${city.slug}`,
  title: `${service.title} ${city.name} – ${service.suffix}`,
  description: `${service.lead} ${city.locative}. Kohdekohtaiset pohjatyöt, selkeä tarjous ja 2 vuoden kirjallinen takuu maalaustyöjäljestä. Pyydä maksuton arvio.`,
})));

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function fail(message) { failures.push(message); }
function warn(message) { warnings.push(message); }
function duplicates(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

// 1. Local money-page metadata uniqueness.
for (const duplicate of duplicates(localPages.map((page) => page.title))) {
  fail(`Duplicate local SEO title: ${duplicate}`);
}
for (const duplicate of duplicates(localPages.map((page) => page.description))) {
  fail(`Duplicate local meta description: ${duplicate}`);
}
for (const page of localPages) {
  if (page.title.length < 30 || page.title.length > 70) warn(`Review title length (${page.title.length}): ${page.path}`);
  if (page.description.length < 100 || page.description.length > 180) warn(`Review description length (${page.description.length}): ${page.path}`);
}

// 2. Sitemap coverage and uniqueness.
const sitemap = read('public/sitemap.xml');
const sitemapPaths = [...sitemap.matchAll(/<loc>https:\/\/maalausmultivari\.fi(.*?)<\/loc>/g)]
  .map((match) => match[1] || '/');

for (const page of localPages) {
  if (!sitemapPaths.includes(page.path)) fail(`Priority money page missing from sitemap: ${page.path}`);
}
for (const duplicate of duplicates(sitemapPaths)) {
  fail(`Duplicate sitemap path: ${duplicate}`);
}

// 3. Required internal-link architecture.
const cityPage = read('src/pages/CityPage.tsx');
const servicePage = read('src/pages/ServiceDetailPage.tsx');
const localPage = read('src/pages/ServiceLocationPage.tsx');
const home = read('src/sections/LocalSeoLinks.tsx');
const blogPost = read('src/pages/BlogPostPage.tsx');

if (!cityPage.includes('localServicePath(service.slug, city.slug)')) {
  fail('City hubs do not route services through centralized localServicePath().');
}
if (!servicePage.includes('hasPriorityLocalPage(service.slug, city.slug)')) {
  fail('Main service pages do not route priority city links through the V17 architecture.');
}
if (!localPage.includes('Muut maalauspalvelut')) {
  fail('Local money pages do not cross-link to other painting services in the same city.');
}
if (!localPage.includes('pääpalvelu')) {
  fail('Local money pages do not link back to the parent service.');
}
if (!home.includes('priority') && !home.includes('/palvelut/${service.slug}/${city.slug}')) {
  fail('Homepage local SEO section does not expose service × city links.');
}
if (!blogPost.includes('Paikalliset maalauspalvelut')) {
  fail('Blog posts do not expose contextual local money-page links.');
}

// 4. Blog supporting-content coverage.
const blogData = read('src/data/blog.ts');
const priorityServiceCoverage = Object.fromEntries(services.map((service) => [service.slug, 0]));
const relatedServiceArrays = [...blogData.matchAll(/relatedServices:\s*\[([\s\S]*?)\]/g)].map((match) => match[1]);
for (const service of services) {
  priorityServiceCoverage[service.slug] = relatedServiceArrays.filter((items) =>
    new RegExp(`['"]${service.slug}['"]`).test(items)
  ).length;
  if (priorityServiceCoverage[service.slug] === 0) {
    warn(`No blog article currently declares ${service.slug} as a related service.`);
  }
}

// 5. Warranty consistency in source code.
const sourceFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) sourceFiles.push(full);
  }
}
walk(path.join(root, 'src'));
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8');
  if (/\b5\s*(?:vuotta|v)\b/i.test(text)) {
    fail(`Legacy 5-year warranty wording found: ${path.relative(root, file).replaceAll('\\', '/')}`);
  }
}

// 6. Static SEO metadata duplicate check for literal <Seo> values.
// Dynamic titles are handled separately above.
const literalTitles = [];
const literalDescriptions = [];
for (const file of sourceFiles.filter((file) => file.endsWith('.tsx'))) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/<Seo[\s\S]*?\/>/g)) {
    const block = match[0];
    const title = block.match(/\btitle="([^"]+)"/)?.[1];
    const description = block.match(/\bdescription="([^"]+)"/)?.[1];
    if (title) literalTitles.push({ value: title, file });
    if (description) literalDescriptions.push({ value: description, file });
  }
}
for (const duplicate of duplicates(literalTitles.map((item) => item.value))) {
  warn(`Duplicate literal <Seo> title to review: ${duplicate}`);
}
for (const duplicate of duplicates(literalDescriptions.map((item) => item.value))) {
  warn(`Duplicate literal <Seo> description to review: ${duplicate}`);
}

console.log(`V17.3 quality audit: ${localPages.length} money pages, ${sitemapPaths.length} sitemap URLs, ${sourceFiles.length} source files checked.`);
console.log('Blog support coverage:', priorityServiceCoverage);

if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  for (const message of warnings) console.log(`- ${message}`);
}
if (failures.length) {
  console.error(`Failures (${failures.length}):`);
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log('V17.3 quality audit passed: metadata uniqueness, sitemap coverage, internal-link architecture and warranty consistency are healthy.');
