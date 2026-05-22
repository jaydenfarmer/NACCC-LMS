# Custom Learning Management System

## Software Proposal for Counseling in Action

**Prepared by:** Jayden Haiel  
**Date:** May 19, 2026  
**Version:** 1.0

---

## Executive Summary

This proposal outlines the development of a fully custom Learning Management System (LMS) designed specifically for Counseling in Action and built to scale beyond it. Rather than continuing to pay for and work around the limitations of a third-party platform like TalentLMS, this system will be owned outright, tailored to the exact workflows credit counseling organizations rely on, and designed from day one to serve multiple branches and organizations under one roof.

A functional prototype has already been developed using Angular — the industry-standard framework for enterprise web applications. Core infrastructure including role-based access control, course delivery, an assessment engine, and a role-specific dashboard are already operational. This proposal covers the full scope of work to take that foundation to a production-ready, enterprise-grade platform.

---

## The Problem with Off-the-Shelf Platforms

Generic LMS platforms like TalentLMS are built for everyone, which means they are optimized for no one in particular. Organizations in the credit counseling space face recurring friction:

- **Rigid course structures** that don't map to certification workflows
- **Limited branch/organization management** requiring expensive tier upgrades
- **Automation that lives behind paywalls** or requires manual workarounds
- **Reporting that is hard to customize** and export
- **No ownership of data** — content, learner records, and certificates live on a vendor's servers
- **Recurring subscription costs** that scale with users, making growth expensive
- **WCAG accessibility requirements** that many platforms only partially address

A custom platform eliminates these constraints permanently and creates a long-term asset the organization fully owns.

---

## Proposed Solution

A modern, web-based Learning Management System built on Angular — the same framework powering Google, Microsoft, and enterprise platforms worldwide. The system will be:

- **Multi-tenant by design** — support multiple branches or client organizations from a single deployment
- **Role-aware** — Learners, Instructors, Branch Managers, and Administrators each see exactly what they need
- **Accessible** — built to WCAG 2.1 AA standards from the ground up, not bolted on later
- **Automation-first** — enrollment triggers, deadline reminders, certificate issuance, and status updates run without manual intervention
- **Reporting-ready** — exportable reports available to managers and administrators at every level

---

## Core Feature Set

### Phase 1A — Learner Experience UI Prototype _(In Progress)_

A working prototype is operational. The UI shell is built and the learner
experience is functional with mock data. Phase 1A completes this foundation.

| Feature                                                                 | Status   |
| ----------------------------------------------------------------------- | -------- |
| Secure login with role-based access control                             | Complete |
| Role-specific dashboards (Learner, Instructor, Admin)                   | Complete |
| Course catalog with search and filtering                                | Complete |
| Modular course structure (Modules → Lessons)                            | Complete |
| Quiz and exam engine with timer, auto-grading, and pass/fail thresholds | Complete |
| Progress tracking per course and per learner                            | Complete |
| Collapsible sidebar navigation with role-based menu items               | Complete |
| Announcement banner system                                              | Complete |
| Role switching (for administrators managing accounts)                   | Complete |

**Phase 1A Completion Goals:**

- Public facing course catalog (no login required)
- Lesson auto-complete on open
- Course completion screen with congratulations
- Immediate certificate generation and download on completion screen
- My Certificates page
- Full learner history page
- "What's next" prompt on dashboard
- Dashboard widget showing expiring certificates with links to relevant CEU courses
- Fix quiz and exam engine end to end
- Persist progress to localStorage until backend is complete

---

### Phase 1B — Admin & Instructor Tooling _(Not Started)_

The tools that make the platform actually usable in production.
Without these, all data must be hardcoded.

- Course builder — create, edit, publish, archive courses
- Module builder — add and reorder modules within a course
- Lesson builder — add lessons, set type (video, PDF, quiz, exam, assignment, webinar)
- YouTube embed for video lessons
- PDF upload and external URL link for PDF lessons
- Quiz and exam question builder inside LMS
- Instructor course preview as learner before publishing
- Courses start as draft by default
- Course versioning — update without wiping learner progress
- User management page with branch selector filter
- User profile with tabs — Courses, Branches, Payments, Info
- User creation by admin with automatic welcome email
- Admin password reset — set new password directly
- Admin can change user role from user profile
- Bulk CSV user import
- User deactivation and reactivation without data loss
- Duplicate user detection and merging
- Enroll from user profile or from course page
- Bulk enrollment — select multiple users into one course
- Enrollment notification email to learner when admin enrolls them
- Expiration date configurable at enrollment time
- Complimentary enrollment — admin can enroll without payment
- Suspended enrollment status for check/manual payment learners
- Suspended learners can see course but cannot access content
- Admin activates suspended enrollment when payment clears
- Activation notification email to learner
- Unenrollment preserves progress for future re-enrollment
- Per-course user list with: User, Role, Progress status, Enrollment date, Completion date, Expiration date
- Email template management page (admin and instructor access)
- Branch creation and management UI
- Platform branding settings (logo, colors)
- Stripe account connection in admin settings
- Native exam scheduling flow — replaces Formstack and Calendly
- Learner selects available time slot from inside LMS
- Automatic Zoom link generation for scheduled exam
- Proctor notification on new exam booking
- Gradebook view per course
- Manual grade override for assignments
- Ability to leave feedback on submitted assignments
- Instructor announcements per course
- Admin dashboard with platform wide stats

