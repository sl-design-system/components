# Design Manifest — Deleted course - content

## Overview

Figma file **Bookmarks** (itslearning), top-level node **"Deleted course - content"** (`4549:8339`), a **1280 × 1082 px** desktop frame. It is a course-files browse page: a global itslearning app bar and product sub-nav, a page header with breadcrumb and page title, then a single white content card holding an informational banner, a full-width search field, an "Actions" dropdown button, an 8-row selectable data table (Select / Title / Type / Last updated / Actions columns), a bulk-actions panel that appears while rows are selected, and a pager. The rendered node is 1296 × 1086 px on canvas (the frame has a surrounding drop shadow); the visible artboard is 1280 × 1082.

**Important provenance note for the decomposer:** this frame is built from the **itslearning** Figma library, **not** the SL Design System Figma library. `get_code_connect_map` returned `{}` at subtree scope _and_ on every individually-queried top-level instance, and `get_design_context` emits zero `<sl-*>` tags — it binds only itslearning-namespaced variables (`--$gray--*`, `--$brand--*`, `--size/*`, `--border-radius`, `--default-font`). Code Connect for the `SL Design System` label does work in this workspace (sibling runs resolved real snippets), so this is an _absent-library_ condition, not orphaned SLDS components. Everything below under "Existing SLDS Components Used" is therefore an **analyst identification by visual/structural equivalence**, explicitly not a Code Connect mapping.

## Existing SLDS Components Used

`get_code_connect_map` produced **no rows** — see the provenance note above and `figma-code-connect-map.json`.

The table below is the analyst's identification of which itslearning-library instances correspond to existing SLDS components. Every row is marked `(identified — no CC)` because no snippet exists to quote.

| Node ID                                             | Node Name             | Mapped Component (identified)                                | CC Snippet (excerpt)                                              |
| --------------------------------------------------- | --------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------- |
| `4549:8349`                                         | Banner                | `<sl-inline-message variant="info">`                         | `(identified — no CC)` info banner, icon + text + dismiss         |
| `4549:8358`                                         | Search                | `<sl-search-field>` / `<sl-text-field>` + icon               | `(identified — no CC)` 1120 × 40, leading magnifying-glass        |
| `4573:8406`                                         | Button ("Actions")    | `<sl-button variant="secondary">` + `<sl-menu-button>`       | `(identified — no CC)` label + caret-down, opens menu             |
| `4549:8360`                                         | tab;le                | `<sl-grid>` / `<sl-table>`                                   | `(identified — no CC)` header row + 8 data rows                   |
| `4549:8363`                                         | Cell (header, Select) | `<sl-grid-column>` with select-all checkbox                  | `(identified — no CC)`                                            |
| `4571:16848`, `4549:8364`, `4549:8365`, `4549:8366` | Cell (header)         | `<sl-grid-sort-column>` / `<sl-grid-column>`                 | `(identified — no CC)` Title & Last updated carry sort icons      |
| `4549:8370` … `4549:8419` (8 rows × 5 cells)        | Cell (data)           | `<sl-grid-column>` cell content                              | `(identified — no CC)` see `Cell` fn in design context            |
| `4978:10964` (inside each row Cell)                 | Checkbox              | `<sl-checkbox>`                                              | `(identified — no CC)` 22 × 22, 2px border, 4px radius            |
| `4571:16720`                                        | Bulk actions panel    | composition of `<sl-button variant="link">` + `<sl-divider>` | `(identified — no CC)` no single SLDS equivalent                  |
| `4549:8425`                                         | Pagination            | `<sl-paginator>` + `<sl-page-size>`                          | `(identified — no CC)` pager + "1 to 10 of 47" + page-size select |
| `4680:14022` (in Pagination)                        | Select                | `<sl-select>`                                                | `(identified — no CC)` 80 px wide, value `10`                     |
| `4549:8343`                                         | PageHeader            | `<sl-breadcrumbs>` + heading                                 | `(identified — no CC)` breadcrumb "Course files ›" + H1           |
| `4549:8340`                                         | Navigation            | — no SLDS equivalent                                         | `(identified — no CC)` itslearning app chrome, see below          |

