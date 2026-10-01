# Design Manifest — Metadata usage widget

## Overview

Figma file **Editorial Suite designs** (`S5QgDy8X9eqhvECPANSZMM`), top-level node **"Metadata usage widget"** (`17214:103584`), a **1440 × 2032 px** desktop frame. It is the ETSL / Editorial Suite _Functional management → Dashboard_ screen: a full page built from six independently-removable dashboard widget cards — Assets (a grid of asset-type tiles), Content items (two columns of labelled determinate progress bars), Descriptive metadata / Product IDs (detail cards plus three primary action buttons), Recently edited, Metadata Usage (three stat tiles above a metadata-usage table), Recently published, and Reused content (a tabbed table) — laid out on a 1200 px content column inside dark app chrome and a 7-tab page header.

## Existing SLDS Components Used

> **Sourcing caveat — read this first.** `get_code_connect_map` on `17214:103584` returned an empty object `{}`. That was a _successful_ response, not a transient error. But `get_design_context` on the same subtree **did** return `<CodeConnectSnippet>` wrappers and Figma component descriptions with `sanomalearning.design` doc links. The map tool simply did not surface the file's mappings at the root node. This table is therefore sourced from the `get_design_context` CodeConnectSnippet blocks, the returned component descriptions, and `sl-*` node names — per the analyst Code-Connect heuristic. Full detail in `figma-code-connect-map.NOTE.md`.

| Node ID                                                                                                                                                                                        | Node Name                                    | Mapped Component | CC Snippet (excerpt)                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------- |
| `17214:104002`, `17214:104003`                                                                                                                                                                 | td-text-start › sl-badge                     | `<sl-badge>`     | `<sl-badge color="orange" size="lg">Unused</sl-badge>`                                        |
| `17214:104037`, `23759:157574`                                                                                                                                                                 | td-text-start › sl-badge                     | `<sl-badge>`     | `<sl-badge color="green" size="lg"><sl-icon name="fas-backpack"></sl-icon>Success</sl-badge>` |
| `17214:104039`                                                                                                                                                                                 | td-text-start › sl-badge                     | `<sl-badge>`     | `<sl-badge color="red" size="lg"><sl-icon name="fas-backpack"></sl-icon>Failure</sl-badge>`   |
| `I17214:103977;17193:64938`                                                                                                                                                                    | sl-icon (Used tile)                          | `<sl-icon>`      | `<SlIcon ↕️Size="16160:33988" />` — parametric/no-template form                               |
| `I17214:103978;17193:64984`                                                                                                                                                                    | sl-icon (Unused tile)                        | `<sl-icon>`      | `<SlIcon ↕️Size="16160:33988" />` — parametric/no-template form                               |
| `17214:103609`, `17214:103616`, `17214:103624`, `17214:103631`, `17214:103639`, `17214:103654`, `17214:103711`                                                                                 | sl-icon                                      | `<sl-icon>`      | _(identified — `sl-*` node name; description 11872:25670 resolves to the SLDS Icon docs)_     |
| `I17214:103585;23066:86145;6539:37591`                                                                                                                                                         | sl-icon (top bar "Projects")                 | `<sl-icon>`      | _(identified — `sl-*` node name; description 10035:248424)_                                   |
| `I17214:103585;25806:56903`                                                                                                                                                                    | sl-avatar                                    | `<sl-avatar>`    | _(identified — `sl-*` node name; description 25192:26099, SLDS Avatar docs)_                  |
| `17214:103603`                                                                                                                                                                                 | sl-button ("4 asset requests")               | `<sl-button>`    | _(identified — `sl-*` node name; description 9670:4424)_                                      |
| `17214:103612`, `17214:103619`, `17214:103627`, `17214:103634`, `17214:103642`, `17214:103649`, `17214:103657`, `17214:103665`, `17214:103691`, `17214:103706`, `17214:103714`, `17214:103721` | sl-button ("See all", link variant)          | `<sl-button>`    | _(identified — `sl-*` node name; fill=`#066`, active=`#003d3d`, underline)_                   |
| `17214:103883`                                                                                                                                                                                 | sl-button-theme ("Add widget")               | `<sl-button>`    | _(identified — wraps an internal `button` node; solid/filled, icon `plus`)_                   |
| `17214:103886`, `17214:103889`                                                                                                                                                                 | button ("Outline editor", "Advanced search") | `<sl-button>`    | _(identified — peer of `17214:103883`; outline variant, start + end icons)_                   |
| `17214:103912`                                                                                                                                                                                 | sl-button (Product IDs close)                | `<sl-button>`    | _(identified — `sl-*` node name; ghost, icon-only, `close` 16 px)_                            |
| `17214:103934`, `17214:103973`, `17214:104016`, `17214:104051`                                                                                                                                 | sl-button-theme ("Remove widget")            | `<sl-button>`    | _(identified — peer instances; ghost, icon `close` + label)_                                  |
| `17214:103969`                                                                                                                                                                                 | sl-button (table footer)                     | `<sl-button>`    | _(identified — `sl-*` node name)_                                                             |

