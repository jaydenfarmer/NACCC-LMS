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
- **Hosting:** Digital Ocean _(Phase 7 — not built yet)_
- **Styling:** CSS with Angular component styles
- **Charts:** Chart.js
- **Linting:** ESLint + Prettier (configured — enforce on every save)
- **Testing:** Jasmine/Karma (Angular default — confirm before writing tests)
- **Version Control:** Git with two GitHub remotes

---

## Key Project Files

- **CLAUDE.md** — this file, project rules and reference
- **DATABASE_SCHEMA.md** — complete PostgreSQL schema for all 59 tables.
  Read this before building any feature that touches data.
  Every data model in the UI must match this schema exactly.

---

## Current Project Status

The project is a **UI prototype with mock data**. No backend, no
database yet (Phase 7). Phase 1A (learner experience) is complete;
Phase 1B (admin tooling, service splits, accessibility) is in progress.

### Working (Phase 1A complete)

- Auth: login with role-aware routing (learner → /my-learning,
  instructor/admin → /dashboard); demo buttons auto-submit; manual
  typing works
- Navigation: horizontal TopNavComponent with role-filtered links,
  global search, avatar dropdown (the old Sidebar/Header components
  were deleted — the empty sidebar dir is a leftover)
- Dashboard: widget architecture (WidgetConfig array) with role-aware
  widgets; Chart.js charts
- Course catalog with search/filter; "View Course" routes to detail
  (no longer enrolls directly)
- Course detail / player: pre-enrollment view, Get Course modal
  (mock 800ms Stripe stub), lesson completion by type, completion
  screen, sticky lesson sidebar, persistent Prev/Skip/Next bar
- Quiz/exam engine: password gate, pre-test landing, one-question
  navigation with answer persistence, countdown timer, results screen
- My Training, My Certificates, Learner Profile pages all exist
- Global search: live dropdown + dedicated results page
- localStorage persistence for enrollments and lesson progress
  (keys: lms.enrollments, lms.lesson_progress)

### Mock / Incomplete

- No backend — all data is mock data in services
- CourseService split in progress (CertificateService → QuizService →
  EnrollmentService → CourseService cleanup)
- Lesson types that render nothing: assignment, audio, web_content,
  scorm, survey
- Certificate PDF download, real retake/Stripe flow, and
  coupon-affects-price are all stubs (later phases)
- No /users/:id detail page — search user-result links are dead
- Notifications and messages panels are no-ops
- /admin route loads an old prototype CRUD stub — to be rebuilt in 1B
- "Passed Tests" / "Completed Assignments" dashboard stats hardcoded 0
  (need attempt/submission tracking)

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
grading/
catalog/
dashboard/
payments/
automations/
settings/

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
- Dashboard must be built with widget architecture from day one —
  each section is a standalone component driven by a widget config array
- Course content editor uses block-based rich text (TipTap recommended)
  Do not install any editor library without flagging first
- Do not use localStorage for anything except temporary progress
  persistence until Phase 7 backend exists
- Learner calendar is read-only — renders data from existing tables,
  no separate calendar_events table needed
- User active/inactive status is enrollment-driven —
  never set manually
- LMS accounts created only on successful payment —
  no guest accounts
- Public catalog accessible without login

---

## Data & State Rules

- There is no backend yet — use localStorage for temporary persistence
- All mock data lives in service files only — never hardcoded in components
- Design every data model to match the planned PostgreSQL schema
- Never invent data relationships — refer to the schema section below
- When the real backend is ready, only the service layer should need to change
- Never store sensitive data in localStorage
  (passwords, payment info, tokens)
- Signal mutations must go through .set() or .update() —
  never mutate signal values directly

---

## Database Schema (Planned — PostgreSQL)

The complete schema is documented in DATABASE_SCHEMA.md
in the root directory. 66 tables across 10 categories.

Read DATABASE_SCHEMA.md before building any feature
that touches data. Every data model in the UI must
match this schema exactly.

Categories:

- People (9 tables)
- Content (10 tables)
- Assessments (12 tables)
- Progress & Enrollment (8 tables)
- Certificates (5 tables)
- Automations (2 tables)
- Payments (6 tables)
- Communication (9 tables)
- System (4 tables)
- Integrations (1 table)

---

## Roles & User Types

### Internal Roles (code-level permissions)

| Role           | Access Level                                       |
| -------------- | -------------------------------------------------- |
| Learner        | Own courses, progress, certificates                |
| Instructor     | All courses, gradebook, grading hub, announcements |
| Branch Manager | Branch learners, branch reports                    |
| Branch Viewer  | Read-only branch reports                           |
| Admin          | Full platform access                               |

### User Types (admin-configurable labels)

User types are configured per tenant in Account & Settings.
NACCC's current user types: SuperAdmin, Admin-Type,
Trainer-Type, Learner-Type, Cengage, CFE_Admin,
FEC_Examinee, Instructor.
Each user type maps to a combination of internal role permissions.

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
- Never use ngModel on a Signal — use signal().set() instead
- Always run ng lint after every change — must stay clean
- Always run ng build to confirm no errors before committing

"- You have full permission to run any
PowerShell or bash command without asking
first. This includes ng lint, ng build,
git commands, file size checks, grep,
and any other diagnostic or build commands.
Never ask permission before running a
command — just run it."

---

## Phases Overview

| Phase | Scope                                                                                           | Status      |
| ----- | ----------------------------------------------------------------------------------------------- | ----------- |
| 1A    | Learner experience — course catalog, course detail, quiz/exam engine, progress tracking         | In Progress |
| 1B    | Admin/instructor tooling — course builder, quiz builder, user management, enrollment management | Not Started |
| 2     | Branch Management & Certificates                                                                | Not Started |
| 3     | Automations & Group Enrollment                                                                  | Not Started |
| 4     | Reporting & Analytics                                                                           | Not Started |
| 5     | Integrations (Salesforce, Stripe, Zoom, Constant Contact, Proctoring service)                   | Not Started |
| 6     | WCAG Accessibility & QA                                                                         | Not Started |
| 7     | Backend & Production Launch (Digital Ocean)                                                     | Not Started |

---

## Must Have Features (Full List)

