# portfolio.md — Robby Myers Portfolio Site
## Source of Truth for robbymyers.com

> This file is the canonical content and design spec for building the portfolio site.
> Hand this to Claude Code to build the site.

---

## 1. Design Tokens

### Colors
```
--color-black:    #121212   /* primary background (dark sections) */
--color-red:      #FD4338   /* accent / CTA / contact section background */
--color-white:    #F3F5F4   /* primary background (light sections) */
--color-surface:  #1A1A1A   /* card/component background on dark */
```

### Typography
```
--font-heading:  "Tilting FB Pro Wide", sans-serif   /* Local font — ALL headings, nav, labels */
--font-body:     "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif  /* body copy, captions */
```

### Font Loading
- Tilting FB Pro Wide: self-hosted local font. Place files in `/site/fonts/` and load via `@font-face` in global CSS. Claude Code should expect files such as `TiltingFBProWide.woff2` / `TiltingFBProWide.woff`.
- SF Pro Display: system font stack, no external load needed

### Spacing / Layout
```
--max-width:       1440px
--content-width:   1240px   /* 100px margin each side on desktop */
--mobile-gutter:   16px
```

---

## 2. Site Structure (Pages)

```
/             → Home
/relay        → Case Study: Relay
/shadrachs    → Case Study: Shadrachs Coffee  [future]
/procreate    → Case Study: Procreate UX Analysis  [future]
/shaman       → Case Study: Shaman  [future]
/chroma       → Case Study: Chroma  [future]
```

**Each case study will link to it's specific page**

---

## 3. Global Navigation

**Desktop (sticky, full-width, 64px tall)**
- Left: Logo — "R" monogram (Robby Myers icon mark)
- Nav links: Work · About · Capabilities · Contact
- Right: Status badge — green dot + "OPEN TO WORK"

**Mobile (sticky, 64px tall)**
- Left: "R" monogram
- Right: Hamburger menu toggle

---

## 4. HOME PAGE

### Section 1 — Hero (White background: #F3F5F4)

**Desktop layout:**
- Top-left subtitle (below nav, ~64px from top):
  - Line 1: "Product Designer turning complex systems into intuitive, human experiences."
  - Line 2 (right-aligned, small): "Remote / Arkansas · 15+ years of craft"
- Large name block, centered, oversized display type:
  - "ROBBY" — massive, full-width headline (Obviously, ~280–320px)
  - "MYERS" — same size, offset slightly right, with circular headshot photo overlapping the letterforms
- Scroll prompt (centered, below name): "— Scroll to explore more —"

**Mobile layout:**
- Same subtitle text, stacked
- "ROBBY" / "MYERS" at ~36px, headshot circle (91×91px) floated right, overlapping
- Scroll prompt below

---

### Section 2 — Horizontal Scrolling Banner (Black background: #121212)

Auto-scrolling ticker / marquee band, 80px tall.
Repeating items separated by `*` asterisk:

```
PRODUCT DESIGN  *  MOTION  *  3D  *  UX/UI  *  DESIGN SYSTEMS  *  [repeats]
```

Font: Obviously, ~32–48px, white text on black.

---

### Section 3 — About (White background: #F3F5F4)

Section label: `(01—Profile)` — small, right-aligned

