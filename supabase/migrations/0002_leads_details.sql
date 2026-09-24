-- Structured answers from lead forms (free billing audit: claim volume, billing setup,
-- role, best time to call). Business information only — never PHI (docs/11 §1).
-- RLS: covered by the existing "staff leads" policy on public.leads (0001_init.sql).

alter table public.leads
  add column if not exists details jsonb not null default '{}'::jsonb;

comment on column public.leads.details is
  'Form-specific business answers. Must never contain patient information.';
