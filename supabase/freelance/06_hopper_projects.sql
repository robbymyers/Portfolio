-- ============================================================================
-- The Hopper — move from the simple task model to the full Projects model.
-- Run after 05_hopper_pin.sql.
--
--   statuses:  unassigned · waiting_on_approval · needs_attention
--              · completed · ordered   (no "waiting on caroline")
--   subtasks:  inline checklist per project, drives the N/M progress count
--   client:    assign a project to a client  (client_id already exists)
-- ============================================================================

-- 1. Relax the old status constraint so we can re-map existing rows.
alter table freelance.hopper_tasks drop constraint if exists hopper_tasks_status_check;

-- 2. Re-map legacy statuses onto the new model.
update freelance.hopper_tasks set status = 'unassigned'          where status = 'todo';
update freelance.hopper_tasks set status = 'needs_attention'     where status = 'in_progress';
update freelance.hopper_tasks set status = 'waiting_on_approval' where status = 'waiting';
update freelance.hopper_tasks set status = 'completed'           where status = 'done';

-- 3. New default + constraint.
alter table freelance.hopper_tasks alter column status set default 'unassigned';
alter table freelance.hopper_tasks
  add constraint hopper_tasks_status_check
  check (status in ('unassigned', 'waiting_on_approval', 'needs_attention', 'completed', 'ordered'));

-- 4. Subtask checklist (one project has many subtasks).
create table if not exists freelance.hopper_subtasks (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references freelance.hopper_tasks (id) on delete cascade,
  title      text not null,
  done       boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz default now()
);
create index if not exists hopper_subtasks_task_idx on freelance.hopper_subtasks (task_id);

-- 5. RLS + grants (owner only, same policy as the rest of the schema).
alter table freelance.hopper_subtasks enable row level security;
drop policy if exists owner_all on freelance.hopper_subtasks;
create policy owner_all on freelance.hopper_subtasks
  for all to authenticated
  using (freelance.is_owner()) with check (freelance.is_owner());
grant all on freelance.hopper_subtasks to authenticated;
