# Client Inputs Needed

Status: ⬜ pending · 🟨 partial · ✅ received

## Accounts & access (week 1)
- ⬜ Domain registrar / DNS access for globalmedtranscriptions.com
- ⬜ Current website admin access + list of important URLs (for redirects)
- ✅ Hosting: own hosting (Hostinger), not Vercel (client, 2026-09-30). The old Vercel project global-med-platform(-tljk).vercel.app is still live: client to delete it, or add noindex + a redirect to the live domain
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

## Client review 2026-09-25 (placeholders on the site until supplied)
- ⬜ AAPC partner logo as PNG (public/aapc-logo.png); the existing SVG is used until then. Written AAPC permission is still required (see Legal)
- ✅ Slider photos received 2026-09-26
- ✅ PSEB certificate (Z-25-8395/23) and HIPAA training certificate (HIPAATraining.us, HIPAA-0126590) received 2026-09-26
- ✅ Official favicon set and stacked logos received 2026-09-26 (public/images/brand/)
- ⬜ Official horizontal logo file (PNG or SVG). Until then the site uses a horizontal lockup made from the supplied stacked artwork (public/images/brand/globalmed-logo-horizontal.png)
- ✅ LCCI membership certificate (No. 94721 C, valid until 31 Mar 2027) received 2026-09-30 (image + PDF, public/images/credentials/lcci-certificate.*)
- ⬜ LCCI "Member since 04/06/2018": confirm this is 4 June 2018 (day/month), as the site shows the date exactly as printed
- ⬜ SECP certificate image and registration number
- ⬜ Name and details of the third credential
- ⬜ HIPAA: the certificate supplied is a staff training-completion certificate, not a company compliance assessment. The tile says "HIPAA Compliance Training Program completed". Confirm this wording, or supply a third-party HIPAA assessment if one exists
- ⬜ CPC®/CPB® exam details from AAPC: number of questions, duration, format, passing score (not shown on the site since 2026-09-26; only needed if the client wants them back)
- ✅ Course prices and packages confirmed 2026-09-26: CPC® USD 1,050 · CPB® USD 1,050 · CPC® + CPB® USD 1,800 over 16 weeks (updated by the client 2026-09-29; was USD 1,600 over 32 weeks) (data/courses.ts)
- ✅ "Package Includes" for CPC®, CPB® and CPC® + CPB® received 2026-09-30 (data/courses.ts); old "What's included" lists hidden by flag
- ⬜ [CLIENT TO CONFIRM] CPC® + CPB® AAPC membership length: the package now says one-year (the previous package said two-year)
- ⬜ [CLIENT TO CONFIRM] CPC® + CPB®: confirm each exam (CPC and CPB) has two attempts
- ✅ Replacement text received 2026-09-30 and shown ("Official AAPC certification exam with two attempts" / "Take the AAPC certification exam online, with two attempts included") for two "practice tests" mentions, now hidden (features.practiceTestsMentions): the band point "Official AAPC exams and practice tests" and the "How it works" exam-step caption "Your course includes AAPC's certification exam and practice tests."
- ⬜ AAPC's approval to use its course descriptions on the GlobalMed site (content/courses/*.ts)
- ⬜ Whether registration details are shared with AAPC (privacy policy paragraph; the form's consent already covers sharing)
- ⬜ Payment processing for AAPC course enrollments (added 2026-09-28; privacy policy paragraph marked [CLIENT TO CONFIRM]): who processes the payments (GlobalMed, a bank/payment provider, or AAPC directly), which payment details are kept and for how long, and whether they are shared with AAPC
- ⬜ Counsel review of the new Terms ("AAPC courses and certification") and Privacy (AAPC registrations) wording
- ⬜ Social profile links (Facebook, Instagram, LinkedIn, YouTube, X); icons stay hidden until provided
- ✅ Founder photo received 2026-09-30 (public/images/Founder/Riaz Picture.png, 1122×1402); shown in About "Our Story"
- ⬜ Instructor photos (optional, public/images/instructors/)

## Payments setup (Phase 5)
- ⬜ Stripe test + live keys (STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) and a webhook endpoint at /api/stripe/webhook subscribed to checkout.session.completed, .expired, .async_payment_succeeded, .async_payment_failed (STRIPE_WEBHOOK_SECRET)
