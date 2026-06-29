# NACCC LMS — Complete Database Schema

**Version:** 1.0  
**Status:** Draft — Certificates section pending confirmation  
**Last Updated:** May 2026

---

## Important Notes

- Tenant-scoped tables carry `tenant_id`. Top-level and entity tables
  (tenants, branches, users, companies, courses, modules, lessons,
  quizzes, quiz_questions, surveys, survey_questions, enrollments,
  certificates, payments, notifications, etc.) include it directly.
  Pure bridge/junction tables (user_roles, user_branches, course_branches,
  bundle_courses, lesson_course_links, coupon_courses,
  conversation_participants, *_filters) and global reference tables
  (roles) inherit tenant scope via their FK parent. Phase 7 enforces
  isolation with row-level security — required for the CIA branded skin.
- NACCC is `tenant_id = 1` during development
- `created_at` and `updated_at` on all tables are timestamps
- All IDs are auto-incrementing integers unless noted
- `password_hash` never stores plain text passwords
- Certificate tables are drafted but not finalized — pending answers on renewal thresholds and recertification rules

---

## PEOPLE

### tenants

| Column                   | Type      | Notes             |
| ------------------------ | --------- | ----------------- |
| id                       | integer   | Primary key       |
| name                     | varchar   | Organization name |
| logo_url                 | varchar   |                   |
| accent_color             | varchar   | Hex color code    |
| created_at               | timestamp |                   |
| updated_at               | timestamp |                   |
| favicon_url              | varchar   | nullable          |
| default_course_image_url | varchar   | nullable          |

---

### branches

| Column                       | Type      | Notes                                       |
| ---------------------------- | --------- | ------------------------------------------- |
| id                           | integer   | Primary key                                 |
| tenant_id                    | integer   | Foreign key → tenants                       |
| name                         | varchar   |                                             |
| logo_url                     | varchar   | Optional branch-level override              |
| accent_color                 | varchar   | Optional branch-level override              |
| created_at                   | timestamp |                                             |
| updated_at                   | timestamp |                                             |
| title                        | varchar   | nullable — display title separate from name |
| subdomain                    | varchar   | unique — auto-generated from name           |
| language                     | varchar   | Default: en                                 |
| timezone                     | varchar   | nullable                                    |
| internal_announcement        | text      | nullable — shown to logged-in users         |
| external_announcement        | text      | nullable — shown on login page              |
| internal_announcement_active | boolean   | Default false                               |
| external_announcement_active | boolean   | Default false                               |
| default_group_id             | integer   | nullable — FK to groups (groups table not yet designed — see note) |
| sign_up_method               | varchar   | Default: direct                             |
| domain_restriction           | varchar   | nullable — restrict to email domain         |
| registration_cap             | integer   | nullable                                    |
| disallow_main_domain_login   | boolean   | Default false                               |
| terms_of_service             | text      | nullable                                    |
| default_course_image_url     | varchar   | nullable                                    |
| default_user_type_id         | integer   | nullable — FK to user_types                 |

NOTE: `groups` is a Nice-to-Have (Phase 3/6) that may not ship.
`branches.default_group_id` and `automation_filters.filter_type = group`
reference a `groups` table that is NOT yet designed and is NOT in the
table count. Like `enrollment_groups`, keep these columns nullable and
do not query/join them until the table is formally designed.

---

### roles

| Column | Type    | Notes                                                     |
| ------ | ------- | --------------------------------------------------------- |
| id     | integer | Primary key                                               |
| name   | varchar | learner, instructor, branch_manager, branch_viewer, admin |

---

### users

| Column                | Type      | Notes                                                                                                        |
| --------------------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| id                    | integer   | Primary key                                                                                                  |
| tenant_id             | integer   | Foreign key → tenants                                                                                        |
| company_id            | integer   | Foreign key → companies (nullable)                                                                           |
| active_role_id        | integer   | Foreign key → roles — currently active role                                                                  |
| first_name            | varchar   |                                                                                                              |
| last_name             | varchar   |                                                                                                              |
| email                 | varchar   | Unique per tenant                                                                                            |
| username              | varchar   | Unique per tenant                                                                                            |
| password_hash         | varchar   | Never plain text — nullable for SSO-only accounts                                                            |
| bio                   | text      | nullable                                                                                                     |
| timezone              | varchar   | e.g. America/New_York                                                                                        |
| language              | varchar   | Default: en                                                                                                  |
| is_active             | boolean   | Derived from enrollment status — true if any active enrollments exist, false if none. Updated automatically. |
| failed_login_attempts | integer   | Default: 0                                                                                                   |
| locked_until          | timestamp | nullable — set on too many failed attempts                                                                   |
| last_login_at         | timestamp | nullable                                                                                                     |
| created_at            | timestamp |                                                                                                              |
| updated_at            | timestamp |                                                                                                              |
| user_type_id          | integer   | Foreign key → user_types                                                                                     |
| profile_photo_url     | varchar   | nullable                                                                                                     |
| totp_secret           | varchar   | nullable — TOTP secret for 2FA (admin/instructor only)                                                       |
| totp_enabled          | boolean   | Default false — 2FA on (admin/instructor only; not required for learners)                                    |
| sso_provider          | varchar   | nullable — google or microsoft when SSO-linked                                                               |
| sso_external_id       | varchar   | nullable — provider's user ID for SSO login                                                                  |

_Branch assignments are managed via the user_branches bridge table —
a user can belong to multiple branches._

---

### user_branches

| Column    | Type    | Notes                  |
| --------- | ------- | ---------------------- |
| id        | integer | Primary key            |
| user_id   | integer | Foreign key → users    |
| branch_id | integer | Foreign key → branches |

---

### user_roles

| Column    | Type    | Notes                                                    |
| --------- | ------- | -------------------------------------------------------- |
| id        | integer | Primary key                                              |
| user_id   | integer | Foreign key → users                                      |
| role_id   | integer | Foreign key → roles                                      |
| is_global | boolean | True = not scoped to one branch (e.g. global instructor) |

---

### user_files

| Column          | Type      | Notes                                     |
| --------------- | --------- | ----------------------------------------- |
| id              | integer   | Primary key                               |
| tenant_id       | integer   | Foreign key → tenants                     |
| user_id         | integer   | Foreign key → users                       |
| uploaded_by     | integer   | Foreign key → users — admin or instructor |
| file_name       | varchar   |                                           |
| file_url        | varchar   | S3 or external URL                        |
| file_type       | varchar   | extension                                 |
| file_size_bytes | integer   |                                           |
| created_at      | timestamp |                                           |

---

### user_types

| Column       | Type      | Notes                           |
| ------------ | --------- | ------------------------------- |
| id           | integer   | Primary key                     |
| tenant_id    | integer   | Foreign key → tenants           |
| name         | varchar   | e.g. Learner-Type, Trainer-Type |
| can_admin    | boolean   | Default false                   |
| can_instruct | boolean   | Default false                   |
| can_learn    | boolean   | Default true                    |
| is_default   | boolean   | Default false — one per tenant  |
| created_at   | timestamp |                                 |
| updated_at   | timestamp |                                 |
| description  | varchar   | nullable                        |

