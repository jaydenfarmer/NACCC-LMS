# NACCC LMS — Complete Database Schema

**Version:** 1.0  
**Status:** Draft — Certificates section pending confirmation  
**Last Updated:** May 2026

---

## Important Notes

- All tables include `tenant_id` for multi-tenancy support
- NACCC is `tenant_id = 1` during development
- `created_at` and `updated_at` on all tables are timestamps
- All IDs are auto-incrementing integers unless noted
- `password_hash` never stores plain text passwords
- Certificate tables are drafted but not finalized — pending answers on renewal thresholds and recertification rules

---

## PEOPLE

### tenants

| Column       | Type      | Notes             |
| ------------ | --------- | ----------------- |
| id           | integer   | Primary key       |
| name         | varchar   | Organization name |
| logo_url     | varchar   |                   |
| accent_color | varchar   | Hex color code    |
| created_at   | timestamp |                   |
| updated_at   | timestamp |                   |

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
| default_user_type            | varchar   | nullable                                    |
| default_group_id             | integer   | nullable — FK to groups                     |
| sign_up_method               | varchar   | Default: direct                             |
| domain_restriction           | varchar   | nullable — restrict to email domain         |
| registration_cap             | integer   | nullable                                    |
| disallow_main_domain_login   | boolean   | Default false                               |
| terms_of_service             | text      | nullable                                    |
| default_course_image_url     | varchar   | nullable                                    |
| payment_processor            | varchar   | nullable                                    |

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
| password_hash         | varchar   | Never plain text                                                                                             |
| bio                   | text      | nullable                                                                                                     |
| timezone              | varchar   | e.g. America/New_York                                                                                        |
| language              | varchar   | Default: en                                                                                                  |
| is_active             | boolean   | Derived from enrollment status — true if any active enrollments exist, false if none. Updated automatically. |
| failed_login_attempts | integer   | Default: 0                                                                                                   |
| locked_until          | timestamp | nullable — set on too many failed attempts                                                                   |
| last_login_at         | timestamp | nullable                                                                                                     |
| created_at            | timestamp |                                                                                                              |
| updated_at            | timestamp |                                                                                                              |
| deactivate_at         | timestamp | nullable — scheduled deactivation date                                                                       |
| user_type_id          | integer   | Foreign key → user_types                                                                                     |

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

salesforce_sync_log: id, tenant_id, entity_type (company, user, enrollment),
entity_id, salesforce_id,
sync_status (pending, success, failed),
error_message, last_attempted_at,
created_at

---

## CONTENT

### courses