---

### Phase 2 — Branch Management & Certificates _(~6 weeks)_

**Branch Management**  
The system will support multiple branches, offices, or client organizations operating under one platform. Each branch gets its own isolated environment with:

- Dedicated learner pools and course libraries
- Branch-level administrator accounts
- Separate reporting views for branch managers
- Custom branding per branch (logo, accent colors)
- Cross-branch enrollment capabilities for shared content

**Certificate Module**  
A fully automated, professionally designed certificate system:

- Auto-issued upon course or program completion based on configurable criteria
- Unique certificate numbers for authenticity verification
- PDF generation and download for learners
- Expiration and renewal tracking (critical for certification-based courses)
- Administrator certificate management (revoke, reissue, bulk export)
- Public verification URL for employer or regulatory validation

---

### Phase 3 — Automations

Time-consuming manual processes will be replaced with rule-based automations:

- **Enrollment triggers** — auto-enroll learners into the next course upon completion of a prerequisite
- **Deadline reminders** — scheduled email/in-app reminders for upcoming due dates (7-day, 3-day, 1-day)
- **Certificate issuance** — automatic generation and delivery when passing criteria are met
- **Expiration alerts** — notify learners and managers when a certification is approaching its expiration date
- **Inactivity flags** — surface learners who haven't logged in or progressed within a configurable window
- **Completion reports** — scheduled report delivery to branch managers and administrators
- **Course assignment rules** — auto-assign courses based on learner role, group, or branch

---

### Phase 4 — Reporting & Analytics

Reports designed for people who need answers quickly, not data analysts:

- **Learner progress reports** — per-learner completion status, quiz scores, time spent, and current standing
- **Course completion rates** — aggregate views of how learners are performing across a course
- **Branch-level summaries** — managers see their branch at a glance without accessing other branches
- **Certificate status dashboard** — who has earned, who has expired, who is at risk
- **Assessment performance** — question-level analytics to identify weak areas and improve content
- **Export options** — one-click CSV and PDF export for all reports
- **Scheduled delivery** — reports automatically emailed to designated recipients on a set cadence
- Constant Contact integration — automatically sync new Leads and Contacts from Salesforce
- Proctoring service integration (vendor TBD)

---

### Phase 5 — WCAG Accessibility & Quality Assurance

Full compliance with **WCAG 2.1 AA** standards, ensuring the platform is usable by all learners regardless of ability:

- Keyboard-navigable interface throughout — no mouse required
- Screen reader compatibility with proper ARIA labels and live regions
- Color contrast ratios meeting AA minimums across all UI components
- Focus indicators visible on all interactive elements
- Accessible video player with caption support
- Form validation with clear, descriptive error messaging
- Accessible PDF certificates with tagged structure

Quality assurance will include:

- Automated accessibility testing integrated into the build process
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile and tablet responsive layout
- Unit and end-to-end test coverage for critical workflows

---

### Future Feature Pipeline

These items are scoped and documented for future development phases:

- **Learning Paths** — guided sequences of courses toward a credential or role
- **Instructor-led training (ILT)** — calendar-based scheduling for live webinar sessions
- **Groups & Cohorts** — learner group management with shared progress and communication
- **Internal messaging system** — direct messages and announcements between users
- **Course store** — optional storefront for selling courses externally
- **Third-party integrations** — Zoom for webinars, SCORM/xAPI for content import
- **Multilingual support** — content and UI localization for Spanish and other languages

---

## Technical Architecture

**Frontend:** Angular 20 (latest) — the same framework powering Google, Microsoft Office, and enterprise platforms worldwide. Built with standalone components and Angular Signals for modern, maintainable code that ages well.

**Backend (planned):** Node.js with Express — a JavaScript-native server layer that pairs naturally with the Angular frontend and enables rapid iteration.

**Database (planned):** PostgreSQL — a production-grade relational database trusted by Fortune 500 companies. Course records, learner data, and certificates will be stored reliably and queryable for reporting.

**Hosting (planned):** Cloud-based deployment (AWS or similar) with automated backups, TLS encryption, and infrastructure that scales with user volume.

**Security:**

- All data encrypted in transit (HTTPS/TLS)
- Role-based access prevents unauthorized data exposure
- Session management with configurable timeouts
- Audit logging for administrator actions

---

## Proposed Timeline

The following timeline is based on solo development with incremental releases. Each phase delivers working, usable functionality — nothing is blocked waiting for everything else to be complete.

### Phase 1 — Foundation _(Complete)_

> Core infrastructure, course delivery, assessment engine, role-based dashboards

