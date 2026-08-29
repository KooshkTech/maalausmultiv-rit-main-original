# V20 planner URL migration

Canonical public pages:
- `/varikamu`
- `/siivouskamu`

Legacy URLs permanently redirect in Apache `.htaccess` and have client-side aliases for non-Apache previews:
- `/maalauslaskuri` → `/varikamu`
- `/paint-studio` → `/varikamu`
- `/siivoussuunnittelija` → `/siivouskamu`
- `/cleaning-studio` → `/siivouskamu`

The authenticated editors remain under `/app/varikamu` and `/app/siivouskamu` and are marked noindex by the customer app shell.