---

### companies

| Column                | Type      | Notes                                                   |
| --------------------- | --------- | ------------------------------------------------------- |
| id                    | integer   | Primary key                                             |
| tenant_id             | integer   | Foreign key → tenants                                   |
| company_name          | varchar   |                                                         |
| account_number        | varchar   | Matches Salesforce record                               |
| salesforce_account_id | varchar   | Bridge to Salesforce — nullable until integration built |
| contact_person        | varchar   | Official point of contact                               |
| contact_email         | varchar   |                                                         |
| phone                 | varchar   |                                                         |
| address               | varchar   |                                                         |
| city                  | varchar   |                                                         |
| state                 | varchar   |                                                         |
| zip                   | varchar   |                                                         |
| country               | varchar   | Default: US                                             |
| created_at            | timestamp |                                                         |
| updated_at            | timestamp |                                                         |

NOTE (POSSIBILITY — not yet committed): Company records are
intended to be created ONLY by Salesforce sync or NACCC staff —
never by the registration path. `account_number` /
`salesforce_account_id` are the silent Salesforce matching key
(never user-typed). Enforce a DB unique constraint on
`account_number` (and `salesforce_account_id`) so neither sync
nor staff can double-insert. See the invite-token registration
NOTE in CLAUDE.md. Phase 5/7 build; confirm with Heather.

---

## CONTENT

### courses

| Column                  | Type      | Notes                                                                                |
| ----------------------- | --------- | ------------------------------------------------------------------------------------ |
| id                      | integer   | Primary key                                                                          |
| tenant_id               | integer   | Foreign key → tenants                                                                |
| title                   | varchar   |                                                                                      |
| code                    | varchar   | nullable — optional course code/SKU, system-assigned (NACCC does not label manually) |
| description             | text      |                                                                                      |
| thumbnail_url           | varchar   | nullable                                                                             |
| price                   | decimal   | 0.00 for free courses                                                                |
| is_published            | boolean   | Draft vs live                                                                        |
| is_mandatory            | boolean   |                                                                                      |
| issues_certificate      | boolean   |                                                                                      |
| version                 | integer   | Default: 1 — increments on update                                                    |
| created_by              | integer   | Foreign key → users                                                                  |
| created_at              | timestamp |                                                                                      |
| updated_at              | timestamp |                                                                                      |
| unit_ordering           | varchar   | sequential or free                                                                   |
| score_calculation       | varchar   | all_tests_assignments, tests_only, assignments_only                                  |
| timeframe_start         | timestamp | nullable                                                                             |
| timeframe_end           | timestamp | nullable                                                                             |
| completion_rule         | varchar   | all_units, specific_test_passed                                                      |
| completion_test_id      | integer   | Foreign key → lessons (nullable — only when completion_rule = specific_test_passed)  |
| content_locked          | boolean   | Default false                                                                        |
| intro_video_url         | varchar   | nullable                                                                             |
| intro_video_type        | varchar   | youtube or custom (nullable)                                                         |
| default_time_limit_days | integer   | nullable — 365 for regular, 185 for ed2go, null for CEU, Overridable per enrollment. |
| has_access_retention    | boolean   | Default false                                                                        |
| category_id             | integer   | Foreign key → categories (nullable)                                                  |
| show_summary_on_enter   | boolean   | Default true                                                                         |
| allow_linkedin_share    | boolean   | Default false                                                                        |
| is_paygo                | boolean   | Default false                                                                        |
| paygo_parent_course_id  | integer   | nullable — FK to courses (the full course)                                           |
| paygo_part_number       | integer   | nullable — which part this is (1, 2, 3, 4)                                           |
| paygo_total_parts       | integer   | nullable — how many parts total                                                      |
| course_type             | varchar   | core or ceu                                                                          |
| is_ceu                  | boolean   | Default false — earns CEU credit hours                                               |
| ceu_credit_hours        | decimal   | nullable — hours earned on completion                                                |
| certificate_type        | varchar   | ceu or core — determines which template and expiry behavior                          |
| is_active               | boolean   | Default true                                                                         |

---

### course_branches

| Column    | Type    | Notes                  |
| --------- | ------- | ---------------------- |
| id        | integer | Primary key            |
| course_id | integer | Foreign key → courses  |
| branch_id | integer | Foreign key → branches |

_One row per course/branch assignment. A course with no rows here is main domain only._

---

### course_files

| Column          | Type      | Notes                 |
| --------------- | --------- | --------------------- |
| id              | integer   | Primary key           |
| tenant_id       | integer   | Foreign key → tenants |
| course_id       | integer   | Foreign key → courses |
| uploaded_by     | integer   | Foreign key → users   |
| file_name       | varchar   |                       |
| file_url        | varchar   | S3 or external URL    |
| file_type       | varchar   | extension             |
| file_size_bytes | integer   |                       |
| created_at      | timestamp |                       |

---

### modules

| Column     | Type      | Notes                       |
| ---------- | --------- | --------------------------- |
| id         | integer   | Primary key                 |
| tenant_id  | integer   | Foreign key → tenants       |
| course_id  | integer   | Foreign key → courses       |
| title      | varchar   |                             |
| order      | integer   | Display order within course |
| created_at | timestamp |                             |
| updated_at | timestamp |                             |

---

### lessons

| Column                  | Type      | Notes                                                                                                       |
| ----------------------- | --------- | ----------------------------------------------------------------------------------------------------------- |
| id                      | integer   | Primary key                                                                                                 |
| tenant_id               | integer   | Foreign key → tenants                                                                                       |
| module_id               | integer   | Foreign key → modules                                                                                       |
| title                   | varchar   |                                                                                                             |
| type                    | varchar   | content_page, web_content, video, audio, presentation_document, iframe, test, survey, assignment, ilt, scorm |
| content_url             | varchar   | nullable                                                                                                    |
| order                   | integer   | Display order within module                                                                                 |
| duration_minutes        | integer   | nullable                                                                                                    |
| is_previewable          | boolean   | Viewable before enrollment                                                                                  |
| is_mandatory            | boolean   |                                                                                                             |
| created_at              | timestamp |                                                                                                             |
| updated_at              | timestamp |                                                                                                             |
| completion_method       | varchar   | button, time, question — Default: question (NACCC primary; a lesson with a question requires answering it to complete, a lesson without one completes via the Next button) |
| completion_time_seconds | integer   | nullable — only when completion_method = time                                                               |
| completion_question     | text      | nullable — only when completion_method = question                                                           |
| delay_hours             | integer   | nullable — hours before lesson becomes accessible                                                           |
| delay_days              | integer   | nullable — days before lesson becomes accessible                                                            |
| content_body            | text      | nullable — rich text for content_page lessons                                                               |
| is_shared               | boolean   | Default false — linked across multiple courses                                                              |
| password                | varchar   | nullable — for password protected tests                                                                     |

_Lessons can be shared across multiple courses via lesson_course_links.
A lesson editing updates content everywhere it is linked._

---

### lesson_course_links

