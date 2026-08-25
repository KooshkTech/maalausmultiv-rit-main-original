# V17 Paint Planner — production deployment runbook

This release adds a public SEO landing page plus a private customer application for paint design, preliminary pricing, saved projects, downloads and quote requests.

## Public and private routes

Public/indexable:
- `/maalauslaskuri` — SEO landing page explaining the planner, color visualizer and preliminary price calculator.

Private/noindex:
- `/app/register`
- `/app/login`
- `/app/forgot-password`
- `/app/dashboard`
- `/app/design/new`
- `/app/design/:id`
- `/app/estimates`
- `/app/quotes`
- `/app/profile`

The customer app deliberately uses a separate shell from the marketing site. The public landing page remains crawlable; account pages are `noindex` through the existing `Seo` component.

## What V17 includes

- Email/password registration and login.
- Email verification support through Supabase Auth.
- Password-recovery request flow.
- Customer dashboard with saved paint projects.
- Interior, exterior, roof and custom paint project categories.
- Surface choices for walls, ceilings, bathroom paintable surfaces, doors, door frames, windows, trim, cabinets, stairs, radiators/pipes, facade, plinth, exterior doors/windows, fascia/eaves, balconies/rails, fences, gates, decks, sheds, metal roofs, gutters, downpipes, flashings, garages, warehouses and custom surfaces.
- Per-surface quantity/area, condition, preparation, coat count, quality and access complexity.
- Per-surface color selection.
- User photo upload.
- Manual polygon color visualizer: users tap points around a surface, assign a color and can create separate areas for facade, roof, doors, windows, etc.
- PNG export of the visualized design.
- PDF project-summary download.
- Preliminary low/high price estimate.
- Saved estimates.
- Quote-request submission stored in the database and also posted to the existing `send-mail.php` endpoint when available.
- Private project-image storage with row-level access control.
- Updated privacy policy and terms for accounts, project photos, visualizations and preliminary estimates.
- Homepage, navbar and service-area CTA links to the planner.
- CI gate: typecheck, lint and production build.

## 1. Create the production backend

Use a dedicated Supabase project for the website.

In Supabase SQL Editor, run:

`supabase/migrations/001_v17_paint_planner.sql`

The migration creates:
- `profiles`
- `paint_projects`
- `quote_requests`
- private `paint-planner` storage bucket
- owner-only Row Level Security policies
- new-user profile trigger
- updated-at triggers

Do not disable RLS.

## 2. Configure authentication

In Supabase Authentication settings:

- Enable Email provider.
- Require email confirmation for production.
- Set Site URL to `https://maalausmultivari.fi`.
- Add redirect URL `https://maalausmultivari.fi/app/login`.
- Configure the business SMTP provider before launch so account confirmation and password-recovery email delivery is reliable.
- Use a branded sender address where possible.

## 3. Add deployment secrets

Use `.env.example` as the reference.

Required build variables:

```text
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

The Supabase anon key is intentionally usable by browser clients; security depends on RLS. Never put the Supabase service-role key in Vite, GitHub source code or browser environment variables.

## 4. Review pricing before production

The initial pricing configuration lives in:

`src/data/paintPlanner.ts`

Every `baseRate`, preparation amount, multiplier and `minimumJob` must be reviewed by Maalaus Multiväri before production. The current pricing version is deliberately named:

`v17-initial-review-required`

Do not market the calculator as a binding quotation. The UI, PDF and terms all identify the result as preliminary.

Recommended business review:
- interior wall/ceiling rates
- doors/windows/trim rates
- facade and exterior detail rates
- metal-roof rate
- roof wash/rust/primer extras
- surface-condition multipliers
- access/height multiplier
- standard vs premium multiplier
- minimum job value
- target low/high estimate range
- how VAT should be described in the customer-facing estimate

## 5. Verify image/privacy configuration

The `paint-planner` bucket is private. Do not make it public.

Before launch verify:
- user A cannot list/read/update/delete user B's projects
- user A cannot access user B's storage folder
- file-size limit is 10 MB
- accepted image MIME types are JPEG, PNG and WebP
- account deletion and data deletion requests have an operational support procedure

Users are explicitly told not to upload unnecessary personal data or photos of identifiable people without a lawful basis/permission.

## 6. Build and verify

From the repository root:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
```

