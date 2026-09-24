-- Phase 4 — LMS core: video state, progress integrity, notes, Q&A access, batches, files.
-- © SylJo Tech 2026

-- ---------- Helpers ----------
-- True for the course's instructor or any admin.
create or replace function public.is_course_staff(c uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select is_admin() or exists (select 1 from courses where id = c and instructor_id = auth.uid());
$$;

-- Course id for a lesson (used by policies below).
create or replace function public.lesson_course(l uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select m.course_id from lessons ls join modules m on m.id = ls.module_id where ls.id = l;
$$;

-- ---------- Lessons: video processing state + completion flag ----------
alter table public.lessons
  add column if not exists video_status text not null default 'none'
    check (video_status in ('none', 'uploading', 'processing', 'ready', 'failed')),
  add column if not exists video_meta jsonb not null default '{}'::jsonb,
  add column if not exists required boolean not null default true,
  add column if not exists pdf_path text;

comment on column public.lessons.video_meta is 'From Bunny on encode: {"captions":[{"srclang","label"}],"width","height"}';

-- Keep courses.updated_at honest (used for ISR revalidation and "recently edited").
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists courses_touch on public.courses;
create trigger courses_touch before update on public.courses
for each row execute function public.touch_updated_at();

-- ---------- Progress integrity ----------
-- 0001 let students write their own lesson_progress, including completed_at. Completion
-- feeds certificates, so writes now go through the server (service role) after it checks
-- enrollment and unlock rules. Students, instructors and admins can still read.
drop policy if exists "own progress" on public.lesson_progress;

create policy "progress read" on public.lesson_progress for select using (
  exists (
    select 1 from enrollments e
    where e.id = enrollment_id
      and (e.user_id = auth.uid() or is_course_staff(e.course_id))
  )
);

-- ---------- Lesson notes (L-4) ----------
create table public.lesson_notes (
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  body text not null default '' check (char_length(body) <= 10000),
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
alter table public.lesson_notes enable row level security;
create policy "own notes" on public.lesson_notes for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and is_enrolled(lesson_course(lesson_id)));

-- ---------- Q&A access (L-9) ----------
-- 0001: instructors couldn't read their students' questions, and answers were public.
drop policy if exists "lesson q read" on public.lesson_questions;
drop policy if exists "lesson q insert" on public.lesson_questions;
drop policy if exists "lesson a read" on public.lesson_answers;
drop policy if exists "lesson a insert" on public.lesson_answers;

create policy "lesson q read" on public.lesson_questions for select using (
  is_enrolled(lesson_course(lesson_id)) or is_course_staff(lesson_course(lesson_id))
);
create policy "lesson q insert" on public.lesson_questions for insert with check (
  user_id = auth.uid() and is_enrolled(lesson_course(lesson_id))
);
create policy "lesson q delete own" on public.lesson_questions for delete using (
  user_id = auth.uid() or is_course_staff(lesson_course(lesson_id))
);

create policy "lesson a read" on public.lesson_answers for select using (
  exists (
    select 1 from lesson_questions q
    where q.id = question_id
      and (is_enrolled(lesson_course(q.lesson_id)) or is_course_staff(lesson_course(q.lesson_id)))
  )
);
create policy "lesson a insert" on public.lesson_answers for insert with check (
  user_id = auth.uid() and exists (
    select 1 from lesson_questions q
    where q.id = question_id
      and (is_enrolled(lesson_course(q.lesson_id)) or is_course_staff(lesson_course(q.lesson_id)))
  )
);

-- ---------- Batches (L-12, P4-8) ----------
create table public.batches (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  name text not null,
  starts_at date not null,
  schedule text,
  seats int check (seats is null or seats > 0),
  created_at timestamptz not null default now()
);

create table public.batch_members (
  batch_id uuid not null references batches(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (batch_id, user_id)
);

create table public.batch_sessions (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references batches(id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  duration_min int not null default 60 check (duration_min between 15 and 480),
  join_url text check (join_url is null or join_url ~ '^https://'),
  recording_lesson_id uuid references lessons(id) on delete set null
);

create table public.batch_announcements (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references batches(id) on delete cascade,
  author_id uuid references profiles(id),
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.batches enable row level security;
alter table public.batch_members enable row level security;
alter table public.batch_sessions enable row level security;
alter table public.batch_announcements enable row level security;

create or replace function public.is_batch_member(b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from batch_members where batch_id = b and user_id = auth.uid());
$$;

-- Batch names and dates are public (the /school/batches page); membership and links are not.
create policy "batches read" on public.batches for select using (true);
create policy "batches write" on public.batches for all
  using (is_course_staff(course_id)) with check (is_course_staff(course_id));

create policy "members read" on public.batch_members for select using (
  user_id = auth.uid() or is_course_staff((select course_id from batches where id = batch_id))
);
create policy "members write" on public.batch_members for all
  using (is_course_staff((select course_id from batches where id = batch_id)))
  with check (is_course_staff((select course_id from batches where id = batch_id)));

create policy "sessions read" on public.batch_sessions for select using (
  is_batch_member(batch_id) or is_course_staff((select course_id from batches where id = batch_id))
);
create policy "sessions write" on public.batch_sessions for all
  using (is_course_staff((select course_id from batches where id = batch_id)))
  with check (is_course_staff((select course_id from batches where id = batch_id)));

create policy "announcements read" on public.batch_announcements for select using (
  is_batch_member(batch_id) or is_course_staff((select course_id from batches where id = batch_id))
);
create policy "announcements write" on public.batch_announcements for all
  using (is_course_staff((select course_id from batches where id = batch_id)))
  with check (is_course_staff((select course_id from batches where id = batch_id)));

-- ---------- Private files (PDF lessons, lesson resources) ----------
-- No storage policies: uploads use signed upload URLs issued after an ownership check,
-- downloads use short-lived signed URLs issued after an enrollment check (lib/lms/files.ts).
insert into storage.buckets (id, name, public, file_size_limit)
values ('lesson-files', 'lesson-files', false, 104857600)
on conflict (id) do nothing;

-- ---------- Course governance ----------
-- 0001's "instructor own courses" policy lets an instructor update every column of their
-- course. Publishing, pricing, access period and ownership are admin decisions (docs/07),
-- so they're enforced here as well as in the server actions — RLS alone can't express
-- column-level rules, and the anon key could otherwise bypass the UI.
create or replace function public.guard_course_admin_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- Admins and trusted server code (service role: seeding, webhooks) may change anything.
  if is_admin() or auth.role() = 'service_role' then
    return new;
  end if;
  if tg_op = 'INSERT' then
    if new.status <> 'draft' then
      raise exception 'Only admins can publish courses' using errcode = '42501';
    end if;
    return new;
  end if;
  if new.status is distinct from old.status and new.status = 'published'
     or new.instructor_id is distinct from old.instructor_id
     or new.price_usd is distinct from old.price_usd
     or new.price_pkr is distinct from old.price_pkr
     or new.access_months is distinct from old.access_months then
    raise exception 'Only admins can change publishing, pricing, access or ownership'
      using errcode = '42501';
  end if;
  return new;
end $$;

drop trigger if exists courses_guard on public.courses;
create trigger courses_guard before insert or update on public.courses
for each row execute function public.guard_course_admin_fields();