| Column     | Type      | Notes                                                                       |
| ---------- | --------- | --------------------------------------------------------------------------- |
| id         | integer   | Primary key                                                                 |
| lesson_id  | integer   | Foreign key → lessons                                                       |
| course_id  | integer   | Foreign key → courses                                                       |
| module_id  | integer   | Foreign key → modules — which module this lesson appears in for this course |
| order      | integer   | Display order within the module for this specific course                    |
| created_at | timestamp |                                                                             |

---

### bundles

| Column        | Type      | Notes                 |
| ------------- | --------- | --------------------- |
| id            | integer   | Primary key           |
| tenant_id     | integer   | Foreign key → tenants |
| name          | varchar   |                       |
| description   | text      |                       |
| price         | decimal   | Bundle price          |
| thumbnail_url | varchar   | nullable              |
| is_active     | boolean   |                       |
| created_by    | integer   | Foreign key → users   |
| created_at    | timestamp |                       |
| updated_at    | timestamp |                       |

---

### bundle_courses

| Column     | Type      | Notes                 |
| ---------- | --------- | --------------------- |
| id         | integer   | Primary key           |
| bundle_id  | integer   | Foreign key → bundles |
| course_id  | integer   | Foreign key → courses |
| created_at | timestamp |                       |

---

### categories

| Column     | Type      | Notes                                                           |
| ---------- | --------- | --------------------------------------------------------------- |
| id         | integer   | Primary key                                                     |
| tenant_id  | integer   | Foreign key → tenants                                           |
| name       | varchar   |                                                                 |
| parent_id  | integer   | nullable — FK to categories (self-referential for parent/child) |
| price      | decimal   | nullable — category-level default pricing                       |
| created_at | timestamp |                                                                 |
| updated_at | timestamp |                                                                 |

_Fully configurable per tenant. NACCC current categories:
Advanced Designations, Certification Program, ed2go/Cengage,
Home At Last, World Services for the Blind, Continuing Education,
Video Library, Core Certifications, PayGo, Exams, Inactive, Previews._

---

### course_prerequisites

| Column                 | Type      | Notes                                                                                                       |
| ---------------------- | --------- | ----------------------------------------------------------------------------------------------------------- |
| id                     | integer   | Primary key                                                                                                 |
| tenant_id              | integer   | Foreign key → tenants                                                                                        |
| course_id              | integer   | Foreign key → courses — the gated course                                                                     |
| prerequisite_course_id | integer   | Foreign key → courses — must be completed first                                                              |
| path_group             | integer   | nullable — prereqs sharing a path_group are alternatives (OR); separate groups are all required (AND)        |
| is_hard_gate           | boolean   | Default true — hard gate blocks enrollment/start until satisfied                                             |
| created_at             | timestamp |                                                                                                             |

_Drives hard-gate prerequisites and alternative paths. Primary NACCC use
case: CEU courses are gated behind core certification — a learner can only
earn/use CEUs AFTER they are certified. (A future enhancement may gate on
holding an active certificate rather than course completion — confirm with Heather.)_

---

## ASSESSMENTS

### quizzes

| Column                        | Type      | Notes                                            |
| ----------------------------- | --------- | ------------------------------------------------ |
| id                            | integer   | Primary key                                      |
| lesson_id                     | integer   | Foreign key → lessons                            |
| course_id                     | integer   | Foreign key → courses                            |
| tenant_id                     | integer   | Foreign key → tenants                            |
| title                         | varchar   |                                                  |
| type                          | varchar   | test                                             |
| passing_score                 | integer   | Minimum % to pass                                |
| max_attempts                  | integer   | nullable = unlimited                             |
| created_at                    | timestamp |                                                  |
| updated_at                    | timestamp |                                                  |
| description                   | text      | nullable — shown to learner before starting test |
| is_practice                   | boolean   | Default false — practice mode, no timer enforced |
| shuffle_questions             | boolean   | Default false                                    |
| shuffle_answers               | boolean   | Default false                                    |
| allow_repetitions             | varchar   | always, never, if_not_passed                     |
| show_correct_answers          | varchar   | always, never, when_passed                       |
| show_given_answers            | boolean   | Default true                                     |
| show_correct_incorrect_labels | boolean   | Default true                                     |
| show_score                    | boolean   | Default true                                     |
| show_stats_after_completion   | boolean   | Default false                                    |
| hide_correct_questions        | boolean   | Default false                                    |
| show_feedback                 | varchar   | always, never, when_passed                       |
| allow_navigation              | boolean   | Default false                                    |
| check_before_continue         | boolean   | Default false                                    |
| abandon_if_cannot_pass        | boolean   | Default false                                    |
| require_snapshot              | boolean   | Default false                                    |
| require_password              | boolean   | Default false                                    |
| password                      | varchar   | nullable                                         |
| message_if_passed             | text      | nullable                                         |
| message_if_not_passed         | text      | nullable                                         |

---

### quiz_questions

| Column        | Type      | Notes                                                                            |
| ------------- | --------- | -------------------------------------------------------------------------------- |
| id            | integer   | Primary key                                                                      |
| quiz_id       | integer   | Foreign key → quizzes                                                            |
| tenant_id     | integer   | Foreign key → tenants                                                            |
| question_text | text      |                                                                                  |
| question_type | varchar   | multiple_choice, fill_the_gaps, ordering, match_the_pairs, free_text, randomized |
| points        | integer   |                                                                                  |
| order         | integer   |                                                                                  |
| created_at    | timestamp |                                                                                  |
| is_deleted    | boolean   | Default false — soft delete, removed from test but kept in DB                    |
| weight        | decimal   | Default 1 — affects score calculation                                            |
| feedback      | text      | nullable — shown to learner after answering                                      |
| tags          | varchar   | nullable — comma separated tags                                                  |

---

### quiz_answers

| Column      | Type    | Notes                        |
| ----------- | ------- | ---------------------------- |
| id          | integer | Primary key                  |
| question_id | integer | Foreign key → quiz_questions |
| answer_text | text    |                              |
| is_correct  | boolean |                              |
| order       | integer |                              |

---

### quiz_attempts

| Column             | Type      | Notes                 |
| ------------------ | --------- | --------------------- |
| id                 | integer   | Primary key           |
| quiz_id            | integer   | Foreign key → quizzes |
| user_id            | integer   | Foreign key → users   |
| tenant_id          | integer   | Foreign key → tenants |
| attempt_number     | integer   |                       |
| score              | decimal   | Percentage score      |
| passed             | boolean   |                       |
| started_at         | timestamp |                       |
| submitted_at       | timestamp | nullable              |
| time_spent_seconds | integer   |                       |

---

### quiz_attempt_answers

| Column        | Type    | Notes                                                  |
| ------------- | ------- | ------------------------------------------------------ |
| id            | integer | Primary key                                            |
| attempt_id    | integer | Foreign key → quiz_attempts                            |
| question_id   | integer | Foreign key → quiz_questions                           |
| answer_id     | integer | Foreign key → quiz_answers (nullable for short answer) |
| text_response | text    | nullable — for short answer questions                  |
| is_correct    | boolean |                                                        |
| points_earned | integer |                                                        |

---

### assignments

