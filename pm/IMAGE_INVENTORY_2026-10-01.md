# Image inventory (2026-10-01)

Every file in `public/images/` (scanned 2026-10-01), what it shows, where it is used, and the proposed slot for anything not shown on a page. "Source" = the client's original, kept untouched; the page uses the web version made from it (`scripts/optimize-images.mjs`). Live check: all images return 200 (AVIF) from the hosting.

**Finding:** every uploaded photo was already placed except the five social-share photos in `og/`, which were only used as share-card backgrounds (never visible on a page), and `backgrounds/course-cpc.jpg`, a duplicate of the CPC® hero. Four of the share photos now also serve as page heroes; one is waiting for your choice.

| File | Size | What it shows | Current use | Proposed slot |
|---|---|---|---|---|
| Founder/Riaz Picture.png | 1122x1402 | Riaz Naveed, portrait (client original) | Source of about/riaz-naveed-*.webp | — |
| about/riaz-naveed-400.webp | 400x500 | Riaz Naveed, 4:5 small | About › Leadership card (card hidden by flag) | — |
| about/riaz-naveed-800.webp | 800x1000 | Riaz Naveed, 4:5 | About › Our Story | — |
| backgrounds/course-cpc.jpg | 2816x1536 | Byte-identical copy of heroes/course-cpc.jpg | NOT USED | None: duplicate of the CPC® hero, already used |
| backgrounds/home-aapc-band.jpg | 3168x1344 | Woman in navy hijab on a video call, evening | Source | — |
| backgrounds/home-aapc-band.webp | 2560x1086 | (web version) | Home › Get Trained by AAPC Instructors band background | — |
| badges/app-store-badge.svg | 120x40 | App Store badge | Footer | — |
| badges/google-play-badge.png | 564x168 | Google Play badge | Footer | — |
| blog/clean-claim-rate.jpg | 2816x1536 | Client original | Source | — |
| blog/clean-claim-rate.webp | 1920x1080 | 16:9 web version | Blog post cover + blog card (clean-claim-rate) | — |
| blog/modifier-25-explained.jpg | 2816x1536 | Client original | Source | — |
| blog/modifier-25-explained.webp | 1920x1080 | 16:9 web version | Blog post cover + blog card (modifier-25-explained) | — |
| blog/start-medical-coding-career-pakistan.jpg | 2816x1536 | Client original | Source | — |
| blog/start-medical-coding-career-pakistan.webp | 1920x1080 | 16:9 web version | Blog post cover + blog card (start-medical-coding-career-pakistan) | — |
| blog/why-claims-get-denied.jpg | 2816x1536 | Client original | Source | — |
| blog/why-claims-get-denied.webp | 1920x1080 | 16:9 web version | Blog post cover + blog card (why-claims-get-denied) | — |
| brand/favicon-180.png | 180x180 | Favicon set (client) | Not linked (the app uses app/icon.png and app/apple-icon.png) | — |
| brand/favicon-192.png | 192x192 | Favicon set (client) | Not linked (the app uses app/icon.png and app/apple-icon.png) | — |
| brand/favicon-32.png | 32x32 | Favicon set (client) | Not linked (the app uses app/icon.png and app/apple-icon.png) | — |
| brand/favicon-512.png | 512x512 | Favicon set (client) | Not linked (the app uses app/icon.png and app/apple-icon.png) | — |
| brand/favicon.ico | (pdf) | Favicon set (client) | Not linked (the app uses app/icon.png and app/apple-icon.png) | — |
| brand/globalmed-icon.png | 628x628 | GlobalMed icon | Header (small screens) | — |
| brand/globalmed-logo-horizontal.png | 800x174 | Horizontal lockup | Header | — |
| brand/globalmed-logo-stacked-on-white.png | 757x890 | Stacked logo on white | Organization JSON-LD | — |
| brand/globalmed-logo-stacked.png | 653x786 | Stacked logo | Header, footer, social images | — |
| credentials/LCCI.jpg | 1755x1240 | LCCI certificate scan (client original) | Source of lcci-certificate.* | — |
| credentials/LCCI.pdf | (pdf) | LCCI certificate PDF (client original) | Source of lcci-certificate.pdf | — |
| credentials/hipaa-training-certificate-thumb.jpg | 640x495 | HIPAA certificate | Credentials tile (home, About) | — |
| credentials/hipaa-training-certificate.jpg | 1650x1275 | HIPAA certificate | Credentials lightbox | — |
| credentials/hipaa-training-certificate.pdf | (pdf) | HIPAA certificate | Credentials PDF link | — |
| credentials/lcci-certificate-thumb.jpg | 640x604 | LCCI certificate | Credentials tile (home, About) | — |
| credentials/lcci-certificate.jpg | 1755x1240 | LCCI certificate | Credentials lightbox | — |
| credentials/lcci-certificate.pdf | (pdf) | LCCI certificate | Credentials PDF link | — |
| credentials/pseb-certificate-thumb.jpg | 640x453 | PSEB certificate | Credentials tile (home, About) | — |
| credentials/pseb-certificate.jpg | 1754x1241 | PSEB certificate | Credentials lightbox | — |
| credentials/pseb-certificate.pdf | (pdf) | PSEB certificate | Credentials PDF link | — |
| guides/clean-claim-checklist.jpg | 2816x1536 | Client original | Source | — |
| guides/clean-claim-checklist.webp | 1600x1200 | 4:3 web version | Guides card (clean-claim-checklist) | — |
| guides/coding-career-90-day-plan.jpg | 2816x1536 | Client original | Source | — |
| guides/coding-career-90-day-plan.webp | 1600x1200 | 4:3 web version | Guides card (coding-career-90-day-plan) | — |
| guides/denial-reason-codes.jpg | 2816x1536 | Client original | Source | — |
| guides/denial-reason-codes.webp | 1600x1200 | 4:3 web version | Guides card (denial-reason-codes) | — |
| heroes/aapc-certification.jpg | 2816x1536 | Client original | Source | — |
| heroes/aapc-certification.webp | 1600x1200 | 4:3 web version | AAPC Certification hero | — |
| heroes/careers.jpg | 2816x1536 | Client original | Source | — |
| heroes/careers.webp | 1600x1200 | 4:3 web version | Careers hero | — |
| heroes/course-cpb.jpg | 2816x1536 | Client original | Source | — |
| heroes/course-cpb.webp | 1600x1200 | 4:3 web version | CPB® hero | — |
| heroes/course-cpc-cpb.jpg | 2816x1536 | Client original | Source | — |
| heroes/course-cpc-cpb.webp | 1600x1200 | 4:3 web version | CPC® + CPB® hero | — |
| heroes/course-cpc.jpg | 2816x1536 | Client original | Source | — |
| heroes/course-cpc.webp | 1600x1200 | 4:3 web version | CPC® hero | — |
| heroes/denial-management.jpg | 2816x1536 | Client original | Source | — |
| heroes/denial-management.webp | 1600x1200 | 4:3 web version | Denial Management hero | — |
| heroes/free-billing-audit.jpg | 2816x1536 | Client original | Source | — |
| heroes/free-billing-audit.webp | 1600x1200 | 4:3 web version | Free Billing Audit hero | — |
| heroes/medical-billing.jpg | 2816x1536 | Client original | Source | — |
| heroes/medical-billing.webp | 1600x1200 | 4:3 web version | Medical Billing hero | — |
| heroes/medical-coding.jpg | 2816x1536 | Client original | Source | — |
| heroes/medical-coding.webp | 1600x1200 | 4:3 web version | Medical Coding hero | — |
| heroes/services.jpg | 2816x1536 | Client original | Source | — |
| heroes/services.webp | 1600x1200 | 4:3 web version | Services hero | — |
| og/og-blog-1200.jpg | 1200x630 | 1200×630 share background | Social image: blog + guides | — |
| og/og-blog.jpg | 3168x1344 | Woman in light blue dupatta reviewing on a tablet | Social image: blog + guides (source) | **AI Clinical Documentation hero (new)** |
| og/og-blog.webp | 1600x1200 | 4:3 hero crop (new) | AI Clinical Documentation hero | — |
| og/og-careers-1200.jpg | 1200x630 | 1200×630 share background | Social image: careers | — |
| og/og-careers.jpg | 2752x1536 | Three colleagues talking and smiling | Social image: careers (source) | **Contact hero (new)** |
| og/og-careers.webp | 1600x1200 | 4:3 hero crop (new) | Contact hero | — |
| og/og-default-1200.jpg | 1200x630 | 1200×630 share background | Default social image | — |
| og/og-default.jpg | 2816x1536 | Team with headsets at a long desk, calm wall left | Default social image (source) | **Medical Transcription hero (new)** |
| og/og-default.webp | 1600x1200 | 4:3 hero crop (new) | Medical Transcription hero | — |
| og/og-education-1200.jpg | 1200x630 | 1200×630 share background | Social image: AAPC + course pages | — |
| og/og-education.jpg | 2752x1536 | Woman in light blue hijab studying online at home | Social image: AAPC + course pages (source) | **Unclear — ask client** (Blog index, Guides or FAQ?) |
| og/og-services-1200.jpg | 1200x630 | 1200×630 share background | Social image: services + specialties | — |
| og/og-services.jpg | 3168x1344 | Man in navy blazer at a laptop, colleague behind | Social image: services + specialties (source) | **RCM hero (new)** |
| og/og-services.webp | 1600x1200 | 4:3 hero crop (new) | RCM hero | — |
| services/aapc-certification.jfif | 2400x1792 | Higher-resolution copy of the same photo (not committed) | NOT USED | None needed (same photo as the .jpg) |
| services/aapc-certification.jpg | 1600x1200 | Client photo | Source | — |
| services/aapc-certification.webp | 1600x1200 | 4:3 web version | Home card 4 | — |
| services/ai-clinical-documentation.jfif | 2400x1792 | Higher-resolution copy of the same photo (not committed) | NOT USED | None needed (same photo as the .jpg) |
| services/ai-clinical-documentation.jpg | 1600x1200 | Client photo | Source | — |
| services/ai-clinical-documentation.webp | 1600x1200 | 4:3 web version | Home card 2 | — |
| services/medical-transcription.jfif | 2400x1792 | Higher-resolution copy of the same photo (not committed) | NOT USED | None needed (same photo as the .jpg) |
| services/medical-transcription.jpg | 1600x1200 | Client photo | Source | — |
| services/medical-transcription.webp | 1600x1200 | 4:3 web version | Home card 1 | — |
| services/revenue-cycle-management.jfif | 2400x1792 | Higher-resolution copy of the same photo (not committed) | NOT USED | None needed (same photo as the .jpg) |
| services/revenue-cycle-management.jpg | 2400x1792 | Client photo | Source | — |
| services/revenue-cycle-management.webp | 1600x1200 | 4:3 web version | Home card 3 | — |
| slider/slide-1.jpg | 3168x1344 | Client original | Source | — |
| slider/slide-1.webp | 2560x1086 | Web version | Home slider, slide 1 | — |
| slider/slide-2.jpg | 3168x1344 | Client original | Source | — |
| slider/slide-2.webp | 2560x1086 | Web version | Home slider, slide 2 | — |
| slider/slide-3.jpg | 3168x1344 | Client original | Source | — |
| slider/slide-3.webp | 2560x1086 | Web version | Home slider, slide 3 | — |

## Placed now

| Photo | New slot | Note |
|---|---|---|
| og/og-default | Medical Transcription hero | Also the default share image (a share card is not a page) |
| og/og-blog | AI Clinical Documentation hero | Also the blog/guides share image |
| og/og-services | Revenue Cycle Management hero | Also the services/specialties share image |
| og/og-careers | Contact hero | Also the careers share image |

## Your decision needed

- **og/og-education** (student in a light blue hijab studying online at home): Blog index hero, Guides hero, or FAQ hero? It stays the education share image either way.
- Pages still without a hero photo, with no unused photo left for them: About (has the founder photo in Our Story), Specialties, FAQ, Blog index, Guides, legal pages. New photos would be needed for these (or og-education for one of them).