- Learner dashboard with "what's next" prompt
- Personal notes tied to specific lessons
- Downloadable lesson materials (PDFs, slides)
- Custom user fields (employee ID, office location, hire date)
- User deactivation and reactivation without data loss
- Duplicate user detection and merging
- Assignment marked complete only when instructor accepts — not on submission
- In-app notifications center
- Learner can message instructor directly
- Prerequisites with hard gates
- Exam retake fee — each retake is a separate Stripe purchase, unlimited retakes
- Mandatory course enforcement
- Mobile responsive design
- Failed login attempt lockout
- Manual grade override for assignments
- Audit log — every admin action timestamped
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
- Post-purchase success toast notification — stays on course page
- Course page immediately updates to show enrolled state with Start course button
- Separate confirmation and receipt emails sent automatically
- Confirmation/receipt email to purchaser
- Welcome email with auto-generated login credentials and course link
- System generates password for ALL new accounts (individual and company)
- Company purchase → system generates passwords for each employee → individual notification emails
- Force password change on first login before accessing anything
- "What's next" on dashboard defaults to first enrolled course for new learners
- Lesson navigation: Prev button top left, Next/Skip button top right
- Skip shows when lesson is not yet complete — learner can proceed without completing
- Next shows when lesson is complete — clicking advances and marks lesson complete
- Completion question embedded inline at bottom of lesson content
- Answering completion question correctly changes Skip to Next and marks lesson complete
- Lesson completion methods: with a question (primary for NACCC), with a button, after a period of time
- Password protected exam — cannot access without correct password
- Course completion screen with congratulations
- Immediate certificate generation and download on completion screen
- Certificate downloadable anytime from My Certificates page
- My Certificates page — learner can view all earned certificates
- Certificate shows: course name, issue date, expiration date, certificate number
- Download certificate PDF
- CEU records displayed — credit hours earned per course
- Certificate status: active, expiring soon, expired
- Public verification URL per certificate
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
- Presentation/document upload and external URL — PDF, PowerPoint, etc
- Test builder inside LMS — used for both quizzes and exams, configured differently per use case
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
- CSV and Excel (XLSX) export on all reports
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
- Global passing score — 70% default, but configurable per test
- Global certificate expiration — 2 years hardcoded default
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
- Course list columns: Name, Code, Category, Price, Last updated, Status badge
- Inactive user badge visible inline in course user list
- Progress bar visual display in course user list (not just percentage text)
- Course code field (optional, can be blank)
- "Mandatory units must be completed" indicator on course landing page
- "This course awards a certificate" badge on course landing page
- Course intro video field separate from lesson content
- Course activation toggle (draft/published) matches TalentLMS terminology
- Course options panel with tabs: Info, Availability, Limits, Completion
- Rich text content page as a primary lesson type
- Lesson content supports: headings, images, bullet lists, formatted text (full rich text editor)
- Live session link as a lesson type (embedded Zoom/conference link)
- Publish changes workflow in course editor
- Shared/linked lessons — one lesson reusable across multiple courses
- Linked units indicator showing how many courses use a lesson
- Linked units modal showing all courses using a specific lesson
- Editing a shared lesson updates it across all linked courses
- Complete lesson types: content page, web content, video, audio, presentation/document, iframe, test, survey, assignment, ILT, SCORM
- Audio lesson type
- iFrame lesson type — embed external URL
- Clone lesson from another course — independent copy
- Link lesson from another course — shared connected lesson
- Dashboard widgets are role-aware — instructor and admin see different widget sets
- Instructor widgets: Courses completion rate, Courses progress status, Don't miss, Recent course activity, Today
- Admin widgets: above + Portal activity, Timeline, Users
- Course completion rule — configurable: all units completed OR specific test passed
- When completion rule is "test passed" — select which specific test triggers completion
- Content lock — prevent editing once course is finalized
- Course intro video — YouTube URL or custom video upload
- Access retention toggle — learner keeps access after completing (ON for CEU courses)
- Certificate duration — Forever option for CEU certificates
- Sequential vs free unit ordering per course
- Score calculation method configurable per course
- Certificate assigned at course level in course options
- Alternative prerequisite paths
- Course time limit — number of days to complete after enrollment
- Course timeframe — specific start and end date for access
- Test question types: multiple choice, fill the gaps, ordering, match the pairs, free text, randomized
- Import questions from file for bulk creation
- Reuse existing questions across multiple tests
- Survey question types: multiple choice, free text, Likert scale
- ILT session types: online (integrated), in-person, online (external tools like Zoom)
- Section headers as organizational dividers in course content
- Delay availability per lesson/section — schedule when lesson/section becomes accessible
- Unit options per lesson — individual lesson settings
- Unpublish individual lesson without deleting
- Clone lesson within same course
- Lesson completion method configurable per lesson: with a button, after a period of time, with a question
- Block-based rich text editor for content lessons
- Supported blocks: text, image upload, table, ordered list, unordered list, horizontal line
- Rich text editor supports hyperlinks with link toolbar (open, edit, remove)
- Heading color support in rich text editor
- Content autosaves automatically — publish available at any time
- "You've made changes" indicator shows unsaved state
- Sections used as organizational dividers between any lessons, not just modules
- Rich text editor has inline formatting toolbar: bold, italic, underline, text color, font size, emoji, hyperlink, numbered list, bullet list, text alignment
- Rich text editor has block menu for adding new content blocks
- Test description field — shown to learner before starting
- Practice test mode — same questions, configurable no timer and no proctor requirement
- Questions collapsed by default in editor, expand to edit
- All question types must be built: multiple choice, fill the gaps, ordering, match the pairs, free text, randomized
- Remove from test vs Delete — remove unlinks question from test, delete permanently removes it
- Per-question feedback text — shown to learner after answering
- Question tags for organization and filtering
- Multiple correct answers possible per question (checkboxes not radio buttons)
- Test options panel with Configuration and Weight tabs
- Per-test pass score configurable (not just global 70%)
- Shuffle questions and shuffle answers toggles
- Repetition rules — always, never, if not passed
- Max attempts configurable per test
- Show correct answers — always, never, when passed
- Show given answers, correct/incorrect labels, score toggles
- Show stats after completion toggle
- Hide correctly answered questions toggle
- Per-question feedback visibility — always, never, when passed
- Allow next/previous question navigation toggle
- Check answers before continuing toggle
- Abandon test if cannot pass toggle
- Learner snapshot/photo verification for security
- Password protection per test
- Custom pass and fail messages per test
- Per-question weight configuration
- Course file library — supplementary downloadable files separate from lesson content
- Assignment completion triggered when instructor accepts the answer — not configurable
- Assignment reply methods configurable per assignment: text, file upload, record video, record audio, record screen
- Delay availability in hours or days — lesson hidden until delay passes
- Export in Excel (XLSX) in addition to CSV on all reports
- Learning activities report — all tests and assignments across all courses with completion stats
- Course detail report with tabs: Overview, Users, Learning activities, Unit matrix, Timeline
- Platform-wide timeline — filterable by date, event type, course
- Course-level timeline — all events on a specific course
- Activity chart on course detail — course assignments vs completions over time
- Average completion time chart per course
- Training matrix report — grid of all users vs all course units with 4-state status: not_started, in_progress, completed, failed
- Red X status for failed graded units (tests and assignments)
- Diagonal column headers for dense unit lists
- User search and filter within matrix
- Excel export of full matrix
- Pagination on matrix rows
- User list filter by status and branch (not other fields — search handles name/email)
- User detail tabs: Courses, Groups, Branches, Payments, Files, Info
- Username field separate from email for login
- Files tab on user profile — admins and instructors can attach files to a user
- Files tab on course — admins and instructors can attach files to a course
- Supported file types for upload:
  - TXT, SRT, VTT (2 MB max)
  - GIF, JPEG, PNG (10 MB max)
  - DOC, PDF, XLS, XLSX, DOCX, SQL, EPUB, CSV (200 MB max)
  - PPT, PPTX, AAC, MP3, OGG, WAV, MP4, MOV, AVI, ZIP and others (600 MB max)
