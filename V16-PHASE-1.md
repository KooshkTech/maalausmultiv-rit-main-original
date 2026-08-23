# V16 Phase 1 — Core local service landing pages

Implemented on top of the merged V15 domain baseline.

## Added
- Dedicated service × city route: `/palvelut/:serviceSlug/:citySlug`.
- Nine indexable, canonical landing pages for three high-intent painting services across Helsinki, Espoo and Vantaa:
  - talon-maalaus × Helsinki/Espoo/Vantaa
  - ulkomaalaus × Helsinki/Espoo/Vantaa
  - sisamaalaus × Helsinki/Espoo/Vantaa
- City-specific copy and local considerations instead of simple city-name substitution.
- Service schema with city-specific `areaServed`.
- Breadcrumb and FAQ schema through the existing SEO component.
- Contextual links from the three city pages to the new local service pages.
- Contextual links from the three service pages back to their local landing pages.
- Nine new URLs in `public/sitemap.xml`.

## Consistency cleanup
- Replaced remaining visible 5-year warranty claims in source with the approved 2-year wording.
- Updated the warranty statistic from 5 years to 2 years.

## Deliberate scope
V16 Phase 1 creates only nine high-value pages. It does not programmatically create every service/city combination. This is intentional to avoid thin or near-duplicate local pages.

## Verification
Run locally after extraction:

```bash
npm install
npm run verify
npm run dev
```

Then inspect the nine new local URLs and the Helsinki, Espoo and Vantaa city pages.
