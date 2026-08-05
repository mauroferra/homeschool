## Backend Implementation Checklist  
A practical, sequential roadmap for building the Czech–Italian hybrid curriculum backend.

---

### Phase 1 — Project Setup

- **Initialize repository**  
  Create Git repo, set up branching model, add README.

- **Environment configuration**  
  - Create `.env` file with DB credentials, JWT secret, server port.  
  - Add environment loader (dotenv or equivalent).

- **Install core dependencies**  
  - Web framework (Express, FastAPI, Django).  
  - Database client/ORM (Sequelize, Prisma, SQLAlchemy).  
  - Validation library (Joi, Pydantic).  
  - Authentication library (JWT or session middleware).

- **Create backend folder structure**  
  Follow the architecture defined earlier.

---

### Phase 2 — Database Layer

- **Define database models**  
  Implement models for User, Theme, Activity, Week, ActivityInstance, Reflection.

- **Create migrations**  
  - Users table  
  - Themes table  
  - Activities table  
  - Weeks table  
  - ActivityInstances table  
  - Reflections table  

- **Implement DB connection module**  
  - Connection pooling  
  - Error handling  
  - Health check endpoint

- **Seed initial data**  
  - Admin user  
  - Sample activity templates  
  - Sample themes

---

### Phase 3 — Authentication & Authorization

- **Implement auth service**  
  - Register/login/logout  
  - Password hashing (bcrypt)  
  - JWT or session issuance  
  - Token validation

- **Role-based access control**  
  - Admin vs Parent  
  - Middleware to enforce roles

- **Password reset flow**  
  - Generate reset token  
  - Email delivery  
  - Reset endpoint

---

### Phase 4 — API Modules

Implement each module according to the Swagger/OpenAPI spec.

#### Auth Module
- Login  
- Logout  
- Password reset  

#### Users Module
- List users  
- Create user  
- Update user  
- Delete user  

#### Themes Module
- List themes  
- Create theme  
- Update theme  
- Delete theme  

#### Activities Module
- List activity templates  
- Create template  
- Update template  
- Delete template  

#### Weeks Module
- List weeks  
- Create week  
- Get week details  
- Delete week  

#### Activity Instances Module
- List instances for a week  
- Create instance  
- Update instance  
- Delete instance  

#### Progress Module
- Weekly stats  
- Reflection list  

---

### Phase 5 — Middleware & Utilities

- **Auth middleware**  
  Validate tokens, attach user to request.

- **Validation middleware**  
  Use schema validators for all POST/PATCH endpoints.

- **Error middleware**  
  Unified error format, HTTP status mapping.

- **Logging middleware**  
  Request/response logging (dev mode).

- **Utility modules**  
  - Date helpers  
  - Formatting helpers  
  - Constants  
  - Error helpers

---

### Phase 6 — Testing

- **Unit tests**  
  - Services  
  - Controllers  
  - Utilities  

- **Integration tests**  
  - API endpoints  
  - Auth flow  
  - DB operations  

- **Test data isolation**  
  Use separate test database.

---

### Phase 7 — Documentation

- **Integrate Swagger/OpenAPI**  
  Serve YAML via `/docs` endpoint.

- **Add usage examples**  
  For each endpoint: request + response.

- **Add architecture documentation**  
  Backend folder structure  
  Data model diagrams  
  Auth flow diagrams

---

### Phase 8 — Deployment

- **Prepare production environment**  
  - Hardened server  
  - HTTPS enabled  
  - Reverse proxy (Nginx or Traefik)

- **Configure environment variables**  
  Production DB, secrets, logging level.

- **Run migrations**  
  Apply schema to production DB.

- **Start application**  
  PM2, systemd, or Docker container.

- **Monitoring & logging**  
  - Error logs  
  - Access logs  
  - Health check endpoint

---

### Phase 9 — Post‑Deployment Validation

- Verify all endpoints against Swagger.  
- Test authentication and role restrictions.  
- Validate week planner logic end‑to‑end.  
- Confirm reflections and progress tracking.  
- Check mobile and desktop client integration.