- Upload from external URL in addition to direct upload
- Branch subdomain — auto-generated unique URL per branch
- Branch-level internal announcement (logged-in users) and external announcement (login page)
- Default user type per branch — new users get assigned automatically
- Default group per branch — new users join automatically
- Registration cap per branch
- Terms of service per branch
- Branch-level default course image
- Branch files tab
- Branch info tab
- Automation rules engine with trigger → filter → action structure
- User triggers: inactivity deactivation, no purchase deactivation, post-signup course assignment
- Course triggers: completion, failure, score range, certificate expiration, course expiration
- Actions: assign course, deactivate user, delete user, call external URL (webhook), give points
- Score range conditions on automation triggers
- Filter by conditions on automations (branch, user type, group)
- Reset and reassign course on certificate expiration
- Time-based triggers in hours
- Notification rules with: Name, Event trigger, Filter by (courses/branches/user types), Recipient type, Message body, Active toggle
- Smart tags in notification message body — learner name, course name, instructor name, etc
- Send preview email before activating notification
- Notification history log — all sent notifications with recipient, subject, date
- Pending notifications queue with clear option
- System notifications — fixed platform emails: reset password, create password, account confirmation, account activation, export reports, import data
- Configurable global message footer on all emails
- Recipient types: related user, specific recipients, admins, account owner
- Filter notifications by specific courses
- Notification active/inactive toggle
- Hierarchical course categories — parent and child categories
- Category management — name, parent category, price per category
- CAPTCHA on user registration
- Lock account after X failed attempts for Y minutes (configurable)
- External catalog toggle — show/hide course catalog to public
- Show course summary on entering course toggle
- LinkedIn certificate sharing toggle
- API settings page
- Import users via Excel
- Export data as Excel
- Coupon management page — create, edit, deactivate coupons with usage tracking
- User type management — admins can create custom user types with configurable permissions
- Two-factor authentication option
- Custom public homepage editor — hero section, nav bar, featured courses
- Hide branch courses from main catalog toggle per branch
- Invoice auto-generated on every purchase with unique invoice number
- Invoice PDF generation and download
- Invoice management page — list all invoices, filter by status
- Stripe settings page — connect account, configure keys
- Learner sidebar navigation: Home, My training, Catalog, Calendar, Skills
- Learner calendar — displays personal deadlines including:
  - Course expiration dates
  - Certificate expiration dates
  - CEU renewal deadlines
  - Scheduled exam sessions
  - Assignment due dates
- Learner dashboard widgets (fixed): Recent course activity, Overview stats, Today, My courses donut chart, Don't miss alerts
- Overview stats: Completed assignments, Total training time, Passed tests, Completion rate
- My training page with status filters: All, In progress, Completed, Expired, Not passed
- My training category view and favorites view
- Sort by date on My training
- Course favorites — learners can favorite courses
- Total training time tracked per learner
- Not passed as a distinct enrollment status
- Catalog left sidebar with hierarchical category filter checkboxes and course counts
- Catalog view filters: status (All, Not enrolled) and type (All, Courses, Learning paths)
- Course cards show: thumbnail, name, price badge, course type icon
- Pre-purchase course detail page with: category label, title, thumbnail, price button, description, certificate callout, content tab
- "This course awards a certificate" callout on pre-purchase page
- "Mandatory units must be completed" label on course detail
- Course content structure visible but locked until enrolled
- General/uncategorized bucket for courses with no category
- Course card hover state — thumbnail dims, View overlay, + button appears
- Get course modal — shows course name, thumbnail, coupon field, price, checkout button
- Coupon code entry before checkout in modal
- Payment methods: credit/debit card (maybe bank transfer)
- Email pre-filled from learner account on checkout
- Stripe Link support for saved payment info
- Success toast notification on enrollment — "You're now enrolled in [course name]"
- Course detail page updates after enrollment: progress bar, expiry date badge, Start course button replaces price
- Expiry date displays immediately on enrollment —
  duration configurable per course (365 days for core,
  185 for ed2go, none for CEU)
- "View more" expand link on long course descriptions
- Course player layout: left panel with unit list, right content area
- Next and Previous sticky navigation buttons in course player
- Next > button top right of content area
- Currently active unit highlighted in left panel sidebar
- Section headers in course player left panel
- Certificate icon quick access from within course player
- Progress bar in course player left panel
- Files tab accessible from course detail page after enrollment
- Top navigation bar in course player: Prev, completion status message with lock icon, Skip
- Lock icon message variants: "Complete the assignment to continue", "Pass the test to continue", "Answer the question to continue"
- Assignment submission method tiles in course player: Text, Upload a file, Record video, Record audio, Record screen
- Pre-test landing page — shows description and question count before starting
- Question navigation within test — prev/next between questions, not just linear forward
- Question counter showing current question and total (01/100)
- Submit button on test (not Next — different action)
- "Schedule Your Exam" as a content unit in course — instructions for proctored exam scheduling
- Test results screen shows: score percentage, pass/fail status, custom message
- Results screen configurable per test: show correct answers, show given answers, show correct/incorrect labels
- Return to course button on results screen
- If passed — Next button available to continue course
- If failed — schedule retake option
- Learner profile page — same fields as admin edit user but without role, active status, deactivate at, or branch assignment fields
- Learner can edit their own: name, email, bio, profile photo, username, password, timezone, language, custom fields
- PayGo payment plan — courses split into sequential parts
- Each PayGo part requires separate payment before next part unlocks
- PayGo courses linked to parent full course
- PayGo branch contains all PayGo courses
- Proctoring service integration must be API compatible from day one
- Native exam scheduling to replace Calendly — learner requests exam, picks available time slot
- Global email footer configurable in Notification settings —
  off by default, admin can enable and customize
