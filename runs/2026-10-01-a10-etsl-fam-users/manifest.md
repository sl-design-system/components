# Design Manifest — FAM - Users (case A10)

Figma file **Editorial Suite designs** (`S5QgDy8X9eqhvECPANSZMM`), node **`FAM - Users`** /
**`17264:29098`**, one frame at **1440 × 837**. A functional-administration screen: dark product
top-bar, page header with a four-tab strip, a filter row (search + period select + primary
"Add new user"), an eight-column user table with three rows and per-row Edit/Delete, and a
rows-per-page paginator footer.

**Theme (derived per-frame, NOT from the team label): `editorial-suite`.**
`theme-match.mjs` → `best: editorial-suite`, `method: token-name`, 6/6,
`absoluteAgreement: 1`, `marginOverSecond: 6`, `confident: true`. Independently, a reverse hex
lookup across all 21 themes resolved 9 of 11 distinct colours in `editorial-suite` and 0
elsewhere. See `THEME-NOTES.md` — and note it **disagrees** with the sibling A5 frame of the same
file, which derives `sanoma-learning`.

## Existing SLDS components used

| Node ID                               | Node name                    | Component                                                          | How identified                                                     |
| ------------------------------------- | ---------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `17266:31419`                         | sl-button-rectangular        | `sl-button variant="primary"` + `sl-icon`                          | **CC snippet**, `hasTemplate: true`                                |
| `17557:100187`                        | sl-select (simple-prototype) | `sl-form-field label="Last login date"` + `sl-select`              | **CC snippet**, `hasTemplate: true`                                |
| `0:3` (via `17557:100187`)            | —                            | `sl-label` (`packages/components/form/src/label.ts`)               | **CC, `hasTemplate: false`** — third state: identified, no snippet |
| `17266:31414`                         | sl-searchfield               | `sl-search-field`                                                  | `{}` from CC; `sl-*` node name                                     |
| `I17264:29099;25806:56903`            | sl-avatar                    | `sl-avatar` (32px, initials "JV")                                  | `{}` from CC; `sl-*` data-name                                     |
| `I17264:29099;23066:86145;6539:37591` | sl-icon                      | `sl-icon`                                                          | `{}` from CC; `sl-*` data-name                                     |
| `17264:29157/:29158/:29159`           | td-text-start                | **6 × `sl-button`** ("Edit"/"Delete")                              | `{}` from CC; recovered from `get_design_context` `data-name`      |
| `17264:29105`                         | tabbar-horizontal            | `sl-tab-group` + 4 × `sl-tab`                                      | `{}` from CC; structure                                            |
| `17264:29113` + 8 column frames       | mat-body                     | a table (see Correction 1)                                         | `{}` from CC; Vuetify doc-link provenance                          |
| `17264:29167`                         | mat-data-footer              | `sl-paginator` (+ `sl-paginator-page-size`, `sl-paginator-status`) | `{}` from CC; Vuetify paginator shape                              |

Genuinely unmapped: `17264:29099` **top nav bar** — product app chrome, no SLDS package covers it.

**Counts.** 50 `<instance>` elements in the metadata (7 hidden → 43 visible); 205 addressable
`data-node-id` nodes; 32 distinct instance roots. **A developer places ~9 distinct types / ~22
elements.** The headline "1,512 nodes / 61 component types" over-states the work by ~70×.

## ORCHESTRATOR CORRECTIONS to the analyst's manifest

**Correction 1 — there is no `sl-table` in this repository.** `packages/components/` has no
`table` package. The candidates are `sl-grid` (+ `sl-grid-column`, `sl-grid-sort-column`) or a
plain semantic `<table>` styled with tokens. The design's table is a **Vuetify** data-table
(`mat-body`, `th-text-start`, `td-text-start`, doc link `vuetifyjs.com/en/components/data-tables`),
so this is an **as-is port**, not a mapping. Decide deliberately and record the default.

**Correction 2 — exact tag names.** `sl-paginator`, `sl-paginator-page-size`,
`sl-paginator-status`; `sl-tab`, `sl-tab-group`, `sl-tab-panel`; `sl-grid`, `sl-grid-column`,
`sl-grid-sort-column`; `sl-search-field`; `sl-form-field`; `sl-select`; `sl-avatar`; `sl-icon`;
`sl-button`.

