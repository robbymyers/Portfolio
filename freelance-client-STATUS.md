# Freelance Client Tool — Build Status

A private, single-user tool at **robbymyers.com/freelance-client** for Rob's
freelance business: clients, quotes, invoices, a task board (The Hopper), and a
social-content calendar. Clients never log in — they only receive PDFs.

_Last updated: 2026-10-26_

---

## 1. What it is

Plain **static HTML/CSS/JS, no framework, no build step** — same stack as the
rest of robbymyers.com. `supabase-js` is loaded as a pinned ES module from a CDN.
Deployed on Vercel from `site/`. Every page is `noindex` + carries an
`X-Robots-Tag: noindex, nofollow` header (`site/vercel.json`), and nothing is
linked from the public site.

Access is a Supabase Auth login gate + RLS. Logged out, pages show only a login
form and every query returns nothing.

---

## 2. Stack & architecture

| Layer | Choice |
|---|---|
| UI | Static HTML + vanilla JS (ES modules), one stylesheet |
| Backend | Supabase — **Atium** project (`gtgzvwfhugtondybmfut`), schema `freelance` |
| Auth | Supabase Auth (email/password). Owner allowlist (`freelance.owners`) |
| Hosting | Vercel (project `website`, root dir `site/`) |

**Files** (`site/freelance-client/`): `db.js` (client + helpers),
`app.js` (shell, sidebar nav, auth gate, utilities, toast, `formatDoc`),
`styles.css`, and one page per view (`index`, `clients`, `client`, `quote`,
`invoice`, `calendar`, `hopper`, `social`, `settings`).

**Applying SQL:** the Supabase `execute_sql`/`apply_migration` connector tools
are blocked in the build sessions, so migrations are written as files in
`supabase/freelance/` (outside `site/`) and **Rob runs them himself** in the
Supabase SQL editor (`pbcopy < file` → paste → Run). After new DDL the schema is
already exposed, so new tables serve automatically.

---

## 3. Data model (schema `freelance`, RLS owner-only on every table)

- **`owners`** — allowlist (Rob's `auth.uid()`); `is_owner()` gates every policy.
- **`counters`** + `next_number('quote'|'invoice')` — atomic, per-year document
  numbers (`Q-2026-001` / `INV-2026-001`).
- **`settings`** — single row: business info, payment instructions, default
  terms / validity, footer.
- **`clients`** — name, business, email, phone, address, notes, status
  (prospect / active / past).
- **`services`** (seeded lookup) + **`engagements`** + **`engagement_services`**
  — multi-service packaging, retainer fields.
- **`quotes`** / **`quote_items`**, **`invoices`** / **`invoice_items`** — totals
  come from `*_totals` views (`security_invoker`); "overdue" is computed, never
  stored; `invoices.sentry_logged` drives the income-logging reminder.
- **`calendars`** + `calendar_post_types` / `calendar_entries` /
  `calendar_month_focus` / `calendar_notes` — per-client social calendars.
- **`hopper_tasks`** — Rob's task board: title, description, status (todo /
  in_progress / waiting / done), due_date, client_id, `sort_order`, `pinned_at`,
  `archived_at`.
- **`social_posts`** — Rob's own post pipeline: order, title, status (idea /
  drafting / ready / posted), post_date, platforms[], pillar, visual, notes,
  copy, conversations_started.

**Migrations** (`supabase/freelance/`): `01_schema.sql`, `02_seed.sql`,
`03_hopper_social.sql`, `04_social_seed.sql` _(gitignored — contains post copy)_,
`05_hopper_pin.sql`.

---

## 4. Pages & features

**Navigation** — left sidebar on desktop, hamburger + drawer on mobile:
Dashboard · Clients · The Hopper · Social Calendar · Settings.

- **Dashboard** — outstanding / overdue invoices, quotes out, retainers' next
  bill, and paid-invoices-not-yet-logged-in-Sentry.
- **Clients** — searchable list; detail page shows engagements, quotes,
  invoices, calendars; inline add/edit.
- **Quotes / Invoices** — line-item builder, status buttons, convert-quote-to-
  invoice, mark-paid + Sentry reminder, **inline "+ New client"** (creates a
  prospect without leaving the page), and a clean **Print / Save PDF** view.
  Terms/Notes keep typed line breaks and get light formatting (short standalone
  lines after a blank line become bold headers; `**bold**` / `*italic*` inline).
- **Client calendars** — Calendar / List / Edit views, reference-matched month
  grid (color-coded post types, key moments, focus bar), computed post totals,
  duplicate-with-date-shift, Print/PDF.
- **The Hopper** — task board. Status filter chips, quick-complete checkboxes,
  overdue highlighting, drag-to-reorder, **pin-to-top**, and per-row **pin /
  delete** icons on hover. Add/edit/delete in a dialog.
- **Social Calendar** — Rob's post pipeline. Calendar view (month grid, pillar-
  colored, prev/next) + Pipeline list (scheduled + backlog), status filters,
  drag a post to another day to reschedule, drag rows to reorder, full-copy
  detail/edit.
- **Settings** — business info, payment instructions, defaults.

**Cross-cutting**
- **Toasts** render inside the open modal (and move to the body on close) so
  validation / errors / "saved" confirmations are visible — fixing a class of
  "Save does nothing" bugs where feedback was hidden behind the top-layer dialog.
- All dialogs: X close + Cancel + a Save that runs via a direct click handler
  with try/catch, so failures surface instead of failing silently.

---

## 5. Open items / next up

- Touch drag-and-drop (reorder/reschedule) is desktop/mouse only; on mobile use
  the edit form fields.
- "Archive" exists on `hopper_tasks` but the Hopper UI uses delete (trash) per
  request; archive could be surfaced later if wanted.
- Per-month phase labels on client calendars (e.g. "Month 1 · Foundation") are
  not yet editable — currently shows "Month N".