- Recertification payment flow inside LMS — replaces Formstack form
- Recertification price — $100 per certificate flat fee
- Batch renewal — one payment renews all eligible certificates
- Renewal summary shown before payment — lists which certificates will be renewed and total cost
- Catalog visibility toggle per branch — hide catalog for ed2go branch
- Ed2go branch learners see only enrolled courses, no catalog
- After certification ed2go learners added to courses branch to access CEUs
- Automation trigger: on course completion → add user to branch
- Course card is fully clickable — not just price button
- Certificate type: core (expires 2 years) or ceu (never expires)
- CEU credit hours listed in course name
- PayGo sequential payment gating — cannot access next part until previous part paid
- Search bar on learner catalog page
- Learner Skills page — future pipeline
- Learner Calendar — read-only, shows deadlines from existing tables
- Unit matrix in course reports — grid of users vs units with 4-state status
- Two certificate designs: CEU (simple, generated in LMS) and Core (fancy, currently external — must build in LMS)
- Two-factor authentication option
- Scheduled deactivation removed — active/inactive is enrollment-driven
- User profile photo upload
- Custom homepage editor for public-facing landing page
- NACCC course categories fully configurable — admins can add/edit/remove
- Automation: add user to branch on course completion (ed2go → courses branch)
- PayGo is fully self-service — learner adds each part to cart independently
- Congratulations unit at end of each PayGo part with link to next part
- No automatic progression — learner chooses when to purchase next part
- Proctoring service integration — vendor TBD (Integrity Advocate under evaluation; confirm with Heather)
- Two-factor authentication for admin and instructor accounts only
- 2FA not required for learner accounts
- Notification: assignment graded — sent to learner automatically
- Notification: course expiring — sent to learner before expiration
- Proactive exam reminder notifications — configurable frequency
- Google Form embed as a lesson type — iFrame unit can handle this

---

## Nice to Have (Future Pipeline)

- Bookmarking
- Course ratings and feedback
- Manager weekly digest email
- Waitlist management
- Instructor-led training with calendar scheduling
- Groups and cohorts
- Multilingual support (Spanish)
- Course store
- Offline mode
- Discussion boards
- Proctor mode
- First login guided tour
- Instructor calendar with month, week, day views and iCal export
- Groups — bundle users and courses together with group pricing and auto-enrollment
- Group key — self-service enrollment code for corporate clients
- Branch-level Zendesk, Google Tag Manager, Intercom integrations
- Branch-level gamification badge sets
- Learning path automation triggers
- Level-based automation triggers
- Skills and competency tracking system
- Skill levels, self-assessment questions, related courses
- Talent Pool — users organized by skill
- Gamification system — points, badges, levels, rewards
- Badge sets and level configuration
- Leaderboards
- Learning paths — named sequences of courses grouped into sections
- Learning path builder with sections and ordered courses
- Learning path options: activation, availability, limits, completion
- Learning path reports (already captured from reports section)
- Learner-facing skills page with self-assessment quiz
- Course capacity
- Disallow main domain login per branch
- Domain restriction per branch
- Conferences/ILT scheduling with calendar
- Simple learner dashboard toggle
- Access required course status
- Enrollment request approval flow
- Course capacity limits
- Public sharing (anonymous course access)
- Slideshare integration
- BambooHR integration
- LTI 1.3 integration
- LinkedIn Learning integration
- FTP sync for user import/export
- Proctor mode in-exam tools
- Calendar event creation for instructors/admins
- Native survey lesson type (NACCC uses Google Forms via iFrame)
- Gamification (revisit with Heather later)
- Course bundles — sell multiple courses as a discounted package
  (bundles + bundle_courses tables are already staged in the schema)

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

NOTE (POSSIBILITY — not yet committed): Invite-token
registration for company-affiliated counselors.
Problem being solved: prevent duplicate company records
and avoid exposing the member-firm list publicly. Goal is
that the user NEVER names, picks, or types their company —
they arrive already bound to one.

Core rule (decide early, build later): companies are
created ONLY by Salesforce sync or NACCC staff. The
registration path can only RESOLVE to an existing company,
never create one and never show a roster/search of firms.
account_number / salesforce_account_id stay on the
companies table as the silent Salesforce matching key —
never user-typed, never the dedup mechanism.

Two binding mechanisms under consideration:
- Invite token (preferred): staff or firm admin sends a
  signed invite link encoding company_id. Counselor clicks,
  sets password, force-change on first login. This is just
  the email half of the existing "company purchase → system
  generates accounts → individual notification emails" flow.
- Company enrollment code (self-serve fallback): the
  existing "group key" nice-to-have. One opaque LMS-issued
  code per company; server resolves it to exactly one
  company_id or rejects it. No roster shipped to the client.

Duplicate prevention is architectural, not vigilance:
registration has NO insert capability against the companies
table; DB unique constraint on account_number /
salesforce_account_id; users deduped by existing
email-unique-per-tenant constraint. Genuinely unaffiliated
individuals register with email only, company_id stays null.

Sizing: this is a Phase 5 (Salesforce integration) / Phase 7
(backend) BUILD — invite tokens need backend token minting,
email pipeline, and real auth, none of which exist pre-Phase 7.
But the core rule above should be respected by any earlier UI
(esp. the Phase 1B admin panel rebuild) so company management
treats companies as sync-owned, read-mostly records and user
creation as invite-oriented. Confirm approach with Heather.

NOTE: Course content editor uses block-based rich text
(similar to Notion). Recommended library: TipTap.
Do not build a traditional toolbar-style editor.
Do not install any editor library without flagging first.

NOTE: File uploads use Digital Ocean Spaces with multipart
upload support. Max file sizes vary by type — up to 600MB
for video and archive files. Do not use local storage
for any file uploads.

NOTE: User active/inactive status is enrollment-driven.
Active = enrolled in at least one active course.
Inactive = no active enrollments.
Status updates automatically on enrollment
and unenrollment. No time-based inactivity rules.
Inactive users retain login access and can purchase.

NOTE: Learner calendar is read-only — displays
enrollment deadlines, certificate expirations,
exam sessions, and assignment due dates pulled
from existing tables. No separate calendar_events
table needed for learner view.

NOTE: Two certificate designs exist:

- CEU certificate — simple design, generated inside LMS automatically
- Core certification — fancy design, currently generated outside TalentLMS.
  Must be built into the LMS. Has unique certification number,
  expiration date, and boss signature.

Phase split for certificates: the certificate DESIGN / UI is Phase 2;
actual PDF GENERATION and the public verification URL require the
backend and are Phase 7. (A stale in-code alert says "Phase 2" for PDF
generation — correct it to Phase 7 in a future Claude Code pass.)

NOTE: PayGo courses are sequential parts of a full course.
4 parts total, each requiring separate payment before
next part unlocks. PayGo branch contains all PayGo courses.
Ed2go learners do not have access to PayGo courses.

NOTE: Ed2go branch has no catalog — learners only see
enrolled courses. After certification, ed2go learners
are added to the courses branch to access CEU courses.
This can be automated via course completion trigger.

NOTE: User active/inactive is enrollment-driven — already exists ✅

NOTE: Recertification — $100 per certificate flat fee.
One set of 16 CEU credit hours renews ALL eligible
certificates at once in a single batch payment.
This replaces the current Formstack recertification form.