### Unmapped Figma components — recorded as discrepancies, not blockers

| Node ID(s)                                                     | Node Name                               | Figma description                                                                        | Likely existing counterpart                                  |
| -------------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `17214:103592`, `17214:104052`                                 | `tabbar-horizontal`                     | none                                                                                     | `packages/components/tabs` (`sl-tab-group` / `sl-tab`)       |
| `17214:103938` … `17214:104088` (≈60 nodes)                    | `th-text-start` / `td-text-start`       | docs link → **vuetifyjs.com/en/components/data-tables** (a Vuetify table cell, not SLDS) | `packages/components/grid` (`sl-grid`)                       |
| `17214:103968`, `17214:104011`, `17214:104047`, `17214:104089` | `mat-data-footer` (all `hidden="true"`) | none                                                                                     | `packages/components/paginator`                              |
| `17214:103728` and the 24 sibling `bar` frames                 | `bar`                                   | none                                                                                     | `packages/components/progress-bar` (`sl-progress-bar`)       |
| `17214:103585`                                                 | `top nav bar`                           | none                                                                                     | app-shell chrome; its _contents_ are `sl-icon` + `sl-avatar` |
| `17214:103611` and 11 peers                                    | `label + num`                           | none                                                                                     | plain text pair — no component needed                        |

## Composition Candidates

- **Dashboard widget card** — `17214:103890`, `17214:103909`, `17214:103931`, `17214:103970`, `17214:104013`, `17214:104048`. Six instances of one shell: `rounded-[4px]`, white body, a `v-card__title` header strip (`bg #f4f5fa`, `pl-16 pr-8 py-10`, Raleway Bold 16/24) with an optional trailing action slot, and a body slot. Repeats identically across the page — the single highest-value composition here.
- **Widget header + "Remove widget" action** — `17214:103932`+`17214:103934`, `17214:103971`+`17214:103973`, `17214:104014`+`17214:104016`, `17214:104049`+`17214:104051`. Four identical occurrences, a natural sub-slot of the widget card.
- **Asset type tile** — `17214:103606` and its 11 peers. 117 × 104 bordered tile = logo/`sl-icon` slot + "Name (n)" label + "See all" link `sl-button`. Repeats 12× in a 2-column grid.
- **Stat tile** — `17214:103976`, `17214:103977`, `17214:103978`. Big Raleway Bold 24/34 number over an optional `sl-icon` + caption row, in a semantically coloured bordered box (neutral / green / orange).
- **Labelled determinate bar** — `17214:103728` plus the 24 sibling `bar` frames under `17214:103727` / `17214:103801`. A "Label (n)" caption over a 6 px track+indicator. Repeats 25× across two columns.
- **Metadata detail row** — `17214:103894`, `17214:103899`, `17214:103904` (six `v-card-text` rows). A SemiBold label followed by a Regular value on one line, 14/20 `#3d4047`.
- **Page header** — `17214:103586` (H1 `17214:103590` + tab bar `17214:103592`). Title band and tab strip share one `#f4f5fa` surface with a single bottom border.
- **App top bar** — `17214:103585`. Dark `#02242e` chrome: wordmark image, a "Projects" `sl-icon` + chevron control, and `sl-avatar`.

## Net-New Primitive Candidates

