# Maalaus Multiväri production deployment

1. Run `npm install` and `npm run build`.
2. Upload the contents of `dist/` to the cPanel document root; do not upload the `dist` folder itself.
3. Keep `sitemap.xml` and `robots.txt` at the document root.
4. Configure SPA fallback so application routes serve `index.html`.
5. Confirm `/varikamu` and `/siivouskamu` are crawlable landing pages. Their interactive editors are protected at `/app/varikamu` and `/app/siivouskamu` by the existing customer authentication guard.
6. Confirm the existing customer app environment is configured before testing sign-in.

Legacy `/maalauslaskuri`, `/paint-studio`, and `/cleaning-studio` routes are handled by client-side permanent-style redirects to the new public studio landing pages. Server-level redirects can be added if the hosting provider supports them.
