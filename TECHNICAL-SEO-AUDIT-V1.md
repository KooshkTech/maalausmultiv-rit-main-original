# Technical SEO Audit v1

## Status
- Planning: completed
- Implementation: completed for P0 items in this version
- Testing: typecheck passed in audit environment
- Build verification: must be re-run locally from a clean dependency install; the uploaded archive contains source only and does not rely on bundled `node_modules`

## Verified / corrected
- `public/robots.txt` allows crawling and references the production sitemap.
- `public/sitemap.xml` now contains all 46 current indexable routes represented by the current service, city, blog, and static page data.
- The sitemap does not include `/404`.
- `Seo` supports explicit `indexable` control.
- The 404 page is now `noindex, follow` and is not intended for search indexing.
- Canonical URLs are generated from the route path through the shared `Seo` component.
- Open Graph and Twitter image alt metadata were added.
- Existing JSON-LD for ProfessionalService, Organization, WebSite, BreadcrumbList, FAQPage, and Service is preserved.

## Intentionally not changed
- URL structure
- existing service/location claims
- phone, email, address, opening hours, coordinates, warranty claims
- dependency versions
- analytics / consent implementation
- hosting configuration

These require separate verification before changing.

## Remaining verification
1. Run `npm install --legacy-peer-deps` on the local Windows project.
2. Run `npm run typecheck`.
3. Run `npm run build`.
4. Preview the production build and inspect canonical/meta/schema output on representative routes.
5. Submit/refresh `https://maalausmultivari.fi/sitemap.xml` in Google Search Console after deployment.
6. Inspect URL indexing for homepage, key service pages, and P1 city pages.
