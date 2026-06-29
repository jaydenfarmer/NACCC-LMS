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
| **XP earned** | ⭐ 20 quests cleared — 🏆 World Tour complete |
| **Next Level Up** | Finish the Service Split → unlock "Component Splitting" |

```
PHASE 1B PROGRESS
The Great Service Split   ▰▰▰▱   3/4  (Enrollment is next)
Component Splitting       ▱▱▱▱   0/?  (locked until split done)
Accessibility Audit       ▱▱▱▱   0/?  (planned next)
Admin Panel Rebuild       ▱▱▱▱   0/?  (the big boss of 1B)
```

---

## 🗺️ WORLD TOUR — "Know Thy Castle" (replay quest line)

A guided replay of the whole project so you actually *understand* what you built.
**Mixed mode:** each room is a tour 🧭, a quiz ❓, or a hunt 🔦 — you never know
which is coming. That's the anti-boredom weapon.

```
WORLD TOUR PROGRESS   ▰▰▰▰▰▰▰   7/7 rooms — ✅ COMPLETE!

  [1] Login         ✅   the front door + role routing
  [2] Top Nav       ✅   the teal bar, role-filtered links
  [3] Catalog       ✅   browse / search courses
  [4] Course Player ✅   lessons, completion, the sticky bar
  [5] Quiz Engine   ✅   timer, password gate, results
  [6] Service Layer ✅   the "kitchens" — where the data lives
  [7] Schema & Plan ✅   the 66-table blueprint + the 7 Worlds
```

