import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const warnings = [];
const baseUrl = 'https://maalausmultivari.fi';

function fail(message) { failures.push(message); }
function warn(message) { warnings.push(message); }

const robotsPath = path.join(root, 'public', 'robots.txt');
const sitemapPath = path.join(root, 'public', 'sitemap.xml');
const seoPath = path.join(root, 'src', 'components', 'Seo.tsx');

if (!fs.existsSync(robotsPath)) fail('public/robots.txt is missing.');
if (!fs.existsSync(sitemapPath)) fail('public/sitemap.xml is missing.');
if (!fs.existsSync(seoPath)) fail('src/components/Seo.tsx is missing.');

if (fs.existsSync(robotsPath)) {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!/User-agent:\s*\*/i.test(robots)) fail('robots.txt has no wildcard User-agent rule.');
  if (!/Allow:\s*\//i.test(robots)) fail('robots.txt does not explicitly allow crawling.');
  if (!robots.includes(`${baseUrl}/sitemap.xml`)) fail('robots.txt does not reference the canonical sitemap URL.');
}

if (fs.existsSync(sitemapPath)) {
  const xml = fs.readFileSync(sitemapPath, 'utf8');
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
  if (!urls.length) fail('sitemap.xml contains no URLs.');
  const duplicates = [...new Set(urls.filter((url, i) => urls.indexOf(url) !== i))];
  for (const url of duplicates) fail(`Duplicate sitemap URL: ${url}`);
  for (const url of urls) {
    if (!url.startsWith(`${baseUrl}/`) && url !== `${baseUrl}/`) fail(`Off-domain sitemap URL: ${url}`);
    if (url.includes('?') || url.includes('#')) fail(`Non-canonical sitemap URL contains query/hash: ${url}`);
    if (url !== `${baseUrl}/` && url.endsWith('/')) warn(`Trailing-slash sitemap URL: ${url}`);
  }
  console.log(`SEO audit: ${urls.length} sitemap URLs checked.`);
}

if (fs.existsSync(seoPath)) {
  const seo = fs.readFileSync(seoPath, 'utf8');
  if (!seo.includes('<link rel="canonical"')) fail('Seo component does not emit a canonical link.');
  if (!seo.includes('meta name="robots"')) fail('Seo component does not emit robots metadata.');
  if (!seo.includes('BreadcrumbList')) fail('Seo component has no BreadcrumbList support.');
  if (!seo.includes("'@type': 'Service'")) fail('Seo component has no Service schema support.');
  if (!seo.includes("'@type': 'Article'")) fail('Seo component has no Article schema support.');
  if (!seo.includes('absoluteUrl(articleSchema.image)')) fail('Article schema image is not normalized to an absolute URL.');
}

const indexPath = path.join(root, 'index.html');
if (fs.existsSync(indexPath)) {
  const html = fs.readFileSync(indexPath, 'utf8');
  if (!html.includes('rel="preload" as="image"')) warn('Homepage LCP image is not preloaded in index.html.');
  if (!html.includes('name="viewport"')) fail('Viewport meta tag is missing.');
}

if (warnings.length) {
  console.log(`SEO warnings (${warnings.length}):`);
  for (const message of warnings) console.log(`- ${message}`);
}

if (failures.length) {
  console.error(`SEO failures (${failures.length}):`);
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log('SEO audit passed: robots, sitemap, canonical/schema conventions and LCP preload are consistent.');
