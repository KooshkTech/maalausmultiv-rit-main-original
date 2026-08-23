# V16 Phase 4 — Conversion proof + topical authority

## Implemented

- Added `LocalProjectProof` to the homepage using existing project data for Helsinki, Espoo and Vantaa.
- Linked featured project proof to the relevant local service pages and the full project gallery.
- Added a new commercial-support article: **Talon maalauksen hinta: mistä kustannus muodostuu?**
- The cost article deliberately explains cost drivers without inventing fixed prices or unsupported price ranges.
- Linked the article to talon maalaus, ulkomaalaus, julkisivumaalaus and huoltomaalaus through the existing related-service system.
- Added the new article URL to `public/sitemap.xml`.
- Preserved the verified V16 image library and existing 15 priority service × city pages.

## Verify locally

```bash
npm install
npm run verify
npm run dev
```

Check `/`, `/projektit`, and `/blogi/talon-maalauksen-hinta-mista-kustannus-muodostuu`.