**Rule:** one room per sitting (more if you're on a roll). Each ends with a
challenge and an XP tick; we log a Journal note + new Glossary words after.

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
- **Role-aware routing** — the app sending different roles to different landing pages
  on login (learner → `/my-learning`, everyone else → `/dashboard`). One line in
  `login.component.ts` does it. The app reshapes itself around *who you are*.
- **Stale doc** — a note in a doc that no longer matches the code (e.g. the audit's
  "BUG 1" claims demo buttons don't auto-submit, but the code now auto-submits). The
  World Tour exists partly to catch these.
- **Route** — an entry in `app.routes.ts` that maps a URL path (like `/courses`) to a
  component to show. If there's no matching route, the URL goes nowhere real.
- **`routerLink`** — the Angular attribute on a link/button that says "navigate to this
  path." It's the *intent*; the *route* is what actually fulfills it. A `routerLink` to
  a path with no route is a dead link.
- **Wildcard route (`**`)** — the catch-all at the bottom of the routes list. Any URL
  that matches nothing above it falls here. In this app it `redirectTo: 'dashboard'`,
  so every dead link quietly dumps you on Home instead of showing a 404.
- **`computed()` signal** — a signal whose value is *derived* from other signals and
  recalculates automatically when they change. The nav's `navItems` is computed from
  the logged-in user — change the user's role, the menu rebuilds itself.
- **No-op** — a method that exists but does nothing (`{ return; }`). The bell and
  envelope buttons call no-ops today, so they "work" (no error) but produce nothing.
- **`routerLink` vs `(click)` handler** — the key distinction from Room 3. A
  `routerLink` only *navigates* (moves you to another page). A `(click)` handler can
  *act* — run logic, change data, enroll you. A button with ONLY a `routerLink` is
  structurally incapable of changing data; it can just take you somewhere.
- **`computed()` vs imperative signal** — two ways to keep a derived list in sync. A
  `computed()` recalculates itself automatically from its inputs. An *imperative*
  signal (like the catalog's `filteredCourses`) only updates when you manually call a
  method to re-set it — easy to forget, easy to desync. The catalog uses the manual
  way (a known smell flagged for cleanup).
- **`@if / @else if` chain (no `@else`)** — Angular's template version of a switch. The
  player uses one to pick how to draw a lesson by its type. If a type matches NO branch
  and there's no `@else`, *nothing* renders — silently. That's the audio-lesson bug.
- **`DomSanitizer` / `bypassSecurityTrustResourceUrl`** — Angular blocks untrusted URLs
  in `<iframe [src]>` by default (security: stops malicious embeds). To allow a real
  YouTube URL you must explicitly mark it trusted via `bypassSecurityTrustResourceUrl`.
  "Bypass" sounds reckless but it's the *intended* escape hatch — you're vouching for it.
- **`[innerHTML]`** — binds a string of real HTML into an element (used to render lesson
  body text). Angular sanitizes it by default; safe for trusted content, worth a second
  look once the HTML becomes user/admin-authored.
- **Subscription leak / `takeUntilDestroyed`** — an RxJS `.subscribe()` keeps listening
  even after a component is destroyed unless you tell it to stop. `takeUntilDestroyed()`
  auto-unsubscribes when the component dies. Missing it = a slow memory leak.
- **Floor vs. round** — the Room 5 timer bug. *Rounding* sends 89.98 → 90; *flooring*
  (chopping the decimal) sends 89.98 → 89. A clock must always FLOOR its minutes, or it
  displays time you haven't reached yet (the exam clock briefly reads 90:59).
- **Angular number pipe `'2.0-0'`** — format string `minInt.minFrac-maxFrac`. `2.0-0` =
  at least 2 whole digits, no decimals → it *rounds*. That rounding is what breaks the
  timer; the fix is `Math.floor()` in the code, not the pipe.
- **Accidental reactivity (the zone)** — normally Angular only re-draws when a *signal*
  changes. But `setInterval` runs inside Angular's "zone," which forces a re-check every
  tick — so the exam's plain `timerSeconds` property updates on screen *by luck*, not by
  design. Flagged as fragile: it should be a real signal.
- **State machine** — a component that's always in exactly one named state and moves
  between them. The exam is one: locked → pre-test → started → finished, each picked by
  a signal, each showing a different screen.
- **One-way dependency rule** — the safe answer to circular dependency. When kitchen A
  needs data from kitchen B, let A depend on B but NEVER let B depend on A. For the
  split: `CourseService` may import `EnrollmentService`; `EnrollmentService` must stay
  ignorant of courses. Arrows point one direction only — no loops.
- **Schema** — the blueprint for the database that doesn't exist yet (66 tables, 10
  categories, in DATABASE_SCHEMA.md). The app today runs on mock data; Phase 7 builds
  these tables for real and the services start reading from them.
- **`'1' === 1` is `false`** — in JavaScript a string and a number are never equal even
  if they "look" the same. This is why the string-vs-integer ID mismatch is a SILENT
  Phase-7 bug: a real integer id won't match a leftover string id, and nothing errors —
  the record just "isn't found."
- **Blast radius** — how far a change ripples. A type on 13 model lines doesn't sound
  big, but it spreads into every service signature, comparison, and storage key that
  touches an ID. Small definition, wide blast radius.

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

**🗺️ World Tour — Room 1 (Login) cleared**
The login page does role-aware routing: one line decides where you land based on your
role. Two signals worth knowing — `email`/`password` hold what you type, and
`errorMessage` sits empty until a login *fails*, then fills the red text. Big lesson:
the QA audit's "BUG 1 — demo buttons don't auto-submit" is **stale** — the code now
calls `onSubmit()` for you. Docs drift from code; trust the code, fix the doc.

**🗺️ World Tour — Room 2 (Top Nav) cleared — a HUNT 🔦 (semi-guided)**
Big idea: the bar is ONE master list (`allNavItems`) filtered by a role-aware filter,
so one component becomes three menus. The hunt's lesson is sharper though: a *link*
(in `top-nav.component.ts`) and a *route/screen* (in `app.routes.ts`) are two separate
things that don't have to agree. Three independent facts: a link exists, a route
exists, and they point at each other. Counting it out:
• Only **4** distinct main-nav links open a real screen: `/dashboard`, `/courses`,
  `/my-learning`, `/my-certificates`. Everything else (Calendar, Skills, Groups,
  Branches, Learning paths, Conferences, Grading Hub, all Reports children,
  Automations, Notifications, Settings, Subscription, Users) has no route yet.
• It cuts both ways: some real routes have NO menu link — `/profile` (avatar menu),
  `/search` + `/courses/:id` (search box / course click), `/admin` + `/teaching`
  (no link at all).
• Clicking a dead link doesn't 404 — the `**` wildcard `redirectTo: 'dashboard'`
  quietly bounces you Home. A demo can look 90% done and be ~30% wired.
My guess was "10 working"; real answer was 4 — the gap was real routes that aren't
reachable from the nav (profile/search/admin), which I'd mentally counted as menu wins.
Audit items verified vs live code (tagged in CLAUDE.md, Room 2):
• `openNotifications()` / `openMessages()` — ⚠️ STILL LIVE. The old `header.component.ts`
  was deleted, but the empty no-op methods just moved to `top-nav.component.ts:208/210`
  and still power the bell + envelope buttons. The "3" / "5" badges are hardcoded fakes.
• `goToProgress()` — ✅ RESOLVED. Method and its dead `/my-progress` route both gone.
• `goToGroups()` — ✅ RESOLVED (method gone) / ⚠️ PARTIAL — the `/groups` *nav link*
  survives with still no `/groups` route, so "Groups" redirects to Home.

**🗺️ World Tour — Room 3 (Catalog) cleared — a QUIZ ❓**
The headline win: the audit's **#1 Critical bug (BUG 5)** — "Enroll Now lets you grab
a $895 course for FREE from the catalog" — is **✅ RESOLVED.** The old code had an
`enroll()` method wired to the button that called `enrollCourse()` directly. That
method is GONE; the button is now just `<a [routerLink]="['/courses', course.id]">`,
which only *navigates* to the detail page (where the real Get Course / payment flow
lives). The one-line lesson: **a link navigates, a click-handler acts** — a button
with only a `routerLink` can't change data, only move you.
My prediction was "yes, still enrolls free" + "label is honest" — both backwards. The
fix is invisible if you only read the button text: it still SAYS "Enroll Now" but no
longer enrolls. So the action was fixed but the *word* is stale (truthful label =
"View Course"). Reading the element type (`<a>` + `routerLink`, no `(click)`) tells
you the truth the label hides.
Other catalog audit items, verified vs live code (tagged in CLAUDE.md, Room 3):
• MISSING 6 (no price badge / type icon on cards) — ⚠️ STILL LIVE.
• MISSING 7 (no hover "View" overlay) — ⚠️ STILL LIVE.
• MISSING 8 (category filter is a `<select>` dropdown, not a sidebar; categories
  hardcoded in the component) — ⚠️ STILL LIVE.
• Signal smell: `filteredCourses` is an imperative signal re-set by `filterCourses()`
  from the constructor + 3 handlers, instead of a `computed()` — ⚠️ STILL LIVE.

**🗺️ World Tour — Room 4 (Course Player) cleared — a TOUR 🧭 (the heavy room)**
One file = two screens: a pre-enroll sales page and the post-enroll player (lesson
sidebar + content area + sticky Prev/Skip/Next bar). It's almost all `computed()`
signals — `courseComplete` flips itself to true the instant you finish the last
lesson and the 🏆 completion screen replaces the player with no manual trigger. The
sticky right button is one button with four computed labels (Skip → / Skip to End /
Next → / Finish).
The teaching bug (my prediction — got it right): the lesson body is drawn by an
`@if/@else-if` chain with only 5 branches and NO `@else`. The schema has 11 lesson
types, so `audio`, `assignment`, `web_content`, `scorm`, `survey` match nothing and
render an empty panel. Worse, `audio`/`web_content` are auto-complete, so clicking
Next marks them DONE — a learner earns credit for a lesson that showed nothing. In a
certification LMS that's a compliance hole, not a cosmetic one.
Audit items verified vs live code (tagged in CLAUDE.md, Room 4):
• BUG 13 (YouTube blocked by sanitizer) — ✅ RESOLVED via DomSanitizer + getSafeVideoUrl.
• BUG 14 (5 lesson types render nothing) — ⚠️ STILL LIVE (+ the auto-complete twist).
• BUG 15 (content page = placeholder) — ✅ RESOLVED, now renders real [innerHTML] body.
• BUG 16 (Finish/Skip-to-End dead on last lesson) — ⚠️ PARTIAL: works for auto-complete
  last lessons, still dead for a test/assignment last lesson (NACCC's actual case).
• Subscription leak at course-detail.ts:94 — ✅ RESOLVED via takeUntilDestroyed.
• navigateToExam() dead code — ⚠️ STILL LIVE. Cert-download alert() — ✅ RESOLVED but
  traded for a silent no-op (clicking Download does nothing yet; real PDF is Phase 7).
Pattern across Rooms 2–4: a "fix" often just relocates or half-solves. Read the live
code, not the label or the line number.

**🗺️ World Tour — Room 5 (Quiz Engine) cleared — a QUIZ ❓**
`exam.component` is a 4-state machine: locked (password gate) → pre-test card →
started (running, one question at a time, countdown) → finished (score + answer
review), each screen chosen by a signal. The teaching bug was the timer (BUG 17):
the display is `timerSeconds/60 | number:'2.0-0'`, and `'2.0-0'` ROUNDS. So at
5399 seconds it shows **90:59** instead of 89:59 — the clock briefly counts UP before
ticking down. Lesson: a clock must FLOOR its minutes (`Math.floor`), never round, or
it shows time you haven't reached. My prediction (89:59) was the *intended* value but
missed the rounding — the actual render is 90:59. A bug invisible in the code; you
only catch it by running the numbers.
Side find this room: the exam passwords are plain strings in course.service.ts
(exam2024, adv2024, finlit2024, legal2024, comm2024, credit2024) and the gate does a
plain-text `!==` compare — fine for the mock, flagged to become hashed auth in Phase 7.
Audit items verified vs live code (tagged in CLAUDE.md, Room 5):
• BUG 17 (timer rounds instead of floors) — ⚠️ STILL LIVE.
• NOTE 18 (retake alert stub) — ✅ RESOLVED → soft toast (real Stripe flow still later).
• Exam state not in signals (timerSeconds etc., accidental zone reactivity) — ⚠️ STILL LIVE.
• Plain-text exam password compare — ⚠️ STILL LIVE (mock-fine, Phase 7 must hash).

**🗺️ World Tour — Room 6 (Service Layer) cleared — a TOUR 🧭 (= your live homework)**
This room IS the Great Service Split. Status as of today: 2 of 4 kitchens carved off —
QuizService (37 lines, owns exam questions) and CertificateService (67 lines, owns
certs) are clean and out. CourseService (still 454 lines) is doing THREE jobs: course
data + enrollment data + lesson-progress localStorage. There's no enrollment.service.ts
yet, so EnrollmentService is genuinely the next step. The wrinkle (the standing
challenge — now answered): getUserCourses()/getAdminStats() need BOTH lists. Keep them
in CourseService and let it depend ONE-WAY on EnrollmentService; EnrollmentService must
never import CourseService, or you get a circular dependency (Angular's injector chokes,
one service comes back undefined). Arrows point one direction only.
Note Jayden raised: the circular dependency is NOT a current bug — EnrollmentService
doesn't exist yet, so there's nothing to be circular with. It's a trap to avoid during
the split, not a defect to fix now.
Jayden answered the challenge (after the room): (1) two kitchens updating each other is
never a good idea — circular dependency; (2) the enrollment kitchen should stay ignorant
of courses (correct direction). Spot on. Refinement noted: the precise failure is an
injector build-order loop (neither service can be constructed first → startup error or
undefined), which is distinct from the "two sources of truth" data-sync problem.
Audit items verified vs live code (tagged in CLAUDE.md, Room 6):
• CourseService 4-way split — ⚠️ PARTIAL (Quiz ✅ + Cert ✅ out; Enrollment still in).
• getQuestionsForLesson() hardcoded in CourseService — ✅ RESOLVED (now in QuizService).
• getMockCertificates() in CourseService — ✅ RESOLVED (now in CertificateService).
• updateProgress() in-place mutate-then-set — ⚠️ STILL LIVE (clean it during the split).

**🗺️ World Tour — Room 7 (Schema & Plan) cleared — the CAPSTONE 🏁 — TOUR COMPLETE**
The blueprint: 66 tables / 10 categories (People 9, Content 10, Assessments 12,
Progress 8, Certificates 5, Automations 2, Payments 6, Communication 9, System 4,
Integrations 1) in DATABASE_SCHEMA.md. Big picture: the whole app runs on MOCK data —
a finished front-of-house with a cardboard kitchen. Every room maps to tables that
don't exist yet; Phase 7 swaps cardboard for real Postgres, and BECAUSE of the service
boundary, only the service layer should have to change (that's why Room 6's split
matters). The 7 Worlds: 1A ✅ → 1B ⚔️ (here) → 2 → 3 → 4 → 5 → 6 → 7.
Capstone challenge (Jayden — strong answer): every string-ID model breaks when the DB
sends integer IDs; fix it NOW while it's ~13 lines, not at Phase 7 when it's a
cross-cutting timebomb. Added precision: the 13 declarations have a wide blast radius
(every service signature + comparison across ~13 files), and the failure is SILENT
because JS `'1' === 1` is false — a real integer id silently won't match a leftover
string id, no error thrown.
Audit item verified vs live code (tagged in CLAUDE.md, Room 7):
• Category 5 "ID types all wrong" (UI uses string, schema uses integer) — ⚠️ STILL LIVE.

**🏆 WORLD TOUR COMPLETE — all 7 rooms, +20 XP.** What the tour proved: the QA audit is
a snapshot in time, not current truth. Across 7 rooms we found fixes (video sanitizer,
content page, BUG 5 free-enroll, subscription leak, the alert stubs, 2 of 4 service
splits) AND stubborn survivors (5 unrendered lesson types, the timer round-vs-floor,
dead nav links, string IDs, no-op bell/messages). The meta-skill: read the LIVE code,
not the label, the line number, or the doc. Every CLAUDE.md tag this tour added is dated
+ room-stamped so the next person knows what was true on 2026-06-26.

---

## 🎯 ACTIVE CHALLENGE

🏆 **World Tour COMPLETE — no open tour challenges.** The next move is the build:
**run the EnrollmentService split** (the next step in The Great Service Split). Carry
two things from the tour into that prompt:
1. One-way dependency: CourseService may depend on EnrollmentService, NEVER the reverse.
2. Free cleanup to fold in: rewrite `updateProgress()`'s mutate-then-set with a clean
   immutable `.update()` when the code moves over.

After the split, the 1B quest line continues: CourseService cleanup → component
splitting (course-detail) → accessibility audit → admin panel rebuild.

---

*Last updated: 🏆 World Tour COMPLETE (all 7 rooms, 2026-06-26). Next: resume the
Phase 1B build with the EnrollmentService split whenever you're ready.*
