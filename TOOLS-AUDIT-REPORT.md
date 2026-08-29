# Maalaus Multiväri V20 — Tools Audit Report

## Architecture inspected

The implementation remains inside the existing React 18 + TypeScript + Vite application. Existing site layout, service pages, city pages, contact/quote delivery, analytics helpers, image configuration, cookie/privacy pages and customer authentication infrastructure remain in place.

Authentication continues to use the existing Supabase REST/Auth integration in `src/lib/customerAppApi.ts` and `CustomerAuthContext`. Passwords are submitted to Supabase Auth over HTTPS; the application does not store plaintext passwords. Interactive studio routes are protected by `CustomerAppGuard`.

## Replaced / migrated planner experience

Old public planner/editor URLs are no longer canonical destinations. Public discovery now uses:

- `/varikamu` — VäriKamu SEO landing page
- `/siivouskamu` — SiivousKamu SEO landing page

Authenticated applications:

- `/app/varikamu`
- `/app/siivouskamu`

Legacy public URLs are handled by both React aliases and Apache HTTP 301 rules where server routing applies:

- `/maalauslaskuri` → `/varikamu`
- `/paint-studio` → `/varikamu`
- `/siivoussuunnittelija` → `/siivouskamu`
- `/cleaning-studio` → `/siivouskamu`

## VäriKamu implemented capabilities

Simple Mode is the default. It exposes the essential workflow without a Photoshop-style control wall:

- JPG/PNG/WebP image upload and mobile camera capture
- wall, ceiling, door and trim/list surface selection
- independent surface layers used as manual masks
- Finnish color palette and custom color picker
- HEX input plus RGB/HSL readout
- manual brush painting
- before/original view
- before/after comparison slider
- undo/redo and reset
- snapshots
- browser-local save/restore
- PNG/JPG export
- authenticated quote CTA using the existing `/send-mail.php` endpoint

Advanced Mode additionally exposes:

- paint roller
- eraser
- brush size
- opacity
- layer visibility
- zoom
- pan

Uploaded work images are reduced to a bounded working resolution in the browser to limit canvas memory and interaction cost.

## SiivousKamu implemented capabilities

Simple Mode is the default and includes:

- room selection
- cleaning task selection
- approximate area
- frequency
- cleaning intensity
- optional JPG/PNG/WebP image and mobile camera capture
- transparent scope classification instead of an invented euro price
- before/original view
- labelled clean visual preview
- snapshots
- local save/restore
- JPG export
- authenticated quote CTA through the existing mail endpoint

Advanced Mode exposes:

- markers
- annotation brush
- eraser
- adjustable tool size
- annotation layer
- zoom
- undo/redo
- reset

The cleaned-state preview is explicitly described as a visual aid rather than a guaranteed outcome or fake AI diagnosis.

## Homepage

The existing homepage remains intact. `StudioIntroPopup` introduces VäriKamu and SiivousKamu in a dismissible card. Dismissal is stored locally. Primary popup buttons now enter the authenticated editor flow, while small secondary links remain available to the crawlable SEO landing pages.

## SEO implementation

The V20 public landing pages have unique Finnish titles, descriptions, H1s, content hierarchy, canonicals through the shared `Seo` component, breadcrumbs, Service structured data, visible FAQ content/FAQ schema and internal links to relevant services and quotes.

Local cleaning SEO now includes dedicated useful pages for `toimistosiivous`, `yrityssiivous` and `muuttosiivous` in Helsinki, Espoo and Vantaa. These pages use one reusable component but include genuinely city-specific context rather than simple city-name substitution.

Homepage internal links now include natural `maalari` wording and direct local cleaning anchors such as `Toimistosiivous Vantaa` and `Yrityssiivous Espoo`. The existing painting intent catalog already contains `maalari Helsinki`, `maalari Espoo`, `maalari Vantaa`, `maalari Uusimaa`, `maalausliike` and `maalaustyöt` terms for strategy/intent mapping.

## Sitemap and robots

- Main `sitemap.xml` contains `/varikamu` and `/siivouskamu`.
- Legacy planner URLs are not listed as canonical sitemap URLs.
- `sitemap-cleaning-local.xml` contains the nine priority cleaning city/service pages.
- `robots.txt` references both valid sitemap files and allows public crawling.
- `/app/*` pages remain `noindex` through the customer application layout SEO component.

## Server redirects and canonical host

`public/.htaccess` now:

- canonicalizes to HTTPS + `maalausmultivari.fi` without www
- performs permanent planner URL migrations
- preserves real files and directories
- falls back to `index.html` for React Router routes
- protects SMTP configuration files

## Pricing and claims

No new fixed painting or cleaning price was invented. SiivousKamu reports a scope class and explicitly says the euro price is confirmed in a real quote. VäriKamu does not claim that a screen preview is an exact physical paint result.

No reviews, ratings, customers, credentials, locations or statistics were fabricated.

## Production verification

The V20 GitHub Actions workflow performs:

1. `npm ci`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run build`
5. deployment-file existence checks
6. ZIP layout verification
7. artifact upload

The final CI result and artifact are the source of truth for whether the branch has passed production verification. Performance/Lighthouse scores are targets only and must not be reported as achieved unless measured separately in a real browser audit.