| Column             | Type      | Notes                 |
| ------------------ | --------- | --------------------- |
| id                 | integer   | Primary key           |
| lesson_id          | integer   | Foreign key → lessons |
| course_id          | integer   | Foreign key → courses |
| tenant_id          | integer   | Foreign key → tenants |
| title              | varchar   |                       |
| instructions       | text      |                       |
| max_score          | integer   |                       |
| passing_score      | integer   |                       |
| created_at         | timestamp |                       |
| updated_at         | timestamp |                       |
| due_date           | timestamp | nullable              |
| end_time           | timestamp | nullable              |
| duration_minutes   | integer   | nullable              |
| allow_text_reply   | boolean   | Default true          |
| allow_file_upload  | boolean   | Default true          |
| allow_video_reply  | boolean   | Default true          |
| allow_audio_reply  | boolean   | Default true          |
| allow_screen_reply | boolean   | Default true          |
| allowed_file_types | varchar   | e.g. pdf,doc,docx     |
| max_file_size_mb   | integer   |

---

### assignment_submissions

| Column               | Type      | Notes                                  |
| -------------------- | --------- | -------------------------------------- |
| id                   | integer   | Primary key                            |
| assignment_id        | integer   | Foreign key → assignments              |
| user_id              | integer   | Foreign key → users                    |
| tenant_id            | integer   | Foreign key → tenants                  |
| attempt_number       | integer   |                                        |
| file_url             | varchar   | nullable — for file uploads            |
| text_response        | text      | nullable — for typed responses         |
| status               | varchar   | submitted, graded, returned            |
| score                | integer   | nullable until graded                  |
| comments             | text      | Instructor written feedback            |
| submitted_at         | timestamp |                                        |
| graded_at            | timestamp | nullable                               |
| graded_by            | integer   | Foreign key → users (instructor)       |
| video_url            | varchar   | nullable — recorded video submission   |
| audio_url            | varchar   | nullable — recorded audio submission   |
| screen_recording_url | varchar   | nullable — screen recording submission |

---

### surveys

| Column      | Type      | Notes                 |
| ----------- | --------- | --------------------- |
| id          | integer   | Primary key           |
| lesson_id   | integer   | Foreign key → lessons |
| course_id   | integer   | Foreign key → courses |
| tenant_id   | integer   | Foreign key → tenants |
| title       | varchar   |                       |
| description | text      | nullable              |
| created_at  | timestamp |                       |
| updated_at  | timestamp |                       |

---

### survey_questions

| Column        | Type      | Notes                                    |
| ------------- | --------- | ---------------------------------------- |
| id            | integer   | Primary key                              |
| survey_id     | integer   | Foreign key → surveys                    |
| tenant_id     | integer   | Foreign key → tenants                    |
| question_text | text      |                                          |
| question_type | varchar   | multiple_choice, free_text, likert_scale |
| order         | integer   |                                          |
| created_at    | timestamp |                                          |

---

### survey_answers

| Column      | Type    | Notes                          |
| ----------- | ------- | ------------------------------ |
| id          | integer | Primary key                    |
| question_id | integer | Foreign key → survey_questions |
| answer_text | varchar | For multiple choice options    |
| order       | integer |                                |

---

### survey_responses

| Column        | Type      | Notes                                                         |
| ------------- | --------- | ------------------------------------------------------------- |
| id            | integer   | Primary key                                                   |
| survey_id     | integer   | Foreign key → surveys                                         |
| user_id       | integer   | Foreign key → users                                           |
| tenant_id     | integer   | Foreign key → tenants                                         |
| question_id   | integer   | Foreign key → survey_questions                                |
| answer_id     | integer   | Foreign key → survey_answers (nullable — for multiple choice) |
| response_text | text      | nullable — for free text and likert responses                 |
| created_at    | timestamp |                                                               |

---

### exam_bookings

| Column                  | Type      | Notes                                                                                  |
| ----------------------- | --------- | -------------------------------------------------------------------------------------- |
| id                      | integer   | Primary key                                                                            |
| tenant_id               | integer   | Foreign key → tenants                                                                   |
| user_id                 | integer   | Foreign key → users — the examinee                                                     |
| course_id               | integer   | Foreign key → courses                                                                  |
| lesson_id               | integer   | nullable — Foreign key → lessons (the proctored exam unit)                              |
| scheduled_at            | timestamp | nullable — chosen exam time slot                                                       |
| proctor_type            | varchar   | internal (NACCC proctor) or external (learner-supplied)                                |
| proctor_user_id         | integer   | nullable — Foreign key → users, assigned NACCC proctor (internal only)                  |
| external_proctor_name   | varchar   | nullable — for external proctor                                                        |
| external_proctor_email  | varchar   | nullable                                                                               |
| external_proctor_status | varchar   | nullable — pending, approved, rejected (NACCC must approve external proctors)           |
| approved_by             | integer   | nullable — Foreign key → users (admin/instructor who approved the external proctor)     |
| zoom_url                | varchar   | nullable — auto-generated for INTERNAL proctor only; external proctors get no link      |
| proctor_vendor          | varchar   | nullable — proctoring vendor reference (vendor TBD; currently manual/NACCC staff)        |
| status                  | varchar   | requested, scheduled, completed, cancelled                                             |
| created_at              | timestamp |                                                                                        |
| updated_at              | timestamp |                                                                                        |

_Vendor-agnostic foundation for native exam scheduling (replaces Formstack +
Calendly). Internal proctor → NACCC scheduling + auto Zoom link. External
proctor → learner supplies proctor details, NACCC must approve, and NO
scheduling/Zoom link is issued to them. Feeds the learner calendar and the
exam_scheduled notification. Proctoring vendor (Integrity Advocate under
evaluation) plugs in later via proctor_vendor — must be API-compatible from day one._

---

## PROGRESS & ENROLLMENT

### enrollments

| Column          | Type      | Notes                                                            |
| --------------- | --------- | ---------------------------------------------------------------- |
| id              | integer   | Primary key                                                      |
| tenant_id       | integer   | Foreign key → tenants                                            |
| user_id         | integer   | Foreign key → users                                              |
| course_id       | integer   | Foreign key → courses                                            |
| branch_id       | integer   | Foreign key → branches                                           |
| enrolled_by     | integer   | Foreign key → users — who did the enrolling                      |
| enrollment_date | timestamp |                                                                  |
| expiration_date | timestamp | nullable                                                         |
| status          | varchar   | enrolled, suspended, in_progress, completed, expired, not_passed |
| payment_id      | integer   | Foreign key → payments (nullable — free courses)                 |
| group_id        | integer   | Foreign key → enrollment_groups (nullable — future)              |
| created_at      | timestamp |                                                                  |
| updated_at      | timestamp |                                                                  |

enrollment_groups: TO BE DESIGNED IN PHASE 3

- Will store group enrollment batches
- enrollments.group_id will foreign key to this table
- Until then group_id must remain nullable and unqueried

---

### lesson_progress