| Column                       | Type      | Notes                                                                               |
| ---------------------------- | --------- | ----------------------------------------------------------------------------------- |
| id                           | integer   | Primary key                                                                         |
| tenant_id                    | integer   | Foreign key → tenants                                                               |
| title                        | varchar   |                                                                                     |
| description                  | text      |                                                                                     |
| thumbnail_url                | varchar   | nullable                                                                            |
| price                        | decimal   | 0.00 for free courses                                                               |
| is_published                 | boolean   | Draft vs live                                                                       |
| is_mandatory                 | boolean   |                                                                                     |
| issues_certificate           | boolean   |                                                                                     |
| ceu_credit_hours             | decimal   | nullable — only for CEU courses                                                     |
| required_ceu_hours           | decimal   | nullable — hours needed to trigger renewal                                          |
| passing_score                | integer   | Minimum % to complete                                                               |
| version                      | integer   | Default: 1 — increments on update                                                   |
| created_by                   | integer   | Foreign key → users                                                                 |
| created_at                   | timestamp |                                                                                     |
| updated_at                   | timestamp |                                                                                     |
| capacity                     | integer   | nullable — max self-enrollments                                                     |
| has_access_retention         | boolean   | Default false                                                                       |
| requires_enrollment_approval | boolean   | Default false                                                                       |
| unit_ordering                | varchar   | sequential or free                                                                  |
| score_calculation            | varchar   | all_tests_assignments, tests_only, assignments_only                                 |
| time_limit_days              | integer   | nullable                                                                            |
| timeframe_start              | timestamp | nullable                                                                            |
| timeframe_end                | timestamp | nullable                                                                            |
| completion_rule              | varchar   | all_units, specific_test_passed                                                     |
| completion_test_id           | integer   | Foreign key → lessons (nullable — only when completion_rule = specific_test_passed) |
| content_locked               | boolean   | Default false                                                                       |
| intro_video_url              | varchar   | nullable                                                                            |
| intro_video_type             | varchar   | youtube or custom (nullable)                                                        |
| time_limit_days              | integer   | nullable — NACCC uses 185 for CEU                                                   |
| has_access_retention         | boolean   | Default false                                                                       |
| category_id                  | integer   | Foreign key → categories (nullable)                                                 |
| show_summary_on_enter        | boolean   | Default true                                                                        |
| allow_linkedin_share         | boolean   | Default false                                                                       |

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
| module_id               | integer   | Foreign key → modules                                                                                       |
| title                   | varchar   |                                                                                                             |
| type                    | varchar   | content_page, web_content, video, audio, presentation_document, iframe, test, survey, assignment ilt, scorm |
| content_url             | varchar   | nullable                                                                                                    |
| order                   | integer   | Display order within module                                                                                 |
| duration_minutes        | integer   | nullable                                                                                                    |
| is_previewable          | boolean   | Viewable before enrollment                                                                                  |
| is_mandatory            | boolean   |                                                                                                             |
| created_at              | timestamp |                                                                                                             |
| updated_at              | timestamp |                                                                                                             |
| completion_method       | varchar   | button, time, question — Default: button                                                                    |
| completion_time_seconds | integer   | nullable — only when completion_method = time                                                               |
| completion_question     | text      | nullable — only when completion_method = question                                                           |
| delay_hours             | integer   | nullable — hours before lesson becomes accessible                                                           |
| delay_days              | integer   | nullable — days before lesson becomes accessible                                                            |
| completion_method       | varchar   | question (NACCC primary), button, time — Default: question                                                  |

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
| type                          | varchar   | quiz or exam                                     |
| passing_score                 | integer   | Minimum % to pass                                |
| max_attempts                  | integer   | nullable = unlimited                             |
| time_limit_minutes            | integer   | nullable = no limit                              |
| shuffle_questions             | boolean   |                                                  |
| created_at                    | timestamp |                                                  |
| updated_at                    | timestamp |                                                  |
| description                   | text      | nullable — shown to learner before starting test |
| is_practice                   | boolean   | Default false — practice mode, no timer enforced |
| pass_score                    | integer   | Default 50 (percentage)                          |
| shuffle_questions             | boolean   | Default false                                    |
| shuffle_answers               | boolean   | Default false                                    |
| allow_repetitions             | varchar   | always, never, if_not_passed                     |
| max_attempts                  | integer   | nullable — null = unlimited                      |
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
| question_text | text      |                                                                                  |
| question_type | varchar   | multiple_choice, fill_the_gaps, ordering, match_the_pairs, free_text, randomized |
| points        | integer   |                                                                                  |
| order         | integer   |                                                                                  |
| created_at    | timestamp |                                                                                  |
| is_deleted    | boolean   | Default false — soft delete, removed from test but kept in DB                    |
| weight        | decimal   | Default 1 — affects score calculation                                            |

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
| due_date           | timestamp | nullable              |
| max_score          | integer   |                       |
| passing_score      | integer   |                       |
| allowed_file_types | varchar   | e.g. pdf,doc,docx     |
| max_file_size_mb   | integer   |                       |
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

---

### assignment_submissions

| Column         | Type      | Notes                            |
| -------------- | --------- | -------------------------------- |
| id             | integer   | Primary key                      |
| assignment_id  | integer   | Foreign key → assignments        |
| user_id        | integer   | Foreign key → users              |
| tenant_id      | integer   | Foreign key → tenants            |
| attempt_number | integer   |                                  |
| file_url       | varchar   | nullable — for file uploads      |
| text_response  | text      | nullable — for typed responses   |
| status         | varchar   | submitted, graded, returned      |
| score          | integer   | nullable until graded            |
| feedback       | text      | Instructor written feedback      |
| submitted_at   | timestamp |                                  |
| graded_at      | timestamp | nullable                         |
| graded_by      | integer   | Foreign key → users (instructor) |

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
| due_date        | timestamp | nullable                                                         |
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

| Column             | Type      | Notes                               |
| ------------------ | --------- | ----------------------------------- |
| id                 | integer   | Primary key                         |
| user_id            | integer   | Foreign key → users                 |
| lesson_id          | integer   | Foreign key → lessons               |
| course_id          | integer   | Foreign key → courses               |
| tenant_id          | integer   | Foreign key → tenants               |
| status             | varchar   | not_started, in_progress, completed |
| time_spent_seconds | integer   |                                     |
| last_accessed_at   | timestamp | nullable                            |
| completed_at       | timestamp | nullable                            |