Hidden / off-state instances present in the tree but not rendered (`hidden="true"`), listed so the decomposer does not chase them: `4549:8345` Card, `4549:8348` 🛠️ BannerArea, `4549:8350` top panel (containing `4549:8352` Standalone link, `4549:8353`/`4549:8354` Button, `4549:8356` search, `4549:8357` Select), `4549:8359` Button, `4549:8424` Bulk actions panel (the unselected variant), `4549:8427` cards / `4549:8428` descriptioncard (with `4549:8429`–`4549:8431` Read-only field), and the first and last `Cell` in every table row (`…8362`, `…8367`, `…8369`, `…8374`, etc. — unused 38 × 42 and 90 × 40 slots).

**Placeable-component count.** The metadata tree exposes ~885 nodes and 58 component types, but almost all of those are _internals_ of a handful of placed components. A developer building this page places roughly **12 distinct components**: app navigation, page header/breadcrumb, content card, inline message, search field, menu button, data grid (with checkbox, sort-column and link/icon cell renderers), bulk-actions bar, paginator, page-size select, and the file-type icon set.

## Composition Candidates

- **Table toolbar** — `4549:8358` (Search) + `4573:8406` (Actions button). Sits directly above the grid as one control strip; the hidden `4549:8350` "top panel" is an alternate layout of the same strip, which confirms the designer treats it as a unit.
- **Bulk actions bar** — `4571:16720` (plus its hidden unselected twin `4549:8424`). Composes a selection count, a wrapping row of icon+label action buttons, a vertical `Divider`, and a "Clear selection" button; it appears/disappears as one unit driven by grid selection state, and repeats on every list page in this product.
- **Pagination footer** — `4549:8425`, internally `Pager` (prev / 5 page links / next) + `Control` ("1 to 10 of 47" + 80 px page-size `Select`). Two logically separate widgets that always ship together at the bottom of the card.
- **File row** — each `content` frame `4549:8368`, `…8375`, `…8382`, `…8389`, `…8396`, `…8403`, `…8410`, `…8417`. Identical 5-cell shape (checkbox, file-type icon + link title, type text, last-updated text, overflow "…" button) repeated eight times; the natural row-renderer boundary.
- **Table header row** — `4549:8361`. Select-all cell plus four header cells, two of which (`Title`, `Last updated`) carry the `arrow-up-arrow-down` sort affordance.
- **Page header** — `4549:8343`. Breadcrumb trail + page title `Social Studies 9A` as one 1184 × 117 block above the card.
- **Content card shell** — `4549:8347` "Content-block". White surface, 32 px horizontal / 20 px vertical padding (bound to `Content block/content-block-horisontal-padding` and `…-vertical-padding`), wrapping all page body content.

## Net-New Primitive Candidates

- **`4549:8340` — Navigation.** The itslearning global app bar (logo, 5 nav items, global search with attached button, bell, comment/IM, avatar) plus the product sub-nav row (`Files` + tabs with an active underline). This is product chrome, not a design-system primitive; it has no SLDS counterpart and is not reasonably composable from SLDS primitives. Rough shape: application shell / banner landmark. **Recommendation: out of scope for SLDS — implement in the consuming app, or scope to just the tab strip if a tabs primitive is wanted.**
- **File-type icon set** (`assignment`, Excel, Word, image glyphs; `imgAssignment`, plus the per-row icon images). Full-colour multi-tone product icons, not monochrome system icons, so they do not fit the `sl-icon` single-colour model. Rough shape: decorative indicator/asset. **Likely an asset-pipeline item rather than a new component.**
- **`I4571:16720;18318:9034` — vertical `Divider` inside the bulk-actions bar.** Rendered as a rotated 0-height line via `containerType: size`; if SLDS has no vertical-orientation divider this is a one-line primitive gap. Rough shape: separator.

Everything else in the frame maps to, or composes cleanly from, existing SLDS primitives. Keeping this list at three, with two of them arguably out of scope.

## Responsive Breakpoints

_Single breakpoint: 1280px._

Supporting evidence: the frame is 1280 px wide and `get_variable_defs` exposes bound variables `screen-width` = `1280` and `screen-height` = `768`, plus `ca-horisontal-margin` = `48` (the 48 px gutter each side that yields the 1184 px content column). No sibling frames at other widths and no constraint annotations were found in this node's subtree.

## Designer Annotations

