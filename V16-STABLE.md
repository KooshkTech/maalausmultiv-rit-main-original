# V16 STABLE — Release checkpoint

Date: 2026-08-23

## Status

V16 is the production-ready baseline after the V15 domain-image merge.

### Included
- Verified production image library.
- 15 priority service × city landing pages for Helsinki, Espoo and Vantaa.
- Stronger homepage local SEO/internal linking.
- Project-to-local-service internal links.
- Topical authority articles, including house repaint timing and painting cost factors.
- 2-year warranty wording normalized.
- Technical SEO verifier for robots, sitemap, canonical/schema conventions and LCP preload.
- Image verifier for broken/missing/legacy/watermarked assets.
- Homepage hero LCP preload and intrinsic image dimensions.

## Required release verification

```bash
npm install
npm run verify
npm run dev
```

Expected:
- TypeScript: 0 errors
- ESLint: 0 errors
- Image audit: pass
- SEO audit: pass
- Vite production build: pass

## Git checkpoint

After local verification:

```bash
git status
git add .
git commit -m "V16 stable: local SEO, topical authority and technical stabilization"
git push origin main
```

## V17 entry criteria

Do not create large numbers of new SEO pages blindly. V17 should be driven by real Google Search Console query/page data and off-site authority work.

Recommended inputs:
- Search Console Performance export: Queries + Pages, last 3 months and previous period if available.
- Current indexing/sitemap status.
- Google Business Profile completeness and landing URL.
- Existing citation/backlink list/status.
