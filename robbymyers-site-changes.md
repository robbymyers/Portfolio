# robbymyers.com: Portfolio Changes

Source: the robbymyers.com Creative Audit (2026-10-27). Goal: reposition the site from "Product Designer" to "Brand and Product Designer," bring brand work to the front, add shipped apps to Featured, and remove student work.

Tasks run from simplest to most involved. Each phase has two lists:

- **Claude Code:** changes to the site's code and copy.
- **Rob:** decisions, assets, and facts only Rob can provide. Claude Code must not invent these.

Where a Claude Code task depends on Rob's input, it's marked **Blocked by** with the Rob task number. If the input isn't ready, skip the task and leave a `TODO(rob):` comment in the code.

---

## Notes for Claude Code

- The site is static HTML. Each page lives in its own folder as `index.html` (e.g. `/featured/index.html`, `/shadrachs-brand/index.html`), with a shared `styles.css` and self-hosted fonts in `/fonts/`.
- Before you start, read the home page, `/featured/`, `/all-work/`, `/about/`, and one existing case study (`/the-furnace/`) so new pages match the existing layout, type scale, tags, and spacing.
- **Keep the existing visual system:** Titling Gothic FB Wide headlines, the black / off-white / red palette, pill tags, and the dark Featured band.
- **Copy rule:** no em dashes in any new or rewritten copy. Use commas, colons, or periods instead.
- **No invented facts:** never make up metrics, dates, client names, or outcomes. Use a visible placeholder like `[NUMBER FROM ROB]` and list every placeholder in your summary at the end.
- Commit after each phase with a clear message, so each phase can be reviewed or reverted on its own.

---

## Phase 1: Quick fixes (about 1 hour)

### Claude Code

- [ ] **1.1 Remove the project numbers.** Delete the 01, 02, 03 style numbers from every project card and grid: the home page All Work and Featured sections, `/featured/`, and `/all-work/`. Remove any CSS that only styled those numbers.
- [ ] **1.2 Fix the Featured meta description.** On `/featured/`, it lists "Shaman" and "Chroma," which aren't on the page. Rewrite it to match the final Featured lineup from Phase 4. Update it again after Phase 4.
- [ ] **1.3 Unify the fitness app name.** It's "Shepherd" in All Work and "Fitness Tracker" on About. Use "Shepherd" everywhere.
- [ ] **1.4 Add missing alt text.** One image on `/shadrachs-brand/` has no alt text. Find it and write a description of what it shows.
- [ ] **1.5 Raise small text.** Pill tags are 10px and "View All" is 11px. Set a 12px minimum for labels and tags. In the hero, increase the size and contrast of the small "Arkansas / 15+ years of craft" line.
- [ ] **1.6 Respect reduced motion.** Pause the scrolling marquee when `prefers-reduced-motion: reduce` is set.
- [ ] **1.7 Swap the Unity Health thumbnail.** It's currently the client's logo. Use `/site/community/UnityHealth-Community.jpg` instead.

### Rob

- [ ] **R1.1** Nothing is needed for this phase. Look over the changes once they're done.

---

## Phase 2: Positioning copy (about 1 hour)

### Claude Code

- [ ] **2.1 Page title and meta tags.** On the home page, change the `<title>` and `og:title` from "Robby Myers, Product Designer" to "Robby Myers, Brand and Product Designer." Update the site-wide meta descriptions to match. Remove the "healthcare platforms" and "creative SaaS tools" claims.
- [ ] **2.2 Hero line.** Replace "Multidisciplinary designer specializing in complex, high-stakes digital experiences from healthcare platforms to creative SaaS tools." with: "Brand designer shipping products. Fifteen years of building identities, campaigns, and the products behind them."
- [ ] **2.3 Marquee.** Change it to: Branding * Lettering * Campaigns * Motion * 3D * Product Design * Design Systems. Brand words go first.
- [ ] **2.4 Profile headline.** Replace "Fifteen years across healthcare, retail, creative SaaS, 3D, motion, and product design" with "Fifteen years as a one-person creative team, from hand lettering to shipped software." Rewrite the supporting paragraph to match. It should be short, specific, and free of buzzwords.
- [ ] **2.5 Capabilities list.** Add these at the top of the Design column: Brand Identity, Art Direction, Lettering, Illustration, Campaigns. Remove MidJourney from Tools.
- [ ] **2.6 Remove em dashes from existing copy.** Search every page for "—" and "–" in visible text and replace them with commas, colons, or periods. Leave the dash in the "— Scroll to explore more —" hint as decoration only if Rob wants to keep it. Otherwise change it to "Scroll to explore."

### Rob

- [x] **R2.1 Pick the hero line.** Decided: "Brand designer shipping products. Fifteen years of building identities, campaigns, and the products behind them."
- [x] **R2.2 Decide on MidJourney.** Decided: remove it.

---

## Phase 3: Performance and fonts (2 to 3 hours)

### Claude Code

