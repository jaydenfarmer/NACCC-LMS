# HANDOFF — Start Here (NACCC LMS)

This file orients a new AI assistant (or person) to the project. Read it first,
then read the canonical files below.

---

## 1. The canonical files (read in this order)

1. **CLAUDE.md** — the source of truth. Project rules, tech stack, current status,
   full feature list, phase plan, and all design NOTES. If anything anywhere
   conflicts with CLAUDE.md, CLAUDE.md wins.
2. **DATABASE_SCHEMA.md** — the complete planned PostgreSQL schema (66 tables).
   Read before touching anything data-related.
3. **QUEST_LOG.md** — Jayden's personal learning tracker (plain-English checklist,
   glossary, journal). Not a build doc — it's the human-facing map of progress.

Everything important about *how to build* lives in those three files. This handoff
adds the context that was discussed but isn't fully captured there.

---

## 2. What this assistant's role is (paste into Cowork project instructions)

> You are the master planning and architecture assistant for the NACCC custom LMS
> project. I am Jayden Farmer, the developer.
>
> Your job is to help me plan, sequence, architect, and draft precise prompts for
> Claude Code (a separate AI coding tool in VS Code). You are NOT Claude Code — you
> do not write code yourself.
>
> Always read CLAUDE.md and DATABASE_SCHEMA.md before doing anything. These are the
> ground truth for the project.
>
> Key rules when drafting Claude Code prompts:
> - Always include "Read CLAUDE.md and DATABASE_SCHEMA.md first"
> - Always include "You have full permission to run any PowerShell command without asking"
> - Always include "Do not commit or push to git — I handle all git operations manually"
> - One file at a time, one task at a time, surgical changes only
> - Investigate and report before making changes on complex tasks
>
> Follow these instructions when working in this project.

---

## 3. Project background (the "why")

- **NACCC** (National Association of Certified Credit Counselors) — trains and
  certifies financial/credit counselors across multiple programs: CFCP certification,
  CEU courses, ed2go/Cengage college partnership, World Services for the Blind,
  Goodwill, NDI, PayGo.
- **Company-driven model.** NACCC is organized around member *firms*, not just
  individuals. Counselors belong to companies. The `companies` table is the primary
  org unit; `users.company_id` links them (nullable for unaffiliated individuals).
- **Counseling in Action (CIA)** — an affiliated org that will get its own branded
  "skin" of the same multi-tenant platform. (A separate temporary Moodle instance
  exists for CIA — that is NOT this codebase.)
- **Heather Aiello** — key stakeholder and decision-maker. Many open design questions
  are tagged "confirm with Heather" in CLAUDE.md.
- This is a **custom LMS replacing TalentLMS**, plus replacing Formstack + Calendly
  (exam scheduling) and Zapier (Salesforce sync) down the line.

---

## 4. Phase model — IMPORTANT

There are **exactly 7 phases** (plus 1A and 1B), as defined in CLAUDE.md's "Phases
Overview" table. If you ever see a document referencing a "Phase 8" or "Phase 9,"
it is OUTDATED — CLAUDE.md's 7-phase model is canonical. Salesforce = Phase 5
(Integrations). Backend = Phase 7.

---

## 5. Current state (as of this handoff)

- **Phase 1A (learner experience): COMPLETE.**
- **Phase 1B (admin tooling / cleanup): IN PROGRESS.** Active work is "The Great
  Service Split" — breaking the overloaded `CourseService` into four focused services:
  - CertificateService ✅ done
  - QuizService ✅ done
  - EnrollmentService ⏳ next (a ready-to-run prompt exists; see chat history)
  - CourseService final cleanup 🔒 after the above
- After the split: component splitting (course-detail), accessibility audit, then the
  admin panel rebuild.

---

## 6. Key architecture decisions already made

- **Frontend:** Angular 20, standalone components only, Angular Signals for state.
  No RxJS except `route.params` with `takeUntilDestroyed()`. TypeScript strict, no `any`.
- **No backend yet** — all data is mock data in service files; localStorage is used
  only for temporary progress/enrollment persistence until Phase 7.
- **Salesforce (Phase 5/7):** the LMS becomes the system of record for users and
  company association; Salesforce becomes the downstream consumer of activity. The
  firm's `account_number` is the matching key. Companies are created ONLY by Salesforce
  sync or NACCC staff — never by the registration path. (See the invite-token NOTE in
  CLAUDE.md.)
- **Exam proctoring:** internal NACCC proctor (auto Zoom link) vs external/learner-
  supplied proctor (needs NACCC approval, no link). Vendor TBD. Modeled via the
  `exam_bookings` table.
- **CEU gating:** CEU courses are gated behind core certification (`course_prerequisites`).

---

## 7. Working rhythm (how Jayden likes to work)

- This assistant **plans and drafts prompts**; the actual coding is done by Claude
  Code in VS Code.
- Jayden is learning the codebase as we go. Before each change, explain the "play" in
  plain English (what + why + key concept). After each change, update QUEST_LOG.md
  (mark progress, add a "What I Learned" note, add new glossary terms). Game-style
  framing and occasional "predict what happens" challenges are welcomed.
- Surgical changes only — one file, one task at a time. Always `ng lint` + `ng build`
  before a task is considered done. Jayden handles ALL git operations manually.

---

## 8. Connected tools / environment

- **Git:** two GitHub remotes — `jaydenfarmer/NACCC-LMS` and `NACCCUS/NACCC-LMS`.
- **Jira:** project key `KAN` (Atlassian). **QuickBooks** also connected.
- Note: connected tools (Jira/Atlassian, QuickBooks) are per-account — the new Cowork
  account must reconnect those connectors itself; they don't transfer with the repo.
- Environment: Windows 11, PowerShell, VS Code + Claude Code.

---

## 9. How this project was transferred here

Everything you need is in this git repo. If you're the new assistant: read sections
1–8 above and the three canonical files, then ask Jayden where he wants to pick up
(most likely: run the EnrollmentService prompt to continue the service split).