**Delivered:** Working prototype with authentication, course catalog, quiz engine, and role-specific navigation.

---

### Phase 2 — Branch Management & Certificates _(~10 weeks)_

> Weeks 1–4: Branch data model, branch admin role, per-branch learner isolation  
> Weeks 5–7: Certificate template design, PDF generation, unique certificate number system  
> Weeks 8–10: Certificate verification URL, expiration tracking, administrator certificate management

**Milestone:** Administrators can create branches, assign learners, and issue verifiable PDF certificates.

---

### Phase 3 — Automations _(~8 weeks)_

> Weeks 1–3: Automation rules engine (trigger → condition → action framework)  
> Weeks 4–6: Enrollment triggers, deadline reminders, inactivity alerts  
> Weeks 7–8: Certificate auto-issuance, scheduled report delivery

**Milestone:** No manual enrollment or reminder work required for standard learner workflows.

---

### Phase 4 — Reporting & Analytics _(~6 weeks)_

> Weeks 1–3: Reporting data layer, learner progress reports, course completion rates  
> Weeks 4–5: Branch-level summaries, assessment analytics, certificate status dashboard  
> Week 6: CSV/PDF export, scheduled report delivery

**Milestone:** Branch managers and administrators can pull and export any report in under two minutes.

---

### Phase 5 — WCAG Compliance & QA _(~6 weeks)_

> Weeks 1–2: Accessibility audit of all existing components  
> Weeks 3–4: Remediation (keyboard nav, ARIA, contrast, focus indicators)  
> Weeks 5–6: Cross-browser testing, mobile QA, automated accessibility testing in CI

**Milestone:** Platform passes WCAG 2.1 AA audit. Usable on all major browsers and devices.

---

### Phase 6 — Backend Integration & Production Launch _(~10 weeks)_

> Weeks 1–3: Node.js API scaffolding, PostgreSQL schema, data migration from mock data  
> Weeks 4–6: Frontend connected to real API (auth, courses, progress, certificates)  
> Weeks 7–8: Automation and reporting backends wired up  
> Weeks 9–10: Security review, load testing, staging environment, production launch

**Milestone:** Live production system deployed, staff trained, data migrated.

---

### Summary Timeline

| Phase | Scope                   | Duration | Cumulative |
| ----- | ----------------------- | -------- | ---------- |
| 1     | Foundation              | Complete | —          |
| 2     | Branches & Certificates | 10 weeks | 10 weeks   |
| 3     | Automations             | 8 weeks  | 18 weeks   |
| 4     | Reporting               | 6 weeks  | 24 weeks   |
| 5     | WCAG & QA               | 6 weeks  | 30 weeks   |
| 6     | Backend & Launch        | 10 weeks | 40 weeks   |

**Estimated total: approximately 10 months from today to production launch.**

This timeline assumes development as part of the current role and can be adjusted based on availability and prioritization.

---

## Scope of Work

The following defines what is included in this proposal:

**In Scope:**

- All features described in Phases 1–6 above
- Design and development of all frontend and backend components
- Database design and implementation
- Deployment to cloud hosting
- Staff training and documentation
- Ongoing support for bug fixes during a 60-day post-launch warranty period

**Out of Scope (unless added via change order):**

- Content creation (course videos, PDFs, written lessons)
- Third-party software licensing (e.g., Zoom, SCORM authoring tools)
- Custom SCORM content import (can be added in a future phase)
- Integrations not listed in this proposal
- Mobile native apps (iOS/Android) — the web app is mobile-responsive but not a native app

---

## Why Build vs. Buy

|                       | Custom LMS                                           | TalentLMS (or similar)                   |
| --------------------- | ---------------------------------------------------- | ---------------------------------------- |
| **Ownership**         | Full — code, data, and IP belong to the organization | None — data lives on vendor servers      |
| **Cost over 5 years** | One-time development investment                      | Recurring subscription, grows with users |
| **Branch management** | Built for your exact structure                       | Expensive tier upgrades                  |
| **Automations**       | Any rule the business needs                          | Limited to vendor feature set            |
| **Reporting**         | Fully customizable                                   | Fixed templates                          |
| **WCAG compliance**   | Guaranteed by design                                 | Varies; often partial                    |
| **Certificates**      | Custom branded, verifiable                           | Generic templates                        |
| **Future features**   | Added on your schedule                               | Dependent on vendor roadmap              |
| **Portability**       | Can serve any organization                           | Locked to vendor                         |

---

## Closing

This project is an investment in a tool the organization owns outright — one that can grow, adapt, and eventually serve as a platform offering for other organizations in the credit counseling and financial education space. The foundation is already built. The architecture is sound. The path to production is clear.

The goal is to deliver a platform that the team is proud of, that learners actually enjoy using, and that eliminates the manual overhead that comes with managing training at scale.

I look forward to discussing next steps.

---

**Prepared by:** Jayden Haiel  
**Contact:** enrollment@counselinginaction.com  
**Project Repository:** Internal — available upon request
