# GlobalMed Transcriptions & Billing Solutions — Website + LMS Platform

**Client:** GlobalMed Transcriptions and Billing Solutions (globalmedtranscriptions.com)
**Delivered by:** SylJo Tech
**Build method:** Claude Code, driven by the files in this pack
**Contract value:** USD 80,000 (50% advance, 50% after full development)

## What we are building

One platform with two faces:

1. **Service company website.** Medical billing, medical coding, medical transcription and AI-powered clinical documentation, with lead capture for US healthcare practices.
2. **School of Billing and Coding.** A course platform (LMS) for medical billing and coding, with video lessons, rewatching, quizzes, exam preparation and verifiable certificates. It is positioned alongside GlobalMed's planned strategic partnership with AAPC.

Behind both faces sit dashboards for students, instructors and admins, plus an AI chatbot on the website and on WhatsApp.

## How to use this pack

1. Read `tools/TOOLING_SETUP.md` and install Claude Code, UI UX Pro Max, 21st.dev Magic MCP and the Supabase MCP.
2. Open the project folder in Claude Code. It reads `CLAUDE.md` automatically.
3. Paste the prompt from `MASTER_PROMPT.md` to start Phase 0.
4. Each session after that, run `/resume` (defined in `.claude/commands/resume.md`). Claude Code reads `pm/PROGRESS.md` and `pm/SESSION_LOG.md` and continues from the next open task.
5. At the end of every session, run `/checkpoint` so progress is saved before usage limits hit.

## File map

| File | Purpose |
|---|---|
| `CLAUDE.md` | Permanent rules Claude Code follows in every session |
| `MASTER_PROMPT.md` | The kickoff prompt plus per-phase prompts |
| `docs/01_PROJECT_BRIEF.md` | Client, goals, audiences, scope, commercials |
| `docs/02_PRD.md` | Every feature with acceptance criteria |
| `docs/03_SYSTEM_ARCHITECTURE.md` | Stack, diagrams, modules, data flow |
| `docs/04_DATABASE_SCHEMA.md` | Tables, relations, RLS policy plan |
| `docs/05_SITEMAP_AND_PAGES.md` | Every public page with its sections |
| `docs/06_DESIGN_SYSTEM.md` | Visual direction, tokens, component rules |
| `docs/07_DASHBOARDS.md` | Student, instructor, admin and sales dashboards |
| `docs/08_LMS_AND_CERTIFICATION.md` | Courses, video, quizzes, exams, certificates |
| `docs/09_AI_CHATBOT_WHATSAPP.md` | Chatbot, knowledge base, WhatsApp integration |
| `docs/10_API_AND_INTEGRATIONS.md` | Route handlers, webhooks, third-party services |
| `docs/11_SECURITY_AND_COMPLIANCE.md` | HIPAA boundary, auth, RLS, OWASP checklist |
| `docs/12_SEO_AND_MARKETING.md` | SEO, AEO/GEO, tracking, campaign landing pages |
| `docs/13_TESTING_QA.md` | Test strategy and release checklist |
| `docs/14_DEPLOYMENT_DEVOPS.md` | Environments, CI/CD, backups, monitoring |
| `docs/15_MOTION_DESIGN.md` | Motion graphics, animation tokens, performance and accessibility rules |
| `pm/PROJECT_PLAN.md` | Phases, milestones, timeline, payment gates |
| `pm/PROGRESS.md` | Live progress tracker (single source of truth) |
| `pm/TASKS.md` | Full task backlog by phase |
| `pm/SESSION_LOG.md` | One entry per Claude Code session |
| `pm/DECISIONS.md` | Architecture decision records |
| `pm/RISKS.md` | Risk register |
| `pm/CLIENT_INPUTS_NEEDED.md` | Everything we need from the client |
| `pm/CHANGELOG.md` | Release notes |
| `tools/TOOLING_SETUP.md` | Install guide for every tool, MCP and skill |
| `design-system/MASTER.md` | Locked design system (generated in Phase 1) |
| `supabase/migrations/0001_init.sql` | Initial database schema |
| `.env.example` | All environment variables |

© SylJo Tech 2026
