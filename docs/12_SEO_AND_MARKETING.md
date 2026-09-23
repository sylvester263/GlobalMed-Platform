# 12 — SEO, AEO/GEO and Marketing

## 1. Technical SEO
- `generateMetadata` on every route: unique title (≤ 60 chars), description (≤ 155), canonical, Open Graph, Twitter card.
- `app/sitemap.ts` (pages, services, specialties, courses, posts) and `app/robots.ts`.
- JSON-LD: Organization, LocalBusiness/ProfessionalService, Service, Course, FAQPage, Article, BreadcrumbList, EducationalOrganization.
- Images via next/image, AVIF/WebP, explicit sizes; fonts via next/font.
- 301 redirect map from old site URLs *(client to supply current URL list / we crawl it)*.
- Core Web Vitals budget as in PRD.

## 2. AEO / GEO (AI search visibility)
- Question-led H2s with a direct 40–60 word answer under each.
- `/llms.txt` summarising services, courses, contact.
- Allow reputable AI crawlers in robots.txt (client decision).
- Consistent NAP (name, address, phone) across site and directories.

## 3. Keyword clusters (starting set, to validate)
- Services (US): medical billing services, medical billing company for small practices, outsourced medical coding, RCM services, denial management services, [specialty] billing services
- School: medical billing and coding course online, medical coding course in Pakistan, CPC exam preparation, ICD-10-CM training, medical billing course Lahore/Karachi

## 4. Tracking
GTM container → GA4 events: `lead_submit`, `audit_request`, `chat_open`, `chat_lead`, `whatsapp_click`, `course_view`, `begin_checkout`, `purchase`, `lesson_complete`, `certificate_issued`. Meta Pixel standard events Lead / InitiateCheckout / Purchase. UTM parameters stored on leads and orders. Consent mode respected.

## 5. Launch campaign assets
- `/lp/free-billing-audit` (US practices, Google Ads + LinkedIn)
- `/lp/medical-coding-course` (students, Meta Ads + WhatsApp)
- `/lp/cpc-exam-prep`
Each LP: single goal, no main nav, social proof, form or enroll CTA, thank-you page with conversion event.