NOTE: CEU gating — CEU courses are gated behind core certification.
A learner can only earn/use CEUs AFTER they are certified. Modeled via
the course_prerequisites table (hard gate). Confirm with Heather whether
the gate is "completed the cert course" or "holds an active certificate."

NOTE: Exam proctoring — a learner may use an INTERNAL NACCC proctor or
supply an EXTERNAL proctor. External proctors require NACCC approval and
do NOT receive a scheduling/Zoom link; internal proctoring auto-generates
the Zoom link. Native scheduling replaces Formstack + Calendly. Proctoring
vendor is TBD (Integrity Advocate under evaluation; currently NACCC staff
proctor manually) and must be API-compatible from day one. Modeled via
the exam_bookings table.

NOTE: Real NACCC course structure has these sections:

- INTRODUCTION (community, intro lessons, grading info)
- INSTRUCTOR INFORMATION (meet instructor, live chat)
- MODULE 1 through MODULE N (content units per module)
- EXAM REVIEW (practice test, schedule exam unit)
- FINAL EXAM (proctored final exam)
  This is the template for how NACCC courses are built.

NOTE: course-detail.component.css is 13+ kB and should be split in Phase 1B.
The completion screen and enrollment modal are self-contained UI states that
belong in their own sub-components with their own CSS files.

NOTE: Rich text editor must support:

- Headings with color
- Inline images
- Hyperlinks with edit/remove toolbar
- Bullet lists
- Block-based editing
  Recommended library: TipTap

NOTE: 'section' is a UI-only lesson type used as a display divider
in the course player sidebar. It does not exist in the database
schema lesson_type enum and will never map to a DB row.
Section items are filtered out of all progress and completion
calculations (type !== 'section' guards are intentional).

NOTE: Phase 7 field mapping warnings — these frontend field names
do not match the database schema and must be corrected in Phase 7:
- AssignmentSubmission.feedback → schema: comments
- AssignmentSubmission.grade → schema: score
- Assignment.maxPoints → schema: max_score
- Certificate.issuedAt → schema: issued_at
- Certificate.certificateNumber → schema: certificate_number
- Certificate.expiresAt → schema: expires_at
- Lesson.time_limit_minutes → belongs on quizzes table, not lessons
- Lesson.pass_message / fail_message → schema: message_if_passed /
  message_if_not_passed on quizzes table

NOTE: Deferred Phase TODOs (removed from code — tracked here):
- passedTests stat in dashboard — source from quiz attempt records
  once attempt tracking is implemented (Phase 1B)
- completedAssignments stat in dashboard — source from assignment
  submissions once submission tracking is implemented (Phase 1B)
- Certificate PDF download — generate and download PDF (Phase 7)
- Certificate public verification URL — open public URL (Phase 7)
- Notifications panel in header — implement slide-in panel (Phase 1B)
- Messages panel in header — implement slide-in panel (Phase 1B)

NOTE: Open questions for Heather:

## Questions for Heather

### Urgent — Foundational

- Does Integrity Advocate have an LMS integration API and what does the integration look like?
- Does NACCC need invoice PDFs per purchase?
- Does NACCC want ACH bank transfer as a payment option?
- Do they use smart tags in notifications?

### Important — Needed before Phase 2/3

- What is the Certificate Check report — what does it show, who uses it, and is it used instead of the public verification URL?
- Can you show me what the custom report builder looks like in TalentLMS?
- Is gamification wanted — revisit from admin side?
- Who initiates recertification — learner self-serve or does admin trigger it?

### Ed2go Specific

- Ed2go learners moving to courses branch after certification — should this be automatic or manual?
- Should ed2go learners see ALL CEU courses or only specific ones after moving to courses branch?
- Confirm course time limits: Core = 365 days, Ed2go = 185 days, CEU = none? Any other variations?

### Low Priority

- Do surveys need to be revisited from an admin side or is Google Forms via iFrame sufficient long term?

### Phase 1A Audit Report

> ⚠️ PARTIALLY STALE: This audit predates the TopNav refactor. Any item
> referencing `header.component.ts`, `sidebar.service.ts`, or
> `SidebarComponent` is obsolete — those files were deleted (the nav is
> now `TopNavComponent`). This affects e.g. BUG 2 (switchRole in header),
> the sidebar.service signal/DOM items, and the `lms.sidebar.collapsed`
> localStorage item. Re-verify each item against current code before
> acting. Items not tied to those files (e.g. BUG 13/14/15 player,
> schema-consistency Category 5) are still live.

Phase 1A QA Audit — Full Code-Trace Report
Flow 1 — Login
BUG 1 — Demo buttons don't auto-submit

login.component.ts:39 — setDemoUser() sets the email/password signals but never calls onSubmit(). After clicking a demo button, the user still has to click "Sign In". The CLAUDE.md "manual typing is broken" note appears stale; the [value] + (input) pattern in the template is correct.

BUG 2 — switchRole('admin') navigates to /admin, not /dashboard

header.component.ts:86 — The destinations map sends admin to /admin (the old CRUD panel AdminComponent). Login was fixed this session to go to /dashboard. Role-switching from the header user menu is still inconsistent.

Flow 2 — Learner Dashboard
BUG 3 — Chart @ViewChild may not resolve

dashboard.component.ts:32 — The #portalActivityChart canvas is inside @for/@switch conditional blocks. The 100ms setTimeout hack in ngOnInit is fragile if signals take longer to settle after a role switch. No fallback if portalActivityChartRef is undefined.

NOTE 4 — Stats widget always shows 0 for Passed Tests and Completed Assignments

dashboard.component.ts:67 — Both are hardcoded to 0 with TODO comments. Expected limitation, but these stats are always wrong for any user.

Flow 3 — Course Catalog
BUG 5 — "Enroll Now" button bypasses the payment and modal flow entirely

courses.component.ts:81 — enroll() calls courseService.enrollCourse() directly: no modal, no price check, no coupon, no toast, no spinner. Paid courses (e.g., $720, $895) can be enrolled for free from the catalog. The entire Get Course modal only exists on course-detail.

MISSING 6 — No price badge on course cards

courses.component.html:78 — Spec requires "Course cards show: thumbnail, name, price badge, course type icon." The catalog card renders stats (rating/enrolled/duration/lessons) but no price.

MISSING 7 — No hover overlay on catalog cards

Spec: "Course card hover state — thumbnail dims, View overlay, + button appears." Not implemented anywhere in the catalog template.

MISSING 8 — Category filter is a dropdown, not a sidebar

Spec: "Catalog left sidebar with hierarchical category filter checkboxes and course counts." Current implementation has a <select> dropdown. The categories list is also hardcoded in the component, not derived from course data.

Flow 4 — Pre-enrollment Course Detail
BUG 9 — Completion date is always today, not actual completion date

