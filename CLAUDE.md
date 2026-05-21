# CLAUDE.md — NACCC LMS Project Reference

This file is the source of truth for this project.
Read it fully before writing any code.

---

## Project Overview

A custom Learning Management System (LMS) built for NACCC
(National Association of Credit Counseling).
Multi-tenant, role-aware, accessibility-compliant, and
designed to eventually serve multiple organizations.

---

## Tech Stack

- **Frontend:** Angular 20 (standalone components, Angular Signals)
- **Backend:** Node.js with Express _(Phase 7 — not built yet)_
- **Database:** PostgreSQL _(Phase 7 — not built yet)_
- **Hosting:** AWS _(Phase 7 — not built yet)_
- **Styling:** CSS with Angular component styles
- **Charts:** Chart.js
- **Linting:** ESLint + Prettier (configured — enforce on every save)
- **Testing:** Jasmine/Karma (Angular default — confirm before writing tests)
- **Version Control:** Git with two GitHub remotes

---

## Key Project Files

- **CLAUDE.md** — this file, project rules and reference
- **DATABASE_SCHEMA.md** — complete PostgreSQL schema for all 37 tables.
  Read this before building any feature that touches data.
  Every data model in the UI must match this schema exactly.

---

## Current Project Status

The project is currently a **UI prototype with mock data**.
No backend exists. No database exists.

### Actually Working

- Login page and role switching
- Sidebar and header navigation
- Course catalog with filtering
- Course detail page (module/lesson tree)
- Quiz/exam engine (timer, auto-grading)
- Dashboard with Chart.js bar chart
- Admin panel form

### Mock / Incomplete

- All course data is hardcoded in services — no backend
- Progress tracking uses in-memory signals — resets on refresh
- Assignments have a data model but no submission UI
- Certificates are a TypeScript interface only — no PDF, nothing visible
- Notifications and messages are icon badges with no real data
- Several sidebar links route to pages that do not exist yet

---

## Architecture Rules

### Folder Structure — Feature Based

Group files by feature, not file type.
src/
app/
features/
auth/
courses/
quizzes/
assignments/
certificates/
notifications/
branches/
reporting/
users/
admin/
shared/
components/
services/
models/
guards/
pipes/
core/
interceptors/
layout/

### General Rules

- Standalone components only — no NgModules
- Use Angular Signals for all state management
- TypeScript strict mode — every function has typed inputs and outputs
- No any types — ever
- Keep business logic in services, not components
- Treat AI-generated helper functions as black boxes with
  clear inputs, clear return types, and zero hidden dependencies
- One component per file
- One responsibility per service

---

## Data & State Rules

- There is no backend yet — use localStorage for temporary persistence
- All mock data lives in service files only — never hardcoded in components
- Design every data model to match the planned PostgreSQL schema
- Never invent data relationships — refer to the schema section below
- When the real backend is ready, only the service layer should need to change

---

## Database Schema (Planned — PostgreSQL)

_To be completed before Phase 2 development begins._
_All UI data models must match this schema._

### Core Tables (placeholder — full schema to be added)

- users
- roles
- branches
- courses
- modules
- lessons
- enrollments
- progress
- quizzes
- quiz_attempts
- assignments
- assignment_submissions
- certificates
- notifications
- audit_logs

---

## Roles

| Role           | Access Level                               |
| -------------- | ------------------------------------------ |
| Learner        | Own courses, progress, certificates        |
| Instructor     | Assigned courses, gradebook, announcements |
| Branch Manager | Branch learners, branch reports            |
| Admin          | Full platform access                       |

---

## Development Rules for Claude Code

- **One file at a time** — never build a whole feature in one prompt
- **One task at a time** — surgical, isolated changes only
- **Write tests before writing feature code**
- **Commit after every successful interaction**
- **Never touch the backend or database setup** — that is Phase 7
- **Never install new packages** without flagging it first
- **Never rename or move existing files** without flagging it first
- **Never refactor working code** unless explicitly asked
- Use the @ symbol to pass only the files relevant to the current task
- Periodically ask Claude to refactor a module for duplication
  without changing its behavior

---

## Phases Overview

| Phase | Scope                                                                                 | Status      |
| ----- | ------------------------------------------------------------------------------------- | ----------- |
| 1     | Complete UI prototype, replace mock data with service layer, localStorage persistence | In Progress |
| 2     | Branch management, certificates                                                       | Not Started |
| 3     | Automations                                                                           | Not Started |
| 4     | Reporting & analytics                                                                 | Not Started |
| 5     | Integrations (Salesforce, API, SSO, Zoom)                                             | Not Started |
| 6     | WCAG 2.1 AA compliance & QA                                                           | Not Started |
| 7     | Backend, PostgreSQL, production launch                                                | Not Started |

---

## Must Have Features (Full List)

- Learner dashboard with "what's next" prompt
- Personal notes tied to specific lessons
- Downloadable lesson materials (PDFs, slides)
- Custom user fields (employee ID, office location, hire date)
- User deactivation and reactivation without data loss
- Duplicate user detection and merging
- Ability to leave feedback on submitted assignments
- In-app notifications center
- Learner can message instructor directly
- Prerequisites with hard gates
- Retake policies with configurable limits
- Mandatory course enforcement
- Course versioning
- Mobile responsive design
- Failed login attempt lockout
- Manual grade override for assignments
- Audit log — every admin action timestamped
- Gradebook view per course
- Instructor announcements per course
- Configurable password policies
- Data export for individual learners
- Multi-branch management with isolated learner pools
- Branch-level admin accounts
- Custom branding per branch
- Cross-branch enrollment
- Automated certificate issuance with unique certificate numbers
- PDF certificate generation and download
- Expiration and renewal tracking
- Public certificate verification URL
- CEU tracking and reporting
- Regulatory compliance report exports
- Salesforce integration
- API layer
- SSO (Microsoft or Google)
- Bulk user import via CSV
- Zoom integration

---

## Nice to Have (Future Pipeline)

- Bookmarking
- Course ratings and feedback
- Manager weekly digest email
- Waitlist management
- Learning paths
- Instructor-led training with calendar scheduling
- Groups and cohorts
- Internal messaging
- SCORM/xAPI import
- Multilingual support (Spanish)
- Course store
- Offline mode
- Discussion boards
- Proctor mode
