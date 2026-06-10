# FIGMA.md — Robby Myers Portfolio · Node Reference
## Source file: https://www.figma.com/design/yKCQQcYoYL9xzIzzgz7CmR/Robby-Myers-2026

> Hand this to Claude Code alongside CLAUDE.md.
> Tell Claude Code: "Read CLAUDE.md and FIGMA.md before writing any code."
> To pull design context for any node, Claude Code calls get_design_context with:
>   fileKey = yKCQQcYoYL9xzIzzgz7CmR
>   nodeId  = (value from this file, colon format e.g. 62:55)

---

## Pages

| Page Name     | Page Node ID |
|---------------|-------------|
| Design        | 0:1         |
| Relay Assets  | 69:217      |
| Assets        | 37:2        |

---

## GLOBAL COMPONENTS  (Assets page · node 37:2)

### Navigation
| Component           | Node ID  | Notes                              |
|---------------------|----------|------------------------------------|
| Header (Desktop)    | 62:54    | White variant (Property 1=Default) |
| Header (Desktop)    | 69:60    | Black variant (Property 1=Black)   |
| Header-Mobile       | 71:260   | White variant                      |
| Header-Mobile       | 71:262   | Dark variant                       |
| Logo (Black)        | 62:21    | R monogram, dark fill              |
| Logo (Red)          | 62:22    | R monogram, red fill               |
| NavLink             | 62:36    | Single nav link component          |
| Hamburger           | 71:254   | Mobile menu toggle icon            |

### Typography / Hero
| Component           | Node ID  | Notes                              |
|---------------------|----------|------------------------------------|
| Name (Desktop)      | 64:107   | Full ROBBY MYERS name block w/ headshot |
| FirstName           | 64:94    | "ROBBY" isolated                   |
| LastName            | 64:93    | "MYERS" isolated                   |
| RotatingBannerText  | 64:120   | Single marquee text instance       |

### Pills & Tags
| Component           | Node ID  | Notes                              |
|---------------------|----------|------------------------------------|
| Pill                | 69:119   | Case study role/tag pill           |

### Icons
| Component           | Node ID  | Notes                              |
|---------------------|----------|------------------------------------|
| Target              | 69:136   | Metrics icon                       |
| Stack               | 69:145   | Metrics icon                       |
| Clock               | 69:151   | Metrics icon                       |
| Danger              | 69:243   | Friction card icon                 |
| Solution (icon)     | 69:249   | Checkmark/solution icon            |
| RightArrow          | 69:333   | Inline arrow →                     |
| Search              | 69:558   | Research stat card icon            |
| Chart               | 69:561   | Research stat card icon            |
| Map                 | 69:564   | Research stat card icon            |
| People              | 69:573   | Research stat card icon            |
| Mail                | 101:2161 | Contact footer icon                |
| LinkedIn            | 101:2160 | Contact footer icon                |

### Lists & Capabilities
| Component           | Node ID  | Notes                              |
|---------------------|----------|------------------------------------|
| ToolKit-List        | 101:1768 | Capabilities list item (Default)   |
| ToolKit-List-V2     | 101:1769 | Capabilities list item (Variant 2) |

### Portfolio / Work Rows
| Component           | Node ID  | Notes                              |
|---------------------|----------|------------------------------------|
| PortFrame (Desktop) | 75:840   | Case study row, desktop            |
| PortFrame (Mobile)  | 121:2504 | Case study row, mobile             |
| PortFrame (Hover)   | 75:842   | Desktop hover state                |
| PortFrame Mobile Hover | 121:2571 | Mobile hover state              |

### Previous Work Tiles
| Component           | Node ID  | Notes                              |
|---------------------|----------|------------------------------------|
| LoneWolf-Home       | 101:2096 | Previous work grid tile            |
| NinePointDay-Home   | 101:2095 | Previous work grid tile            |
| RadShaddy-Home      | 101:2094 | Previous work grid tile            |
| Stickers-Home       | 101:2092 | Previous work grid tile            |
| VIP-Home            | 101:2093 | Previous work grid tile            |
| RCG-Home            | 101:2091 | Previous work grid tile (Ridge City Grind) |

