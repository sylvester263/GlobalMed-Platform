# 08 — LMS and Certification

## 1. Content model
Course → Modules → Lessons (video, text, PDF, quiz, assignment, live link). Each lesson has position, preview flag, unlock rule.

## 2. Video
- Upload: instructor/admin uploads straight to Bunny Stream using tus resumable upload (server issues a signed upload credential).
- Playback: HLS with token authentication; token generated server-side only for enrolled users; 2-hour expiry; domain-restricted.
- Player: Plyr or Vidstack with HLS; speed 0.75–2x; captions (VTT from Bunny auto-transcribe or uploaded); keyboard shortcuts.
- **Rewatch:** any lesson can be replayed unlimited times during the access period. Completed lessons show "Watch again". Resume position saved every 15s and on pause/close.
- Anti-sharing: signed URLs, watermark overlay with student email (light, moving), concurrent-session limit (P1).

## 3. Progress rules
- Video lesson complete at ≥ 90% watched.
- Text/PDF complete on "Mark complete".
- Course progress % = completed lessons / total lessons.
- "Continue learning" = most recent `lesson_progress.updated_at`.

## 4. Drip & batches
- Unlock rules: `{ "after_lesson": id }` or `{ "days_after_enroll": n }` or `{ "date": iso }`.
- Batches (P1): named cohort with start date, live session links, and batch-scoped announcements.

## 5. Quizzes and mock exams
- Question types: single choice, multiple choice, true/false. Aiken/CSV import for bulk question banks.
- Grading happens on the server; correct answers never reach the browser before submission.
- Quiz: instant per-question feedback, attempt limit.
- Mock exam: timed (server-recorded start time; auto-submit at limit), random draw of N questions from bank by tag distribution, section score by tag, review mode with explanations after submission.
- Exam prep area: practice sets by topic (e.g. ICD-10-CM, CPT, HCPCS, modifiers, compliance) and full-length timed simulations. *Exact exam blueprints to be confirmed with client; AAPC content must not be copied.*

## 6. Completion & certificate rules
Default: all required lessons complete **and** final exam score ≥ course `pass_pct`. Configurable per course.

## 7. Certificates
- Generated with @react-pdf/renderer in an Edge Function / server route; A4 landscape.
- Contents: GlobalMed School of Billing and Coding logo, student certificate name, course title, completion date, certificate ID, QR → `/verify/[code]`, signatory, (AAPC mark only if permitted).
- Stored in private Storage; students download via signed URL.
- Public verification returns name, course, date, status only.
- Admin can revoke (status = revoked) and reissue (new code).

## 8. Notifications
Welcome to course · lesson unlocked · quiz results · certificate issued · access expiring in 7 days · new answer to your question · batch session reminder (24h + 1h).
