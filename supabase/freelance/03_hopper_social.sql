-- ============================================================================
-- Freelance Client Tool — The Hopper (task/job list) + Social Calendar
-- Run AFTER 01_schema.sql / 02_seed.sql, then run 04_social_seed.sql.
-- Same owner-only RLS pattern as the rest of the `freelance` schema.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- The Hopper — Rob's own task / job list
-- ---------------------------------------------------------------------------
create table if not exists freelance.hopper_tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  status      text not null default 'todo' check (status in ('todo', 'in_progress', 'waiting', 'done')),
  due_date    date,
  client_id   uuid references freelance.clients (id) on delete set null,  -- optional link to a client
  sort_order  int not null default 0,
  archived_at timestamptz,
  created_at  timestamptz default now()
);
create index if not exists hopper_tasks_status_idx on freelance.hopper_tasks (status);

-- ---------------------------------------------------------------------------
-- Social Calendar — Rob's own posting pipeline
-- ---------------------------------------------------------------------------
create table if not exists freelance.social_posts (
  id          uuid primary key default gen_random_uuid(),
  post_order  int,
  title       text,
  status      text not null default 'drafting' check (status in ('idea', 'drafting', 'ready', 'posted')),
  post_date   date,                       -- null = unscheduled (backlog)
  platforms   text[] not null default '{}',   -- facebook · linkedin · instagram
  pillar      text,                       -- Glow-Up · One Fix · Behind the Brand · Human · Offer · Positioning
  visual      text,                       -- internal: planned image/graphic
  notes       text,                       -- internal: do not publish
  copy        text,                       -- post body
  conversations_started int,              -- internal metric, logged after posting
  created_at  timestamptz default now()
);
create index if not exists social_posts_date_idx on freelance.social_posts (post_date);

-- ---------------------------------------------------------------------------
-- RLS + grants (owner only)
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['hopper_tasks', 'social_posts'] loop
    execute format('alter table freelance.%I enable row level security', t);
    execute format('drop policy if exists owner_all on freelance.%I', t);
    execute format('create policy owner_all on freelance.%I for all to authenticated using (freelance.is_owner()) with check (freelance.is_owner())', t);
  end loop;
end $$;

grant all on freelance.hopper_tasks to authenticated;
grant all on freelance.social_posts to authenticated;
