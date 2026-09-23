-- GlobalMed platform — initial schema
-- © SylJo Tech 2026

create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- ---------- Enums ----------
create type user_role as enum ('student','instructor','sales','admin');
create type course_status as enum ('draft','published','archived');
create type lesson_type as enum ('video','text','pdf','quiz','assignment','live');
create type enrollment_status as enum ('active','expired','revoked');
create type order_status as enum ('pending','awaiting_verification','paid','failed','refunded','cancelled');
create type quiz_kind as enum ('quiz','exam');
create type lead_status as enum ('new','contacted','qualified','proposal','won','lost');
create type cert_status as enum ('valid','revoked');
create type chat_channel as enum ('web','whatsapp');

-- ---------- Profiles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  certificate_name text,
  role user_role not null default 'student',
  country text,
  phone text,
  avatar_path text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.has_role(r user_role) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = r);
$$;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------- Catalog ----------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  type text not null check (type in ('course','post'))
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text,
  description_md text,
  outcomes text[],
  level text check (level in ('beginner','intermediate','advanced')),
  category_id uuid references categories(id),
  instructor_id uuid references profiles(id),
  thumbnail_path text,
  price_usd numeric(10,2) not null default 0,
  price_pkr numeric(12,2),
  access_months int,            -- null = lifetime
  pass_pct int not null default 70,
  status course_status not null default 'draft',
  seo jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  position int not null default 0
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules(id) on delete cascade,
  type lesson_type not null default 'video',
  title text not null,
  position int not null default 0,
  bunny_video_id text,
  duration_sec int,
  content_md text,
  live_url text,
  is_preview boolean not null default false,
  unlock_rule jsonb default '{}'::jsonb
);

create table public.lesson_resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  label text not null,
  storage_path text not null
);

-- ---------- Enrollment & progress ----------
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  source text not null default 'purchase',
  status enrollment_status not null default 'active',
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  completed_at timestamptz,
  unique (user_id, course_id)
);

create or replace function public.is_enrolled(c uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from enrollments
    where user_id = auth.uid() and course_id = c and status = 'active'
      and (expires_at is null or expires_at > now())
  );
$$;

create table public.lesson_progress (
  enrollment_id uuid not null references enrollments(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  position_sec int not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (enrollment_id, lesson_id)
);

-- ---------- Assessment ----------
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  lesson_id uuid references lessons(id) on delete set null,
  kind quiz_kind not null default 'quiz',
  title text not null,
  time_limit_min int,
  pass_pct int not null default 70,
  attempts_allowed int,
  question_count int,
  randomize boolean not null default true
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  type text not null check (type in ('single','multi','truefalse')),
  prompt text not null,
  options jsonb not null,
  correct jsonb not null,
  explanation text,
  tag text
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  question_ids uuid[] not null,
  answers jsonb default '{}'::jsonb,
  score_pct numeric(5,2),
  passed boolean,
  started_at timestamptz not null default now(),
  submitted_at timestamptz
);

-- ---------- Commerce ----------
create table public.bundles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  price_usd numeric(10,2) not null,
  price_pkr numeric(12,2)
);
create table public.bundle_courses (
  bundle_id uuid references bundles(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  primary key (bundle_id, course_id)
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  kind text not null check (kind in ('percent','fixed')),
  value numeric(10,2) not null,
  max_uses int,
  used int not null default 0,
  expires_at timestamptz,
  active boolean not null default true
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  status order_status not null default 'pending',
  currency text not null default 'USD',
  subtotal numeric(12,2) not null,
  discount numeric(12,2) not null default 0,
  total numeric(12,2) not null,
  coupon_id uuid references coupons(id),
  provider text not null check (provider in ('stripe','manual')),
  provider_ref text,
  proof_path text,
  verified_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  course_id uuid references courses(id),
  bundle_id uuid references bundles(id),
  price numeric(12,2) not null
);

-- ---------- Certificates ----------
create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  code text unique not null default upper(substr(encode(gen_random_bytes(8),'hex'),1,12)),
  user_id uuid not null references profiles(id),
  course_id uuid not null references courses(id),
  name_on_cert text not null,
  issued_at timestamptz not null default now(),
  pdf_path text,
  status cert_status not null default 'valid'
);

create or replace function public.verify_certificate(p_code text)
returns table (name_on_cert text, course_title text, issued_at timestamptz, status cert_status)
language sql stable security definer set search_path = public as $$
  select c.name_on_cert, co.title, c.issued_at, c.status
  from certificates c join courses co on co.id = c.course_id
  where c.code = upper(p_code);
