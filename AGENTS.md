# AGENTS.md

Czech–Italian hybrid curriculum app. Two independent packages in one repo — no npm workspaces, install/run each separately.

## Layout & entrypoints
- `backend/` — Express (ESM, `"type": "module"`). Entry `src/app.js`. API base `/api/v1`, health `/health`, OpenAPI YAML at `/docs`.
- `frontend/` — Vite + React 18 + Zustand. Entry `src/main.jsx`. Dev server `:5173` proxies `/api` and `/uploads` → backend `:4000`.
- Specs live in `specs/`; the code was built to match them (API-SPEC / swagger.yaml, FRONTEND-ARCH, BACKEND-STRUCTURE).

## Setup / run (backend first)
There is a root `package.json` that drives both packages via `npm --prefix` (no workspaces). All-in-one: `npm run deploy` (install → migrate → seed → build SPA → serve on :4000). Both dev servers in one terminal: `npm run dev`. Or step-by-step:
```bash
cd backend && npm install && cp .env.example .env
npm run db:migrate && npm run db:seed   # required before first dev run (no auto-migrate in dev)
npm run dev                              # :4000
cd ../frontend && npm install && npm run dev   # :5173
```
Seed logins: `parent@homeschool.app / parent123`, `admin@homeschool.app / admin123`. `SEED_DEMO=off` skips demo data (admin is always seeded). Passwords reset links are printed to the backend log in dev.

## Verification (there is NO linter, formatter, or typecheck)
- Backend: `cd backend && npm test` — node's built-in test runner; single integration file `tests/api.test.js` that syncs its own **in-memory** SQLite (`NODE_ENV=test DB_STORAGE=:memory:`), seeds a user, and exercises the API. Standalone; does not touch `data/app.db`.
- Frontend: `cd frontend && npm run build` (catches JSX/import errors).

## Backend gotchas (non-obvious wiring)
- **Schema is managed by Sequelize `sync()`**, not the SQL files. `npm run db:migrate` = `db.sync()`; the SQL in `src/db/migrations/*.sql` is reference documentation only and is never executed.
- **Models**: each file in `src/db/models/*.js` calls `getSequelize()` at import; associations are defined in `src/db/models/index.js`. Import `./db/models/index.js` (side-effect) before querying; services import named models from it.
- **Route mounting**: auth routes are mounted at `/api/v1/auth` (routes inside are `/login`, `/reset`, `/me`, …). `instanceRoutes` is mounted broadly at `/api/v1` and calls `router.use(auth)` — it would intercept any path not matched by earlier routers, so mount any new public route **before** `app.use(config.apiBase, instanceRoutes)` in `src/app.js`.
- **`app.js` must not listen on import**: server startup is guarded by an `isDirectRun` check, so tests can `import { createApp }`. Don't move the `listen()` call into module scope.
- **Dates are timezone-sensitive**: `src/utils/date.js::dateOnlyISO` builds `YYYY-MM-DD` from *local* date components on purpose. Do not switch it back to `toISOString().slice(0,10)` — that reintroduces a UTC off-by-one (repo is in UTC+2).
- **SPA serving**: backend serves `frontend/dist` (SPA fallback) if it exists. In dev, Vite serves the frontend, so the dist fallback is inactive unless a build is present.

## Accepted dependency warnings (do not "fix" by upgrading)
- A clean `npm ci` in `backend/` still prints 3 deprecated-package warnings: `dottie@2.0.7`, `prebuild-install@7.1.3`, and `uuid@8.3.2`. These are **hard-pinned inside Sequelize v6 and `sqlite3`** — upgrading the top-level packages to latest does not and cannot remove them:
  - `dottie` is an internal dependency of Sequelize at every version (v7 alpha still uses it); only dropping the ORM removes it.
  - `prebuild-install` belongs to the `sqlite3` native module; Sequelize v6's sqlite dialect hard-requires `sqlite3`, so it can't be swapped for `better-sqlite3`/`node:sqlite` without a dialect migration.
  - `uuid@8` is pinned by Sequelize v6 (v7 uses `uuid@11`), but Sequelize v7 is still `7.0.0-alpha.*`.
- Decision (Aug 2026): stay on Sequelize v6 + `sqlite3` and accept these warnings rather than migrate to alpha ORM code or rewrite the data layer.

## Config & secrets
- Backend reads `backend/.env` (dotenv, resolved relative to `src/config/env.js`). `.env` is gitignored; `.env.example` is the tracked template.
- `DB_DIALECT=sqlite` default; Postgres/MySQL via env. `data/` (SQLite DB + uploads) is gitignored runtime state.

## Containers
- `Containerfile` is a **symlink to `Dockerfile`** (single source of truth — edit `Dockerfile` only). Podman auto-detects `Containerfile`; `podman build -t homeschool .`.
- Container entrypoint auto-runs migrate + seed every start (idempotent), so no manual `db:migrate`/`db:seed` inside the container. Persist `data/` (uploads) via a volume on `/app/backend/data`.
- `docker-compose.yml` provisions a **PostgreSQL** service (`postgres-data` volume) as the persistent DB; the `curriculum` service depends on its `pg_isready` healthcheck before migrate/seed run. Build with `podman build -t homeschool .`.
- Deployment details: `specs/DEPLOYMENT-PLAN.md`; compose + env vars in `docker-compose.yml`.
