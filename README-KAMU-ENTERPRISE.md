# Kamu Studio Enterprise Engine

This preview branch introduces the enterprise foundation without replacing the current customer-facing editors in one risky rewrite.

## Implemented in this slice

- `src/lib/engine/types.ts` — render contracts for paint/cleaning pipelines.
- `src/lib/engine/MaskLayer.ts` — typed alpha masks, union/subtract, RLE serialization.
- `src/lib/engine/RenderContext.ts` — adaptive mobile render sizing and capability detection.
- `src/lib/engine/CanvasPipeline.ts` — non-destructive luminance-preserving 3-coat paint renderer and natural cleaning renderer.
- `src/lib/ai/SegmentationProvider.ts` — remote `/api/segment-sam` provider with timeout/cache and deterministic local RGB flood-fill fallback. Manual + smart mask union is explicit.
- `src/lib/saas/tenant.ts` — tenant context and tenant-safe storage paths.
- `src/lib/observability/telemetry.ts` — privacy-aware client telemetry hooks with sensitive-field filtering.
- `supabase/migrations/002_kamu_studio_enterprise.sql` — organizations, memberships, pricing, studio projects, quote requests, feature flags, audit events, strict RLS, tenant-safe storage bucket.
- `/kamu` public hub now describes the enterprise engine accurately.

## Deliberately not claimed yet

- `/api/segment-sam` is an interface contract; a production SAM 2/SlimSAM edge service still needs deployment and credentials/model hosting.
- Existing VäriKamu/SiivousKamu editors have not yet been fully migrated to consume `CanvasPipeline` and `SegmentationProvider`; this should be done incrementally with visual regression tests.
- The new Supabase migration is committed but must only be applied to the intended Kamu Studio Supabase project after review.
- WebGL shader acceleration is the next graphics milestone; Canvas remains the deterministic compatibility path.

## Adoption order

1. Apply migration to the correct Supabase project and seed the Maalaus Multiväri organization.
2. Add the `/api/segment-sam` backend with authenticated, rate-limited requests and no image retention by default.
3. Migrate VäriKamu mask/render operations to `MaskLayer` + `CanvasPipeline` behind a feature flag.
4. Migrate SiivousKamu to the cleaning pipeline.
5. Add WebGL2 fragment-shader renderer with runtime fallback to Canvas.
6. Add integration/performance tests, project recovery snapshots and telemetry exporter.
