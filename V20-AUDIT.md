# Maalaus Multiväri V20 — Audit First

Date: 2026-08-28
Branch: `v20-ai-planners-seo`

## Scope

This audit follows the V20 implementation brief before major feature changes. The current production-oriented codebase is a React 18 + TypeScript + Vite SPA with React Router, `react-helmet-async` SEO metadata, PHP quote delivery, lazy-loaded pages, a public no-login Paint Planner, and a legacy authenticated customer app under `/app/*`.

## Current architecture

- Runtime: React 18 + TypeScript + Vite.
- Routing: `src/App.tsx`.
- Public painting planner: `/maalauslaskuri`.
- Legacy authenticated app: `/app/login`, `/app/register`, `/app/dashboard`, `/app/design/*`, estimates, quotes and profile.
- Public cleaning hub: `/palvelut/siivous` plus cleaning service detail pages.
- SEO component: `src/components/Seo.tsx`.
- Canonical hostname in code: `https://maalausmultivari.fi`.
- HostGator SPA/canonical rewrite rules: `public/.htaccess`.
- Quote endpoint used by the public planner: `/send-mail.php`.

## High-priority findings

### 1. The current Paint Planner is not an actual paint editor

`SimplePaintPlannerModal` currently applies fixed-position translucent overlays to a room image. The user can choose wall/ceiling/trim colours, but cannot paint the uploaded image with brush or roller tools and cannot correct masks manually.

V20 must replace this with a canvas-based editor with:

- brush
- roller
- eraser
- undo / redo
- zoom / pan
- reset
- before / after
- multiple colours
- touch/pointer support
- later region-aware masks / segmentation without making manual editing dependent on AI

### 2. Paint Planner SEO is too narrow for the new commercial intent

The current landing page is positioned mainly as a colour visualizer. It needs to target the broader commercial journey naturally: `maalauslaskuri`, `maalaus hinta-arvio`, `maalari`, `maalari Helsinki`, `maalari Espoo`, `maalari Vantaa`, `maalausliike`, and service/location intent while avoiding keyword stuffing.

### 3. Cleaning has no dedicated planner route

There is a cleaning service hub, but no `/siivoussuunnittelija` flow. V20 needs a dedicated public no-login cleaning planner with photo upload, service selection, before/after visualization, estimate/request flow, disclaimer, and quote CTA.

### 4. Cleaning landing-page positioning is inconsistent

`CleaningServicesPage` SEO description describes broad cleaning services such as home, office, construction and move-out cleaning, but the visible hero copy emphasizes facade/window/yard/roof cleaning. This creates a search-intent and conversion mismatch for the Search Console opportunities around `yrityssiivous` and `toimistosiivous`.

### 5. Existing technical canonical rules are already substantially correct

`Seo.tsx` emits non-www HTTPS canonicals using `https://maalausmultivari.fi`. `public/.htaccess` forces HTTPS and redirects `www.maalausmultivari.fi` to the non-www hostname before the SPA fallback.

Therefore Search Console www/http impressions should be treated as something to verify in production and over time, not as proof that source code currently lacks canonical handling.

### 6. The codebase still contains two planner models

The public V18 planner does not require login, while the older `/app/*` customer application remains. V20 should keep the primary conversion experience public and simple. Legacy account functionality must not become a barrier before planner use or quote submission.

### 7. Version/workflow naming is stale

`package.json` still reports version `17.3.1`, and workflow/script names still refer to V17. V20 should update versioning and CI labels only after functionality is stable so existing verification scripts are not accidentally broken.

## SEO priority derived from the supplied Search Console strategy

### Painting Tier 1

- julkisivumaalaus
- julkisivumaalaus Espoo
- talon maalaus Espoo
- ulkomaalaus Espoo
- omakotitalon maalaus Espoo
- talon maalaus Helsinki
- talon maalaus Vantaa
- tapetin poisto ja maalaus

### Maalari commercial cluster

- maalari Helsinki
- maalari Espoo
- maalari Vantaa
- maalari Uusimaa
- maalausliike Helsinki
- maalausliike Espoo
- maalausliike Vantaa
- maalaustyöt Helsinki
- maalaustyöt Espoo
- maalaustyöt Vantaa

### Cleaning priority

- yrityssiivous
- yrityssiivous Helsinki / Espoo / Vantaa
- toimistosiivous
- toimistosiivous Helsinki / Espoo / Vantaa
- siivous Helsinki / Espoo / Vantaa
- kotisiivous
- muuttosiivous
- loppusiivous
- WC:n siivous
- kylpyhuoneen siivous
- keittiön siivous

## V20 implementation order

1. Preserve valuable routes and confirm canonical/redirect behavior.
2. Expand SEO intent data with natural `maalari` and cleaning clusters.
3. Replace the Paint Planner overlay preview with a real canvas editor.
4. Add brush, roller, eraser, undo/redo, zoom, before/after and multiple colours.
5. Add a paint/material budget estimator with a non-binding-estimate disclaimer.
6. Connect the edited design and budget summary to the existing quote flow.
7. Add `/siivoussuunnittelija` as a public cleaning planner.
8. Add cleaning before/after visualization with explicit AI-preview disclaimer.
9. Rework the cleaning hub around consumer + business search intent.
10. Strengthen Julkisivumaalaus, Talon maalaus, and Helsinki/Espoo/Vantaa hubs.
11. Add contextual planner CTAs to service/location pages.
12. Add funnel analytics for painting and cleaning.
13. Verify mobile touch behavior, accessibility, image performance and Core Web Vitals.
14. Run typecheck, lint, existing verification scripts and production build before merge.

## Guardrails

- No fake reviews, prices, guarantees, credentials or AI outcomes.
- No invented exact cleaning or painting price when input/business data is insufficient.
- No account requirement before planner use.
- No thin city doorway pages.
- No mass page generation.
- No AI dependency that prevents manual paint editing.
- AI-cleaned imagery must be labelled as a visualization, never a guaranteed result.

## Definition of done

V20 is not complete until the public painting editor works with real manual tools on mobile and desktop, the cleaning planner has a working public flow, the estimate/quote funnels work, high-value SEO pages are strengthened without breaking existing URLs, analytics are present, and the repository passes its production verification/build pipeline.
