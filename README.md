# CreditCounselingLms

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.9.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

<!-- Plan: NACCC TalentLMS Replica in Angular
Build an Angular prototype that closely mirrors NACCC's current TalentLMS setup, focusing on role-based navigation, assignment submission, exam features, and admin analytics to demonstrate feature parity and improved customization potential.

Steps
Enhance header and navigation — Add global search bar to header.component.html, create notification/message icons with badge counters, add role switcher dropdown (Administrator/Instructor/Learner) to user menu, implement expandable sidebar menus in sidebar.ts matching TalentLMS structure per role

Implement role-specific dashboards — Create separate dashboard layouts for Learner (Recent course activity, announcements), Instructor (Portal activity chart with logins/completions, Quick actions panel), and Administrator (enhanced analytics, user/course/group quick actions) using Chart.js for bar charts in dashboard.component.ts

Build module hierarchy for courses — Refactor course.model.ts to add Module model with nested Lesson[], update course-detail.component.ts to display collapsible module structure, add progress percentage to course sidebar, show completion checkmarks per lesson

Create assignment submission system — Build new assignment-submission.component with rich text editor (Quill/TinyMCE), file upload widget, video/audio/screen recording buttons (initially linking to external recorders or HTML5 Media API), add AssignmentService to handle submissions, create grading interface in new features/instructor/grading-hub/ component

Develop exam system — Create exam.component with password protection input, display exam parameters (question count, time limit, passing score), build quiz-taking engine with question navigation, timer countdown, auto-submit on timeout, add QuizService with models for Quiz, Question, Answer, QuizAttempt in core/models/

Add missing navigation features — Create Calendar component (simple event calendar showing course deadlines), Learning Paths page listing sequential course requirements, Groups management for admin/instructor, My Progress page showing all enrollments with completion stats, update app.routes.ts with role-specific routes

Further Considerations
Media recording priority? Assignment video/audio/screen recording can use simple file upload initially or integrate HTML5 MediaRecorder API (record in browser) vs. third-party service (Loom embed) — which approach for prototype?

Chart library choice? Chart.js (simple, popular) vs. Apache ECharts (more features) for Portal activity analytics — preference for dashboard charts?

Backend timeline? Steps 1-5 can work with mock data (2-3 weeks), but assignment submissions and exam results need persistence — build Node.js + PostgreSQL backend in parallel or after frontend demo?

Announcement system? TalentLMS shows banner announcements — implement as static component initially or build full announcement CRUD with date-based display logic? -->