_None._ No annotation, comment, or note layers exist in the `4549:8339` subtree. Two observations worth passing on anyway, since they read as authoring artifacts rather than intent:

- `4549:8360` is named **`tab;le`** — a typo for "table". Do not treat the semicolon as meaningful.
- The frame is named "Deleted course - content", but the banner copy is `This folder is created for the course "[name of the course]" you will find here all your work and important files.` and the breadcrumb reads `Course files`. The frame name is not reflected in any visible copy; confirm with the designer which state this frame represents before writing labels.

## Token Reference

All values below are **resolved values as Figma reports them**. Figma's `Size/N` scale and the code's `--sl-size-NNN` scale use the same digits for _different_ pixel values (Figma `Size/500` = 20, code `--sl-size-500` = 40px), so every suggestion is matched **by resolved value**, verified against `packages/themes/itslearning/theme.css`. Figma variable names are quoted verbatim from `get_variable_defs`.

### Color

| Figma variable     | Resolved  | Suggested code custom property                                                                                                                                                                                                                                                  |
| ------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$gray--0`         | `#ffffff` | `--sl-color-palette-grey-000` (semantic: `--sl-color-background-input-plain`)                                                                                                                                                                                                   |
| `$card-background` | `#ffffff` | `--sl-color-elevation-surface-raised-default` (resolves to grey-000)                                                                                                                                                                                                            |
| `$gray--50`        | `#f9f9f9` | `--sl-color-palette-grey-050`                                                                                                                                                                                                                                                   |
| `$gray--100`       | `#f4f4f4` | `--sl-color-palette-grey-100`                                                                                                                                                                                                                                                   |
| `$gray--150`       | `#f2f2f2` | `--sl-color-palette-grey-150` (semantic: `--sl-color-background-disabled`)                                                                                                                                                                                                      |
| `$gray--200`       | `#ececec` | `--sl-color-palette-grey-200`                                                                                                                                                                                                                                                   |
| `$gray--300`       | `#e1e1e1` | `--sl-color-palette-grey-300` (semantic: `--sl-color-border-plain`)                                                                                                                                                                                                             |
| `$outline`         | `#e1e1e1` | `--sl-color-border-plain` (resolves via grey-300)                                                                                                                                                                                                                               |
| `Gray/300`         | `#E1E1E1` | `--sl-color-palette-grey-300` — duplicate of `$gray--300` in a second variable collection                                                                                                                                                                                       |
| `$gray--500`       | `#9b9b9b` | `--sl-color-palette-grey-500`                                                                                                                                                                                                                                                   |
| `$gray--600`       | `#757575` | `--sl-color-palette-grey-600` (semantic: `--sl-color-border-accent-grey-bold`)                                                                                                                                                                                                  |
| `$gray--700`       | `#565656` | `--sl-color-palette-grey-700`                                                                                                                                                                                                                                                   |
| `Gray/700`         | `#565656` | `--sl-color-palette-grey-700` — duplicate of `$gray--700`                                                                                                                                                                                                                       |
| `$gray--900`       | `#333333` | `--sl-color-palette-grey-900` (semantic: `--sl-color-foreground-bold`)                                                                                                                                                                                                          |
| `$text`            | `#333333` | `--sl-color-foreground-bold` (resolves via grey-900)                                                                                                                                                                                                                            |
| `Gray/900`         | `#333333` | `--sl-color-palette-grey-900` — duplicate of `$gray--900`                                                                                                                                                                                                                       |
| `$brand--400`      | `#a997b5` | `--sl-color-palette-purple-400` (semantic: `--sl-color-border-accent-purple-bold`)                                                                                                                                                                                              |
| `$brand--700`      | `#5d4a68` | `--sl-color-palette-purple-700`                                                                                                                                                                                                                                                 |
| `Violet OLD/700`   | `#5d4a68` | `--sl-color-palette-purple-700` — duplicate of `$brand--700`; the "OLD" prefix suggests a deprecated collection, prefer `$brand--700`                                                                                                                                           |
| `$brand--800`      | `#42354a` | `--sl-color-palette-purple-800`                                                                                                                                                                                                                                                 |
| `$blue--100`       | `#ecf8ff` | `--sl-color-palette-blue-050` — exact value match. **Caveat:** the semantic `--sl-color-background-info-subtlest` resolves to `#0055b01a` (blue-600 @ 10%), _not_ `#ecf8ff`, so the semantic token will not reproduce the banner fill exactly.                                  |
| `$blue--600`       | `#0055b0` | `--sl-color-palette-blue-600` (semantic: `--sl-color-background-accent-blue-bold`)                                                                                                                                                                                              |
| `$blue--700`       | `#00458f` | `--sl-color-palette-blue-700` (semantic: `--sl-color-link-idle`) — use for the row title links                                                                                                                                                                                  |
| `$green--600`      | `#0b8356` | **(unbound — needs a token)** No exact match in any theme under `packages/themes/`. Nearest is `--sl-color-palette-green-600` = `#008859` (Δ noticeable). This is the checked-checkbox fill; decide with design whether to adopt `--sl-color-palette-green-600` or add a token. |

