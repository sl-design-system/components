# Corpus candidates — survey of 2026-09-30

Produced by a REST-API survey of 545 screen-sized frames across 11 teams. Input to
`T-NOJIRA-figma-to-code-04` (freeze the corpus). **Not yet reviewed** — every entry needs
opening before it is frozen; the classifier is a heuristic and some rows are wrong.

Columns: **lib** = share of component instances resolving to a published library (not
necessarily ours — see caveats). **ovr** = share of instances carrying local overrides.
**det** = frames whose name matches a design-system layer signature and which sit outside
any instance, so possibly detached.

---

## List A — fidelity corpus (frozen, every bench run)

Selected by **type**, to exercise each failure mode. Small on purpose: every case costs a run.


### clean, large

- **NSP — [class overview ](https://www.figma.com/design/sSrpLCZm302ces3khoBGls/NS-fundaments?node-id=2422-87039)**  
  `1280×1003` · 10936 nodes · 3735 instances · lib **99%** · ovr **1%** · det **0**
- **MyPortal — [Add file](https://www.figma.com/design/1yroCKkROktqhRCP2wwlzB/MyPortal-Designs-2025?node-id=29075-156594)**  
  `777×674` · 2462 nodes · 1087 instances · lib **100%** · ovr **4%** · det **0**

### clean, small

- **SANNA — [Localization](https://www.figma.com/design/Mzc8BuOvMxOJGAQtv0h64M/SANNA-Ready-for-Development?node-id=1938-606246)**  
  `1512×982` · 866 nodes · 308 instances · lib **99%** · ovr **5%** · det **0**
- **SANNA — [Localization](https://www.figma.com/design/Mzc8BuOvMxOJGAQtv0h64M/SANNA-Ready-for-Development?node-id=2626-106207)**  
  `1512×982` · 784 nodes · 277 instances · lib **100%** · ovr **5%** · det **0**

### override, extreme

- **Sesame — [Default home page - Multiple schools](https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=8445-15873)**  
  `1440×800` · 519 nodes · 30 instances · lib **100%** · ovr **100%** · det **19**
- **Sesame — [Default home page - single school](https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=8445-16342)**  
  `1440×800` · 505 nodes · 22 instances · lib **100%** · ovr **100%** · det **19**

### override, moderate

- **NSP — [add students](https://www.figma.com/design/sSrpLCZm302ces3khoBGls/NS-fundaments?node-id=2388-66102)**  
  `764×412` · 1819 nodes · 645 instances · lib **100%** · ovr **45%** · det **1**
- **ETSL — [Advanced search - Edit alt texts - u](https://www.figma.com/design/S5QgDy8X9eqhvECPANSZMM/Editorial-Suite-designs?node-id=22854-70290)**  
  `1591×902` · 1722 nodes · 697 instances · lib **93%** · ovr **60%** · det **1**

### detached

- **NSP — [Widget](https://www.figma.com/design/sSrpLCZm302ces3khoBGls/NS-fundaments?node-id=20-991)**  
  `800×3439` · 1285 nodes · 0 instances · lib **0%** · ovr **0%** · det **203**  
  ⚠ 0 instances — almost certainly an annotation frame, not a screen
- **Folio — [type=form1_results_5doels](https://www.figma.com/design/o7lKWrw5sG8SZDs5QMTRH4/Folio-Designs?node-id=3887-94806)**  
  `481×1024` · 1523 nodes · 322 instances · lib **68%** · ovr **31%** · det **145**

### partial coverage

- **SANNA — [Frame 1000001011](https://www.figma.com/design/Mzc8BuOvMxOJGAQtv0h64M/SANNA-Ready-for-Development?node-id=I242-798448;242-796415)**  
  `1029×617` · 2050 nodes · 16 instances · lib **62%** · ovr **18%** · det **1**  
  ⚠ node id addresses a node *inside* an instance — not freezable as a case
- **ETSL — [Metadata usage widget](https://www.figma.com/design/S5QgDy8X9eqhvECPANSZMM/Editorial-Suite-designs?node-id=17214-103584)**  
  `1440×2032` · 1856 nodes · 745 instances · lib **82%** · ovr **49%** · det **0**

### local components

- **Kampus — [Frame 31212](https://www.figma.com/design/73YHtIYl0UHXH8ST4J7VKI/New-content-view?node-id=9807-39456)**  
  `1038×3206` · 819 nodes · 69 instances · lib **27%** · ovr **86%** · det **0**

---

## List B — representativeness sample (not frozen, occasional)

At least two per team, chosen as **closest to that team's median** — the most typical screen
that team draws, not the most interesting. Its job is to check the corpus still resembles
reality, and to feed it when it finds a pattern nothing covers.


### ETSL

- [Advanced search - Edit alt texts](https://www.figma.com/design/S5QgDy8X9eqhvECPANSZMM/Editorial-Suite-designs?node-id=22854-70054) — `1591×902` · 1661 nodes · lib 92% · ovr 60% · det 1
- [Advanced search - Edit alt texts - u](https://www.figma.com/design/S5QgDy8X9eqhvECPANSZMM/Editorial-Suite-designs?node-id=22854-70528) — `1591×902` · 1642 nodes · lib 92% · ovr 60% · det 1

### Folio

- [Display - Percentage LG 3](https://www.figma.com/design/o7lKWrw5sG8SZDs5QMTRH4/Folio-Designs?node-id=3784-355242) — `1440×1024` · 983 nodes · lib 100% · ovr 28% · det 1
- [Property 1=Variant2](https://www.figma.com/design/o7lKWrw5sG8SZDs5QMTRH4/Folio-Designs?node-id=3770-158464) — `640×682` · 695 nodes · lib 100% · ovr 28% · det 0

### Itsl-Bookmk

- [Your files](https://www.figma.com/design/ya00uFyX1rjxYWF0dlOsoT/Bookmarks?node-id=4932-4253) — `1280×1237` · 871 nodes · lib 100% · ovr 18% · det 1
- [private files [folder]](https://www.figma.com/design/ya00uFyX1rjxYWF0dlOsoT/Bookmarks?node-id=4932-5505) — `1280×848` · 856 nodes · lib 100% · ovr 19% · det 1

### Itsl-Collab

- [collaboration folder - teacher](https://www.figma.com/design/Q3gzx1pCseyKnFNDUOOjCw/Collaboration-folder?node-id=5780-16623) — `1280×1220` · 479 nodes · lib 98% · ovr 10% · det 0
- [collaboration folder - teacher](https://www.figma.com/design/Q3gzx1pCseyKnFNDUOOjCw/Collaboration-folder?node-id=5780-11323) — `1280×1220` · 478 nodes · lib 98% · ovr 10% · det 0

### Itsl-Course

- [course files](https://www.figma.com/design/mONnHPTYNNaBwV3cFUHIYv/Course-files?node-id=4007-3161) — `1280×768` · 519 nodes · lib 96% · ovr 11% · det 0

### Kampus

- [Chapter with chapter-level content](https://www.figma.com/design/73YHtIYl0UHXH8ST4J7VKI/New-content-view?node-id=6708-29250) — `1280×715` · 974 nodes · lib 90% · ovr 15% · det 2
- [1942](https://www.figma.com/design/73YHtIYl0UHXH8ST4J7VKI/New-content-view?node-id=9554-49955) — `1695×720` · 877 nodes · lib 90% · ovr 15% · det 0

### MyPortal

- [Learning materials - Print exercises](https://www.figma.com/design/1yroCKkROktqhRCP2wwlzB/MyPortal-Designs-2025?node-id=23501-100094) — `1440×1100` · 1112 nodes · lib 94% · ovr 54% · det 9
- [Chapter / Digital Exercises / Exercise](https://www.figma.com/design/1yroCKkROktqhRCP2wwlzB/MyPortal-Designs-2025?node-id=25124-57812) — `1440×1024` · 1098 nodes · lib 95% · ovr 53% · det 16

### NSP

- [COVER](https://www.figma.com/design/4TdMrcnIVOn3Hrfj2OpVZU/New-Secondary?node-id=318-18652) — `1280×720` · 655 nodes · lib 97% · ovr 21% · det 0
- [PARAGRAPH](https://www.figma.com/design/4TdMrcnIVOn3Hrfj2OpVZU/New-Secondary?node-id=689-23503) — `1280×720` · 511 nodes · lib 95% · ovr 21% · det 0

### SANNA

- [Agreements](https://www.figma.com/design/Mzc8BuOvMxOJGAQtv0h64M/SANNA-Ready-for-Development?node-id=2140-658647) — `1512×982` · 1059 nodes · lib 100% · ovr 17% · det 2
- [Frame 48097621](https://www.figma.com/design/Mzc8BuOvMxOJGAQtv0h64M/SANNA-Ready-for-Development?node-id=I174-232052;174-231462) — `462×752` · 361 nodes · lib 100% · ovr 17% · det 0

### Sesame

- [Group details](https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=2142-47094) — `1280×1881` · 729 nodes · lib 97% · ovr 85% · det 1
- [Group details](https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=2142-46731) — `1280×2018` · 624 nodes · lib 97% · ovr 86% · det 1

### TEAS

- [Feedback - General](https://www.figma.com/design/LA6R23eqMcJYxVE7zgdCw0/AI-Speech-Coach-Designs?node-id=1-108031) — `1440×1024` · 290 nodes · lib 100% · ovr 85% · det 2
- [Feedback - General](https://www.figma.com/design/LA6R23eqMcJYxVE7zgdCw0/AI-Speech-Coach-Designs?node-id=1-108272) — `1440×1024` · 270 nodes · lib 100% · ovr 85% · det 2

---

## Team profiles — from all 545 screens

| Team | screens | median lib | median ovr | max det |
|---|---:|---:|---:|---:|
| Sesame | 109 | 97% | 85% | 20 |
| TEAS | 28 | 100% | 85% | 6 |
| ETSL | 14 | 90% | 60% | 1 |
| MyPortal | 89 | 95% | 54% | 24 |
| Folio | 52 | 97% | 24% | 145 |
| NSP | 80 | 96% | 21% | 203 |
| Itsl-Bookmk | 8 | 100% | 18% | 10 |
| SANNA | 21 | 100% | 17% | 2 |
| Kampus | 113 | 90% | 15% | 58 |
| Itsl-Collab | 30 | 98% | 12% | 1 |
| Itsl-Course | 1 | 96% | 11% | 0 |

Every team uses the design system heavily — median library resolution is 90–100% everywhere. What separates them is **overrides**, from 11% to 85%. That is a team profile rather than noise, and it means the pipeline will behave very differently at Sesame or TEAS than at It's learning. A corpus chosen by type alone would never have shown it.

## Caveats — read before freezing anything

- **`lib` means *a* published library, not *ours*.** The survey token lacks `team_library_content:read`, so a team using a second library is counted as design-system adoption.
- **`det` is a name-match heuristic**, built from the 34 layer names the Code Connect mappings navigate. A high count may be a team's naming convention rather than detachment. Two or three need eyeballing before the signal is trusted.
- **Near-duplicates are present** — `SANNA Localization`, `Sesame Default home page` and `ETSL Advanced search` each appear twice as variants of one screen. Take one and find a replacement for the other slot.
- **Two teams are still unsurveyed**: MAX and the Folio team link cannot be expanded without the `projects:read` scope.
- Screens below 150 nodes were excluded as too small to measure anything.
