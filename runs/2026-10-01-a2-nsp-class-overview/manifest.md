# Design Manifest — NS-fundaments / class overview

## Overview

Figma file **NS-fundaments** (team NSP), top-level node **`class overview `** (node ID `2422:87039`),
frame size **1280 × 1003 px**. The design is a teacher-facing **class detail / participants** screen:
the product's two-row application navigation (global bar + a class-scoped secondary bar reading
"5A English · Overview · Method · Lessons · Participants"), a small **"Class code"** card exposing the
join code `D9981` with copy and share actions, and a large **"Students"** panel containing two
stacked action buttons ("Add students", "Create groups") above a **four-column sortable, filterable
data grid**.

**The grid is a blueprint, not real content.** Every one of its 40 data cells reads the literal string
`Text`, every filter input reads `Placeholder`, the four column headers all read `Text`, and the
footer row reads `Footer`. The design carries no domain data.

**Scale note (this is the corpus's largest design).** The survey counted **10,936 nodes / 42 component
types**. Roughly 10,000 of those live inside the single `sl-grid-quick-grid` instance
(`2422:87812`) — 23 row instances × ~45 descendant instances each, of which most are `hidden="true"`
(an unused grabber, selection checkbox, six surplus columns, a row button-bar, and full-height
divider variants). **No Figma MCP call ever exposes that scale**: `get_metadata` stops at instance
boundaries (27 nodes at the root) and `get_design_context` on the grid collapses the whole subtree
to one Code Connect line. See _Scale behaviour_ below and `progress.json → scaleFindings`.

## Existing SLDS Components Used

| Node ID                        | Node Name               | Mapped Component                | CC Snippet (excerpt)                                                                                                                                    |
| ------------------------------ | ----------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `2422:87812`                   | sl-grid-quick-grid      | `<sl-grid>`                     | `<sl-grid></sl-grid>` — **resolved but vacuous**; the entire ~10,000-node grid collapsed to this                                                        |
| `2422:87226`                   | sl-button-rectangular   | `<sl-button fill="ghost">`      | `<sl-button aria-label="Button" fill="ghost"><sl-icon name="far-copy"></sl-icon></sl-button>`                                                           |
| `2422:87227`                   | sl-button-rectangular   | `<sl-button fill="ghost">`      | `<sl-button aria-label="Button" fill="ghost"><sl-icon name="far-share"></sl-icon></sl-button>`                                                          |
| `2422:87052`                   | sl-button-bar/Rectangle | `<sl-button-bar>`               | `<sl-button-bar fill="outline"><sl-button variant="primary"><sl-icon name="far-presentation-screen"></sl-icon>Add students</sl-button></sl-button-bar>` |
| `2422:91204`                   | sl-button-bar/Rectangle | `<sl-button-bar>`               | `<sl-button-bar fill="outline"><sl-button fill="outline">Create groups</sl-button></sl-button-bar>`                                                     |
| `2422:87040`                   | Navigation              | _(identified)_                  | wrapper instance; descriptions payload documents its parts. No single app-shell component exists in `packages/components` — composed here.              |
| `I2422:87040;2071:594`         | sl-search-field         | `<sl-search-field>`             | _(identified)_ — `sl-*` node name; `sl-search-field` is a documented component (`packages/components/search-field`)                                     |
| `I2422:87040;2071:597;10:2841` | sl-avatar               | `<sl-avatar>`                   | _(identified)_ — `sl-*` node name; documented component (`packages/components/avatar`)                                                                  |
| `I2422:87040;2071:597;10:3939` | sl-icon (chevron-down)  | `<sl-icon name="chevron-down">` | _(identified)_ — `sl-*` node name; glyph text node reads `chevron-down`                                                                                 |
| `I2422:87040;2071:587`         | Logo                    | _(net-new asset)_               | 32×32 brand mark; no component, no exported asset                                                                                                       |
| `2404:74162` (desc.)           | sl-search-field embeded | `<sl-search-field>`             | _(identified)_ — the grid's own filter-row input; `sl-grid-filter-column` already renders this                                                          |

### Code Connect outcome

**Resolved — A2 joins the minority of the corpus whose map is not empty.** Probing was **per node only**;
`get_code_connect_map`'s `nodeId` pattern is `^\d+[:-]\d+$`, which **rejects instance-path ids**
(`I2422:87040;2071:594`), so nested instances cannot be probed for Code Connect at all — they were
identified by node name and by the `get_design_context` descriptions payload instead.

| Node                    | `get_code_connect_map` result                           |
| ----------------------- | ------------------------------------------------------- |
| `2422:87039` root       | **TIMEOUT** — `{}` _carrying the server's timeout note_ |
| `2422:87040` Navigation | **EMPTY** — a clean `{}`, no note                       |
| `2422:87226`            | **RESOLVED**, `hasTemplate: true`                       |
| `2422:87227`            | **RESOLVED**, `hasTemplate: true`                       |
| `2422:87052`            | **RESOLVED**, `hasTemplate: true`                       |
| `2422:91204`            | **RESOLVED**, `hasTemplate: true`                       |
| `2422:87812` grid       | **TIMEOUT** — `{}` + timeout note                       |

**No node returned `hasTemplate: false`** — the third state hint 1 warns about did not occur here.

Three things this table settles, kept in `figma-code-connect-status.json` so the distinction survives:

- **There are two different `{}`s**, and only the attached note separates them. A timeout and a genuine
  "no mapping" are indistinguishable by value. Reading either as "unconnected" is a mistake.
- **Per-node calls time out too.** The batch's prior reading was that _subtree_ calls are the unreliable
  ones; here the root and the grid timed out as single-node probes. Per-node is more reliable, not
  reliable.
- **The grid is the proof.** Its `get_code_connect_map` call **timed out**, yet `get_design_context` on
  _the same node_ returned a working Code Connect snippet. A run that trusted the map alone would have
  recorded the single most important component on the screen as unmapped.

**Two mappings are valid-but-wrong, and one is valid-but-vacuous:**

1. **Vacuous** — `2422:87812` → `<sl-grid></sl-grid>`. Correct, authoritative, and it erases the
   columns, the sort affordance, the filter row, 40 cells, the footer and all geometry.
2. **Wrong icon namespace** — every emitted icon name is Font Awesome–prefixed (`far-copy`,
   `far-share`, `far-presentation-screen`) while the theme's `icons.ts` registers **unprefixed** keys
   (`search`, `sort`, `chevron-down`, `plus`). A snippet pasted verbatim renders no icon.
3. **Generic accessible name** — both class-code buttons carry the literal `aria-label="Button"`.
   Reproduced faithfully that is an accessibility defect delivered with authority.

## Composition Candidates

- **Application navigation** — `2422:87040` and descendants. Two stacked bars: a 56px global bar
  (Logo, four `Link-nav` links — Home / Calendar / Method catalogue / Teaching materials —
  `sl-search-field`, and a profile cluster of `sl-avatar` + `sl-icon` chevron-down) and a 48px
  class-scoped bar ("5A English" label + four `Link-nav` links — Overview / Method / Lessons /
  Participants, with **Participants** active and underlined). Reads as one persistent app-shell unit.
  **This is the same source Figma component as `b-nsp-home`'s nav** (which minted `sl-nsp-top-nav`
  from it) — see _Cross-run collision_ below.