### Size / Spacing

Figma's `Size/*` scale is **not** digit-aligned with `--sl-size-*`. Mapped by resolved px:

| Figma variable                                   | Resolved | Suggested code custom property                                                                                                                      |
| ------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Size/10`                                        | `2`      | `--sl-size-025` (2px)                                                                                                                               |
| `Size/25`                                        | `4`      | `--sl-size-050` (4px)                                                                                                                               |
| `Size/50`                                        | `8`      | `--sl-size-100` (8px)                                                                                                                               |
| `Size/size--50`                                  | `8`      | `--sl-size-100` (8px) — duplicate of `Size/50`                                                                                                      |
| `Size/100`                                       | `12`     | `--sl-size-150` (12px)                                                                                                                              |
| `Size/size--100`                                 | `12`     | `--sl-size-150` (12px) — duplicate of `Size/100`                                                                                                    |
| `Size/200`                                       | `14`     | `--sl-size-175` (14px) — used as a **font size**, prefer `--sl-text-new-body-md-fontSize` (14px)                                                    |
| `Size/300`                                       | `16`     | `--sl-size-200` (16px)                                                                                                                              |
| `Size/size--300`                                 | `16`     | `--sl-size-200` (16px) — duplicate of `Size/300`                                                                                                    |
| `Size/400`                                       | `18`     | **no exact match** — nearest `--sl-size-200` (16px) / `--sl-size-250` (20px). Used as the `Title M` font size; needs a design decision.             |
| `Size/500`                                       | `20`     | `--sl-size-250` (20px) — **not** `--sl-size-500`, which is 40px                                                                                     |
| `Size/700`                                       | `24`     | `--sl-size-300` (24px) — also the icon box size, cf. `--sl-size-new-icon-xl`                                                                        |
| `Size/800`                                       | `26`     | **no exact match** — nearest `--sl-size-350` (28px) / `--sl-size-300` (24px). Used as the `Title XL` page-title font size; needs a design decision. |
| `Size/900`                                       | `32`     | `--sl-size-400` (32px)                                                                                                                              |
| `border-radius`                                  | `4`      | `--sl-size-borderRadius-md` (→ `--sl-size-050`, 4px)                                                                                                |
| `Content block/content-block-horisontal-padding` | `32`     | `--sl-size-400` (32px)                                                                                                                              |
| `Content block/content-block-vertical-padding`   | `20`     | `--sl-size-250` (20px)                                                                                                                              |
| `ca-horisontal-margin`                           | `48`     | `--sl-size-600` (48px)                                                                                                                              |
| `screen-width`                                   | `1280`   | layout constant, not a token — see Responsive Breakpoints                                                                                           |
| `screen-height`                                  | `768`    | layout constant, not a token                                                                                                                        |

### Typography

Font family in Figma is `default-font` = **`Lato`**. The itslearning theme resolves `--sl-text-new-typeset-fontFamily-body` and `--sl-text-new-typeset-fontFamily-heading` to **`'Open Sans'`**. This is a real divergence — flag it rather than silently substituting.

| Figma variable                    | Resolved                                                                                                                   | Suggested code custom property                                                                                                                             |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default-font`                    | `Lato`                                                                                                                     | `--sl-text-new-typeset-fontFamily-body` (= `'Open Sans'`) — **family mismatch, confirm with design**                                                       |
| `regular`                         | `Regular`                                                                                                                  | `--sl-text-new-body-*-fontWeight` (400)                                                                                                                    |
| `bold`                            | `Bold`                                                                                                                     | weight 700; no dedicated `--sl-text-new-*-fontWeight` bold token on the heading ramp                                                                       |
| `Body regular`                    | `Font(family: "default-font", style: Regular, size: Size/200, weight: 400, lineHeight: 1.5, letterSpacing: 0)` → 14px/400  | `--sl-text-new-body-md-*` (14px)                                                                                                                           |
| `Base small`                      | `Font(family: "default-font", style: regular, size: Size/200, weight: 400, lineHeight: 1.5, letterSpacing: 0)` → 14px/400  | `--sl-text-new-body-md-*` (14px) — duplicate of `Body regular`                                                                                             |
| `Base`                            | `Font(family: "default-font", style: regular, size: Size/300, weight: 400, lineHeight: 1.5, letterSpacing: 0)` → 16px/400  | `--sl-text-new-body-lg-*` (16px)                                                                                                                           |
| `Body large`                      | `Font(family: "default-font", style: Regular, size: Size/300, weight: 400, lineHeight: 1.5, letterSpacing: 0)` → 16px/400  | `--sl-text-new-body-lg-*` (16px) — duplicate of `Base`                                                                                                     |
| `Base strong`                     | `Font(family: "default-font", style: bold, size: Size/300, weight: 700, lineHeight: 1.5, letterSpacing: 0)` → 16px/700     | `--sl-text-new-heading-md-fontSize` (16px) at weight 700                                                                                                   |
| `Base small strong`               | `Font(family: "default-font", style: bold, size: Size/200, weight: 700, lineHeight: 1.5, letterSpacing: 0)` → 14px/700     | `--sl-text-new-heading-sm-fontSize` (14px) at weight 700                                                                                                   |
| `Display small`                   | `Font(family: "default-font", style: Bold, size: Size/200, weight: 700, lineHeight: 1.5, letterSpacing: 0)` → 14px/700     | `--sl-text-new-heading-sm-fontSize` (14px) — duplicate of `Base small strong`; the name "Display small" is misleading                                      |
| `Links/Base small secondary link` | `Font(family: "default-font", style: regular, size: Size/200, weight: 400, lineHeight: 1.5, letterSpacing: 0)` → 14px/400  | `--sl-text-new-body-md-*` + `--sl-color-link-idle`                                                                                                         |
| `Links/Base primary link`         | `Font(family: "default-font", style: bold, size: Size/300, weight: 700, lineHeight: 1.5, letterSpacing: 0)` → 16px/700     | `--sl-text-new-heading-md-fontSize` (16px) @700 + `--sl-color-link-idle`                                                                                   |
| `Title M`                         | `Font(family: "default-font", style: bold, size: Size/400, weight: 700, lineHeight: 1.5, letterSpacing: 0)` → **18px**/700 | **no exact match** — `--sl-text-new-heading-md-fontSize` is 16px, `--sl-text-new-heading-lg-fontSize` is 24px                                              |
| `Title XL`                        | `Font(family: "default-font", style: bold, size: Size/800, weight: 700, lineHeight: 1.5, letterSpacing: 0)` → **26px**/700 | **no exact match** — `--sl-text-new-heading-lg-fontSize` is 24px, `--sl-text-new-heading-xl-fontSize` is 32px. This is the page title "Social Studies 9A". |

