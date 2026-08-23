# V16 Phase 5 — Technical SEO stabilization

## Implemented

- Normalized structured-data image URLs to absolute `https://maalausmultivari.fi/...` URLs.
- Article schema images are now always absolute.
- LocalBusiness schema image is now absolute.
- Added explicit intrinsic width and height to the homepage hero image.
- Added a high-priority WebP preload for the homepage LCP hero.
- Added `scripts/verify-seo.mjs`.
- Added `npm run verify:seo`.
- Extended `npm run verify` to include the technical SEO audit before the production build.
- The SEO audit checks robots.txt, sitemap domain/duplicates, canonical support, robots metadata, schema support, and homepage LCP preload.

## Local verification

```bash
npm install
npm run verify
npm run dev
```

A stable V16 checkpoint should have:
- 0 TypeScript errors
- 0 ESLint errors
- image audit passing
- SEO audit passing
- production build passing
