# HostGator Shared Hosting — Deployment Guide

This guide covers deploying the React frontend and the PHP contact-form
backend to HostGator Shared Hosting (cPanel). No Node.js, no external
backend services — only PHP + PHPMailer + SMTP.

---

## 1. Build the frontend

On your local machine (or any machine with Node.js):

```bash
npm install
npm run build
```

This produces a `dist/` folder containing the static site **plus** the PHP
backend files (Vite copies everything from `public/` into `dist/`).

## 2. Upload everything to HostGator

1. Log in to cPanel → **File Manager**.
2. Navigate to `public_html` (the web root).
3. Upload **the contents** of `dist/` into `public_html/`.

After upload, your `public_html/` should look like:

```
public_html/
├── index.html
├── assets/                  ← compiled JS + CSS
├── favicon.svg
├── send-mail.php            ← contact form handler
├── send-mail.config.example.php
├── .htaccess                ← security + SPA routing
├── composer.json            ← for Composer install (optional)
└── images/                  ← project/before-after images
```

## 3. Create the SMTP config file

```bash
cp send-mail.config.example.php send-mail.config.php
```

Edit `send-mail.config.php` and replace `REPLACE_WITH_REAL_PASSWORD` with the
password for `info@maalausmultivari.fi` (set in cPanel → Email Accounts).

The `.htaccess` file blocks direct web access to this file, so the password
is never served to browsers.

### Alternative: use cPanel environment variables

If your HostGator plan supports it (cPanel → Software → Set Environment
Variables), add `SMTP_PASS` as an env var instead. The config file reads
env vars first, so this overrides the hardcoded fallback.

## 4. Install PHPMailer — choose ONE method

### Option A: Composer (if SSH/terminal access is available)

```bash
cd public_html
composer install
```

This creates a `vendor/` folder. `send-mail.php` auto-detects it.

### Option B: Manual installation (no terminal needed)

1. Download PHPMailer from:
   https://github.com/PHPMailer/PHPMailer/releases
2. Extract the ZIP and upload the `src/` folder to:
   ```
   public_html/PHPMailer/src/
   ├── PHPMailer.php
   ├── Exception.php
   └── SMTP.php
   ```

`send-mail.php` checks for Composer first, then falls back to the manual
installation automatically — no code changes needed.

## 5. Configure the cPanel email account

Ensure the mailbox `info@maalausmultivari.fi` exists in cPanel → Email Accounts.
The SMTP connection uses:

- **Host:** `maalausmultivari.fi`
- **Port:** `465`
- **Encryption:** `SSL`
- **Username:** `info@maalausmultivari.fi`
- **Password:** the password set in cPanel

## 6. Enable HTTPS

In cPanel → Security → Let's Encrypt SSL, issue a certificate for
`maalausmultivari.fi` and `www.maalausmultivari.fi`. The repo's
`public/.htaccess` already forces HTTPS and redirects `www` to the
canonical non-www host — no manual `.htaccess` edit needed, and this
survives every automated deploy since it's version-controlled.

## 7. SPA routing (already configured)

The `.htaccess` file includes the SPA fallback rule so React Router handles
routes like `/palvelut` and `/yhteystiedot` instead of Apache returning 404.
Real files (like `send-mail.php`) are served normally.

## 8. Test the contact form

1. Visit `https://maalausmultivari.fi/yhteystiedot`
2. Fill in the form and submit.
3. You should receive a notification at `info@maalausmultivari.fi`.
4. The customer receives an auto-reply confirmation.
5. If an error appears, check:
   - `send-mail.config.php` exists and has the correct password.
   - PHPMailer is installed (`vendor/` or `PHPMailer/src/`).
   - The `info@maalausmultivari.fi` mailbox exists in cPanel.

## 9. Security checklist

- [x] SMTP password lives in `send-mail.config.php`, never in React.
- [x] `.htaccess` blocks direct web access to config files.
- [x] `send-mail.php` validates request origin against an allowlist.
- [x] Server-side validation for all required fields.
- [x] Input sanitized against header injection (NUL/CR/LF stripped).
- [x] HTML-escaped output in email bodies (XSS prevention).
- [x] Malformed JSON rejected.
- [x] Invalid UTF-8 normalized.
- [x] Rate limiting (5 requests per 10 minutes per IP).
- [x] Honeypot field catches bots without blocking humans.
- [x] Security headers set via `.htaccess`.
- [x] HTTPS enforced.

## 10. Local development (optional)

The Vite dev server proxies `/send-mail.php` to `http://localhost:8000`.
To test the PHP backend locally:

```bash
# Terminal 1 — start a local PHP server from the public/ folder
cd public
php -S localhost:8000

# Terminal 2 — start the Vite dev server
npm run dev
```

The contact form will POST to the local PHP server during development.

## 11. Automated deploys (GitHub Actions)

Pushing to `main` also triggers `.github/workflows/deploy.yml`, which builds
the project and `rsync`s `dist/` to the cPanel document root over SSH. This
is the day-to-day deployment path — the manual upload in steps 1–2 above is
only needed for the very first deploy.

The rsync step excludes `send-mail.config.php`, `vendor/`, and `PHPMailer/`
from its `--delete` cleanup, so the one-time setup from steps 3–4 (the real
SMTP config and the PHPMailer install) is never wiped by a later automated
deploy. If you rename or relocate any of those on the server, update the
`--exclude` flags in `deploy.yml` to match.