- [ ] **3.1 Compress gallery images.** The `/shadrachs-brand/` page loads about 21 MB. The biggest files are `Flamingo-MockUp.jpg` (5.7 MB), `Christmas-MockUp.jpg` (4.1 MB), `OctoberSticker-Football.jpg` (3.3 MB), and `RushHour-003.jpg` (1.7 MB).
  - Convert every portfolio image to WebP (or AVIF with a WebP fallback) at about 2x its display width.
  - Aim for under 300 KB per image and under 3 MB per page.
  - Keep the originals in a `/_originals/` folder that isn't deployed, or don't commit them.
  - Add `loading="lazy"` and `decoding="async"` to every below-the-fold image.
  - Add `width` and `height` attributes to prevent layout shift.
- [ ] **3.2 Serve fonts as woff2.** Convert the self-hosted `.otf` files to `.woff2`, update the `@font-face` rules, and keep `font-display: swap`.
- [ ] **3.3 Replace SF Pro Display.** Apple's SF Pro license doesn't allow web embedding. Replace it everywhere with **Instrument Sans** (SIL Open Font License). Self-host the woff2 files in `/fonts/` instead of linking to Google Fonts. Instrument Sans has no Light (300) weight, so map any 300 usage to 400 and check that the hierarchy still reads. Remove the SF Pro `.otf` files from the repo.
- [ ] **3.4 Report the results.** List page weights before and after for the home page and `/shadrachs-brand/`.

### Rob

- [x] **R3.1 Pick a body font to replace SF Pro.** Decided: Instrument Sans.
- [ ] **R3.2 Confirm the Titling Gothic FB Wide web license.** Check that your Font Bureau / Type Network license covers web use. If it doesn't, buy the webfont license or pick a replacement wide display face.
- [ ] **R3.3 Test the site on your phone after Phase 3.** Check the hero, the Featured cards, and the Furnace tables, and note anything that breaks.

---

## Phase 4: Restructure Featured and All Work (about 2 hours)

### Claude Code

- [ ] **4.1 Rebuild the Featured lineup** on both the home page's Featured section and `/featured/`, in this order:
  1. Shadrachs Coffee: Brand System (Brand) → `/shadrachs-brand/`
  2. Shadrachs Coffee: Shopify Redesign (Product) → `/shadrachs/`
  3. Unity Health: Together We Are CommUnity (Brand) → `/unity-health/`
  4. The Furnace (Product) → `/the-furnace/`
  5. Ridge City Grind (Brand) → `/ridge-city-grind/`
  6. Sentry (Product) → `/sentry/` (built in 4.9)

  Show only two cards on the home page with a "View All" link, or show all of them in a two-column grid. Pick whichever fits the existing layout better.
- [ ] **4.2 Change the card labels.** Replace "Role: Lead Product Designer / Outcome: Client Project" on brand cards with **Role · Client · Years** (e.g. "Creative Director · Shadrachs Coffee · 2021 to now"). Use the details from R4.1. **Blocked by R4.1.**
- [ ] **4.3 Trim the tags.** Use no more than three tags per card.
- [ ] **4.4 Reorder All Work.** Lead the grid with the strongest brand thumbnails (Shadrachs brand, Unity Health, Ridge City Grind, Lone Wolf Society), then the 3D spots, then the apps.
- [ ] **4.5 Move Family Crust to All Work.** Label it "DesignLab client project, unlaunched concept" on its card and its case study page. Change "Outcome: Client Project" to match.
- [ ] **4.6 Delete Procreate and Relay.** Delete the `/procreate/` and `/relay/` folders and any images used only by those pages. Remove every link, card, and mention of them across the site, including meta descriptions. If the host supports redirects (for example `vercel.json`), redirect both old URLs to `/featured/` so old links don't hit a 404.
- [ ] **4.7 Move the remaining apps to All Work** with their live links: Shepherd, Family Calendar, Next Route.
- [ ] **4.10 Label Lone Wolf Society as "Concept."** Keep it in All Work, and add a "Concept" label on its card and its project page, styled like the other pill tags.
- [ ] **4.8 Update every meta description** that lists projects, including `/featured/` and `/all-work/`.
- [ ] **4.9 Build the Sentry case study at `/sentry/`.** Follow the Furnace case study structure: problem, decisions, design system, build, and what's in v1. Add a "Try the demo" button that links to https://sentry-demo-olive.vercel.app/, and use screenshots of the demo for the images. Take the product facts (features, stack, decisions) from the Sentry repo and Rob's notes in R4.4, not from guesses. Say clearly on the page that the demo runs on mock data. **Blocked by R4.4.**

### Rob

- [ ] **R4.1 Give Role, Client, and Years for each Featured project.** For example: Shadrachs brand, Shadrachs Shopify, Unity Health, Ridge City Grind, The Furnace.
- [x] **R4.2 Decide what happens to Procreate and Relay.** Decided: delete them.
- [x] **R4.3 Decide whether Lone Wolf Society stays.** Decided: keep it in All Work, labeled "Concept."
- [ ] **R4.4 Give Claude Code the Sentry story.** Point it to the Sentry repo, and write a few lines covering: why you built it, why you chose manual entry over bank sync, who uses it, the "Ask Sentry" AI feature, and anything you'd do differently.

---

