# Freelance Client Tool — Spec

A private, single-user tool at `robbymyers.com/freelance-client` for Rob's freelance
business: client records, quotes, invoices, and social media posting calendars.
Clients never log in and never see this app. They only receive PDFs.

Follow the existing `CLAUDE.md` / `FIGMA.md` workflow. Make no independent design
decisions: reuse what's already on the site, and ask Rob when something isn't covered.

---

## 1. Constraints (read first)

- **The site is plain HTML/CSS/JS, no framework, no build step**, deployed from `site/`
  on Vercel. Build this the same way: static pages plus vanilla JS, with `supabase-js`
  loaded as an ES module (pin the version). No Next.js, no bundler.
- **A hidden URL is not security.** Everything under `site/` is public to anyone who
  types the path. The real protection is a Supabase Auth login gate plus RLS (section 2).
  Logged out, the pages show only a login form and every API call returns nothing.
- **No links to this tool anywhere on the public site.** Not in nav, footer, sitemap,
  or `robots.txt` (listing it in `robots.txt` would advertise the path).
- **Keep it out of search:** `<meta name="robots" content="noindex,nofollow">` on every
  page, plus an `X-Robots-Tag: noindex, nofollow` header for `/freelance-client/(.*)`
  in `vercel.json`.
- **Nothing sensitive inside `site/` except the app itself.** SQL files, notes, and this
  spec live outside `site/` (e.g. `supabase/freelance/`), or they get deployed publicly.
  No real client data in the repo, seeds, or screenshots.
- Supabase keys: the publishable key in client JS is fine. The service-role key never
  goes in this repo.

