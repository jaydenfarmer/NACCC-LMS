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

| Column       | Type      | Notes                          |
| ------------ | --------- | ------------------------------ |
| id           | integer   | Primary key                    |
| tenant_id    | integer   | Foreign key → tenants          |
| name         | varchar   |                                |
| logo_url     | varchar   | Optional branch-level override |
| accent_color | varchar   | Optional branch-level override |
| created_at   | timestamp |                                |
| updated_at   | timestamp |                                |

---

### roles

| Column | Type    | Notes                                                     |
| ------ | ------- | --------------------------------------------------------- |
| id     | integer | Primary key                                               |
| name   | varchar | learner, instructor, branch_manager, branch_viewer, admin |

---

### users

| Column                | Type      | Notes                                       |
| --------------------- | --------- | ------------------------------------------- |
| id                    | integer   | Primary key                                 |
| tenant_id             | integer   | Foreign key → tenants                       |
| branch_id             | integer   | Foreign key → branches (nullable)           |
| company_id            | integer   | Foreign key → companies (nullable)          |
| active_role_id        | integer   | Foreign key → roles — currently active role |
| first_name            | varchar   |                                             |
| last_name             | varchar   |                                             |
| email                 | varchar   | Unique per tenant                           |
| username              | varchar   | Unique per tenant                           |
| password_hash         | varchar   | Never plain text                            |
| bio                   | text      | nullable                                    |
| timezone              | varchar   | e.g. America/New_York                       |
| language              | varchar   | Default: en                                 |
| is_active             | boolean   | Deactivated users retained for history      |
| failed_login_attempts | integer   | Default: 0                                  |
| locked_until          | timestamp | nullable — set on too many failed attempts  |
| last_login_at         | timestamp | nullable                                    |
| created_at            | timestamp |                                             |
| updated_at            | timestamp |                                             |

---

### user_roles

| Column    | Type    | Notes                                                    |
| --------- | ------- | -------------------------------------------------------- |
| id        | integer | Primary key                                              |
| user_id   | integer | Foreign key → users                                      |
| role_id   | integer | Foreign key → roles                                      |
| is_global | boolean | True = not scoped to one branch (e.g. global instructor) |

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

---

## CONTENT

### courses

| Column             | Type      | Notes                                      |
| ------------------ | --------- | ------------------------------------------ |
| id                 | integer   | Primary key                                |
| tenant_id          | integer   | Foreign key → tenants                      |
| title              | varchar   |                                            |
| description        | text      |                                            |
| thumbnail_url      | varchar   | nullable                                   |
| price              | decimal   | 0.00 for free courses                      |
| is_published       | boolean   | Draft vs live                              |
| is_mandatory       | boolean   |                                            |
| issues_certificate | boolean   |                                            |
| ceu_credit_hours   | decimal   | nullable — only for CEU courses            |
| required_ceu_hours | decimal   | nullable — hours needed to trigger renewal |
| passing_score      | integer   | Minimum % to complete                      |
| version            | integer   | Default: 1 — increments on update          |
| created_by         | integer   | Foreign key → users                        |
| created_at         | timestamp |                                            |
| updated_at         | timestamp |                                            |

---

### course_branches

| Column    | Type    | Notes                  |
| --------- | ------- | ---------------------- |
| id        | integer | Primary key            |
| course_id | integer | Foreign key → courses  |
| branch_id | integer | Foreign key → branches |

_One row per course/branch assignment. A course with no rows here is main domain only._

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

| Column           | Type      | Notes                                       |
| ---------------- | --------- | ------------------------------------------- |
| id               | integer   | Primary key                                 |
| module_id        | integer   | Foreign key → modules                       |
| title            | varchar   |                                             |
| type             | varchar   | video, pdf, quiz, exam, assignment, webinar |
| content_url      | varchar   | nullable                                    |
| order            | integer   | Display order within module                 |
| duration_minutes | integer   | nullable                                    |
| is_previewable   | boolean   | Viewable before enrollment                  |
| is_mandatory     | boolean   |                                             |
| created_at       | timestamp |                                             |
| updated_at       | timestamp |                                             |

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

## ASSESSMENTS

### quizzes

| Column             | Type      | Notes                 |
| ------------------ | --------- | --------------------- |
| id                 | integer   | Primary key           |
| lesson_id          | integer   | Foreign key → lessons |
| course_id          | integer   | Foreign key → courses |
| tenant_id          | integer   | Foreign key → tenants |
| title              | varchar   |                       |
| type               | varchar   | quiz or exam          |
| passing_score      | integer   | Minimum % to pass     |
| max_attempts       | integer   | nullable = unlimited  |
| time_limit_minutes | integer   | nullable = no limit   |
| shuffle_questions  | boolean   |                       |
| created_at         | timestamp |                       |
| updated_at         | timestamp |                       |

