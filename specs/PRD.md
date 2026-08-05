# Product Requirements Document (PRD)
**Project:** Czech–Italian Hybrid Curriculum Web Application  
**Owner:** Mauro  
**Purpose:** Provide developers with a complete specification for building a secure, private, mobile‑friendly web application that manages a Czech–Italian hybrid curriculum for a 6‑year‑old child.

---

## 1. Product Overview

### 1.1 Vision
Create a private, secure web application that allows a parent to design, manage, and track a weekly and monthly Czech–Italian hybrid curriculum. The app supports bilingual development, cultural identity, and emotional continuity across households.

### 1.2 Objectives
- Provide a structured weekly curriculum planner.
- Support Italian cultural and language activities.
- Track progress and reflections.
- Allow theme‑based monthly planning.
- Work seamlessly on mobile and desktop.
- Run on a private webserver with custom domain.
- Authenticate users via a local user store (SSO later).

---

## 2. Users & Roles

### 2.1 Primary User: Parent
- Create/edit weekly curriculum.
- Add activities and templates.
- Track completion and reflections.
- Manage themes and materials.

### 2.2 Secondary Users (Phase 2+)
- Co‑parent (read‑only or limited edit).
- Pedagogical consultant (suggest activities).
- Italian teacher (add language materials).

### 2.3 MVP Roles
- **Admin** — full access, user management.
- **Parent** — curriculum management.

---

## 3. Core Features (MVP)

## 3.1 Authentication & Access
- Local user store (email + password).
- Password reset via email.
- Admin user management (create/deactivate).
- Secure session handling.
- HTTPS enforced.

---

## 3.2 Weekly Curriculum Planner

### 3.2.1 Week View (Primary UI)
- 7 columns (Mon–Sun).
- Each day contains:
  - Italian micro‑immersion block.
  - Czech school alignment block.
  - Italian cultural activity block.
  - Bonding ritual block.
  - Optional custom blocks.
- Desktop: full grid.
- Mobile: swipeable day‑by‑day view.

### 3.2.2 Activity Management
Fields:
- Title  
- Category (Language, Culture, School Alignment, Ritual, Project, Professional)  
- Description  
- Estimated duration  
- Links (array)  
- Attachments (files)  
- Optional theme assignment  

Actions:
- Create activity  
- Edit activity  
- Assign to day/block  
- Drag‑and‑drop (desktop)  

### 3.2.3 Templates
- Built‑in templates (e.g., Italian storytime, Italian breakfast ritual).
- User‑created templates.
- Clone/edit templates.

---

## 3.3 Monthly Themes
- Create/edit themes (name, description, dates).
- Assign activities to themes.
- Calendar view showing active theme.
- Theme‑grouped activity list.

---

## 3.4 Progress Tracking & Reflection

### 3.4.1 Activity Status
- Not started  
- In progress  
- Completed  
- Skipped  

### 3.4.2 Reflection Notes
- Short text field per activity.

### 3.4.3 Weekly Summary
- Activities completed.
- Category coverage.
- Parent reflection field.

### 3.4.4 Basic Analytics
- Completed activities per category.
- Last 4 weeks overview.

---

## 3.5 Two‑Household Support (Basic)
- Tag days as:
  - Home A (Mauro)
  - Home B (co‑parent)
- Activities tagged as:
  - Home A only
  - Home B only
  - Both
- Filter week by household.

---

## 4. Non‑Functional Requirements

### 4.1 Deployment
- Hosted on private webserver.
- Custom domain (e.g., curriculum.mydomain.com).
- Accessible from internet via HTTPS.

### 4.2 Security
- Password hashing (bcrypt or equivalent).
- CSRF protection.
- XSS protection.
- SQL injection protection.
- Secure cookies.
- Session timeout.

### 4.3 Performance
- Mobile‑first optimization.
- Initial load < 2 seconds on typical connections.
- Lightweight front‑end bundle.

### 4.4 Responsiveness & UX
- Mobile‑first design.
- Desktop grid layout.
- Clean, calm UI.
- Large tap targets on mobile.
- Minimal text input where possible.

---

## 5. Technical Stack (Suggested)

### 5.1 Front‑End
- React or Vue.
- CSS grid/flexbox.
- Optional UI library (Tailwind, Bootstrap, Material).

### 5.2 Back‑End
- Node.js (Express/Nest) or Python (Django/FastAPI).
- REST or GraphQL API.

### 5.3 Database
- PostgreSQL or MySQL (preferred).
- MongoDB acceptable if document model preferred.

### 5.4 File Storage
- Local server storage or S3‑compatible bucket.
- File metadata stored in DB.

---

## 6. Data Model (High‑Level)

### 6.1 User
- id  
- email  
- password_hash  
- role  
- created_at  
- updated_at  

### 6.2 Theme
- id  
- name  
- description  
- start_date  
- end_date  
- user_id  

### 6.3 Activity (Template)
- id  
- title  
- category  
- description  
- estimated_duration  
- links (array)  
- attachments (file refs)  
- theme_id (optional)  
- user_id  

### 6.4 Week
- id  
- start_date  
- user_id  

### 6.5 ActivityInstance
- id  
- week_id  
- day_of_week (0–6)  
- block_type  
- activity_id  
- home_tag  
- status  
- reflection_text  
- created_at  
- updated_at  

---

## 7. Key Screens (MVP)

### 7.1 Login
- Email + password.
- Forgot password.

### 7.2 Week Overview
- Grid (desktop).
- Swipeable day view (mobile).
- Add/edit/complete activities.

### 7.3 Activity Detail
- Title, category, description.
- Links, attachments.
- Status selector.
- Reflection field.

### 7.4 Theme Management
- List themes.
- Create/edit themes.
- Assign activities.

### 7.5 Progress Dashboard
- Weekly stats.
- Category breakdown.
- Reflection history.

### 7.6 User Settings
- Change password.
- Basic profile info.

---

## 8. Roadmap (Post‑MVP)

- SSO integration (OAuth2 / OpenID Connect).
- Multi‑user collaboration.
- Notifications (email/push).
- PDF export of weekly plan.
- Localization (Italian/Czech UI).
- Advanced analytics.

---

## 9. Definition of Done (MVP)

- App deployed on private webserver with custom domain.
- HTTPS enforced.
- Local user authentication fully functional.
- Parent can:
  - Log in.
  - Create themes.
  - Create activity templates.
  - Build weekly curriculum.
  - Assign activities to days/blocks.
  - Track completion and reflections.
  - View weekly overview and basic analytics.
- UI responsive on mobile and desktop.
