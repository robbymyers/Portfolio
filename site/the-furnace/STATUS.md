# The Furnace — Build Status

Internal project management tool for Shadrachs Coffee. Replaces a Monday/Trello
trial-and-error period and a running Google Doc of marketing tasks with one
shared, always-current source of truth.

**Live:** https://the-furnace-zeta.vercel.app
**Status as of 2026-09-14:** v1 complete and in real use. All work is committed
locally; nothing has been pushed to GitHub yet.

---

## 1. What got built

Everything below was built from scratch in one session, starting from a repo
containing only `CLAUDE.md`, six SF Pro font files, and three SVG logos.

### Projects — the home view
Replaces the marketing graphics Google Doc.

- Color-coded list, one row per project, status stripe down the left edge
- Rows with subtasks expand inline into a checklist; rows without render flat
- Filter chips per status, plus a "Due soon" chip that appears only when
  something is actually due
- Free-text search across titles, descriptions, and subtask titles
- Due-soon highlighting (within 2 days, not completed) computed at render time
  — nothing stored, no cron
- Detail slide-over: status, assignee, description with auto-linked URLs,
  subtask checklist with progress bar, linked approval files
- Pin any project to the top, in its own labelled group
- Archive a project off the board, individually or in bulk

### Social Calendar
- Month grid with prev / next / today navigation
- Posts render as colored chips on desktop, dots on mobile
- Click a day for a panel listing that day's posts, or to add one
- Draft / scheduled / posted, free-text platform, optional link to an approval file

### Approvals
- Drag-and-drop or browse upload, JPEG and PDF, 25 MB cap
- Thumbnail grid for images, icon + filename for PDFs
- Approve or request changes, with reviewer notes saved alongside the decision
- Attributed and timestamped: who uploaded, who reviewed, when
- Pending count drives a badge in the sidebar

### Dashboard
Doubles as the notification surface, since there is no email layer in v1.

- Due in 2 days, pending approvals, posts this week
- Due-soon list, waiting-on-review list, next 7 days of calendar
- Recent activity feed across projects and files

### Archive
- Everything taken off the board, newest first
- Shows when it was archived and what it was due
- Restore back to the board, or delete permanently behind a confirm

### Cross-cutting
- Invite-only email/password auth, plus an email sign-in link option
- Light/dark mode, stored per device, applied before first paint so there is no
  flash of the wrong theme on reload
- Responsive throughout: sidebar on desktop, five-tab bar on mobile
- Account settings for display name and password

---

## 2. Stack and architecture

| Layer | Choice |
|---|---|
| Framework | Next.js 16.3.4, App Router, Turbopack |
| UI | React 19.2.8, Tailwind CSS 4 |
| Backend | Supabase — Postgres 17, Auth, Storage |
| Hosting | Vercel (project `the-furnace`) |
| Language | TypeScript, strict |

**Data flow.** Pages fetch initial data in server components; interaction and
writes happen client-side against Supabase with RLS enforcing access. Writes are
optimistic and revert on failure, so the UI never waits on a round trip for a
checkbox or a status change.

**Joins in JS, not embedded selects.** Projects, subtasks, files, and profiles
are four flat queries stitched together in JavaScript. At this table size it is
comfortably fast and it keeps the generated types simple.

**40 source files, ~5,150 lines** of TypeScript, TSX, and CSS.

---

## 3. Data model

Five tables, all with RLS enabled. 19 policies on `public`, 4 on the storage
bucket.

- **`profiles`** — one row per user, auto-created by an `on_auth_user_created`
  trigger. Exists for attribution, not access control.
- **`projects`** — title, description, status, due date, assignee, plus
  `pinned_at` and `archived_at`.
- **`project_subtasks`** — `ON DELETE CASCADE` from projects, ordered by
  `sort_order`.
- **`social_posts`** — scheduled date, platform, content, status, optional link
  to a file.
- **`files`** — Storage path, type, status, reviewer notes, reviewer, timestamps.
  Optional project link via `ON DELETE SET NULL`, so deleting a project leaves
  its files standing as standalone items.

**Project statuses:** `unassigned` (default), `waiting_on_caroline`,
`needs_attention`, `completed`, `ordered`.

**Storage.** Approval assets live in a private `approvals` bucket restricted to
`image/jpeg` and `application/pdf`. The app serves them through batched,
short-lived signed URLs rather than making the bucket public.

**8 migrations**, in order: core schema → RLS policies → storage bucket →
revoke trigger-function execute → add `unassigned` status → default to
`unassigned` → add pinning → add archiving.

---

## 4. Design system

Built from the palette and typography in `CLAUDE.md`.

- **Semantic tokens, not raw hex.** Components reference `bg-surface`,
  `text-ink`, `border-line`, `bg-accent`. Light and dark are two token sets in
  one file; no component knows which mode it is in.
- **Brand palette:** `#171717` / `#F2F2F2` / `#B2292E`, with derived hover and
  active states. Dark mode swaps the accent to `#BE494D`, since the base red
  reads muddy on near-black.
- **SF Pro Display** self-hosted across six weights.
- **Logo swaps via CSS, not JS.** Both marks ship in the markup and CSS picks
  one, so the swap lands in the same frame as the theme change.