The branch also contains `.github/workflows/v17-paint-planner-ci.yml`. Do not merge if typecheck, lint or production build fails.

## 7. HostGator/static hosting deployment

The customer app is still a Vite SPA. Build with the production Supabase environment variables available during the Vite build.

Deploy the generated `dist/` content using the existing HostGator deployment procedure in `HOSTGATOR-DEPLOY.md`.

The host must continue rewriting unknown non-file paths to `index.html`, including `/app/*`, so direct navigation and refreshes work.

Keep the existing PHP mail endpoint in place. The customer-app quote request is persisted in Supabase first; the PHP mail call is an additional notification path.

## 8. Sitemap and indexing

Add only the public landing page to the sitemap:

`https://maalausmultivari.fi/maalauslaskuri`

Do not add `/app/*` routes to the sitemap. Keep them crawlable enough for the page-level `noindex` directive to be seen; do not block `/app/` in robots.txt unless the indexing strategy is changed.

After production launch:
- submit/re-submit `sitemap.xml` in Google Search Console
- inspect `/maalauslaskuri`
- confirm canonical = `https://maalausmultivari.fi/maalauslaskuri`
- confirm page is indexable
- confirm `/app/login` contains `noindex, follow`

## 9. Production smoke test

Use a fresh customer email and run this exact path:

1. Open `/maalauslaskuri` while logged out.
2. Click `Aloita maksutta`.
3. Register.
4. Confirm the account by email.
5. Log in.
6. Create an exterior project.
7. Select facade, roof, exterior door and windows.
8. Enter areas/quantities and preparation options.
9. Upload an image under 10 MB.
10. Draw separate facade and roof polygons.
11. Assign different colors.
12. Save.
13. Refresh the design URL and confirm project data remains.
14. Check the preliminary estimate.
15. Download the PNG design.
16. Download the PDF summary.
17. Send a quote request.
18. Confirm it appears in `/app/quotes`.
19. Confirm Maalaus Multiväri receives the email notification if `send-mail.php` is enabled.
20. Sign out and confirm the protected design URL redirects to login.

## 10. Security checks before launch

- HTTPS only.
- No service-role key in frontend.
- RLS enabled on all customer tables.
- Private project-image bucket.
- Email verification enabled.
- Strong-password requirements configured in Auth settings.
- Rate limiting / abuse protection configured in Supabase Auth and hosting where available.
- `send-mail.php` validates and rate-limits submissions server-side.
- Content Security Policy reviewed for Supabase API/image connections before enforcing a restrictive CSP.
- Error messages do not expose secrets or database internals.
- Production source maps policy reviewed.

## 11. SEO/conversion launch checks

`/maalauslaskuri` targets useful Finnish intent naturally, including:
- maalauslaskuri
- maalauksen hinta
- talon maalaus hinta
- ulkomaalaus hinta
- kattomaalaus hinta
- sisämaalaus hinta
- värisuunnittelu
- julkisivun värit
- katon värin suunnittelu

Do not add a meta-keywords tag or repeat these terms unnaturally. The page is designed around user intent and links into the registered workflow.

Track these conversion events after launch:
- planner_landing_view
- planner_register_start
- planner_register_complete
- planner_login
- planner_project_create
- planner_photo_upload
- planner_surface_add
- planner_estimate_view
- planner_save
- planner_png_download
- planner_pdf_download
- planner_quote_request

## Release gate

V17 Paint Planner is ready to deploy only when all are true:

- [ ] Supabase project created
- [ ] migration executed
- [ ] RLS tested with two separate test users
- [ ] email confirmation works
- [ ] password recovery works
- [ ] production env variables configured
- [ ] pricing reviewed and approved
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] registration/login smoke test passes
- [ ] image upload/privacy test passes
- [ ] save/reload test passes
- [ ] PNG download passes
- [ ] PDF download passes
- [ ] quote request database + email test passes
- [ ] mobile test passes
- [ ] accessibility keyboard test passes
- [ ] `/maalauslaskuri` added to sitemap
- [ ] `/app/*` remains out of sitemap and noindex
- [ ] privacy policy reviewed for the actual production processors and retention periods
- [ ] terms reviewed for the final pricing/visualizer behavior

After these checks, merge `v17-paint-planner-app` to `main`, create the production build and deploy it with the existing release procedure.
