# Design Manifest — A1 Kampus "Subchapter feed page"

Figma: https://www.figma.com/design/73YHtIYl0UHXH8ST4J7VKI/New-content-view?node-id=5311-37116
fileKey `73YHtIYl0UHXH8ST4J7VKI`, nodeId `5311:37116`. Theme `kampus`. Framework `lit`. i18n **off**.
Output location: `examples/lit/src/_runs/a1-kampus-subchapter-feed/`.

## Overview

Kampus LMS subchapter content-feed page, viewport **1280 × 720** (content column scrolls to ~1856px).
Three regions: a persistent app shell (purple top header bar + vertical left toolbar), a
collapsible Table-of-Contents sidebar, and a scrollable content column containing a breadcrumb,
a page heading with actions, content-type filter pills, a "Student view" toggle, and a feed of
theory/exercise cards grouped under section headings.

Visible content (from the reference screenshot, Finnish):

- Header nav: "My page" (home icon) | "Learning materials" (active) | "Tests" | "Dashboard" |
  search, bell (badge "3"), help, account icons on the right.
- Left toolbar (vertical, 74px): Contents, Edit content (badge 4), Assignments (badge 1), Notes,
  Access key — each an icon above a small label.
- ToC sidebar (360px): title "Table of Contents" + close X; "Expand all" / "Collapse all";
  entries "Start page", "Minä, kieli ja kulttuuri" (expanded) with children "Jakson tavoitteet",
  "1. Kieli, kulttuuri ja identiteetti" (selected), "2. Maailman kielet", "3. Suomen sukukielet",
  "4. Monikielinen Suomi", "5. Suomen kielen ominaispiirteet", "6. Puhekielen vaihtelu",
  "Open oma kappale"; then "Kielitieto", "Lukutaito".
- Breadcrumb: "Start page" › "Kielitieto" › "Kieli, kulttuuri ja identiteetti", with two round
  purple prev/next buttons on the right.
- Page heading: "1. Kieli, kulttuuri ja identiteetti" + link and overflow (…) icon actions.
- Filters: label "Filter" + pills "Show everything" (selected), "Text" (count 11),
  "Exercise" (count 26).
- Toggle: "Student view" (off).
- Section heading "Teksti" (purple underline, link + … + list/grid view-toggle pair),
  then one theory card: image thumbnail, title "Kieli, kulttuuri ja identiteetti", truncated body,
  … overflow, and a footer row labelled "Text".
- Section heading "Tehtävät", then exercise cards 2-up: "Self -correcting exercise" /
  "1.7 Vastaa kysymyksiin" with a purple rounded icon tile and a … overflow.

## Structure (from `get_metadata`, shallow — 47 nodes, not 1803)

```
frame 5311:37116 "Subchapter feed page" 1280x720
├── instance 5311:37117 "Fullscreen toggle"            x1192 y569  88x122
├── frame    5311:37118 "side-by-side"                 x0    y56   1280x664
│   ├── instance 5311:37119 "Table of contents - proto/feed"      (hidden)
│   ├── instance 5311:37120 "Table of contents - Elements basics" x74 y0 360x664
│   └── frame    5311:37121 "content"                  x434  y0    846x664
│       ├── instance 5311:37122 "breadcrumb-2023"          y0    798x64
│       ├── instance 5311:37123 "Feed headings (2023)"     y80   798x40   (page title)
│       ├── instance 5311:37124 "Feed filters"             y136  798x32
│       ├── instance 5311:37125 "Student view"             y184  798x24
│       ├── instance 5311:37126 "Feed headings (2023)"     y224  798x56   (section "Teksti")
│       ├── instance 5311:37127 "Theory-card-UPDATE"       y296  798x176
│       ├── instance 5311:37128 "Feed headings (2023)"     y488  798x56   (section "Tehtävät")
│       ├── frame 5311:37129/37130 → 2x "Exercise-card-UPDATE" 390x144
│       ├── frame 5311:37133/37134 → 2x "Exercise-card-UPDATE"
│       ├── instance 5311:37137 "Feed headings (2023)"     y880  798x56
│       ├── instance 5311:37138 "Theory-card-UPDATE"       y952
│       ├── instance 5311:37139 "Theory-card-UPDATE"       y1144
│       ├── instance 5311:37140 "Feed headings (2023)"     y1336 798x56
│       ├── frame 5311:37141/37142 → 2x "Exercise-card-UPDATE"
│       ├── frame 5311:37145/37146 → 2x "Exercise-card-UPDATE"
│       └── frame 5311:37149 "placeholder"               x314 y1728 218x128
├── instance 5311:37150 "Left-toolbar"                  x0 y56  74x664
└── instance 5311:37151 "Header-navigation"             x0 y0   1280x56
```