**Correction 3 — the CC snippet for the primary button is valid but wrong.** It emits
`<sl-icon name="far-plus">`. `editorial-suite/icons.ts` registers **`plus`**, not `far-plus`.
Use `plus`. This is a Code Connect mapping that resolves and would still render nothing.

**Correction 4 — the "unbound" list was re-checked by resolved value (not by name prefix) across
all themes, and it holds.** `#02242e`, `#021d25`, `#d9d9d9`, `#25292f`, `#c8d1da`, `#818b98`
appear in **no** theme. The nearest token to the nav bar's `#02242e` is
`--sl-color-background-primary-interactive-bold` = `#062b2d` (Δ R4 G7 B1, ≈8 Euclidean) — a
_pressed-state_ token, semantically wrong for app chrome.
**Policy for this run:** a colour with no theme token gets a run-local custom property
`--a10-color-<role>`, declared once on the page root with its Figma variable name in a comment.
Never a bare hex in a rule, never an invented `--sl-*` name. This keeps the floor measurable.

## Composition candidates

- **Filter row** `17266:31413` — search field, period select, right-aligned primary action on one 1200×60 baseline.
- **User table row** — eight cells + a two-button action cell, 68px tall, identical per user.
- **Row action pair** `17264:29157/:29158/:29159` — two `sl-button`s, "Edit"/"Delete".
- **Page header** `17264:29100` — centred Raleway Bold 28px title on a grey band, tab strip flush to its bottom edge.
- **Data table + footer** `17264:29112` — paginator anchored to the table's bottom edge, same 1200px width.

## Net-new primitives

- **`17264:29099` top nav bar** — 1440×50, `#02242e`, Editorial Suite wordmark left, a "Projects"
  switcher (icon + chevron) and a `sl-avatar` right. No SLDS package covers app chrome
  (`sl-tool-bar` is a content toolbar). Net-new surface is only the bar layout + dark ground.
- **`17266:31418` Rectangle 1192** — a 760×60 spacer vector between the select and the button. No
  text, no visible fill. **Drop it and use `flex: 1`** — do not export a meaningless asset.

## Geometry (from `figma-metadata.txt`, exact)

- Content column **1200px**, centred, gutters **120px** each side.
- Top nav bar `y=0 h=50`, full 1440 width.
- Header band `17264:29100` `y=50 h=181`; title text `y=16 h=38` inside a 70px frame at `y=33.5`;
  tab strip `17264:29105` at `x=120 y=137` (absolute `y=187`), `1200×44`.
- Body `17264:29106` `y=231 h=606`.
- Filter row `17266:31413` `x=120 y=40` (absolute `y=271`), `1200×60`:
  search field `x=0 w=280 h=60`; select `x=290 w=280 h=60`; spacer vector `x=290 w=760`;
  button `x=1060 y=24 w=140 h=36`.
- Table `17264:29112` `x=120 y=124` (absolute `y=355`), `1200×310`:
  header row **48px**, data rows **68px** × 3 → body 252px; footer `17264:29167` `y=252 h=58`.
- Column widths, left to right, summing to exactly 1200:
  `155.8333` × 5, then **117**, then `155.8333`, then **148**.
  (Login, Name, Email, Role, Employee type, CFA, Last login date, actions.)
- Two extra hidden column frames and six hidden `td` instances exist — **do not render them.**

## Content (verbatim)

- Top bar: wordmark "Editorial Suite" (image), Projects switcher, avatar initials **JV**.
- Title: **Functional management**.
- Tabs: **Users** (selected) · Downtime events · Services · Metadata usage.
- Filter row: label "Search user" / placeholder "Enter search text"; label "Last login date" /
  value "Last 30 days" / placeholder "Select period"; button "Add new user".
- Table headers: Login (sorted ascending) · Name · Email · Role · Employee type · CFA ·
  Last login date · (blank).
