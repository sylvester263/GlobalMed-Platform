# MASTER PROMPT — paste into Claude Code

## A. Kickoff prompt (first session only)

```
You are building the GlobalMed Transcriptions & Billing Solutions platform for SylJo Tech.

Read these files in order before writing any code:
1. CLAUDE.md
2. docs/01_PROJECT_BRIEF.md
3. docs/02_PRD.md
4. docs/03_SYSTEM_ARCHITECTURE.md
5. pm/PROJECT_PLAN.md
6. pm/PROGRESS.md

Then execute Phase 0 (Foundation) from pm/TASKS.md:
- Scaffold Next.js 15 + TypeScript strict + Tailwind v4 + shadcn/ui in this folder.
- Set up ESLint, Prettier, Husky + lint-staged, Conventional Commits.
- Create the folder structure defined in docs/03_SYSTEM_ARCHITECTURE.md section 5.
- Link the Supabase project via the Supabase MCP, apply supabase/migrations/0001_init.sql, generate types to lib/db/types.ts.
- Configure Supabase SSR auth helpers (server, client, middleware).
- Create .env.local from .env.example (leave values empty where I have not supplied them and list them for me).
- Deploy an empty shell to Vercel preview.

Rules:
- Work task by task. After each task, tick it in pm/PROGRESS.md.
- If a task needs something from me or the client, add it to pm/CLIENT_INPUTS_NEEDED.md and move to the next unblocked task.
- At the end, write the session entry in pm/SESSION_LOG.md and commit.
```

## B. Phase prompts (use one per session, or run `/resume`)

**Phase 1 — Design system**
```
Run Phase 1 from pm/TASKS.md. Use the ui-ux-pro-max skill to generate a design system for: healthcare revenue-cycle services company + professional certification school, audience = US physician practices and career-changers in Pakistan/US, tone = trustworthy, clinical-precise, career-hopeful. Reconcile its output with docs/06_DESIGN_SYSTEM.md, write the result to design-system/MASTER.md, then implement tokens in app/globals.css and build the base component set listed in docs/06 section 6 using 21st.dev Magic with the locked tokens injected. Build a /styleguide page showing every component and state.
Then read docs/15_MOTION_DESIGN.md: add the motion tokens to design-system/MASTER.md, create lib/motion.ts, build the components/motion/ primitives (ClaimLine, CountUp, Reveal, StaggerGroup, PathwayLine, SealStamp, PageTransition, LottiePlayer) and add a Motion section to /styleguide with a reduced-motion toggle.
```

**Phase 2 — Public website**
```
Run Phase 2 from pm/TASKS.md. Build every page in docs/05_SITEMAP_AND_PAGES.md using design-system/MASTER.md. Content comes from content/*.md; if copy is missing, write clear placeholder copy marked [CLIENT TO CONFIRM]. Implement SEO requirements from docs/12 for each page as you build it. Implement the website motion graphics MG-1 to MG-18 from docs/15 using /motion, lazy-loading GSAP and Lottie. Where a Lottie asset isn't delivered yet, use the static poster and log it in pm/CLIENT_INPUTS_NEEDED.md.
```

**Phase 3 — Auth, roles, dashboards shell**
```
Run Phase 3 from pm/TASKS.md following docs/07_DASHBOARDS.md and docs/11 section 3, applying dashboard motion DM-1, DM-9 and DM-10 from docs/15.
```

**Phase 4 — LMS core**
```
Run Phase 4 from pm/TASKS.md following docs/08_LMS_AND_CERTIFICATION.md sections 1–4.
```

**Phase 5 — Payments & enrollment**
```
Run Phase 5 from pm/TASKS.md following docs/10_API_AND_INTEGRATIONS.md section 3.
```

**Phase 6 — Exams & certificates**
```
Run Phase 6 from pm/TASKS.md following docs/08 sections 5–7, including the exam-passed moment DM-6 and quiz feedback DM-4 from docs/15.
```

**Phase 7 — AI chatbot + WhatsApp**
```
Run Phase 7 from pm/TASKS.md following docs/09_AI_CHATBOT_WHATSAPP.md.
```

**Phase 8 — CRM, marketing, analytics**
```
Run Phase 8 from pm/TASKS.md following docs/07 section 5 and docs/12.
```

**Phase 9 — QA, hardening, launch**
```
Run Phase 9 from pm/TASKS.md following docs/13_TESTING_QA.md and docs/14_DEPLOYMENT_DEVOPS.md. Produce a launch report in pm/LAUNCH_REPORT.md.
```

## C. Recovery prompt (when a session was cut off)
```
The last session was interrupted. Read pm/PROGRESS.md, the last entry in pm/SESSION_LOG.md, and run `git status` and `git log -5`. Tell me in 5 lines what was finished, what is half-done, and then finish the half-done task before starting anything new.
```