- **`17214:103976` / `17214:103977` / `17214:103978` — "asset card" (stat tile)** — no CC mapping, and no component in `packages/components/` renders a large numeric metric with a semantic coloured surface + border + caption. Closest neighbours are `callout` and `inline-message`, which are message-shaped, not metric-shaped. **Rough shape: indicator / metric display.** The Used tile's fill is a _stacked_ gradient (`linear-gradient(90deg, rgba(255,255,255,0.5)…), linear-gradient(90deg, rgb(211,248,222)…)`) rather than a flat token.
- **`17214:103606` — "asset card" (asset type tile)** — no CC mapping. Distinct from the stat tile despite sharing the Figma name. Composable from `sl-icon` + text + a link-variant `sl-button` inside a bordered box, so a **weak** net-new candidate; prefer composition. **Rough shape: card/tile.**

## Responsive Breakpoints

- **1440 px** — the only frame in this node. Content is centred in a fixed 1200 px column with 120 px side gutters; widgets inside it use `flex-1` / `min-w-px`.

_Single breakpoint: 1440px._

## Designer Annotations

_None._ No annotation, comment, or spec layer is present anywhere in the 698-node metadata tree.

## Token Reference

### Color

| Figma bound variable                                                                 | Value              | `editorial-suite` token                      | Note                                                                                                                    |
| ------------------------------------------------------------------------------------ | ------------------ | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `surface` / `background`                                                             | `#ffffff`          | `--sl-color-palette-grey-000`                | exact                                                                                                                   |
| `color/palette/neutral/50`                                                           | `#F4F5FA`          | `--sl-color-palette-grey-050`                | exact                                                                                                                   |
| `color/palette/neutral/100`                                                          | `#ECECF1`          | `--sl-color-palette-grey-100`                | exact                                                                                                                   |
| `color/palette/neutral/200`                                                          | `#D8D8DD`          | `--sl-color-palette-grey-200`                | exact                                                                                                                   |
| `color/palette/neutral/300` · `color/tab/default/border` · `color/tab/tabbar/border` | `#C8C8CF`          | `--sl-color-palette-grey-300`                | exact                                                                                                                   |
| `color/palette/neutral/400`                                                          | `#AFB6C5`          | `--sl-color-palette-grey-400`                | exact                                                                                                                   |
| `color/button/primary/link/disabled/foreground`                                      | `#9198A7`          | `--sl-color-palette-grey-500`                | exact                                                                                                                   |
| `color/palette/neutral/700` · `color/button/default/ghost/idle/foreground`           | `#585C61`          | `--sl-color-palette-grey-700`                | exact                                                                                                                   |
| `color/palette/neutral/800`                                                          | `#3D4047`          | `--sl-color-palette-grey-800`                | exact                                                                                                                   |
| `color/palette/neutral/900`                                                          | `#1D1F20`          | `--sl-color-palette-grey-900`                | exact                                                                                                                   |
| `color/tab/default/indicator`                                                        | `#4589BE`          | `--sl-color-palette-blue-500`                | exact                                                                                                                   |
| `color/palette/danger/600` · `color/button/danger/link/idle/foreground`              | `#9D2B36`          | `--sl-color-palette-red-600`                 | exact                                                                                                                   |
| `color/palette/success/400`                                                          | `#149C4B`          | `--sl-color-palette-green-400`               | exact                                                                                                                   |
| `color/palette/orange/100`                                                           | `#fff0d4`          | `--sl-color-palette-orange-100`              | exact                                                                                                                   |
| `color/palette/orange/500`                                                           | `#ef6707`          | `--sl-color-palette-orange-500`              | exact                                                                                                                   |
| `color/palette/orange/600`                                                           | `#c64c08`          | `--sl-color-palette-orange-600`              | exact                                                                                                                   |
| `color/foreground/accent/orange/bold`                                                | `#7e3410`          | `--sl-color-foreground-accent-orange-bold`   | exact                                                                                                                   |
| `color/foreground/accent/green/bold`                                                 | `#0b5a34`          | `--sl-color-foreground-accent-green-bold`    | name matches 1:1; ETSL resolves to green-800 (different hex)                                                            |
| `color/foreground/accent/red/bold`                                                   | `#84181b`          | `--sl-color-foreground-accent-red-bold`      | name matches 1:1; ETSL resolves to red-800 (different hex)                                                              |
| `color/background/accent/orange/subtle`                                              | `#fe821133`        | `--sl-color-background-accent-orange-subtle` | exact                                                                                                                   |
| `color/background/accent/green/subtle`                                               | `#1aaf6033`        | `--sl-color-background-accent-green-subtle`  | name matches; ETSL value `#149c4b33`                                                                                    |
| `color/background/accent/red/subtle`                                                 | `#f83b4133`        | `--sl-color-background-accent-red-subtle`    | name matches; ETSL value `#ed415133`                                                                                    |
| `color/background/primary/bold`                                                      | `#3366ff`          | `--sl-color-background-primary-bold`         | name matches; ETSL resolves to its own brand primary                                                                    |
| `color/foreground/primary/onBold`                                                    | `#ffffff`          | `--sl-color-foreground-primary-onBold`       | exact name, **camelCase `onBold`**                                                                                      |
| `color/palette/primary/500` + all `color/button/primary/*`                           | `#006666`          | —                                            | **(unbound — needs a token)** grepped all of `packages/themes/`: zero hits. ETSL brand teal, every primary button/link. |
| `color/button/primary/link/active/foreground`                                        | `#003D3D`          | —                                            | **(unbound — needs a token)** zero hits                                                                                 |
| `color/palette/black/base` · `Dark blue` · `color/tab/default/foreground`            | `#02242E`          | —                                            | **(unbound — needs a token)** zero hits. App top bar, H1, tab labels.                                                   |
| `color/palette/warning/600`                                                          | `#CA6F2A`          | —                                            | **(unbound — needs a token)** zero hits. Fill of all 25 Content-items progress indicators.                              |
| `color/palette/green/500`                                                            | `#0d8e4c`          | —                                            | **(unbound in editorial-suite)** only in `sanoma-learning`. "2409 Used" figure.                                         |
| `color/palette/green/100`                                                            | `#d3f8de`          | —                                            | **(unbound in editorial-suite)** only in `sanoma-learning`. Used tile gradient.                                         |
| `color/palette/grey/900`                                                             | `#222222`          | —                                            | **(unbound)** ETSL `--sl-color-palette-grey-900` is `#1d1f20`                                                           |
| `color/button/*/idle/background` · `black/0.87`                                      | `#000000`          | —                                            | sentinel/transparent values, not real colour tokens                                                                     |
| — (raw)                                                                              | `rgba(0,0,0,0.12)` | —                                            | **(unbound — needs a token)** table row divider `box-shadow: inset 0 -1px 0`                                            |

