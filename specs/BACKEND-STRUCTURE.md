# Backend Folder Structure
**Project:** Czech–Italian Hybrid Curriculum Web Application  
**Owner:** Mauro  
**Document Type:** Backend Architecture (Raw Markdown)

---

# 1. High-Level Structure

```
backend/
 ├── src/
 │    ├── api/
 │    ├── modules/
 │    ├── services/
 │    ├── middleware/
 │    ├── db/
 │    ├── config/
 │    ├── utils/
 │    └── app.js (or main.py)
 │
 ├── tests/
 │    ├── auth/
 │    ├── weeks/
 │    ├── activities/
 │    ├── themes/
 │    └── progress/
 │
 ├── scripts/
 │    ├── seed/
 │    └── maintenance/
 │
 ├── docs/
 │    └── api/
 │
 ├── package.json / pyproject.toml
 ├── README.md
 └── .env
```

---

# 2. Detailed Structure

## 2.1 /src/api  
Contains all route definitions. Each route file maps HTTP endpoints to controller functions.

```
src/api/
 ├── auth.routes.js
 ├── user.routes.js
 ├── theme.routes.js
 ├── activity.routes.js
 ├── week.routes.js
 ├── instance.routes.js
 └── progress.routes.js
```

Each route file exports an Express Router (or FastAPI router).

---

## 2.2 /src/modules  
Contains domain logic: controllers + validators + DTOs.

```
src/modules/
 ├── auth/
 │    ├── auth.controller.js
 │    ├── auth.validator.js
 │    └── auth.dto.js
 │
 ├── users/
 │    ├── user.controller.js
 │    ├── user.validator.js
 │    └── user.dto.js
 │
 ├── themes/
 │    ├── theme.controller.js
 │    ├── theme.validator.js
 │    └── theme.dto.js
 │
 ├── activities/
 │    ├── activity.controller.js
 │    ├── activity.validator.js
 │    └── activity.dto.js
 │
 ├── weeks/
 │    ├── week.controller.js
 │    ├── week.validator.js
 │    └── week.dto.js
 │
 ├── instances/
 │    ├── instance.controller.js
 │    ├── instance.validator.js
 │    └── instance.dto.js
 │
 └── progress/
      ├── progress.controller.js
      ├── progress.validator.js
      └── progress.dto.js
```

---

## 2.3 /src/services  
Contains business logic and DB interaction wrappers.

```
src/services/
 ├── auth.service.js
 ├── user.service.js
 ├── theme.service.js
 ├── activity.service.js
 ├── week.service.js
 ├── instance.service.js
 └── progress.service.js
```

Services should be **stateless**, pure logic, reusable across controllers.

---

## 2.4 /src/middleware  
Contains reusable middleware for authentication, validation, logging, etc.

```
src/middleware/
 ├── auth.middleware.js
 ├── role.middleware.js
 ├── error.middleware.js
 ├── validation.middleware.js
 └── logging.middleware.js
```

---

## 2.5 /src/db  
Database connection, migrations, models, and schema definitions.

```
src/db/
 ├── models/
 │    ├── User.js
 │    ├── Theme.js
 │    ├── Activity.js
 │    ├── Week.js
 │    ├── ActivityInstance.js
 │    └── Reflection.js
 │
 ├── migrations/
 │    ├── 001_create_users.js
 │    ├── 002_create_themes.js
 │    ├── 003_create_activities.js
 │    ├── 004_create_weeks.js
 │    └── 005_create_instances.js
 │
 ├── seeds/
 │    ├── seed_users.js
 │    ├── seed_templates.js
 │    └── seed_themes.js
 │
 └── db.js
```

Supports PostgreSQL or MySQL.

---

## 2.6 /src/config  
Environment configuration, secrets, and app settings.

```
src/config/
 ├── env.js
 ├── db.config.js
 ├── auth.config.js
 └── app.config.js
```

---

## 2.7 /src/utils  
Helper functions used across modules.

```
src/utils/
 ├── date.js
 ├── formatting.js
 ├── validation.js
 ├── constants.js
 └── error.js
```

---

## 2.8 /src/app.js (or main.py)
Main entry point:

- Loads environment variables  
- Initializes DB  
- Registers middleware  
- Registers routes  
- Starts server  

```
src/app.js
```

---

# 3. Tests

```
tests/
 ├── auth/
 ├── users/
 ├── themes/
 ├── activities/
 ├── weeks/
 ├── instances/
 └── progress/
```

Use Jest, Mocha, or PyTest depending on backend language.

---

# 4. Scripts

```
scripts/
 ├── seed/
 │    └── run-seed.js
 │
 └── maintenance/
      ├── cleanup.js
      └── backup.js
```

---

# 5. Docs

```
docs/
 └── api/
      └── openapi.yaml
```

---

# 6. Definition of Done (Backend)

- Folder structure implemented exactly as above.  
- All modules separated cleanly (controllers, services, validators).  
- All routes functional and protected by auth middleware.  
- Database models and migrations complete.  
- API documented in `openapi.yaml`.  
- Server runs behind HTTPS on private domain.  
- Local user store authentication fully functional.  

```
