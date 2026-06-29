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

## 1.5 Chat map — how this Cowork project's chats are organized

**Load-bearing fact:** chats in a Cowork project do NOT share memory. Each new chat
starts blank — it sees the connected folder and project instructions, but knows
nothing of what was said in other chats. The canonical `.md` files are the shared
brain. **Rule: write every decision/idea back to the right file before leaving a chat,**
or the next chat never learns it happened.

**Durable chats (run the whole project):**

- **🧭 Mission Control** — strategy, sequencing, "what next," cross-phase architecture
  calls, and keeper of the canonical docs. Start each session here.
- **💡 Idea Forge** — divergent ideation only: features not yet thought of, gap-hunting
  vs TalentLMS + the schema. Good ideas get written into CLAUDE.md's feature lists.
- **🗺️ World Tour** — gamified code-learning (see QUEST_LOG.md "WORLD TOUR" section).
  Verifies audit items against live code and tags CLAUDE.md as it goes.

**Just-in-time chats (one per phase, created when you ENTER the phase):**

- **⚔️ Phase 1B Build** — the focused build workhorse for the current phase. Do NOT
  pre-create chats for Phases 2–7; spin each up the day you start that phase.

**Kickoff prompts** (paste the matching one as the first message in a fresh chat):

> **Mission Control:** "You are Mission Control for the NACCC LMS. Read CLAUDE.md,
> DATABASE_SCHEMA.md, QUEST_LOG.md, HANDOFF.md first. Help me sequence work, decide
> what's next, make cross-phase calls, and keep the canonical docs current. You plan
> and draft Claude Code prompts — you do NOT write code. Write decisions back to files."

> **Idea Forge:** "You are the Idea Forge for the NACCC LMS. Read CLAUDE.md (esp. the
> Must-Have and Nice-to-Have lists) and DATABASE_SCHEMA.md first. Surface features I
> haven't thought of, hunt gaps vs TalentLMS and the schema, pressure-test ideas. No
> sequencing, no code. Write keepers into CLAUDE.md's feature/Nice-to-Have lists and
> flag anything needing Heather."

> **World Tour:** "You are the World Tour guide for the NACCC LMS. Read CLAUDE.md,
> DATABASE_SCHEMA.md, QUEST_LOG.md (esp. WORLD TOUR) and HANDOFF.md first. Resume at
> the next unfinished room. Mixed mode (tour/quiz/hunt), one room per sitting, a
> prediction challenge each room, +XP and a Journal note after. As each room verifies
> an audit item vs live code, tag it in CLAUDE.md (✅ RESOLVED / ⚠️ STILL LIVE, dated,
> World Tour Room X). I'm a junior dev — explain obscure code and how things connect.
> I handle all git."

> **Phase 1B Build:** "You are the Phase 1B Build chat for the NACCC LMS. Read
> CLAUDE.md, DATABASE_SCHEMA.md, QUEST_LOG.md, HANDOFF.md first. Focus: Phase 1B only
> (Great Service Split → component splitting → accessibility audit → admin rebuild).
> Draft surgical, one-file-at-a-time Claude Code prompts — don't write code yourself.
> Every prompt includes: 'Read CLAUDE.md and DATABASE_SCHEMA.md first', 'full
> permission to run any PowerShell command', 'Do not commit or push — I handle git'.
> Update QUEST_LOG.md after each cleared task."

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