- Rows:
  1. `AkashPM` · `AkashPM` · `akashpm@kampus.fi` · `Publication Manager` · `Developer` · `Sanoma pro` · `23-10-2024 at 14:30`
  2. `AlisamertensOM` · `Van IN: Alisa Mertens` · `a.mertens@vanin.be` · `Outline Manager` · `Manager` · `Kampus ` · `23-10-2024 at 14:30`
  3. `AnnedePauwCA` · `Van In: Ann de Pauw CA` · `anndepauw@vanin.nl` · `Content Analyst` · `Manager` · `iDiddit` · `23-10-2024 at 14:30`
     Each row ends with **Edit** and **Delete**.
- Footer: "Rows per page:" · `25` · "1-1 of 1" · prev · next.

## Icons the design names, and what this theme has

| Design name             | Source font                    | In `editorial-suite/icons.ts`?                | Action                                                      |
| ----------------------- | ------------------------------ | --------------------------------------------- | ----------------------------------------------------------- |
| `book-circle-arrow-up`  | FA6 Pro Solid, 20px, white     | **NO**                                        | omit, preserve 20px footprint, record                       |
| `chevron-down`          | FA7 Pro Regular, 14px / 16px   | yes                                           | use                                                         |
| `search`                | FA6 Pro Regular, 16px          | yes                                           | use (`sl-search-field` supplies its own)                    |
| `arrow-up` (Login sort) | FA6 Pro Solid, 14px, `#585c61` | **NO** (`sort-up`, `sort`, `sort-down` exist) | `sort-up` is the honest substitute; record the substitution |
| `far-plus` (CC snippet) | — , 16px                       | **as `plus`**                                 | use `plus` — see Correction 3                               |
| `arrow_drop_down`       | **Material Icons**, 24px       | **NO**                                        | nearest is `caret-down-solid`; record                       |
| `chevron_left`          | **Material Icons**, 24px       | as `chevron-left`                             | use `chevron-left`; record the family change                |
| `navigate_next`         | **Material Icons**, 24px       | as `chevron-right`                            | use `chevron-right`; record the family change               |

Three icons are **Material Icons**, two Font Awesome majors (6 Pro and 7 Pro) are in play.
`@fortawesome/*` is not installed and is a **render** blocker — never import it, never
`Icon.register(...)`, never hand-draw a replacement.

## Image assets — there is no export step in this pipeline

Five remote assets under `https://www.figma.com/api/mcp/asset/fc65805b-.../`, URLs expiring
7 days from 2026-10-01:

| Constant                        | What it is                           | Disposition                                                    |
| ------------------------------- | ------------------------------------ | -------------------------------------------------------------- |
| `imgLogo` `/32664.png`          | "Editorial Suite" wordmark, 155×20   | **the only one that matters** — nothing else renders the brand |
| `imgAvatarContent` `/0b42d.svg` | avatar clip mask                     | replace with `sl-avatar`                                       |
| `imgMask` `/37b56.svg`          | the "JV" initials rendered as a mask | replace with `sl-avatar display-initials`                      |
| `imgRectangle1192` `/a4db3.svg` | 760×60 spacer                        | **drop**, use `flex: 1`                                        |
| `imgIconColorMask` `/95dc3.svg` | the plus glyph as a mask             | replace with `sl-icon name="plus"`                             |

The harness serves `/assets` from an **empty** directory and that directory is **shared — do not
write to it.** Any `<img src="/assets/…">` 404s and is a Stage 4 discrepancy.

## Token reference

**Trap recorded by the analyst:** the `var(--token, FALLBACK)` fallbacks printed inside
`figma-design-context.md` come from a _different_ theme mode and are **wrong**.
`color/foreground/primary/bold` prints `#1727b6` but resolves to `#145b5b`;
`color/background/primary/bold` prints `#36f` but resolves to `#137271`;
`color/palette/grey/900` prints `#222` but resolves to `#1d1f20`;
`color/palette/grey/100` prints `#f0f2f5` but resolves to `#ececf1`.
**`get_variable_defs` wins over the design-context fallback, always.**

### Colour — has an exact token (14 of 20 distinct values)

