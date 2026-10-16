# Freelance Client Tool — database

Schema `freelance` in the **Atium** Supabase project (`gtgzvwfhugtondybmfut`).
These files live **outside `site/`** on purpose — nothing sensitive ships to the
public web root.

## Apply order (Supabase SQL editor)

1. **`01_schema.sql`** — schema, owner allowlist, `is_owner()`, `next_number()`,
   all tables, totals views, RLS on every table, grants (authenticated only).
2. **`02_seed.sql`** — services lookup, empty settings row, and Rob's `owners`
   row (matched by the `robby.myers@gmail.com` login).
3. **Expose the schema:** Dashboard → **Settings → API → Exposed schemas** → add
   **`freelance`** → Save. (PostgREST won't serve the schema until this is set.)

## Verify (the logged-out / non-owner access check)

Run these as an **unauthenticated** REST request (anon key). Every one should
return an error or an empty array — never data:

```bash
# URL + anon key are the publishable values already in site/freelance-client/db.js
curl "$URL/rest/v1/clients?select=*"   -H "apikey: $ANON" -H "Authorization: Bearer $ANON"
curl "$URL/rest/v1/invoices?select=*"  -H "apikey: $ANON" -H "Authorization: Bearer $ANON"
curl "$URL/rest/v1/settings?select=*"  -H "apikey: $ANON" -H "Authorization: Bearer $ANON"
```

A signed-in **non-owner** (e.g. Alyssa — she shares the Atium auth pool but is not
in `freelance.owners`) should likewise get nothing from every table.

Confirm the owner row landed:

```sql
select count(*) from freelance.owners;   -- expect 1
```

If it's 0, the email didn't match an `auth.users` row — sign in to the app once
with that email first, then re-run the owner insert in `02_seed.sql`.

## Notes

- No grants to `anon`. RLS `owner_all` gates every table on `freelance.is_owner()`.
- Document numbers come from `freelance.next_number('quote'|'invoice')` — sequential
  per calendar year, atomic (a `counters` table), so two tabs can't collide.
- Invoice/quote **totals** come from the `*_totals` views (`security_invoker`), never
  stored columns. "Overdue" is computed client-side (`status = 'sent'` and
  `due_date < today`), never stored.
