# Corpus candidates — survey of 2026-09-30 (revised after review)

Input to `T-NOJIRA-figma-to-code-04`. The first pass selected on structure alone and produced
fragments, wireframes, covers and near-duplicate variants. This pass adds three filters and a
visual check.

**Filters that worked, and are worth keeping in the intake report:**

1. **Frame width must match a real viewport** (360/375/390/768/1024/1280/1366/1440/1512/1920 ±8)
   and height ≥ 600. Removes widgets, boards and thumbnails — the `481×1024`, `764×412`,
   `1029×617`, `1695×720` frames that dominated the first list.
2. **At least 10 distinct component types**, and instance density between 0.08 and 0.6. Removes
   covers, annotation frames and component variants: a full page draws on many components, a
   fragment on a handful.
3. **Deduplicate by component histogram** (cosine > 0.85 within a team = the same screen). This is
   what collapsed 410 frames into 51 distinct families, and it catches variants that differ only
   by a colour, a note or one element — which name-matching never would.

Result: 545 screens → 410 full pages → **51 visually distinct families**.

---

## List A — verified by eye, ready to freeze

Each was rendered and looked at. Type, shape and team all vary.

### Kampus — [Subchapter feed page](https://www.figma.com/design/73YHtIYl0UHXH8ST4J7VKI/New-content-view?node-id=5311-37116)

learning-materials page — sidebar table of contents, top bar, content feed  
`1280×720` · 1803 nodes · 83 component types · lib **99%** · ovr **11%** · det **1** · 81 variant(s) collapsed into this family

**Role in the corpus:** clean, richest (83 component types)

### MyPortal — [Chapter / Digital Exercises / Exercises](https://www.figma.com/design/1yroCKkROktqhRCP2wwlzB/MyPortal-Designs-2025?node-id=25124-56828)

chapter page with a modal over it — dense product screen  
`1440×1024` · 2147 nodes · 75 component types · lib **97%** · ovr **32%** · det **16** · 20 variant(s) collapsed into this family

**Role in the corpus:** override-heavy, rich

### Folio — [Display - Percentage LG 2](https://www.figma.com/design/o7lKWrw5sG8SZDs5QMTRH4/Folio-Designs?node-id=3762-114498)

results grid per student with a popover — data-table shaped  
`1440×1024` · 1024 nodes · 50 component types · lib **100%** · ovr **30%** · det **1** · 8 variant(s) collapsed into this family

**Role in the corpus:** table-heavy, moderate override

### Sesame — [My Groups](https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=2847-14994)

groups table: filters, row selection, bulk action bar, context menu  
`1280×1796` · 822 nodes · 39 component types · lib **98%** · ovr **91%** · det **3** · 25 variant(s) collapsed into this family

**Role in the corpus:** override-extreme (91%)

### ETSL — [Metadata usage widget](https://www.figma.com/design/S5QgDy8X9eqhvECPANSZMM/Editorial-Suite-designs?node-id=17214-103584)

functional-management dashboard of widgets — densest page found  
`1440×2032` · 1856 nodes · 49 component types · lib **82%** · ovr **49%** · det **0** · 5 variant(s) collapsed into this family

**Role in the corpus:** partial coverage (82%), dashboard

### NSP — [home](https://www.figma.com/design/sSrpLCZm302ces3khoBGls/NS-fundaments?node-id=2095-44291)

class cards grid plus a task panel with placeholders  
`1280×877` · 464 nodes · 32 component types · lib **93%** · ovr **62%** · det **8** · 1 variant(s) collapsed into this family

**Role in the corpus:** simple page, high override

### Sesame — [Learning materials](https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=340-41853)

mobile page, 360 wide — the only mobile candidate found  
`1280×800` · 561 nodes · 31 component types · lib **98%** · ovr **93%** · det **0** · 3 variant(s) collapsed into this family

**Role in the corpus:** mobile / responsive

### Kampus — [1920](https://www.figma.com/design/73YHtIYl0UHXH8ST4J7VKI/New-content-view?node-id=I9340-43907;9337-39835)

chapter card grid, image-heavy  
`1366×720` · 520 nodes · 38 component types · lib **82%** · ovr **0%** · det **0** · 5 variant(s) collapsed into this family

**Role in the corpus:** partial coverage, zero override

---

## Rejected on sight, and why

- **Itsl-Collab `collaboration folder - teacher`** — a wireframe: placeholder boxes labelled
  *Description* and *Table content + actions*, with a handwritten *main content* annotation.
  Real chrome, unfinished body. Not a fidelity case.
- **NSP `Widget`** — no instances at all; guidance for designers, not a screen.
- **SANNA `Frame 1000001011`** — a thumbnail, and its node id addresses a node inside an
  instance, so it cannot be frozen as a case.
- **Near-duplicate pairs** (`Localization`, `Default home page`, `Advanced search`,
  `Group details`, `Feedback - General`, `COVER`/`PARAGRAPH`) — now collapsed automatically
  by the histogram fingerprint rather than spotted by hand.

## Still open

- **Five teams are not yet represented in List A**: SANNA, NSP is present only via a simple
  page, It's learning, TEAS and Folio's second team. TEAS produced **no** full-page
  candidate at all under these filters — worth checking whether its designs are simply
  smaller, or whether the filters are too strict for it.
- **MAX and the Folio team link** remain unsurveyed; both need the `projects:read` scope.
- **`lib` still means *a* published library, not *ours*** — needs `team_library_content:read`.
- The representativeness sample (List B, two per team) should be rebuilt from the 51
  families rather than from the first pass.

## Team profiles — unchanged, from all 545 screens

Median library resolution is 90–100% in every team. What separates them is overrides:
It's learning 11–12%, Kampus 15%, SANNA 17%, NSP 21%, Folio 24%, MyPortal 54%, ETSL 60%,
Sesame 85%, TEAS 85%. That is a team profile rather than noise, and it is the single
strongest argument for keeping a per-team sample alongside the type-based corpus.
