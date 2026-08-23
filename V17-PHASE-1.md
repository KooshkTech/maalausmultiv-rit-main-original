# V17 Phase 1 — Indexation, cannibalization and internal-link architecture

## Goal

Start V17 without inventing additional thin location pages. This phase tightens the relationship between the 15 priority service × city pages and their parent service/city hubs.

## Implemented

- Added a single source of truth for priority local SEO routes in `src/data/localSeo.ts`.
- Fixed city hub linking so **all five** priority painting services route to their Helsinki/Espoo/Vantaa landing pages.
  - Talon maalaus
  - Ulkomaalaus
  - Sisämaalaus
  - Julkisivumaalaus
  - Kattomaalaus
- Fixed main service pages so Julkisivumaalaus and Kattomaalaus also link to their local pages, not just the first three services.
- Added cross-links on each service × city page back to:
  - its parent service page,
  - its city hub,
  - the other four priority painting services in the same city.
- Added `verify:v17` to detect broken priority local architecture and sitemap coverage.
- Extended `npm run verify` with the V17 architecture check.
- No additional city/service pages were generated in this phase, reducing cannibalization risk while real Search Console data is unavailable.

## Why this matters

The site now communicates a clearer hierarchy:

Homepage → main service → service × city → city hub / related local service → quote

This makes the 15 local landing pages less isolated and gives search engines clearer contextual relationships without creating more near-duplicate URLs.

## Next data-driven V17 phase

Once Search Console data is available, prioritize:
1. Queries/pages in positions 4–20.
2. High-impression pages with weak CTR.
3. Query overlap between city hubs, main services and service × city pages.
4. Pages indexed but receiving no meaningful impressions.