---

### course_progress

| Column                | Type      | Notes                                 |
| --------------------- | --------- | ------------------------------------- |
| id                    | integer   | Primary key                           |
| user_id               | integer   | Foreign key → users                   |
| course_id             | integer   | Foreign key → courses                 |
| tenant_id             | integer   | Foreign key → tenants                 |
| branch_id             | integer   | Foreign key → branches                |
| completion_percentage | decimal   | 0.00 to 100.00                        |
| status                | varchar   | not_started, in_progress, completed   |
| started_at            | timestamp | nullable                              |
| completed_at          | timestamp | nullable                              |
| last_accessed_at      | timestamp | nullable                              |
| time_spent_seconds    | integer   | Default 0 — cumulative time in course |

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
| certificate_duration  | varchar   | forever or years — CEU = forever, core = 2 years                    |

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

| Column            | Type      | Notes                                                                                                   |
| ----------------- | --------- | ------------------------------------------------------------------------------------------------------- |
| id                | integer   | Primary key                                                                                             |
| tenant_id         | integer   | Foreign key → tenants                                                                                   |
| name              | varchar   |                                                                                                         |
| trigger_type      | varchar   | See full list below                                                                                     |
| trigger_hours     | integer   | nullable — for time-based triggers                                                                      |
| trigger_course_id | integer   | nullable — FK to courses                                                                                |
| trigger_score_min | integer   | nullable — for score-based triggers                                                                     |
| trigger_score_max | integer   | nullable — for score-based triggers                                                                     |
| action_type       | varchar   | assign_course, deactivate_user, delete_user, call_url, give_points, assign_learning_path, remove_course |
| action_course_id  | integer   | nullable — FK to courses                                                                                |
| action_url        | varchar   | nullable — for call URL action                                                                          |
| action_points     | integer   | nullable — for give points action                                                                       |
| is_active         | boolean   | Default true                                                                                            |
| created_by        | integer   | Foreign key → users                                                                                     |
| created_at        | timestamp |                                                                                                         |
| updated_at        | timestamp |                                                                                                         |

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

---

### automation_filters

| Column        | Type    | Notes                          |
| ------------- | ------- | ------------------------------ |
| id            | integer | Primary key                    |
| automation_id | integer | Foreign key → automation_rules |
| filter_type   | varchar | branch, user_type, group       |
| filter_value  | varchar | The filter value               |

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

| Column    | Type    | Notes                 |
| --------- | ------- | --------------------- |
| coupon_id | integer | Foreign key → coupons |
| course_id | integer | Foreign key → courses |

_Only populated when coupon applicable_to = specific_courses_

---

### payments

| Column                 | Type      | Notes                                |
| ---------------------- | --------- | ------------------------------------ |
| id                     | integer   | Primary key                          |
| tenant_id              | integer   | Foreign key → tenants                |
| user_id                | integer   | Foreign key → users                  |
| company_id             | integer   | Foreign key → companies (nullable)   |
| stripe_payment_id      | varchar   | Stripe reference                     |
| stripe_customer_id     | varchar   | Stripe customer reference            |
| coupon_id              | integer   | Foreign key → coupons (nullable)     |
| amount_before_discount | decimal   |                                      |
| discount_amount        | decimal   | Default: 0.00                        |
| amount_final           | decimal   | What was actually charged            |
| currency               | varchar   | Default: usd                         |
| status                 | varchar   | pending, completed, failed, refunded |
| payment_type           | varchar   | individual or group                  |
| created_at             | timestamp |                                      |
| updated_at             | timestamp |                                      |

---

### payment_items

| Column      | Type      | Notes                            |
| ----------- | --------- | -------------------------------- |
| id          | integer   | Primary key                      |
| payment_id  | integer   | Foreign key → payments           |
| item_type   | varchar   | course, bundle, or exam_retake   |
| course_id   | integer   | Foreign key → courses (nullable) |
| bundle_id   | integer   | Foreign key → bundles (nullable) |
| quantity    | integer   |                                  |
| unit_price  | decimal   |                                  |
| total_price | decimal   |                                  |
| created_at  | timestamp |                                  |

---

### ecommerce_settings

