# 07.4A — Service IA Implementation

## Scope
Added three service records and their SEO targets using the existing architecture.

## Services Added
- `talon-maalaus` — Talon maalaus
- `yrityssiivous` — Yrityssiivous
- `remonttisiivous` — Remonttisiivous

## Architecture
No new routes were created. The existing `/palvelut/:slug` route resolves these services through `src/data/services.ts`.

## Images
Existing closely related service images are used temporarily:
- Talon maalaus → existing `ulkomaalaus` image
- Yrityssiivous → existing `toimistosiivous` image
- Remonttisiivous → existing `rakennussiivous` image

Dedicated photorealistic images remain a later image-refresh task.

## Files Changed
- `src/data/services.ts`
- `src/data/seoMap.ts`
- `SERVICE-IA-IMPLEMENTATION.md`

## Testing
Automated `npm run typecheck` and `npm run build` could not be completed in this working environment because dependency installation was unavailable. The changes were kept within the existing TypeScript data structures and statically checked for the expected service and SEO keys.

## Next
07.4B — make `ServiceDetailPage` service-aware so painting and cleaning pages use service-appropriate process, FAQ, guarantee copy, and CTA messaging.
