# Project Status — robbymyers.com

_Last updated: 2026-10-26 · Working branch: `main`_

> Quick status/handoff notes. The canonical design + content spec lives in **`CLAUDE.md`** (don't overwrite it). This file is just "where things stand." The private client dashboard has its own deep-dive doc: **`freelance-client-STATUS.md`**.

---

## What it is

Robby Myers' portfolio site. **Plain static HTML/CSS/JS — no framework, no build step.** Deployed on **Vercel** (git-connected; every push to `main` auto-deploys). Vercel **root directory = `site/`**. Custom domain **robbymyers.com** live.

- Fonts: self-hosted (Titling Gothic FB Wide for display/headings; SF Pro Display system stack for body).
- Styles: `site/css/styles.css` (global) + `site/css/case-study.css` (case-study/subpage components). All colors via CSS variables.
- JS: `site/js/main.js` (nav, mobile menu, scroll-reveal, All Work filters, image lightbox, Next Route embed scaler).
- Repo: github.com/robbymyers/Portfolio (SSH remote).

The repo now holds **two things**: the public **portfolio site** (`site/…`) and a private **client dashboard** (`site/freelance-client/…`, Supabase-backed) — see its section near the bottom.

---

## Navigation (all public pages)

`About · Featured · All Work · Contact` — Contact scrolls to the home Get-in-Touch footer. Logo = R monogram + "Robby Myers" wordmark (wordmark hides in the 768–1059px tablet band to avoid colliding with the centered links).

---

## Pages / routes (public portfolio)

### Home — `/`
Hero (ROBBY / MYERS with red-outlined last name + headshot behind the letters) → marquee → About brief → **Featured** (2 preview cards + View All → `/featured`) → **All Work** (category filter tabs: Branding & Design / 3D Animation / UI & Product; a 6-shot default preview + View All → `/all-work`) → red contact footer.

### Top-level section pages
- **`/about`** — arched B&W headshot with hover/tap rollover, ABOUT bio, **Personal Projects** (Fitness Tracker, Family Calendar, **The Furnace**, Next Route), Capabilities.
- **`/featured`** — Back button + case-study rows.
- **`/all-work`** — Back button + 10-card grid (Shepherd, Family Calendar, Ridge City Grind, Rad Shaddy, Shadrachs Coffee [branding], Unity Health, VIP, Lone Wolf Society, Nine Point Day, **The Furnace**).

### Case studies (full)
- **`/relay`** — Relay multi-sport event app, purple accent. **This is the template all case studies follow.**
- **`/shadrachs`** — Shadrachs Coffee (WordPress→Shopify), red accent.
- **`/family-crust`** — Family Crust pizza ordering, orange accent.
- **`/procreate`** — Procreate non-destructive editing concept.
- **`/nextroute`** — Next Route in-dash trail nav + **live embedded prototype**.
- **`/unity-health`** — Unity Health brand/campaign, blue accent.
- **`/shadrachs-brand`** — Shadrachs Coffee branding gallery (masonry); shows under the Branding & Design filter + on `/all-work`.
- **`/the-furnace`** — The Furnace internal tool for Shadrachs Coffee (Relay layout, red accent). Replaced the old "Shadrachs Coffee App" card across Home / All Work / About.

### Previous work (full)
- **`/rad-shad`**, **`/nine-point-day`**, **`/vip`** — 3D commercial pages (YouTube embeds + render galleries; heavy animations now MP4, not GIF).
- **`/ridge-city-grind`**, **`/lone-wolf`**, **`/stickers`** — branding/apparel galleries.

### Presentation / unlisted (`noindex,nofollow`, not linked from anywhere)
- **`/community`** — "Together We Are CommUnity" Unity Health campaign (Relay layout, :30 spot).
- **`/summer-days`** — Shadrachs Summer Days campaign (Relay layout, purple accent, vertical Shorts video).
- **`/preview`** — motion-reel preview page; native `<video>` (no autoplay), compressed MP4s in `site/videos/`.

### Still stubs (NOT built out)
- **`/shaman`** and **`/chroma`** — listed on `/featured` but still the placeholder template.

---

## Site-wide systems (portfolio)

- **Relative asset paths + `trailingSlash: true`** (`site/vercel.json`) — subpages reference images relatively, so the trailing-slash redirect is **required** or images 404 on no-slash URLs. Don't remove it.
- **Image lightbox**, **All Work category filters**, **pulse dot** (`.status-dot`), scroll-reveal fade-ups, auto marquee — CSS/IntersectionObserver + `main.js`.
- **Reveal reliability** — IntersectionObserver `threshold: 0` + a safety timeout; content images are no longer `loading="lazy"` (a lazy + zero-height-reveal combo was blocking image loads).
- **Vercel Web Analytics** — `<script defer src="/_vercel/insights/script.js">` on every page. Requires Web Analytics enabled in the Vercel dashboard to collect.

---

## Client Dashboard — `/freelance-client` (private, Supabase-backed)

A separate app living inside the same repo (`site/freelance-client/`). **Not part of the public portfolio** — not linked anywhere, `noindex` on every page + an `X-Robots-Tag: noindex, nofollow` header, and gated by Supabase Auth + RLS (logged out shows only a login form; every query returns nothing).

Still **plain static HTML/JS, no build step** — `supabase-js` loaded as a pinned ES module. Backend is the **Atium** Supabase project, schema `freelance`, owner-only (just Rob).

**What it does, at a glance:**
- **Dashboard** — outstanding/overdue invoices, open quotes, retainers due, and paid invoices not yet logged as income.
- **Clients** — list + detail (engagements, quotes, invoices, calendars).
- **Quotes / Invoices** — line-item builder, convert quote→invoice, mark paid, inline "+ New client", and a clean **Print → Save PDF** (Terms/Notes keep line breaks + light auto-formatting).
- **Client calendars** — reference-matched month grid (color-coded post types, key moments, focus bar), computed totals, Print/PDF.
- **The Hopper** — Rob's task board: status filters, drag-to-reorder, pin-to-top, per-row pin/delete on hover.
- **Social Calendar** — Rob's own post pipeline: month calendar + list, drag to reschedule/reorder, full-copy detail.
- **Settings** — business info, payment details, defaults.

**Layout:** left sidebar nav on desktop, hamburger drawer on mobile.

**Important operational notes** (full detail in `freelance-client-STATUS.md`):
- **SQL is applied by hand.** Migrations live in `supabase/freelance/` (outside `site/`); Rob runs them in the Supabase SQL editor. The connector's SQL tools are blocked in the build sessions.
- **Sensitive files are gitignored** — `Hopper-STATUS.md` and `supabase/freelance/04_social_seed.sql` (they contain post copy + "do-not-publish" notes). They stay local so the seed still runs.

---

## Deployment notes

- Push to `main` → auto-deploy. Root dir `site/`. If a deploy looks stale, hard-refresh (browser caches asset 404s from mid-deploy views).
- `site/vercel.json`: `trailingSlash: true` + an `X-Robots-Tag` header scoped to `/freelance-client/(.*)`.
- `.gitignore`: `.DS_Store`, `.vercel`, `*.psd`, plus the two sensitive dashboard files noted above.
- There are two Vercel projects historically; the live one is **`website`** (serves robbymyers.com). The old duplicate `portfolio` project was deleted.

---

## Open items / next up

- Build out **Shaman** and **Chroma** case studies (still stubs).
- Enable **Web Analytics** in the Vercel dashboard if not already on.
- Dashboard: touch drag-and-drop is desktop-only; per-month calendar phase labels aren't editable yet. See `freelance-client-STATUS.md`.
