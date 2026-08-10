# API Specification, Database Schema & Wireframes
**Project:** Faro  
**Owner:** Mauro  
**Document Type:** Technical Specification (Raw Markdown)

---

# 1. API Specification (REST)

Base URL (example):  
`https://curriculum.yourdomain.com/api/v1`

Authentication:  
- JWT-based or session cookie-based (developer choice).  
- All endpoints except `/auth/login` and `/auth/reset` require authentication.

---

## 1.1 Auth Endpoints

### POST /auth/login
Authenticate user.  
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "token": "JWT_OR_SESSION_ID",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "parent"
  }
}
```

### POST /auth/logout
Invalidate session or token.

### POST /auth/reset
Trigger password reset email.

---

## 1.2 User Management (Admin Only)

### GET /users
List all users.

### POST /users
Create new user.  
**Body:**
```json
{
  "email": "newuser@example.com",
  "password": "initialPassword",
  "role": "parent"
}
```

### PATCH /users/{id}
Update user (role, active status).

### DELETE /users/{id}
Deactivate user.

---

## 1.3 Themes

### GET /themes
List themes.

### POST /themes
Create theme.  
**Body:**
```json
{
  "name": "Italian Cities",
  "description": "Rome, Venice, Milan",
  "start_date": "2026-09-01",
  "end_date": "2026-09-30"
}
```

### PATCH /themes/{id}
Update theme.

### DELETE /themes/{id}
Delete theme.

---

## 1.4 Activities (Templates)

### GET /activities
List activity templates.

### POST /activities
Create activity template.  
**Body:**
```json
{
  "title": "Italian Storytime",
  "category": "Language",
  "description": "Read a short Italian picture book.",
  "estimated_duration": 10,
  "links": ["https://example.com/story"],
  "theme_id": 3
}
```

### PATCH /activities/{id}
Update template.

### DELETE /activities/{id}
Delete template.

---

## 1.5 Weeks

### GET /weeks
List weeks for user.

### POST /weeks
Create a new week.  
**Body:**
```json
{
  "start_date": "2026-08-03"
}
```

### GET /weeks/{id}
Get week details.

### DELETE /weeks/{id}
Delete week.

---

## 1.6 Activity Instances (Scheduled Activities)

### GET /weeks/{week_id}/instances
List all scheduled activities for a week.

### POST /weeks/{week_id}/instances
Create scheduled activity.  
**Body:**
```json
{
  "day_of_week": 2,
  "block_type": "Italian Micro-Immersion",
  "activity_id": 12,
  "home_tag": "Home A"
}
```

### PATCH /instances/{id}
Update scheduled activity.  
**Body:**
```json
{
  "status": "Completed",
  "reflection_text": "He loved the song."
}
```

### DELETE /instances/{id}
Remove scheduled activity.

---

# 2. Database Schema (ASCII Diagrams)

## 2.1 Users

```
+------------------+
| users            |
+------------------+
| id (PK)          |
| email            |
| password_hash    |
| role             |
| created_at       |
| updated_at       |
+------------------+
```

---

## 2.2 Themes

```
+------------------+
| themes           |
+------------------+
| id (PK)          |
| name             |
| description      |
| start_date       |
| end_date         |
| user_id (FK)     |
+------------------+
```

---

## 2.3 Activities (Templates)

```
+---------------------------+
| activities                |
+---------------------------+
| id (PK)                   |
| title                     |
| category                  |
| description               |
| estimated_duration        |
| links (JSON array)        |
| attachments (JSON array)  |
| theme_id (FK)             |
| user_id (FK)              |
+---------------------------+
```

---

## 2.4 Weeks

```
+------------------+
| weeks            |
+------------------+
| id (PK)          |
| start_date       |
| user_id (FK)     |
+------------------+
```

---

## 2.5 Activity Instances

```
+--------------------------------+
| activity_instances             |
+--------------------------------+
| id (PK)                        |
| week_id (FK)                   |
| day_of_week (0-6)              |
| block_type                     |
| activity_id (FK)               |
| home_tag                       |
| status                         |
| reflection_text                |
| created_at                     |
| updated_at                     |
+--------------------------------+
```

---

# 3. Wireframes (ASCII)

## 3.1 Login Screen

```
+----------------------------------+
|          LOGIN                   |
+----------------------------------+
| Email: [____________________]    |
| Password: [_________________]    |
|                                  |
| [ Login Button ]                 |
|                                  |
| Forgot password                  |
+----------------------------------+
```

---

## 3.2 Week Overview (Desktop)

```
+--------------------------------------------------------------------------------+
| MON | TUE | WED | THU | FRI | SAT | SUN                                       |
+--------------------------------------------------------------------------------+
| IMI | IMI | IMI | IMI | IMI | IMI | IMI                                       |
| CSA | CSA | CSA | CSA | CSA | CSA | CSA                                       |
| ICA | ICA | ICA | ICA | ICA | ICA | ICA                                       |
| BR  | BR  | BR  | BR  | BR  | BR  | BR                                        |
+--------------------------------------------------------------------------------+
Legend:
IMI = Italian Micro-Immersion
CSA = Czech School Alignment
ICA = Italian Cultural Activity
BR  = Bonding Ritual
```

---

## 3.3 Week Overview (Mobile)

```
+---------------------------+
|       MONDAY              |
+---------------------------+
| Italian Micro-Immersion  |
| Czech Alignment          |
| Cultural Activity        |
| Bonding Ritual           |
+---------------------------+
| [Swipe →]                |
+---------------------------+
```

---

## 3.4 Activity Detail

```
+--------------------------------------+
| Activity: Italian Storytime          |
+--------------------------------------+
| Category: Language                   |
| Duration: 10 min                     |
| Description: Read a short book.      |
| Links: [link1] [link2]               |
| Attachments: [file1.pdf]             |
+--------------------------------------+
| Status: [Not Started | Completed]    |
| Reflection: [____________________]   |
+--------------------------------------+
| [Save]                               |
+--------------------------------------+
```

---

## 3.5 Theme Management

```
+--------------------------------------+
| Themes                               |
+--------------------------------------+
| Italian Cities        [Edit] [Del]   |
| Italian Foods         [Edit] [Del]   |
| Italian Holidays      [Edit] [Del]   |
+--------------------------------------+
| [Add New Theme]                      |
+--------------------------------------+
```

---

## 3.6 Progress Dashboard

```
+--------------------------------------+
| Progress Dashboard                   |
+--------------------------------------+
| Week of Aug 3–9                      |
| Completed: 12 activities             |
| Language: 4                          |
| Culture: 3                           |
| Alignment: 3                         |
| Ritual: 2                            |
+--------------------------------------+
| Reflection Notes                     |
| - "He loved the song."               |
| - "Too tired on Wednesday."          |
+--------------------------------------+
```

---

# 4. Developer Notes

### 4.1 Mobile-first
- Responsive CSS grid.
- Avoid hover-only interactions.
- Large tap targets.

### 4.2 Security
- bcrypt for password hashing.
- HTTPS enforced.
- CSRF tokens if using cookies.

### 4.3 Extensibility
- SSO via OAuth2/OpenID Connect (future).
- Multi-user collaboration via role expansion.

---

# 5. Definition of Done (Technical)

- All API endpoints implemented and tested.
- Database schema deployed with migrations.
- Responsive UI for mobile and desktop.
- Authentication fully functional.
- Weekly planner fully functional.
- Activity templates and themes working.
- Progress tracking operational.
- Deployment on private server with custom domain + HTTPS.
