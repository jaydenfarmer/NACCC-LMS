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

| Phase | Scope                                                                                           | Status      |
| ----- | ----------------------------------------------------------------------------------------------- | ----------- | --- | ----------- |
| 1A    | Learner experience — course catalog, course detail, quiz/exam engine, progress tracking         | In Progress |
| 1B    | Admin/instructor tooling — course builder, quiz builder, user management, enrollment management | Not Started |
| 2     | Branch Management & Certificates                                                                | Not Started |
| 3     | Automations                                                                                     | Not Started |
| 4     | Reporting & Analytics                                                                           | Not Started |
| 5     | Integrations (Salesforce, Stripe, SSO, Zoom)                                                    | Not Started |
| 6     | WCAG Accessibility & QA                                                                         | Not Started |
| 7     | Backend & Production Launch                                                                     | Not Started |     | Not Started |

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
- Exam retake fee — each retake is a separate Stripe purchase, unlimited retakes
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
- Public facing course catalog (no login required)
- Combined registration and checkout flow (account created only on successful payment)
- Guest users never become LMS accounts until they pay
- "I'm Interested" lead capture form → Salesforce Lead → automated program information email (no LMS account created)
- Post-purchase confirmation page with direct course link
- Confirmation/receipt email to purchaser
- Welcome email with auto-generated login credentials and course link
- System generates password for ALL new accounts (individual and company)
- Company purchase → system generates passwords for each employee → individual notification emails
- Force password change on first login before accessing anything
- "What's next" on dashboard defaults to first enrolled course for new learners
- Opening a lesson automatically marks it complete
- Password protected exam — cannot access without correct password
- Course completion screen with congratulations
- Immediate certificate generation and download on completion screen
- Certificate downloadable anytime from My Certificates page
- My Certificates page
- Expiration alerts via email and in-app notification
- Dashboard widget showing expiring certificates with links to relevant CEU courses
- Full learner history page
- User profile with tabs: Courses, Branches, Payments, Info
- Branch selector on user management page filters user list dynamically
- Admin password reset — set new password directly
- Admin can change user role from user profile
- User can belong to multiple branches (user_branches bridge table needed)
- Course builder — create, edit, publish courses (admin and instructor)
- Courses start as draft by default
- YouTube embed for video lessons
- PDF upload and external URL link for PDF lessons
- Quiz/exam question builder inside LMS
- Instructor course preview as learner
- Archive courses instead of hard delete
- Enrollment count visible on course management page
- Enroll from user profile → select course OR from course → select users
- Bulk enrollment — select multiple users enroll into one course
- Enrollment notification email to learner when admin enrolls them
- Expiration date configurable at enrollment time
- Complimentary enrollment — admin can enroll without payment
- Unenrollment preserves progress for future re-enrollment
- Per-course user list with: User, Role, Progress status, Enrollment date, Completion date, Expiration date
- Refund and unenrollment handled as separate actions
- Suspended enrollment status for check/manual payment learners
- Suspended learners can see course but cannot access content
- Admin can activate suspended enrollment when payment clears
- Activation notification email to learner
- Reports section with sub-navigation matching TalentLMS structure
- Overview report — platform wide stats (active users, never logged in, assigned courses, completed courses, activity chart, course completion donut chart)
- User report — completion rate, completed courses, in progress, not passed, not started, training time, per user table
- Course report — completion rate, completed/in progress/not passed/not started learners, training time, per course table
- Branch report — scoped to branch level
- CSV export on all reports
- Admins and instructors can access reports
- 30-day and 60-day certificate expiration warnings (email + in-app)
- Inactivity = expired course, internal flag only — learner can still login and purchase
- Automatic reactivation when inactive learner makes a purchase
- CEU completion → Salesforce sync
- Exam score → Salesforce sync
- Certificate earned → Salesforce sync
- Deactivate inactive users automation (configurable window)
- Branch manager notifications when learner completes course or earns certificate
- Constant Contact integration — automatically sync new Leads and Contacts from Salesforce
- Native exam scheduling flow — replaces Formstack exam request form and Calendly
- Learner selects available time slot from inside LMS
- Automatic Zoom link generation for scheduled exam
- Proctor notification on new exam booking
- Proctoring service API integration (vendor TBD — confirm with Heather)
- Global passing score — 70% hardcoded default
- Global certificate expiration — 2 years hardcoded default
- Exam retake fee — each retake is a separate Stripe purchase
- Retake purchase flow — fail exam → prompted to buy retake → payment → unlocked
- Notification management page — event based, set recipients, active/inactive toggle
- Admin can add custom notification rules
- Platform name configurable in branding settings
- Favicon upload in branding settings
- CEU submission form — learner uploads external certificate proof (seminar, college credit, course completion)
- Admin reviews and approves CEU submissions
- Approved CEU submissions add credit hours to renewal tracker
- CEU certificates never expire
- Core course certificates expire after 2 years
- Certificate number permanent — never changes after renewal
- Global renewal threshold — 16 credit hours hardcoded
- Instructor dashboard — pending submissions, upcoming exams, recent activity
- Instructor sees all courses and all learners across platform
- In-LMS messaging to individual learners
- Exam day notification with Zoom link for instructor
- Instructor reporting — progress, assessment performance, completion rates
- Email template management page (admin and instructor access)
- Branch creation and management UI
- Platform branding settings — logo, colors, platform name, favicon
- Stripe account connection in admin settings
- Course versioning — update without wiping learner progress
- Gradebook view per course
- Assignment submission review and grading with written feedback
- Grading Hub as dedicated section in instructor sidebar with pending count badge
- Grading Hub has two tabs: Assignments and ILT Sessions (ILT tab shows empty state until ILT feature is built — confirm with Heather whether NACCC actively uses ILT)
- Assignment queue table: User, Course, Unit, Submission date, Grade date, Grade, Status
- Slide-in grading panel with three tabs: Assignment, Submission, Grade
- Submission viewer shows file uploads with preview and download
- Submission viewer shows text responses inline
- Multiple submission history dropdown per assignment
- Grading Hub badge updates in real time as items are graded
- Grade tab: numeric grade input + comments text area
- Assignment instructions support rich text formatting
- Configurable pagination on grading queue (10, 25, 50 per page)
- Terminology: use "Comments" not "Feedback" for instructor notes on assignments
- Assignment instructions visible to both learner when submitting AND instructor when grading — same content, two contexts

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
- First login guided tour

NOTE: notification_preferences are tenant-controlled
by admins, NOT per-user. This is intentional.
Do not add user_id to this table without discussion.

NOTE: enrollments.group_id references enrollment_groups
which does not exist yet. This column must stay nullable
and must not be queried or joined until Phase 3.
Do not design UI or services around group enrollment
until that table is formally designed.

NOTE: Dashboard must be built with widget architecture
from day one. Each section is a standalone component
driven by a widget config array. Drag-and-drop
customization UI comes later but structure must
support it from the start.

NOTE: LMS accounts are only created upon successful
payment. No guest accounts. The interest/lead form
creates a Salesforce Lead only — no LMS account.
The public catalog is accessible without login.
