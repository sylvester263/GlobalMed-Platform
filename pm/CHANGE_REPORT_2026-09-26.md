# Change report — 2026-09-26

The GlobalMed site now presents GlobalMed Transcriptions as a medical transcription, billing and coding **services** company, and as **AAPC's Strategic Partner in Pakistan** for the CPC® and CPB® courses.

- **Who teaches and certifies:** AAPC faculty teach AAPC's online courses, and AAPC awards the certification.
- **What GlobalMed does:** registers students and supports them through enrollment.
- **GlobalMed's own education:** hidden behind feature flags. Nothing was deleted.

Commits: `992cca8`, `c2a1f11`, `6669368`, `97f6afc`, `cc95e9a`, `2428f2c` (plus this report). Decisions are recorded in ADR-024 (Education rename) and ADR-026 (partner-only model).

---

## 1. Hidden (item + flag)

All flags live in `config/features.ts` and are set to `false`. Each carries the comment "Hidden at client request — GlobalMed education plans are future scope."

- **Redirects:** `config/hidden-routes.ts` turns each flag into a temporary (307) redirect to `/education/aapc-certification-pakistan`, covering both the `/education/…` and old `/school/…` prefixes.
- **Filtering:** nav, footer, sitemap, `llms.txt`, dashboards and legal pages drop the hidden items.

| Hidden item | Flag / mechanism | Where it went |
|---|---|---|
| GlobalMed course catalog, 8 GlobalMed courses, catalog filters/search | `globalmedCourses`; `visible: false` on each course in `content/school.ts` | `/education/courses[/*]` → AAPC page; old `/education/courses/cpc-certified-professional-coder` → `/education/cpc`, `…/cpb-certified-professional-biller` → `/education/cpb` |
| Education landing page (GlobalMed school) and its menu promo panel | `educationLanding` | `/education`, `/school` → AAPC page |
| Certification pathways (2) | `pathways`; `visible: false` | `/education/pathways[/*]` → AAPC page |
| Upcoming batches page, home batch cards, batch data | `batches`; `visible: false` | `/education/batches` → AAPC page |
| Corporate training page, "Corporate training" contact option | `corporateTraining` | `/education/corporate-training` → AAPC page |
| GlobalMed exam-prep page | `examPrep` | `/education/exam-prep` → AAPC page |
| Onsite / Lahore-class training ("CPC & CPB Training" menu link, onsite wording) | `onsiteTraining` | Link filtered out |
| Training figures (students trained, batches, instructors) | `trainingStats` | Not rendered (home strip, company stats) |
| Course player, student learning dashboard, quizzes/mock exams, student sign-up | `learningPlatform` | `/learn/*`, `/dashboard/student/*`, `/signup` → AAPC page; student area removed from the area switcher |
| Admin LMS sections: Courses, Enrollments | `learningPlatform` | Sidebar items hidden; `/dashboard/admin/courses` → `/dashboard/admin` |
| Instructor dashboard (course builder, Q&A, students, live batches) | `instructorDashboard` | `/dashboard/instructor/*` → AAPC page |
| GlobalMed certificates, public "Verify a Certificate" page and links; admin Certificates section | `certificates` | `/verify`, `/verify/*` → AAPC page |
| Online course checkout/cart (Stripe), student orders, refund policy page; admin Orders and Coupons | `onlineCheckout`; refund policy frontmatter `feature: onlineCheckout`; server action refuses | `/dashboard/student/checkout/*`, `/dashboard/student/orders*`, `/legal/refund-policy` → AAPC page |
| "Exam passed" celebration (DM-6, not built) | `examPassedCelebration` | — |
| EducationalOrganization / Course-provider JSON-LD | `educationSchema` | Not rendered; Organization/ProfessionalService remains |
| Public "Log in" (header, mobile menu) and footer "Member Login" | `publicLogin` | Links hidden; `/login` stays reachable for Admin and Sales staff |
| Instructor job, "Teaching what we practise" value, "For students" FAQ group (GlobalMed certificates) | `visible: false` in `content/company.ts` | Not rendered |
| Education-specific legal paragraphs (accounts, course access, certificates, exam prep, payments, learning data, verification, course materials) | `<!-- feature:learningPlatform -->` / `certificates` blocks in `content/legal/*.md` | Removed from the rendered page; text kept in the file |
| SECP and third credential tiles | `hidden: true` in `data/credentials.ts` | Not rendered |

## 2. Changed text (page, before → after)