| Column             | Type      | Notes                                       |
| ------------------ | --------- | ------------------------------------------- |
| id                 | integer   | Primary key                                 |
| user_id            | integer   | Foreign key → users                         |
| lesson_id          | integer   | Foreign key → lessons                       |
| course_id          | integer   | Foreign key → courses                       |
| tenant_id          | integer   | Foreign key → tenants                       |
| status             | varchar   | not_started, in_progress, completed, failed |
| time_spent_seconds | integer   |                                             |
| last_accessed_at   | timestamp | nullable                                    |
| completed_at       | timestamp | nullable                                    |

---

### course_progress

| Column                | Type      | Notes                                       |
| --------------------- | --------- | ------------------------------------------- |
| id                    | integer   | Primary key                                 |
| user_id               | integer   | Foreign key → users                         |
| course_id             | integer   | Foreign key → courses                       |
| tenant_id             | integer   | Foreign key → tenants                       |
| branch_id             | integer   | Foreign key → branches                      |
| completion_percentage | decimal   | 0.00 to 100.00                              |
| status                | varchar   | not_started, in_progress, completed, failed |
| started_at            | timestamp | nullable                                    |
| completed_at          | timestamp | nullable                                    |
| last_accessed_at      | timestamp | nullable                                    |
| time_spent_seconds    | integer   | Default 0 — cumulative time in course       |

---

### lesson_notes

| Column     | Type      | Notes                                       |
| ---------- | --------- | ------------------------------------------- |
| id         | integer   | Primary key                                 |
| tenant_id  | integer   | Foreign key → tenants                       |
| user_id    | integer   | Foreign key → users — note author (learner) |
| lesson_id  | integer   | Foreign key → lessons                       |
| course_id  | integer   | Foreign key → courses                       |
| body       | text      | Learner's personal note for this lesson     |
| created_at | timestamp |                                             |
| updated_at | timestamp |                                             |

_Personal notes are private to the authoring learner._

---

### course_favorites

| Column     | Type      | Notes                 |
| ---------- | --------- | --------------------- |
| id         | integer   | Primary key           |
| tenant_id  | integer   | Foreign key → tenants |
| user_id    | integer   | Foreign key → users   |
| course_id  | integer   | Foreign key → courses |
| created_at | timestamp |                       |

_One row per learner-favorited course; unique on (user_id, course_id)._

---

### certificates

| Column                | Type      | Notes                                                               |
| --------------------- | --------- | ------------------------------------------------------------------- |
| id                    | integer   | Primary key                                                         |
| tenant_id             | integer   | Foreign key → tenants                                               |
| user_id               | integer   | Foreign key → users                                                 |
| course_id             | integer   | Foreign key → courses                                               |
| certificate_number    | varchar   | Unique — permanent, never changes even after renewal                |
| expires_at            | timestamp | nullable — null for CEU certificates, 2 years for core courses      |
| status                | varchar   | active, expired, revoked — CEU certificates never reach expired     |
| issued_at             | timestamp |                                                                     |
| accumulated_ceu_hours | decimal   | Tracks toward 16 hour renewal threshold — resets to 0 after renewal |
| certificate_type      | varchar   | core or ceu — determines expiration behavior                        |
| template_url          | varchar   |                                                                     |
| pdf_url               | varchar   | Generated PDF location                                              |
| verification_url      | varchar   | Public URL for employer verification                                |
| created_at            | timestamp |                                                                     |
| updated_at            | timestamp |                                                                     |
| renewal_count         | integer   | Default 0                                                           |

---

### ceu_records

| Column         | Type      | Notes                                            |
| -------------- | --------- | ------------------------------------------------ |
| id             | integer   | Primary key                                      |
| tenant_id      | integer   | Foreign key → tenants                            |
| user_id        | integer   | Foreign key → users                              |
| certificate_id | integer   | Foreign key → certificates                       |
| course_id      | integer   | Foreign key → courses — the CEU course completed |
| credit_hours   | decimal   | Hours earned from this course                    |
| earned_at      | timestamp |                                                  |
| created_at     | timestamp |                                                  |

---

### certificate_renewals

| Column               | Type      | Notes                                    |
| -------------------- | --------- | ---------------------------------------- |
| id                   | integer   | Primary key                              |
| certificate_id       | integer   | Foreign key → certificates               |
| user_id              | integer   | Foreign key → users                      |
| previous_expiry      | timestamp |                                          |
| new_expiry           | timestamp |                                          |
| total_ceu_hours_used | decimal   | Hours accumulated for this renewal cycle |
| completed_at         | timestamp |                                          |
| created_at           | timestamp |                                          |
| fee_per_certificate  | decimal   | $100 per certificate                     |
| renewal_batch_id     | integer   | Foreign key → renewal_batches            |

renewal_batch_id — group multiple certificate renewals that happened together

---

### renewal_batches

| Column                     | Type      | Notes                              |
| -------------------------- | --------- | ---------------------------------- |
| id                         | integer   | Primary key                        |
| tenant_id                  | integer   | Foreign key → tenants              |
| user_id                    | integer   | Foreign key → users                |
| payment_id                 | integer   | Foreign key → payments             |
| ceu_hours_used             | decimal   | CEU hours accumulated this cycle (summed from per-course ceu_credit_hours); 16h global threshold triggers eligibility |
| total_fee                  | decimal   | $100 per certificate               |
| renewed_at                 | timestamp |                                    |
| created_at                 | timestamp |                                    |
| certificates_renewed_count | integer   | how many certificates renewed      |

---

### ceu_submissions

| Column          | Type      | Notes                                             |
| --------------- | --------- | ------------------------------------------------- |
| id              | integer   | Primary key                                       |
| tenant_id       | integer   | Foreign key → tenants                             |
| user_id         | integer   | Foreign key → users                               |
| certificate_id  | integer   | Foreign key → certificates                        |
| submission_type | varchar   | seminar, college_credit, course_completion, other |
| credit_hours    | decimal   | Hours claimed by learner                          |
| proof_file_url  | varchar   | Uploaded certificate or document                  |
| status          | varchar   | pending, approved, rejected                       |
| reviewed_by     | integer   | Foreign key → users (admin) nullable              |
| reviewed_at     | timestamp | nullable                                          |
| notes           | text      | Admin notes on approval or rejection nullable     |
| created_at      | timestamp |                                                   |
| updated_at      | timestamp |                                                   |

---

### learning_paths (FUTURE — not built until needed)

| Column        | Type      | Notes                               |
| ------------- | --------- | ----------------------------------- |
| id            | integer   | Primary key                         |
| tenant_id     | integer   | Foreign key → tenants               |
| name          | varchar   |                                     |
| description   | text      | nullable — up to 5000 chars         |
| thumbnail_url | varchar   | nullable                            |
| category_id   | integer   | Foreign key → categories (nullable) |
| code          | varchar   | nullable                            |
| is_active     | boolean   | Default false                       |
| created_by    | integer   | Foreign key → users                 |
| created_at    | timestamp |                                     |
| updated_at    | timestamp |                                     |

---

### learning_path_sections (FUTURE)

| Column           | Type    | Notes                        |
| ---------------- | ------- | ---------------------------- |
| id               | integer | Primary key                  |
| learning_path_id | integer | Foreign key → learning_paths |
| name             | varchar |                              |
| order            | integer |                              |

