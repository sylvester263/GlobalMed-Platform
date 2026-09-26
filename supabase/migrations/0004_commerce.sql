-- Phase 5 — Payments & enrollment: Stripe event log, atomic order fulfilment.
-- © SylJo Tech 2026

-- ---------- Orders: lookups used by checkout and the webhook ----------
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);
create unique index if not exists orders_provider_ref_key
  on public.orders (provider, provider_ref) where provider_ref is not null;
create index if not exists order_items_order_idx on public.order_items (order_id);

-- ---------- Stripe webhook events (idempotency + audit trail) ----------
-- Written only by /api/stripe/webhook with the service role. No student access.
create table public.stripe_events (
  id text primary key,                 -- Stripe event id (evt_…)
  type text not null,
  order_id uuid references public.orders(id) on delete set null,
  outcome text not null,
  received_at timestamptz not null default now()
);
alter table public.stripe_events enable row level security;
create policy "admin stripe events" on public.stripe_events for select using (is_admin());

-- ---------- Fulfilment ----------
-- Marks a pending order paid and grants (or extends) access to every course on it, in one
-- transaction. Called by the Stripe webhook (P5-2) and, later, manual-payment approval (P5-3).
-- p_amount_minor / p_currency: what the provider says was charged. When given, they must
-- match the order, so a tampered or stale session can never enroll anyone.
-- Returns 'fulfilled', 'already_paid', 'not_found', 'not_pending' or 'amount_mismatch'.
create or replace function public.fulfil_order(
  p_order uuid,
  p_provider_ref text default null,
  p_amount_minor bigint default null,
  p_currency text default null,
  p_verified_by uuid default null
) returns text
language plpgsql security definer set search_path = public as $$
declare
  o orders%rowtype;
  c record;
begin
  select * into o from orders where id = p_order for update;
  if not found then return 'not_found'; end if;
  if o.status = 'paid' then return 'already_paid'; end if;
  if o.status not in ('pending', 'awaiting_verification') then return 'not_pending'; end if;

  if p_amount_minor is not null and (
       round(o.total * 100)::bigint <> p_amount_minor
       or upper(coalesce(p_currency, '')) <> upper(o.currency)
     ) then
    return 'amount_mismatch';
  end if;

  update orders set
    status = 'paid',
    paid_at = now(),
    provider_ref = coalesce(p_provider_ref, provider_ref),
    verified_by = coalesce(p_verified_by, verified_by)
  where id = p_order;

  if o.coupon_id is not null then
    update coupons set used = used + 1 where id = o.coupon_id;
  end if;

  -- Every course on the order: direct lines plus the courses inside bundle lines.
  for c in
    select distinct cr.id, cr.access_months
    from order_items oi
    left join bundle_courses bc on bc.bundle_id = oi.bundle_id
    join courses cr on cr.id = coalesce(oi.course_id, bc.course_id)
    where oi.order_id = p_order
  loop
    insert into enrollments as e (user_id, course_id, source, status, starts_at, expires_at)
    values (
      o.user_id, c.id, 'purchase', 'active', now(),
      case when c.access_months is null then null
           else now() + make_interval(months => c.access_months) end
    )
    on conflict (user_id, course_id) do update set
      source = 'purchase',
      status = 'active',
      -- Re-purchasing extends from whichever is later: now, or the current expiry.
      starts_at = case when e.status = 'active' then e.starts_at else now() end,
      expires_at = case
        when c.access_months is null then null
        when e.status = 'active' and e.expires_at is null then null
        else greatest(now(), coalesce(e.expires_at, now())) + make_interval(months => c.access_months)
      end;
  end loop;

  return 'fulfilled';
end;
$$;

-- Server only: never callable from the browser, even by a signed-in user.
revoke execute on function public.fulfil_order(uuid, text, bigint, text, uuid) from public, anon, authenticated;
