# 13 — Testing and QA

## 1. Automated
| Layer | Tool | Covers |
|---|---|---|
| Unit | Vitest | pricing, coupon math, grading, progress %, unlock rules, zod schemas |
| DB | pgTAP or SQL tests via Supabase CLI | RLS: student cannot read other students' data, cannot read `questions.correct`, cannot change own role |
| E2E | Playwright | sign up → verify → buy (Stripe test) → watch → quiz → exam → certificate → verify page; manual payment approval; lead form; chatbot handoff |
| Visual | Playwright screenshots | key pages at 360/768/1280 |
| Accessibility | axe via Playwright | 0 serious/critical issues |
| Performance | Lighthouse CI | ≥ 90 all categories on home, service, course, school |

## 2. Manual UAT script (client)
1. Submit free audit form → lead appears in sales dashboard + email received
2. Enroll with Stripe test card → receipt → course unlocked
3. Enroll with manual payment → admin approves → access granted
4. Watch a lesson halfway, close, reopen → resumes; finish → rewatch works
5. Take quiz, fail, retry; take timed mock exam, let it auto-submit
6. Complete course → certificate emailed → QR verifies
7. Admin revokes certificate → verify shows revoked
8. Chat on site asks about pricing → correct answer; ask for human → appears in inbox; agent reply shows in widget
9. Same via WhatsApp
10. Instructor creates course, uploads video, publishes; appears in catalog

## 3. Release checklist
- [ ] All P0 PRD items pass
- [ ] RLS tests green
- [ ] No console errors; Sentry clean on staging for 48h
- [ ] Legal pages approved
- [ ] Redirects tested
- [ ] Emails deliver (SPF/DKIM/DMARC pass)
- [ ] Stripe live keys + webhook in production
- [ ] WhatsApp number live, templates approved
- [ ] Backups verified with a test restore
- [ ] Admin training session done, handover docs delivered