**Repeat counts:** Feed headings ×5, Theory-card ×3, Exercise-card ×8 (4 rows of 2).

## Code Connect — GAP (not a blocker)

`get_code_connect_map` returned a **completely empty map `{}`** for the root node and for every one
of the 10 distinct top-level component instances queried individually. Not `null` entries, not
`hasTemplate: false` entries — nothing at all. This Figma file has no Code Connect mappings
published.

Per hint 1 this is recorded as a manifest gap and the run continues. **No row below is
CC-confirmed**; every mapping is inferred from the Figma component's own description (several are
marked "✅ implemented" in the library) cross-referenced against package names that actually exist
in `packages/components/`. The implementer must verify, not trust.

## Existing SLDS Components (identified by inference — CC map empty)

| Node                                | Figma name                         | Probable SLDS component                                                      |
| ----------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------- |
| `I5311:37117;12545:192803`          | Icon-button (fullscreen toggle)    | `sl-button` icon-only, round                                                 |
| `I5311:37122;9353:30350`            | Icon-button (breadcrumb prev/next) | `sl-button` icon-only                                                        |
| `I5311:37120;9396:25962`            | Icon-button (ToC close X)          | `sl-button` icon-only                                                        |
| `I5311:37120;9396:25965/25966`      | Button (Expand all / Collapse all) | `sl-button` text/tertiary                                                    |
| `I5311:37151;9353:30115;9353:30299` | number-tag (bell badge "3")        | `sl-badge`                                                                   |
| `I5311:37124;9367:23147;9355:22441` | number-tag (filter-pill count)     | `sl-badge`                                                                   |
| `I5311:37124;9367:23146`            | Filter-pill ("Show everything")    | `sl-tag` selectable (desc: "radiobutton type of component, used as filters") |
| `1702:18966` inside `5311:37125`    | Simple-toggle                      | `sl-switch`                                                                  |
| `5311:37122`                        | breadcrumb-2023                    | `sl-breadcrumbs`                                                             |
| `5311:37127` / `5311:37131`         | Theory-card / Exercise-card        | `sl-card`                                                                    |
| `5311:37150`                        | Left-toolbar                       | `sl-tool-bar` vertical                                                       |

Bespoke Kampus composites with **no single-package match** — build from primitives:
`Header-navigation` (5311:37151), `Table of contents` (5311:37120),
`Feed headings (2023)` (×5), `Feed filters` (5311:37124), `Student view` (5311:37125).

## Composition Candidates

- **Feed page header** — breadcrumb + page heading + filters + student-view toggle, stacked as one
  contiguous unit at the top of the content column.
- **Exercise card row (2-up)** — the four `Frame 1434` wrappers, each two 390px cards side by side.
- **App shell chrome** — Header-navigation + Left-toolbar: persistent, page-independent framing.

## Net-New Primitive Candidates

- **Exercise difficulty rating** — 3-star indicator in the Exercise-card footer
  (`star` 1701:4873 / `star-outlined` 1701:8049). No `rating`/`star` package exists.
- **`placeholder` frame** (`5311:37149`, 218×128, below the fold) — empty leaf, no children or
  description. Likely a loading skeleton or empty-state spacer; genuinely ambiguous. Flagged, not
  guessed.

## Responsive Breakpoints

Single breakpoint: **1280px**. No alternate-width frames or layout-grid breakpoint annotations.

## Designer Annotations

None. No annotation/comment-layer nodes in the metadata tree.

## Token Reference

Searched the Kampus theme (`packages/themes/kampus/theme.css`) for an exact match before flagging
anything unbound (hint 3).

### Colour — exact token found (would otherwise have been flagged unbound)