---

### quiz_questions

| Column        | Type      | Notes                                      |
| ------------- | --------- | ------------------------------------------ |
| id            | integer   | Primary key                                |
| quiz_id       | integer   | Foreign key → quizzes                      |
| question_text | text      |                                            |
| question_type | varchar   | multiple_choice, short_answer — extensible |
| points        | integer   |                                            |
| order         | integer   |                                            |
| created_at    | timestamp |                                            |

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

## PROGRESS & ENROLLMENT

### enrollments

| Column          | Type      | Notes                                               |
| --------------- | --------- | --------------------------------------------------- |
| id              | integer   | Primary key                                         |
| tenant_id       | integer   | Foreign key → tenants                               |
| user_id         | integer   | Foreign key → users                                 |
| course_id       | integer   | Foreign key → courses                               |
| branch_id       | integer   | Foreign key → branches                              |
| enrolled_by     | integer   | Foreign key → users — who did the enrolling         |
| enrollment_date | timestamp |                                                     |
| due_date        | timestamp | nullable                                            |
| status          | varchar   | enrolled, in_progress, completed, expired           |
| payment_id      | integer   | Foreign key → payments (nullable — free courses)    |
| group_id        | integer   | Foreign key → enrollment_groups (nullable — future) |
| created_at      | timestamp |                                                     |
| updated_at      | timestamp |                                                     |

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

| Column                | Type      | Notes                               |
| --------------------- | --------- | ----------------------------------- |
| id                    | integer   | Primary key                         |
| user_id               | integer   | Foreign key → users                 |
| course_id             | integer   | Foreign key → courses               |
| tenant_id             | integer   | Foreign key → tenants               |
| branch_id             | integer   | Foreign key → branches              |
| completion_percentage | decimal   | 0.00 to 100.00                      |
| status                | varchar   | not_started, in_progress, completed |
| started_at            | timestamp | nullable                            |
| completed_at          | timestamp | nullable                            |
| last_accessed_at      | timestamp | nullable                            |

---

## CERTIFICATES

_⚠️ Drafted but not finalized — pending answers from NACCC on:_

- _Credit hour threshold per certification (varies by course)_
- _Recertification after expiry — new certificate number confirmed_

### certificates

| Column                | Type      | Notes                                |
| --------------------- | --------- | ------------------------------------ |
| id                    | integer   | Primary key                          |
| tenant_id             | integer   | Foreign key → tenants                |
| user_id               | integer   | Foreign key → users                  |
| course_id             | integer   | Foreign key → courses                |
| certificate_number    | varchar   | Unique across platform               |
| issued_at             | timestamp |                                      |
| expires_at            | timestamp |                                      |
| status                | varchar   | active, expired, revoked             |
| required_ceu_hours    | decimal   | Pulled from course at time of issue  |
| accumulated_ceu_hours | decimal   | Resets to 0 after each renewal       |
| template_url          | varchar   |                                      |
| pdf_url               | varchar   | Generated PDF location               |
| verification_url      | varchar   | Public URL for employer verification |
| created_at            | timestamp |                                      |
| updated_at            | timestamp |                                      |

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
| item_type   | varchar   | course or bundle                 |
| course_id   | integer   | Foreign key → courses (nullable) |
| bundle_id   | integer   | Foreign key → bundles (nullable) |
| quantity    | integer   |                                  |
| unit_price  | decimal   |                                  |
| total_price | decimal   |                                  |
| created_at  | timestamp |                                  |

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

### notification_preferences

| Column         | Type      | Notes                                                  |
| -------------- | --------- | ------------------------------------------------------ |
| id             | integer   | Primary key                                            |
| tenant_id      | integer   | Foreign key → tenants — admin controlled, not per user |
| type           | varchar   | Notification type                                      |
| in_app_enabled | boolean   |                                                        |
| email_enabled  | boolean   |                                                        |
| created_at     | timestamp |                                                        |
| updated_at     | timestamp |                                                        |

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

- [ ] Credit hour threshold per certification — varies by course, need full list
- [ ] Which specific courses issue certificates
- [ ] Which specific courses are CEU courses
- [ ] Is 2 year expiration consistent across all certifications
- [ ] Confirmed: expired + recertified learner gets a NEW certificate number
- [ ] Confirmed: credit hour threshold varies by course (stored on courses table)