### Size / Spacing

| Figma bound variable         | Value                                                            | `editorial-suite` token                | Note                                                |
| ---------------------------- | ---------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------- |
| `space/050`                  | `4`                                                              | `--sl-space-050`                       | → 4px                                               |
| `space/100` · `space-new/md` | `8`                                                              | `--sl-space-100` / `--sl-space-new-md` | → 8px                                               |
| `size/150`                   | `12`                                                             | `--sl-size-150`                        | exact                                               |
| `size/200`                   | `16`                                                             | `--sl-size-200`                        | exact                                               |
| `size/300`                   | `24`                                                             | `--sl-size-300`                        | exact                                               |
| `size/font/175`              | `14`                                                             | `--sl-size-font-175`                   | → 14px                                              |
| `size/icon/font/md`          | `16`                                                             | `--sl-size-icon-font-md`               | exact                                               |
| `size/icon/font/xs`          | `12`                                                             | `--sl-size-icon-font-xs`               | exact                                               |
| `size/lineHeight/250`        | `20`                                                             | —                                      | **(unbound)** no `--sl-size-lineHeight-*` namespace |
| `size/borderRadius/full`     | `800`                                                            | `--sl-size-borderRadius-full`          | → 50rem                                             |
| — (raw)                      | `4px` radius on every widget/card/tile                           | `--sl-size-borderRadius-md`            | → 4px                                               |
| — (raw)                      | `120px` gutter, `1200px` column, `588px` / `282px` widget widths | —                                      | **(unbound)** layout dimensions                     |

### Typography

**Critical.** In `packages/themes/editorial-suite/theme.css` the `--sl-text-new-*` namespace ships **longhands only**; there is no bare `--sl-text-new-body-md`. `--sl-text-new-heading-*` has **no `-fontWeight` longhand at all**. `font: var(--sl-text-new-body-md)` resolves to nothing and silently drops the whole declaration.

