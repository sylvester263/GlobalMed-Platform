# Client Inputs Needed

Status: ⬜ pending · 🟨 partial · ✅ received

## Accounts & access (week 1)
- ⬜ Domain registrar / DNS access for globalmedtranscriptions.com
- ⬜ Current website admin access + list of important URLs (for redirects)
- ⬜ Vercel team (invite SylJo Tech)
- ⬜ Supabase organisation (invite SylJo Tech)
- ⬜ Bunny.net account + Stream library per environment (library ID, API key, CDN hostname, token-auth key; webhook set up per docs/17 §2)
- ⬜ Stripe account (business verification started)
- ⬜ Bank / JazzCash / Easypaisa details for manual payments
- ⬜ Resend account + sending domain decision
- ⬜ Meta Business Manager + WhatsApp Business number (also enables the site's click-to-chat buttons: NEXT_PUBLIC_WHATSAPP_NUMBER)
- ⬜ Cloudflare Turnstile keys and Upstash Redis (public forms stay closed without them)
- ⬜ Resend newsletter segment + sales inbox for lead notifications (RESEND_SEGMENT_ID, ADMIN_NOTIFY_EMAIL)
- ⬜ LLM provider choice + API key with billing enabled
- ⬜ Google Analytics / Search Console / GTM access
- ⬜ Google Cloud OAuth client for "Sign in with Google" (docs/16 §3)
- ⬜ Email of the first admin (owner) account (docs/16 §6)
- ⬜ GitHub repository (client-owned, SylJo Tech as maintainer) so the code can be pushed and CI can run
- ⬜ Sentry organisation/project (or approval to use SylJo Tech's) → SENTRY_DSN, NEXT_PUBLIC_SENTRY_DSN

## Brand
- ✅ Logo supplied (logonew.png → public/logo.png, 2026-09-24); an SVG version is still welcome for print and certificates
- ⬜ Education brand name confirmation: "GlobalMed School of Billing and Coding"
- ⬜ Team and office photos
- ⬜ AAPC written permission + partner logo usage guidelines. **Now urgent:** the home page presents GlobalMed as AAPC's strategic partner and shows the AAPC logo (public/aapc-logo.svg, supplied 2026-09-24)
- ⬜ CPC® and CPB® program details: duration, fees/installments, batch dates, modes, seats, exam-fee inclusion, AAPC exam registration support, career-support claims, partnership proof-point numbers (home page + content/school.ts)

- ⬜ Design sign-off: review /styleguide and the key screens (/styleguide/screens/home, course, student, admin) — P1-7
- ⬜ Approval of motion storyboards (hero, claim journey, pathway, exam-passed moment) — design-system/motion-storyboards/ — P1-10
- ✅ Placeholder "GM" wordmark replaced with the supplied logo everywhere
- ⬜ Real stats for animated counters (or approval to label them illustrative)

## Content
- ⬜ Final list of services offered (incl. credentialing? denial management? specialties?)
- ⬜ Company facts: founding year, claims processed, clean-claim %, clients served, students trained
- ⬜ Testimonials (practices and students) with permission — the home page section stays hidden until provided
- ⬜ Practice client logos with permission (MG-12 marquee)
- ⬜ Content review of all pages: 55 [CLIENT TO CONFIRM] markers (P2-14) — contact details, services list, course list/prices, team, batches, results figures
- ⬜ Course list: titles, outlines, level, duration, prices (USD + PKR), access period
- ⬜ Lesson videos + resources for launch courses (minimum 3)
- ⬜ Question banks per course (Aiken or CSV)
- ⬜ Certificate signatory name/title + signature image
- ⬜ Batch schedule (if live classes)
- ⬜ FAQs, refund policy terms, business hours (US + PK), contact details
- ⬜ Privacy policy / HIPAA notice review by compliance contact

## Decisions
- ⬜ Point of contact + approver
- ⬜ Course access default (lifetime or N months)
- ⬜ Completion rule default (pass % for final exam)
- ⬜ Allow AI crawlers in robots.txt? (yes/no)
- ⬜ Post-launch support/maintenance terms
