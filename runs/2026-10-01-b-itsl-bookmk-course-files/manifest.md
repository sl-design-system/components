# Design Manifest

## Overview

Figma file **Bookmarks** (team itslearning), top-level node **"course files"** (`4886:12955`), viewport **1280 × 768 px**. The design is an itslearning "Files" app screen showing a course-files list page: a top app navigation bar, a secondary tab bar ("Your files" / "Save course materials", the latter active), a page title ("Save course materials"), a dismissible info banner, and a 4-column sortable course table (Course / Status / Teacher / Last updated) with 4 visible rows plus one hidden row.

**Code Connect status (read this before the tables below):** `get_code_connect_map` returned an empty object `{}` for the top node and for every descendant node tested (Navigation, PageHeader, Banner, table, header row) — i.e. **zero resolved mappings anywhere in this subtree**, not a mix of resolved/`hasTemplate:false`/null. This is expected: the Figma library behind this design is itslearning's own **"itslearning Web UI kit"** pattern library (styleguide.itsbuild.net), which is Code-Connect-mapped to itslearning's own frontend (Prometheus), not to this `sl-design-system/components` repo. `get_design_context` did however return rich **component documentation** (usage notes, keywords, styleguide links) attached to the Figma main components, which let me identify most instances with high confidence even without a CC snippet. Every "Existing SLDS Components Used" row below is therefore an **identified match, not a CC-confirmed one** — flagged accordingly.

**Distinct placeable components vs. raw instance count:** the survey counted ~478 descendant nodes / 43 component "types" in the full tree, but a developer would place roughly **10 distinct component types**: Navigation (app shell), PageHeader, Secondary-menu/tabs, `sl-inline-message` (Banner), `sl-search-field` (Search, hidden), `sl-grid` (table), `sl-tag` (Status), `sl-button` (icon buttons ×4 usages), `sl-avatar` (user avatar + Course-hat icon-avatar), `sl-icon` (9 distinct icon names). The remaining hundreds of nodes are repeated row/cell instances (6 table rows × 4 cells) and internal sub-parts of those components (label wrappers, icon wrappers, text nodes) — not separate things to build.

## Existing SLDS Components Used

_No entries are Code-Connect-confirmed (map returned `{}` everywhere in this subtree). All rows are identified from the node's Figma component documentation/keywords, its visual shape, and matching package names in this repo's `packages/components/*`. Treat as a strong lead for the component-decomposer agent, not a guarantee._

