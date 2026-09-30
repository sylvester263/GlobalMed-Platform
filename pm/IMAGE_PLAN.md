# Image plan: full-site audit and generation plan

- **Date:** 2026-09-30 (audit of the live build, every visible route at 1280px; routes hidden by feature flags are left out)
- **Scope:** header, home (hero slider, all sections, service stacking cards), About (all sections), About › Team, Services + 6 service pages, Specialties + 6 specialty pages, AAPC Certification page, CPC® / CPB® / CPC® + CPB® course pages, registration form, Free Billing Audit + thank-you, Contact, Careers, Blog index, categories and 4 posts, Guides, FAQ, legal pages, 404, footer, Open Graph (social share) images.
- **Status today:** only the home page and About have photos. Every other page has a text-only hero on the #EEF6FC band and no image slot. The rows marked "proposed" below are **new** slots: they need a layout change when the image arrives (Task 3), and nothing on those pages is broken without them.
- **Task 3 (placement)** starts only after you say the images are uploaded.

## Placement (2026-09-30)

- [x] **B01** slider slide 3 (`slider/slide-3.webp`), replacing the classroom image
- [x] **B02** default social image, `app/opengraph-image.tsx` (every page without its own); the old navy card with the claim-line ticks is gone
- [x] **B03** social image for the AAPC page and the CPC®, CPB®, CPC® + CPB® pages
- [x] **B04** social image for Services, the 6 service pages, Specialties and the 6 specialty pages
- [x] **B05** AAPC Certification page hero
- [x] **B06** Free Billing Audit hero
- [x] **B07 / B08 / B09** CPC®, CPB®, CPC® + CPB® course heroes
- [x] **B10** Services hero
- [x] **B11 / B12 / B13** Medical Billing, Medical Coding, Denial Management heroes. The other three service pages (Medical Transcription, AI Clinical Documentation, RCM) reuse the home card photos C06, C07, C08
- [x] **B14** Careers hero
- [x] **B15–B18** blog post covers (post hero) and blog index / category cards
- [x] **B19–B21** guide cards
- [x] **B22** social image for the Blog index, posts, categories and Guides
- [x] **B23** social image for Careers
- [x] **B24** home "Get Trained by AAPC Instructors" band: scrolling photo background under a navy overlay (static with reduced motion); the AAPC page keeps the plain band
- [x] **C08** service card 3 (regenerated RCM photo)
- [ ] **C06 / C09** inpainted card 1 and card 4 photos: not uploaded yet; the current photos stay (now served as WebP)
- [x] **C04 / C05** slides 1 and 2 now served as WebP

Every photo has width/height and alt text describing what it shows (content/images.ts, content/home.ts, content/home-services.ts). Only slide 1 and each page's hero photo load with priority; everything else is lazy.

## Upload check (2026-09-30)

| ID | Result | Path used |
|---|---|---|
| B01 | found, **wrong folder** (uploaded to `credentials/slide-3.jpg`): moved to `slider/slide-3.jpg` with your OK, replacing the classroom image | `public/images/slider/slide-3.jpg` (3168×1344) |
| B02–B04 | found | `public/images/og/og-default.jpg` (2816×1536), `og-education.jpg` (2752×1536), `og-services.jpg` (3168×1344) |
| B05–B10 | found | `public/images/heroes/{aapc-certification,free-billing-audit,course-cpc,course-cpb,course-cpc-cpb,services}.jpg` (2816×1536 each) |
| B11–B13 | found, in `heroes/` instead of `services/`. Used where they are (no rename needed); the table paths below are updated | `public/images/heroes/{medical-billing,medical-coding,denial-management}.jpg` |
| B14 | found | `public/images/heroes/careers.jpg` |
| B15–B18 | found | `public/images/blog/*.jpg` (2816×1536) |
| B19–B21 | found | `public/images/guides/*.jpg` (2816×1536) |
| B22–B23 | found | `public/images/og/og-blog.jpg` (3168×1344), `og-careers.jpg` (2752×1536) |
| B24 | found (new slot: home "Get Trained by AAPC Instructors" scroll background band) | `public/images/backgrounds/home-aapc-band.jpg` (3168×1344) |
| C08 | found (regenerated, overwrote the old file) | `public/images/services/revenue-cycle-management.jpg` (2400×1792) |
| C06, C09 | **missing**: both files unchanged since 2026-09-28. Current photos stay (your decision) until the inpainted files arrive | — |

