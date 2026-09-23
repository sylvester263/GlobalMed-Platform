# 05 — Sitemap and Pages

Structure is inspired by aapc.com's information architecture (clear split between learning, certification, resources and membership-style account area). Branding, copy and visuals are GlobalMed's own.

## Primary navigation
`Services ▾` · `School ▾` · `Specialties` · `Resources ▾` · `About` · `Contact` · [Log in] [Free billing audit]

- Services: Medical Billing · Medical Coding · Medical Transcription · AI Clinical Documentation · Revenue Cycle Management · Denial Management · Credentialing *(confirm)*
- School: All courses · Certification pathways · Exam preparation · Upcoming batches · Corporate training · AAPC partnership *(after permission)*
- Resources: Blog · Guides & downloads · FAQ · Verify a certificate

## Sitemap
```
/
/services
/services/medical-billing
/services/medical-coding
/services/medical-transcription
/services/ai-clinical-documentation
/services/revenue-cycle-management
/services/denial-management
/specialties
/specialties/[slug]
/free-billing-audit
/school
/school/courses
/school/courses/[slug]
/school/pathways
/school/pathways/[slug]
/school/exam-prep
/school/batches
/school/corporate-training
/school/aapc-partnership
/blog
/blog/[slug]
/blog/category/[slug]
/resources/guides
/faq
/verify
/verify/[code]
/about
/about/team
/careers
/contact
/legal/privacy
/legal/terms
/legal/refund-policy
/legal/hipaa-notice
/login /signup /reset-password
/learn/[courseSlug]/[lessonId]
/dashboard/student/...
/dashboard/instructor/...
/dashboard/admin/...
/dashboard/sales/...
/lp/[slug]            # campaign landing pages
```

## Page specs (sections in order)

**Home `/`**
1. Hero: one line that covers both sides (e.g. "Clean claims for your practice. Career-ready skills for your future.") with two CTAs: Free billing audit / Explore courses
2. Trust strip: years in business, claims processed, clean-claim rate, students trained *[CLIENT TO CONFIRM numbers]*
3. Services overview (billing, coding, transcription, AI documentation)
4. How we work with practices (real sequence: audit → onboarding → monthly reporting)
5. School of Billing and Coding intro + 3 featured courses
6. Certification pathway preview
7. Testimonials (practices and students, separated)
8. AAPC partnership block *(after permission)*
9. Latest articles
10. FAQ
11. Final CTA band + footer

**Service page template** — Hero (problem stated in practice-owner language) · What's included · Process · Results/metrics · Specialties served · Compliance & HIPAA note · FAQ (JSON-LD FAQPage) · CTA to audit form

**Free billing audit** — short explainer · form (practice name, specialty, monthly claim volume range, current billing setup, name, role, email, phone, best time) · what happens next · privacy note "Do not include patient information"

**School landing** — Hero · who it's for (career-changers / working coders / employers) · pathways · featured courses · how learning works (video, rewatch, quizzes, mock exams, certificate) · instructor highlights · student outcomes · pricing/bundles · FAQ · CTA

**Course detail** — title, rating, level, duration, lessons count · price (USD/PKR by geo) + Enroll · what you'll learn · curriculum accordion with preview lessons · requirements · instructor · reviews · certificate sample · FAQ · related courses · sticky enroll bar on mobile

**Pathway page** — steps as a visual path with the courses at each step, total price vs bundle price, career outcomes

**Verify** — code input + QR scan hint → result card (valid/revoked/not found)

**Contact** — form, WhatsApp, phone, email, office address, map, hours (EST + PKT)

**Footer** — service links, school links, resources, contact, social, newsletter, legal, "Designed & developed by SylJo Tech"
