# Technical SEO Audit V2 — Service × Location

## Implemented
- Added 15 dedicated painting service + location landing pages for Helsinki, Espoo and Vantaa.
- Added route support through `ServiceLocationPage.tsx`.
- Added a single source of truth in `src/data/serviceLocationSeo.ts`.
- Corrected the master keyword mapping for `talon maalaus` to `/palvelut/talon-maalaus`.
- Mapped key local transactional terms to dedicated Service × Location pages.
- Added all 15 new indexable URLs to `public/sitemap.xml`.
- Each landing page includes canonical metadata, BreadcrumbList, Service schema, FAQ schema, local context, CTA, and links back to the core service and nearby local pages.

## First 15 targets
1. talon maalaus Helsinki
2. talon maalaus Espoo
3. talon maalaus Vantaa
4. sisämaalaus Helsinki
5. sisämaalaus Espoo
6. sisämaalaus Vantaa
7. julkisivumaalaus Helsinki
8. julkisivumaalaus Espoo
9. julkisivumaalaus Vantaa
10. kattomaalaus Helsinki
11. kattomaalaus Espoo
12. kattomaalaus Vantaa
13. ulkomaalaus Helsinki
14. ulkomaalaus Espoo
15. ulkomaalaus Vantaa

## Important SEO rule
Do not expand this automatically to every city × every service. Use Google Search Console impressions/clicks and real project evidence before adding the next cluster.

## Verification
`npm install --legacy-peer-deps` could not complete in the audit environment before timeout, so a clean dependency install and `npm run typecheck && npm run build` should be run on the deployment machine before release.