$$;

-- ---------- CRM ----------
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  source text not null,            -- audit_form | contact | chatbot | whatsapp | course_enquiry | landing:<slug>
  name text,
  email text,
  phone text,
  practice_name text,
  specialty text,
  interest text,
  message text,
  utm jsonb default '{}'::jsonb,
  status lead_status not null default 'new',
  assigned_to uuid references profiles(id),
  created_at timestamptz not null default now()
);
create table public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  author_id uuid references profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

-- ---------- CMS ----------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body_md text,
  cover_path text,
  category_id uuid references categories(id),
  author_id uuid references profiles(id),
  seo jsonb default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz
);
create table public.pages (slug text primary key, blocks jsonb not null default '[]'::jsonb, seo jsonb default '{}'::jsonb, updated_at timestamptz default now());
create table public.testimonials (id uuid primary key default gen_random_uuid(), name text, role text, quote text, audience text, published boolean default false);
create table public.faqs (id uuid primary key default gen_random_uuid(), question text, answer text, topic text, position int default 0, published boolean default true);
create table public.settings (key text primary key, value jsonb);

-- ---------- Chatbot ----------
create table public.kb_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text,
  body text not null,
  updated_at timestamptz default now()
);
create table public.kb_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references kb_documents(id) on delete cascade,
  content text not null,
  embedding vector(1536)
);
create index on public.kb_chunks using hnsw (embedding vector_cosine_ops);

create or replace function public.match_kb(query_embedding vector(1536), match_count int default 5)
returns table (id uuid, content text, similarity float)
language sql stable as $$
  select id, content, 1 - (embedding <=> query_embedding) as similarity
  from kb_chunks order by embedding <=> query_embedding limit match_count;
$$;

create table public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  channel chat_channel not null,
  visitor_id text,
  wa_id text,
  lead_id uuid references leads(id),
  handoff boolean not null default false,
  assigned_to uuid references profiles(id),
  created_at timestamptz not null default now(),
  last_message_at timestamptz default now()
);
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references chat_conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant','agent')),
  content text not null,
  created_at timestamptz not null default now()
);

-- ---------- Community / misc ----------
create table public.lesson_questions (id uuid primary key default gen_random_uuid(), lesson_id uuid references lessons(id) on delete cascade, user_id uuid references profiles(id), body text not null, created_at timestamptz default now());
create table public.lesson_answers (id uuid primary key default gen_random_uuid(), question_id uuid references lesson_questions(id) on delete cascade, user_id uuid references profiles(id), body text not null, created_at timestamptz default now());
create table public.notifications (id uuid primary key default gen_random_uuid(), user_id uuid references profiles(id) on delete cascade, title text, body text, link text, read_at timestamptz, created_at timestamptz default now());
create table public.audit_log (id bigint generated always as identity primary key, actor_id uuid, action text, entity text, entity_id text, diff jsonb, created_at timestamptz default now());

-- ---------- RLS ----------
alter table profiles enable row level security;
alter table categories enable row level security;
alter table courses enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table lesson_resources enable row level security;
alter table enrollments enable row level security;
alter table lesson_progress enable row level security;
alter table quizzes enable row level security;
alter table questions enable row level security;
alter table quiz_attempts enable row level security;
alter table bundles enable row level security;
alter table bundle_courses enable row level security;
alter table coupons enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table certificates enable row level security;
alter table leads enable row level security;
alter table lead_notes enable row level security;
alter table posts enable row level security;
alter table pages enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table settings enable row level security;
alter table kb_documents enable row level security;
alter table kb_chunks enable row level security;
alter table chat_conversations enable row level security;
alter table chat_messages enable row level security;
alter table lesson_questions enable row level security;
alter table lesson_answers enable row level security;
alter table notifications enable row level security;
alter table audit_log enable row level security;

-- Profiles
create policy "own profile read" on profiles for select using (id = auth.uid() or is_admin());
create policy "own profile update" on profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));
create policy "admin profiles" on profiles for all using (is_admin());