None is too small: every file is at or above its "generate at" size. The heroes are 2816×1536 (≈16:9) rather than 4:3; they are cropped to 4:3 around the subject when placed.

**Extra file, not placed:** `public/images/backgrounds/course-cpc.jpg` is byte-for-byte the same file as `heroes/course-cpc.jpg`. The untracked `services/*.jfif` files are the 2400×1792 sources of the 28 Sep card photos.

**Flagged for regeneration (not fixed):** no classroom scenes, patient data or distorted hands or faces were found. Readable text or brand logos:

| ID | File | Issue |
|---|---|---|
| B01 | slider/slide-3.jpg | Laptop brand logos (Dell) on both laptops |
| B06 | heroes/free-billing-audit.jpg | Screen title readable ("Practice Revenue Data"); Dell logo |
| B07 | heroes/course-cpc.jpg | Book cover title readable ("Medical Coding Reference"); screen text |
| B09 | heroes/course-cpc-cpb.jpg | Book cover readable ("Professional Credentials") |
| B12 | heroes/medical-coding.jpg | Faint book title and screen text (minor) |
| B13 | heroes/denial-management.jpg | Wall poster with a map and the word "PAKISTAN" |
| B14 | heroes/careers.jpg | Laptop shows lines of code (semi-readable) |
| B15 | blog/why-claims-get-denied.jpg | Folder cover reads "PROJECT ALPHA" |
| B18 | blog/clean-claim-rate.jpg | Dell logo on the laptop |
| B19 | guides/clean-claim-checklist.jpg | Apple logo on the laptop lid |
| B21 | guides/coding-career-90-day-plan.jpg | Screen text readable ("Session 3: Planning"); the face is cut at the top edge |
| B23 | og/og-careers.jpg | Dell logo; a shop sign in the background |
| B24 | backgrounds/home-aapc-band.jpg | Book cover title readable |
| C08 | services/revenue-cycle-management.jpg | Dashboard labels readable ("Revenue", "Claims processed") |

## Prompt rules for group B (apply to every AI-generated image)

1. Realistic editorial / corporate photography. Where people appear they are Pakistani professionals, a mix of men and women, some women in hijab or dupatta, in modern, clean offices or home workspaces.
2. Brand palette: navy #283F93, sky blue #51ACE3, mid blue #3A73C2, white. Natural daylight with cool blue accents (clothing, walls, cushions, folders), never oversaturated.
3. Where the image sits behind or beside text, keep that side calm: soft, low-detail, out of focus. Each image says which side.
4. Education images show **online learning only**: a laptop at home, a video call on screen. No classrooms, campuses, whiteboards, lecterns or onsite training. Nothing may suggest that GlobalMed teaches the course or issues certificates (AAPC faculty teach online and AAPC certifies).
5. No text, letters, numbers, logos, watermarks, readable screens or documents, patient data, hospital beds, blood, needles, or AAPC or any other brand logo. No fake certificates or badges. Screens show only soft, unreadable shapes such as blurred charts or a video-call grid.
6. No ticked "claim line" graphics (retired).
7. No real, identifiable people.
8. **Standard negative prompt (use for every image, plus any extras listed per image):**
   `text, words, letters, numbers, logos, watermarks, brand names, readable screens, readable documents, patient names, medical records, hospital beds, blood, syringes, surgery, classroom, lecture hall, cartoon, illustration, 3D render, oversaturated colors, harsh shadows, distorted hands, extra fingers, deformed faces, cluttered background`