---

### learning_path_courses (FUTURE)

| Column           | Type    | Notes                                |
| ---------------- | ------- | ------------------------------------ |
| id               | integer | Primary key                          |
| learning_path_id | integer | Foreign key → learning_paths         |
| section_id       | integer | Foreign key → learning_path_sections |
| course_id        | integer | Foreign key → courses                |
| order            | integer |                                      |

---

## AUTOMATIONS

### automation_rules

| Column            | Type      | Notes                                                                                                                  |
| ----------------- | --------- | ---------------------------------------------------------------------------------------------------------------------- |
| id                | integer   | Primary key                                                                                                            |
| tenant_id         | integer   | Foreign key → tenants                                                                                                  |
| name              | varchar   |                                                                                                                        |
| trigger_type      | varchar   | See full list below                                                                                                    |
| trigger_hours     | integer   | nullable — for time-based triggers                                                                                     |
| trigger_course_id | integer   | nullable — FK to courses                                                                                               |
| trigger_score_min | integer   | nullable — for score-based triggers                                                                                    |
| trigger_score_max | integer   | nullable — for score-based triggers                                                                                    |
| action_type       | varchar   | assign_course, deactivate_user, delete_user, call_url, give_points, assign_learning_path, remove_course, add_to_branch |
| action_course_id  | integer   | nullable — FK to courses                                                                                               |
| action_url        | varchar   | nullable — for call URL action                                                                                         |
| action_points     | integer   | nullable — for give points action                                                                                      |
| is_active         | boolean   | Default true                                                                                                           |
| created_by        | integer   | Foreign key → users                                                                                                    |
| created_at        | timestamp |                                                                                                                        |
| updated_at        | timestamp |                                                                                                                        |
| action_branch_id  | integer   | nullable — FK to branches, for add_to_branch action                                                                    |

Full trigger_type values for automation_rules:
user_inactive_hours
user_no_purchase_hours  
user_signup_hours
course_assigned_hours
course_completed_hours
course_completed_score_range_hours
course_failed_hours
course_cert_expired_hours
course_expiring_hours
course_cert_expiring_hours
course_completed_deactivate_hours
course_completed
course_completed_score_range
course_cert_expired
level_reached
course_completed_add_to_branch

---

### automation_filters

| Column        | Type    | Notes                               |
| ------------- | ------- | ----------------------------------- |
| id            | integer | Primary key                         |
| automation_id | integer | Foreign key → automation_rules      |
| filter_type   | varchar | branch, user_type, group            |
| filter_id     | integer | nullable — FK to the relevant table |
| filter_value  | varchar | nullable — for non-FK filter values |

---

## PAYMENTS

### coupons

| Column         | Type      | Notes                      |
| -------------- | --------- | -------------------------- |
| id             | integer   | Primary key                |
| tenant_id      | integer   | Foreign key → tenants      |
| code           | varchar   | Unique per tenant          |
| discount_type  | varchar   | percentage or fixed_amount |
| discount_value | decimal   | % or $ depending on type   |
| max_uses       | integer   | nullable = unlimited       |
| current_uses   | integer   | Default: 0                 |
| valid_from     | timestamp | nullable                   |
| valid_until    | timestamp | nullable                   |
| is_active      | boolean   |                            |
| applicable_to  | varchar   | all or specific_courses    |
| created_by     | integer   | Foreign key → users        |
| created_at     | timestamp |                            |
| updated_at     | timestamp |                            |

---

### coupon_courses

| Column     | Type      | Notes                 |
| ---------- | --------- | --------------------- |
| coupon_id  | integer   | Foreign key → coupons |
| course_id  | integer   | Foreign key → courses |
| id         | integer   | Primary key           |
| created_at | timestamp |                       |

_Only populated when coupon applicable_to = specific_courses_

---

### payments

| Column                   | Type      | Notes                                |
| ------------------------ | --------- | ------------------------------------ |
| id                       | integer   | Primary key                          |
| tenant_id                | integer   | Foreign key → tenants                |
| user_id                  | integer   | Foreign key → users                  |
| company_id               | integer   | Foreign key → companies (nullable)   |
| stripe_payment_id        | varchar   | Stripe reference                     |
| stripe_customer_id       | varchar   | Stripe customer reference            |
| coupon_id                | integer   | Foreign key → coupons (nullable)     |
| amount_before_discount   | decimal   |                                      |
| discount_amount          | decimal   | Default: 0.00                        |
| amount_final             | decimal   | What was actually charged            |
| currency                 | varchar   | Default: usd                         |
| status                   | varchar   | pending, completed, failed, refunded |
| payment_type             | varchar   | individual or group                  |
| created_at               | timestamp |                                      |
| updated_at               | timestamp |                                      |
| stripe_payment_intent_id | varchar   | nullable                             |

---

### payment_items

| Column          | Type      | Notes                                        |
| --------------- | --------- | -------------------------------------------- |
| id              | integer   | Primary key                                  |
| payment_id      | integer   | Foreign key → payments                       |
| course_id       | integer   | Foreign key → courses (nullable)             |
| bundle_id       | integer   | Foreign key → bundles (nullable)             |
| quantity        | integer   |                                              |
| unit_price      | decimal   |                                              |
| total_price     | decimal   |                                              |
| created_at      | timestamp |                                              |
| item_type       | varchar   | course, bundle, exam_retake, recertification |
| exam_attempt_id | integer   | nullable — Foreign key → quiz_attempts       |

---

### ecommerce_settings

| Column                       | Type      | Notes                               |
| ---------------------------- | --------- | ----------------------------------- |
| id                           | integer   | Primary key                         |
| tenant_id                    | integer   | Foreign key → tenants               |
| stripe_account_id            | varchar   | nullable — connected Stripe account |
| stripe_publishable_key       | varchar   | nullable                            |
| stripe_secret_key            | varchar   | nullable — encrypted                |
| invoices_enabled             | boolean   | Default false                       |
| invoice_prefix               | varchar   | nullable — e.g. "NACCC-"            |
| coupons_enabled              | boolean   | Default true                        |
| currency                     | varchar   | Default: usd                        |
| created_at                   | timestamp |                                     |
| updated_at                   | timestamp |                                     |
| recertification_fee_per_cert | decimal   | Default 100.00                      |

---

### invoices

| Column         | Type      | Notes                        |
| -------------- | --------- | ---------------------------- |
| id             | integer   | Primary key                  |
| tenant_id      | integer   | Foreign key → tenants        |
| payment_id     | integer   | Foreign key → payments       |
| user_id        | integer   | Foreign key → users          |
| invoice_number | varchar   | unique — auto-generated      |
| amount         | decimal   |                              |
| currency       | varchar   | Default: usd                 |
| status         | varchar   | issued, paid, refunded, void |
| issued_at      | timestamp |                              |
| pdf_url        | varchar   | nullable — generated PDF     |
| created_at     | timestamp |                              |
| updated_at     | timestamp |                              |

---

## COMMUNICATION

### notifications

