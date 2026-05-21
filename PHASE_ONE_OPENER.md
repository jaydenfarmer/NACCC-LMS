I am building a custom LMS for NACCC (National Association of Credit Counseling) using Angular 20, standalone components, and Angular Signals. There is no backend yet — that is Phase 7. This is the Phase 1 working chat.
Read these files before doing anything:

CLAUDE.md in the root directory
DATABASE_SCHEMA.md in the root directory

Current project state:

ESLint and Prettier are configured and clean
The project is a UI prototype with mock data — nothing persists
All mock data lives in service files

What actually works:

Login page and role switching
Sidebar and header navigation
Course catalog with filtering
Course detail page (module/lesson tree)
Quiz/exam engine (timer, auto-grading)
Dashboard with Chart.js bar chart
Admin panel form

What is mock or incomplete:

All course data is hardcoded in services — no backend
Progress tracking resets on refresh — in-memory signals only
Assignments have a data model but no submission UI
Certificates are a TypeScript interface only — nothing visible
Notifications and messages are icon badges with no real data
Several sidebar links route to pages that do not exist yet

Phase 1 goals in order:

Identify every sidebar link that routes to a missing page and build those pages
Replace all hardcoded data with a proper service layer
Persist progress to localStorage temporarily until real backend exists in Phase 7
Build assignment submission UI
Wire notifications to real data
Wire messages to real data

Rules for every task in this chat:

One file at a time
One task at a time
Write tests before writing feature code
Run ng lint after every change — it must stay clean
Commit after every successful task
Never touch backend or database setup — that is Phase 7
Never install new packages without flagging it first
Never rename or move existing files without flagging it first
Never refactor working code unless explicitly asked
Feature-based folder structure — /features/quizzes, /features/assignments etc.
TypeScript strict types on everything — no any types

Start by running the app and telling me every sidebar link that currently routes to a missing or empty page.
