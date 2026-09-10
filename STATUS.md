# Project Status — robbymyers.com

_Last updated: 2026-09-09 · Working branch: `main`_

> Quick status/handoff notes. The canonical design + content spec lives in **`CLAUDE.md`** (don't overwrite it). This file is just "where things stand."

---

## What it is

Robby Myers' portfolio site. **Plain static HTML/CSS/JS — no framework, no build step.** Deployed on **Vercel** (git-connected; every push to `main` auto-deploys). Vercel **root directory = `site/`**. Custom domain **robbymyers.com** live.

- Fonts: self-hosted (Titling Gothic FB Wide for display/headings; SF Pro Display system stack for body).
- Styles: `site/css/styles.css` (global) + `site/css/case-study.css` (case-study/subpage components). All colors via CSS variables.
- JS: `site/js/main.js` (nav, mobile menu, scroll-reveal, All Work filters, image lightbox, Next Route embed scaler).
- Repo: github.com/robbymyers/Portfolio (SSH remote).

---

## Navigation (all pages)

`About · Featured · All Work · Contact` — Contact scrolls to the home Get-in-Touch footer. Logo = R monogram + "Robby Myers" wordmark (wordmark hides in the 768–1059px tablet band to avoid colliding with the centered links).

---

## Pages / routes

### Home — `/`
Hero (ROBBY / MYERS with red-outlined last name + headshot behind the letters) → marquee → About brief → **Featured** (2 preview cards + View All → `/featured`) → **All Work** (category filter tabs: Branding & Design / 3D Animation / UI & Product; a 6-shot default preview, all items present, + View All → `/all-work`) → red contact footer.

### Top-level section pages
- **`/about`** — arched B&W headshot with hover/tap rollover (`Headshot-01` → `Headshot-02`), ABOUT bio, **Personal Projects** (Fitness Tracker, Family Calendar, Shadrachs Coffee, Next Route → its case study), Capabilities.
- **`/featured`** — Back button + 6 case-study rows.
- **`/all-work`** — Back button + 10-card grid (Shepherd, Family Calendar, Ridge City Grind, Rad Shaddy, Shadrachs Coffee [branding], Unity Health, VIP, Lone Wolf Society, Nine Point Day, Shadrachs Coffee App).

### Case studies (full)
- **`/shadrachs`** — Shadrachs Coffee (WordPress→Shopify), red accent.
- **`/family-crust`** — Family Crust pizza ordering, orange accent.
- **`/relay`** — Relay multi-sport event app, purple accent. **This is the template all case studies follow.**
- **`/procreate`** — Procreate non-destructive editing concept, magenta/blue accents.
- **`/nextroute`** — Next Route in-dash trail nav. Full case study + **live interactive prototype embedded** (scaled 1560×660 iframe from Vercel), motion timeline, competitive analysis. Personal project; linked from About.
- **`/unity-health`** — Unity Health brand/campaign, blue accent. Image mosaic + the "Always Here For You" ad. Reachable from All Work.
- **`/shadrachs-brand`** — Shadrachs Coffee branding gallery (masonry), red accent. Titled "Shadrachs Coffee"; only appears under the **Branding & Design** filter, plus on `/all-work`.

### Previous work (full)
- **`/rad-shad`**, **`/nine-point-day`**, **`/vip`** — 3D commercial pages with YouTube embeds + render galleries.
- **`/ridge-city-grind`**, **`/lone-wolf`**, **`/stickers`** — branding/apparel galleries.

### Presentation (unlisted)
- **`/community`** — "Together We Are CommUnity" Unity Health campaign. Reuses the Relay layout; off-white highlight + navy secondary; :30 YouTube spot (16:9). **Not linked from anywhere** and `noindex,nofollow` — built for a presentation.

### Still stubs (placeholder pages — NOT built out)
- **`/shaman`** and **`/chroma`** — listed on `/featured` but still the placeholder template (~60 lines each). Content/assets pending.

---

## Site-wide systems

- **Image lightbox** — click any case-study image (`.cs-image .frame img`) to view full-size; overlay + close button + Escape. In `main.js` / `case-study.css`.
- **All Work category filters** — home only; default shows a curated preview, each pill reveals its category, clicking the active pill returns to the preview.
- **Pulse dot** (`.status-dot`) — Open to Work (nav), "Give it a test" (About personal projects), Executive Summary (case-study heroes).
- **Vercel Web Analytics** — `<script defer src="/_vercel/insights/script.js">` on all 19 pages. **Requires Web Analytics to be enabled in the Vercel dashboard** to collect data (script 404s harmlessly until then).
- Scroll-reveal fade-ups, auto marquee, hover nudges — CSS/IntersectionObserver only.

---

## Deployment notes

- Push to `main` → auto-deploy. Root dir `site/`. If a deploy looks stale, hard-refresh (browser caches asset 404s from mid-deploy views).
- `.gitignore`: `.DS_Store`, `.vercel`, `*.psd` (PSDs kept locally, never committed).

---

## Open items / next up

- Build out **Shaman** and **Chroma** case studies (currently stubs).
- Enable **Web Analytics** in the Vercel dashboard if not already on.
- Optional: heavy GIFs on Nine Point Day / VIP could be converted to MP4/WebM to cut page weight.
- Optional: Next Route's GitHub repo is private, so no public "View source" link (would 404 for visitors).