## Phase 5: About page (about 1 hour of Claude work, plus Rob's inputs)

### Claude Code

- [ ] **5.1 Add a career timeline** below the bio: role, company, and years for each position, newest first. Use the details from R5.1. **Blocked by R5.1.**
- [ ] **5.2 Add a "Download résumé (PDF)" link** that points to `/robby-myers-resume.pdf`. **Blocked by R5.2.**
- [ ] **5.3 Add a short Volunteer / Civic section** for the Jonesboro Trail System subcommittee role, using Rob's wording from R5.3. **Blocked by R5.3.**
- [ ] **5.4 Make sure the personal projects match** the Phase 4 names and links.

### Rob

- [ ] **R5.1 Confirm the timeline:** Shadrachs Coffee, Unity Health, Gearhead Outfitters, and anything else you want listed, with years and titles.
- [ ] **R5.2 Export your current résumé as a PDF** and drop it in the repo root as `robby-myers-resume.pdf`.
- [ ] **R5.3 Write one sentence about the Trail System subcommittee role.** For example: "Volunteer, City of Jonesboro Trail System subcommittee: wayfinding and directional signage, 2026."

---

## Phase 6: Brand case study rebuilds (the big lift)

Each brand page changes from a short overview plus an image wall to a short case study built on five beats. Keep it to 250 to 400 words, and let the captions do most of the work.

1. **The brief:** one sentence.
2. **The idea:** one sentence.
3. **The system:** the parts that make the brand scale, such as lettering, color, mascot, type, photo rules, and templates. One clean board beats ten mockups.
4. **The rollout:** the gallery grouped by channel (in-store, apparel, social, motion, print), with a one-line caption per group.
5. **The result:** one honest number or fact.

Use the Furnace page as the structural model (header, stat row, sections), but keep the brand pages visual-first.

### Claude Code

- [ ] **6.1 Build a reusable brand case study template.** Use the five sections above, plus a stat row at the top (up to 3 stats, hidden when empty) and a grouped gallery with captions. Reuse the existing components and styles.
- [ ] **6.2 Rebuild `/shadrachs-brand/`** with the template. Fold the three motion spots (Rad Shaddy, VIP, Nine Point Day) into a "Motion" group with embedded video, and link out to their existing pages. Draft the brief and idea copy from R6.2. **Blocked by R6.2 and R6.3.**
- [ ] **6.3 Rebuild `/unity-health/`** with the template. Group the gallery into Campaign (Together We Are CommUnity), Environmental (the mural), and Digital (the virtual shopping mall). **Blocked by R6.2 and R6.3.**
- [ ] **6.4 Rebuild `/ridge-city-grind/`** with the template. Group the gallery into Identity, Apparel, Print, and Social. **Blocked by R6.2 and R6.3.**
- [ ] **6.5 Add a Jonesboro Trails card to All Work.** Link it to https://jonesboro-trail-system.vercel.app/, label it "Personal project, civic," and describe it in one sentence. A full case study comes later (see R6.5).
- [ ] **6.6 Final pass.** Check that every page has no em dashes, no invented facts, and no leftover placeholders. List any remaining `[NUMBER FROM ROB]` or `TODO(rob)` items.

### Rob

- [x] **R6.1 Ship the Sentry mock-data demo.** Done: https://sentry-demo-olive.vercel.app/
- [ ] **R6.2 Write the brief and idea for each brand project, one sentence each.** Rough drafts are fine; Claude Code will tighten them. Examples:
  - Shadrachs brief: "Shadrachs needed a voice loud enough to stand out next to national chains, run by a one-person creative team across 14 stores."
  - Shadrachs idea: "Fuel for Your Soul: a hand-lettered, slightly rowdy identity that makes coffee feel like a rally, not a commodity."
- [ ] **R6.3 Collect one real number or fact per brand project.** Don't estimate. If you can't get a number, give a plain fact instead (e.g. "the mural is still up in the children's wing"). Possible sources:
  - **Shadrachs:** VIP sign-ups after the VIP spot, Rush Hour redemptions or sales lift, merch sell-through, social follower growth since 2021.
  - **Unity Health:** views or completion rate for the video newsletters vs print readership, and fundraiser totals from the virtual shopping mall.
  - **Ridge City Grind:** registrations or team count, and shirts sold.
  - **Gearhead Outfitters** (for the résumé or About page): Instagram follower growth during your time there.
- [ ] **R6.4 Gather assets for the system boards:** the lettering source files, color values, mascot art, and any brand guidelines. Export a clean "system" board for each brand project if you have one, or the raw pieces for Claude Code to lay out.
- [ ] **R6.5 Document the Trail System wayfinding work from the first meeting:** sketches, decisions, stakeholder input, and photos of installed signs. Later it becomes one case study: "Jonesboro Trails: wayfinding signage and a companion web app."

---

## Done when

- The home page reads as a Brand and Product Designer within 10 seconds.
- Featured shows 3 brand and 3 product projects, with no student or concept work.
- Every brand page follows the five beats and has at least one real result.
- No page is heavier than 3 MB, and every font is licensed for web use.
- There are no em dashes, invented facts, or placeholders left anywhere.