| Figma bound variable                   | Value                               | Form(s) that exist in `editorial-suite/theme.css`                                                                                                                                                      |
| -------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `text-new/typeset/fontFamily/body`     | `Roboto`                            | `--sl-text-new-typeset-fontFamily-body` — **public value is `'Open Sans'`**. Roboto lives at `--sl-brand-text-new-typeset-fontFamily-body`, or legacy `--sl-text-fontFamily: Roboto`.                  |
| `text-new/typeset/fontFamily/heading`  | `Roboto` _(design renders Raleway)_ | `--sl-text-new-typeset-fontFamily-heading` — public value `'Open Sans'`. Raleway at `--sl-brand-text-new-typeset-fontFamily-heading`, or legacy `--sl-heading-fontFamily` / `--sl-display-fontFamily`. |
| `text-new/typeset/fontFamily/icon`     | `Font Awesome 6 Pro`                | `--sl-text-new-typeset-fontFamily-icon` — theme value `'Font Awesome 7 Pro'` (**version mismatch**)                                                                                                    |
| `text-new/typeset/fontWeight/regular`  | `400`                               | `--sl-text-new-typeset-fontWeight-regular` ✓                                                                                                                                                           |
| `text-new/typeset/fontWeight/semiBold` | `500`                               | `--sl-text-new-typeset-fontWeight-semiBold` ✓                                                                                                                                                          |
| `size/text-new/body/md`                | `14`                                | `--sl-text-new-body-md-fontSize: 14px` ✓ (longhand only)                                                                                                                                               |
| `size/text-new/heading/sm`             | `14`                                | `--sl-text-new-heading-sm-fontSize: 14px` ✓ (longhand only)                                                                                                                                            |
| `Body/md/regular`                      | Roboto 400 14/20                    | **longhands only**: `--sl-text-new-body-md-fontFamily`, `-fontSize`, `-fontWeight`, `-lineHeight`                                                                                                      |
| `v-text/body-2`                        | Roboto Regular 14/20, ls 0.25       | body-md longhands; **0.25px letter-spacing unbound**                                                                                                                                                   |
| `text/body/md/demibold`                | Roboto SemiBold 14/20 w600          | size + line-height exist; **weight 600 not reachable** via `semiBold` (=500) — use `--sl-fontWeight-600`                                                                                               |
| `text/body/lg/demibold`                | Roboto SemiBold 16/24 w600          | `--sl-text-new-body-lg-fontSize: 16px`, `-lineHeight: 24px`, `-fontWeight: 400` (**not 600**); `0.4px` letter-spacing unbound                                                                          |
| `text/heading/1`                       | Raleway Bold 28/38 w700 ls -1       | **no matching size.** Nearest `--sl-text-new-heading-xl-*`; family from `--sl-heading-fontFamily`; weight `--sl-fontWeight-bold`. `-fontWeight` longhand **does not exist** in the heading namespace.  |
| `text/heading/2`                       | Raleway Medium 24/34 w500           | `--sl-text-new-heading-lg-fontSize: 24px` ✓, `-lineHeight` is `32px` not 34. Weight `--sl-fontWeight-500`. Stat-tile numbers.                                                                          |
| `text/heading/3`                       | Raleway Bold 16/24 w700             | `--sl-text-new-heading-md-fontSize: 16px` ✓, `-lineHeight` is `20px` not 24. Weight `--sl-fontWeight-bold`. Widget card titles.                                                                        |
| `tab/subtitle`                         | Roboto Regular 14/20                | body-md longhands all match ✓                                                                                                                                                                          |
| `icon/typeset/fontWeight/solid`        | `Solid`                             | `--sl-text-new-icon-solid-*` ✓                                                                                                                                                                         |

### Other

| Figma bound variable | Value                                                                                                                 | Note                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `dashboard widgets`  | two-layer drop shadow `#3232470F 0 8 16` + `#32324714 0 2 4`                                                          | **(unbound — needs a token)**; nearest is `--sl-elevation-shadow-overlay` |
| — (raw)              | `drop-shadow(0 2px 2px rgba(50,50,71,.08)) drop-shadow(0 8px 8px rgba(50,50,71,.06))` on the three right-rail buttons | **(unbound — needs a token)**                                             |

### Icons — theme registry gap

`packages/themes/editorial-suite/icons.ts` registers **54** icons. The implementation may only use these.