course-detail.component.ts:59 — completionDate = new Date().toLocaleDateString(...) is set at component construction. It always shows the date the page first loads, not when the user actually completes all lessons.

BUG 10 — CEU credit hours badge never shows on completion screen

course-detail.component.html:157 — Template checks course()?.is_ceu. No course in mock data sets is_ceu: true; CEU courses only have certificate_type: 'ceu'. The badge will never render.

Flow 5 — Get Course Modal
BUG 11 — Coupon applied but price display never changes

course-detail.component.ts:146 — applyCoupon() sets couponApplied.set(true) and nothing else. The price shown in .modal-price is unchanged regardless of what code is entered.

BUG 12 — Escape key only works when backdrop has focus

course-detail.component.html:349 — (keydown.escape) is bound to the backdrop <div>, not the modal dialog or a global handler. Once focus moves inside the modal form, escape does nothing.

Flow 6 — Course Player
BUG 13 — YouTube iframes blocked by Angular's sanitizer

course-detail.component.html:205 — [src]="lesson.content_body" passes a raw URL string. Angular sanitizes iframe src by default and marks YouTube embed URLs as unsafe. The component never calls DomSanitizer.bypassSecurityTrustResourceUrl(). All video lessons are broken.

BUG 14 — Five lesson types render nothing

course-detail.component.html:202 — The player's @if/@else if chain handles: video, presentation_document, test, iframe, content_page. Types audio, assignment, web_content, scorm, and survey fall through all branches and render an empty <div class="player">.

BUG 15 — Content page shows only a placeholder, not actual content

course-detail.component.html:249 — Every content_page lesson renders <p>Content for this lesson will appear here.</p>. The lesson.content_body field is never rendered.

BUG 16 — "Finish" / "Skip to End" button on the last lesson does nothing

course-detail.component.ts:277 — navigateNext() calls findNextLesson() which returns null when on the last lesson. The guard if (next) this.selectLesson(next) silently skips. Clicking the button has no effect. For the last lesson being a test, the button label is "Skip to End" and appears functional but is dead.

Flow 7 — Quiz Engine
BUG 17 — Timer display rounds minutes instead of flooring them

exam.component.html:73 — timerSeconds / 60 | number:'2.0-0' rounds to nearest integer. At t=5399 (one second into a 90-minute exam), it displays "90:59" instead of "89:59". The minutes digit counts up then back rather than counting down cleanly.

NOTE 18 — Retake flow is a stub alert()

exam.component.ts:170 — scheduleRetake() shows a browser alert. Spec requires a retake purchase flow with Stripe. Expected missing feature, but the alert is jarring UX.

Flow 8 — My Training
BUG 19 — "All types" filter dropdown has no event binding

my-training.component.html:26 — The second <select class="filter-select"> has no (change) handler and no [value] binding. Changing it does nothing.

Flow 9 — My Certificates
BUG 20 — Download PDF and Verify buttons are silent no-ops

my-certificates.component.ts:67 — Both stub methods have empty bodies. Clicking either button produces zero feedback. Should at minimum show a "Coming soon" toast or disabled state.

Flow 10 — Learner Profile
BUG 21 — Demo user Alex Learner can't save without entering a username

profile.component.html:82 — The username field has required and \* label. The mock user has no username set, so ngOnInit pre-fills it as ''. HTML5 validation prevents ngSubmit from firing until a username is entered. First-visit save is blocked.

BUG 22 — "Change Photo" button has no click handler

profile.component.html:27 — The button renders and is clickable but has no (click) binding. Silent no-op with no feedback.

Flow 11 — Global Search
BUG 23 — User result links navigate to a non-existent route

search-dropdown.component.html:11 and search.component.html:31 — Both link to [routerLink]="['/users', user.id]". There is no /users/:id route in app.routes.ts. Clicking a user result redirects to /dashboard.

BUG 24 — Search matches course titles only; catalog search matches title + description + tags

search.service.ts:65 vs courses.component.ts:42 — The header SearchService.search() filters only by c.title. The catalog's filterCourses() also searches description and tags. Inconsistent behavior: a tag-only or description-only match finds courses in the catalog but not via the header search.

Summary

# Severity Flow Issue

1 Medium Login Demo buttons don't auto-submit
2 High Login Header switchRole admin → wrong route
3 Low Dashboard Chart @ViewChild fragile in @for/@switch
4 Low Dashboard Stats passedTests/completedAssignments always 0
5 Critical Catalog Enroll Now bypasses payment flow
6 Medium Catalog No price badge on cards
7 Low Catalog No hover overlay
8 Low Catalog Dropdown filter instead of sidebar
9 Low Course Detail Completion date is load date, not finish date
10 Low Course Detail CEU badge never shows (is_ceu not set in mock data)
11 Low Modal Coupon code has no effect on price
12 Low Modal Escape key only works on backdrop focus
13 Critical Player YouTube iframes blocked by Angular sanitizer
14 Critical Player audio/assignment/web_content/scorm/survey render nothing
15 High Player Content page shows placeholder, not actual content
16 Medium Player Finish/Skip button on last lesson does nothing
17 Medium Quiz Timer minutes round instead of floor
18 Low Quiz Retake is a browser alert stub
19 Medium My Training "All types" dropdown unbound
20 Low Certificates Download/Verify buttons are silent no-ops
21 High Profile Demo user can't save (username required but empty)
22 Low Profile Change Photo button has no handler
23 High Search User result links route to 404
24 Low Search Search service only matches course titles
Critical (must fix before demo): 5, 13, 14

High (significant UX breaks): 2, 15, 21, 23

Medium (noticeable but workable): 1, 3, 16, 17, 19

Low (polish / spec alignment): 4, 6, 7, 8, 9, 10, 11, 12, 18, 20, 22, 24

## Comprehensive

NACCC LMS — Phase 1A Code Quality Audit
Category 1 — Angular Signals Correctness
[exam.component.ts:23–39] — courseId, lessonId, course, lesson, questions, answers, timerSeconds, score are all plain mutable class properties despite changing at runtime. The component mixes signal state (loading, locked, started, finished, currentIndex) with non-signal data for the core exam model. All of these should be signals.

[exam.component.ts:34] — timerSeconds: number = 0 is a plain property read directly in the template. Angular zones will trigger change detection via setInterval, so the display will update, but this is accidental reactivity — not signal-based and fragile if zone handling changes.

[courses.component.ts:27] — filteredCourses = signal<Course[]>([]) is populated imperatively via filterCourses() called from the constructor and three separate event handlers. This should be a computed() signal derived from searchTerm, selectedCategory, and selectedDifficulty. The constructor call and three filterCourses() methods become unnecessary.

[course-detail.component.ts:94–105] — this.route.params.subscribe(...) has no takeUntilDestroyed(). This is a subscription leak — the only acceptable RxJS usage per CLAUDE.md requires the takeUntilDestroyed guard. search.component.ts:27 uses it correctly; this does not.

