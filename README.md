# Faro

Faro is a private, mobile-first web application for planning and tracking a bilingual (Czech–Italian) weekly and monthly curriculum for a young child. Built from the specs in [`specs/`](specs/).

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite, Zustand, react-router, plain CSS (mobile-first) |
| Backend | Node.js + Express, JWT auth, Joi validation, bcrypt |
| Database | Sequelize ORM — **SQLite by default** (zero-setup), switchable to PostgreSQL / MySQL via env |
| API | REST at `/api/v1`, OpenAPI spec served at `/docs` |

## Repo layout

```
backend/
  src/
    api/          Express route files (auth, users, themes, activities, weeks, instances, progress)
    modules/      Controllers + Joi validators per domain
    services/     Stateless business logic
    middleware/   auth, role, validation, error, logging
    db/           models, umzug migrations, db.js
    config/ utils/
  scripts/seed/   admin + demo data seeding
  tests/          node:test integration suite (7 tests)
  docs/api/openapi.yaml
frontend/
  src/
    layouts/      MainLayout (header + desktop nav + MobileNav), AuthLayout
    pages/        Login, WeekOverview, ActivityDetail, Themes, Progress, Settings
    features/     Auth, WeekPlanner, Activities, Themes, Progress, Household
    components/ui/Button, Input, Select, TextArea, Modal, Tabs, Card, Icon, FileUploader
    store/        authStore, weekStore, activityStore, themeStore, progressStore (Zustand)
    services/     apiClient + auth/week/activity/theme/progress services
    utils/        date, validation, formatting helpers, constants
```

## Quick start

Requires Node 18+. Both packages are driven from the repo root via root npm scripts (`npm --prefix`), so no `cd`-ing or workspace config is needed.

### Single command (recommended)

```bash
npm run deploy   # installs both packages, migrates, seeds, builds the SPA, and serves
                 # the whole app (API + frontend) on http://localhost:4000
```

`npm run deploy` is the all-in-one command — install → migrate → seed → build → serve, in one go.

During development, start both servers in a single terminal:

```bash
npm run dev      # API on http://localhost:4000 (docs at /docs) + Vite app on :5173
```

### Individually (for backend/frontend work)

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env          # defaults are fine for local dev
npm run db:migrate            # applies umzug migrations (SQLite at backend/data/app.db)
npm run db:seed               # admin user, parent user, templates, themes, a sample week
npm test                      # run the API test suite
npm run dev                   # API on http://localhost:4000  (docs at /docs)

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev                   # app on http://localhost:5173, proxies /api to the backend
```

Root scripts: `npm run setup` (installs both packages), `npm run dev` (both dev servers, one terminal), `npm run deploy` (full single-command deploy), `npm run build` / `npm run start` (build the SPA / run the API serving it), `npm run db:migrate`, `npm run db:seed`, `npm test`.

Demo accounts (created by the seed):

| Role  | Email                   | Password    |
|-------|-------------------------|-------------|
| Admin | `admin@faro.app`  | `admin123`  |
| Parent| `parent@faro.app` | `parent123` |

Admin can manage users (`/users`). The parent account owns the demo curriculum.

## Features (MVP)

- **Auth** — local email + password, JWT sessions, bcrypt hashing, rate-limited login, password reset flow (dev mode prints the reset link to the server log).
- **Week planner** — 7-day grid on desktop, swipeable day-by-day on mobile. Four default blocks per day (Italian Micro-Immersion, Czech School Alignment, Italian Cultural Activity, Bonding Ritual). Add activities from reusable templates or create ad-hoc ones inline. Week navigation + jump to today.
- **Activity instances** — status (Not started / In progress / Completed / Skipped), per-activity reflection notes, household tag (Home A / Home B / Both) with a week-level household filter.
- **Themes** — monthly themes with date ranges; assign activities to themes.
- **Progress dashboard** — weekly completed counts, per-category breakdown bars, last-4-weeks stacked chart, reflection history (weekly parent note + per-activity notes).
- **Settings** — change password, manage activity templates (CRUD).

## API

- Base: `/api/v1` (see `backend/docs/api/openapi.yaml`, also served at `http://localhost:4000/docs`).
- Everything except `/auth/login`, `/auth/reset`, `/auth/reset/confirm`, `/health` requires `Authorization: Bearer <token>`.
- `/users/*` is admin-only.
- Health check: `GET /health`.

## Using PostgreSQL or MySQL

Set these in `backend/.env` (SQLite remains the default):

