# 🗺️ QUEST LOG — Jayden's Guide to the NACCC LMS

> This file is **just for you**. It is not read by Claude Code and not part of the
> app. It's your map, your scoreboard, and your study guide. We update it together
> as we go. Skim the top any time you feel lost.

---

## 📍 YOU ARE HERE

```
   THE WHOLE JOURNEY (each box = a Phase / "World")

   [1A]✅ → [1B]⚔️ → [2] → [3] → [4] → [5] → [6] → [7]
   learner   admin   branch auto  report integ a11y  backend
   (DONE)   (HERE)   /cert  /grp  /stats  -ations  +launch

   Overall progress:  ▰▰▱▱▱▱▱▱  ~20%   (Phase 1A done, deep into 1B)
```

**Right now:** You're inside **Phase 1B**, on a quest line called **"The Great Service Split"**
(breaking one giant code file into smaller, tidy ones). 2 of 4 steps cleared.

---

## 🎮 LEVEL & XP

| Stat | Value |
| --- | --- |
| **Current World** | Phase 1B — Admin Tooling & Cleanup |
| **Active Quest** | The Great Service Split (3 of 4) |
| **XP earned** | ⭐ 14 quests cleared |
| **Next Level Up** | Finish the Service Split → unlock "Component Splitting" |

```
PHASE 1B PROGRESS
The Great Service Split   ▰▰▰▱   3/4  (Enrollment is next)
Component Splitting       ▱▱▱▱   0/?  (locked until split done)
Accessibility Audit       ▱▱▱▱   0/?  (planned next)
Admin Panel Rebuild       ▱▱▱▱   0/?  (the big boss of 1B)
```

---

## 🧭 HOW WE PLAY (the new rhythm)

For every change from here on:

1. **The Play** — before we touch code, I explain in plain English *what* we're
   changing and *why* it matters. Like a coach drawing the play before the snap.
2. **The Run** — you paste the prompt into Claude Code in VS Code; it makes the change.
3. **The Recap** — we check the ✅, log a **What I Learned** note, and add any new
   words to the **Glossary**.
4. **🎯 Challenge** — sometimes I'll stop and ask *you* to predict what happens
   before we look. No pressure, no grades — it's just how things stick.

**Legend:** ✅ done · ⚔️ in progress · ⬜ not started · 🔒 locked (needs something first)

---

## 🗺️ THE FULL MAP (the checklist)

### WORLD 1A — Learner Experience ✅ *(COMPLETE)*
The whole student-facing side of the app.

- ✅ Login with role-aware routing (learner vs admin land in different places)
- ✅ Top navigation bar (the teal bar across the top)
- ✅ Course catalog (browse/search courses)
- ✅ Course detail + player (watch lessons, take the course)
- ✅ Quiz / exam engine (timer, password gate, results)
- ✅ My Training, My Certificates, Profile pages
- ✅ Progress saves between refreshes (localStorage)

### WORLD 1B — Admin Tooling & Cleanup ⚔️ *(YOU ARE HERE)*

**Quest line: The Great Service Split** ⚔️
*Breaking the overloaded `CourseService` into four focused services.*

- ✅ **CertificateService** — moved certificate code into its own file
- ✅ **QuizService** — moved exam-question code into its own file
- ⚔️ **EnrollmentService** — move enrollment code out *(NEXT — prompt is ready)*
- 🔒 **CourseService cleanup** — final tidy once the three above are out

**Quest line: Component Splitting** 🔒
- 🔒 Split the giant `course-detail` component (completion screen + enrollment modal)

**Quest line: Accessibility (a11y) Audit** ⬜
- ⬜ Check the app works with keyboards, screen readers, alt text, labels

**Quest line: Admin Panel Rebuild** ⬜ *(the World 1B boss)*
- ⬜ Replace the old `/admin` stub with the real admin management panel
- ⬜ `/users/:id` user detail page
- ⬜ Notifications & messages panels (currently do nothing)

### WORLD 2 — Branch Management & Certificates ⬜
- ⬜ Multi-branch setup, branch admins, custom branding per branch
- ⬜ Certificate designs (CEU simple + Core fancy)

