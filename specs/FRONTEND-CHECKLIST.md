# Front-End Component-by-Component Implementation Checklist  
A full implementation roadmap for the Czech–Italian hybrid curriculum web app.

---

## 1. Layout Components

### **MainLayout**
- Create responsive container and grid.  
- Implement header with navigation.  
- Add mobile bottom navigation.  
- Integrate auth guard.  
- Connect to **routing structure**.

### **AuthLayout**
- Minimal layout for login/reset pages.  
- Centered form container.  
- No navigation elements.

### **MobileNav**
- Implement icons for Week, Themes, Progress, Settings.  
- Add active state highlighting.  
- Ensure swipe-friendly behavior.

---

## 2. Page-Level Views

### **LoginPage**
- Render `LoginForm`.  
- Handle success → redirect to week overview.  
- Show error messages.  
- Connect to **authStore**.

### **WeekOverviewPage**
- Desktop: render `WeekGrid`.  
- Mobile: render `DayColumn`.  
- Add `WeekNavigation` (previous/next week).  
- Add `HouseholdFilterToggle`.  
- Load week data on mount.  
- Handle activity click → open ActivityDetailPage.

### **ActivityDetailPage**
- Render `ActivityForm`.  
- Load instance details.  
- Allow status updates.  
- Allow reflection entry.  
- Save changes via API.

### **ThemeManagementPage**
- Render `ThemeList`.  
- Add “Create Theme” button → open `ThemeForm`.  
- Handle edit/delete actions.

### **ProgressDashboardPage**
- Render `WeeklyStats`.  
- Render `CategoryBreakdownChart`.  
- Render `ReflectionList`.  
- Load progress data on mount.

### **UserSettingsPage**
- Change password form.  
- Update profile info.  
- Connect to authService.

---

## 3. Feature Modules

### **Auth Module**
#### LoginForm
- Email + password fields.  
- Validation.  
- Submit → authService.login().  
- Store token in authStore.

#### PasswordResetForm
- Email field.  
- Submit → authService.resetPassword().

---

### **WeekPlanner Module**
#### WeekGrid
- 7-column layout.  
- Render `DayColumn` for each day.  
- Drag-and-drop support (desktop).  
- Connect to weekStore.

#### DayColumn
- Render blocks: IMI, CSA, ICA, BR.  
- Render `ActivityInstanceCard` inside each block.  
- Add “Add Activity” button.

#### BlockCard
- Visual container for each block type.  
- Color-coded categories.  
- Click → open activity creation modal.

#### ActivityInstanceCard
- Show activity title + status.  
- Click → open ActivityDetailPage.  
- Status indicator.

#### WeekNavigation
- Buttons: Previous Week / Next Week.  
- Update route and reload data.

---

### **Activities Module**
#### ActivityForm
- Title, category, description, duration.  
- Links + attachments.  
- Validation.  
- Submit → activityService.create/update.

#### ActivityTemplateList
- Fetch templates.  
- Render list of `ActivityTemplateCard`.

#### ActivityTemplateCard
- Show title + category.  
- Edit/delete buttons.  
- Click → open ActivityForm.

---

### **Themes Module**
#### ThemeList
- Fetch themes.  
- Render list of `ThemeCard`.

#### ThemeCard
- Show name + date range.  
- Edit/delete buttons.

#### ThemeForm
- Name, description, start/end dates.  
- Validation.  
- Submit → themeService.create/update.

---

### **Progress Module**
#### WeeklyStats
- Display total completed activities.  
- Display counts per category.  
- Connect to progressStore.

#### CategoryBreakdownChart
- Simple bar chart.  
- Responsive layout.  
- Use lightweight chart library.

#### ReflectionList
- List reflections for the week.  
- Show timestamp + text.

---

### **Household Module**
#### HouseholdTagSelector
- Dropdown: Home A / Home B / Both.  
- Used in ActivityDetailPage.

#### HouseholdFilterToggle
- Toggle filter for week view.  
- Update weekStore filter state.

---

## 4. Reusable UI Components

### **Button**
- Variants: primary, secondary, danger, icon.  
- Disabled + loading states.

### **Input**
- Label + validation message.  
- Controlled component.

### **Select**
- Label + options.  
- Controlled component.

### **TextArea**
- For reflections and descriptions.

### **Modal**
- Overlay + close button.  
- Trap focus for accessibility.

### **Tabs**
- Used in ActivityDetailPage.  
- Keyboard navigation.

### **Card**
- Generic container with padding + shadow.

### **Icon**
- SVG-based.  
- Accepts name + size props.

### **FileUploader**
- Accepts multiple files.  
- Shows preview list.  
- Connects to activityService.

---

## 5. State Management

### **authStore**
- user  
- token  
- login(), logout(), resetPassword()

### **weekStore**
- currentWeek  
- activityInstances  
- loadWeek(), updateInstance(), deleteInstance()

### **activityStore**
- templates  
- loadTemplates(), createTemplate(), updateTemplate()

### **themeStore**
- themes  
- loadThemes(), createTheme(), updateTheme()

### **progressStore**
- weeklyStats  
- reflections  
- loadProgress()

---

## 6. Routing

- `/login`  
- `/week/:weekId`  
- `/activity/:instanceId`  
- `/themes`  
- `/progress`  
- `/settings`

Add auth guard to all except `/login`.

---

## 7. Services (API Clients)

### **apiClient**
- Base URL  
- Inject token  
- Handle errors  
- JSON parsing

### **authService**
- login()  
- logout()  
- resetPassword()

### **weekService**
- getWeeks()  
- getWeek(id)  
- createWeek()  
- updateInstance()

### **activityService**
- getTemplates()  
- createTemplate()  
- updateTemplate()

### **themeService**
- getThemes()  
- createTheme()  
- updateTheme()

### **progressService**
- getWeeklyStats()  
- getReflections()

---

## 8. Utilities

- dateHelpers  
- validationHelpers  
- formattingHelpers  
- constants  
- errorHelpers

---

## 9. Definition of Done (Front-End)

- All components implemented and responsive.  
- All pages connected to API services.  
- State stores fully functional.  
- Routing protected by auth guard.  
- Week planner grid fully interactive.  
- Activity detail modal fully functional.  
- Themes and progress pages complete.  
- No console errors.  
- Lighthouse mobile score ≥ 90.
