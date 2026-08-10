# Front-End Component Architecture
**Project:** Faro  
**Owner:** Mauro  
**Document Type:** Front-End Architecture (Raw Markdown)

---

# 1. Overview

This document defines the **front-end component architecture** for the Czech–Italian hybrid curriculum app. It assumes a modern SPA framework (React or Vue), mobile-first responsive design, and a clear separation of concerns.

The architecture is divided into:

- Layout components  
- Page-level views  
- Feature modules  
- Reusable UI components  
- State management structure  
- Routing structure  
- Services (API clients)  
- Utilities & helpers  

---

# 2. Component Hierarchy (High-Level)

```
App
 ├── Layout/
 │    ├── MainLayout
 │    ├── AuthLayout
 │    └── MobileNav
 │
 ├── Pages/
 │    ├── LoginPage
 │    ├── WeekOverviewPage
 │    ├── ActivityDetailPage
 │    ├── ThemeManagementPage
 │    ├── ProgressDashboardPage
 │    └── UserSettingsPage
 │
 ├── Features/
 │    ├── Auth/
 │    │    ├── LoginForm
 │    │    └── PasswordResetForm
 │    │
 │    ├── WeekPlanner/
 │    │    ├── WeekGrid
 │    │    ├── DayColumn
 │    │    ├── BlockCard
 │    │    ├── ActivityInstanceCard
 │    │    └── WeekNavigation
 │    │
 │    ├── Activities/
 │    │    ├── ActivityForm
 │    │    ├── ActivityTemplateList
 │    │    └── ActivityTemplateCard
 │    │
 │    ├── Themes/
 │    │    ├── ThemeList
 │    │    ├── ThemeCard
 │    │    └── ThemeForm
 │    │
 │    ├── Progress/
 │    │    ├── WeeklyStats
 │    │    ├── CategoryBreakdownChart
 │    │    └── ReflectionList
 │    │
 │    └── Household/
 │         ├── HouseholdTagSelector
 │         └── HouseholdFilterToggle
 │
 ├── Components/
 │    ├── Button
 │    ├── Input
 │    ├── Select
 │    ├── TextArea
 │    ├── Modal
 │    ├── Tabs
 │    ├── Card
 │    ├── Icon
 │    └── FileUploader
 │
 ├── Store/
 │    ├── authStore
 │    ├── weekStore
 │    ├── activityStore
 │    ├── themeStore
 │    └── progressStore
 │
 ├── Services/
 │    ├── apiClient
 │    ├── authService
 │    ├── weekService
 │    ├── activityService
 │    ├── themeService
 │    └── progressService
 │
 └── Utils/
      ├── dateHelpers
      ├── validationHelpers
      ├── formattingHelpers
      └── constants
```

---

# 3. Layout Components

### MainLayout
- Header (logo, navigation)
- Mobile bottom nav
- Responsive container
- Wraps all authenticated pages

### AuthLayout
- Minimal layout for login/reset pages

### MobileNav
- Bottom navigation bar for mobile
- Icons for Week, Themes, Progress, Settings

---

# 4. Page-Level Views

### LoginPage
- Uses `LoginForm`
- AuthLayout wrapper

### WeekOverviewPage
- Uses:
  - `WeekGrid` (desktop)
  - `DayColumn` (mobile)
  - `WeekNavigation`
  - `HouseholdFilterToggle`

### ActivityDetailPage
- Uses:
  - `ActivityForm`
  - `ReflectionList` (for past reflections)
  - `HouseholdTagSelector`

### ThemeManagementPage
- Uses:
  - `ThemeList`
  - `ThemeCard`
  - `ThemeForm`

### ProgressDashboardPage
- Uses:
  - `WeeklyStats`
  - `CategoryBreakdownChart`
  - `ReflectionList`

### UserSettingsPage
- Change password
- Profile info

---

# 5. Feature Modules

## 5.1 Auth Module
- `LoginForm`
- `PasswordResetForm`
- State: `authStore`
- API: `authService`

## 5.2 WeekPlanner Module
- `WeekGrid` (desktop)
- `DayColumn` (mobile)
- `BlockCard` (Italian micro-immersion, Czech alignment, etc.)
- `ActivityInstanceCard`
- `WeekNavigation`
- State: `weekStore`
- API: `weekService`

## 5.3 Activities Module
- `ActivityForm`
- `ActivityTemplateList`
- `ActivityTemplateCard`
- State: `activityStore`
- API: `activityService`

## 5.4 Themes Module
- `ThemeList`
- `ThemeCard`
- `ThemeForm`
- State: `themeStore`
- API: `themeService`

## 5.5 Progress Module
- `WeeklyStats`
- `CategoryBreakdownChart`
- `ReflectionList`
- State: `progressStore`
- API: `progressService`

## 5.6 Household Module
- `HouseholdTagSelector`
- `HouseholdFilterToggle`

---

# 6. Reusable UI Components

### Button
Variants: primary, secondary, danger, icon-button

### Input
Text input with label + validation

### Select
Dropdown with label

### TextArea
For reflections and descriptions

### Modal
For editing activities, themes, etc.

### Tabs
Used in ActivityDetailPage

### Card
Generic container for lists and items

### Icon
SVG-based icon component

### FileUploader
For attachments in activities

---

# 7. State Management Structure

Recommended:  
- React → Zustand or Redux Toolkit  
- Vue → Pinia  

Stores:

### authStore
- user  
- token  
- login/logout actions  

### weekStore
- currentWeek  
- activityInstances  
- loadWeek(), updateInstance(), etc.

### activityStore
- templates  
- loadTemplates(), createTemplate(), etc.

### themeStore
- themes  
- loadThemes(), createTheme(), etc.

### progressStore
- weeklyStats  
- reflections  
- loadProgress()

---

# 8. Routing Structure

```
/login
/week/:weekId
/activity/:instanceId
/themes
/progress
/settings
```

Protected routes require authentication.

---

# 9. Services (API Clients)

### apiClient
- Base HTTP client (fetch/axios)
- Injects auth token
- Handles errors globally

### authService
- login()
- logout()
- resetPassword()

### weekService
- getWeeks()
- getWeek(id)
- createWeek()
- updateActivityInstance()

### activityService
- getTemplates()
- createTemplate()
- updateTemplate()

### themeService
- getThemes()
- createTheme()
- updateTheme()

### progressService
- getWeeklyStats()
- getReflections()

---

# 10. Utilities

### dateHelpers
- formatDate()
- getWeekRange()

### validationHelpers
- validateEmail()
- validateRequired()

### formattingHelpers
- capitalize()
- truncate()

### constants
- categories
- blockTypes
- householdTags

---

# 11. Definition of Done (Front-End)

- All components implemented and responsive.
- Mobile-first layout verified.
- All pages connected to API services.
- State stores fully functional.
- Routing protected by auth guard.
- Week planner grid fully interactive.
- Activity detail modal fully functional.
- Themes and progress pages complete.
- No console errors.
- Lighthouse mobile score ≥ 90.

```
