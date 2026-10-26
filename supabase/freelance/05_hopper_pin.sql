-- ============================================================================
-- The Hopper — add pin-to-top support. Run after 03_hopper_social.sql.
-- ============================================================================
alter table freelance.hopper_tasks add column if not exists pinned_at timestamptz;