- **Class code card** — `2422:87221` (350 × 91). A titled value card with two trailing ghost icon
  buttons. Repeats nowhere else on this screen but is a self-contained unit.
- **Students panel** — `2422:87047` (1184 × 728). Heading, two stacked single-button `sl-button-bar`s,
  and the grid. The panel surface is the composition; the grid inside it is an existing component.

## Net-New Primitive Candidates

- **Grid footer row** — the last child of `2422:87812` (`I2422:87812;4584:599682`, named "Row 06" but
  positioned at the grid's foot, 1152 × 40). Renders the text `Footer` plus a trailing up-arrow.
  **`sl-grid` has no footer concept**: its only `<tfoot>` is reserved for the horizontal scrollbar
  (`grid.ts:504`, rendered solely when `this.scrollbar`). The Figma library component therefore has a
  feature its code counterpart does not. Rendered here as a sibling element below the grid.
- **Logo mark** (`I2422:87040;2071:587`) — a 32×32 rounded blue tile with a white "S". No component,
  and the pipeline has no asset-export step. Reproduced as a styled element, not traced artwork.

## Responsive Breakpoints

_Single breakpoint: 1280px._ One frame only; no alternate-width frames and no layout-grid breakpoint
annotations were present in the metadata.

## Designer Annotations

Verbatim, from the `get_design_context` descriptions payload:

- `2045:9049` (`sl-button-rectangular`): "A button initiates an action when clicked, like redirecting
  to a new page or submitting a form. It's a key element for interaction and action. INVERTED BUTTONS
  are only to be used with `elevation.surface.raised.inverted` and `elevation.surface.raised.primary`."
  Docs: https://sanomalearning.design/categories/components/button/usage/
- `2079:26529` (`sl-button-bar/Rectangle`): "The Button bar provides a organized way to present buttons
  side by side, which will stack up when there's not enough space."
  Docs: https://sanomalearning.design/categories/components/button-bar/usage/
- `2034:5922` (`Icon only=true, ↕️ - Size=MD`) and `2034:5921` (`Icon only=false, ↕️ - Size=MD`) and
  `2034:5920` (`Icon only=true, ↕️ - Size=SM`): "Use for borders that highlight secondary actions."
- `2422:87518` (`Frame=true, Zebra=false, Horizontal dividers=true, Vertical dividers=false, Full
Vertical dividers=false`): "Use to visually group or seperate UI elements, such as card, tabs or
  side panel dividers." — _the grid's own divider configuration, stated as a variant name._
- `2404:74809` (`Row type=Header, State=Idle`): "An alternate surface color used for visual
  differentiation in components like tables or lists, providing contrast between consecutive items
  (e.g., zebra striping)."

## Token Reference

Bound variables come from `get_variable_defs` on `2422:87039` (65 entries). Figma's `a/b/c` naming maps
mechanically onto `--sl-a-b-c`; every token below was **verified present** in
`packages/themes/sanoma-learning/*.css`, and every colour was additionally **verified by resolved
value** (not by name) against the rendered screenshot.

### Color

- `--sl-elevation-surface-raised-default` — `#ffffff` — card, panel, grid row and global-nav surfaces
- `--sl-elevation-surface-raised-sunken` — `#f6f8fa` — grid header row
- `--sl-color-background-primary-bold` — `#3366ff` — "Add students" button, logo tile
- `--sl-color-foreground-primary-onBold` — `#ffffff` — "Add students" label
- `--sl-color-foreground-plain` — `#25292f` — nav links, grid cell text
- `--sl-color-foreground-bold` — `#222222` — "5A English", "Students", "Class code"
- `--sl-color-foreground-secondary-bold` — `#222222` — "Create groups" label
- `--sl-color-border-secondary-bold` — `#222222` — "Create groups" outline
- `--sl-color-foreground-subtlest` — `#59636e` — the `D9981` code value
- `--sl-color-border-plain` — `#d0d9e0` — grid outer border, column dividers
- `--sl-color-border-input` — `#818b98` — filter-input border
- `--sl-color-background-input-plain` — `#ffffff` — filter-input fill
- `--sl-color-background-input-interactive` — `#c8d1da`
- `--sl-color-background-neutral-bold` — `#e0e6ea`
- `--sl-color-background-disabled` / `--sl-color-palette-grey-100` — `#f0f2f5` — page background
- `--sl-color-palette-grey-600` — `#59636e`, `--sl-color-palette-grey-700` — `#393f46`,
  `--sl-color-palette-grey-800` — `#25292f`
- `--sl-color-transparent` — `#00000000`, `--sl-color-black` — `#000000`
- **`#f9fafb` — secondary nav bar background — `(unbound — no token in ANY theme)`.** Searched **by
  value** across `packages/themes/`: zero hits. Nearest is
  `--sl-elevation-surface-raised-sunken` (`#f6f8fa`), a 3/255 difference per channel. Token chosen
  over the raw hex; the 3-unit delta is recorded as a Stage 4 discrepancy rather than hardcoded.

### Size / Spacing

- `--sl-size-150` 12 · `--sl-size-200` 16 · `--sl-size-500` **40** · `--sl-size-600` 48 · `--sl-size-700` 56
  — **trap**: Figma's `Size/500` is likewise 40 here, but `b-nsp-home` (same file) recorded `Size/500 = 20`
  against a theme token of 40px. Resolve by value, never by name.
- `--sl-space-025` 2 · `--sl-space-050` 4 · `--sl-space-075` 6 · `--sl-space-100` 8 · `--sl-space-125` 10
  · `--sl-space-150` 12 · `--sl-space-200` 16 · `--sl-space-700` 56
- `--sl-space-new-2xs` 2 · `--sl-space-new-xs` 4 · `--sl-space-new-sm` 6 · `--sl-space-new-md` 8
- `--sl-size-borderRadius-default` 4 · `--sl-size-borderRadius-lg` 8 · `--sl-size-borderRadius-full` 800
- `--sl-size-borderWidth-none` 0 · `-subtle` 1 · `-default` 1 · `-action` 1
- `--sl-size-icon-font-xs` 12 · `-md` 16 · `-lg` 20 · `-3xl` 48

### Typography

Use **longhands only**. A `font:` shorthand built from these drops the whole declaration if any part is
`var(--undefined)`, and there is no `--sl-text-new-body-md` shorthand token in this theme.

- `--sl-text-new-body-md-fontSize` **14px** · `-lineHeight` **20px** · `-fontWeight` **400**
  (Figma `size/text-new/body/md` 14, `size/lineHeight/250` 20, `fontWeight/regular` 400 — exact match)
- `--sl-text-new-body-lg-fontSize` **16px** · `-lineHeight` **24px** · `-fontWeight` **400**
  (Figma `size/text-new/body/lg` 16, `size/lineHeight/300` 24 — exact match)
- Regular weight: `--sl-text-new-typeset-fontWeight-regular` → `--sl-fontWeight-400` → **400**. Figma
  `fontWeight/regular` = 400. **Match.**
- Semibold/medium weight: **a name-match that is a value mismatch.**
  `--sl-text-new-typeset-fontWeight-semiBold` → `--sl-brand-text-new-typeset-fontWeight-semiBold` →
  `--sl-fontWeight-600` → **600**, while Figma's `text-new/typeset/fontWeight/semiBold` = **500**.
  The identically-named token is the wrong weight. Resolved by value to **`--sl-fontWeight-500`**.
  This is the `--sl-size-500`-is-40-not-20 trap on the weight axis, and it is _more_ dangerous: a size
  trap shows up as a visible layout error, whereas a 600-instead-of-500 weight looks merely slightly
  heavy and would survive a visual review.
- `--sl-size-text-new-body-md` → `--sl-size-font-175` → `--sl-size-175` → **14px** (Figma 14). Match.
- `--sl-size-text-new-body-lg` → `--sl-size-font-200` → `--sl-size-200` → **16px** (Figma 16). Match.

**Font family — the theme cannot render this design's font, and the two token layers disagree:**

| Layer                                                       | Value                                            | Shipped by `fonts.css`? |
| ----------------------------------------------------------- | ------------------------------------------------ | ----------------------- |
| Figma design (`text-new/typeset/fontFamily/body`)           | `Roboto`                                         | —                       |
| `--sl-brand-text-new-*-fontFamily`                          | `Roboto` ✅ _matches_                            | **No**                  |
| `--sl-text-new-*-fontFamily` (semantic)                     | `'Open Sans'` ❌ _wrong_                         | **No**                  |
| `--sl-text-fontFamily` / `--sl-heading-fontFamily` (legacy) | `'New Message Text Condensed'` / `'New Message'` | **Yes**                 |

`packages/themes/sanoma-learning/fonts/` ships only `NewMessage-*` and `the_message-*` faces. So the
**brand** token names the design's font correctly and cannot load it, while the **semantic** token names
a third font that is both wrong and unloadable. Only the legacy namespace resolves to a real face, and
that face is not the design's. Typography fidelity is unmeasurable in this theme; **no font-family is
set by this run** and text renders in the browser's fallback. Recorded, not chased.

### Other

- `--sl-icon-typeset-fontFamily-classic` — `'Font Awesome 7 Pro'`; Figma
  `text-new/typeset/fontFamily/icon` is the same. Icon glyphs are supplied by the theme's inline SVG
  registry, not by this font.
- Figma `opacity/interactive/plain/idle` 0 · `opacity/interactive/bold/idle` 0

## Icons

The theme `sanoma-learning` registers **54** icons (`packages/themes/sanoma-learning/icons.ts`, keys
extracted with a pattern matching **both quoted and unquoted** keys — a prefix-only grep under-reports).

**Available and used:** `sort` (grid column sort indicator, supplied by `sl-grid-sort-column`),
`search` (supplied by `sl-search-field`), `chevron-down` (profile disclosure).

**Needed by the design and absent from the theme — omitted and recorded, never substituted or drawn:**

| Design element                       | CC snippet name           | Theme has it?                                                          | Resolution                    |
| ------------------------------------ | ------------------------- | ---------------------------------------------------------------------- | ----------------------------- |
| Class-code **copy** button           | `far-copy`                | **No**                                                                 | Button rendered, icon omitted |
| Class-code **share** button          | `far-share`               | **No**                                                                 | Button rendered, icon omitted |
| **Add students** button leading icon | `far-presentation-screen` | **No**                                                                 | Button rendered, icon omitted |
| Grid **footer** scroll-to-top arrow  | _(no snippet)_            | **No** (`arrow-up` is not registered; only `arrow-left`/`arrow-right`) | Omitted                       |

Note the namespace mismatch: Code Connect emits `far-*` names; the theme registers unprefixed keys.
Even the icons the theme _does_ have would fail if the snippet were pasted verbatim.

## Scale behaviour — what 10,936 nodes actually did to the pipeline

| Call                                              | Elapsed   | Result                                                    |
| ------------------------------------------------- | --------- | --------------------------------------------------------- |
| `get_metadata` root `2422:87039`                  | ~9 s      | **27 nodes.** Stops at instance boundaries                |
| `get_metadata` instance `2422:87040` (Navigation) | fast      | 23 nodes — one level of expansion                         |
| `get_metadata` instance `2422:87812` (grid)       | fast      | 23 row instances, each opaque                             |
| `get_variable_defs` root                          | fast      | 65 variables, deduplicated                                |
| `get_screenshot` root @1280                       | fast      | 45 KB PNG, full fidelity                                  |
| **`get_design_context` `2422:87812`**             | **~90 s** | **5.7 KB whose whole code body is `<sl-grid></sl-grid>`** |
| same, retried with `forceCode: true`              | ~60 s     | **Byte-identical** but for the ephemeral asset URL        |
| `get_design_context` on ONE header row            | fast      | **23,655 bytes** of plain `<div>` + `<img>` SVG refs      |
| `get_design_context` on ONE data row (`Row 01`)   | fast      | **41,280 bytes**, likewise plain divs, **no cell text**   |

**The pipeline does not break at this size. It silently succeeds with almost nothing.** The single call
covering ~91% of the design returned one empty element, because Code Connect resolution _is_ a
context-compression mechanism — and the better the mapping, the more it compresses.

Three things make this sharper than a simple truncation:

1. **It is not a size guard.** `forceCode: true` — the documented escape hatch for "output too large,
   returning metadata only" — produced a byte-identical payload. The collapse is **Code Connect
   substitution**, which `forceCode` cannot override. There is no flag that asks for the mapped
   subtree's detail.
2. **The alternative is a 233k-token expansion.** The header row expands to 23,655 bytes and a data
   row to 41,280; the grid's 23 rows would total ≈ **932 KB ≈ 233,000 tokens** — a **163×** inflation
   over the collapsed call, and more than a whole context window. So the two available behaviours are
   "one empty line" and "overflow the context", with nothing in between.
3. **Expanding loses the mapping.** The expanded header row contains **zero `<sl-*>` elements** — it is
   raw `<div>`s plus `<img>` references to exported SVG dividers and icon masks. Code Connect applies
   at the instance root or not at all. You can have authority or detail, never both.

**Only the expensive path yields the cell text.** The collapsed call has no content at all. The
expanded rows _do_ carry it — ten `<p>Text</p>` nodes in Row 01, four of them the visible cells — so
the content is recoverable, but only by paying the ~233k tokens and losing the Code Connect mapping in
the same move.

> **Correction, recorded deliberately.** The orchestrator first concluded the expanded rows contained
> _no_ cell text, from `grep '>Text<'` returning 0. That grep was wrong: the markup puts a newline and
> indentation between `>` and `Text`, so the pattern could not match. The worker subagent, reading the
> payload directly, contradicted the orchestrator and was right. This is the batch's
> "a namespace-scoped search manufactures phantom gaps" lesson in a second shape — **a _markup_-shaped
> search invents the same phantom** — and it was caught only because a second agent re-read the raw
> artifact instead of trusting the summary. The grid's columns, sort affordance, filter row, 40
> cells, footer and all geometry were reconstructed from `get_metadata` positions plus the **reference
> screenshot** — the only artifact in this run that preserved what the grid actually says.

## Cross-run collision

`b-nsp-home` is a **different frame of this same Figma file** (`sSrpLCZm302ces3khoBGls`) and decomposed
**the same `Navigation` component**, minting `sl-nsp-top-nav`. This run therefore prefixes every tag
with its case slug (`sl-a2-*`) so the guarded `customElements.define` cannot silently resolve to the
other run's element with incompatible attributes. The repository already shows the scar of this class of
bug: both `sl-kampus-left-toolbar` and `sl-a1-kampus-left-toolbar` are registered.

This is the **second** independent occurrence of one Figma component being implemented twice by two runs
of the same file — after A1 / B-Kampus `Notes panel`. It is a property of the pipeline, not of a file.

---

# Decomposition (Stage 2)

Framework **lit**, i18n **off**, output `examples/lit/src/_runs/a2-nsp-class-overview/`.
Every tag is prefixed `sl-a2-` so it cannot collide with `b-nsp-home`'s `sl-nsp-*` from the same file.

## Component tree — 6 new components, max depth 3

```
sl-a2-class-overview-page                    root, owns ALL data
├── sl-a2-global-nav          global-nav/          uses sl-search-field, sl-avatar, sl-icon
├── sl-a2-class-nav           class-nav/           uses none (label + <ul>)
├── sl-a2-class-code-card     class-code-card/     uses sl-button x2
└── sl-a2-students-panel      students-panel/      uses sl-button-bar x2, sl-button x2
    └── sl-a2-students-grid   students-panel/students-grid/   uses sl-grid, sl-grid-filter-column x4
```

Deliberately **not** components: the 10 rows / 40 cells (`sl-grid` renders them from `.items`), the nav
links (plain `<li>`), the footer row (one `<div>`), the profile cluster (avatar + chevron).

## Shared Types / Contracts

| Type                 | Exported by                 | Shape                                                                                          |
| -------------------- | --------------------------- | ---------------------------------------------------------------------------------------------- |
| `ClassOverviewModel` | `sl-a2-class-overview-page` | `{ classId, className, activeSection, classCode, students: StudentRow[], user: NavUserModel }` |
| `NavUserModel`       | `sl-a2-global-nav`          | `{ id: string; displayName: string; pictureUrl?: string }`                                     |
| `GlobalNavKey`       | `sl-a2-global-nav`          | `'home' \| 'calendar' \| 'method-catalogue' \| 'teaching-materials'`                           |
| `ClassNavModel`      | `sl-a2-class-nav`           | `{ className: string; activeSection: ClassSection }`                                           |
| `ClassSection`       | `sl-a2-class-nav`           | `'overview' \| 'method' \| 'lessons' \| 'participants'`                                        |
| `StudentsPanelModel` | `sl-a2-students-panel`      | `{ students: StudentRow[] }`                                                                   |
| `StudentRow`         | `sl-a2-students-grid`       | `{ id, column1, column2, column3, column4 }` — blueprint shape, see OQ1                        |

Events (one globally unique name + type alias each): `sl-a2-global-nav-search`,
`sl-a2-global-nav-navigate`, `sl-a2-global-nav-profile-toggle`, `sl-a2-class-nav-navigate`,
`sl-a2-class-code-copy`, `sl-a2-class-code-share`, `sl-a2-add-students`, `sl-a2-create-groups`,
`sl-a2-students-grid-row-activate`.

## Open questions — 32, every one with the default taken

Thirty-two is the joint-highest count in the batch — **and the other 32 is `b-nsp-home`, the sibling
frame of this same file.** Two frames of one file produced the identical count on screens differing
24× in node count, which is further evidence that question count tracks the _file's_ ambiguity rather
than the screen's size.

| #   | Question                                                                                | Default taken                                                                                                                                                               |
| --- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Model the data-free blueprint how?                                                      | Blueprint shape `column1..column4`; inventing domain fields would be invented truth                                                                                         |
| 2   | How many data rows — 10 rendered or 23 in metadata?                                     | **10**, matching the screenshot; the other 13 are `hidden="true"`                                                                                                           |
| 3   | Where does the fixture live?                                                            | `fixtures/class-overview.fixture.ts`, exported for stories, not in a barrel                                                                                                 |
| 4   | Does `sl-a2-students-grid` need to exist?                                               | Yes — it owns the grid+footer fusion `sl-grid` cannot express                                                                                                               |
| 5   | One app-shell wrapper or two sibling nav bars?                                          | Two siblings; their data diverges and a wrapper would only forward props                                                                                                    |
| 6   | Nav link lists: constants or properties?                                                | Constants inside each nav component (app chrome, not fetched data)                                                                                                          |
| 7   | What element/role is the footer row?                                                    | Plain non-semantic `<div>`; it is outside the table so it must not be a `row`                                                                                               |
| 8   | Footer scroll-to-top arrow (`arrow-up` unregistered)                                    | **Omit the affordance entirely** rather than ship a labelled invisible control                                                                                              |
| 9   | Copy/share buttons have no available glyph                                              | Render button + real `aria-label`, glyph omitted, footprint reserved. **Decomposer dissented**, preferring visible text labels; fidelity won, and the a11y cost is recorded |
| 10  | CC emits `aria-label="Button"`                                                          | **Rejected** — "Copy class code" / "Share class code"                                                                                                                       |
| 11  | `#f9fafb` unbound in every theme                                                        | `--sl-elevation-surface-raised-sunken` (Δ3/255), recorded; never hardcoded                                                                                                  |
| 12  | Page bg `#f0f2f5` has two co-valued tokens                                              | `--sl-color-palette-grey-100` — "disabled" is semantically false for a canvas                                                                                               |
| 13  | Font family (theme can load none of the three)                                          | **Set no `font-family`**; typography fidelity explicitly unmeasured                                                                                                         |
| 14  | Root fetches, or purely `model`-driven?                                                 | Both — a `model` property plus an internal fixture-backed `load()` seam                                                                                                     |
| 15  | Is global-nav search wired to anything?                                                 | No; uncontrolled, emits an event, no results surface exists in the design                                                                                                   |
| 16  | Does the profile chevron open a menu?                                                   | **Overridden** — decomposer proposed `aria-haspopup` with no popup, which is a lie to AT. Plain labelled button, no `aria-haspopup`/`aria-expanded`                         |
| 17  | Class-code card: scalar or one-field model?                                             | Scalar `code` — the only genuinely independent single value in the tree                                                                                                     |
| 18  | `.items` or `.dataSource`?                                                              | `.items` plain array, client-side sort/filter, no selection column (Figma's checkbox is hidden)                                                                             |
| 19  | Column widths                                                                           | `width="288"` ×4 = exactly 1152; no `grow`. Non-responsive by construction                                                                                                  |
| 20  | Are all four columns filterable?                                                        | Yes — `sl-grid-filter-column` ×4, which also supplies `sort` and the 2-row header                                                                                           |
| 21  | Filter placeholder is unreachable                                                       | Accept `Filter by text` instead of the design's `Placeholder`; recorded. Hand-rolling a header row was rejected as reimplementing an existing component                     |
| 22  | Figma variant says `Vertical dividers=false`, tokens say otherwise                      | Follow the **token table** — it was verified by resolved value against the screenshot; the variant name was not                                                             |
| 23  | CC snippet self-contradicts on fill (`bar fill="outline"` + `button variant="primary"`) | **Trust the screenshot**: solid primary "Add students"                                                                                                                      |
| 24  | Two stacked single-button button-bars is odd                                            | Reproduce as two bars — matches design and CC. Merging would be better component usage and the wrong pixels                                                                 |
| 25  | No `<h1>` on the page                                                                   | Keep `<h2>`, render no `<h1>`; the host app owns the page title                                                                                                             |
| 26  | Logo corner radius unmeasured                                                           | **Overridden by measurement** — corner profile scanned from the PNG gives ≈8px, so `--sl-size-borderRadius-lg`, not the proposed 4                                          |
| 27  | No token for the active-nav underline                                                   | Reuse `--sl-color-foreground-bold`; the one token used outside its documented role, nothing invented                                                                        |
| 28  | Where does `activeSection` come from?                                                   | Root property hardcoded to `'participants'`; no router in the example app                                                                                                   |
| 29  | Responsive behaviour                                                                    | Fixed 1280 layout, 48px gutters, no media queries                                                                                                                           |
| 30  | Grid row heights (48/48/40) may not be settable                                         | Try `::part()` from the wrapper; if no part is exposed, accept native heights and record the delta. **Never reach into the shadow root**                                    |
| 31  | Should the root render the nav, or the app shell?                                       | Root renders both bars — the 1280×1003 frame includes them                                                                                                                  |
| 32  | Promote either net-new primitive?                                                       | **Neither.** Both stay local styled elements. A grid footer is a feature request against `sl-grid`, not a new element in an example app                                     |

---

# Validation (Stage 4) — measured, not impressionistic

Captured with `runs/harness/shoot.mjs` under the derived theme `sanoma-learning` at 1280×1003.
**All 20 stories returned `verdict: rendered`**, `notUpgraded: []`, `consoleErrors: []`,
`failedRequests: []`. No `<img>` 404s — the run exports no image assets at all.

Whole-page pixel comparison against `screenshot.png`:

| Metric                             | Value      |
| ---------------------------------- | ---------- |
| Pixels within 24/255 of the design | **96.46%** |
| Pixels within 96/255               | 98.77%     |

| Band                  | Rows | % differing | Why                                              |
| --------------------- | ---: | ----------: | ------------------------------------------------ |
| class-code card       |  116 |   **0.74%** | —                                                |
| panel heading+buttons |  187 |       1.04% | —                                                |
| page foot             |   60 |       1.49% | —                                                |
| grid rows             |  400 |       3.92% | header-weight bleed, label metrics               |
| class nav             |   48 |       4.13% | Δ3 surface colour + accumulated label drift      |
| global nav            |   56 |       5.71% | accumulated label drift, initials vs photo       |
| footer                |   40 |       7.44% | missing `arrow-up` affordance                    |
| grid header+filter    |   96 |   **8.28%** | "Filter by text" vs "Placeholder"; header weight |

The two worst bands are both **text the public API cannot change**, not layout error.

## Element geometry — built vs design

| Element                  | Design     | Built      | Δ   |
| ------------------------ | ---------- | ---------- | --- |
| global nav               | 1280 × 56  | 1280 × 56  | 0   |
| class nav                | 1280 × 48  | 1280 × 48  | 0   |
| class-code card          | 350 × 91   | 350 × 91   | 0   |
| students panel           | 1184 × 728 | 1184 × 730 | +2  |
| page body height         | 1003       | 1003       | 0   |
| grid header / filter row | 48 / 48    | 48 / 48    | 0   |
| grid data row            | 40         | 40         | 0   |

Nav label start positions after repair, design → built: logo +0, then +1, +3, +8, +12 across the
global bar and +0, +3, +7, +8, +10 across the class bar. The drift is **monotonic and cumulative**,
which is the signature of text metrics rather than a spacing bug: each label renders 2–4px wider in
the fallback face and pushes its successor right. Chasing it would mean hand-tuning gaps to
compensate for a font the theme fails to load — the fidelity score would improve and the code would
get worse. Left alone, recorded here.

## Three repairs, one iteration

1. **The class nav sat 56px too far left.** Figma's `Frame 37` starts at x=8, but its text node is
   offset **56px inside it** — a lead-in slot that renders nothing in this frame. The implementer
   measured the frame and ignored the inner offset. Every element in the bar inherited the error
   (−56 to −79px). Fixed with `padding-inline-start: var(--sl-size-800)`.
   **Generalisable:** a frame's own x is not where its content starts, and `get_metadata` reports
   both — the inner one is easy to skip.
2. **Both navs used 32px/24px link gaps** copied from the sibling `b-nsp-home` run. The measured
   boxes show a uniform **12px gap with ~13px per-link padding**. Residual drift fell from −79px to
   +12px. **Reusing a sibling run's proven CSS imported its measurements too.**
3. **"Class code" wrapped onto two lines** because `inline-size: 79px` pinned Figma's _measured_
   auto-size; the wider fallback face overflowed it. Changed to `min-inline-size`.

## The defect the harness existed to catch

`global-nav` and `class-nav` both returned **`nothing-rendered`** with `inGlobalRegistry: false` —
even though both story files carried the correct bare side-effect import on its own line.

The stories were not the problem. **Neither component module contained a `customElements.define`
call at all.** The class was written, the tag added to `HTMLElementTagNameMap`, the styles imported,
the story import correct — and nothing ever registered the element.

This is a **third** distinct route to `nothing-rendered` in this batch, after the `type`-only import
and the value import used only in a type position. Hint 4 governs the _story_ side and guarantees the
module **executes**; nothing checks that the module, having executed, **registers** anything, and
`tsc` is clean either way. All three variants would be caught by one static check:

```sh
grep -L 'customElements.define' <each component>.ts
```