**Available and usable:** `arrow-right`, `chevron-down`, `plus`, `xmark` (for the design's `close`), `search`, `circle-check-solid` (Used tile), `triangle-exclamation-solid` (Unused tile).

**No counterpart in the theme registry — must be LEFT OUT and recorded as a Stage 4 discrepancy:**

- Asset-type glyphs: `file`, `image`, `volume` (Audio), `play` (Video), `signal-stream` (Streaming)
- Action glyphs: `edit` / `pen-to-square` (Outline editor), `magnifying-glass-plus` (Advanced search — only generic `search` exists), `book-circle-arrow-up` (top bar Projects control)
- `fas-backpack` — named in the returned `sl-badge` Code Connect snippets for both Success and Failure badges, not registered, and **does not match the screenshot** (which shows a check and an exclamation). Code Connect placeholder data — a valid mapping pointing at the wrong glyph.
- Third-party brand marks rendered as vectors/images with no registry entry: Explorit, Three Ships, YouTube, GeoGebra, SOWISO, MathType, ChemType. Static assets, not `sl-icon` names.

---

# Decomposition (Stage 2)

Framework **lit** · i18n **off** · theme **editorial-suite**
Output base: `examples/lit/src/_runs/a5-etsl-metadata-usage-widget/`

**1 root + 7 children = 8 components.** Four of the manifest's eight composition candidates
were deliberately NOT promoted to components (asset tile, stat tile, labelled bar, metadata
detail row) — 47 element instances rendered as `<li>` / `<dt>`+`<dd>` per the list rule in
`component-conventions.md`.

## Tree

```
<sl-etsl-dashboard-page>                       (root, registers globally)
  ├── uses: <sl-panel>, <sl-button>, <sl-icon>
  └── children (class export only, no customElements.define):
      ├── <sl-etsl-app-header>                 uses sl-avatar, sl-icon, sl-tab-group, sl-tab
      ├── <sl-etsl-assets-widget>              uses sl-button
      ├── <sl-etsl-content-items-widget>       plain CSS bars
      ├── <sl-etsl-recently-edited-widget>     plain <table> + <a>
      ├── <sl-etsl-metadata-usage-widget>      uses sl-icon, sl-badge
      ├── <sl-etsl-recently-published-widget>  uses sl-badge, sl-icon
      └── <sl-etsl-reused-content-widget>      uses sl-tab-group, sl-tab

  rendered inline in the root (NOT components):
      dark app top bar chrome (inside app-header) · 3 right-rail buttons ·
      "Descriptive metadata" <dl> of 6 rows · "Product IDs" 2-column link list ·
      all 8 <sl-panel> widget shells + headings + Remove-widget buttons
```

## Dependency levels

| Level                | Components                                                                                                                                                                                                                                                            |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0** (all parallel) | app-header, assets-widget, content-items-widget, recently-edited-widget, metadata-usage-widget, recently-published-widget, reused-content-widget. Each exports its own model interface + its own `*.mock.ts` fixture + its own story. No child imports another child. |
| **1**                | `etsl-dashboard-page.ts` + `mock-data.ts` + `etsl-dashboard-page.stories.ts`. Imports all 7 classes, 7 interfaces, 7 fixtures; declares them in `scopedElements`; the only `customElements.define`.                                                                   |

## Shared Types / Contracts — implement verbatim

```ts
// app-header/etsl-app-header.ts
export type EtslNavTabId =
  | 'dashboard'
  | 'publications'
  | 'export'
  | 'asset-request'
  | 'metadata-imports'
  | 'metadata-exports'
  | 'connected-outlines';
export interface AppHeaderModel {
  pageTitle: string;
  projectName: string;
  user: { displayName: string; initials: string };
}
export type SlEtslNavTabSelectEvent = CustomEvent<EtslNavTabId>;

// assets-widget/etsl-assets-widget.ts
export type AssetTypeId =
  | 'document'
  | 'picture'
  | 'audio'
  | 'video'
  | 'streaming'
  | 'explorit'
  | 'three-ships'
  | 'youtube'
  | 'geogebra'
  | 'sowiso'
  | 'mathtype'
  | 'chemtype';
export interface AssetTypeCount {
  id: AssetTypeId;
  label: string;
  count: number;
}
export interface AssetsWidgetModel {
  types: AssetTypeCount[];
} // length 12
export type SlEtslAssetTypeSelectEvent = CustomEvent<AssetTypeId>;

// content-items-widget/etsl-content-items-widget.ts
export interface ContentItemMetric {
  label: string;
  count: number;
  percent: number;
}
export interface ContentItemsWidgetModel {
  metrics: ContentItemMetric[];
} // length 26
export type SlEtslContentItemSelectEvent = CustomEvent<string>;

// recently-edited-widget/etsl-recently-edited-widget.ts
export type OutlinePart = 'content-item' | 'section';
export interface RecentlyEditedEntry {
  id: string;
  title: string;
  outlinePart: OutlinePart;
  editedAt: string;
}
export interface RecentlyEditedWidgetModel {
  entries: RecentlyEditedEntry[];
} // length 6
export type SlEtslRecentlyEditedSelectEvent = CustomEvent<string>;

// metadata-usage-widget/etsl-metadata-usage-widget.ts
export interface MetadataUsageTotals {
  total: number;
  used: number;
  unused: number;
}
export interface MetadataUsageEntry {
  id: string;
  category: string;
  field: string;
  usage: number | null; // null -> 'Unused' badge
}
export interface MetadataUsageWidgetModel {
  totals: MetadataUsageTotals;
  entries: MetadataUsageEntry[]; // length 6
}

// recently-published-widget/etsl-recently-published-widget.ts
export type PublicationStatus = 'success' | 'failure';
export interface PublicationEntry {
  id: string;
  name: string;
  environment: string;
  publishedAt: string;
  status: PublicationStatus;
}
export interface RecentlyPublishedWidgetModel {
  publications: PublicationEntry[];
} // length 3

// reused-content-widget/etsl-reused-content-widget.ts
export type ReusedContentTabId = 'source-items' | 'linked-items';
export interface ReusedOutlineEntry {
  id: string;
  outlineName: string;
  projectName: string;
  linkedItemCount: number;
}
export interface ReusedContentWidgetModel {
  sourceItems: ReusedOutlineEntry[]; // length 5
  linkedItems: ReusedOutlineEntry[]; // [] — see OQ6
}
export type SlEtslReusedOutlineSelectEvent = CustomEvent<string>;

// etsl-dashboard-page.ts (root)
export type EtslWidgetId =
  | 'assets'
  | 'content-items'
  | 'descriptive-metadata'
  | 'product-ids'
  | 'recently-edited'
  | 'metadata-usage'
  | 'recently-published'
  | 'reused-content';
export interface DescriptiveMetadata {
  created: string;
  author: string;
  lastUpdated: string; // '6-11-20244' — design typo, keep
  lastUpdatedBy: string;
  outlineTemplateLastUpdated: string;
  language: string;
}
export interface EtslDashboardData {
  header: AppHeaderModel;
  assetsTotal: number; // 39
  assetRequestCount: number; // 4
  assets: AssetsWidgetModel;
  contentItemsTotal: number; // 164
  contentItems: ContentItemsWidgetModel;
  descriptiveMetadata: DescriptiveMetadata;
  productIds: string[]; // six '5678976'
  recentlyEdited: RecentlyEditedWidgetModel;
  metadataUsage: MetadataUsageWidgetModel;
  recentlyPublished: RecentlyPublishedWidgetModel;
  reusedContent: ReusedContentWidgetModel;
}
```

Five globally declared events, all namespaced, no collisions:
`sl-etsl-nav-tab-select`, `sl-etsl-asset-type-select`, `sl-etsl-content-item-select`,
`sl-etsl-recently-edited-select`, `sl-etsl-reused-outline-select`.
`sl-tab-group` already declares `sl-tab-change` in `GlobalEventHandlersEventMap` — do not re-declare.

## Open questions and the default chosen (all 16 accepted as recommended)

| #   | Question                                                                                             | Default chosen                                                                                                                                                                                                                                                                                                                                                                                                      |
| --- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ETSL brand teal `#006666` + 7 other values unbound in the theme; conventions forbid hardcoded hex    | Run-local palette declared once on the root's `:host` (`--etsl-color-*`), each with an "unbound" comment; inherits to all children. Recorded as 8 token discrepancies. (Orchestrator confirmed by grep: genuinely zero hits in `packages/themes/`.)                                                                                                                                                                 |
| 2   | Use `sl-progress-bar` for the 26 bars?                                                               | **No.** Three blockers: assertive `announce()` ×26 on first render; indicator colour only reachable via private `--_fill-color`; and `progress-bar.css:66` uses `font: var(--sl-text-new-heading-sm)` — a BARE token absent in editorial-suite, so its label typography silently drops. Hand-roll track+indicator with full `role="progressbar"` ARIA. The `sl-progress-bar` bare-token bug is reported regardless. |
| 3   | `sl-grid` vs plain `<table>` for the 4 tables                                                        | Plain semantic `<table>`; columns as a component-internal constant. `sl-paginator` not used — all 4 `mat-data-footer` nodes are `hidden="true"`.                                                                                                                                                                                                                                                                    |
| 4   | 7-tab page strip: navigation, or tab group with lazy panels?                                         | Navigation. `sl-tab-group` with `<sl-tab>` only, **no `<sl-tab-panel>`**; emits `sl-etsl-nav-tab-select`; root renders dashboard content unconditionally. No 7 panel components.                                                                                                                                                                                                                                    |
| 5   | Success/Failure badge icons — CC says `fas-backpack` for both                                        | Placeholder mapping data, unregistered, and contradicts the screenshot. Render `circle-check-solid` / `triangle-exclamation-solid` (both registered, both match the render); record `fas-backpack` as a bad Code Connect mapping.                                                                                                                                                                                   |
| 6   | "Outlines with linked items" tab has no design content                                               | `linkedItems: []` + an empty-state row when that tab is active. Default story shows tab 1, so the diff is unaffected.                                                                                                                                                                                                                                                                                               |
| 7   | Dates: pre-formatted strings or `Date` + formatter?                                                  | Pre-formatted `string` (`dd-mm-yyyy at HH:mm`, which no `Intl` locale produces). Documented exception to "no presentation in the model"; avoids a shared util two level-0 agents would both depend on.                                                                                                                                                                                                              |
| 8   | "Recently edited" footer `sl-button` `17214:103969` is in the tree but not in the render             | Omit; record as a discrepancy.                                                                                                                                                                                                                                                                                                                                                                                      |
| 9   | Bar lengths are hand-set, not a function of count (count 9 → 30/30/31px; count 40 → 79px ≈ 30%)      | Carry a measured `percent` alongside `count`. Computing `count/40*100` would fail the diff.                                                                                                                                                                                                                                                                                                                         |
| 10  | Approve either net-new primitive (stat tile, asset tile)?                                            | **Reject both.** Stat tile → 3 `<li>` in the metadata-usage widget; asset tile → `<li>` in the assets widget. Neither has a second consumer.                                                                                                                                                                                                                                                                        |
| 11  | Is the root doing too much (8 panel shells + right rail + 2 sidebar bodies)?                         | Keep the shells in the root. The alternative duplicates the card look across 6 files written by 6 different agents.                                                                                                                                                                                                                                                                                                 |
| 12  | `sl-panel` header action: `actions` or `aside` slot?                                                 | `slot="aside"` for the single button (`actions` wraps children in an `sl-tool-bar` that force-sets `fill`); rich `slot="heading"` for Assets / Content items.                                                                                                                                                                                                                                                       |
| 13  | Links: `<a>` or `<sl-button fill="link">`?                                                           | `sl-button fill="link" size="sm"` for the 12 CC-mapped "See all" only; plain styled `<a href="#">` for the other 43 links (`sl-button` has no `href`). Mixing is intentional.                                                                                                                                                                                                                                       |
| 14  | Mock-data placement                                                                                  | Each level-0 child ships its own `<name>.mock.ts`; the root's `mock-data.ts` imports the 7 fixtures and adds the root-rendered content. Runtime ownership stays with the root.                                                                                                                                                                                                                                      |
| 15  | Should "Remove widget" actually remove?                                                              | Yes — root `@state removedWidgets: Set<EtslWidgetId>`. Default story still renders all 8 cards.                                                                                                                                                                                                                                                                                                                     |
| 16  | Manifest says 25 bars; tree and screenshot show **26**. Bar counts sum to 166, header reads **164**. | Implement 26 bars and the literal "164" exactly as designed. Record both; do not "fix" the arithmetic.                                                                                                                                                                                                                                                                                                              |