All line heights in this design are `1.5` and all letter spacing is `0`, consistent with `--sl-text-new-body-*-lineHeight`.

### Other

| Figma variable                      | Resolved                                                                            | Suggested code custom property                                                                                                                                                                         |
| ----------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `layer-shadow`                      | `Effect(type: DROP_SHADOW, color: #0000000D, offset: (0, 4), radius: 8, spread: 0)` | Closest existing is `--sl-elevation-shadow-overlay`; its recipe (two layered shadows via `--sl-color-shadow-overlay1/2`) does not match `0 4px 8px #0000000D` exactly. Verify visually or add a token. |
| `text/navigation/Base_Course files` | `Course files`                                                                      | Content string, not a token — route through i18n, do not hardcode.                                                                                                                                     |

### Unbound values worth a second look

Per the pipeline's standing caution, every raw value observed in `get_design_context` was checked against `packages/themes/*/` before being flagged. Only **one** genuinely has no exact token: `$green--600` = `#0b8356` (see Color table). Two spacing values (`18`, `26`) and the `layer-shadow` recipe have near-misses rather than exact matches and are flagged as design decisions above, not as missing tokens.

---

# Decomposition (Stage 2)

Framework **Lit** · i18n **OFF** · theme **itslearning** · output base
`examples/lit/src/_runs/b-itsl-bookmk-deleted-course/`

