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

The project is currently a **UI prototype with mock data**.
No backend exists. No database exists.

### Actually Working

- Login page and role switching
- Sidebar and header navigation
- Course catalog with filtering
- Course detail page (module/lesson tree)
- Quiz engine — routes correctly, timer works, but grading is broken and answers not persisting
- Dashboard with Chart.js bar chart
- Admin dashboard with platform overview stats
- Learner dashboard with Chart.js stats
- Course catalog with search and filtering
- Course detail page with module/lesson tree
- Role switching between Learner, Instructor, Admin

### Mock / Incomplete

- All course data is hardcoded in services — no backend
- Progress tracking uses in-memory signals — resets on refresh
- Assignments have a data model but no submission UI
- Certificates are a TypeScript interface only — no PDF, nothing visible
- Notifications and messages are icon badges with no real data
- Several sidebar links route to pages that do not exist yet
- Progress resets on page refresh — no localStorage persistence yet
- All sidebar links except Home and Courses route to dashboard
- No pages exist for: Users, Branches, Notifications, Reports, My Training, My Certificates, Grading Hub
- Search bar in header is broken
- Login requires demo buttons — manual typing is broken

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
in the root directory. 59 tables across 10 categories.

Read DATABASE_SCHEMA.md before building any feature
that touches data. Every data model in the UI must
match this schema exactly.

Categories:

- People (9 tables)
- Content (9 tables)
- Assessments (11 tables)
- Progress & Enrollment (6 tables)
- Certificates (5 tables)
- Automations (2 tables)
- Payments (6 tables)
- Communication (7 tables)
- System (3 tables)
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
- Integrity Advocate proctoring service integration
- Two-factor authentication for admin and instructor accounts only
- 2FA not required for learner accounts
- Notification: assignment graded — sent to learner automatically
- Notification: course expiring — sent to learner before expiration
- Proactive exam reminder notifications — learners want more of these
- Google Form embed as a lesson type — iFrame unit can handle this
- Integrity Advocate proctoring service integration
- Two-factor authentication for admin and instructor accounts only
- Notification: assignment graded → learner
- Notification: course expiring → learner
- Exam reminder notifications — configurable frequency
- Total training time tracked and reportable per learner
- Google Form embeddable via iFrame lesson type

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

NOTE: Real NACCC course structure has these sections:

- INTRODUCTION (community, intro lessons, grading info)
- INSTRUCTOR INFORMATION (meet instructor, live chat)
- MODULE 1 through MODULE N (content units per module)
- EXAM REVIEW (practice test, schedule exam unit)
- FINAL EXAM (proctored final exam)
  This is the template for how NACCC courses are built.

NOTE: Rich text editor must support:

- Headings with color
- Inline images
- Hyperlinks with edit/remove toolbar
- Bullet lists
- Block-based editing
  Recommended library: TipTap

NOTE: Open questions for Heather:

- Who manages PayGo enrollments — automatic or manual?
- Do any tests use fill the gaps, ordering, or match the pairs?
- Which of the 4 active notifications are critical to replicate day one?
- Do branches have their own payment processors?
- Does the proctor need any tools inside the LMS during exam?
- Do any courses have audio lessons?
- Do any courses use surveys?
- Do you use ILT Sessions or Conferences beyond proctored exams?
- Which report types does NACCC use regularly?
- Are any reports submitted to accreditation bodies?
- Does anyone get scheduled reports emailed to them?
- What does the custom report builder need to do?
- What does NACCC use Constant Contact for specifically?
- What notifications are learners currently getting?
- What notifications do learners complain about?
- Which proctoring service is NACCC considering?
- Do instructors record video, audio, or screen directly in TalentLMS?
- Does NACCC use Slideshare?
- Does NACCC use Groups actively?
- Does NACCC use registration cap on any branches?
- Do they use smart tags in notifications?
- Do learners use Favorites in TalentLMS?
- Is total training time important for reporting?
- Does NACCC want ACH bank transfer?
- Is gamification wanted?
- Does NACCC need invoice PDFs per purchase?
- Is 2FA used by staff or learners?
- PayGo — who manages the sequential payments, automatic or manual?
- What goes in the Files tab on a user profile?
- Ed2go learners moving to courses branch after certification —
  should this be automatic or manual?
- Should ed2go learners see ALL CEU courses or only specific ones?
- Confirm course time limits: Core = 365 days, Ed2go = 185 days, CEU = none?
- Are there other time limit variations beyond these three?
- Who initiates recertification — learner self-serve or admin triggers it?
- Do branches have their own payment processors or all use same Stripe?
- What is the Certificate Check report — what does it show and who uses it?
- Is it used instead of the public verification URL?
- Can you show me what the custom report builder looks like in TalentLMS?
- What is the Certificate Check report exactly?
- Can you show the custom report builder in TalentLMS?
- Does Integrity Advocate have an LMS integration API?
- Invoice PDFs — needed per purchase?
- ACH bank transfer — confirmed yes or pending?
- Smart tags — do you use them in notifications?
- Ed2go learners moving to courses branch — automatic or manual?
