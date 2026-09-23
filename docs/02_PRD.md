# 02 — Product Requirements Document

Priority: **P0** = launch blocker, **P1** = launch target, **P2** = post-launch.

## 1. Roles
| Role | Can do |
|---|---|
| Visitor | Browse site, chat with bot, submit lead/enquiry forms, verify a certificate |
| Student | Buy/enroll, watch lessons, take quizzes/exams, download certificates, manage profile, see invoices |
| Instructor | Create/edit own courses, upload lessons, build quizzes, view own students' progress, answer Q&A |
| Admin | Everything: users, courses, pricing, coupons, orders, certificates, leads, content, chatbot knowledge, settings |
| Sales agent | Leads/CRM view, chatbot handoff inbox, notes, status changes (no finance/settings) |

## 2. Public website
| ID | Requirement | Pri | Acceptance criteria |
|---|---|---|---|
| W-1 | Home page presenting both services and School | P0 | Two clear paths above the fold: "Get billing help" and "Start a course" |
| W-2 | Service pages (billing, coding, transcription, AI clinical documentation, RCM, credentialing if offered) | P0 | Each has problem → how we work → outcomes → FAQ → CTA |
| W-3 | Specialty pages (e.g. cardiology, orthopedics billing) | P1 | Generated from CMS entries; unique copy per specialty |
| W-4 | Free practice billing audit / consultation form | P0 | Business fields only (no PHI), Turnstile, stored in `leads`, email to sales within 1 min |
| W-5 | School landing, course catalog with filters | P0 | Filter by level, category, certification path, price; search |
| W-6 | Course detail page | P0 | Outcomes, curriculum preview, instructor, price, reviews, FAQ, enroll CTA, JSON-LD Course |
| W-7 | Certification pathways page | P1 | Visual path e.g. Foundations → Billing → Coding → Exam prep |
| W-8 | AAPC partnership page | P1 | Only published after client confirms permission |
| W-9 | Blog / resources with categories | P0 | Admin-editable, SEO fields, JSON-LD Article |
| W-10 | About, team, careers, contact, FAQ, legal pages | P0 | Privacy, terms, refund policy, HIPAA notice |
| W-11 | Certificate verification page | P0 | Enter ID or scan QR → shows name, course, date, status |
| W-12 | Chat widget on all pages | P0 | See docs/09 |
| W-13 | WhatsApp click-to-chat button | P0 | Opens the WhatsApp business number with prefilled message |
| W-14 | Newsletter signup | P1 | Double opt-in via Resend |

## 3. Accounts
| ID | Requirement | Pri |
|---|---|---|
| A-1 | Email + password sign-up, email verification, password reset | P0 |
| A-2 | Google sign-in | P1 |
| A-3 | Role-based access enforced by RLS and server checks | P0 |
| A-4 | Profile: name as it should appear on certificate, country, phone, avatar | P0 |

## 4. LMS
| ID | Requirement | Pri |
|---|---|---|
| L-1 | Course → Module → Lesson structure; lesson types: video, text, PDF, quiz, assignment, live-session link | P0 |
| L-2 | Secure video streaming (signed URLs, no direct download) | P0 |
| L-3 | Rewatch any completed lesson unlimited times during access period; resume from last position | P0 |
| L-4 | Playback speed, captions, notes per lesson | P1 |
| L-5 | Progress tracking per lesson and course; "continue where you left off" | P0 |
| L-6 | Drip content (unlock by date or by previous completion) | P1 |
| L-7 | Quizzes: MCQ, multi-select, true/false; instant feedback; attempt limits | P0 |
| L-8 | Mock exams: timed, randomised question bank, section scores, review mode | P0 |
| L-9 | Q&A / discussion per lesson | P1 |
| L-10 | Downloadable resources per lesson | P0 |
| L-11 | Access period per course (lifetime or N months) | P0 |
| L-12 | Cohort/batch support for scheduled classes | P1 |

## 5. Commerce
| ID | Requirement | Pri |
|---|---|---|
| C-1 | Stripe Checkout (card) in USD | P0 |
| C-2 | Manual payment flow (bank transfer/JazzCash/Easypaisa proof upload) with admin approval, PKR pricing | P0 |
| C-3 | Coupons (%, fixed, usage limits, expiry) | P1 |
| C-4 | Bundles (course packs / certification path bundle) | P1 |
| C-5 | Invoices/receipts emailed and visible in dashboard | P0 |
| C-6 | Refund handling by admin, revoking access | P1 |
| C-7 | Installment plans | P2 |

## 6. Certification
| ID | Requirement | Pri |
|---|---|---|
| X-1 | Auto-issue certificate when completion rules met (all lessons + passing score) | P0 |
| X-2 | PDF certificate with unique ID + QR to verification page | P0 |
| X-3 | Admin can revoke/reissue | P0 |
| X-4 | Share to LinkedIn button | P1 |

## 7. Dashboards
See docs/07_DASHBOARDS.md. All P0 except advanced analytics (P1).

## 8. AI chatbot & WhatsApp
See docs/09. Website chatbot P0; WhatsApp bot P0; human handoff P0; lead capture from chat P0.

## 9. Non-functional
| Area | Requirement |
|---|---|
| Performance | LCP < 2.5s, INP < 200ms, CLS < 0.1 on mobile 4G |
| Accessibility | WCAG 2.1 AA |
| Security | OWASP Top 10 addressed; RLS on all tables; rate limiting on auth, forms, chatbot |
| Availability | 99.9% (Vercel + Supabase managed) |
| Backups | Daily DB backups, PITR on Supabase Pro |
| i18n | English at launch; architecture ready for Urdu (P2) |
| Browser support | Last 2 versions of Chrome, Safari, Edge, Firefox; iOS Safari, Android Chrome |
