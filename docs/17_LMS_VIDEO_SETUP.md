# 17 — LMS and video setup runbook (Bunny Stream)

How to connect the Phase 4 LMS to Bunny Stream and Supabase Storage, and what to check in the first staging session. Code: `lib/video/*`, `app/api/video/*`, `app/api/progress`, `lib/lms/*`, migration `0003_lms.sql`.

## 1. Supabase

1. Apply `supabase/migrations/0003_lms.sql` (after 0001 and 0002). It creates:
   - lesson video state (`video_status`, `video_meta`)
   - `required` and `pdf_path` on lessons
   - notes, batches and the course-governance trigger
   - the private `lesson-files` storage bucket (100 MB per object)
2. Regenerate the real types: `supabase gen types typescript --project-id <id> > lib/db/types.ts`. They replace the provisional file from `scripts/gen-provisional-types.mjs`.
3. Check that the `lesson-files` bucket is **private**. Downloads always go through 10-minute signed URLs.

## 2. Bunny Stream library

1. In Bunny, go to **Stream → Add Video Library**. Name it `globalmed-<env>`, one library per environment. Choose replication regions near the US and Pakistan.
2. Library **API** tab:
   - Library ID → `BUNNY_STREAM_LIBRARY_ID`
   - API key → `BUNNY_STREAM_API_KEY` (server only, never sent to the browser)
   - CDN hostname (e.g. `vz-abc123.b-cdn.net`) → `BUNNY_CDN_HOSTNAME`
3. **Security** tab:
   - Turn on **Token authentication**. Copy the key → `BUNNY_STREAM_TOKEN_AUTH_KEY`.
   - Turn **off** "Allow direct play" and the public embed/"MP4 fallback" downloads.
   - Add the site domains (and the Vercel preview domain) to **Allowed referrers**.
4. **Encoding** tab: enable 360p, 480p, 720p and 1080p. Enable caption generation if the client wants auto-captions (review them before publishing).
5. **Webhook** tab:
   - Webhook URL: `https://<domain>/api/video/webhook?token=<BUNNY_WEBHOOK_SECRET>`
   - Generate the secret with `openssl rand -hex 32`.
   - The route re-reads the video from the Bunny API rather than trusting the payload, so a forged call can at most trigger a refresh.

Add all five variables to Vercel (Production and Preview) and to `.env.local`.

## 3. How it fits together

| Step | Where | Notes |
|---|---|---|
| Instructor picks a file | `components/lms/builder/video-uploader.tsx` | Up to 5 GB; tus upload with resume and retries |
| Upload credentials | `POST /api/video/upload` | Course staff only; creates the Bunny video; returns a signature valid for 6 h |
| Upload finished | `markVideoUploaded` → status `processing` | |
| Encoding finished | Bunny webhook → status `ready` + duration | "Check status" button does the same by hand |
| Student presses play | `GET /api/video/token` | Enrolled, unlocked lesson (or free preview); 2 h signed HLS URL + resume point |
| Progress | `POST /api/progress` (beacon) | Only the server writes `lesson_progress`; position jumps are clamped; video completes at 90% |

## 4. Verify in the first staging session

The two signing formats are implemented from Bunny's documentation but have **not yet been checked against a live library** (`lib/video/bunny-signing.ts`).

1. **TUS upload signature**
   - Formula: `sha256_hex(libraryId + apiKey + expires + videoId)`.
   - Test: upload a short MP4 from the lesson editor.
   - Result: the video appears in the Bunny library, and the lesson moves to *Processing*, then *Ready*.
   - A 401 from `video.bunnycdn.com` means the signature format is wrong.
2. **CDN directory token**
   - Token: `base64url(sha256_raw(tokenKey + "/<videoId>/" + expires + "token_path=/<videoId>/"))`, in the path form `https://<cdn>/bcdn_token=…&expires=…&token_path=%2F<videoId>%2F/<videoId>/playlist.m3u8`.
   - Test: open the lesson as an enrolled student.
   - Pass criteria: the playlist **and** the segment files load (check the Network tab). The same URL fails after `expires`, and fails without the token.
   - If segments return 403, compare against Bunny's current "token authentication (directory)" docs and adjust `signedDirectoryUrl`. `tests/unit/bunny-signing.test.ts` pins the current format.
3. **Webhook**
   - Test: finish an upload, then look at the lesson row.
   - Result: `video_status = ready` and `duration_sec` is set.
   - Also check that a request with a wrong `token` gets a 401.
4. **Progress integrity**
   - Test: from the browser console, POST `{lessonId, positionSec: 99999}` to `/api/progress`.
   - Result: the stored position is capped (at most 60 s on the first save), and the lesson is **not** marked complete.
5. **Governance**
   - Test: as an instructor, try to publish a course or change its price through the Supabase REST API with the anon key.
   - Result: the `guard_course_admin_fields` trigger rejects it.

## 5. Course staff and roles

- Instructors edit only courses where `courses.instructor_id` is them.
- Admins (with MFA, aal2) edit all courses. Only admins can:
  - publish or archive
  - set USD/PKR prices and the access period
  - assign the instructor
- Every staff change to courses, lessons, videos and batches is written to `audit_log`.
- Batches:
  - Only students with an **active** enrollment in the course can be added.
  - Join links are shown only to members whose access is still active.
  - Session times are stored in UTC and shown in each viewer's time zone.

## 6. Public catalog vs LMS courses (ADR-022)

Until Phase 8, the public course pages (`/school/courses/<slug>`) come from `content/courses.ts`. The LMS reads courses from the database. When you create a course in the builder, give it the **same slug** as its catalog entry, so the catalog's links (enroll, preview) land on the right `/learn/<slug>`.

## 7. Privacy

- Lesson files, notes and Q&A are study material only.
- The Q&A composer and batch announcements repeat the rule: **no patient information** (CLAUDE.md §6).
- The player watermark shows the learner's email to discourage screen recording. It is not stored anywhere new.