- **Status colors are a fixed mapping**, not editable per row: blue for waiting,
  orange for needs attention, green for completed, steel for ordered, grey for
  unassigned.

---

## 5. Real data

Seeded from `2026 Marketing Graphics_Tasks.pdf`, Caroline's working Google Doc
export. Campaigns became projects with subtasks; one-off items became flat rows.
Due dates map to the document's headings.

Current state: **13 active projects, 9 archived, 26 subtasks, 3 people**.

One thing did not survive the import. The source document encodes status as a
background highlight color per line. The legend colors decode cleanly, but the
highlight rectangles' coordinates do not line up with the text baselines in that
Google Docs export, so per-item attribution came out wrong — highlights matched
to neighbouring lines. Rather than mark the wrong items "Completed" on a real
working list, everything was seeded neutral and triaged by hand in the app. This
is what motivated adding the `unassigned` status.

---

## 6. Problems found and fixed

Worth including in a case study — these are the parts that were not just typing.

**Unlayered CSS silently killing Tailwind utilities.** Red buttons rendered with
black text in light mode. The cause was not the color token, which was correct:
base element resets in `globals.css` sat at the top level, unlayered, and
unlayered CSS outranks everything in a cascade layer. So
`button { font: inherit; color: inherit }` was beating Tailwind's
`@layer utilities` and killing `text-accent-fg` **and** `font-medium` on every
button in the app. It hid in dark mode, where the inherited body color happens
to be near-white. The same mechanism had `* { border-color }` overriding
`border-transparent`. Fixed by moving the resets into `@layer base`.

**Supabase advisors flagged two exposed RPC endpoints.** PostgREST exposes
anything in the `public` schema as a callable endpoint, including the two
`SECURITY DEFINER` trigger functions. Execute was revoked from `anon` and
`authenticated`; advisors now return clean apart from one unrelated Auth setting.

**A stateful-regex bug in link rendering.** `.test()` on a `/g` regex advances
`lastIndex` between calls, so auto-linking pasted URLs worked only every other
time. Replaced with index parity from the split.

**Timezone-safe date handling.** `date` columns come back as `YYYY-MM-DD`;
parsing those with `new Date(str)` treats them as UTC midnight and shifts the day
backwards for anyone west of Greenwich. All conversions go through local-time
constructors.

**React Compiler lint on state-reset effects.** Dialogs were resetting state in
`useEffect`. Rewritten to remount via `key`, and the theme hook moved to
`useSyncExternalStore` so it reads `<html data-theme>` without a syncing effect.

---

## 7. Design decisions worth defending

**Archiving is a timestamp, not a status.** Putting "Archived" in the status
dropdown would make it mutually exclusive with "Completed" and lose the record
of how a project ended. `archived_at` is orthogonal: an archived project keeps
its status and just leaves the board.

**Pinning is a timestamp, not a boolean.** Same reasoning — "when was this
raised?" stays answerable, and ordering the pinned group by recency is available
without another migration.

**Pinned rows do not get the urgency color.** Position plus a red pin already
signals importance. Giving them the red wash would make them indistinguishable
from genuinely due-soon rows and cost the signal that matters.

**Completed projects hide their due date.** "9 days overdue" on finished work is
noise. The detail panel keeps the plain date for reference but drops the
relative framing.

**"Request changes" is not a red button.** It is a review decision, not a
destructive action, and should not compete with Approve.

---

## 8. Known limitations

- **JPEG and PDF only.** The `file_type` enum, the bucket's MIME list, and the
  upload dialog all enforce it, per spec. PNG uploads are rejected — likely to
  come up in daily use.
- **Descriptions are plain text with auto-linked URLs**, not full markdown.
- **No roles.** Any authenticated user has full read/write. Deliberate for a
  small trusted team; revisit if the team grows.
- **No realtime.** Two people on the same screen will not see each other's edits
  until a refresh. Supabase Realtime is available on this stack when wanted.
- **No email notifications.** In-app badges and due-date highlighting carry the
  signal.
- **Signed URLs expire after an hour.** Leaving Approvals open overnight means
  thumbnails need a reload.

---

## 9. Outstanding

1. **Push to GitHub.** Five commits are local. `git push origin main` needs
   GitHub credentials — the `osxkeychain` helper is configured but has no stored
   credential. Connecting the repo under Vercel → Settings → Git would also
   enable auto-deploy on push; deploys are currently CLI-driven.
2. **Add the production URL to Supabase Auth** (Authentication → URL
   Configuration). Password sign-in works without it, but email sign-in links
   and invite emails will point at localhost until it is set.
3. **Change the account password.** It was shared in the build session.
4. **Optional:** enable leaked-password protection in Supabase Auth — the one
   remaining advisor warning.

---

## 10. Commit history

| Commit | Date | What |
|---|---|---|
| `b862e2e` | Sep 4 | v1 — projects, social calendar, approvals (59 files, ~12k lines) |
| `0adef8c` | Sep 4 | Unassigned status, larger card due dates, solid red destructive buttons |
| `d619e1e` | Sep 4 | Fix unlayered base CSS defeating Tailwind utilities |
| `ad1dcda` | Sep 10 | Pin-to-top for projects |
| `6c7eb1c` | Sep 14 | Archiving, and drop due dates from completed work |
