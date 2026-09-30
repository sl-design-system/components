# Corpus candidates — survey of 2026-09-30 (revised after review)

> **Machine-readable:** [`corpus-candidates.json`](corpus-candidates.json) — the same two lists as
> data, which is what the corpus registry is built from.
>
> **Visual review page:** <https://claude.ai/code/artifact/9817634e-3ff8-4317-9960-d06d8e3b4f25> —
> every candidate rendered, with its metrics and a link to the frame in Figma.

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
3. **Full-frame overlay detection** — a rectangle or boolean shape covering the frame at reduced
   opacity is a designer's marking, not part of the design. 43 frames excluded on this, including
   the grey sheet over the MyPortal page and the `highlight` layer at 52% opacity that sits on
   **every** Folio full page.
4. **Deduplicate by component histogram** (cosine > 0.85 within a team = the same screen). This is
   what collapsed 410 frames into 51 distinct families, and it catches variants that differ only
   by a colour, a note or one element — which name-matching never would.

Result: 545 screens → 410 full pages → **51 visually distinct families**.

---

## The 19 reference designs — the flat, deduplicated list

The two lists overlap: 11 + 17 entries resolve to **19 unique Figma nodes**, because nine screens
sit in both. This is the list a baseline run iterates over. `F` = fidelity corpus, `R` =
representativeness sample.