| Figma variable                                                                     | Resolved  | SLDS token                             |
| ---------------------------------------------------------------------------------- | --------- | -------------------------------------- |
| `color/background/primary/bold`                                                    | `#137271` | `--sl-color-background-primary-bold`   |
| `color/foreground/primary/bold`                                                    | `#145b5b` | `--sl-color-foreground-primary-bold`   |
| `color/foreground/primary/onBold`                                                  | `#ffffff` | `--sl-color-foreground-primary-onBold` |
| `color/foreground/bold`                                                            | `#1d1f20` | `--sl-color-foreground-bold`           |
| `color/palette/grey/100`                                                           | `#ececf1` | `--sl-color-palette-grey-100`          |
| `color/palette/grey/900`, `color/palette/neutral/900`                              | `#1d1f20` | `--sl-color-palette-grey-900`          |
| `color/palette/neutral/50`, `BG suite`                                             | `#f4f5fa` | `--sl-color-palette-grey-050`          |
| `color/palette/neutral/300`, `color/tab/default/border`, `color/tab/tabbar/border` | `#c8c8cf` | `--sl-color-palette-grey-300`          |
| `color/palette/neutral/600`, textField placeholder                                 | `#7a818e` | `--sl-color-palette-grey-600`          |
| `color/input/textField/default/default/border`                                     | `#7a818e` | `--sl-color-border-accent-grey-bold`   |
| `color/palette/neutral/700`                                                        | `#585c61` | `--sl-color-palette-grey-700`          |
| `color/tab/default/indicator`                                                      | `#4589be` | `--sl-color-palette-blue-500`          |
| `surface`, `background`, tab + textField backgrounds                               | `#ffffff` | `--sl-color-white`                     |

### Colour — NO token in any theme (verified by resolved value, not by name)