| Column              | Type      | Notes                                                                                                                                                                                                                         |
| ------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                  | integer   | Primary key                                                                                                                                                                                                                   |
| tenant_id           | integer   | Foreign key → tenants                                                                                                                                                                                                         |
| user_id             | integer   | Foreign key → users                                                                                                                                                                                                           |
| type                | varchar   | deadline_reminder, inactivity, cert_expiring, enrollment, assignment_graded, announcement, course_completed, exam_scheduled, exam_passed, exam_failed, cert_expiring_30, cert_expiring_60, payment_received, retake_available |
| title               | varchar   |                                                                                                                                                                                                                               |
| message             | text      |                                                                                                                                                                                                                               |
| is_read             | boolean   | Default: false                                                                                                                                                                                                                |
| read_at             | timestamp | nullable                                                                                                                                                                                                                      |
| related_entity_type | varchar   | course, certificate, assignment (nullable)                                                                                                                                                                                    |
| related_entity_id   | integer   | nullable                                                                                                                                                                                                                      |
| created_at          | timestamp |                                                                                                                                                                                                                               |
| sent_via            | varchar   | email, in_app, both                                                                                                                                                                                                           |

---

### notification_rules

| Column                 | Type      | Notes                                                                                                                                                                                                |
| ---------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                     | integer   | Primary key                                                                                                                                                                                          |
| tenant_id              | integer   | Foreign key → tenants                                                                                                                                                                                |
| name                   | varchar   |                                                                                                                                                                                                      |
| event_type             | varchar   | user_registration, user_payment, course_assigned, course_completed, course_failed, course_cert_expired, course_expired, exam_passed, exam_failed, cert_expiring_30, cert_expiring_60, exam_scheduled |
| recipient_type         | varchar   | related_user, specific_recipients, admins, account_owner                                                                                                                                             |
| specific_recipient_ids | jsonb     | nullable — array of user IDs when recipient_type = specific_recipients                                                                                                                               |
| message_subject        | varchar   |                                                                                                                                                                                                      |
| message_body           | text      | Rich text with smart tags                                                                                                                                                                            |
| is_active              | boolean   | Default false                                                                                                                                                                                        |
| created_by             | integer   | Foreign key → users                                                                                                                                                                                  |
| created_at             | timestamp |                                                                                                                                                                                                      |
| updated_at             | timestamp |                                                                                                                                                                                                      |

---

### notification_rule_filters

| Column               | Type    | Notes                            |
| -------------------- | ------- | -------------------------------- |
| id                   | integer | Primary key                      |
| notification_rule_id | integer | Foreign key → notification_rules |
| filter_type          | varchar | course, branch, user_type        |
| filter_id            | integer | FK to relevant table             |

---

### notification_log

| Column               | Type      | Notes                                                                |
| -------------------- | --------- | -------------------------------------------------------------------- |
| id                   | integer   | Primary key                                                          |
| tenant_id            | integer   | Foreign key → tenants                                                |
| notification_rule_id | integer   | Foreign key → notification_rules (nullable for system notifications) |
| recipient_id         | integer   | Foreign key → users                                                  |
| subject              | varchar   |                                                                      |
| body                 | text      |                                                                      |
| status               | varchar   | sent, pending, failed                                                |
| sent_at              | timestamp | nullable                                                             |
| created_at           | timestamp |                                                                      |
| error_message        | text      | nullable — populated when status = failed                            |

---

### conversations

| Column     | Type      | Notes                            |
| ---------- | --------- | -------------------------------- |
| id         | integer   | Primary key                      |
| tenant_id  | integer   | Foreign key → tenants            |
| course_id  | integer   | Foreign key → courses (nullable) |
| subject    | varchar   |                                  |
| created_by | integer   | Foreign key → users              |
| created_at | timestamp |                                  |
| updated_at | timestamp |                                  |

---

### conversation_participants

| Column          | Type      | Notes                       |
| --------------- | --------- | --------------------------- |
| id              | integer   | Primary key                 |
| conversation_id | integer   | Foreign key → conversations |
| user_id         | integer   | Foreign key → users         |
| joined_at       | timestamp |                             |

---

### messages

| Column          | Type      | Notes                       |
| --------------- | --------- | --------------------------- |
| id              | integer   | Primary key                 |
| conversation_id | integer   | Foreign key → conversations |
| tenant_id       | integer   | Foreign key → tenants       |
| sender_id       | integer   | Foreign key → users         |
| body            | text      |                             |
| is_read         | boolean   | Default: false              |
| read_at         | timestamp | nullable                    |
| created_at      | timestamp |                             |

---

### notification_preferences

| Column                | Type      | Notes                                                   |
| --------------------- | --------- | ------------------------------------------------------- |
| id                    | integer   | Primary key                                             |
| tenant_id             | integer   | Foreign key → tenants — tenant-controlled, NOT per-user |
| global_footer_enabled | boolean   | Default false — append global footer to all emails      |
| global_footer_text    | text      | nullable — footer body when enabled                     |
| created_at            | timestamp |                                                         |
| updated_at            | timestamp |                                                         |

_Tenant-level email/notification settings. Do NOT add user_id —
preferences are admin-controlled per tenant, not per-user._

---

### email_templates

| Column       | Type      | Notes                                                                                                  |
| ------------ | --------- | ------------------------------------------------------------------------------------------------------ |
| id           | integer   | Primary key                                                                                            |
| tenant_id    | integer   | Foreign key → tenants                                                                                   |
| template_key | varchar   | reset_password, create_password, account_confirmation, account_activation, export_reports, import_data |
| subject      | varchar   |                                                                                                        |
| body         | text      | Rich text with smart tags                                                                              |
| is_system    | boolean   | Default true — fixed platform email vs admin-customized                                                 |
| updated_by   | integer   | Foreign key → users (nullable)                                                                         |
| created_at   | timestamp |                                                                                                        |
| updated_at   | timestamp |                                                                                                        |

_System emails (reset password, create password, confirmation, etc.)
plus the editable templates surfaced on the Email Template management page._

---

## SYSTEM

### audit_logs

| Column      | Type      | Notes                                              |
| ----------- | --------- | -------------------------------------------------- |
| id          | integer   | Primary key                                        |
| tenant_id   | integer   | Foreign key → tenants                              |
| user_id     | integer   | Foreign key → users — who did the action           |
| action      | varchar   | created, updated, deleted, enrolled, revoked, etc. |
| entity_type | varchar   | user, course, certificate, enrollment, etc.        |
| entity_id   | integer   | Which specific record was affected                 |
| old_value   | jsonb     | State before the action                            |
| new_value   | jsonb     | State after the action                             |
| ip_address  | varchar   |                                                    |
| created_at  | timestamp |                                                    |

---

### custom_field_definitions

| Column           | Type      | Notes                                          |
| ---------------- | --------- | ---------------------------------------------- |
| id               | integer   | Primary key                                    |
| tenant_id        | integer   | Foreign key → tenants                          |
| label            | varchar   | Display name e.g. "How did you hear about us?" |
| field_key        | varchar   | Slug e.g. "how_did_you_hear"                   |
| field_type       | varchar   | text, date, number, dropdown                   |
| is_required      | boolean   |                                                |
| dropdown_options | jsonb     | nullable — array of options for dropdowns      |
| order            | integer   | Display order                                  |
| created_at       | timestamp |                                                |
| updated_at       | timestamp |                                                |