| Page / place | Before | After |
|---|---|---|
| Education menu | AAPC Certification · CPC & CPB Training · All courses · Pathways · Exam preparation · Upcoming batches · Corporate training | AAPC Certification in Pakistan · CPC® — Certified Professional Coder · CPB® — Certified Professional Biller · CPC® + CPB® Dual Certifications |
| Footer, Education column | CPC®/CPB® Training → old course pages; All Courses; Upcoming Batches | CPC® Training → `/education/cpc`; CPB® Training → `/education/cpb`; CPC® + CPB® Dual Certifications |
| Footer pricing card | "CPC® and CPB® Certification: USD 1,050 [CLIENT TO CONFIRM…]" · Enroll Now | CPC® USD 1,050 · CPB® USD 1,050 · CPC® + CPB® Dual USD 1,600, save USD 500 · Register Now |
| Home: partnership strip | "GlobalMed Transcriptions × AAPC: bringing … certification training to Pakistan" + training stats | "GlobalMed Transcriptions, Strategic Partner of AAPC in Pakistan for Medical Billing and Coding." + the role line |
| Home: programs | 2 program cards: "Live classes (onsite in Lahore or online), recorded lessons and timed mock exams" | 3 AAPC course cards (dual in the middle, "Best value: two certifications"), training line + certification line |
| Home: "Why train with GlobalMed" | Learn from working coders · AAPC-aligned curriculum · Mock exams and recorded lessons · Career support | "Why register through GlobalMed": Taught by AAPC faculty · Official AAPC exams and practice tests · AAPC membership included · Registration support in Pakistan |
| Home and AAPC page: "How it works" | Enroll (onsite in Lahore or online) → Learn → Practice & mock exams → Sit the AAPC exam → Get certified → Career support | Register with GlobalMed → Get enrolled in AAPC's online course → Learn live online with AAPC faculty → Take the AAPC certification exam → Earn your AAPC credential |
| Home, AAPC page, course pages: FAQ | 8 questions incl. "Is the course online or in Lahore? Both…", "Will I get a certificate from GlobalMed? Yes…" | The client's 10 FAQs (who teaches, online only, AAPC awards, what GlobalMed does, which course, cost from course data, background, CPC exam voucher, maintaining, how to register) |
| Home CTA band | "…training onsite in Lahore and online…" · Enroll in CPC Training | Training line + certification line · Register Now |
| "Get Trained by AAPC Instructors" band | "Learn … from AAPC instructors through GlobalMed…"; points: Live & recorded classes · Exam-focused preparation · Career guidance | "Get trained by AAPC instructors: live, instructor-led online courses led by AAPC faculty."; points: Live online classes with AAPC faculty · Official AAPC exams and practice tests · AAPC membership included |
| AAPC Certification page | CPC®/CPB® panels with GlobalMed training, exam details placeholder, single USD 1,050 price card, onsite FAQ | Hero with the approved wording; 3 course cards (dual in the middle); comparison table (duration, format, membership, exams, practice tests, Practicode, Codify, Denials guide, 1/2 off prerequisite, price); How it works; 10 FAQs; "Register for AAPC Training" form |
| New pages `/education/cpc`, `/cpb`, `/cpc-cpb` | — | Full course pages with the client's copy (content/courses/*.ts) |
| About: Strategic Partnership | "…AAPC's strategic partner in Pakistan for medical billing and coding training, preparing students…" | Partnership line + role, training and certification lines |
| FAQ page | "For students" group (GlobalMed certificates, rewatching lessons, paying in PKR) | "AAPC courses (CPC® and CPB®)" group (the 10 FAQs) |
| Careers | "…medical coder, AR specialist or instructor…"; "We hire coders, billers and instructors…" | "…medical coder, transcriptionist or AR specialist…"; "We hire coders, billers, transcriptionists and editors." |
| Contact | "…or about our courses?" | "…or about AAPC's CPC® and CPB® courses?" |
| Team (meta) / founder bio | "…and GlobalMed Education" / "services and education strategy" | "…and the AAPC partnership in Pakistan" / "services and its AAPC partnership in Pakistan" |
| Login (staff) | "Student accounts open soon…" + "New here? Create an account" | "Sign-in is for GlobalMed staff…"; no sign-up link |
| Blog: "How to start a medical coding career from Pakistan" | "Is a GlobalMed certificate the same as the CPC?…" + links to GlobalMed pathway/course | "How do I get CPC® certified from Pakistan?" (AAPC awards; AAPC faculty teach; GlobalMed registers) + links to the AAPC pages |
| Terms / Privacy | GlobalMed Education accounts, courses, certificates, payments | New "AAPC courses and certification" section; AAPC registration data disclosed in Privacy (marked for counsel) |
| Metadata / JSON-LD | Home: "…certification training in Lahore and online"; Organization had an EducationalOrganization department | Home: "Medical transcription, billing and coding services since 2007, and AAPC's Strategic Partner in Pakistan for CPC® and CPB® online courses."; no EducationalOrganization; each course page has Course JSON-LD (provider AAPC, USD offer) |
| `llms.txt`, sitemap | GlobalMed courses, pathways, batches, verify | AAPC section, the 3 course pages and prices; hidden routes removed |
| Registration (replaces checkout) | Stripe checkout per course | "Register for AAPC Training" form: name, email, WhatsApp, city, course (price shown), background, contact time, message, required consent → lead `aapc_registration`, email to info@ |
| Dashboards | Sales "Leads pipeline" placeholder; admin shows enrollments/payments | Sales Leads pipeline page (filter by source/status, AAPC registration details); Admin shows AAPC registrations (30 days) and the latest five |

