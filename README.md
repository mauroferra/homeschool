# Czech–Italian Hybrid Curriculum

A private, mobile-first web application for planning and tracking a bilingual (Czech–Italian) weekly and monthly curriculum for a young child. Built from the specs in [`specs/`](specs/).

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
    db/           models, migrations (SQL reference), db.js
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

Requires Node 18+.

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env          # defaults are fine for local dev
npm run db:migrate            # creates tables (SQLite at backend/data/app.db)
npm run db:seed               # admin user, parent user, templates, themes, a sample week
npm test                      # run the API test suite
npm run dev                   # API on http://localhost:4000  (docs at /docs)

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev                   # app on http://localhost:5173, proxies /api to the backend
```

Demo accounts (created by the seed):

| Role  | Email                   | Password    |
|-------|-------------------------|-------------|
| Admin | `admin@homeschool.app`  | `admin123`  |
| Parent| `parent@homeschool.app` | `parent123` |

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
DB_NAME=homeschool
DB_USER=app
DB_PASSWORD=app
```

Then run `npm run db:migrate` and `npm run db:seed` again. Schema is managed by Sequelize; the SQL files in `src/db/migrations/` document the same structure for reference.

## Production deployment

Follow `specs/DEPLOYMENT-PLAN.md`. In short:

1. Build the frontend: `cd frontend && npm run build` → static bundle in `frontend/dist`.
2. Serve `frontend/dist` with Nginx (SPA fallback to `index.html`), reverse-proxy `/api` and `/uploads` to the backend.
3. Run the backend behind PM2/systemd with `NODE_ENV=production`, a real `JWT_SECRET`, HTTPS via Let's Encrypt, and hardened security headers (helmet is already on).
4. Run migrations and seed on the production database.

## Tests

```bash
cd backend && npm test
```

Runs an isolated integration suite against an in-memory SQLite DB covering auth, theme/activity/week CRUD, the instance + progress flow, admin role enforcement, and the password reset flow.
