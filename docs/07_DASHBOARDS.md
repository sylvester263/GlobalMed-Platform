# 07 — Dashboards

All dashboards share one shell: sidebar navigation, top bar (search, notifications, profile), breadcrumbs, responsive (sidebar becomes sheet on mobile).

## 1. Student dashboard `/dashboard/student`
| Page | Contents |
|---|---|
| Overview | Continue learning card (last lesson + resume), active courses with progress, upcoming batch sessions, recent certificates, announcements |
| My courses | All enrollments, filter active/completed/expired, progress %, access expiry |
| Course player `/learn/...` | Video (resume position, speed, captions), curriculum sidebar, notes, resources, Q&A, mark complete, next lesson |
| Quizzes & exams | Available, attempts left, scores history, review answers with explanations |
| Certificates | Download PDF, copy verification link, add to LinkedIn |
| Orders & invoices | Order list, receipt PDF, pending manual-payment status |
| Profile & settings | Name on certificate, contact, password, notifications |

## 2. Instructor dashboard `/dashboard/instructor`
| Page | Contents |
|---|---|
| Overview | My courses, total students, avg completion, avg quiz score, unanswered questions |
| Course builder | Course details, modules/lessons drag-and-drop, upload video (direct to Bunny via tus), attach resources, set preview lessons, drip rules |
| Quiz/exam builder | Question bank editor, CSV import, tags, time limit, pass %, randomisation |
| Students | Per-course roster, progress, last active, scores |
| Q&A | Unanswered first, reply inline |

## 3. Admin dashboard `/dashboard/admin`
| Page | Contents |
|---|---|
| Overview KPIs | Revenue (today/7d/30d, USD & PKR), new enrollments, active students, completion rate, new leads, chatbot conversations, handoffs waiting |
| Charts | Revenue over time, enrollments by course, lead sources, funnel (visit → lead → qualified → won) |
| Users | Search, filter by role, change role, suspend, impersonate-view (read-only) |
| Courses | All courses, publish/archive, assign instructor, pricing USD/PKR, bundles |
| Orders | Filter by status/provider; approve manual payments with proof preview; refunds |
| Enrollments | Grant/revoke access manually, extend expiry |
| Certificates | Issued list, revoke/reissue, regenerate PDF |
| Coupons | Create/edit, usage stats |
| Content | Pages (block editor), blog posts (markdown + SEO fields), testimonials, FAQs, specialties, landing pages |
| Chatbot | Knowledge base documents (add/edit → re-embed), conversation logs, handoff inbox, bot settings (greeting, business hours, handoff rules) |
| Settings | Site info, contact numbers, payment instructions, email templates preview, integrations status |
| Audit log | Who changed what, when |

## 4. Sales / CRM `/dashboard/sales`
| Page | Contents |
|---|---|
| Leads pipeline | Kanban by status (new → contacted → qualified → proposal → won/lost) + table view |
| Lead detail | Source, UTM, form answers, chat transcript, notes, assign, next follow-up date |
| Inbox | Live web + WhatsApp conversations flagged for human handoff; reply as agent |
| Reports | Leads by source/specialty, conversion rate, response time |

## 5. KPIs definitions
- **Completion rate** = completed enrollments / enrollments older than 30 days
- **Lead response time** = first note or agent message − lead created_at
- **Bot resolution rate** = conversations without handoff and without lead escalation / total

## 6. Build notes
- TanStack Table with server-side pagination for users/orders/leads.
- Recharts for charts; nightly Edge Function fills `daily_stats` table for fast admin charts.
- Every admin mutation writes to `audit_log`.