**Five components: 1 root + 4 children.** Everything else — page header, breadcrumb, content card,
banner, search field, Actions button, every table row — is markup or an existing `sl-*` element
placed by its parent.

## API verification performed (real sources read, not assumed)

| Element                                   | What was confirmed / corrected                                                                                                                                                                                                                           |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sl-inline-message`                       | `variant`, `size`, `indismissible`; slots `default`/`icon`/`title`; emits `sl-dismiss` and removes itself. Default `info` icon is `<sl-icon name="info">` — registered in itslearning.                                                                   |
| `sl-search-field`                         | extends `TextField`; `placeholder`, `size`, `shape`; renders an `<sl-icon name="search">` prefix; emits `sl-search` (debounced 300 ms) + `sl-clear`.                                                                                                     |
| `sl-menu-button`                          | `fill` (default `outline`), `variant` (default `secondary`), `size`, `position`; slot `button` for the label; auto-appends `<sl-icon name="angle-down">` unless the button slot is icon-only.                                                            |
| `sl-checkbox`                             | `checked`, `indeterminate`, `size`, `value`; emits `sl-change`; sets `role="presentation"` on the host and synthesizes a light-DOM `<input>`.                                                                                                            |
| `sl-button`                               | `fill: solid\|outline\|link\|ghost`, `variant`, `size`, `shape`; `::part(button)`.                                                                                                                                                                       |
| `sl-breadcrumbs`                          | **REJECTED** (Q3) — manual slot assignment over light-DOM children, injects a Home link unless `no-home`, and renders separators only _between_ items, so a single crumb gets no trailing chevron. The design needs `Course files ›`.                    |
| `sl-paginator` / `-status` / `-page-size` | **REJECTED** (Q4) — status renders `"1 - 10 of 47 items"` (design: `"1 to 10 of 47"`); page-size renders a visible `"Items per page:"` label the design does not have; the active pill is `fill=outline variant=primary`, not solid purple.              |
| `sl-grid`                                 | **REJECTED** (Q5) — virtualized, requires a `ListDataSource`, pulls in `sl-scrollbar`/`sl-skeleton`/`sl-tool-bar`/`sl-toggle-group`; its row/cell chrome fights the fixed 60 px select column, the `#f9f9f9` header and the per-row selected background. |
| `sl-avatar`                               | `picture-url`, `display-name`, `image-only`, `size`, `shape`.                                                                                                                                                                                            |
| `Option`                                  | **gotcha**: exported by `@sl-design-system/listbox`, _not_ `@sl-design-system/select`.                                                                                                                                                                   |

## Component tree (leaves first)

```
<sl-its-app-nav>                its-app-nav/its-app-nav.ts            uses sl-icon, sl-avatar
<sl-course-files-table>         course-files-table/…ts                uses sl-checkbox, sl-button, sl-icon
<sl-course-files-bulk-actions>  course-files-bulk-actions/…ts         uses sl-button, sl-icon
<sl-course-files-pager>         course-files-pager/…ts                uses sl-button, sl-icon, sl-select, sl-option
<sl-course-files-page>          course-files-page.ts   <- ROOT, data owner, the only customElements.define
```

Children export their class only; the root wires them through `static get scopedElements()`.
The story does a plain `import './course-files-page.js';`.

## Shared Types / Contracts

