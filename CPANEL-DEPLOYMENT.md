# Maalaus Multiväri V20 — cPanel Deployment

This repository builds a static React/Vite site with PHP form files copied from `public/` into `dist/`.

## Production package

The V20 verification workflow creates:

`maalausmultivari-production-dist.zip`

The ZIP contains the **contents of `dist/` directly**. After extraction the root must contain `index.html`, `assets/`, `images/`, `sitemap.xml`, `robots.txt` and `.htaccess` where applicable. It must not contain `dist/dist/index.html`.

## Safe cPanel deployment

1. Download the verified `maalausmultivari-production-dist` GitHub Actions artifact.
2. Keep a backup of the current `public_html` before replacing files.
3. In cPanel File Manager open `public_html/`.
4. Preserve server-only files that contain secrets or installed mail libraries, especially `send-mail.config.php`, Composer `vendor/` and a manually installed `PHPMailer/` directory.
5. Upload `maalausmultivari-production-dist.zip` into `public_html/` and extract it there.
6. Confirm that `public_html/index.html` exists directly after extraction.
7. Confirm `.htaccess` is present. cPanel File Manager may require “Show Hidden Files”.
8. Do not upload a parent `dist/` directory around the site files.

## Environment required for authenticated tools

The interactive VäriKamu and SiivousKamu editors are behind the existing Supabase authentication guard. The production build must receive:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Do not commit secret credentials. Never expose Supabase service-role keys in a browser bundle.

## PHP quote delivery

The editors submit quote requests to the existing `/send-mail.php` endpoint. Preserve the existing server-side mail configuration and PHPMailer installation. SMTP passwords must never be placed in React, JavaScript bundles or GitHub-tracked files.

## URL migration

V20 public SEO landing pages:

- `/varikamu`
- `/siivouskamu`

The version-controlled Apache `.htaccess` permanently redirects legacy public planner URLs:

- `/maalauslaskuri` → `/varikamu`
- `/paint-studio` → `/varikamu`
- `/siivoussuunnittelija` → `/siivouskamu`
- `/cleaning-studio` → `/siivouskamu`

The authenticated editors are non-indexable under:

- `/app/varikamu`
- `/app/siivouskamu`

## Post-deployment checks

Verify normal rendering and direct refresh for:

- `/`
- `/varikamu`
- `/siivouskamu`
- `/app/login`
- `/palvelut/toimistosiivous/vantaa`
- `/palvelut/yrityssiivous/espoo`
- `/palvelut/julkisivumaalaus/espoo`
- `/sitemap.xml`
- `/sitemap-cleaning-local.xml`
- `/robots.txt`

Verify with the browser network panel or `curl -I` that the four legacy planner URLs return HTTP 301 to the new canonical landing pages. Also verify HTTP→HTTPS and www→non-www.

## Functional checks after sign-in

VäriKamu: image upload, surface selection, brush, roller, eraser, layers, opacity, zoom/pan, undo/redo, reset, before/after, comparison slider, snapshots, local save/restore, PNG/JPG export and quote submission.

SiivousKamu: room/task selection, area, frequency, intensity, optional image, annotations, marker/brush/eraser, zoom, undo/redo, before/after, snapshots, local save/restore, JPG export and quote submission.

Homepage: popup dismissal persists locally and both buttons enter the authentication flow.

## Rollback

If a production regression occurs, restore the previous `public_html` backup or deploy the previous known-good production artifact. Do not delete server-only mail configuration during rollback.
