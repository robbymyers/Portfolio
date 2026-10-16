-- ============================================================================
-- Freelance Client Tool — seed
-- Run AFTER 01_schema.sql. Seeds only the services lookup and Rob's owner row.
-- No fake clients in production.
-- ============================================================================

-- Services lookup
insert into freelance.services (service_key, label, sort_order) values
  ('logo_branding',        'Logo & Branding',       1),
  ('social_media_coaching','Social Media Coaching', 2),
  ('animation',            'Animation',             3),
  ('3d_rendering',         '3D Rendering',          4),
  ('ux_product_design',    'UX / Product Design',   5)
on conflict (service_key) do update
  set label = excluded.label, sort_order = excluded.sort_order;

-- Settings single row (empty — Rob fills it in from the Settings page)
insert into freelance.settings (id) values (1)
on conflict (id) do nothing;

-- Owner allowlist — Rob only, by his Atium login email.
insert into freelance.owners (user_id)
  select id from auth.users where email = 'robby.myers@gmail.com'
on conflict (user_id) do nothing;
