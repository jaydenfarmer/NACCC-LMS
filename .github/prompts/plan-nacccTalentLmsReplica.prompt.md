# Plan: NACCC TalentLMS Replica in Angular

Build an Angular prototype that closely mirrors NACCC's current TalentLMS setup, focusing on role-based navigation, assignment submission, exam features, and admin analytics to demonstrate feature parity and improved customization potential.

## Steps

### 1. Enhance header and navigation
Add global search bar to `header.component.html`, create notification/message icons with badge counters, add role switcher dropdown (Administrator/Instructor/Learner) to user menu, implement expandable sidebar menus in `sidebar.ts` matching TalentLMS structure per role

### 2. Implement role-specific dashboards
Create separate dashboard layouts for Learner (Recent course activity, announcements), Instructor (Portal activity chart with logins/completions, Quick actions panel), and Administrator (enhanced analytics, user/course/group quick actions) using Chart.js for bar charts in `dashboard.component.ts`

### 3. Build module hierarchy for courses
Refactor `course.model.ts` to add `Module` model with nested `Lesson[]`, update `course-detail.component.ts` to display collapsible module structure, add progress percentage to course sidebar, show completion checkmarks per lesson

### 4. Create assignment submission system
Build new `assignment-submission.component` with rich text editor (Quill/TinyMCE), file upload widget, video/audio/screen recording buttons (initially linking to external recorders or HTML5 Media API), add `AssignmentService` to handle submissions, create grading interface in new `features/instructor/grading-hub/` component

### 5. Develop exam system
Create `exam.component` with password protection input, display exam parameters (question count, time limit, passing score), build quiz-taking engine with question navigation, timer countdown, auto-submit on timeout, add `QuizService` with models for `Quiz`, `Question`, `Answer`, `QuizAttempt` in `core/models/`

### 6. Add missing navigation features
Create `Calendar` component (simple event calendar showing course deadlines), `Learning Paths` page listing sequential course requirements, `Groups` management for admin/instructor, `My Progress` page showing all enrollments with completion stats, update `app.routes.ts` with role-specific routes

## Further Considerations

### 1. Media recording priority?
Assignment video/audio/screen recording can use simple file upload initially or integrate HTML5 MediaRecorder API (record in browser) vs. third-party service (Loom embed) — which approach for prototype?

### 2. Chart library choice?
Chart.js (simple, popular) vs. Apache ECharts (more features) for Portal activity analytics — preference for dashboard charts?

### 3. Backend timeline?
Steps 1-5 can work with mock data (2-3 weeks), but assignment submissions and exam results need persistence — build Node.js + PostgreSQL backend in parallel or after frontend demo?

### 4. Announcement system?
TalentLMS shows banner announcements — implement as static component initially or build full announcement CRUD with date-based display logic?

## Key Features from TalentLMS Analysis

### Critical Missing Features
1. **Assignment submission interface** (text, file, video, audio, screen)
2. **Exam system** (password, proctoring, time limits, passing scores)
3. **Module hierarchy** for courses (nested structure)
4. **Role switcher** in user menu
5. **Portal activity analytics** (charts, metrics)

### Important Enhancements
6. **Global search** in header
7. **Notifications system** with badge counters
8. **Messages/Communication** center
9. **Calendar** functionality
10. **Learning paths** feature
11. **Groups** management
12. **Grading hub** for instructors
13. **Expandable sidebar menus**
14. **Announcement/banner** system

### Nice-to-Have Features
15. **Skills tracking**
16. **Conferences/Webinars**
17. **Branches** (multi-tenant)
18. **Automations**
19. **Dashboard customization**
20. **Legacy interface toggle**
21. **Course store**
22. **My progress** dedicated page
23. **Progress gating** (lock lessons until previous complete)

## Navigation Structure by Role

### Learner
- Home
- My training
- Catalog
- Calendar
- Skills

### Instructor
- Home
- Courses
- Learning paths
- Groups
- Grading Hub
- Conferences
- Reports (expandable submenu)
- Calendar
- Skills

### Administrator
- Home
- Users
- Courses
- Learning paths
- Course store (expandable)
- Groups
- Branches
- Automations
- Notifications
- Reports (expandable)
- Calendar
- Skills
- Account & Settings (expandable)
- Subscription