```ts
// exported by its-app-nav.ts
export interface AppNavItem {
  id: string;
  label: string;
  href?: string;
}
export interface AppNavModel {
  primaryItems: AppNavItem[];
  productLabel: string;
  secondaryItems: AppNavItem[];
  activeSecondaryId: string;
  userName: string;
}
export type SlItsAppNavNavigateEvent = CustomEvent<{ itemId: string }>;
export type SlItsAppNavSearchEvent = CustomEvent<string>;

// exported by course-files-table.ts
export type CourseFileKind = 'assignment' | 'excel' | 'word' | 'image';
export interface CourseFile {
  id: string;
  title: string;
  kind: CourseFileKind;
  lastUpdated: string;
  href: string;
}
export interface CourseFilesTableModel {
  files: CourseFile[];
}
export type CourseFilesSortColumn = 'title' | 'lastUpdated';
export type CourseFilesSortDirection = 'asc' | 'desc';
export interface CourseFilesSort {
  column: CourseFilesSortColumn;
  direction: CourseFilesSortDirection;
}
export type SlCourseFilesSelectionChangeEvent = CustomEvent<string[]>;
export type SlCourseFilesSortChangeEvent = CustomEvent<CourseFilesSort>;
export type SlCourseFilesRowActionEvent = CustomEvent<{ fileId: string }>;

// exported by course-files-bulk-actions.ts
export type CourseFilesBulkActionId = 'download';
export interface CourseFilesBulkActionsModel {
  selectedCount: number;
  selectableTotal: number;
}
export type SlCourseFilesBulkActionEvent = CustomEvent<{ actionId: CourseFilesBulkActionId }>;
export type SlCourseFilesClearSelectionEvent = CustomEvent<void>;

// exported by course-files-pager.ts
export interface CourseFilesPagerModel {
  page: number;
  pageSize: number;
  totalItems: number;
}
export type SlCourseFilesPageChangeEvent = CustomEvent<number>;
export type SlCourseFilesPageSizeChangeEvent = CustomEvent<number>;

// exported by course-files-page.ts (root aggregate)
export interface CourseFilesPageData {
  navigation: AppNavModel;
  breadcrumbs: Array<{ id: string; label: string; href: string }>;
  heading: string;
  bannerText: string;
  files: CourseFile[];
  totalItems: number;
  selectableTotal: number;
}
```

**Event-name uniqueness verified** against live SLDS declarations: `sl-page-change` (Paginator),
`sl-page-size-change` (PaginatorPageSize), `sl-search` (SearchField), `sl-dismiss` (InlineMessage),
`sl-grid-selection-change` (Grid), `sl-change`/`sl-toggle`/`sl-select` (shared). All nine new names
are namespaced and collide with none of them.

## Exact row data (order matters)

| #   | id  | title                | kind       | Type label                                 | lastUpdated    | selected |
| --- | --- | -------------------- | ---------- | ------------------------------------------ | -------------- | -------- |
| 1   | f1  | `[assignment title]` | assignment | `Assignment`                               | `Last updated` | yes      |
| 2   | f2  | `[assignment title]` | assignment | `Assignment`                               | `Last updated` | yes      |
| 3   | f3  | `[assignment title]` | assignment | `Assignment`                               | `Last updated` |          |
| 4   | f4  | `resource title`     | excel      | `Excel ` (trailing space is in the source) | `Last updated` |          |
| 5   | f5  | `[assignment title]` | assignment | `Assignment`                               | `Last updated` |          |
| 6   | f6  | `resource title`     | word       | `Word`                                     | `Last updated` | yes      |
| 7   | f7  | `resource title`     | image      | `Image`                                    | `Last updated` |          |
| 8   | f8  | `[assignment title]` | assignment | `Assignment`                               | `Last updated` |          |

## Open questions — all 20, with the default chosen