## 3. Files changed

Changes since `64eaee8`. Everything was changed in place; nothing was deleted.

- **Added:**
  - **Config:** `config/features.ts`, `config/hidden-routes.ts`
  - **Data and content:** `data/courses.ts`, `content/courses/{types,index,cpc,cpb,cpc-cpb}.ts`
  - **Components:** `components/marketing/{aapc-course,aapc-registration-form,course-covers-tabs}.tsx`
  - **Pages:** `app/(marketing)/school/{cpc,cpb,cpc-cpb}/page.tsx`, `app/(dashboard)/dashboard/sales/leads/page.tsx`
  - **Libraries:** `lib/content/feature-blocks.ts`, `lib/leads/labels.ts`
  - **Assets:** `public/images/brand/globalmed-logo-horizontal.png`
  - **Project notes:** `pm/WORDING_SWEEP_2026-09-26.md`, `pm/screenshots/*`, this report
- **Modified:**
  - **Auth and dashboards:** `app/(auth)/login/page.tsx`; `app/(dashboard)/dashboard/{admin,sales}/page.tsx`
  - **Marketing pages:** `app/(marketing)/{page,about/page,about/team/page,careers/page,contact/page,faq/page,school/aapc-certification-pakistan/page}.tsx`
  - **App-level files:** `app/globals.css`, `app/llms.txt/route.ts`, `app/opengraph-image.tsx`, `app/sitemap.ts`, `next.config.ts`
  - **Components:** `components/auth/auth-card.tsx`; `components/dashboard/{area-shell,section-placeholder}.tsx`; `components/marketing/{aapc-instructors-band,certification-price-card,contact-form,home/claim-journey,mobile-nav,site-footer,site-header,wordmark}.tsx`
  - **Content:** `content/{aapc,company,home,school}.ts`; `content/blog/start-medical-coding-career-pakistan.md`; `content/legal/{hipaa-notice,privacy,refund-policy,terms}.md`
  - **Libraries:** `lib/auth/roles.ts`; `lib/content/{index,markdown,schema}.ts`; `lib/leads/{actions,store}.ts`; `lib/payments/checkout-actions.ts`; `lib/seo/json-ld.tsx`; `lib/site.ts`; `lib/validation/leads.ts`
  - **Tests:** `tests/e2e/{auth,public-site,visual-audit}.spec.ts`; `tests/unit/{auth,content-integrity}.test.ts`
  - **Project notes:** `pm/{CLIENT_INPUTS_NEEDED,DECISIONS,PROGRESS,SESSION_LOG}.md`

## 4. Test results

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | Pass |
| ESLint (`--max-warnings=0`) | Pass |
| Unit tests (Vitest) | 107 passed |
| Production build (`next build`) | Pass |
| E2E (Playwright, against `next start`) | 146 passed, 53 skipped (tests for hidden pages, skipped by flag), 0 failed |
| Axe (serious/critical) on every visible page | Pass (after fixing footer contrast) |
| Browser check at 360/768/1280, with and without reduced motion | 138 checks, all pass: status 200, no horizontal scroll, one h1 per page, `/education` redirect, no public login links, footer prices, registration form (preselected course, price shown/updates, validation, consent unchecked by default), no page errors |
| "How it works" (home and AAPC page) | Stays visible scrolling down and back up slowly and quickly, after a reload below the section, and after navigating away and back: all 6 viewport/motion combinations pass |
| Hidden routes | All redirect (307) as listed in section 1 |
| Wording sweep | No visible occurrence left; see `pm/WORDING_SWEEP_2026-09-26.md` |

Screenshots (360 and 1280px, full page) are in `pm/screenshots/`. Detailed results are in `pm/screenshots/browser-check-results.txt`.

## 5. Open client inputs

- Whether registration details are shared with AAPC (privacy policy paragraph stays [CLIENT TO CONFIRM]).
- AAPC's approval to use its course descriptions on the GlobalMed site.
- New legal wording in Terms and Privacy to be reviewed by counsel.
- SECP certificate and number; the third credential (both hidden until supplied).
- Official horizontal logo file (the site uses a lockup made from the supplied stacked artwork).
- Slider/instructor/founder photos where placeholders remain; social profile links.
- AAPC written permission for the partnership claim and logo (still open from earlier).
- Accounts needed to go live: Vercel team invite (no production deployment exists yet), Supabase, Resend, Turnstile and Upstash (the registration form fails closed until these are set).