| Figma variable                                        | Value     | Token                                       |
| ----------------------------------------------------- | --------- | ------------------------------------------- |
| `Primary/$kampus-color-purple-7`, `Primary/Default`   | `#643695` | `--sl-brand-light-color-palette-purple-700` |
| `Neutrals/$kampus-color-gray-9`                       | `#0E0E0F` | `--sl-brand-light-color-palette-grey-900`   |
| `Neutrals/$kampus-color-gray-1`                       | `#F5F5F6` | `--sl-brand-light-color-palette-grey-050`   |
| `Neutrals/$kampus-color-white`, `Neutrals/Full White` | `#FFFFFF` | `--sl-color-white` / `…-grey-000`           |

### Colour — genuinely unbound (no exact match; nearest listed)

| Figma variable                    | Value      | Nearest                                                    |
| --------------------------------- | ---------- | ---------------------------------------------------------- |
| `Neutrals/$kampus-color-gray-8`   | `#29292B`  | grey-800 `#3b3b3e`                                         |
| `Neutrals/$kampus-color-gray-7`   | `#444548`  | grey-700 `#434347` (near-miss)                             |
| `Neutrals/$kampus-color-gray-6`   | `#6D6E73`  | grey-400 `#696a71` / grey-500 `#595961`                    |
| `Neutrals/$kampus-color-gray-3`   | `#CECFD2`  | grey-150 `#cfd0d2` (near-miss)                             |
| `Neutrals/$kampus-color-gray-2`   | `#E2E2E4`  | grey-100 `#e5e5e8`                                         |
| `Primary/$kampus-color-purple-1`  | `#F0ECF5`  | purple-100 `#f2ebfc` (near-miss)                           |
| `Dashboard/kampus-color-orange-8` | `#DB7109`  | none in the orange scale                                   |
| breadcrumb gradient grey          | unresolved | re-derive from `--sl-color-palette-grey-050` → transparent |

### Size / spacing — all bound, none unbound

4 / 8 / 16 / 24 / 40 / 56px map exactly to `--sl-size-050` / `-100` / `-200` / `-300` / `-500` / `-700`.

### Typography

Figma style names come from a **legacy Kampus type scale**, not literal `--sl-text-*` names:
`UI/Button`, `UI/Extra-Tiny`, `UI/Extra-tiny-semibold`, `UI/Extra-small-regular`,
`UI/Extra-small-semibold`, `UI/Small-semibold`, `UI/Tiny-bold`, `Body/Small`,
`New look & feel 2023/h1…h4 (desktop)`. The Kampus theme does define a full
`--sl-text-*` / `--sl-heading-*` / `--sl-title-*` / `--sl-label-*` scale. Resolving each legacy
style to a specific token needs per-userGroup/per-breakpoint resolution — **the implementer must
map these precisely against `packages/themes/kampus/typography.css` rather than guess.**

### Other

- `shadow-low` / `Right Border/shadow-low` = `DROP_SHADOW #6D6E7359 0/2/8/0`. Its colour component
  is itself unbound; no exact `--sl-elevation-shadow-*` match confirmed — verify against
  `--sl-elevation-shadow-overflow` / `-overlay`.
- Content-bound variables (text content, not tokens): `subchapter1-0_name` … `subchapter1-7_name`,
  `my-page`, `learning-materials`, `tests`, `dashboard`.

## Artifacts

- `screenshot.png` — 1280×720, 207KB (ground truth)
- `figma-metadata.json`, `figma-code-connect-map.json`, `figma-design-context.md`,
  `figma-variable-defs.json`

---

# Decomposition (Stage 2)

**9 new components, 3 levels deep.** Deliberately not one component per Figma node: 5 "Feed
headings" instances collapse into one `sl-feed-section-heading`, 8 "Exercise-card" instances into
one `sl-exercise-card` mapped from an array, the four `Frame 1434` 2-up wrappers into CSS grid
inside `sl-subchapter-feed-list`, and the 3-star rating stays inline in the exercise card rather
than becoming a net-new primitive.

```
<sl-subchapter-feed-page>                  root, owns ALL data + layout
  ├── <sl-kampus-app-header>               purple top bar (56px)
  ├── <sl-kampus-left-toolbar>             vertical 74px rail
  ├── <sl-kampus-toc-sidebar>              360px collapsible ToC
  ├── <sl-subchapter-feed-header>          breadcrumb + title + filters + toggle
  └── <sl-subchapter-feed-list>            scrollable feed body
        ├── <sl-feed-section-heading>      x5 instances, 1 component
        ├── <sl-theory-card>               x3 instances, 1 component
        └── <sl-exercise-card>             x8 instances, 1 component
```