### Contact / Footer
| Component           | Node ID  | Notes                              |
|---------------------|----------|------------------------------------|
| GetInTouch (Desktop)| 101:2137 | "GET IN TOUCH↗" CTA block          |
| GetInTouch (Hover)  | 101:2139 | Hover state                        |
| GetInTouch (Mobile) | 121:3056 | Mobile CTA                         |
| GetInTouch Mobile Click | 121:3059 | Mobile click state              |

### Relay Case Study Components
| Component           | Node ID  | Notes                              |
|---------------------|----------|------------------------------------|
| Friction Card       | 69:282   | Friction block (red, w/ Danger icon)|
| Solution Card       | 69:283   | Solution block                     |

---

## HOME PAGE  (Design page · node 0:1)

### Home — Desktop  (node 62:15, 1440px wide)

| Section                    | Node ID   | Background  |
|----------------------------|-----------|-------------|
| Full Home Desktop frame    | 62:15     | —           |
| Nav instance               | 62:55     | #F3F5F4     |
| Hero subtitle header       | 64:75     | #F3F5F4     |
| Hero name / headshot block | 64:115    | #F3F5F4     |
| Scroll prompt              | 64:117    | #F3F5F4     |
| Marquee / HorizScroll      | 64:124    | #121212     |
| About section              | 66:170    | #F3F5F4     |
| Selected Works (black)     | 66:177    | #121212     |
| — Work row 01 (Shadrachs)  | 80:871    | —           |
| — Work row 02 (Relay)      | 80:899    | —           |
| — Work row 03 (Procreate)  | 84:1041   | —           |
| — Work row 04 (Shaman)     | 84:1226   | —           |
| — Work row 05 (Chroma)     | 98:1331   | —           |
| Current Work section       | 98:1381   | #F3F5F4     |
| — Shadrachs card           | 98:1615   | —           |
| — Family Calendar card     | 101:1623  | —           |
| — Fitness Tracker card     | 101:1635  | —           |
| Capabilities section       | 101:1690  | #F3F5F4     |
| — Design column            | 101:1774  | —           |
| — Research column          | 101:1801  | —           |
| — Tools column             | 101:1832  | —           |
| Previous Work section      | 101:1860  | #121212     |
| — Previous Work grid       | 101:2109  | —           |
| Contact / Footer (red)     | 101:2110  | #FD4338     |

### Home — Mobile  (node 101:2187, 393px wide)

| Section                    | Node ID   | Background  |
|----------------------------|-----------|-------------|
| Full Home Mobile frame     | 101:2187  | —           |
| Nav (mobile instance)      | 101:2188  | #F3F5F4     |
| Hero section               | 101:2249  | #F3F5F4     |
| — Header text (subtitle)   | 101:2212  | —           |
| — Name block (ROBBY/MYERS) | 101:2239  | —           |
| — Scroll prompt            | 101:2247  | —           |
| Marquee / HorizScroll      | 101:2254  | #121212     |
| About section              | 101:2273  | #F3F5F4     |
| Selected Works (black)     | 101:2282  | #121212     |
| Current Work section       | 121:2861  | #F3F5F4     |
| — Shadrachs card           | 121:2870  | —           |
| — Family Calendar card     | 121:2880  | —           |
| — Fitness Tracker card     | 121:2902  | —           |
| Capabilities section       | 121:2931  | #F3F5F4     |
| Previous Work section      | 121:3014  | #121212     |
| Contact / Footer (red)     | 121:3033  | #FD4338     |

---

## RELAY CASE STUDY  (/relay)

### Relay — Desktop  (node 69:39, 1440px wide)