### WORLD 3 — Automations & Group Enrollment ⬜
- ⬜ "When X happens, do Y" rules engine
- ⬜ Group / bulk enrollment

### WORLD 4 — Reporting & Analytics ⬜
- ⬜ Overview, user, course, and branch reports + CSV/Excel export

### WORLD 5 — Integrations ⬜
- ⬜ Salesforce, Stripe (real payments), Zoom, Constant Contact, Proctoring

### WORLD 6 — Accessibility & QA ⬜
- ⬜ Full WCAG accessibility pass + quality testing

### WORLD 7 — Backend & Launch ⬜ *(the final boss)*
- ⬜ Build the real backend (Node + PostgreSQL), replace all mock data, go live

---

## 📖 YOUR SPELLBOOK (Glossary)

*Plain-English definitions. We add to this as new words show up.*

- **Component** — one screen or piece of a screen (the login page, a course card).
  Think: a LEGO brick of the user interface.
- **Service** — a behind-the-scenes helper that holds data and logic, shared by many
  components. Analogy: the **kitchen** — components are the waiters who ask the kitchen
  for food; they don't cook it themselves.
- **Signal** — Angular's way of storing a value that can change, where the screen
  automatically updates when it does. Like a smart variable that says "I changed!"
- **Mock data** — fake placeholder data hardcoded in the app because the real database
  doesn't exist yet (that's Phase 7).
- **localStorage** — a tiny storage box inside the browser. We use it so your progress
  survives a page refresh (temporary, until the real backend exists).
- **Dependency Injection (`inject`)** — how a component "asks for" a service it needs.
  Instead of building its own kitchen, it just requests the shared one.
- **Refactor** — improving the *structure* of code without changing what it *does*.
  Like reorganizing a messy closet — same clothes, easier to find.
- **Single Responsibility** — the rule that each file/service should do *one* job well.
  The reason we're splitting `CourseService` into four.
- **Circular dependency** — when File A needs File B *and* File B needs File A — a
  chicken-and-egg loop that confuses the app. We deliberately avoid it (see Journal).
- **`ng lint`** — a tool that checks the code for style/quality mistakes. "Lint = fuzz
  on a sweater; linting = picking it off."
- **`ng build`** — compiles the whole app to confirm nothing is broken. Green = good.
- **Schema** — the blueprint of the future database: every table and column. Lives in
  `DATABASE_SCHEMA.md` (currently 66 tables).

---

## 📓 YOUR JOURNAL (What I Learned)

*Short notes logged as we finish things. This becomes your personal study guide.*

**The Great Service Split — why we're doing it**
`CourseService` had grown into a "junk drawer" — it handled courses, enrollments,
quiz questions, AND certificates all in one file. That breaks the *Single
Responsibility* rule: when one file does everything, it's hard to find things, easy
to break, and scary to change. We're splitting it into four focused services. Same
behavior, cleaner structure (a *refactor*).

**✅ CertificateService & QuizService — what happened**
We lifted the certificate code, then the quiz-question code, each into its own new
service file, and pointed the components that used them at the new home. Build stayed
green both times — meaning we moved things without breaking anything.

**The "shared service" trap (important!)**
Some components use `CourseService` for *several* things, not just the one we're
moving. Example: the dashboard uses it for certificates AND courses AND enrollments.
So we never just rip `CourseService` out — we *keep* it where it's still needed and
only swap the one call that moved. Miss this and the app breaks.

---

## 🎯 ACTIVE CHALLENGE

Before we run the **EnrollmentService** step, here's your prediction challenge:

> When we move enrollment code into its own `EnrollmentService`, two of CourseService's
> methods (`getUserCourses`, `getAdminStats`) still need enrollment data. So
> `CourseService` will "ask" `EnrollmentService` for it.
>
> **Question:** Why is it a *bad idea* to also let `EnrollmentService` ask
> `CourseService` for things back?

*(Take a guess — then tell me, and I'll confirm. Hint: re-read the Glossary entry for
"circular dependency.")*

---

*Last updated: after QuizService extraction. Next up: EnrollmentService.*