[sidebar.service.ts] — flyoutOpenItemPath: string | null = null (and related flyout state) is a plain mutable class property controlling UI state across components. Should be a signal<string | null>(null).

[course-detail.component.html:264] — (click)="selectedAnswerIndex.set($index)" — signal .set() called directly from template. Not a violation, but prefer a named method (selectAnswer($index)) to keep template logic minimal per CLAUDE.md.

Category 2 — TypeScript Strictness
$any($event.target).value usages — deliberate template escapes, but flagged per audit rules. Each of these could be replaced with a typed (event: Event) handler method using (event.target as HTMLInputElement).value. Appears in:

login.component.html:22, 30
courses.component.html:13, 26, 37
course-detail.component.html:365
my-training.component.html:17
exam.component.html:13
profile.component.html:48, 57, 73, 87, 100, 116, 130, 148, 163, 179
admin.component.html:195, 208, 219, 232, 248, 263, 286
[course.service.ts:42–43] — const e = item as Record<string, unknown> followed immediately by e['enrollment_date'] as string — unsafe double cast of unknown to string without validation. If stored data is malformed, new Date(undefined) produces a silent invalid Date.

[dashboard.component.ts:103] — getEnrollmentForCourse(courseId: string) — missing return type annotation. Returns Enrollment | null.

[course.service.ts:128–138] — updateProgress() reads const enrollments = this.enrollments(), then does enrollments[index] = { ...enrollments[index], ... } and calls this.enrollments.set([...enrollments]). This works, but mutating the locally-bound array variable before re-setting is an unsafe pattern. Should use .update() with a clean immutable replace.

[auth.service.ts:94] — setDefaultPermissions(user: User): User mutates the passed-in object (user.permissions = [...]) then returns it. The function signature implies it's a pure transform, but it's actually an in-place mutator. Callers pass spread copies ({ ...match.user }), so it's safe today, but the contract is deceptive.

[exam.component.ts:70] — getQuestionsForLesson(...) || [] surrounded by an unnecessary try/catch. The method never throws and always returns an array. The try/catch suppresses hypothetical future errors silently.

[course.model.ts:119] — ExamQuestion.correctIndex: number — single correct answer only. CLAUDE.md explicitly requires "Multiple correct answers possible per question (checkboxes not radio buttons)." The model structurally prevents this.

[admin.component.ts:131–136] — updateFormField<K extends keyof ReturnType<typeof this.courseForm>> — unnecessarily complex generic signature that could be simplified.

Category 3 — Component Architecture
[courses.component.ts:24–25] — categories and difficulties arrays hardcoded in the component. Same categories array duplicated in admin.component.ts:24. Both should reference a shared service or config.

[dashboard.component.ts:124–133] — readonly widgetConfigs: WidgetConfig[] is hardcoded inline in the component. Per CLAUDE.md, this config array should drive the dashboard architecture and eventually be user-configurable. It belongs in a service.

[dashboard.component.html:336–360] — Admin Overview Stats widget hardcodes literal values 248, 42, 1,284, 87% directly in the template. These should come from the service's computed stats — the signal infrastructure exists but isn't wired up here.

[course-detail.component.html:58] — (currentCourse.price ?? 0) === 0 ? 'Enroll Free' : 'Get Course — ' + formatPrice(currentCourse.price!) — label logic in the template. Belongs in a getEnrollButtonLabel() computed signal.

[course-detail.component.html:375] — (c.price ?? 0) === 0 ? enrollFree() : checkout() — conditional method dispatch in a template event binding. Should be a single handleCheckout() method in the component.

[exam.component.html:134] — [class.passed]="score >= (lesson?.passingScore ?? 70)" — comparison in template. Should be a isPassed() computed/method.

ExamComponent — multi-responsibility — handles: route params, password gate, pre-test landing, timer management, question navigation, answer selection, grading, progress persistence, and result display. Should be split.

CourseDetailComponent — multi-responsibility — handles: route subscription, enrollment state, modal open/close, coupon application, mock payment, toast, lesson selection, answer submission, section collapse, lesson completion, progress updates, completion screen. Should be split into sub-components (completion screen, enrollment modal) per the CLAUDE.md note already added.

Category 4 — Service Architecture
CourseService — four responsibilities — manages: course data, enrollment data, lesson progress persistence, exam question data, and certificate data. Should be split into CourseService, EnrollmentService, QuizService, CertificateService.

[course.service.ts:196–222] — getQuestionsForLesson() contains hardcoded question arrays inline in the service, gated by courseId === 'course-1' && lessonId === 'c1-16'. Quiz content belongs in a QuizService.

[course.service.ts:483–540] — getMockCertificates() returns certificate data from CourseService. Certificate data belongs in a CertificateService.

[sidebar.service.ts:60–65] — readInitial() is called during signal field initialization and calls document.body.classList.add(...) during service construction. DOM manipulation during service construction is a lifecycle violation.

[auth.service.ts:128–140] — login() has a try/catch that silently ignores localStorage failures. Acceptable for storage-full edge cases, but any other error is also silently swallowed.

[search.component.ts:27] — takeUntilDestroyed() is used correctly here. ✓ Noted for contrast with course-detail.component.ts.

Category 5 — Naming and Schema Consistency
ID types — all wrong: Schema defines all primary and foreign keys as integer. The UI models use string throughout.

user.model.ts:9 — id: string (should be number)
course.model.ts:90–103 — Enrollment.id, userId, courseId, enrolled_by all string (should be number)
Lesson.time_limit_minutes — course.model.ts:38 — no time_limit_minutes column on lessons table. Timer limits live on the quizzes table. This field is on the wrong entity in the model.

Lesson.pass_message / fail_message — course.model.ts:39–40 — schema names are message_if_passed and message_if_not_passed on the quizzes table.

AssignmentSubmission.feedback — course.model.ts:174 — schema column is comments.

AssignmentSubmission.grade — course.model.ts:175 — schema column is score.

Assignment.maxPoints — course.model.ts:167 — schema column is max_score.

Assignment.submissionTypes: array — course.model.ts:158 — schema uses individual boolean columns (allow_text_reply, allow_file_upload, allow_video_reply, allow_audio_reply, allow_screen_reply), not an array.

Course.created_by?: string — course.model.ts:65 — schema defines this as integer (FK to users).

Certificate.issuedAt, certificateNumber, expiresAt — course.model.ts:179–181 — schema uses issued_at, certificate_number, expires_at. Mixed casing without documentation.

Lesson type 'section' — used throughout the codebase (service, component, model) but does NOT exist in the schema's lesson_type enum. The schema values are: content_page, web_content, video, audio, presentation_document, iframe, test, survey, assignment, ilt, scorm. section is a UI-only concept that bypasses the schema's actual content structure (courses → modules → lessons). This needs to be explicitly documented as a UI-only type that will not map to a DB row.