Suggested layout (adjust to match the site's existing conventions):

```
site/freelance-client/
  index.html        dashboard (login form when signed out)
  clients.html      list + add; client.html?id= detail
  quote.html        builder + print view
  invoice.html      builder + print view
  calendar.html     builder + print view
  settings.html
  app.js  db.js  styles.css
```

## 2. Database — schema `freelance` in the Atium Supabase project

Same pattern as Sentry: new schema, exposed in API settings, grants to `authenticated`
only (no `anon`), RLS on every table, owner allowlist.

```sql
create schema if not exists freelance;

-- allowlist; Rob only. No FK to auth.users so the schema stays portable.
create table freelance.owners (user_id uuid primary key);

create function freelance.is_owner() returns boolean
  language sql stable security definer set search_path = '' as
  $$ select exists (select 1 from freelance.owners where user_id = auth.uid()) $$;

-- repeat for every table:
alter table freelance.<t> enable row level security;
create policy owner_all on freelance.<t> for all to authenticated
  using (freelance.is_owner()) with check (freelance.is_owner());

grant usage on schema freelance to authenticated;
grant all on all tables in schema freelance to authenticated;
alter default privileges in schema freelance grant all on tables to authenticated;
```

Rob signs in with his existing Atium login. Alyssa shares that auth pool, but she isn't
in `freelance.owners`, so she sees nothing here.

**Verify after setup:** an unauthenticated REST request against every table returns an
error or empty result, and a signed-in non-owner gets nothing.

### Tables

**`settings`** (one row): business name, address, email, phone, payment instructions
(free text: PayPal and Cash App handles, who checks are payable to), default payment terms (net days), default quote validity (days), footer
text, invoice/quote counters.

**`clients`**: name, business_name, email, phone, address (optional), notes,
status (`prospect` / `active` / `past`), created_at.

**`services`** (lookup, seeded): `logo_branding`, `social_media_coaching`, `animation`,
`3d_rendering`, `ux_product_design`, with labels "Logo & Branding", "Social Media
Coaching", "Animation", "3D Rendering", "UX / Product Design".

**`engagements`** (a client can have several over time): client_id, title,
`is_retainer` bool, retainer_amount, retainer_billing_day, start_date, end_date,
status (`active` / `paused` / `complete`), notes.

**`engagement_services`** (engagement_id, service_key): many-to-many, which is how
packaging works. Any combination is valid, including all five.

**`quotes`**: number (`Q-2026-001`), client_id, engagement_id (nullable), issue_date,
valid_until, status (`draft` / `sent` / `accepted` / `declined` / `expired`), terms/notes.
**`quote_items`**: quote_id, description, quantity, unit_price, sort_order.

**`invoices`**: number (`INV-2026-001`), client_id, engagement_id (nullable),
quote_id (nullable, set when converted), issue_date, due_date,
status (`draft` / `sent` / `paid` / `void`), paid_date,
payment_method (`cash` / `check` / `paypal` / `cashapp` / `other`),
**`sentry_logged` bool default false**, terms/notes.
**`invoice_items`**: invoice_id, description, quantity, unit_price, sort_order.

- "Overdue" is computed (`status = 'sent'` and `due_date < today`), never stored.
- Totals come from a view (`security_invoker`), not stored columns.
- Numbers are sequential per year, generated by a function (`freelance.next_number`)
  so two tabs can't collide.

**`calendars`**: client_id, title, platform (free text, e.g. Facebook), subtitle,
start_month, month_count (default 3), footer_note.
**`calendar_post_types`**: calendar_id, weekday (0 = Sun), label, description, sort_order.
One row per posting day. This *is* the rhythm: Mon / Tue / Thu in the Jonathan example.
**`calendar_entries`**: calendar_id, date, title, detail, kind:
- `highlight`: bold key-moment box (e.g. "MEET THE PAINTER"); also feeds the overview
  "Key Moments" list
- `task`: bullet note on that day (e.g. "Prep giveaway graphic + rules")
- `override`: replaces that day's default post (e.g. Thanksgiving on a Thursday)

**`calendar_month_focus`**: calendar_id, month, bullets (text[]).
**`calendar_notes`**: calendar_id, heading, rows (jsonb of `{label, text}`), sort_order.
This is the overview "Giveaway Idea" box and anything like it.

## 3. Pages and behavior

**Dashboard.** Outstanding invoices (count and total), overdue list, quotes awaiting a
response, retainers with the next bill due, and **paid invoices not yet logged in
Sentry**.

**Clients.** Searchable list. Add/edit form: name, business, email, phone, address,
notes, status. Client detail shows contact info, engagements, quotes, invoices, and
calendars in one place.

**Engagements.** Checkbox list of the five services (multi-select = a package). Show
a combined label ("Logo & Branding + Social Media Coaching"). A Retainer toggle reveals
amount and billing day. Retainer invoices are **manual in v1**: a "Create this month's
invoice" button on the engagement pre-fills a draft. Nothing auto-generates or auto-sends.

**Quotes.** Pick client (and optional engagement), line items, validity, terms.
Status changes by button. **"Convert to invoice"** copies the items into a new draft
invoice and links `quote_id`.

**Invoices.** Same builder. "Mark paid" sets `paid_date` and a payment method (cash, check, PayPal, Cash App, other).
**On paid, show a banner:** "Add this payment to Sentry as income and mark it Tax
relevant", with client, invoice number, amount, and date, a **Copy details** button,
and a "Logged in Sentry" checkbox bound to `sentry_logged`. It stays on the dashboard
until checked. This is a reminder only: no automatic write into Sentry.

**Print views (quote and invoice).** One clean page: business header, bill-to, items,
total, payment instructions, terms. Output is the browser's Print → Save as PDF.
Use `@media print`, `print-color-adjust: exact`, and no app chrome.

**Calendar builder.** Pick a client, platform, start month, and length. Define the
rhythm (which weekdays, with a label and description for each post type). Add dated
entries (highlight / task / override), a "This month's focus" list per month, and
optional overview notes. Include a **Duplicate calendar** action (copy to another
client with dates shifted) since the structure will repeat.

**Calendar print view.** Mirrors the Jonathan PDF:
- Page 1 overview: title, platform/client/date range, one card per post type
  (weekday + label + description), the Key Moments list (from `highlight` entries),
  notes boxes, and a computed totals line.
- Then one landscape page per month: Sun–Sat grid, post types distinguished and
  labeled per day, entries shown on their date, a legend, and the month's focus bullets.
- **Totals must be computed, not typed.** Test case: Jonathan, Nov 2026 – Jan 2027,
  Mon/Tue/Thu = **Nov 13 · Dec 14 · Jan 12 = 39 posts**. Overrides replace a post and
  don't add one.

**Settings.** Business info, payment instructions, default terms, default validity.

## 4. Branding

Match robbymyers.com, which is already built, so **read its existing stylesheet and
reuse it**.

- **Headings / titling:** TiltingGothicFB Wide, the self-hosted font already in `site/`.
  Reuse the existing `@font-face`; don't add another copy.
- **UI and body:** SF Pro via the system stack
  `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif`
  (SF Pro can't be self-hosted; it renders natively on Apple devices, including when
  Rob prints to PDF from his Mac).
- **Color:** black, white, and orange only, using the site's existing CSS variables.
  **Variables only, no hardcoded hex.**
- **Tints and shades are approved** (Rob isn't particular). Status badges and calendar
  post types are told apart with fills vs. outlines and lighter/darker versions of
  black, white, and orange. Define the derived tints once, in this tool's stylesheet,
  from the site's existing variables (e.g. `color-mix()` against the orange and black
  variables). No new hex values and no new hues.
- **Default mapping** (use it, don't ask):
  - Invoice badges: draft = outlined gray tint; sent = outlined orange; paid = filled
    black, white text; overdue = filled orange; void = gray tint, struck through.
  - Quote badges: draft = outlined gray tint; sent = outlined orange; accepted = filled
    black; declined / expired = gray tint.
  - Calendar post types, in order: filled orange; filled black; outlined orange on light
    orange tint; outlined black; light gray tint. Cycle if a calendar has more.
  - Calendar `highlight` entries: bold filled-orange box.
  - Print views must keep fills (`print-color-adjust: exact`) and stay readable in
    black-and-white printing (labels on every post, never color alone).

## 5. Out of scope (v1)

- Client logins, approvals, uploads, or any client-facing page
- Emailing from the tool, payment processing, automatic recurring invoices
- Writing into Sentry automatically (possible later, since they share a Supabase
  project, but the intent is a link between the apps, not a merge)
- Partial payments / deposits (Rob doesn't take deposits yet; one paid state per invoice)
- Tax calculation
- Alyssa's practice: this is for freelance client billing only, with no patient or
  insurance data

## 6. Build order

1. Schema, RLS, owners row, auth gate, `noindex` header, settings page. Run the
   logged-out access check before moving on.
2. Clients and engagements.
3. Quotes and invoices, print views, paid → Sentry reminder.
4. Calendar builder and print layout, tested against the Jonathan numbers above.
5. Dashboard.

## 7. Housekeeping

- Add `freelance` to the off-limits schemas in the weekly Cowork job-search task
  (it already excludes `sentry`).
- Apply migrations through the Supabase connector; keep the SQL files in
  `supabase/freelance/` **outside `site/`**.
- Seed only `services` and Rob's `owners` row. No fake clients in production.
