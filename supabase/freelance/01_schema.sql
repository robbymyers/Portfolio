-- ============================================================================
-- Freelance Client Tool — schema, functions, views, RLS
-- Project: Atium (gtgzvwfhugtondybmfut)
-- Run this FIRST in the Supabase SQL editor, then 02_seed.sql.
-- After running: Dashboard → Settings → API → Exposed schemas → add "freelance".
-- Pattern mirrors the existing `sentry` schema: authenticated-only, RLS on
-- every table, owner allowlist. No grants to `anon`.
-- ============================================================================

create schema if not exists freelance;

-- ---------------------------------------------------------------------------
-- Owner allowlist (Rob only). No FK to auth.users so the schema stays portable.
-- ---------------------------------------------------------------------------
create table if not exists freelance.owners (
  user_id uuid primary key
);

create or replace function freelance.is_owner() returns boolean
  language sql stable security definer set search_path = '' as
  $$ select exists (select 1 from freelance.owners where user_id = auth.uid()) $$;

-- ---------------------------------------------------------------------------
-- Sequential, per-year document numbers (Q-2026-001 / INV-2026-001).
-- A dedicated counters table makes next_number atomic so two tabs can't collide.
-- ---------------------------------------------------------------------------
create table if not exists freelance.counters (
  kind  text not null,
  year  int  not null,
  value int  not null default 0,
  primary key (kind, year)
);

create or replace function freelance.next_number(p_kind text) returns text
  language plpgsql security definer set search_path = '' as $$
declare
  y int := extract(year from current_date)::int;
  v int;
  prefix text;
begin
  if not freelance.is_owner() then
    raise exception 'not authorized';
  end if;
  if p_kind not in ('quote', 'invoice') then
    raise exception 'invalid kind: %', p_kind;
  end if;
  insert into freelance.counters (kind, year, value)
       values (p_kind, y, 1)
  on conflict (kind, year)
    do update set value = freelance.counters.value + 1
  returning value into v;
  prefix := case p_kind when 'quote' then 'Q' else 'INV' end;
  return prefix || '-' || y::text || '-' || lpad(v::text, 3, '0');
end $$;