---

### custom_field_values

| Column              | Type      | Notes                                  |
| ------------------- | --------- | -------------------------------------- |
| id                  | integer   | Primary key                            |
| tenant_id           | integer   | Foreign key → tenants                  |
| user_id             | integer   | Foreign key → users                    |
| field_definition_id | integer   | Foreign key → custom_field_definitions |
| value               | text      |                                        |
| created_at          | timestamp |                                        |
| updated_at          | timestamp |                                        |

---

### security_settings

| Column                | Type      | Notes                                             |
| --------------------- | --------- | ------------------------------------------------- |
| id                    | integer   | Primary key                                       |
| tenant_id             | integer   | Foreign key → tenants                             |
| password_min_length   | integer   | Default 8                                         |
| require_uppercase     | boolean   | Default true                                      |
| require_number        | boolean   | Default true                                      |
| require_special       | boolean   | Default false                                     |
| max_failed_attempts   | integer   | Default 5 — lock account after this many failures |
| lockout_minutes       | integer   | Default 15 — lock duration                        |
| require_2fa_for_staff | boolean   | Default false — enforce 2FA for admin/instructor  |
| created_at            | timestamp |                                                   |
| updated_at            | timestamp |                                                   |

_Tenant-level configurable password policy and lockout thresholds.
Drives users.failed_login_attempts / locked_until enforcement._

---

## INTEGRATIONS

### salesforce_sync_log

| Column            | Type      | Notes                                                        |
| ----------------- | --------- | ------------------------------------------------------------ |
| id                | integer   | Primary key                                                  |
| tenant_id         | integer   | Foreign key → tenants                                        |
| entity_type       | varchar   | company, user, enrollment, certificate, course — closed list |
| entity_id         | integer   | ID of the record being synced                                |
| salesforce_id     | varchar   | nullable — Salesforce record ID                              |
| sync_status       | varchar   | pending, success, failed                                     |
| error_message     | text      | nullable — populated on failure                              |
| retry_count       | integer   | Default 0 — tracks retry attempts                            |
| last_attempted_at | timestamp | nullable                                                     |
| created_at        | timestamp |                                                              |

---

## Table Summary

| Category              | Tables                                                                                                                                                                       | Count  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| People                | tenants, branches, users, roles, user_roles, user_branches, user_types, companies, user_files                                                                                | 9      |
| Content               | courses, course_branches, course_files, modules, lessons, lesson_course_links, course_prerequisites, bundles, bundle_courses, categories                                     | 10     |
| Assessments           | quizzes, quiz_questions, quiz_answers, quiz_attempts, quiz_attempt_answers, assignments, assignment_submissions, exam_bookings, surveys, survey_questions, survey_answers, survey_responses | 12     |
| Progress & Enrollment | enrollments, lesson_progress, course_progress, lesson_notes, course_favorites, learning_paths, learning_path_sections, learning_path_courses                                 | 8      |
| Certificates          | certificates, ceu_records, ceu_submissions, certificate_renewals, renewal_batches                                                                                            | 5      |
| Automations           | automation_rules, automation_filters                                                                                                                                         | 2      |
| Payments              | coupons, coupon_courses, payments, payment_items, ecommerce_settings, invoices                                                                                               | 6      |
| Communication         | notifications, notification_rules, notification_rule_filters, notification_log, notification_preferences, email_templates, conversations, conversation_participants, messages | 9      |
| System                | audit_logs, custom_field_definitions, custom_field_values, security_settings                                                                                                 | 4      |
| Integrations          | salesforce_sync_log                                                                                                                                                          | 1      |
| **Total**             |                                                                                                                                                                              | **66** |

---

## Open Questions

- [x] CEU certificates never expire
- [x] Core certificates expire after 2 years
- [x] Renewal threshold is global not per course
- [x] Shared lessons confirmed — lesson_course_links bridge table added
- [ ] Which specific courses are CEU courses
- [x] DECIDED: certificate number is PERMANENT — recertification does NOT
      issue a new number. `renewal_count` increments and a `certificate_renewals`
      row is added; `certificate_number` never changes.
- [x] DECIDED: renewal THRESHOLD is global = 16 credit hours. The credit
      hours EARNED vary per course (`courses.ceu_credit_hours`, e.g. 2–8).
      Threshold is not per-course.
- [ ] salesforce_sync_log — add retry_count column
      when building retry logic in Phase 7
- [ ] user_branches replaces branch_id on users table —
      confirm this is correct before Phase 7 backend build
- [ ] Confirm time limits: Core = 365 days, Ed2go = 185 days, CEU = none?
- [ ] Are there other course time limit variations beyond these three?
- [ ] Ed2go — is moving learners to courses branch after certification manual or automated?
- [ ] Should ed2go learners see ALL CEU courses or only specific ones after certification?
- [ ] Recertification — who initiates it, learner self-serve or admin triggers?
- [ ] Do branches have their own payment processors or all use same Stripe account?

### Formstack-surfaced schema items (from Idea Forge 2026-06-29)

See CLAUDE.md "Formstack Replacement" for the full reasoning. Retiring NACCC's
~20 Formstack forms surfaces these data-model needs:

- [ ] **enrollment_groups — pulled ahead of Phase 3.** Group enrollment
      replaces the 7 Formstack enrollment forms, so this table must exist at
      Formstack cutover, not Phase 3. Likely columns: tenant_id, company_id,
      course_id (or a group→courses bridge), created_by, payment_id, status,
      branch_id. Company self-service + mostly-Stripe (invoice/check →
      suspended enrollments). Confirm timing.
- [ ] **Company-scoped role missing.** `roles` has no company-level role and
      `branch_manager` is branch-scoped. Company self-service group enrollment
      needs a "company admin" capability/view. Decide: new role row vs a
      `user_types.can_*` flag vs a company_contacts bridge.
- [ ] **New table `policy_acceptances`** (user_id, policy_key, version,
      accepted_at) — pre-exam ethics attestation. Hard-gates the exam.
      Confirms Idea Forge #17 is a real, in-use requirement.
- [ ] **No exam-slot / proctor-availability model.** Native exam scheduling
      replaces Formstack + Calendly, but `exam_bookings.scheduled_at` has no
      source of bookable slots. Needs `proctor_availability` (proctor_user_id,
      start, end, capacity) or pre-generated `exam_slots`.
- [ ] **Define "exam eligible."** The ethics form read it off the Salesforce
      Order object as an identity workaround (anonymous form); in the LMS the
      learner is authenticated, so it becomes a check on their user_id. Decide
      what SETS eligibility — likely LMS-native (paid order for the exam +
      completed required coursework) — or whether it stays a Salesforce flag
      synced in (Phase 5).
- [ ] **Seat/license pool?** Do companies buy a fixed roster at once or seats
      to assign over time? Determines whether a `seat_pool` / `licenses` table
      is needed alongside enrollment_groups.
