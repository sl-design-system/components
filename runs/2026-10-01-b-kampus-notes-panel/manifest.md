# Design Manifest — Chapter page · Notes side panel · With notes

## Overview

Figma file **New content view** (`73YHtIYl0UHXH8ST4J7VKI`), top-level node **`5308:32158` "Chapter page – Notes side panel – With notes"**, frame **1280 × 720**. It is a Kampus learning-platform chapter page shown with the Notes side panel open: a purple global header bar, a narrow vertical tool rail on the left, a 360px Notes panel listing saved notes and highlights grouped by subchapter, and the main content column with a breadcrumb, the chapter title, a "Student view" switch, and a grid of subchapter cover cards.

## Existing SLDS Components Used

**None resolved.** `get_code_connect_map` returns `{}` for every node probed in this file — 21 probes by the design-analyst plus an independent re-probe by the orchestrator, at frame level, region level, and **main-component** level (`11360:135408` Icon-button, `12026:147754` Button, `5306:67658` Checkbox-with-text, `1702:18965` Simple-toggle, `1001:2105` number-tag). This is not the empty-subtree scoping artifact: main-component ids return `{}` too.

`get_design_context` corroborates it — every region comes back as reconstructed React + Tailwind `div`s with raw hex and raw px, no `<sl-*>` anywhere.

Figma's own component descriptions nevertheless mark several as "implemented", so the SLDS equivalents are identified **by name and shape**, not by snippet:

| Node ID        | Node Name          | Identified SLDS component                | Evidence                                     |
| -------------- | ------------------ | ---------------------------------------- | -------------------------------------------- |
| `12026:147754` | Button             | `<sl-button>`                            | main component, desc "implemented"           |
| `11360:135408` | Icon-button        | `<sl-button fill="ghost">` + `<sl-icon>` | main component, desc "implemented, Variants" |
| `5306:67658`   | Checkbox-with-text | `<sl-checkbox>`                          | main component, desc "implemented"           |
| `1702:18965`   | Simple-toggle      | `<sl-switch>`                            | main component, desc "implemented"           |
| `1001:2105`    | number-tag         | `<sl-badge>`                             | main component, desc "implemented"           |
| `5308:32164`   | breadcrumb-2023    | `<sl-breadcrumbs>`                       | node name + shape                            |
| `5308:32170`   | subchapter-card    | `<sl-card>` (candidate)                  | shape only                                   |

> **Pipeline note.** By the letter of the `/implement-design` skill this is `BLOCKED_ON_CODE_CONNECT` and the run halts. The orchestrator overrode the halt — see `progress.json → codeConnectFinding`. The absence is a property of the _file_ (a legacy Kampus product file that was never built on the SLDS Figma library), not a missing human action that a rerun would fix.

## Composition Candidates

- **Header navigation** — `5308:32183`. Purple 1280×56 global bar: "My page" home link, three nav tabs (Learning materials active), four trailing icon buttons (search, bell + "3" badge, help, account). Appears as a unit; shared page chrome.
- **Left toolbar** — `5308:32182`. 74×664 vertical rail: user photo then five icon+caption items (Contents, Edit content •, Assignments ①, Notes [active], Access key). Repeating row shape; shared page chrome.
- **Notes side panel** — `5308:32162`. 360×664: header ("Notes" + "See all" + close), a two-checkbox filter row, and a scrolling content area of note groups. The distinguishing element of this frame.
- **Note card** — `…;5308:29506` (plain) and `…;5308:29555`, `…;5308:29623`, `…;5308:29634` (highlight). Same rounded grey card, repeats 5×, two variants: plain body text, or a yellow-marked highlight line above the body. Both carry a trailing edit icon-button and a bottom-right date.
- **Note group** — `…;5308:29499`, `…;5308:29568`. A purple underlined subchapter link heading followed by 1–3 note cards. Repeats 2×.
- **Subchapter card** — `5308:32170`–`32176`, `32178`–`32179`. Cover image with purple wash, title, trailing ellipsis icon-button. Repeats 8×, two variants (solid + shadow / dashed + 50% opacity "locked").
- **Chapter content header** — `5308:32164`/`32165`/`32167`. Breadcrumb + prev/next circular buttons, chapter title + link + ellipsis actions, "Student view" switch. Three sibling nodes that read as one masthead.

