# Wording sweep — 2026-09-26 (step B)

Terms: onsite, on-site, in-person, classroom, campus, batch, pathways, corporate training,
"our instructors", "GlobalMed instructors", "our classes", "our curriculum",
"GlobalMed certificate", "verify certificate", "School of Billing and Coding".

## 1. Rendered pages (what visitors see)

Each page was fetched from the running app. Scripts and styles were stripped; visible text, `alt`, `title`, `aria-label`, `content` and `placeholder` were searched.

| Page | Hits | Decision |
|---|---|---|
| `/` | "Is the training online or in person?" (FAQ question) | Keep: client-approved FAQ wording; the answer is "Online only." |
| `/about`, `/about/team` | 0 | — |
| `/education/aapc-certification-pakistan` | same FAQ question | Keep (as above) |
| `/education/cpc` | same FAQ question; "the CPC is your pathway to recognition" | Keep: client-supplied course copy, used exactly; "pathway" is not GlobalMed's pathways |
| `/education/cpb`, `/education/cpc-cpb` | same FAQ question | Keep (as above) |
| `/faq` | same FAQ question | Keep (as above) |
| `/contact`, `/careers`, `/services`, `/services/medical-billing`, `/specialties` | 0 | — |
| `/blog`, `/blog/start-medical-coding-career-pakistan`, `/resources/guides` | 0 | — |
| `/legal/terms`, `/legal/privacy`, `/legal/hipaa-notice`, `/legal/cookie-policy` | 0 | — |
| `/free-billing-audit`, `/login` | 0 | — |
| `/llms.txt`, `/sitemap.xml` | 0 | — |
| Email templates (`lib/email/templates/*`) | 0 | — |

**Result:** no visible occurrence left to hide or reword.

## 2. Source hits that are hidden (kept intact, not shown)

| Where | Why it doesn't show |
|---|---|
| `app/(marketing)/school/{page,courses,pathways,batches,corporate-training,exam-prep}`, `app/(marketing)/verify/*`, `app/learn/*`, `app/(auth)/signup`, `app/(dashboard)/dashboard/{student,instructor}/*` | Routes redirect (config/hidden-routes.ts): verified 307 → `/education/aapc-certification-pakistan` (old CPC/CPB course URLs → `/education/cpc`, `/education/cpb`; admin courses → `/dashboard/admin`) |
| `app/(marketing)/page.tsx` batches section; `content/home.ts` `upcomingBatches`, `programs`, `certificationPath`, `faqs`, partnership stats | Behind `features.batches` / `trainingStats` / not rendered |
| `content/school.ts` (8 courses, 2 pathways, batches) | `visible: false` |
| `content/company.ts` "For students" FAQ group, instructor job | `visible: false` |
| `content/legal/terms.md`, `privacy.md`, `hipaa-notice.md` | `<!-- feature:… -->` blocks, removed while the flag is off |
| `content/legal/refund-policy.md` | `feature: onlineCheckout` frontmatter (page left out, route redirects) |
| `lib/site.ts` nav/footer links (pathways, batches, corporate training, verify, all courses) | `flag` on each link, filtered by `shown()` |
| `components/marketing/contact-form.tsx`, `lib/validation/leads.ts` "Corporate training" option | Option filtered while `features.corporateTraining` is off |
| `app/sitemap.ts`, `app/llms.txt/route.ts` | Entries behind flags |
| `lib/lms/*`, `components/lms/*`, `lib/validation/batch.ts`, `lib/content/*`, `lib/auth/*`, `components/motion/pathway-line.tsx`, `app/globals.css`, `config/*` | Internal code, class names and flag names; not visitor text |
| `lib/site.ts:13` "School of Billing and Coding" | Code comment only |

## 3. For decision

- `/styleguide` (design review for client sign-off P1-7) still shows the earlier education mockups ("Verify a certificate", pathways). It is not linked anywhere and is disallowed in robots.txt, but it is reachable by URL. Option: return 404 for it in production.