Folder layout under `examples/lit/src/_runs/a1-kampus-subchapter-feed/`:
`subchapter-feed-page.{ts,css,stories.ts}`, `models.ts`, `mock-data.ts`,
`app-header/kampus-app-header.*`, `left-toolbar/kampus-left-toolbar.*`,
`toc-sidebar/kampus-toc-sidebar.*`, `feed-header/subchapter-feed-header.*`,
`feed-list/subchapter-feed-list.*`, `feed-list/section-heading/feed-section-heading.*`,
`feed-list/theory-card/theory-card.*`, `feed-list/exercise-card/exercise-card.*`.

Only the root registers globally; children render through the parent's `scopedElements` map.

## Shared Types / Contracts

Live in `models.ts` — **written by the orchestrator, not by an implementer**. See "Pipeline gap"
below. Exports: `AppNavId`, `AppHeaderActionId`, `ToolId`, `FeedFilterId`, `FeedViewMode`,
`FeedItemKind`, `ExerciseType`, `ToolbarModel`, `TocEntry`, `TocModel`, `BreadcrumbItem`,
`FeedFilterCounts`, `FeedHeaderModel`, `TheoryCardModel`, `ExerciseCardModel`, `FeedSection`,
`FeedListModel`, `SubchapterFeedPageData`. Event-payload aliases stay in the emitting component.

**Pipeline gap found here:** Stage 3 mandates leaves-first implementation, but every level imports
one shared contracts module. No implementer can own it — the leaves need it before the root exists.
The orchestrator authored `models.ts` and `mock-data.ts` up front. The pipeline does not assign
this work to anyone.

## Open questions and the default chosen

30 open questions — against nine on the simplest screen in the batch.