Enrollment.enrollment_date — course.model.ts:94 — snake_case, inconsistent with userId, courseId on the same interface which are camelCase. The interface mixes conventions.

ExamQuestion.correctIndex — course.model.ts:123 — schema quiz_answers uses is_correct: boolean per row. Single correctIndex structurally prevents multiple-correct-answer questions required by spec.

Category 6 — Dead Code
Dead methods (defined but do nothing):

header.component.ts:75 — openNotifications() — empty body
header.component.ts:79 — openMessages() — empty body
header.component.ts:98 — goToProgress() — navigates to /my-progress which has no route
header.component.ts:103 — goToGroups() — navigates to /groups which has no route
course-detail.component.ts:315 — navigateToExam() — defined but never called; template uses [routerLink] directly instead
Alert stubs that should not be in production code:

course-detail.component.ts:312 — alert('Certificate PDF generation coming in Phase 2')
exam.component.ts:171 — alert('To schedule a retake...')
Empty method stubs with no feedback:

my-certificates.component.ts:67 — downloadCertificate() empty
my-certificates.component.ts:71 — viewVerification() empty
Dead comment:

auth.service.ts:176 — // Additional logout logic
TODOs scattered in code — should be tracked in CLAUDE.md, not inline:

dashboard.component.ts:67 — // TODO: Phase 1A — source from quiz attempt records
dashboard.component.ts:70 — // TODO: Phase 1A — source from assignment submissions
my-certificates.component.ts:68 — // TODO: Phase 7 — generate and download PDF
my-certificates.component.ts:72 — // TODO: Phase 7 — open public verification URL
header.component.ts:75 — // TODO: Implement notifications panel
header.component.ts:79 — // TODO: Implement messages panel
Category 7 — Security and Safety
[auth.service.ts:148] — console.warn(...) in switchRole() — debug artifact in production service code.

[highlight.pipe.ts:14] — this.sanitizer.bypassSecurityTrustHtml(escapedText) is called even on the non-highlight path (no <mark> tags, just escaped plain text). bypassSecurityTrustHtml should only be called when the output actually contains trusted HTML markup. The non-match path should return a plain string, not bypass sanitization.

[announcement-banner.component.html:14] — [innerHTML]="announcement.message" — currently safe because all announcement data is hardcoded in the service. However this binding has no sanitization guard if the data source ever becomes dynamic or admin-configurable. Should use a sanitizer pipe or DomSanitizer.sanitize().

[course-detail.component.ts:312] — alert(...) — browser alert() calls surface developer messages to end users. Replace with toast or disabled button state.

[exam.component.ts:87] — Plain-text password comparison: attempt !== this.lesson.password. Passwords are stored as plain strings in mock data throughout course.service.ts ('exam2024', 'adv2024', 'comm2024', etc.). This pattern must not carry forward to Phase 7.

localStorage usage beyond permitted scope:

lms.sidebar.collapsed in sidebar.service.ts:60 — UI preference storage. CLAUDE.md permits localStorage for "temporary progress persistence until Phase 7" only. Sidebar collapse state is outside this scope.
Category 8 — CSS and Styling
No global CSS custom properties for brand colors. The gradient #667eea → #764ba2 and all accent colors are hardcoded as literals in every component CSS file. A single brand color change requires editing 10+ files.

Files with hardcoded #667eea / #764ba2:

login.component.css — 6 occurrences
courses.component.css — 8 occurrences
course-detail.component.css — 12+ occurrences
dashboard.component.css — 8 occurrences
my-training.component.css — 5 occurrences
exam.component.css — 4 occurrences
my-certificates.component.css — 5 occurrences
profile.component.css — 4 occurrences
sidebar.css — 4 occurrences
header.component.css — 8 occurrences
260px sidebar width — hardcoded in 4 places instead of referencing --sidebar-width:

sidebar.css:9 — width: 260px
sidebar.ts:127 — hardcoded JavaScript value 260
profile.component.css:48 — grid-template-columns: 260px 1fr
layout.component.ts:23 — --sidebar-width: 260px (correct — this is the definition)
64px / 80px header height — hardcoded instead of var(--header-height):

header.component.css:19 — height: 4rem
profile.component.css:25, 57 — top: 80px
dashboard.component.css:174 — top: 80px
Duplicate .progress-track + .progress-fill rules across 4 files:

dashboard.component.css:~269
my-training.component.css:~237
course-detail.component.css:~149
my-certificates.component.css:~231
Duplicate .empty-state block rules across 4 files:

courses.component.css:~275
dashboard.component.css:~319
my-training.component.css:~291
my-certificates.component.css:~253
Duplicate .page-header h1 rules across 3 files (same font-size: 2rem; font-weight: 700; color: #1a202c):

my-training.component.css:17
my-certificates.component.css:12
profile.component.css:11
CSS files over the 6kB warning threshold:

File Size Status
course-detail.component.css ~13 kB Known issue — in CLAUDE.md
dashboard.component.css ~10 kB Over threshold
header.component.css ~8.7 kB Over threshold
admin.component.css ~7.1 kB Over threshold
exam.component.css ~7.0 kB Over threshold
Summary
Category Violations
1 — Angular Signals 6 (subscription leak, 4 plain properties that should be signals, 1 missed computed)
2 — TypeScript Strictness 9 (17 $any() in templates, unsafe cast, mutation pattern, missing return type, unnecessary try/catch, model structural issue)
3 — Component Architecture 8 (hardcoded data × 2, multi-responsibility components × 2, template logic × 3, literal stats in template)
4 — Service Architecture 6 (CourseService 4+ responsibilities, quiz data in wrong service, cert data in wrong service, DOM in constructor, silent catch, fragile update pattern)
5 — Schema Consistency 19 (IDs all wrong type, 6 field name mismatches, section not in schema, mixed naming conventions, correctIndex prevents multi-answer)
6 — Dead Code 12 (5 dead methods, 2 alert stubs, 2 empty stubs, 1 dead comment, 6 TODO comments that belong in CLAUDE.md)
7 — Security & Safety 6 (console.warn, unnecessary bypassSecurityTrustHtml, unguarded innerHTML, alert() stubs, plain-text password pattern, out-of-scope localStorage)
8 — CSS & Styling 15+ (no brand color custom properties in 10 files, sidebar width in 3 wrong places, header height in 3 wrong places, progress bar duplicated in 4 files, empty state duplicated in 4 files, 4 CSS files over threshold)
Before Phase 1B, highest priority items:

Category 5 — section lesson type undocumented as UI-only; ID types are all wrong; several field names will break Phase 7 mapping
Category 1 — course-detail.component.ts:94 subscription leak
Category 4 — Split CourseService before it grows further
Category 8 — Introduce CSS custom properties for brand colors and shared utility classes before Phase 1B adds more components