|   # | List | Team        | Screen                                   | Nodes | Figma                                                                                                      |
| --: | ---- | ----------- | ---------------------------------------- | ----: | ---------------------------------------------------------------------------------------------------------- |
|   1 | F+R  | ETSL        | FAM - Users                              |  1512 | [open](https://www.figma.com/design/S5QgDy8X9eqhvECPANSZMM/Editorial-Suite-designs?node-id=17264-29098)    |
|   2 | F+R  | ETSL        | Metadata usage widget                    |  1856 | [open](https://www.figma.com/design/S5QgDy8X9eqhvECPANSZMM/Editorial-Suite-designs?node-id=17214-103584)   |
|   3 | R    | Itsl-Bookmk | Deleted course - content                 |   885 | [open](https://www.figma.com/design/ya00uFyX1rjxYWF0dlOsoT/Bookmarks?node-id=4549-8339)                    |
|   4 | R    | Itsl-Bookmk | course files                             |   478 | [open](https://www.figma.com/design/ya00uFyX1rjxYWF0dlOsoT/Bookmarks?node-id=4886-12955)                   |
|   5 | R    | Itsl-Collab | Add element [3rd implementation]         |   458 | [open](https://www.figma.com/design/Q3gzx1pCseyKnFNDUOOjCw/Collaboration-folder?node-id=5006-43051)        |
|   6 | F+R  | Itsl-Collab | Shared folder - teacher view             |   859 | [open](https://www.figma.com/design/Q3gzx1pCseyKnFNDUOOjCw/Collaboration-folder?node-id=4200-13792)        |
|   7 | R    | Itsl-Course | course files                             |   519 | [open](https://www.figma.com/design/mONnHPTYNNaBwV3cFUHIYv/Course-files?node-id=4007-3161)                 |
|   8 | R    | Kampus      | Chapter page – Notes side panel – With n |  1038 | [open](https://www.figma.com/design/73YHtIYl0UHXH8ST4J7VKI/New-content-view?node-id=5308-32158)            |
|   9 | F+R  | Kampus      | Subchapter feed page                     |  1803 | [open](https://www.figma.com/design/73YHtIYl0UHXH8ST4J7VKI/New-content-view?node-id=5311-37116)            |
|  10 | F+R  | MyPortal    | Chapter / Digital Exercises / Exercises  |  2147 | [open](https://www.figma.com/design/1yroCKkROktqhRCP2wwlzB/MyPortal-Designs-2025?node-id=25124-56828)      |
|  11 | F+R  | MyPortal    | Materials /Overviews                     |   974 | [open](https://www.figma.com/design/1yroCKkROktqhRCP2wwlzB/MyPortal-Designs-2025?node-id=15878-180439)     |
|  12 | F    | NSP         | Group list                               |   620 | [open](https://www.figma.com/design/4TdMrcnIVOn3Hrfj2OpVZU/New-Secondary?node-id=334-20573)                |
|  13 | F+R  | NSP         | class overview                           | 10936 | [open](https://www.figma.com/design/sSrpLCZm302ces3khoBGls/NS-fundaments?node-id=2422-87039)               |
|  14 | R    | NSP         | home                                     |   464 | [open](https://www.figma.com/design/sSrpLCZm302ces3khoBGls/NS-fundaments?node-id=2095-44291)               |
|  15 | R    | SANNA       | Account creation                         |   506 | [open](https://www.figma.com/design/Mzc8BuOvMxOJGAQtv0h64M/SANNA-Ready-for-Development?node-id=174-232051) |
|  16 | F+R  | SANNA       | Login 1                                  |   894 | [open](https://www.figma.com/design/Mzc8BuOvMxOJGAQtv0h64M/SANNA-Ready-for-Development?node-id=71-13345)   |
|  17 | R    | Sesame      | Group details                            |   950 | [open](https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=2142-48093)           |
|  18 | F    | Sesame      | Learning materials                       |   395 | [open](https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=116-19049)            |
|  19 | F+R  | Sesame      | My Groups                                |   822 | [open](https://www.figma.com/design/UBr399hnydpNF9P5Jb2vfx/MySesame-Redesign?node-id=2847-14994)           |

One of the nineteen — SANNA `Login 1` — has been run; see
[`smoke-run-findings.md`](smoke-run-findings.md). Eighteen remain.

---

## List A — verified by eye, ready to freeze

Eleven cases, each rendered and looked at. See the review page linked above for the images.

| #   | Team        | Screen                       | Role in the corpus                                       |
| --- | ----------- | ---------------------------- | -------------------------------------------------------- |
| A1  | Kampus      | Subchapter feed page         | clean, richest — 83 component types                      |
| A2  | NSP         | class overview               | clean, largest — 10 936 nodes                            |
| A3  | MyPortal    | Chapter / Digital Exercises  | rich product page, moderate override                     |
| A4  | Sesame      | My Groups                    | override extreme — 91%                                   |
| A5  | ETSL        | Metadata usage               | widget dashboard, partial coverage 82%                   |
| A6  | Itsl-Collab | Shared folder – teacher view | rich, 71 component types                                 |
| A7  | MyPortal    | Materials / Overviews        | detached candidates + 64% override                       |
| A8  | NSP         | Group list                   | detached candidates (12)                                 |
| A9  | SANNA       | Login 1                      | simplest clean page — the sanity case                    |
| A10 | ETSL        | FAM – Users                  | data table page: filters, table, row actions, pagination |
| A11 | Sesame      | Learning materials           | mobile, 360 wide — the only responsive case              |

Two entries were replaced after review. **ETSL `Part 1`** was a fragment — the search area of a page,
not a page — and is replaced by `FAM – Users`, found by surveying four more of ETSL's 21 pages.
**Kampus `1920`** was a cover and is out; the mobile slot it left is filled by Sesame's 360-wide
page instead.

**A9 is the deliberate floor case.** A login screen is simple, and that is the point: if the
pipeline cannot reproduce the simplest clean page in the corpus, no score on the harder ones means
anything. It is also the first case to drop if it proves to teach nothing.

---

## Rejected on sight, and why

- **Itsl-Collab `collaboration folder - teacher`** — a wireframe: placeholder boxes labelled
  _Description_ and _Table content + actions_, with a handwritten _main content_ annotation.
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
- **`instances` counts nested instances too.** A screen reported with 318 instances has six
  top-level ones; the rest are their internals. Read it as how much of the tree is
  component-derived, not as a component count.
- **`lib` still means _a_ published library, not _ours_** — needs `team_library_content:read`.
- The representativeness sample (List B, two per team) should be rebuilt from the 51
  families rather than from the first pass.

## Team profiles — unchanged, from all 545 screens

Median library resolution is 90–100% in every team. What separates them is overrides:
It's learning 11–12%, Kampus 15%, SANNA 17%, NSP 21%, Folio 24%, MyPortal 54%, ETSL 60%,
Sesame 85%, TEAS 85%. That is a team profile rather than noise, and it is the single
strongest argument for keeping a per-team sample alongside the type-based corpus.