-- Public catalog / content
create policy "public categories" on categories for select using (true);
create policy "public published courses" on courses for select using (status = 'published' or instructor_id = auth.uid() or is_admin());
create policy "instructor own courses" on courses for all using (instructor_id = auth.uid() or is_admin());
create policy "modules readable" on modules for select using (exists (select 1 from courses c where c.id = course_id and (c.status='published' or c.instructor_id = auth.uid() or is_admin())));
create policy "modules write" on modules for all using (exists (select 1 from courses c where c.id = course_id and (c.instructor_id = auth.uid() or is_admin())));
create policy "lessons readable" on lessons for select using (
  is_preview or is_admin() or exists (
    select 1 from modules m join courses c on c.id = m.course_id
    where m.id = module_id and (is_enrolled(c.id) or c.instructor_id = auth.uid())));
create policy "lessons write" on lessons for all using (exists (select 1 from modules m join courses c on c.id=m.course_id where m.id = module_id and (c.instructor_id = auth.uid() or is_admin())));
create policy "resources readable" on lesson_resources for select using (exists (select 1 from lessons l join modules m on m.id=l.module_id where l.id = lesson_id and (is_enrolled(m.course_id) or is_admin())));
create policy "public posts" on posts for select using (status = 'published' or is_admin());
create policy "admin posts" on posts for all using (is_admin());
create policy "public pages" on pages for select using (true);
create policy "admin pages" on pages for all using (is_admin());
create policy "public testimonials" on testimonials for select using (published or is_admin());
create policy "admin testimonials" on testimonials for all using (is_admin());
create policy "public faqs" on faqs for select using (published or is_admin());
create policy "admin faqs" on faqs for all using (is_admin());
create policy "public bundles" on bundles for select using (true);
create policy "public bundle courses" on bundle_courses for select using (true);
create policy "admin bundles" on bundles for all using (is_admin());
create policy "admin settings" on settings for all using (is_admin());

-- Learning data
create policy "own enrollments" on enrollments for select using (user_id = auth.uid() or is_admin()
  or exists (select 1 from courses c where c.id = course_id and c.instructor_id = auth.uid()));
create policy "admin enrollments" on enrollments for all using (is_admin());
create policy "own progress" on lesson_progress for all using (exists (select 1 from enrollments e where e.id = enrollment_id and e.user_id = auth.uid()) or is_admin());
create policy "quizzes readable" on quizzes for select using (is_enrolled(course_id) or is_admin() or exists (select 1 from courses c where c.id=course_id and c.instructor_id=auth.uid()));
create policy "quizzes write" on quizzes for all using (is_admin() or exists (select 1 from courses c where c.id=course_id and c.instructor_id=auth.uid()));
-- questions: NO student select policy. Students receive questions (without answers) via server route using service role.
create policy "questions staff" on questions for all using (is_admin() or exists (select 1 from quizzes q join courses c on c.id=q.course_id where q.id=quiz_id and c.instructor_id=auth.uid()));
create policy "own attempts" on quiz_attempts for select using (user_id = auth.uid() or is_admin());
create policy "own certs" on certificates for select using (user_id = auth.uid() or is_admin());
create policy "admin certs" on certificates for all using (is_admin());
create policy "lesson q read" on lesson_questions for select using (exists (select 1 from lessons l join modules m on m.id=l.module_id where l.id=lesson_id and (is_enrolled(m.course_id) or is_admin())));
create policy "lesson q insert" on lesson_questions for insert with check (user_id = auth.uid());
create policy "lesson a read" on lesson_answers for select using (true);
create policy "lesson a insert" on lesson_answers for insert with check (user_id = auth.uid());
create policy "own notifications" on notifications for all using (user_id = auth.uid());

-- Commerce (writes happen server-side with service role)
create policy "own orders" on orders for select using (user_id = auth.uid() or is_admin());
create policy "own order items" on order_items for select using (exists (select 1 from orders o where o.id=order_id and (o.user_id = auth.uid() or is_admin())));
create policy "admin coupons" on coupons for all using (is_admin());

-- CRM & chat (staff only; public inserts go through server actions)
create policy "staff leads" on leads for all using (is_admin() or has_role('sales'));
create policy "staff lead notes" on lead_notes for all using (is_admin() or has_role('sales'));
create policy "staff conversations" on chat_conversations for all using (is_admin() or has_role('sales'));
create policy "staff messages" on chat_messages for all using (is_admin() or has_role('sales'));
create policy "admin kb" on kb_documents for all using (is_admin());
create policy "admin kb chunks" on kb_chunks for all using (is_admin());
create policy "admin audit" on audit_log for select using (is_admin());

grant execute on function public.verify_certificate(text) to anon, authenticated;