## Net-New Primitive Candidates

- `…;5308:29559` **`.highlight`** — the yellow marker behind highlighted note text. A background-marked text run; no SLDS equivalent (`sl-tag`/`sl-badge` are pill-shaped chips, this is a text highlight). Shape: inline text decoration. Implement as a styled `<mark>`.
- `5308:34107` **Number annotation** — an orange "①" circle at x=347 y=154. **This is a Figma design-annotation marker, not UI.** Excluded from implementation; recorded here so a later reader does not mistake its absence for a fidelity miss.

## Responsive Breakpoints

_Single breakpoint: 1280px._ No sibling frames at other widths, no constraint annotations.

## Designer Annotations

- `5308:34107` — "①" number annotation overlaying the first note group. No annotation text layer is exposed by the MCP.
- `5308:32161` "Table of contents - Elements basics" — present but `hidden`; the alternate side-panel state for this frame.
- `…;5308:29514`/`29536`/`29582`/`29604` "add new general" / "add new to highlight" — hidden editor-with-toolbar states.
- `…;5308:29565`/`29643` "empty state" — hidden, text "No highlights yet! Start by selecting text with your mouse."
- `…;5308:29532` "All changes saved." — hidden status line.

## Token Reference

**The design binds no SLDS tokens.** Every bound variable belongs to a legacy Kampus Figma collection whose names (`Primary/$kampus-color-purple-7`, `grays/gray-1`, `UI/Button`) have no counterpart in the `--sl-*` namespace. `runs/harness/theme-match.mjs` reports `colorTokensInDesign: 0` and cannot rank a theme. Implementers must therefore map **by resolved value**, not by name.

### Color — design value → nearest kampus theme token

| Figma variable                                                 | Value     | Kampus theme token                          | Exact? |
| -------------------------------------------------------------- | --------- | ------------------------------------------- | ------ |
| `Primary/$kampus-color-purple-7`, `Primary/Default`            | `#643695` | `--sl-brand-light-color-palette-purple-700` | yes    |
| `Neutrals/$kampus-color-white`, `Neutrals/Full White`          | `#FFFFFF` | `--sl-color-background-plain`               | yes    |
| `Neutrals/$kampus-color-gray-9`                                | `#0E0E0F` | present in theme (5×)                       | yes    |
| `Neutrals/$kampus-color-gray-1`, `grays/gray-1`                | `#F5F5F6` | present in theme                            | yes    |
| `Specials/$kampus-color-interactive-5`                         | `#F9963B` | present in theme                            | yes    |
| `Neutrals/$kampus-color-gray-8`                                | `#29292B` | **absent from every theme**                 | no     |
| `Neutrals/$kampus-color-gray-7`                                | `#444548` | **absent from every theme**                 | no     |
| `Neutrals/$kampus-color-gray-6`                                | `#6D6E73` | **absent from every theme**                 | no     |
| `Neutrals/$kampus-color-gray-3`, `grays/gray-3`                | `#CECFD2` | **absent from every theme**                 | no     |
| `$color-ui-lightgrey`                                          | `#DFE3E6` | **absent from every theme**                 | no     |
| `Primary/$kampus-color-purple-1`                               | `#F0ECF5` | **absent from every theme**                 | no     |
| `Dashboard/kampus-color-orange-8`, `Dashboard/SU Not assessed` | `#DB7109` | **absent from every theme**                 | no     |

**Rule for implementers:** where the column says _yes_, use the theme token. Where it says _no_, search `packages/themes/kampus/theme.css` for the nearest semantic token and use it, recording the substitution. Do **not** hardcode the hex.