| #   | Question                                                                                                                                          | Default chosen                                                                                                                                                                                                                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Nav labels: design context says `Courses/Updates/Groups/Calendar/Library` + `Your files/Course files`; the screenshot renders `Item x5` / `Item`. | Use the design-context labels (the brief names design context as ground truth for text). Nav strip will diff on label width by design.                                                                                                                                |
| 2   | Two conflicting totals: bulk bar `out of 40` vs pager `1 to 10 of 47`; `2 selected` while 3 rows are checked; `1 to 10` while 8 rows render.      | Reproduce all four literals exactly as designed. Do not fix the arithmetic. Recorded as a design-source inconsistency.                                                                                                                                                |
| 3   | `sl-breadcrumbs` or hand-rolled `<nav><ol>`?                                                                                                      | Hand-rolled — `sl-breadcrumbs` cannot render a trailing chevron after a single crumb.                                                                                                                                                                                 |
| 4   | SLDS paginator trio or custom pager?                                                                                                              | Custom `<sl-course-files-pager>` — the SLDS status string and the visible "Items per page:" label do not match the design.                                                                                                                                            |
| 5   | `sl-grid` or a semantic `<table>`?                                                                                                                | Hand-rolled `<table>` composing `sl-checkbox`/`sl-button`/`sl-icon`.                                                                                                                                                                                                  |
| 6   | `CourseFile.lastUpdated` type — the design shows the literal placeholder `Last updated`, not a date.                                              | Type `string`, put the literal in the mock. A real implementation would use `Date` + `format-date`; noted as a follow-up.                                                                                                                                             |
| 7   | Actions caret: `sl-menu-button` auto-appends `angle-down`; the design draws a filled caret.                                                       | Accept `angle-down`; one glyph-shape diff.                                                                                                                                                                                                                            |
| 8   | Actions menu contents — the menu is closed in the design.                                                                                         | Three plausible items (`Move`, `Copy`, `Delete`) with a TODO. Never visible, so no pixel impact.                                                                                                                                                                      |
| 9   | Unavailable image assets: itslearning logo, `your-files` glyph, avatar photo, four full-colour file-type glyphs.                                  | Render container geometry with no glyph (32 px boxes, `<sl-avatar image-only>`, 24 px disc). Preserves layout, avoids invented artwork. Disc bg `#d9e3e8` has no token in any theme -> `--sl-color-palette-grey-200`, delta reported.                                 |
| 10  | `bell` and `comment` are not among the 54 registered itslearning icons.                                                                           | Omit both glyphs, keep their 48x48 hit boxes so nav spacing holds. Report.                                                                                                                                                                                            |
| 11  | The bulk bar's `Download` icon is not registered either.                                                                                          | Omit the icon, keep the label and padding. A wrong-direction arrow would be worse than a gap.                                                                                                                                                                         |
| 12  | Shadows have no exact token (nav `0 4px 4px /.05`, sub-nav inset, frame `layer-shadow`).                                                          | `--sl-elevation-shadow-sm` on the nav; omit the sub-nav inset (no inset token); ignore the frame shadow (Figma canvas chrome, outside the artboard).                                                                                                                  |
| 13  | `$green--600` `#0b8356` (checked-checkbox fill) is genuinely unbound.                                                                             | Let `sl-checkbox` use its own themed checked fill. Do not override with a near-miss or a hex. Report the delta.                                                                                                                                                       |
| 14  | Which token for bold 700?                                                                                                                         | **Resolved by the orchestrator, not left to the implementer:** `--sl-text-new-typeset-fontWeight-semiBold` is **600**, and `--sl-text-new-typeset-fontWeight-bold` does not exist. `--sl-fontWeight-700` exists and is exactly `700`. Use `var(--sl-fontWeight-700)`. |
| 15  | `--sl-text-new-body-md-lineHeight` is 20 px; the design wants 14 x 1.5 = 21 px.                                                                   | Use the token, never hardcode 21 px. One aggregate discrepancy. The 16 px ramp is exact (body-lg 16/24).                                                                                                                                                              |
| 16  | Page background `#f2f2f2` maps semantically to `--sl-color-background-disabled`, a wrong _role_ for a page canvas.                                | Use `--sl-color-palette-grey-150` (literal-value match); reserve `-disabled` for disabled states. Role gap noted.                                                                                                                                                     |
| 17  | Root name: the frame is "Deleted course - content" but no visible copy says "deleted".                                                            | `<sl-course-files-page>` — matches the visible content. The run folder carries the traceability.                                                                                                                                                                      |
| 18  | Is the `slot="actions"` on the bulk bar justified?                                                                                                | Keep it. The design's `max-inline-size: 712px` wrapping actions row is sized for more than one button — a real consumer-injection boundary.                                                                                                                           |
| 19  | App-nav landmark roles.                                                                                                                           | Neutral `<div class="chrome">` (no `role="banner"`), two inner `<nav>`s with distinct `aria-label`s. `<nav>` is not a singleton landmark.                                                                                                                             |
| 20  | Should `sl-its-app-nav` exist at all, or be inline markup in the root?                                                                            | Keep it separate — it isolates every unavailable-asset compromise (Q9, Q10) in one file the Stage 4 report can point at.                                                                                                                                              |