-- ---------------------------------------------------------------------------
-- Settings (single row, id = 1)
-- ---------------------------------------------------------------------------
create table if not exists freelance.settings (
  id                        int primary key default 1 check (id = 1),
  business_name             text,
  address                   text,
  email                     text,
  phone                     text,
  payment_instructions      text,          -- free text: PayPal / Cash App handles, who checks are payable to
  default_net_days          int  default 30,
  default_quote_validity    int  default 30,
  footer_text               text,
  updated_at                timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Clients
-- ---------------------------------------------------------------------------
create table if not exists freelance.clients (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  business_name text,
  email         text,
  phone         text,
  address       text,
  notes         text,
  status        text not null default 'prospect' check (status in ('prospect', 'active', 'past')),
  created_at    timestamptz default now()
);
create index if not exists clients_status_idx on freelance.clients (status);

-- ---------------------------------------------------------------------------
-- Services (lookup, seeded in 02_seed.sql)
-- ---------------------------------------------------------------------------
create table if not exists freelance.services (
  service_key text primary key,
  label       text not null,
  sort_order  int  not null default 0
);

-- ---------------------------------------------------------------------------
-- Engagements + their services (many-to-many = packaging)
-- ---------------------------------------------------------------------------
create table if not exists freelance.engagements (
  id                  uuid primary key default gen_random_uuid(),
  client_id           uuid not null references freelance.clients (id) on delete cascade,
  title               text,
  is_retainer         boolean not null default false,
  retainer_amount     numeric(12, 2),
  retainer_billing_day int,
  start_date          date,
  end_date            date,
  status              text not null default 'active' check (status in ('active', 'paused', 'complete')),
  notes               text,
  created_at          timestamptz default now()
);
create index if not exists engagements_client_idx on freelance.engagements (client_id);

create table if not exists freelance.engagement_services (
  engagement_id uuid not null references freelance.engagements (id) on delete cascade,
  service_key   text not null references freelance.services (service_key),
  primary key (engagement_id, service_key)
);

-- ---------------------------------------------------------------------------
-- Quotes
-- ---------------------------------------------------------------------------
create table if not exists freelance.quotes (
  id            uuid primary key default gen_random_uuid(),
  number        text unique,
  client_id     uuid not null references freelance.clients (id) on delete restrict,
  engagement_id uuid references freelance.engagements (id) on delete set null,
  issue_date    date default current_date,
  valid_until   date,
  status        text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined', 'expired')),
  terms         text,
  notes         text,
  created_at    timestamptz default now()
);
create index if not exists quotes_client_idx on freelance.quotes (client_id);

create table if not exists freelance.quote_items (
  id          uuid primary key default gen_random_uuid(),
  quote_id    uuid not null references freelance.quotes (id) on delete cascade,
  description text,
  quantity    numeric(12, 2) not null default 1,
  unit_price  numeric(12, 2) not null default 0,
  sort_order  int not null default 0
);
create index if not exists quote_items_quote_idx on freelance.quote_items (quote_id);

-- ---------------------------------------------------------------------------
-- Invoices
-- ---------------------------------------------------------------------------
create table if not exists freelance.invoices (
  id            uuid primary key default gen_random_uuid(),
  number        text unique,
  client_id     uuid not null references freelance.clients (id) on delete restrict,
  engagement_id uuid references freelance.engagements (id) on delete set null,
  quote_id      uuid references freelance.quotes (id) on delete set null,
  issue_date    date default current_date,
  due_date      date,
  status        text not null default 'draft' check (status in ('draft', 'sent', 'paid', 'void')),
  paid_date     date,
  payment_method text check (payment_method in ('cash', 'check', 'paypal', 'cashapp', 'other')),
  sentry_logged boolean not null default false,
  terms         text,
  notes         text,
  created_at    timestamptz default now()
);
create index if not exists invoices_client_idx on freelance.invoices (client_id);
create index if not exists invoices_status_due_idx on freelance.invoices (status, due_date);

create table if not exists freelance.invoice_items (
  id          uuid primary key default gen_random_uuid(),
  invoice_id  uuid not null references freelance.invoices (id) on delete cascade,
  description text,
  quantity    numeric(12, 2) not null default 1,
  unit_price  numeric(12, 2) not null default 0,
  sort_order  int not null default 0
);
create index if not exists invoice_items_invoice_idx on freelance.invoice_items (invoice_id);

-- ---------------------------------------------------------------------------
-- Calendars (social posting plans)
-- ---------------------------------------------------------------------------
create table if not exists freelance.calendars (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references freelance.clients (id) on delete cascade,
  title       text,
  platform    text,              -- free text, e.g. Facebook
  subtitle    text,
  start_month date,              -- first of the month
  month_count int not null default 3,
  footer_note text,
  created_at  timestamptz default now()
);
create index if not exists calendars_client_idx on freelance.calendars (client_id);

-- One row per posting weekday — this is the rhythm (e.g. Mon / Tue / Thu).
create table if not exists freelance.calendar_post_types (
  id          uuid primary key default gen_random_uuid(),
  calendar_id uuid not null references freelance.calendars (id) on delete cascade,
  weekday     int not null check (weekday between 0 and 6),   -- 0 = Sun
  label       text,
  description text,
  sort_order  int not null default 0
);
create index if not exists calendar_post_types_cal_idx on freelance.calendar_post_types (calendar_id);

create table if not exists freelance.calendar_entries (
  id          uuid primary key default gen_random_uuid(),
  calendar_id uuid not null references freelance.calendars (id) on delete cascade,
  date        date not null,
  title       text,
  detail      text,
  kind        text not null check (kind in ('highlight', 'task', 'override'))
);
create index if not exists calendar_entries_cal_idx on freelance.calendar_entries (calendar_id);

create table if not exists freelance.calendar_month_focus (
  id          uuid primary key default gen_random_uuid(),
  calendar_id uuid not null references freelance.calendars (id) on delete cascade,
  month       date not null,     -- first of the month
  bullets     text[] not null default '{}'
);
create index if not exists calendar_month_focus_cal_idx on freelance.calendar_month_focus (calendar_id);

create table if not exists freelance.calendar_notes (
  id          uuid primary key default gen_random_uuid(),
  calendar_id uuid not null references freelance.calendars (id) on delete cascade,
  heading     text,
  rows        jsonb not null default '[]',   -- [{label, text}, ...]
  sort_order  int not null default 0
);
create index if not exists calendar_notes_cal_idx on freelance.calendar_notes (calendar_id);

-- ---------------------------------------------------------------------------
-- Totals views (security_invoker: RLS on the base tables still applies)
-- ---------------------------------------------------------------------------
create or replace view freelance.quote_totals with (security_invoker = on) as
  select q.id as quote_id,
         coalesce(sum(qi.quantity * qi.unit_price), 0)::numeric(12, 2) as total
    from freelance.quotes q
    left join freelance.quote_items qi on qi.quote_id = q.id
   group by q.id;

create or replace view freelance.invoice_totals with (security_invoker = on) as
  select i.id as invoice_id,
         coalesce(sum(ii.quantity * ii.unit_price), 0)::numeric(12, 2) as total
    from freelance.invoices i
    left join freelance.invoice_items ii on ii.invoice_id = i.id
   group by i.id;

-- ---------------------------------------------------------------------------
-- Row Level Security — owner-only on every table
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'owners','counters','settings','clients','services','engagements',
    'engagement_services','quotes','quote_items','invoices','invoice_items',
    'calendars','calendar_post_types','calendar_entries','calendar_month_focus','calendar_notes'
  ] loop
    execute format('alter table freelance.%I enable row level security', t);
    execute format('drop policy if exists owner_all on freelance.%I', t);
    execute format(
      'create policy owner_all on freelance.%I for all to authenticated using (freelance.is_owner()) with check (freelance.is_owner())', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Grants — authenticated only, never anon
-- ---------------------------------------------------------------------------
grant usage on schema freelance to authenticated;
grant all on all tables in schema freelance to authenticated;          -- includes the views
alter default privileges in schema freelance grant all on tables to authenticated;

revoke all on schema freelance from anon;
revoke execute on all functions in schema freelance from anon, public;
grant execute on function freelance.is_owner() to authenticated;
grant execute on function freelance.next_number(text) to authenticated;