### Effects

- `shadow-low` — `drop-shadow(0 2px 8px #6D6E7359)` — cards, header, toolbar.
- `Bottom Borders/Primary 4px` — `inset 0 -4px 0 #643695` — active left-toolbar item.
- `breadcrumb gradient grey` — a gradient, no hex exposed.

### Typography — all `Open Sans`

| Figma style                         | Size / line-height / weight | Used for                             |
| ----------------------------------- | --------------------------- | ------------------------------------ |
| `New look & feel 2023/h1 (desktop)` | 30 / 38 / 700               | "Chapter 1"                          |
| `New look & feel 2023/h4 (desktop)` | 18 / 24 / 700               | subchapter card titles               |
| `Headings/Level 5`                  | 18 / 24 / 600               | "Notes" panel title                  |
| `Body/Regular`                      | 18 / 28 / 400               | —                                    |
| `Body/Small`                        | 16 / 24 / 400               | note body text                       |
| `UI/Small`                          | 16 / 20 / 400               | checkbox labels, note group headings |
| `UI/Button`                         | 14 / 24 / 600               | button labels, header nav            |
| `UI/Extra-small-semibold`           | 14 / 20 / 600               | breadcrumb                           |
| `UI/Tiny`                           | 12 / 16 / 400               | note dates                           |
| `UI/Tiny-bold`                      | 12 / 16 / 700               | badge numbers                        |
| `UI/Extra-Tiny`                     | 10 / 12 / 400               | toolbar captions                     |
| `UI/Extra-tiny-semibold`            | 10 / 12 / 600               | header badge                         |

> **`font:` shorthand trap.** The kampus theme declares only longhands — `--sl-text-new-{body,heading,input}-*-{fontFamily,fontSize,lineHeight}` (+ `-fontWeight` on `body-*` only). There is **no** bare `--sl-text-new-heading-lg`. `font: var(--sl-text-new-heading-lg)` silently drops the whole declaration. Use longhands. Heading weight comes from `--sl-text-new-typeset-fontWeight-semiBold` / `-regular`.
>
> `--sl-text-new-typeset-fontFamily-body` is `'Open Sans'` with **no generic fallback**; the kampus Typekit sheet (`https://use.typekit.net/pva0jun.css`) may not load in the harness, in which case text falls back to the browser default. Record as an environment discrepancy, do not "fix" it.

### Size / Spacing (measured; the design binds no size variables)

Frame 1280×720 · header 1280×56 · left toolbar 74×664 · notes panel 360×664 · content column 846 wide from x=434, 798 inner from x=24.

Notes panel: header 360×72 ("Notes" at 16,24 · "See all" button 94×40 at 202,16 · close 40×40 at 304,16) · filter row 328×20 at 16,116 (checkbox 103 wide, second at +119) · content area 328×508 at 16,160.

Note cards (x relative to the 328-wide content area): plain card 328×132, body inset 14 left / 12 top, date 16 tall ending 8 above the bottom, edit button 21×24 at x≈300. Highlight card 328×90 (or 60 with no body line): marker + title at y+12, body at y+40, date at y+66. Group heading 328×24; 16 gap heading→first card; 8 gap between cards; 24 gap between groups.

Content column: breadcrumb 798×64 at y=0 · title 798×40 at y=80 · Student view 198×24 at y=136 · card grid 798 wide from y=176; rows of 3 cards 250×251.5 with 24 gutters, then a row of 2 cards 264×262 with a 24 gutter.

## Localized Strings

_i18n is OFF for this run._ Strings render verbatim, in the mixed Finnish/English of the design: "My page", "Learning materials", "Tests", "Dashboard", "Contents", "Edit content", "Assignments", "Notes", "Access key", "See all", "Highlights", "Start page", "Chapter 1", "Student view", "1.7 Vastaa kysymyksiin", "2.11 Joku toinen tehtävä", "Subchapter 1.0"–"1.5", note bodies and dates as shown.