| Value              | Where                                                                | Run-local property          |
| ------------------ | -------------------------------------------------------------------- | --------------------------- |
| `#02242e`          | top nav bar ground; tab foreground; field-label text; textField icon | `--a10-color-chrome`        |
| `#021d25`          | the "Functional management" H1                                       | `--a10-color-title`         |
| `#d9d9d9`          | the 1×24 select divider rule                                         | `--a10-color-divider`       |
| `#25292f`          | select value text + chevron                                          | `--a10-color-select-text`   |
| `#c8d1da`          | select background overlay                                            | `--a10-color-select-bg`     |
| `#818b98`          | select border                                                        | `--a10-color-select-border` |
| `rgba(0,0,0,0.12)` | `inset 0 -1px 0` row separator on every th/td                        | `--a10-color-row-rule`      |
| `rgba(0,0,0,0.42)` | `mat-divider` under the paginator "25"                               | `--a10-color-pagesize-rule` |
| `#00000000`        | `color/transparant` (Figma's typo)                                   | use `transparent`           |

**Mixed-theme warning.** `#25292f`, `#c8d1da`, `#818b98` all sit inside the single node
`17557:100187` (the newer `sl-select (simple-prototype)`) and match `sanoma-learning` only. That
one instance is themed differently from the rest of the frame. **Use `editorial-suite`'s select
tokens, not these hexes.** Treat them as evidence of designer drift, not as targets.

### Size / spacing tokens present

`--sl-size-010` `--sl-size-200` `--sl-size-250` `--sl-size-300` `--sl-size-icon-font-md`
`--sl-size-lineHeight-250` `--sl-size-borderRadius-default` `--sl-size-borderRadius-full`
`--sl-size-borderWidth-none` `--sl-size-borderWidth-default` `--sl-size-borderWidth-action`
`--sl-space-025` `--sl-space-075` `--sl-space-100` `--sl-space-150` `--sl-space-175`
`--sl-space-200` `--sl-space-new-none` `--sl-space-new-2xs` `--sl-space-new-xs`
`--sl-space-new-sm` `--sl-space-new-md`

No Figma variable backs: gutter 120, column 1200, top bar 50, header band 181, th 48, td 68,
footer 58, tab padding 24/12, search field 32, button 36, avatar 32, paginator buttons 32.
These are **layout**, not colour — express them as the layout mechanism that produces them
(flex/grid + the tokens above), and where a raw length is unavoidable, state the arithmetic.

### Typography — LONGHANDS ONLY, and the family token is a trap

`editorial-suite` declares **zero bare `--sl-text-new-*` tokens**. `font:` shorthand against one
drops the whole declaration silently. Headings have **no** `-fontWeight` longhand — take weight
from `--sl-text-new-typeset-fontWeight-semiBold`.

Every `--sl-text-new-*-fontFamily` resolves to `'Open Sans'`, which this theme's Typekit
(`bws3iof`) does not ship **and which the design does not ask for**. The design asks for
**Raleway** (heading) and **Roboto** (body) — exactly `--sl-heading-fontFamily` and
`--sl-text-fontFamily`. **Use the legacy family tokens**; take size/lineHeight from the
`--sl-text-new-*` longhands.

Figma styles, verbatim:

- `text/heading/1` = `Font(family: "Raleway", style: Bold, size: 28, weight: 700, lineHeight: 38, letterSpacing: -1)` — page title
- `Body/md/regular` = Roboto 14 / 400 / 20 / 0
- `Body/md/bold` = Roboto 14 / 500 (semiBold) / 20 / 0
- `tab/subtitle` = Roboto 14 / 400 / 20 / 0
- `text/input/textField/text/md` = Roboto 14 / 400 / 20 / 0
- `v-text/body-2` = Roboto 14 / 400 / 20 / **0.25** — Vuetify leftover; drives every table cell
- `v-icon/medium` = Material Icons 24 / 400 — Vuetify leftover; the three paginator icons
- Table-header type is Roboto SemiBold **16 / 20, letter-spacing 0.4** — **no token**; it does
  not match `size/text-new/body/md` (14).

## Responsive

**Single breakpoint, 1440.** Only one frame exists. A fixed 1200px content column with 120px
gutters. The eight columns are fractional (155.83 ≈ 1200/7.7), so the table is built to stretch,
but no annotation says where it would break.

## Designer annotations

**None.** No annotation or comment layer on `17264:29098`. The "Component descriptions" block in
`figma-design-context-part2.md` is Figma _library_ documentation on the source components, not
annotations on this frame. Two worth the implementer's eye:

- `sl-button-rectangular`: "INVERTED BUTTONS are only to be used with
  `elevation.surface.raised.inverted` and `elevation.surface.raised.primary`."
- `sl_base-search_field-lg`: "Do not edit this component … edit the top-level component."

## i18n

**Off** for this run. No `msg()`, no `@localized()`, no `yarn extract-i18n`.

---

# Decomposition (Stage 2)

**Five new components.** The three user rows are **not** a component — `<tr>`s mapped from
`FamUser[]` inside the table. Nor is the "row action pair": two `<sl-button>`s inside a `<td>`.

```
<sl-a10-fam-users-page>                 ROOT — the only guarded customElements.define.
│                                        Owns all data + all UI state. Declares --a10-color-* on :host.
├── <sl-a10-app-bar>              app-bar/          uses sl-avatar, sl-icon
├── <sl-a10-page-header>          page-header/      uses sl-tab-group, sl-tab
├── <sl-a10-user-filters>         user-filters/     uses sl-form-field, sl-search-field, sl-select, sl-option, sl-button, sl-icon
└── <sl-a10-user-table>           user-table/       uses sl-button, sl-icon
    └── <sl-a10-user-table-footer>  user-table/table-footer/   uses sl-button, sl-icon
```

Dependency levels for Stage 3: **L0** app-bar · page-header · user-filters · table-footer (parallel)
→ **L1** user-table → **L2** fam-users-page.

Files (no `package.json`, no `register.ts`, no `index.ts`, no spec, no docs, no changeset):
`fam-users-page.{ts,css,stories.ts}` at the root of the run folder; `app-bar/app-bar.{ts,css}`;
`page-header/page-header.{ts,css}`; `user-filters/user-filters.{ts,css}`;
`user-table/user-table.{ts,css}`; `user-table/table-footer/table-footer.{ts,css}`.

## Shared types / contracts — implement verbatim

Each is exported by the component that consumes it; the root imports all. No cycles — children
never import from the root.

```ts
// app-bar/app-bar.ts
export interface AppBarUser {
  initials: string;
  name: string;
}
export interface AppBarModel {
  productName: string;
  user: AppBarUser;
}
export type SlA10ProjectSwitchEvent = CustomEvent<void>;
export type SlA10UserMenuEvent = CustomEvent<void>;

// page-header/page-header.ts
export type FamTabId = 'users' | 'downtime-events' | 'services' | 'metadata-usage';
export interface PageHeaderModel {
  title: string;
}
export type SlA10TabChangeEvent = CustomEvent<FamTabId>;

// user-filters/user-filters.ts
export type PeriodId = 'last-7-days' | 'last-30-days' | 'last-90-days';
export interface UserFiltersModel {
  searchTerm: string;
  period: PeriodId;
}
export type SlA10SearchChangeEvent = CustomEvent<string>;
export type SlA10PeriodChangeEvent = CustomEvent<PeriodId>;
export type SlA10AddUserEvent = CustomEvent<void>;

// user-table/user-table.ts
export interface FamUser {
  id: string;
  login: string;
  name: string;
  email: string;
  role: string;
  employeeType: string;
  cfa: string;
  lastLoginAt: string; // ISO 8601, e.g. '2024-10-23T14:30:00'
}
export type FamUserColumnId =
  'login' | 'name' | 'email' | 'role' | 'employeeType' | 'cfa' | 'lastLoginAt';
export interface FamUserSort {
  column: FamUserColumnId;
  direction: 'asc' | 'desc';
}
export interface UserTableModel {
  rows: FamUser[];
  sort: FamUserSort;
  page: TablePageModel;
}
export type SlA10SortChangeEvent = CustomEvent<FamUserSort>;
export type SlA10UserEditEvent = CustomEvent<{ userId: string }>;
export type SlA10UserDeleteEvent = CustomEvent<{ userId: string }>;

// user-table/table-footer/table-footer.ts
export interface TablePageModel {
  page: number;
  pageSize: number;
  totalItems: number;
}
export type SlA10PageChangeEvent = CustomEvent<number>;
export type SlA10PageSizeChangeEvent = CustomEvent<number>;
```

Models hold **domain data and stable keys only**. Tab labels, period labels, column labels,
"Rows per page:", "Edit", "Delete", "Add new user" are UI strings and live in the rendering
component. Tab set, column set, page-size set and period set are **structural config** —
module-level constants inside the component that renders them.

**Event-name uniqueness.** All eleven names are `sl-a10-`-prefixed. They deliberately avoid
`sl-page-change` / `sl-page-size-change`, which the paginator package already claims in
`GlobalEventHandlersEventMap` — redeclaring one with a different payload is a duplicate-identifier
build break, not a style problem.

## Open questions and the default chosen — 14, plus one orchestrator override

| #     | Question                                  | Default chosen                                                                                                                                                                                                                                                                                                                                                                    |
| ----- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OQ-1  | Table: `sl-grid` or plain `<table>`?      | **plain semantic `<table>`.** As-is Vuetify port; no `sl-table` exists. `sl-grid` brings its own column model, header chrome and sort affordance, all of which would be fought to reach 155.8333px columns, 68px rows and the `inset 0 -1px 0` separator. Cost: forgoes grid's virtualization/selection/DS look.                                                                  |
| OQ-2  | Paginator: `sl-paginator` or hand-port?   | **hand-port.** Checked the sources: `sl-paginator` _always_ renders numbered page buttons and a `sl-select` the design has none of; `sl-paginator-status` renders `"1 - 1 of 1 items"` (spaced hyphens + mandatory item noun), unreachable to `1-1 of 1` at any `itemLabel`. Only `sl-paginator-page-size` is near. Cost: loses `announce()`, partly restored by `role="status"`. |
| OQ-2b | Page-size control                         | **native `<select>`**, `appearance: none`, underlined. `sl-select` would need border/ground/radius all overridden to disappear. _The decomposer's own weakest default._                                                                                                                                                                                                           |
| OQ-3  | Top nav bar, and the wordmark             | **own `sl-a10-app-bar`**; wordmark as **text** in a pinned 155×20 box. `/assets` is empty and shared so an `<img>` guarantees a 404. Text is the same string the design shows, so nothing is invented — but the letterforms differ: **record as a Stage 4 discrepancy.** `book-circle-arrow-up` is absent → omit, keep the 20×20 box, draw only the registered `chevron-down`.    |
| OQ-4  | Avatar accessible name                    | **`{ initials: 'JV', name: 'JV' }`.** No full name exists anywhere in the frame; a plausible one was deliberately **not** invented. Poor screen-reader announcement, honestly recorded.                                                                                                                                                                                           |
| OQ-5  | Sort indicator                            | **`sort-up`** at 14px. `arrow-up` is not among the 54 (the theme has `arrow-left`/`arrow-right`/`arrow-up-right-from-square` but no plain `arrow-up`). Filled triangle vs line arrow — silhouette differs, **record**. Unsorted columns render **no** glyph, matching the design.                                                                                                 |
| OQ-6  | Interactivity                             | **every control wired.** Search (debounced 200ms), period, sort, paging, page-size all work; **Delete actually removes the row** — the one visibly falsifiable behaviour. Edit and Add-new-user are emit-only because the design contains no edit screen and no create dialog.                                                                                                    |
| OQ-7  | The three `--a10-color-select-*`          | **do not declare them.** `#25292f` / `#c8d1da` / `#818b98` all sit in the single drifted `17557:100187` node and match `sanoma-learning` only. Designer drift, not targets. Only **five** run-local properties are declared. The select will measure slightly off — that is the correct outcome.                                                                                  |
| OQ-8  | `"1-1 of 1"` verbatim or computed?        | **computed → `"1-3 of 3"`.** The design's own numbers are inconsistent: three rows, claims "1-1 of 1". Hardcoding it ships a footer that contradicts its table. Intentional text deviation, **recorded**. Related: `lastLoginAt` is ISO 8601 in the model, formatted by the table to `23-10-2024 at 14:30` (build from date parts — `en-GB` yields slashes).                      |
| OQ-9  | The three empty tabs                      | **selectable; an empty 606px body.** Inventing placeholder content would be fabrication; inert tabs would be a lie about the strip. A11y gap recorded: with no `sl-tab-panel`s there is no `aria-controls`, and the root's region cannot be `aria-labelledby` the active tab across shadow roots.                                                                                 |
| OQ-10 | One-field `PageHeaderModel`               | **keep the object**, for uniformity and future extension. Low stakes.                                                                                                                                                                                                                                                                                                             |
| OQ-11 | Heading weight and size                   | size: **raw `28px / 38px / -1px`** — no token exists; nearest `--sl-text-new-heading-lg` is 24/32, a 14% miss on the largest element. Weight: see override below.                                                                                                                                                                                                                 |
| OQ-12 | Stories for children                      | **one story, on the root only.** Children register only through the parent's scoped registry, so a conventional child story cannot resolve its tag.                                                                                                                                                                                                                               |
| OQ-13 | Net-new primitives                        | app bar **approved, example-scoped only** — explicitly not a promotion candidate for `packages/components/`. `Rectangle 1192` (760×60 spacer vector) **rejected** → `flex: 1`.                                                                                                                                                                                                    |
| OQ-14 | Wrap the search field in `sl-form-field`? | **yes**, for symmetry — Code Connect gives the select one; both 60px blocks then align and the search input gets proper `<label for>` wiring.                                                                                                                                                                                                                                     |

**Orchestrator override of OQ-11(a).** The decomposer could not cheaply resolve the heading weight
and fell back to `--sl-text-new-typeset-fontWeight-semiBold`, flagging a probable one-step miss.
Resolved: **`--sl-fontWeight-700: 700` exists in `editorial-suite`.** The design is Raleway Bold
700, so the H1 uses `font-weight: var(--sl-fontWeight-700)` — an exact match, no weight miss.
Other headings keep `--sl-text-new-typeset-fontWeight-semiBold`.

## Two notes implementers must not miss

- **`<sl-tab-group>` with no panels is supported but needs help.** `tab-group.ts` sets `no-panels`
  from `#onTabPanelSlotChange`, which runs off `slotchange` — and `slotchange` does not reliably
  fire for a slot empty from the start. **Write `no-panels` on the element in the template.**
- **`sl-tab-group` emits an index, not an id.** Its `sl-tab-change` is `CustomEvent<number>`.
  `sl-a10-page-header` maps it through the local `FAM_TABS` constant before re-emitting a `FamTabId`.
- `sl-option` is registered by the **listbox** package (`@sl-design-system/listbox`), not select.