**Heading (large, Obviously):**
"Fifteen years across graphic design, animation, 3D, and product design"
— "and" rendered in red (#FD4338)

**Body copy (SF Pro Display):**
"I bring visual craft, systems thinking, and a strong point of view to every problem I work on — from the smallest interaction to the architecture that holds a product together."

**Desktop:** Two-column layout. Heading left, body copy right.
**Mobile:** Stacked single column.

---

### Section 4 — Selected Works (Black background: #121212)

Section label: `(02—Case Studies)` — small, right-aligned

**Heading:** `SELECTED WORKS` (Obviously, large)

Horizontal rule below heading.

Five case study rows, each separated by a horizontal rule:

---

#### Work 01 — Shadrachs Coffee
- **Number:** 01
- **Logo/Brand:** Shadrachs Coffee logo (S icon mark + wordmark)
- **Tags (pills):** UX/UI Design · React Native · Branding · Mobile App
- **Role label:** Lead Product Designer
- **Status label:** Shipped Product
- **Description:** A React Native-to-Shopify migration and full redesign of UX/UI redesign for a growing local coffee brand.
- **Image:** Mockup — laptop/desktop showing the Shadrachs interface
- **Link:** `/shadrachs` (case study, future)

---

#### Work 02 — Relay
- **Number:** 02
- **Logo/Brand:** "Relay" custom logotype (hand-lettered / script style)
- **Tags (pills):** Concept Project · Product & UX Design Lead
- **Role label:** Lead Product Designer
- **Status label:** End-to-end case study
- **Description:** A multi-sport fitness event discovery app — a unified, opinionated festival user experience that helped multi-sport athletes find complete fitness pleasure.
- **Image:** Mockup — phone screens showing Relay UI
- **Link:** `/relay`

---

#### Work 03 — Procreate
- **Number:** 03
- **Logo/Brand:** Procreate® wordmark
- **Tags (pills):** UX Researcher / Analyst · End-to-end case study
- **Role label:** UX Researcher / Analyst
- **Status label:** End-to-end case study
- **Description:** A deep-dive usability analysis of Procreate's sketching part-se systems for discoverability and advanced feature access for power users on iPad.
- **Image:** Mockup — iPad showing Procreate
- **Link:** `/procreate` (future)

---

#### Work 04 — Shaman
- **Number:** 04
- **Logo/Brand:** "SHAMAN" — large display wordmark
- **Tags (pills):** Product Design · End-to-end case study — Sprint
- **Role label:** Lead Product Designer
- **Status label:** End-to-end case study — Sprint
- **Description:** A unified network platform to help professionals thrive commercially everywhere.
- **Image:** Mockup — atmospheric/moody image with SHAMAN wordmark overlay
- **Link:** `/shaman` (future)

---

#### Work 05 — Chroma
- **Number:** 05
- **Logo/Brand:** "Chroma" — stylized script/retro logotype
- **Tags (pills):** Lead Product Designer · End-to-end case study
- **Role label:** Lead Product Designer
- **Status label:** End-to-end case study
- **Description:** An on-demand color reference tool for designers.
- **Image:** Mockup — phone showing Chroma app UI
- **Link:** `/chroma` (future)

---

### Section 5 — Current Work (White background: #F3F5F4)

Section label: `(03—In Progress)` — small, right-aligned

**Heading:** `CURRENT WORK` (Obviously, large)

Horizontal rule below heading.

Three active project cards:

---

#### Current Project 1 — Shadrachs Coffee
- **Status badge:** `ACTIVE` (green-bordered pill)
- **Title:** SHADRACHS COFFEE
- **Subtitle/Type:** Ordering App
- **Description:** Designing a real coffee ordering experience for a specialty coffee brand; research through delivery on a live client engagement.
- **Mockup:** Phone mockup (Shadrachs app UI), positioned right/overlapping card edge

---

#### Current Project 2 — Family Calendar
- **Status badge:** `Shipping Soon` (outlined pill) + `● Give it a test →` (link)
- **Title:** FAMILY CALENDAR
- **Description:** Designing a family calendar Web-Based App that lives on the iPad in the kitchen. For the families that have a lot going on and no way to keep track.
- **Stack breadcrumb:** Figma → Claude Code → GitHub → Ship with Vercel
- **Mockup:** iPad mockup showing calendar UI, positioned right/overlapping card edge

---

#### Current Project 3 — Fitness Tracker
- **Status badge:** `In Development` (outlined pill) + `● Give it a test →` (link)
- **Title:** FITNESS TRACKER
- **Description:** Designing a multi-modality fitness tracker for myself.
- **Stack breadcrumb:** Figma → Claude Code → GitHub → Ship with Vercel
- **Mockup:** Phone mockup showing fitness tracker UI

**Desktop layout:** Shadrachs + Family Calendar side-by-side (2 columns), Fitness Tracker centered below spanning ~680px.
**Mobile layout:** Stacked single column.

---

### Section 6 — Capabilities (White background: #F3F5F4)

Section label: `(04—Toolkit)` — small, right-aligned

**Heading:** `CAPABILITIES` (Obviously, large)

Horizontal rule below heading.

Three columns of line-separated list items:

**● DESIGN**
- Product Design
- UX/UI
- Interaction Design
- Design Systems
- Prototyping
- Visual Design
- Motion
- 3D
- Illustration

**● RESEARCH**
- User Interviews
- Usability Testing
- Competitive Analysis
- Journey Mapping
- Survey Design

**● TOOLS**
- Figma
- Adobe CC
- Midjourney
- Claude
- After Effects
- Photoshop
- Illustrator

Each column: items separated by thin horizontal rules. Category label has a small filled circle bullet (●).

**Desktop layout:** 3 equal columns.
**Mobile layout:** Stacked single column.

---

### Section 7 — Previous Work (Black background: #121212)

Section label: `(05—Previous Work)` — small, right-aligned

**Heading:** `PREVIOUS WORK` (Obviously, large)

Horizontal rule below heading.

**Desktop:** 3×2 grid of image tiles (each ~413×280px)
**Mobile:** Single-column stacked tiles (each full-width, ~245px tall)

Six tiles (brand/graphic design work from previous career):

1. **Lone Wolf** — apparel brand mark (dark, illustrated wolf/skull)
2. **Rad Shad** — illustrated character/sticker design
3. **VIP** — logo / apparel design
4. **Russell City Grind** — lettering / brand identity
5. **Stickers** — holiday/character illustration set
6. **Nine Point Day** — race/outdoor brand mark

> Note: These are image assets. Source from `/assets/previous-work/` directory.

---

### Section 8 — Contact / Footer (Red background: #FD4338)

**Pre-headline (small, Obviously):**
`LET'S BUILD SOMETHING WORTHWHILE`

**Headline (massive display, Obviously):**
```
GET IN
TOUCH↗
```
— Arrow is a large diagonal arrow icon or unicode ↗

Horizontal rule.

**Contact row (left-aligned):**
- ✉ robby.myers@gmail.com
- LinkedIn icon + Robby Myers → [https://linkedin.com/in/robbymyers](https://linkedin.com/in/robbymyers)

**Quote (right-aligned, italic, SF Pro Display):**
*"Love, not too well, the work of thy hands."*

Horizontal rule.

**Footer bar (3-column, small caps, Obviously):**
```
© 2026 ROBBY MYERS     REMOTE / ARKANSAS     DESIGNED AND BUILT WITH INTENT
```

---

## 5. RELAY CASE STUDY PAGE (`/relay`)

### Header
Global nav (same as home, no status badge needed here).

---

### Section 1 — Case Study Hero (Black background: #121212)

**Left column:**
- Relay logotype (custom hand-lettered SVG)
- **Tagline:** "Every Event, One Story — a unified fitness event ecosystem for multi-sport athletes."
- **Role pills (4):**
  - Concept Project
  - Product & UX Design Lead
  - Visual Design & Brand System
  - Information Architecture
- **Metrics (3, with icons):**
  - 🎯 `4 → 2` Registration Steps
  - 📚 `5 → 1` Platforms Consolidated
  - ⏱ `6 → 8` Week Timeline

**Right column — Executive Summary card:**
- Label: `● EXECUTIVE SUMMARY`
- 01 — Reduced event registration from 4 steps to 2
- 02 — Unified 5 fragmented platforms into one experience
- 03 — 100% unassisted task completion in usability tests
- Divider line
- "Validated with users" / "Athletes and event organizers across 3 sport modalities"

**Desktop:** Two-column split (left ~608px / right ~608px).
**Mobile:** Stacked — hero left content first, executive summary card below.

---

### Section 2 — Hero Image

Full-bleed (or near full-bleed) image of Relay app mockup on phones.
- Desktop: right-aligned image, ~959×539px, rounded corners
- Mobile: full-width, ~393×221px, rounded corners

---

### Section 3 — Problem/Solution (Black background: #121212)

**Section label:** `Problem — Solution`

**Heading:** From Friction to Flow

**Subheading:** "How we translated fragmented user pain points into a unified, streamlined product experience."

**Design Challenge callout box:**
> "How might we help athletes track both past and upcoming events across multiple fitness modalities — so they can reflect on their journey while planning future goals — while simplifying event sign-up into a seamless experience?"

**Friction → Solution rows (4 pairs):**

Each row: [Friction block] → arrow → [Solution block]
Desktop: side-by-side. Mobile: stacked (Friction above, Solution below).

| # | Friction | Solution |
|---|----------|----------|
| 1 | **Fragmented Discovery** — Athletes used 3–5 separate platforms to find events across running, cycling, and CrossFit. 4 of 6 competitors were modality-specific. | Unified multi-sport search with location-based filtering and modality toggles in a single interface. |
| 2 | **4-Step Registration** — Event registration required navigating away from the discovery page, creating accounts on external sites, and filling redundant forms. | Inline 2-step registration flow — select event, confirm details. No context switching. |
| 3 | **No Performance Tracking** — Athletes couldn't see past race times or plan future goals in one place. Data was scattered across race-specific websites. | Unified profile with chronological event history, split times, and modality-filtered performance views. |
| 4 | **Organizer Fragmentation** — Event organizers had to manage registrations across multiple URLs and platforms for each event they hosted. | Centralized organizing dashboard for creating, managing, and tracking participants across all events. |

---

### Section 4 — Screens (Full-bleed image section)

Large mockup image: 3-up phone screens showing app states.
- Desktop: ~1258×708px, rounded corners, full-bleed within container
- Mobile: full-width

---

### Section 5 — Research & Discovery (Black background: #121212)

**Section label:** `Research & Discovery`

**Heading:** Data-Driven Decisions

**4 stat cards (in a row):**

| Stat | Label | Detail |
|------|-------|--------|
| 4/6 | Competitors Modality-Specific | Athletes couldn't find cross-sport events in one place |
| ~50% | Discover via Fragmented Sources | Search engines, social media, word-of-mouth scattered |
| 0 | Unified Multi-Sport Platforms | No single platform covered running, cycling, and CrossFit |
| 2 | Distinct User Personas | Athletes seeking events + Organizers hosting across modalities |

Desktop: 4 cards in a row. Mobile: 2×2 grid or stacked.

---

**Two-column detail section:**

**Left — Information Architecture**
"Simplified into four core areas balancing athletes and organizers while minimizing navigation complexity."

2×2 grid:
| Home | Profile |
|------|---------|
| Event discovery & search | Performance tracking |
| **Settings** | **Hosting** |
| Account & preferences | Organizer tools |

**Right — Priority Features**
"Defined from research, competitive analysis, and user personas."

Numbered list with leader lines:
```
01 ——————————————————————————  Location-based search
02 ————————————————————  Modality filtering (Run, Cycle, CrossFit)
03 ——————————————————————————  Radius-based event discovery
04 ——————————————————————————  Inline event registration
05 ——————————————————————————  Unified performance profile
06 ——————————————————————————  Event hosting dashboard
```

---

### Section 6 — Design System (Black background: #121212)

**Section label:** `Design System`

**Heading:** Built for Scale

**Subhead:** "A cohesive visual system designed around momentum — helping athletes move from past performance to future goals."

**Icon set display:**
Row 1 (32px icons): list, X, location pin, stroke location, calendar, clock, group, location-II, arrow, stack, checkmark
Row 2 (32px sport icons): CrossFit, Marathon, ShortRuns, Triathlon, Bike + small utility icons
Row 3: Facebook, Instagram

**Component samples:**
Pills/tags: `5mi · 1mi · Triathlon · Marathon · Short Run · CrossFit · Cycling`
Button: Primary CTA button (orange/accent fill)

**Color palette (4 swatches):**
| Swatch | Name | Hex |
|--------|------|-----|
| ■ Dark | Primary Dark | #121212 |
| ■ Orange | Accent Orange | #FF522A |
| ■ Near-black | Surface | #231F20 |
| ■ Off-white | Text Primary | #EEEEEE |

Desktop: icons left (~592px), components right (~592px).
Mobile: stacked.

---

### Section 7 — Completed Deliverables (Black background: #121212)

**Section label:** `Project Phases`

**Heading:** Completed Deliverables

Checklist with leader lines (right-aligned labels):

```
✓ ——————————————————————————————  Discovery & Research
✓ ——————————————————————————————  Competitive Analysis
✓ ——————————————————————————————  User Personas
✓ ——————————————————————————————  Information Architecture
✓ ——————————————————————————————  Wireframes & Flows
✓ ——————————————————————————————  Visual Design & Brand
✓ ——————————————————————————————  Usability Testing
✓ ——————————————————————————————  Design System
```

---

## 6. Asset Notes for Claude Code

### Images needed
All images should live in `/public/assets/` or `/src/assets/`:

```
/assets/
  headshot-circle.jpg         ← circular hero headshot, ~180×180px
  works/
    shadrachs-mockup.jpg      ← laptop mockup, dark bg
    relay-mockup.jpg          ← 2-up phone screens
    procreate-mockup.jpg      ← iPad mockup
    shaman-mockup.jpg         ← atmospheric dark image
    chroma-mockup.jpg         ← phone app mockup
  current/
    shadrachs-app-phone.jpg   ← phone mockup for current work section
    family-calendar-ipad.jpg  ← iPad mockup
    fitness-tracker-phone.jpg ← phone mockup
  previous-work/
    lone-wolf.jpg
    rad-shad.jpg
    vip.jpg
    russell-city-grind.jpg
    stickers.jpg
    nine-point-day.jpg
  relay/
    relay-hero-phones.jpg     ← 2-up phone screens for case study hero
    relay-screens-3up.jpg     ← 3-up screen mockups mid-page
    relay-logotype.svg        ← hand-lettered Relay wordmark SVG
```

### Logos / SVGs needed
- `R` monogram mark (nav logo)
- Relay logotype (custom script)
- Shadrachs Coffee logo (S mark + wordmark)
- Procreate® wordmark
- SHAMAN wordmark
- Chroma wordmark

---

## 7. Interactions & Animations

- **Marquee/ticker:** Horizontal auto-scroll, infinite loop, pauses on hover
- **Nav:** Sticky on scroll; transparent at top of hero, solid (#F3F5F4 or #121212 depending on section) on scroll
- **Case study rows:** Subtle fade-in or slide-up on scroll enter (Intersection Observer)
- **CTA arrow (GET IN TOUCH ↗):** Arrow nudge on hover
- **Headshot in hero:** Circular mask, positioned to overlap the "Y" in "MYERS"
- **Previous work grid:** Subtle scale on hover (1.02)
- **Status badge (OPEN TO WORK):** Pulsing green dot animation

---

## 8. Responsive Breakpoints

```
Mobile:   < 768px   (16px gutters, single-column)
Tablet:   768–1199px (stacked or 2-col, 32px gutters)
Desktop:  ≥ 1200px  (1240px content width, 100px margins)
```

---

## 9. Meta / SEO

```html
<title>Robby Myers — Product Designer</title>
<meta name="description" content="Product Designer turning complex systems into intuitive, human experiences. 15+ years of craft. Remote / Arkansas." />
<meta property="og:title" content="Robby Myers — Product Designer" />
<meta property="og:url" content="https://www.robbymyers.com" />
<meta name="robots" content="index, follow" />
```

---

## 10. Tech Stack Recommendation (for Claude Code)

- **Framework:** Next.js (App Router) or Astro
- **Styling:** Tailwind CSS + CSS custom properties for tokens
- **Fonts:** Tilting FB Pro Wide self-hosted via `@font-face` (`/public/fonts/`); system stack for SF Pro Display
- **Deployment:** Vercel
- **Animations:** Framer Motion (React) or CSS keyframes for marquee/ticker

---

*Last updated: June 2026 · robbymyers.com*