| Node ID                                                                                                           | Node Name                                 | Mapped Component                             | CC Snippet (excerpt)                                                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `4886:12963`                                                                                                      | Banner                                    | `sl-inline-message` (variant="info")         | `<sl-inline-message variant="info">…</sl-inline-message>` (identified — itslearning doc: "Banners… dismissible unless critical", matches `sl-inline-message`'s `sl-dismiss` event + icon slot) |
| `I4886:12963;17344:7058`                                                                                          | Button (banner dismiss, icon=xmark)       | `sl-button`                                  | `<sl-button variant="tertiary"><sl-icon name="xmark"></sl-icon></sl-button>` (identified)                                                                                                      |
| `I4886:12960;5823:6544`                                                                                           | Button (PageHeader actions slot, hidden)  | `sl-button`                                  | `<sl-button>…</sl-button>` (identified, not visible in this state)                                                                                                                             |
| `I4886:12966;4008:8766;18129:7840`                                                                                | Button (Teacher column sort trigger)      | `sl-button`                                  | `<sl-button variant="tertiary"><sl-icon name="sort"></sl-icon></sl-button>` (identified)                                                                                                       |
| `I4886:12966;4008:8767;18129:7840`                                                                                | Button (Last updated column sort trigger) | `sl-button`                                  | same as above (identified)                                                                                                                                                                     |
| `I4886:12956;4461:5603;9976:10636`                                                                                | User menu (Avatar)                        | `sl-avatar`                                  | `<sl-avatar></sl-avatar>` (identified — itslearning doc "Avatar… User, person, userpic")                                                                                                       |
| `I4886:12968;4008:8789;19393:6514` (×4 rows)                                                                      | Course-hat                                | `sl-avatar` (icon variant)                   | `<sl-avatar><sl-icon name="graduation-cap" slot="icon"></sl-icon></sl-avatar>` (identified — itslearning doc literally tags "Course-hat" with **Keywords: Avatar**)                            |
| `I4886:12968;4008:8790;15381:6900` (×4 rows)                                                                      | Status (Archived / Deleted)               | `sl-tag`                                     | `<sl-tag><sl-icon name="circle-pen"></sl-icon> Archived</sl-tag>` (identified — itslearning doc: "shows a state… cannot be interactive" matches `sl-tag`'s non-interactive label)              |
| `4886:12965` + 6× `courses` rows (`4886:12966` header, `4886:12968`/`12969`/`12971`/`12972`(hidden)/`12973` body) | table / courses                           | `sl-grid` (+ `sl-column` / `sl-sort-column`) | `<sl-grid>…</sl-grid>` (identified — itslearning "Cell" doc describes exactly this: detachable row template, sortable columns, icon+label cells, action-button cells)                          |
| `I4886:12956;4461:5603;11704:5609`                                                                                | Search (nav search box)                   | `sl-search-field`                            | `<sl-search-field></sl-search-field>` (identified — itslearning doc: "represents 2 components in Prometheus: SearchInput and GlobalSearch")                                                    |
| `4886:12964`                                                                                                      | Search (content-area search, hidden)      | `sl-search-field`                            | same as above (identified, not visible in this state)                                                                                                                                          |
| `I4886:12956;4461:5603;11704:5609;13157:8022;1902:2742`                                                           | Icon placeholder (magnifying-glass)       | `sl-icon` name="search"                      | `<sl-icon name="search"></sl-icon>` (identified)                                                                                                                                               |
| `I4886:12956;4461:5603;9976:10631;9976:10604`                                                                     | circle-dot (bell)                         | `sl-icon`                                    | `<sl-icon name="bell"></sl-icon>` (identified — **icon not registered in itslearning theme, see Icon Gaps**)                                                                                   |
| `I4886:12956;4461:5603;9976:10635;9976:10604`                                                                     | circle-dot (comment)                      | `sl-icon`                                    | `<sl-icon name="comment"></sl-icon>` (identified — **not registered, see Icon Gaps**)                                                                                                          |
| `I4886:12963;23112:4891`                                                                                          | circle-info                               | `sl-icon` name="info"                        | `<sl-icon name="info"></sl-icon>` (identified — theme registers this visual as `info`, not `circle-info`)                                                                                      |
| `I4886:12963;3841:6883;1902:2850`                                                                                 | Icon placeholder (xmark)                  | `sl-icon` name="xmark"                       | `<sl-icon name="xmark"></sl-icon>` (identified, exact name match)                                                                                                                              |
| `I4886:12966;4008:8766;18129:7840;1902:2838` (×2 cols)                                                            | Icon placeholder (arrow-up-arrow-down)    | `sl-icon` name="sort"                        | `<sl-icon name="sort"></sl-icon>` (identified — theme has `sort`/`sort-up`/`sort-down`, not `arrow-up-arrow-down`)                                                                             |
| `I4886:12968;4008:8789;19393:6514;663:3904` (×4)                                                                  | graduation-cap                            | `sl-icon`                                    | `<sl-icon name="graduation-cap"></sl-icon>` (identified — **not registered, see Icon Gaps**)                                                                                                   |
| `I4886:12968;4008:8790;15381:6900;15355:7084` (×4)                                                                | circle-pen                                | `sl-icon`                                    | `<sl-icon name="circle-pen"></sl-icon>` (identified — **not registered, see Icon Gaps**)                                                                                                       |

## Composition Candidates

- **Top app navigation bar** — nodes `4886:12956`, `I4886:12956;4461:5603` (.Main menu: logo, 5 nav links, search box, bell icon, comment icon, avatar). Rationale: documented in itslearning's own styleguide as the "MainMenu" pattern (node `4016:6647`); combines `sl-icon` × several, `sl-search-field`, and `sl-avatar` into one persistent, non-decomposable app-shell unit — not a single existing SLDS primitive.
- **Secondary menu / file-section tabs** — node `I4886:12956;4461:5604` (.Secondary menu: "Files" icon+label, ".Navigation item" × 2 with an active-state underline "Highlight" bar under "Save course materials"). Rationale: visually behaves like a tab bar (active indicator), but uses itslearning's own `.Navigation item` rather than `sl-tabs`; worth evaluating against `sl-tabs` as a possible existing-component substitute during decomposition.
- **PageHeader** — node `4886:12960` and its hidden back-link/breadcrumb/subtitle/actions-slot children. Rationale: itslearning's own documented composite ("represents 2 components in Prometheus: PageHeader and PageHeaderEditable", node `4680:12984`); combines a title, optional subtitle/breadcrumb, and an actions slot (which can hold `sl-button`/`sl-tag`) into one repeating page-header pattern.
- **Course table row** — node `4886:12965` (table) with its 6 `courses` row instances and `Cell` children (icon-avatar + link-styled course name, `sl-tag` status, plain-text teacher/date cells, icon-only sort buttons in the header). Rationale: itslearning's "Cell" documentation explicitly describes this as a detachable row template built for exactly this kind of table; strongly suggests implementing on top of `sl-grid` with custom column/cell templates rather than a bespoke table.

## Net-New Primitive Candidates

_None._ Every visual element in this design either matches an existing `packages/components/*` package (icon, avatar, button, tag, search-field, inline-message, grid) or is one of itslearning's own documented composite patterns (Navigation, PageHeader, secondary-menu tabs) that itself decomposes into those same existing primitives — see Composition Candidates above. Nothing requires a wholly new atom-level component.

## Responsive Breakpoints

_Single breakpoint: 1280px._ Only one frame/state exists in this node (`4886:12955`, 1280 × 768). No alternate-width frames, constraint annotations, or layout-grid breakpoint markers were found in the metadata.

## Designer Annotations

_None._ No annotation/comment layers were present in the metadata or design-context output for this node.

## Token Reference

Built primarily from `get_variable_defs`; itslearning `theme.css` / `typography.css` were grepped to confirm real token names and verbatim hex/px values before citing them (hints applied: raw hex/px only flagged `unbound` after a literal grep found no match; typography cited only as the longhand tokens that actually exist).

**Color**

- `--sl-color-palette-blue-050` (`#ecf8ff`) — Banner background; Figma var `$blue--100`. Confirmed exact value match in `theme.css:4241`.
- `--sl-color-palette-blue-700` (`#00458f`) — course-name link text; Figma var `$blue--700`. Confirmed at `theme.css:4249`.
- `--sl-color-palette-grey-900` (`#333333`) — primary body text; Figma vars `$gray--900` / `Gray/900` / `$text`. Confirmed at `theme.css:4274`.
- `--sl-color-palette-grey-700` (`#565656`) — tab active-underline bar, secondary text; Figma vars `$gray--700` / `Gray/700`. Confirmed at `theme.css:4272`.
- `--sl-color-palette-grey-600` (`#757575`) — nav search-box border/placeholder text; Figma var `$gray--600`. Confirmed at `theme.css:4271`.
- `--sl-color-palette-grey-300` (`#e1e1e1`) — borders (nav, card, table rows); Figma vars `$gray--300` / `Gray/300`. Confirmed at `theme.css:4268`.
- `--sl-color-palette-grey-100` (`#f4f4f4`) — Status tag background; Figma var `$gray--100`. Confirmed at `theme.css:4265`.
- `--sl-color-palette-grey-400` (`#cfcfcf`) — Status tag border; Figma var `$gray--400`. Confirmed at `theme.css:4269`.
- `--sl-color-palette-grey-050` (`#f9f9f9`) — table header row / secondary-menu background; Figma var `$gray--50`. Confirmed at `theme.css:4264`.
- `--sl-color-palette-grey-150` (`#f2f2f2`) — page background; Figma var `$gray--150`. Confirmed at `theme.css:4266`.
- `--sl-color-palette-grey-000` / `--sl-color-white` (`#ffffff`) — card/row/nav background; Figma var `$gray--0`. Confirmed at `theme.css:4263` and `theme.css:3478`.
- `#d9e3e8` (Figma var `$pigeongrey--100`, Course-hat badge background) — **(unbound — needs a token)**. Grepped the entire repo (`theme.css` and all of `packages/`) for `d9e3e8` and `pigeongrey`; zero matches anywhere. This value has no corresponding token in the itslearning theme today.
- Present in `get_variable_defs` but **not observed bound to any rendered property** in this specific frame (listed for completeness, not for use): `$brand--700` (`#5d4a68`), `$brand--800` (`#42354a`), `$blue--600` (`#0055b0`), `$pigeongrey--200` (`#72838d`), `$gray--200` (`#ececec`).

**Size / Spacing**

Figma's own "Size/N" variable _numbers_ do **not** match this repo's `--sl-size-*` numbering — they use a different index scheme for the same px scale. Verbatim Figma variable → px → confirmed itslearning `--sl-size-*` token:

- `Size/10` = 2px → `--sl-size-025`
- `Size/25` = 4px → `--sl-size-050`
- `Size/50` = 8px → `--sl-size-100`
- `Size/100` = 12px → `--sl-size-150`
- `Size/300` (used as spacing, 16px) → `--sl-size-200`
- `Size/500` / `ca-cards-gap` = 20px → `--sl-size-250`
- `Size/700` = 24px → `--sl-size-300`
- `Size/900` = 32px → `--sl-size-400`
- `Content block/content-block-horisontal-padding` = 32px → `--sl-size-400`
- `Content block/content-block-vertical-padding` = 20px → `--sl-size-250`
- `ca-horisontal-margin` = 48px → `--sl-size-600`
- `border-radius` = 4px → matches `--sl-size-borderRadius-md` (`var(--sl-size-050)` = 4px)
- `ca-max-width` = 1280, `screen-width` = 1280, `screen-height` = 768 — layout/viewport constants, not design tokens; no token binding expected.

**Typography**

The itslearning theme has **no bare `--sl-text-new-*` (or `--sl-text-*`) shorthand custom property** — confirmed by grepping `typography.css`, which only composes typography from longhand `-fontFamily` / `-fontSize` / `-lineHeight` / `-fontWeight` variants per role (`text`, `title`, `label`, `heading`, `display`, `caption`), each with `sm`/`md`/`lg` steps. Citing the longhand tokens that actually exist (grepped, confirmed present):

- Figma style **"Title XL"** (bold, 26px, `Size/800`, "Save course materials" page title) → role `title`, large step: `--sl-title-lg-fontSize` / `--sl-typography-title-lg-fontWeight` (confirmed = `600`, not the Figma-declared 700 — **discrepancy to flag for the implementer**) / `--sl-title-fontFamily` (confirmed = `Lato`).
- Figma style **"Title M"** (bold, 18px, `Size/400`, "Files" secondary-nav label) → role `title`, md step: `--sl-title-md-fontSize` / `--sl-typography-title-md-fontWeight` (confirmed = `600`) / `--sl-title-fontFamily`.
- Figma style **"Base" / "Body large"** (regular, 16px, `Size/300`, nav items, table teacher/date cells) → role `text`, md step: `--sl-text-md-fontSize` / `--sl-typography-text-md-fontWeight` (confirmed = `400`) / `--sl-text-md-lineHeight` / `--sl-text-fontFamily` (confirmed = `Lato`).
- Figma style **"Base small"** (regular, 14px, `Size/200`, banner body text, status label) → role `text`, sm step: `--sl-text-sm-fontSize` / `--sl-typography-text-sm-fontWeight` (confirmed = `400`) / `--sl-text-sm-lineHeight`.
- Figma style **"Base small strong"** (bold, 14px, `Size/200`, table column headers) → same `text`-sm tokens but no themed bold override was found for this exact size/weight combination confirmed by grep; the only confirmed bold-weight longhand tokens are at the `title`/`label` roles (600), not `text`-sm — **flag for implementer: verify whether table-header bold-14px should use `--sl-typography-label-sm-fontWeight` or a one-off `font-weight: 700` override.**
- Figma style **"Links/Base primary link"** (bold, 16px, `Size/300`, "Math 2c" course-name link) → no dedicated `--sl-link-*` typography namespace was found in `typography.css`; closest confirmed tokens are `text`-md (`--sl-text-md-fontSize`) with the link's own component-level font-weight override — **flag for implementer: confirm against `packages/components/link` rather than assuming a bare token.**
- All typography font-size tokens are gated behind a `-userGroup` indirection (`--sl-text-md-fontSize-userGroup` → `-early` / `-developing` / `-advanced` chain, an itslearning reading-level accessibility feature) — the _final_ px value is not a single static number in this theme; implementer should use the `-userGroup` token, not hardcode a px value.
- `default-font` = `Lato` → confirmed `--sl-text-fontFamily: Lato` and `--sl-title-fontFamily: Lato` at `theme.css:4436-4437`.

**Other**

- `layer-shadow` = `DROP_SHADOW #0000000D, offset (0,4), radius 8` — nav bar drop shadow; no single matching `--sl-shadow-*` token was grepped/confirmed in the time available — **(unbound — needs a token)**, flag for implementer to check `--sl-color-shadow-*` + elevation tokens.

## Icon Gaps

The itslearning theme's `packages/themes/itslearning/icons.ts` was read in full (all registered keys). Icons the design needs that are **genuinely not registered under any name** (true gaps — no FA import is available, `@fortawesome/*` is not installed):

- **bell** (notification icon, top nav) — not registered.
- **comment** (message icon, top nav) — not registered.
- **graduation-cap** (Course-hat badge icon, every table row) — not registered.
- **circle-pen** (Status tag icon, every table row) — not registered.
- **your-files** (Files app icon, secondary nav) — not registered; this one is delivered in the design as a custom SVG asset, not a semantic FA-style icon, so it likely needs adding as a genuinely new icon in `icons.ts` (or as a dedicated non-icon asset) rather than sourced from an existing FA name.

Icons the design uses under one name where the theme registers the **same visual under a different key** (not gaps — just a naming note for the implementer):

- Figma "circle-info" → registered as `info`.
- Figma "magnifying-glass" → registered as `search`.
- Figma "arrow-up-arrow-down" (table sort icon) → registered as `sort` (with `sort-up` / `sort-down` state variants), not `arrow-up-arrow-down`.
- Figma "xmark" → registered exactly as `xmark` (exact match, no note needed).

## Run Artifacts

- Screenshot: cached PNG at `/Users/marcin.ludwig/Repo/sl-design-system/components/.implement-design/b-itsl-bookmk-course-files/screenshot.png` (verified: PNG image data, 1280×768, 58KB).
- `figma-metadata.json`, `figma-code-connect-map.json`, `figma-design-context.md`, `figma-variable-defs.json` — all persisted in the same run folder with raw tool output.

---

# Decomposition (Stage 2)

Produced by `component-decomposer`. Framework Lit, i18n **off**, output location
`examples/lit/src/_runs/b-itsl-bookmk-course-files/` (an example, not a published package).

## Component tree

```
<sl-itsl-files-page>                         files-page.ts              [root, data owner]
  ├── uses: <sl-inline-message>              (existing — the banner, incl. its own dismiss button)
  └── new children:
      ├── <sl-itsl-files-top-nav>            top-nav/top-nav.ts
      │     └── uses: <sl-search-field>, <sl-avatar>, <sl-icon>
      ├── <sl-itsl-files-section-nav>        section-nav/section-nav.ts
      │     └── uses: — (the "Files" app glyph is not a registered icon)
      └── <sl-itsl-files-course-table>       course-table/course-table.ts
            └── uses: <sl-grid>, <sl-grid-column>, <sl-grid-sort-column>,
                      <sl-avatar>, <sl-tag>, <sl-icon>
```

Files:

```
files-page.ts / files-page.css / files-page.stories.ts
demo-data.ts
top-nav/top-nav.ts / top-nav.css / top-nav.stories.ts
section-nav/section-nav.ts / section-nav.css / section-nav.stories.ts
course-table/course-table.ts / course-table.css / course-table.stories.ts
```

Story titles: `Runs/B Itsl Bookmk Course Files/{Files Page, Top Nav, Section Nav, Course Table}`.
Root story gets `parameters: { layout: 'fullscreen' }`.

### Deliberately NOT components

- **The banner** — `<sl-inline-message variant="info">` used directly by the root. It already
  renders the `info` icon and its own `xmark` dismiss button and fires `sl-dismiss`, so the
  manifest's "Button (banner dismiss)" row needs no code.
- **The white card** — a styled `<div>` in the root; no heading, so `sl-panel` is wrong.
- **The page title** — an `<h1>` in the root. The Figma PageHeader's back-link / breadcrumb /
  subtitle / actions children are all hidden in this state.
- **A table row** — rows are `renderer` callbacks on grid columns, never a row component.
- **Sort-trigger buttons** — `sl-grid-sort-column` renders `sl-grid-sorter` internally.

## Per-component API

### 1. `<sl-itsl-files-page>` — `files-page.ts`, class `FilesPage`

Owns all data. In a real app: `GET /api/me`, `GET /api/tools/files/state`,
`GET /api/courses/files?scope=course-materials`. Here: typed mocks in `demo-data.ts`.

| property      | type                  | default                      | attribute          |
| ------------- | --------------------- | ---------------------------- | ------------------ |
| `topNav`      | `TopNavModel`         | `DEFAULT_TOP_NAV`            | `attribute: false` |
| `sectionNav`  | `SectionNavModel`     | `DEFAULT_SECTION_NAV`        | `attribute: false` |
| `courseTable` | `CourseTableModel`    | `DEFAULT_COURSE_TABLE`       | `attribute: false` |
| `heading`     | `string`              | `'Save course materials'`    | plain attribute    |
| `bannerText`  | `string \| undefined` | the design's banner sentence | `banner-text`      |

Internal `@state() bannerDismissed = false`. No slots, no own events.
A11y: neutral `<div class="page">` wrapper — **no `<main>`, no `role="main"`**;
`<h1 id="page-heading">`; card is `<section aria-labelledby="page-heading">`.

**Trap:** `InlineMessage.#onClick` calls `this.remove()` on itself after emitting `sl-dismiss`.
Removing a Lit-rendered node out from under its own template is unsafe — the root must listen for
`sl-dismiss`, set `bannerDismissed = true`, and template the message out.

### 2. `<sl-itsl-files-top-nav>` — `top-nav/top-nav.ts`, class `TopNav`

Presentational. `model?: TopNavModel` (`attribute: false`) + module-local `DEFAULT_MODEL`.
`NAV_LINKS` (courses / updates / groups / calendar / library, labels + hrefs) is a **constant
inside the component**, not a model field. No slots.
Events: `sl-itsl-files-nav-navigate` (cancelable), `sl-itsl-files-nav-search`,
`sl-itsl-files-profile-toggle`.
Composes `search-field`, `avatar`, `icon`, `shared`.
A11y: `<nav aria-label="Main">` → `<ul>` → `<li><a aria-current="page">`;
`<sl-search-field aria-label="Search">`; profile is a
`<button type="button" aria-haspopup="menu" aria-expanded="false">` wrapping `<sl-avatar>`.

### 3. `<sl-itsl-files-section-nav>` — `section-nav/section-nav.ts`, class `SectionNav`

Presentational. `model?: SectionNavModel` + module-local `DEFAULT_MODEL`.
`SECTION_TABS` is a constant inside the component. No slots.
Event: `sl-itsl-files-tab-select` (cancelable).
A11y: **links, not tabs** — `<nav aria-label="Files">` → `<ul>` → `<li><a aria-current="page">`.
These are separate itslearning routes, not in-page panels, so no `role="tablist"`, no
`sl-tab-group`.

### 4. `<sl-itsl-files-course-table>` — `course-table/course-table.ts`, class `CourseTable`

Presentational. `model?: CourseTableModel` + module-local `DEFAULT_MODEL`. Sort direction is UI
state (`@state() sort?: SortState`), not a model field. The four-column definition (order,
header labels, which two sort, widths) and the `CourseStatus → label` map are **constants inside
the component**. No slots.
Events: `sl-itsl-files-course-select` (cancelable), `sl-itsl-files-sort-change`.
Composes `grid`, `avatar`, `tag`, `icon`, `shared`.

**Non-obvious wiring:** cell content produced by a `GridColumnDataRenderer` renders into the
**grid's** shadow root, not this component's. `sl-avatar` and `sl-tag` must therefore go on the
**column's own public `scopedElements` property** (`column.ts` documents `baseScopedElements` as
existing precisely so the public one does not clobber it). Registering them only on
`CourseTable.scopedElements` renders inert unknown elements.

## Shared Types / Contracts

```ts
// exported by top-nav/top-nav.ts; imported by files-page.ts + demo-data.ts
type TopNavLinkId = 'courses' | 'updates' | 'groups' | 'calendar' | 'library';
interface TopNavUser {
  name: string;
  avatarUrl?: string;
}
interface TopNavModel {
  user: TopNavUser;
  activeLinkId: TopNavLinkId;
  searchTerm?: string;
}
interface NavNavigateDetail {
  id: TopNavLinkId;
  href: string;
}
type SlItslFilesNavNavigateEvent = CustomEvent<NavNavigateDetail>;
type SlItslFilesNavSearchEvent = CustomEvent<string>;
type SlItslFilesProfileToggleEvent = CustomEvent<void>;

// exported by section-nav/section-nav.ts
type FilesTabId = 'your-files' | 'save-course-materials';
interface SectionNavModel {
  appName: string;
  activeTabId: FilesTabId;
}
interface TabSelectDetail {
  id: FilesTabId;
  href: string;
}
type SlItslFilesTabSelectEvent = CustomEvent<TabSelectDetail>;

// exported by course-table/course-table.ts
type CourseStatus = 'archived' | 'deleted'; // stable key; label lives in the component
type SortableColumnId = 'teacher' | 'lastUpdated';
interface SortState {
  columnId: SortableColumnId;
  direction: 'asc' | 'desc';
}
interface CourseFileRow {
  id: string;
  courseName: string; // free text from the data source — rendered directly
  courseHref: string;
  status: CourseStatus;
  teacherNames: string[]; // ['Floyd Miles', …] → "Floyd Miles and 2 more"
  lastUpdatedAt: string; // ISO 8601, '2024-04-05'
}
interface CourseTableModel {
  rows: CourseFileRow[];
}
interface CourseSelectDetail {
  id: string;
  href: string;
}
type SlItslFilesCourseSelectEvent = CustomEvent<CourseSelectDetail>;
type SlItslFilesSortChangeEvent = CustomEvent<SortState>;
```

`demo-data.ts` exports `DEFAULT_TOP_NAV`, `DEFAULT_SECTION_NAV`, `DEFAULT_COURSE_TABLE`,
`DEFAULT_BANNER_TEXT` — four rows: Math 2c / Archived, Deleted, Deleted, Archived; every
`teacherNames` renders as "Floyd Miles and 2 more"; every `lastUpdatedAt: '2024-04-05'`.
The hidden 5th row (`4886:12972`) and the hidden content-area search (`4886:12964`) are **not**
implemented.

## Open questions, and the default chosen for each

| #   | Question                                                                                                         | Default chosen                                                                                                                                          | Reasoning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| --- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `sl-grid` or a bespoke `<table>`?                                                                                | **`sl-grid` + `sl-grid-column` + `sl-grid-sort-column`**                                                                                                | Gives `aria-sort` / `role="columnheader"` / sorting free. Pixel-fidelity confidence **low** — `grid.ts` pulls in `@lit-labs/virtualizer`, `sl-scrollbar`, `sl-tool-bar`, `sl-toggle-group`, `sl-skeleton`, and a virtualized grid in normal flow often collapses or scrolls internally. **Named fallback:** if the grid does not show 4 rows at natural height without an explicit container height, switch to a semantic `<table>` with hand-written `aria-sort` and record the substitution as a Stage 4 discrepancy. |
| 2   | Manifest and RUN-HINTS name two mutually exclusive typography token families                                     | **Follow RUN-HINTS** → `--sl-text-new-*` longhands                                                                                                      | _(Superseded by the orchestrator before Stage 3 — see "Orchestrator overrides" below. RUN-HINTS was incomplete when the decomposer read it.)_                                                                                                                                                                                                                                                                                                                                                                           |
| 3   | Section nav: links or tabs?                                                                                      | **`<nav>`+`<ul>`+`<a aria-current="page">`**                                                                                                            | Separate itslearning routes, not in-page panels; tabs would also trigger the lazy-loaded-panel rule and add two components for nothing.                                                                                                                                                                                                                                                                                                                                                                                 |
| 4   | Five needed icons are not among the theme's 54 (`bell`, `comment`, `graduation-cap`, `circle-pen`, `your-files`) | **Omit each, keep surrounding geometry, record five Stage 4 discrepancies**                                                                             | Never `@fortawesome/*`, never a hand-drawn SVG. Only `info`, `xmark`, `search`, `sort` are available — and the first two are rendered by `sl-inline-message`, the last by `sl-grid-sorter`, so the run may end with zero direct `<sl-icon>` usages.                                                                                                                                                                                                                                                                     |
| 5   | Course-hat avatar with no glyph                                                                                  | **Render `<sl-avatar size="sm">` with an empty `fallback` slot** — the grey circle at the right diameter                                                | Preserves row geometry; dropping it would shift every course name left. Note `avatar.ts` has a `fallback` slot, **not** the `icon` slot the manifest's snippet shows — that snippet is wrong.                                                                                                                                                                                                                                                                                                                           |
| 6   | Nav labels: model data or component constants?                                                                   | **Component constants**; model carries only `activeLinkId`                                                                                              | Conventions + peer run both do this; renders with zero args either way.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 7   | `teacherNames: string[]` or a pre-baked `'Floyd Miles and 2 more'`?                                              | **The array**; the component composes "and N more"                                                                                                      | Assembled display text must not live in a model.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 8   | `lastUpdatedAt`: ISO or the literal `'05/04/2024'`?                                                              | **ISO `'2024-04-05'`, formatted in the component**                                                                                                      | `05/04/2024` is DD/MM/YYYY (European); `Intl` with `en-US` silently yields `4/5/2024` and breaks the pixel diff. Use `en-GB`, `day:'2-digit', month:'2-digit'`.                                                                                                                                                                                                                                                                                                                                                         |
| 9   | Is `appName: 'Files'` data or a constant?                                                                        | **A model field**                                                                                                                                       | itslearning tools are renameable per institution; also keeps `SectionNavModel` from degenerating to one scalar.                                                                                                                                                                                                                                                                                                                                                                                                         |
| 10  | Who owns sort state?                                                                                             | **The table, as `@state`**, emitting `sl-itsl-files-sort-change`                                                                                        | Lets a server-sorting host take over. The design shows both sortable columns neutral, so initial state is `undefined`.                                                                                                                                                                                                                                                                                                                                                                                                  |
| 11  | Keep `CourseTableModel` as a wrapper with one field?                                                             | **Yes**                                                                                                                                                 | Matches the one-model-per-child rule; leaves room for `totalCount` / pagination without a breaking change.                                                                                                                                                                                                                                                                                                                                                                                                              |
| 12  | Banner: root property or a slot?                                                                                 | **A property**                                                                                                                                          | The banner text is the design's own content; slots are reserved for arbitrary consumer markup.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 13  | White card: `<div>` or `<sl-panel>`?                                                                             | **`<div>`**                                                                                                                                             | No heading; `sl-panel`'s own padding would fight the design's 32/20px content-block padding.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 14  | A `course-panel` wrapping card + banner + table?                                                                 | **No**                                                                                                                                                  | The card is CSS and the banner is one existing element; a fourth child adds a shadow boundary with no responsibility.                                                                                                                                                                                                                                                                                                                                                                                                   |
| 15  | A `page-header` component for the `<h1>`?                                                                        | **No**                                                                                                                                                  | The Figma PageHeader's other children are all hidden in this state.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 16  | Course-name link: plain `<a>` or `@sl-design-system/link`?                                                       | **Plain `<a>`** styled with `--sl-color-palette-blue-700`                                                                                               | Unverified whether the `link` package's default styling matches; inside a grid cell renderer an extra scoped element is one more registration that can silently render nothing. Implementer should check and upgrade if it fits.                                                                                                                                                                                                                                                                                        |
| 17  | The "its" logo and the green "Files" app glyph are image assets with no export and no matching colour token      | **Logo as a styled `<span class="logo" aria-hidden="true">its</span>` (peer-run approach); omit the Files glyph; record both as Stage 4 discrepancies** | Never `<img src="/assets/…">` — it 404s.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 18  | Does `sl-search-field` render the design's attached square search button?                                        | **Accept what it renders, record the delta**                                                                                                            | Source not read; the design shows a bordered button fused to the input's right edge.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 19  | `<sl-tag>` variant/size for status chips                                                                         | **`<sl-tag size="md">`, no variant (neutral)**                                                                                                          | `neutral \| info` are the only variants; a non-`removable` tag is non-interactive, matching the itslearning doc. Whether `neutral` resolves to grey-100 fill / grey-400 border needs a visual check.                                                                                                                                                                                                                                                                                                                    |
| 20  | Palette tokens vs semantic tokens                                                                                | **Use the manifest's `--sl-color-palette-*` names verbatim**                                                                                            | They were grep-confirmed with line numbers; any semantic substitute would be a guess. Dark-mode consequence flagged for Stage 4.                                                                                                                                                                                                                                                                                                                                                                                        |
| 21  | Two values with no token at all: `#d9e3e8` and the nav `layer-shadow`                                            | **Skip both rather than hardcode**                                                                                                                      | Conventions forbid raw hex and `var()` fallbacks. The avatar takes `sl-avatar`'s default background; the nav gets no shadow. Two Stage 4 discrepancies.                                                                                                                                                                                                                                                                                                                                                                 |
| 22  | `<nav>` landmarks in a generated component                                                                       | **Use `<nav aria-label="Main">` and `<nav aria-label="Files">`**                                                                                        | Multiple distinctly-labelled `nav`s are valid; the hard prohibition on `<main>` / `role="main"` is respected.                                                                                                                                                                                                                                                                                                                                                                                                           |

## Decomposer confidence, per composed component

`get_code_connect_map` returned `{}` for every node, so none of these is a confirmed mapping.
From reading the actual source: `sl-inline-message` **high** (exact behavioural match incl.
`sl-dismiss` and the built-in dismiss button); `sl-tag` **high** semantically, unverified
visually; `sl-avatar` **medium-high** (`fallback` slot, not `icon`); `sl-search-field`
**medium** (source unread); `sl-grid` **high** semantically, **low** for pixel fidelity;
`sl-icon` high but mostly unusable here. **`sl-button` is identified three times in the manifest
and is needed zero times** — `sl-inline-message` and `sl-grid-sorter` each render their own.

## Orchestrator overrides applied before Stage 3

- **Open question 2 is answered the other way.** RUN-HINTS was incomplete when the decomposer
  read it: it stated only that no bare `--sl-text-new-*` shorthand exists, not which family to
  use. Both families exist. `--sl-text-new-*` has `fontFamily: 'Open Sans'`; the design's font is
  **Lato**, which is what `--sl-text-*` / `--sl-title-*` / `--sl-heading-*` / `--sl-label-*`
  resolve to in this theme. **Stage 3 uses `--sl-text-*` / `--sl-title-*`, not
  `--sl-text-new-*`.** The resolved px values (traced through the `-userGroup` → `-superuser` →
  `--sl-computed-desktop-*` chain, which is what applies with no `data-user-group` attribute) are
  in RUN-HINTS: `--sl-text-lg` = 16/24, `--sl-text-md` = 14/20, `--sl-title-lg` = 22/28,
  `--sl-title-md` = 16/20. Bold is `--sl-fontWeight-bold` (700, exact match to the design);
  `--sl-typography-title-*-fontWeight` is 600 and would be 100 units light.