| Column                 | Type      | Notes                               |
| ---------------------- | --------- | ----------------------------------- |
| id                     | integer   | Primary key                         |
| tenant_id              | integer   | Foreign key → tenants               |
| stripe_account_id      | varchar   | nullable — connected Stripe account |
| stripe_publishable_key | varchar   | nullable                            |
| stripe_secret_key      | varchar   | nullable — encrypted                |
| invoices_enabled       | boolean   | Default false                       |
| invoice_prefix         | varchar   | nullable — e.g. "NACCC-"            |
| coupons_enabled        | boolean   | Default true                        |
| currency               | varchar   | Default: usd                        |
| created_at             | timestamp |                                     |
| updated_at             | timestamp |                                     |

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

| Column              | Type      | Notes                                                                                     |
| ------------------- | --------- | ----------------------------------------------------------------------------------------- |
| id                  | integer   | Primary key                                                                               |
| tenant_id           | integer   | Foreign key → tenants                                                                     |
| user_id             | integer   | Foreign key → users                                                                       |
| type                | varchar   | deadline_reminder, inactivity, cert_expiring, enrollment, assignment_graded, announcement |
| title               | varchar   |                                                                                           |
| message             | text      |                                                                                           |
| is_read             | boolean   | Default: false                                                                            |
| read_at             | timestamp | nullable                                                                                  |
| related_entity_type | varchar   | course, certificate, assignment (nullable)                                                |
| related_entity_id   | integer   | nullable                                                                                  |
| created_at          | timestamp |                                                                                           |

---

### notification_rules

| Column                 | Type      | Notes                                                                                                                  |
| ---------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------- |
| id                     | integer   | Primary key                                                                                                            |
| tenant_id              | integer   | Foreign key → tenants                                                                                                  |
| name                   | varchar   |                                                                                                                        |
| event_type             | varchar   | user_registration, user_payment, course_assigned, course_completed, course_failed, course_cert_expired, course_expired |
| recipient_type         | varchar   | related_user, specific_recipients, admins, account_owner                                                               |
| specific_recipient_ids | jsonb     | nullable — array of user IDs when recipient_type = specific_recipients                                                 |
| message_subject        | varchar   |                                                                                                                        |
| message_body           | text      | Rich text with smart tags                                                                                              |
| is_active              | boolean   | Default false                                                                                                          |
| created_by             | integer   | Foreign key → users                                                                                                    |
| created_at             | timestamp |                                                                                                                        |
| updated_at             | timestamp |                                                                                                                        |

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

## Table Summary

| Category              | Tables                                                                                                          | Count  |
| --------------------- | --------------------------------------------------------------------------------------------------------------- | ------ |
| People                | tenants, branches, users, roles, user_roles, companies                                                          | 6      |
| Content               | courses, course_branches, modules, lessons, bundles, bundle_courses                                             | 6      |
| Assessments           | quizzes, quiz_questions, quiz_answers, quiz_attempts, quiz_attempt_answers, assignments, assignment_submissions | 7      |
| Progress & Enrollment | enrollments, lesson_progress, course_progress                                                                   | 3      |
| Certificates          | certificates, ceu_records, certificate_renewals                                                                 | 3      |
| Payments              | coupons, coupon_courses, payments, payment_items                                                                | 4      |
| Communication         | notifications, notification_preferences, conversations, conversation_participants, messages                     | 5      |
| System                | audit_logs, custom_field_definitions, custom_field_values                                                       | 3      |
| **Total**             |                                                                                                                 | **37** |

---

## Open Questions

- [x] Credit hour threshold — confirmed 16 hours global
- [x] Certificate number — confirmed permanent, never changes
- [x] CEU certificates never expire
- [x] Core certificates expire after 2 years
- [x] Renewal threshold is global not per course
- [x] Shared lessons confirmed — lesson_course_links bridge table added
- [ ] Which specific courses are CEU courses
- [ ] Confirmed: expired + recertified learner gets a NEW certificate number
- [ ] Confirmed: credit hour threshold varies by course (stored on courses table)
- [ ] salesforce_sync_log entity_type — confirm full
      closed list before Phase 7 builds it. Known:
      company, user, enrollment. Possible additions:
      certificate, course
- [ ] salesforce_sync_log — add retry_count column
      when building retry logic in Phase 7
- [ ] user_branches replaces branch_id on users table —
      confirm this is correct before Phase 7 backend build
- [ ] PayGo — confirm what this is before designing payment flow
      Could require installment payment support in Stripe
      It's not a payment plan or a separate course type — it's a branch of NACCC. Learners in the PayGo branch are on some kind of payment arrangement.