| #   | Question                                                                                                       | Default chosen                                                                                                                                                                     |
| --- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `placeholder` frame (5311:37149, 218x128, below fold, empty leaf) — skeleton, empty state, or designer spacer? | **Omit entirely.** No description, below the fold, not in the reference capture.                                                                                                   |
| 2   | Hidden "Table of contents - proto/feed" variant (5311:37119)                                                   | **Ignore; build the visible "Elements basics" instance.**                                                                                                                          |
| 3   | 3-star rating → net-new `sl-rating` primitive?                                                                 | **No.** Inline icons + CSS in `sl-exercise-card`. Appears in one place; a net-new primitive is high-cost.                                                                          |
| 4   | Is the rating interactive?                                                                                     | **Read-only.** `role="img"` + `aria-label`, individual glyphs `aria-hidden`.                                                                                                       |
| 5   | `ExerciseType` variant list; reproduce the stray space in "Self -correcting exercise"?                         | **Three-value union, `self-correcting` the only evidenced one. Reproduce the stray space verbatim** — this is a fidelity run.                                                      |
| 6   | View toggle scope / persistence                                                                                | **Per-section, local UI state, not persisted. Rendered on every section heading.**                                                                                                 |
| 7   | "Student view" — hide affordances or route change?                                                             | **Boolean propagated down as `actionsHidden`.**                                                                                                                                    |
| 8   | Scroll ownership                                                                                               | **Content column scrolls inside the root**, fixed 720 viewport, matching the design.                                                                                               |
| 9   | Fullscreen toggle (5311:37117, x1192 y569, 88x122) — what does it toggle?                                      | **Omit from render.** Not visible in the 1280x720 reference; rendering a guess would create a false diff. Recorded as a deliberate omission.                                       |
| 10  | Breadcrumb prev/next semantics                                                                                 | **Previous/next subchapter**; `hasPrevious`/`hasNext` stay on `FeedHeaderModel`.                                                                                                   |
| 11  | Filter counts (11 / 26) vs. items shown                                                                        | **Totals for the subchapter**; counts are static model data; filtering is client-side.                                                                                             |
| 12  | English nav labels in a Finnish design                                                                         | **Keep verbatim** — they are content-bound Figma variables and the design's own state.                                                                                             |
| 13  | `sl-tree` vs bespoke ToC                                                                                       | **Bespoke nested `<ul>` + CSS.** `sl-tree` needs a `TreeDataSource`, heavier than `TocEntry[]`. Implementer verifies and reports.                                                  |
| 14  | `sl-tool-bar` vertical for the rail                                                                            | **Bespoke `<ul role="toolbar">`.** Design wants icon-above-label entries with badges at 74px.                                                                                      |
| 15  | `sl-card` vs bespoke for the two cards                                                                         | **Implementer reads `sl-card`'s real slots first, then chooses, and reports the choice.** Bespoke `<article>` is the sanctioned fallback.                                          |
| 16  | `sl-tag` as a selectable filter pill                                                                           | **Verify then choose**; bespoke buttons + `role="radiogroup"` is the fallback.                                                                                                     |
| 17  | Three different badge treatments                                                                               | **`sl-badge` where it fits, bespoke `<span>` otherwise.**                                                                                                                          |
| 18  | `sl-breadcrumbs` API (array vs slotted)                                                                        | **Verify then choose**; `BreadcrumbItem[]` is written for an array API.                                                                                                            |
| 19  | `sl-switch` label placement                                                                                    | **Verify**; leading visible label either way.                                                                                                                                      |
| 20  | Five near-miss colours                                                                                         | **Accept the nearest semantic token and take the pixel delta.** Recorded, not hidden.                                                                                              |
| 21  | `Dashboard/kampus-color-orange-8` #DB7109, no token anywhere                                                   | **Hardcode the raw hex with a comment.** Genuinely unbound — the one value the theme cannot express.                                                                               |
| 22  | Legacy Kampus typography → token mapping                                                                       | **Resolved once by the orchestrator and handed to all implementers** (see the brief). The decomposer flagged this as the single largest drift source across parallel implementers. |
| 23  | `shadow-low` = `#6D6E7359 0/2/8/0`                                                                             | **Use `--sl-elevation-shadow-overflow` if defined, else the raw value.**                                                                                                           |
| 24  | Unbound layout dims (74 / 360 / 846 / 798 / 390 / 176 / 144px)                                                 | **Hardcode px at the single 1280 breakpoint.** The bound `--sl-size-*` set is only 4/8/16/24/40/56.                                                                                |
| 25  | Should the app shell live inside the page root?                                                                | **Yes.** Keeps the story rendering the full screen with zero args, as the conventions require. No 10th component.                                                                  |
| 26  | Split feed-header from feed-list?                                                                              | **Keep the split.**                                                                                                                                                                |
| 27  | `FeedSection.items` union                                                                                      | **Discriminate on `section.kind`.**                                                                                                                                                |
| 28  | Cards: `-open` event and a link-wrapped title are redundant                                                    | **Keep both** — the link carries keyboard reachability, the event lets a host intercept. Redundancy noted.                                                                         |
| 29  | `actionsHidden` naming/propagation                                                                             | **Root computes it from `studentView`; cards receive `actionsHidden`.**                                                                                                            |
| 30  | A story per child, or only the root?                                                                           | **One basic story per component** (Stage 3 requires it); **Stage 4 validates only the root.**                                                                                      |

## Orchestrator-imposed defaults not raised by the decomposer

- **Icons: inline SVG, not `sl-icon`.** `sl-icon` resolves names only after an explicit
  `Icon.register()`, nothing registers icons in the harness preview, and the Kampus theme ships
  only 34 glyphs — missing search, bell, help, account, star, list, grid, link, pen and key, i.e.
  most of what this screen needs. An unregistered `sl-icon` renders empty and silently. Inline SVG
  is deterministic and renderable. Recorded as a pipeline gap of the same family as the missing
  asset-export step.
- **Typography mapping** (resolved once, from `packages/themes/kampus/typography.css`): the Kampus
  scale resolves through a userGroup x breakpoint indirection, so the public
  `--sl-{heading,title,text,label}-{sm,md,lg}-{fontSize,lineHeight,letterSpacing}` tokens are the
  correct handle; there is no flat px mapping. `h1 (desktop)` → `--sl-heading-lg-*`;
  `h2` → `--sl-heading-md-*`; `h3` → `--sl-heading-sm-*`; `h4` → `--sl-title-sm-*`;
  `Body/Small` → `--sl-text-sm-*`; `UI/Button`, `UI/Small-semibold` → `--sl-label-md-*`;
  `UI/Extra-small-regular` → `--sl-text-sm-*`; `UI/Extra-small-semibold`, `UI/Extra-Tiny`,
  `UI/Extra-tiny-semibold`, `UI/Tiny-bold` → `--sl-label-sm-*`. Weights come from
  `--sl-typography-{family}-{size}-fontWeight`.
