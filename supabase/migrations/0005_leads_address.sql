-- "Register for AAPC Training": Address replaces City on the form (client, 2026-09-28).
-- Nullable, so earlier leads and other lead forms are unaffected. `city` stays: older AAPC
-- registrations keep theirs in `details`, and the City field can return (registrationCityField).
-- Business/contact information only — never PHI (docs/11 §1).
-- RLS: no new table. The column is covered by the existing "staff leads" policy on
-- public.leads (0001_init.sql); leads still have no public insert policy (service role only).

alter table public.leads
  add column if not exists address text;

alter table public.leads
  drop constraint if exists leads_address_length;
alter table public.leads
  add constraint leads_address_length check (address is null or char_length(address) <= 250);

comment on column public.leads.address is
  'Postal address from the AAPC registration form (house / street, area, city). Max 250 characters.';
