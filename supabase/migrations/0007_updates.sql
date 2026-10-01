-- Updates (news / announcements) — 2026-10-02.
-- Short posts staff publish from the dashboard: shown on the home page ("Latest Updates"),
-- on /updates, and given to the chatbot. Nothing is hard-deleted: unpublish instead.

create table public.updates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null check (char_length(title) between 3 and 120),
  summary text not null check (char_length(summary) between 1 and 280),
  body_md text,
  category text not null check (category in ('course', 'batch', 'company', 'events', 'announcements')),
  image_path text,                              -- in the public "update-images" bucket (WebP)
  link_url text,
  link_label text,
  publish_at timestamptz not null default now(), -- a future date schedules the update
  expires_at timestamptz,                        -- hidden from this moment on
  pinned boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at is null or expires_at > publish_at),
  check ((link_url is null) = (link_label is null))
);

create index updates_live_idx on public.updates (status, pinned desc, publish_at desc);

alter table public.updates enable row level security;

-- Anyone may read what is live: published, its date reached, not expired.
create policy "public read live updates" on public.updates for select
  using (status = 'published' and publish_at <= now() and (expires_at is null or expires_at > now()));

-- Admins and sales manage all updates (drafts, scheduled, expired).
create policy "staff manage updates" on public.updates for all
  using (is_admin() or has_role('sales'))
  with check (is_admin() or has_role('sales'));

-- Images: public bucket (they appear on public pages), WebP only, 5 MB. Uploads go through a
-- server action that checks the role and converts the image (lib/updates/images.ts), using the
-- service role, so no storage policies are needed.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('update-images', 'update-images', true, 5242880, array['image/webp'])
on conflict (id) do nothing;

-- The chatbot's knowledge base keeps the live updates as their own document kind.
alter table public.kb_documents drop constraint if exists kb_documents_kind_check;
alter table public.kb_documents
  add constraint kb_documents_kind_check check (kind in ('site', 'pinned', 'admin', 'update'));

-- Two example updates, DRAFTS only, for the client to edit and publish.
insert into public.updates (slug, title, summary, category, link_url, link_label, status)
values
  (
    'registrations-open-next-cpc-cpb-batch',
    '[CLIENT TO CONFIRM] Registrations open for the next CPC® and CPB® batch',
    '[CLIENT TO CONFIRM] Registrations are open for the next AAPC CPC® and CPB® batch. Contact us for the start date, fees and package inclusions.',
    'batch',
    '/education/aapc-certification-pakistan#register',
    'Register Now',
    'draft'
  ),
  (
    'globalmed-aapc-strategic-partner-pakistan',
    '[CLIENT TO CONFIRM] GlobalMed Transcriptions is AAPC''s Strategic Partner in Pakistan',
    '[CLIENT TO CONFIRM] GlobalMed Transcriptions, Strategic Partner of AAPC in Pakistan for Medical Billing and Coding.',
    'company',
    '/education/aapc-certification-pakistan',
    'AAPC Certification in Pakistan',
    'draft'
  )
on conflict (slug) do nothing;