9. **Seed:** 240926, unless the image lists a different seed (used where two prompts are close, so the results don't look alike).
10. Upload as high-quality JPG or PNG at the "generate at" size or larger. Task 3 makes the WebP and responsive sizes and keeps your originals.

---

## A) Real photos needed from the client (never AI-generate these)

| ID | Page | Section | File path to save as | Size (px) & aspect | Purpose / what it must show | Status | Priority |
|---|---|---|---|---|---|---|---|
| A01 | Home, About | Hero slider lockup; About "Investing in Pakistan's Healthcare Workforce" band | `public/aapc-logo.png` | ≥ 600 px wide, transparent PNG | Official AAPC logo, unaltered, **with AAPC's written permission** (CLIENT_INPUTS_NEEDED). The client-supplied `public/aapc-logo.svg` is used until then | placeholder (SVG in use, permission pending) | P1 |
| A02 | All pages | Header, footer, Organization JSON-LD | `public/images/brand/globalmed-logo-horizontal-official.png` (or `.svg`) | ≥ 1200 px wide, transparent | Official horizontal GlobalMed logo. The site uses a lockup built from the stacked artwork until then | placeholder (built lockup) | P2 |
| A03 | About › Team | Team cards (5 roles) | `public/images/team/<role-slug>.jpg`: `director-revenue-cycle`, `head-coding-quality`, `director-education`, `client-success-lead`, `compliance-officer` | 800×1000 (4:5) each | Head-and-shoulders portraits, plain or office background, same lighting across all five. Names are also still `[CLIENT TO CONFIRM]`; cards show initials until then | missing | P2 |
| A04 | About, Contact | About "Clinical Documentation" band (proposed); Contact page hero (proposed) | `public/images/office/office-team-at-work.jpg`, `public/images/office/office-reception.jpg` | 1600×1200 (4:3) | The real Lahore office: team at work (screens not readable, no patient data), and the reception or entrance for Contact | missing (proposed) | P2 |
| A05 | About | About hero (proposed) | `public/images/office/team-group.jpg` | 1920×800 (21:9), people in the right two-thirds | Real team group photo; the left third stays calm for the heading | missing (proposed) | P2 |
| A06 | Home, About | Registered, Certified & Compliant | `public/images/credentials/secp-certificate.jpg` + SECP number | full scan + we make the 640px thumbnail | SECP certificate of incorporation. The tile is hidden until it arrives | missing (tile hidden) | P2 |
| A07 | Home, About | Registered, Certified & Compliant | `public/images/credentials/credential-3-certificate.jpg` | full scan | Third credential, name to be confirmed. The tile is hidden until it arrives | missing (tile hidden) | P2 |
| A08 | Home, AAPC page | "Get Trained by AAPC Instructors" band | `public/images/instructors/instructor-1.jpg` … `-3.jpg` | 800×1000 (4:5) | Real AAPC instructor photos, only with permission. The slots are hidden (`instructorPhotos: false`) | missing (slots hidden) | P2 |
| A09 | Footer (and a future app section) | App Store / Google Play | `public/images/app/screen-1.png` … | device native, e.g. 1290×2796 | Real app screenshots. Only needed if an app section is added; the footer badges don't need them | missing (no slot yet) | P2 |

---

## B) AI-generated images

| ID | Page | Section | File path to save as | Size (px) & aspect | Purpose / what it must show | Status | Priority |
|---|---|---|---|---|---|---|---|
| B01 | Home | Hero slider, slide 3 "AAPC Certification with GlobalMed Transcriptions" | `public/images/slider/slide-3.jpg` | 1920×800 (21:9 crop) | Online learning at home | **needs replacing**: the current image shows an instructor at a screen in a physical classroom, which breaks rule 4 | P1 |
| B02 | All pages without their own image | Default social share (Open Graph) | `public/images/og/og-default.jpg` | 1200×630 (1.91:1) | Background photo; logo and page title are added in code | generic (today's card is navy with the logo and the retired claim-line ticks) | P1 |
| B03 | AAPC page, CPC®, CPB®, CPC® + CPB® | Social share | `public/images/og/og-education.jpg` | 1200×630 (1.91:1) | Background for education pages; title added in code | missing | P1 |
| B04 | Services, 6 service pages, Specialties, 6 specialty pages | Social share | `public/images/og/og-services.jpg` | 1200×630 (1.91:1) | Background for B2B service pages; title added in code | missing | P1 |
| B05 | AAPC Certification page | Hero, right side (proposed) | `public/images/heroes/aapc-certification.jpg` | 1200×900 (4:3) | Student preparing for AAPC exams online at home | missing (proposed) | P1 |
| B06 | Free Billing Audit | Hero, right side (proposed) | `public/images/heroes/free-billing-audit.jpg` | 1200×900 (4:3) | Practice manager and billing specialist reviewing revenue together | missing (proposed) | P1 |
| B07 | CPC® course page | Hero, right side (proposed) | `public/images/heroes/course-cpc.jpg` | 1200×900 (4:3) | Coding student online at home | missing (proposed) | P2 |
| B08 | CPB® course page | Hero, right side (proposed) | `public/images/heroes/course-cpb.jpg` | 1200×900 (4:3) | Billing student online at home | missing (proposed) | P2 |
| B09 | CPC® + CPB® course page | Hero, right side (proposed) | `public/images/heroes/course-cpc-cpb.jpg` | 1200×900 (4:3) | Committed learner, longer programme, online | missing (proposed) | P2 |
| B10 | Services index | Hero, right side (proposed) | `public/images/heroes/services.jpg` | 1200×900 (4:3) | GlobalMed team working across the revenue cycle | missing (proposed) | P2 |
| B11 | /services/medical-billing | Hero, right side (proposed) | `public/images/heroes/medical-billing.jpg` | 1200×900 (4:3) | Biller preparing claims | missing (proposed) | P2 |
| B12 | /services/medical-coding | Hero, right side (proposed) | `public/images/heroes/medical-coding.jpg` | 1200×900 (4:3) | Certified coder at work | missing (proposed) | P2 |
| B13 | /services/denial-management | Hero, right side (proposed) | `public/images/heroes/denial-management.jpg` | 1200×900 (4:3) | Specialist working an A/R follow-up call | missing (proposed) | P2 |
| B14 | Careers | Hero, right side (proposed) | `public/images/heroes/careers.jpg` | 1200×900 (4:3) | Welcoming team, career growth | missing (proposed) | P2 |
| B15 | Blog: "Why claims get denied…" | Post cover + blog card | `public/images/blog/why-claims-get-denied.jpg` | 1200×675 (16:9) | Resolving denied claims | missing (proposed) | P2 |
| B16 | Blog: "Modifier 25 explained…" | Post cover + blog card | `public/images/blog/modifier-25-explained.jpg` | 1200×675 (16:9) | Coder checking a same-day visit | missing (proposed) | P2 |
| B17 | Blog: "How to start a medical coding career…" | Post cover + blog card | `public/images/blog/start-medical-coding-career-pakistan.jpg` | 1200×675 (16:9) | Young Pakistani starting a coding career online | missing (proposed) | P2 |
| B18 | Blog: "What is a clean claim rate…" | Post cover + blog card | `public/images/blog/clean-claim-rate.jpg` | 1200×675 (16:9) | Healthy revenue dashboard, unreadable | missing (proposed) | P2 |
| B19 | Guides: "The clean-claim checklist" | Guide card (proposed) | `public/images/guides/clean-claim-checklist.jpg` | 1200×900 (4:3) | Orderly desk, checklist mood | missing (proposed) | P2 |
| B20 | Guides: "Denial reason codes, decoded" | Guide card (proposed) | `public/images/guides/denial-reason-codes.jpg` | 1200×900 (4:3) | Analyst sorting denials | missing (proposed) | P2 |
| B21 | Guides: "Start a coding career: a 90-day plan" | Guide card (proposed) | `public/images/guides/coding-career-90-day-plan.jpg` | 1200×900 (4:3) | Planner and laptop at home | missing (proposed) | P2 |
| B22 | Blog index, categories, posts without a cover, Guides | Social share | `public/images/og/og-blog.jpg` | 1200×630 (1.91:1) | Background for articles; title added in code | missing | P2 |
| B24 | Home | "Get Trained by AAPC Instructors" scroll background band (added by the client) | `public/images/backgrounds/home-aapc-band.jpg` | 1920×800 (21:9), 2560 for large screens | Online learner at home in the evening, navy overlay on top | uploaded | P1 |
| B23 | Careers | Social share | `public/images/og/og-careers.jpg` | 1200×630 (1.91:1) | Background for careers; title added in code | missing | P2 |

### Generation details

**B01 · `slider/slide-3.jpg`**
- Final 1920×800; generate at 21:9 (e.g. 2688×1152) and crop.
- Prompt: **already provided** in the chat: the slide 3 "online learning" version (a student learning online at home on a laptop). Use that version, not the classroom one. Subject in the right half; the left half stays calm behind the headline and buttons (the slider puts a navy gradient on the left).
- Negative prompt: standard + `whiteboard, instructor standing, projector, rows of desks, audience`
- Seed: 240926

**B02 · `og/og-default.jpg`**
- Final 1200×630; generate at 1.91:1 (e.g. 2400×1260).
- Prompt: `Wide editorial corporate photograph of a bright, modern medical billing and transcription office in Lahore, Pakistan. Two Pakistani professionals, a man in a light blue shirt and a woman in a navy dupatta, work side by side at clean white desks with laptops and headsets, screens turned away from the camera. Large windows with soft natural daylight, navy and sky blue accents on the walls and chairs, a few green plants. People and desks in the right half of the frame; the left half is a softly blurred, calm, pale wall with cool blue tones, with space for a logo and title. Shallow depth of field, 35mm lens, realistic, clean, trustworthy.`
- Negative prompt: standard
- Seed: 240926

**B03 · `og/og-education.jpg`**
- Final 1200×630; generate at 1.91:1.
- Prompt: `Wide editorial photograph of a young Pakistani woman in a sky blue hijab studying online at home, sitting at a tidy wooden desk with a laptop showing a blurred, unreadable video-call grid, a notebook and pen beside it. Warm, modern living room with soft daylight from a window, navy cushions and sky blue accents. She is in the right half of the frame, focused and optimistic; the left half is a calm, softly blurred wall with space for a title. Realistic, natural, shallow depth of field, 50mm lens.`
- Negative prompt: standard + `whiteboard, instructor standing, certificate, diploma, graduation cap`
- Seed: 240930

**B04 · `og/og-services.jpg`**
- Final 1200×630; generate at 1.91:1.
- Prompt: `Wide editorial photograph of a Pakistani medical billing specialist, a man in his thirties in a navy blazer and white shirt, reviewing work on a laptop in a clean, modern office, with a colleague in a light blue dupatta softly out of focus behind him. Screens show only soft, blurred blue shapes. Daylight from large windows, navy and sky blue accents. Subjects in the right half; the left half is a calm, blurred, pale office wall with space for a title. Realistic, professional, 35mm lens, shallow depth of field.`
- Negative prompt: standard
- Seed: 240926

**B05 · `heroes/aapc-certification.jpg`**
- Final 1200×900; generate at 4:3 (e.g. 2400×1800).
- Prompt: `Editorial photograph of a Pakistani man in his twenties preparing for a professional medical coding exam online at home, sitting at a clean desk by a window with a laptop showing a blurred, unreadable video lesson, thick closed reference books with plain navy covers and a notebook. Calm, focused expression. Soft morning daylight, white walls, navy and sky blue accents. Subject slightly right of centre; the left edge is soft and uncluttered. Realistic, natural colours, 50mm lens, shallow depth of field.`
- Negative prompt: standard + `whiteboard, instructor standing, certificate, diploma, graduation cap, book titles`
- Seed: 240926

**B06 · `heroes/free-billing-audit.jpg`**
- Final 1200×900; generate at 4:3.
- Prompt: `Editorial photograph of two Pakistani professionals in a bright, modern office reviewing a practice's revenue together: a woman in a navy dupatta pointing at a laptop showing soft, blurred, unreadable blue bar charts, and a man in a light blue shirt listening and taking notes. Friendly, confident, collaborative. Daylight from large windows, white desk, navy and sky blue accents, a small plant. Subjects centred slightly right; the background is softly blurred and calm. Realistic, 35mm lens, shallow depth of field.`
- Negative prompt: standard + `paper forms with writing, invoices, dollar signs`
- Seed: 240926

**B07 · `heroes/course-cpc.jpg`**
- Final 1200×900; generate at 4:3.
- Prompt: `Editorial photograph of a young Pakistani woman in a white dupatta studying medical coding online at home, laptop open with a blurred, unreadable video lesson, a closed thick reference book with a plain navy cover, highlighter and notebook on a light wooden desk. Soft window light, calm home study corner, sky blue curtains, navy accents. Subject slightly right of centre, calm left edge. Realistic, 50mm lens, shallow depth of field.`
- Negative prompt: standard + `whiteboard, instructor standing, certificate, diploma, book titles`
- Seed: 240927

**B08 · `heroes/course-cpb.jpg`**
- Final 1200×900; generate at 4:3.
- Prompt: `Editorial photograph of a Pakistani man in his late twenties in a light blue shirt learning medical billing online at home, laptop showing a blurred, unreadable video call, a calculator and a notebook beside it, a mug of tea. Tidy, modern home workspace with a navy chair and white walls, soft afternoon daylight. Subject slightly right of centre, calm left edge. Realistic, natural colours, 50mm lens, shallow depth of field.`
- Negative prompt: standard + `whiteboard, instructor standing, certificate, diploma, money, dollar signs`
- Seed: 240928

**B09 · `heroes/course-cpc-cpb.jpg`**
- Final 1200×900; generate at 4:3.
- Prompt: `Editorial photograph of a Pakistani woman in her thirties in a navy hijab at a home desk in the evening, committed to a longer online study programme: laptop with a blurred, unreadable video lesson, two closed thick reference books with plain navy and sky blue covers, a wall calendar with no readable marks, a desk lamp with warm light and cool blue tones from the window. Determined, calm expression. Subject slightly right of centre, calm left edge. Realistic, 50mm lens, shallow depth of field.`
- Negative prompt: standard + `whiteboard, instructor standing, certificate, diploma, book titles, calendar numbers`
- Seed: 240929

**B10 · `heroes/services.jpg`**
- Final 1200×900; generate at 4:3.
- Prompt: `Editorial photograph of a small GlobalMed-style team of four Pakistani professionals, men and women, two women in dupattas, in a bright, open-plan office, working at white desks with laptops and headsets, one standing and discussing work with a colleague. Screens turned away or showing blurred blue shapes. Large windows, daylight, navy and sky blue accents, plants. Balanced composition, calm upper left area. Realistic, 28mm lens, natural colours.`
- Negative prompt: standard
- Seed: 240926

**B11 · `heroes/medical-billing.jpg`**
- Final 1200×900; generate at 4:3.
- Prompt: `Editorial photograph of a Pakistani medical biller, a woman in a light blue dupatta, working at a clean office desk with a laptop showing soft, unreadable blue charts, a calculator and a neat stack of blank folders. Focused, confident. Daylight from a window, white and navy office, sky blue accents. Subject right of centre, calm left side. Realistic, 50mm lens, shallow depth of field.`
- Negative prompt: standard + `paper forms with writing, invoices, dollar signs`
- Seed: 240926

**B12 · `heroes/medical-coding.jpg`**
- Final 1200×900; generate at 4:3.
- Prompt: `Editorial photograph of a Pakistani medical coder, a man in his thirties with glasses and a navy sweater, working at a dual-monitor desk in a quiet, modern office, screens angled away from the camera, a closed thick reference book with a plain cover beside the keyboard. Concentrated, precise. Soft daylight, white walls, sky blue accents. Subject right of centre, calm left side. Realistic, 50mm lens, shallow depth of field.`
- Negative prompt: standard + `book titles`
- Seed: 240926

**B13 · `heroes/denial-management.jpg`**
- Final 1200×900; generate at 4:3.
- Prompt: `Editorial photograph of a Pakistani accounts receivable specialist, a woman in a navy hijab, on a phone call with a headset at a clean office desk, laptop showing a blurred, unreadable list, a notebook with a pen. Calm, persistent, professional expression. Bright office, daylight, white and sky blue tones. Subject right of centre, calm left side. Realistic, 50mm lens, shallow depth of field.`
- Negative prompt: standard + `red warning signs, stamps, "denied" marks`
- Seed: 240926

**B14 · `heroes/careers.jpg`**
- Final 1200×900; generate at 4:3.
- Prompt: `Editorial photograph of a welcoming moment in a modern Lahore office: a Pakistani team lead, a woman in a sky blue dupatta, smiling and talking with two new colleagues, a young man and a young woman in hijab, beside a white desk with laptops. Friendly, supportive, growth-minded. Daylight, navy and sky blue accents, plants. Balanced composition, calm upper area. Realistic, 35mm lens, natural colours.`
- Negative prompt: standard + `handshake close-up, ID badges`
- Seed: 240926

**B15 · `blog/why-claims-get-denied.jpg`**
- Final 1200×675; generate at 16:9 (e.g. 2400×1350).
- Prompt: `Editorial photograph, top-down angled view of a tidy office desk: a laptop showing soft, unreadable blue charts, a few blank folders being sorted into two neat piles, a pen and a cup of tea, a Pakistani professional's hands (light blue shirt cuffs) organising the work. Calm, problem-solving mood, daylight, white desk, navy and sky blue accents. Calm space on the left. Realistic, shallow depth of field.`
- Negative prompt: standard + `paper forms with writing, red stamps, dollar signs`
- Seed: 240926

**B16 · `blog/modifier-25-explained.jpg`**
- Final 1200×675; generate at 16:9.
- Prompt: `Editorial photograph of a Pakistani medical coder, a woman in a white dupatta, carefully checking work on a laptop in a quiet office, one hand on the trackpad and the other holding a pen over a blank notepad, screen angled away. Thoughtful, precise mood, soft daylight, navy and sky blue accents. Subject right of centre, calm left side. Realistic, 50mm lens, shallow depth of field.`
- Negative prompt: standard
- Seed: 240926

**B17 · `blog/start-medical-coding-career-pakistan.jpg`**
- Final 1200×675; generate at 16:9.
- Prompt: `Editorial photograph of a young Pakistani graduate, a man in his early twenties, sitting at a home desk with a laptop showing a blurred, unreadable online lesson, a notebook and a mug, looking out of the window with a hopeful, determined expression. Morning light, modest modern home, navy and sky blue accents. Subject right of centre, calm left side. Realistic, 35mm lens, natural colours.`
- Negative prompt: standard + `whiteboard, instructor standing, certificate, diploma, graduation cap`
- Seed: 240931

**B18 · `blog/clean-claim-rate.jpg`**
- Final 1200×675; generate at 16:9.
- Prompt: `Editorial close-up photograph of a laptop on a clean white office desk showing a soft, out-of-focus dashboard with upward-trending blue and sky blue line and bar shapes, nothing readable, a Pakistani professional's hand resting beside it, a small plant and a cup of tea. Bright daylight, calm, positive mood. Calm space on the left. Realistic, shallow depth of field.`
- Negative prompt: standard
- Seed: 240926

**B19 · `guides/clean-claim-checklist.jpg`**
- Final 1200×900; generate at 4:3.
- Prompt: `Editorial flat-lay photograph of an orderly office desk from above: a closed laptop, a clipboard with a blank sheet, a pen, a few neat blank navy folders and sky blue sticky notes with nothing written on them, a small plant. White desk, soft daylight, calm and organised. Realistic, sharp, minimal.`
- Negative prompt: standard + `handwriting, tick marks, checkmarks`
- Seed: 240926

**B20 · `guides/denial-reason-codes.jpg`**
- Final 1200×900; generate at 4:3.
- Prompt: `Editorial photograph of a Pakistani revenue cycle analyst, a man in a navy shirt, sorting blank colour-coded folders (navy, sky blue, white) into groups at a clean office desk next to a laptop with a blurred, unreadable screen. Methodical, calm, daylight, white and blue office. Subject right of centre. Realistic, 50mm lens, shallow depth of field.`
- Negative prompt: standard + `paper forms with writing, labels with text`
- Seed: 240926

**B21 · `guides/coding-career-90-day-plan.jpg`**
- Final 1200×900; generate at 4:3.
- Prompt: `Editorial photograph of a home study desk ready for a new plan: an open blank planner with no writing, a laptop showing a blurred online lesson, a pen, sky blue sticky notes with nothing on them, a cup of chai, soft morning light through a window, a Pakistani woman in a navy dupatta just visible from the shoulders down, about to write. Hopeful, organised mood. Realistic, 50mm lens, shallow depth of field.`
- Negative prompt: standard + `handwriting, calendar numbers, whiteboard, certificate`
- Seed: 240932

**B22 · `og/og-blog.jpg`**
- Final 1200×630; generate at 1.91:1.
- Prompt: `Wide editorial photograph of a calm reading and research moment in a bright office: a Pakistani professional, a woman in a sky blue dupatta, reading on a tablet with a blurred, unreadable screen, a laptop and a cup of tea on a white desk. Soft daylight, navy and sky blue accents. Subject in the right half; the left half is a calm, blurred, pale wall with space for a title. Realistic, 50mm lens, shallow depth of field.`
- Negative prompt: standard
- Seed: 240926

**B23 · `og/og-careers.jpg`**
- Final 1200×630; generate at 1.91:1.
- Prompt: `Wide editorial photograph of a friendly team moment in a modern Lahore office: three Pakistani colleagues, men and women, one woman in hijab, smiling while talking beside a white desk with laptops. Daylight, navy and sky blue accents, plants. Group in the right half; the left half is a calm, blurred office background with space for a title. Realistic, 35mm lens, natural colours.`
- Negative prompt: standard + `ID badges, handshake close-up`
- Seed: 240926

---

## C) Slots that already have a good image (no action)

| ID | Page | Section | File path | Size (px) & aspect | What it shows | Status | Note |
|---|---|---|---|---|---|---|---|
| C01 | All pages | Header logo, footer logo | `public/images/brand/globalmed-logo-stacked.png`, `globalmed-icon.png` | 628×628 icon | Official GlobalMed artwork | real | — |
| C02 | All pages | Favicons, app icons | `public/images/brand/favicon-*.png`, `app/icon.png`, `app/apple-icon.png` | 32–512 | Official icon | real | — |
| C03 | Footer | App Store / Google Play badges | `public/images/badges/*` | vector / PNG | Official store badges ("Coming soon" until links are set) | real | — |
| C04 | Home | Hero slider, slide 1 | `public/images/slider/slide-1.jpg` | 3168×1344 (≈21:9) | Office team with headsets, subject right | AI (client) | Prompt already provided. Task 3: WebP (2.5 MB today) |
| C05 | Home | Hero slider, slide 2 | `public/images/slider/slide-2.jpg` | 3168×1344 | Billing desk with laptop and books, subject right | AI (client) | Prompt already provided. Task 3: WebP (2.3 MB today) |
| C06 | Home | Our Services card 1 | `public/images/services/medical-transcription.jpg` | 1600×1200 (4:3) | Transcriptionist in hijab with headset | AI (client) | Prompt already provided. A 2400×1792 source is at `.jfif` (untracked); Task 3 can use it. A mug shows a few letters |
| C07 | Home | Our Services card 2 | `public/images/services/ai-clinical-documentation.jpg` | 1600×1200 | Laptop with voice waveform, tablet | AI (client) | Prompt already provided; `.jfif` source available |
| C08 | Home | Our Services card 3 | `public/images/services/revenue-cycle-management.jpg` | 1600×1200 | Biller reviewing a claim form | AI (client) | Prompt already provided; `.jfif` source available. A wall poster shows readable words; regenerate later if you want it clean |
| C09 | Home | Our Services card 4 | `public/images/services/aapc-certification.jpg` | 1600×1200 | Student in hijab on a video call at home | AI (client) | Prompt already provided (online-learning version); `.jfif` source available. Book spines show faint text |
| C10 | Home, About | Credentials: PSEB, LCCI, HIPAA | `public/images/credentials/{pseb-certificate,lcci-certificate,hipaa-training-certificate}{,-thumb}.jpg` + PDFs | 640px thumbnails + full scans | Real certificates | real | — |
| C11 | About | Our Story, founder photo | `public/images/about/riaz-naveed-800.webp` (original `public/images/Founder/Riaz Picture.png`) | 800×1000 (4:5) | Riaz Naveed, Founder & CEO | real | Also reusable for the About › Team "Founder & CEO" card and the About OG image in Task 3 |
| C12 | About | Leadership card | `public/images/about/riaz-naveed-400.webp` | 400×500 | Same photo | real | Card hidden (`aboutLeaderCard: false`) |

**Pages that need no image** (text is the point, or an image would get in the way): FAQ, legal pages (privacy, terms, cookie policy, HIPAA notice), 404, Free Billing Audit thank-you, newsletter confirmation, the registration form (stays focused), blog category pages (they use the post covers once B15–B18 exist), and the 6 specialty pages. For the specialty pages, any fitting photo would lean on clinical scenes, which the rules rule out; the text-only design stays.

---

## Totals

| | Group A (real, client) | Group B (AI) | Total |
|---|---|---|---|
| **P1 (launch)** | 1 (A01 AAPC logo) | 6 (B01–B06) | **7** |
| **P2 (later)** | 15 files (A02; A03 ×5; A04 ×2; A05; A06; A07; A08 ×3; A09 as one set) | 17 (B07–B23) | **32** |
| **All** | 16 | 23 | **39** |

Group C: 12 slots already good, no action.

## File-naming checklist for uploads

- [ ] Save each file at the exact path in the table. Lowercase letters, numbers and hyphens only: no spaces, capitals or brackets (`slide-3.jpg`, not `Slide 3 (final).JPG`). Vercel is case-sensitive; Windows is not.
- [ ] Use `.jpg` for photos (or `.png` if that's what the generator gives). Not `.jfif`, `.heic` or `.webp`; Task 3 makes the WebP.
- [ ] Upload at the "generate at" size or larger, never smaller than the final size.
- [ ] One file per ID. To replace an image, overwrite the same file name; don't add `-v2`.
- [ ] New folders to create under `public/images/`: `og/`, `heroes/`, `blog/`, `guides/`, `office/`, `team/` (and `app/` only if needed). `slider/`, `services/`, `credentials/`, `instructors/` already exist.
- [ ] AAPC logo goes at `public/aapc-logo.png` (site root, next to the existing SVG), only once permission is in writing.
- [ ] Real photos (group A): send the camera original; don't crop or filter them first.
- [ ] Check before upload: no readable text, no logos, no patient data, no classroom, hands look natural.
- [ ] Tell me "images uploaded" with the list of IDs; Task 3 then places them and ticks the rows.

## Notes for Task 3 (placement)

- Rows marked "proposed" need a small layout change (image beside the hero text on ≥1024px, above it on mobile). Pages stay text-only until their image arrives, so nothing shows a placeholder.
- Per-page social images need code: Next.js `opengraph-image` routes that put the logo and page title over the B02–B04, B22–B23 photos. The current default card still draws the retired claim-line ticks; that goes when B02 lands.
- The slider photos (2.3–2.6 MB each) become WebP with responsive sizes; only slide 1 is priority-loaded.