| Section                         | Node ID   | Notes                        |
|---------------------------------|-----------|------------------------------|
| Full Relay Desktop frame        | 69:39     | —                            |
| Nav instance                    | 69:40     | Black variant                |
| Hero (logo + tagline + pills)   | 69:113    | #121212                      |
| — Left col (logo, pills, stats) | 69:112    | —                            |
| — Executive Summary card        | 69:192    | —                            |
| Hero image (phones mockup)      | 69:223    | Full-bleed                   |
| Problem/Solution section        | 69:225    | #121212                      |
| — Design Challenge callout      | 69:234    | —                            |
| — Friction/Solution rows        | 69:395    | —                            |
|   Row 1 (Fragmented Discovery)  | 69:326    | —                            |
|   Row 2 (4-Step Registration)   | 69:337    | —                            |
|   Row 3 (No Perf Tracking)      | 69:366    | —                            |
|   Row 4 (Organizer Fragment.)   | 69:396    | —                            |
| 3-up screens image block        | 69:427    | Full-bleed                   |
| Research & Discovery section    | 69:428    | #121212                      |
| — 4 stat cards row              | 69:594    | —                            |
| — IA + Priority Features        | 69:681    | —                            |
| Design System section           | 69:688    | #121212                      |
| — Icon set + components         | 69:692    | —                            |
| — Color palette row             | 69:964    | —                            |
| Completed Deliverables section  | 69:1048   | #121212                      |
| — Deliverables checklist        | 69:1148   | —                            |

### Relay — Mobile  (node 71:209, 393px wide)

| Section                         | Node ID   | Notes                        |
|---------------------------------|-----------|------------------------------|
| Full Relay Mobile frame         | 71:209    | —                            |
| Nav (mobile instance)           | 71:282    | —                            |
| Hero container                  | 71:328    | #121212                      |
| — Left col content              | 71:329    | —                            |
| — Executive Summary card        | 71:362    | —                            |
| Hero image                      | 71:392    | Full-bleed                   |
| Problem/Solution section        | 71:394    | #121212                      |
| — Design Challenge callout      | 71:399    | —                            |
| — Friction/Solution rows        | 71:402    | —                            |
|   Row 1                         | 71:403    | —                            |
|   Row 2                         | 71:409    | —                            |
|   Row 3                         | 71:415    | —                            |
|   Row 4                         | 71:421    | —                            |
| 3-up screens image block        | 71:519    | Full-bleed                   |
| Research & Discovery section    | 71:521    | #121212                      |
| — 4 stat cards                  | 71:525    | —                            |
| — IA + Priority Features        | 71:546    | —                            |
| Design System section           | 71:601    | #121212                      |
| — Icon set                      | 71:606    | —                            |
| — Color palette                 | 71:646    | —                            |
| Completed Deliverables section  | 71:687    | #121212                      |
| — Deliverables checklist        | 71:691    | —                            |

---

## QUICK REFERENCE — Most-used nodes for Claude Code

```
FILE KEY:  yKCQQcYoYL9xzIzzgz7CmR

# Start here — full pages
Home Desktop:    0:1  →  frame 62:15
Home Mobile:     0:1  →  frame 101:2187
Relay Desktop:   0:1  →  frame 69:39
Relay Mobile:    0:1  →  frame 71:209

# Global components (build these first)
Nav Desktop:     62:54  (white) / 69:60 (black)
Nav Mobile:      71:260 (white) / 71:262 (dark)
Logo:            62:21  (black) / 62:22 (red)

# Home sections — Desktop
Hero name:       64:115
Marquee:         64:124
About:           66:170
Selected Works:  66:177
Current Work:    98:1381
Capabilities:    101:1690
Previous Work:   101:1860
Footer/Contact:  101:2110

# Home sections — Mobile
Hero:            101:2249
Marquee:         101:2254
About:           101:2273
Selected Works:  101:2282
Current Work:    121:2861
Capabilities:    121:2931
Previous Work:   121:3014
Footer/Contact:  121:3033

# Relay sections — Desktop
Hero:            69:113
Problem/Solution: 69:225
Screens:         69:427
Research:        69:428
Design System:   69:688
Deliverables:    69:1048

# Relay sections — Mobile
Hero:            71:328
Problem/Solution: 71:394
Screens:         71:519
Research:        71:521
Design System:   71:601
Deliverables:    71:687
```

---

*Auto-generated from Figma MCP · June 2026 · robbymyers.com*