```
DB_DIALECT=postgres      # or mysql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=faro
DB_USER=app
DB_PASSWORD=app
```

Then run `npm run db:migrate` and `npm run db:seed` again. Schema is managed by umzug migrations in `src/db/migrations/` (tracked in a `SequelizeMeta` table); new schema changes are added as numbered migration files.

## Production deployment

Follow `specs/DEPLOYMENT-PLAN.md`. In short:

1. Build the frontend: `cd frontend && npm run build` → static bundle in `frontend/dist`.
2. Serve `frontend/dist` with Nginx (SPA fallback to `index.html`), reverse-proxy `/api` and `/uploads` to the backend.
3. Run the backend behind PM2/systemd with `NODE_ENV=production`, a real `JWT_SECRET`, HTTPS via Let's Encrypt, and hardened security headers (helmet is already on).
4. Run migrations and seed on the production database.

## Container deployment (Docker / Podman)

The [`Dockerfile`](Dockerfile) produces a single self-contained image: it builds the Vite frontend, then runs the backend (Express) serving both the API and the built SPA on one port. On boot the entrypoint idempotently applies migrations and seeds the admin user (demo data is optional via `SEED_DEMO`).

### Docker

```bash
docker compose up --build
# or
docker build -t faro .
docker run -p 4000:4000 -e JWT_SECRET=change-me -v faro-data:/app/backend/data faro
```

### Podman

Podman auto-detects `Containerfile` first, so the repo ships an identical copy of the `Dockerfile` under `Containerfile` — either name works:

```bash
podman build -t faro .
# or, explicitly
podman build -t faro -f Dockerfile .
```

Then run it (and optionally compose):

```bash
podman run -p 4000:4000 \
  -e JWT_SECRET=change-me \
  -e ADMIN_EMAIL=admin@faro.app \
  -e ADMIN_PASSWORD=admin123 \
  -v faro-data:/app/backend/data \
  faro

# Compose (podman 4.7+ has a built-in wrapper; otherwise use the docker-compose CLI
# against the podman socket via podman-docker)
podman compose up --build
docker compose up --build
```

One-liner for a full edit-to-browser test cycle — rebuilds the image from your current code, (re)creates the containers (entrypoint re-applies migrations + seed automatically), starts the stack, and all that's left is a browser refresh:

```bash
podman compose up --build --force-recreate
```

To force a fresh image pull (ignoring any locally cached layer), add `--pull always`:

```bash
podman compose up -d --pull always
```

> Note: `docker compose` uses `--pull always` as well, while `podman-compose` supports `--always-fetch-images` on `pull`.

### Publishing to Docker Hub

```bash
# Build with the registry-qualified tag
podman build -t docker.io/mauroferra/faro:latest .

# Log in to Docker Hub (use an access token with read/write permission as the password)
podman login docker.io

# Push the image
podman push docker.io/mauroferra/faro:latest
```

`docker.io/mauroferra/faro:latest` is the image referenced by `docker-compose.yml` and `deploy/synology.yml`. On first push to a new repo the `:latest` tag is created; subsequent pushes overwrite it.

### One-shot build → push → redeploy

`scripts/release.sh` builds the image, pushes it to Docker Hub, stops the compose stack if it's running, pulls the new image, and starts it again:

```bash
./scripts/release.sh           # build + push + restart compose
./scripts/release.sh --no-push # build + restart compose only (skip Docker Hub push)
```

Requires a working `docker` or `podman` with compose support (set `DOCKER=podman` for the latter). Opts out of the compose step with `--no-restart`.

### Container notes

- **Data persistence**: SQLite DB + uploads live in `/app/backend/data`. Use a named volume (as above); on SELinux-enabled hosts (Fedora/RHEL) a bind mount needs the `:Z` label, e.g. `-v ./data:/app/backend/data:Z`.
- **Config via environment** (see [`docker-compose.yml`](docker-compose.yml)): `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SEED_DEMO` (`off` skips demo data), plus `DB_DIALECT`/`DB_HOST`/etc. to switch to PostgreSQL/MySQL. Migrations and seeding run automatically on every start.
- **Image runs as non-root** user `app` (UID 1000); the container exposes `HEALTHCHECK` on `/health`.
- `container_name` in the compose file is honoured by `docker compose` but ignored by `podman-compose` (it generates its own name) — no functional impact.

## Tests

```bash
cd backend && npm test
```

Runs an isolated integration suite against an in-memory SQLite DB covering auth, theme/activity/week CRUD, the instance + progress flow, admin role enforcement, and the password reset flow.
