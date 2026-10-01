# Design Manifest — A11 Sesame "Learning materials"

- Figma file: **MySesame Redesign** (`UBr399hnydpNF9P5Jb2vfx`), node **`116:19049`** "Learning materials"
- Frame size: **360 × 1871 px — MOBILE width.** Only narrow-viewport case in the batch. Must NOT be treated as desktop.
- Theme: `itslearning`. Framework: `lit`. i18n: **off**.

## Overview

A scrolling mobile dashboard showing a school's assigned digital-learning-platform licenses:
app header with school switcher → page title → CTA to self-assign a license → search field →
colour-coded list of 7 assigned-material cards → "Digital platforms" summary of 3 vendor
platforms → footer with legal links and a language selector.

## Existing SLDS Components Used

**No rows resolved.** `get_code_connect_map` returned an empty mapping (`{}`) for the top-level
node **and** for six targeted spot-checks (`116:19051` top bar, `116:19053` Button, `116:19060`
external-link, `116:19101` Platform tag, `116:19322` menu item footer, `116:19327` Component 2) —
7 calls, all succeeded, all empty. Not a transient error; not `hasTemplate: false`; a total
absence of Code Connect data for this file. Recorded as a manifest gap, **not** a block.

### Developer-placeable component types (instance counts mislead)

19 instance nodes / 7 distinct names — not the ~395 survey nodes. `get_metadata` itself reports
only 120 nodes because it does not expand instance internals.

| Node ID(s)                                                                                      | Node Name        | Category                                                      | CC status  |
| ----------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------- | ---------- |
| 116:19051                                                                                       | top bar          | App header / nav (logo, avatar, mobile-menu, school switcher) | no mapping |
| 116:19053                                                                                       | Button           | Primary pill CTA "Assign a license to myself"                 | no mapping |
| 116:19054                                                                                       | Frame 26851      | Search-style input control                                    | no mapping |
| 116:19060, 19078, 19096, 19106, 19116, 19126, 19151                                             | external-link    | Icon, 7 repeats                                               | no mapping |
| 116:19101, 19111 (instances); 19065, 19083, 19131, 19156, 19179, 19208, 19271 (detached frames) | Platform tag     | logo + label tag                                              | no mapping |
| 116:19322–19326                                                                                 | menu item footer | Footer nav link, 5 repeats                                    | no mapping |
| 116:19327                                                                                       | Component 2      | Language/locale selector                                      | no mapping |

Internals visible only via `get_design_context`: `ProfileButton` (avatar), `ButtonMobile`,
`Search`, `Icon-right` (chevron, reused rotated in the footer), `Icons/plus`, `Icons/search`,
`Icons/menu`. Not separately placeable.

## Composition Candidates

- **Assigned-material list item** — `116:19056, 19074, 19092, 19102, 19112, 19122, 19147` (7×,
  identical: title + external-link row, divider, "Platform" label + Platform tag, 4px colour-coded
  left border, h=80px).
- **Digital-platform summary card** — `116:19176, 19205, 19268` (3×, colour-coded left border,
  centred logo + name, h=100px, drop shadow).
- **Page footer** — `116:19311` (Sanoma logo, 5 menu items, language selector).
- **App header / top bar** — `116:19051`.

## Net-New Primitive Candidates

_None._ Composable from existing atoms. Conclusion is visual/semantic only — Code Connect gave
no data at all.

## Responsive Breakpoints

**Single breakpoint: 360px.** Mobile layout; no wider frame or variant exists in this node.

## Designer Annotations

_None._ Only a Figma component description on `external-link` (`1:2518`): "link outside, out
link, open in new window, external link".

## Token Reference

`get_variable_defs` returned **exactly one** bound variable for the whole frame:
`"H1 mobile" = Font(Open Sans, Bold, 24, 700, lineHeight 100, letterSpacing 0)`. Everything else
is a raw literal. This is a partner-brand Figma file, not built on the itslearning token system.

### Colour — every value below was grepped against `packages/themes/itslearning/` AND `packages/tokens/`; **zero exact matches**

| Raw                   | Use                                    | Nearest                    | Verdict                           |
| --------------------- | -------------------------------------- | -------------------------- | --------------------------------- |
| `#ffffff`             | card / page background                 | `--sl-color-white`         | **exact — use the token**         |
| `#323232`             | headings, platform names, footer links | grey-900 `#333333` (1 off) | genuinely unbound                 |
| `#2f5c64`             | card title + CTA button bg             | none                       | genuinely unbound (partner brand) |
| `#5d5d5d`             | "Platform" label                       | grey-700 `#565656`         | genuinely unbound                 |
| `#6d6e73`             | platform-tag name                      | grey-600 `#757575`         | genuinely unbound                 |
| `#8d8d8d`             | search placeholder                     | grey-500 `#9b9b9b`         | genuinely unbound                 |
| `#bfbfbf`             | search border, top-bar rule            | between grey-400/500       | genuinely unbound                 |
| `#cecfd2`             | card divider                           | grey-400 `#cfcfcf`         | genuinely unbound                 |
| `#ccedea`             | teal section background                | teal-050/100 (far)         | genuinely unbound                 |
| `#f6f8f8`             | footer background                      | grey-050 `#f9f9f9`         | genuinely unbound                 |
| `#79b928`             | Bingel green                           | none                       | vendor brand — keep literal       |
| `#643695` / `#602886` | Kampus purple (two values used)        | none                       | vendor brand — keep literal       |
| `#f1b437`             | Lexia Provia orange                    | none                       | vendor brand — keep literal       |

### Size / Spacing — verified exact in `theme.css`

`--sl-size-050`=4px · `-100`=8px · `-150`=12px · `-200`=16px · `-300`=24px · `-450`=36px ·
`-500`=40px · `-600`=48px · `-1000`=80px (material-card height, exact).
Radius: `--sl-size-borderRadius-lg`=8px (cards, exact), `-md`=4px (exact),
`-full` (CTA pill — do **not** hardcode Figma's `24px`).
Unbound: `6px` tag gap, `100px` platform-card height, `6px` search radius, `3px` inner radius.

### Typography — **no bare `font:` shorthand token exists in this theme**

Verified in `packages/themes/itslearning/theme.css` (NOT `typography.css`, which has none of
them): every `--sl-text-new-*` style ships **only** as `-fontFamily` / `-fontSize` /
`-lineHeight` / `-fontWeight` longhands. The only bare-looking entries are `typeset-*`
primitives. **`font: var(--sl-text-new-body-md)` resolves to nothing and the browser drops the
whole declaration silently.** Always set the four longhands separately.

Named weights confirmed to exist: `--sl-fontWeight-regular`=400, `-medium`=500, `-semiBold`=600,
`-bold`=700.

| Design style                                              | Tokens                                                                               | Verdict                             |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------- |
| H1 mobile (page + section headings) Open Sans Bold 24/~32 | `--sl-text-new-heading-lg-fontFamily/-fontSize/-lineHeight` + `--sl-fontWeight-bold` | exact (slot ships no `-fontWeight`) |
| Platform-tag name, Regular 14/20                          | `--sl-text-new-body-md-*` (all four)                                                 | **exact**                           |
| "Platform" label, Regular 14/21                           | `--sl-text-new-body-md-*` (20px)                                                     | 1px lineHeight off                  |
| Card title, SemiBold 14/24                                | none matches size+weight+lineHeight                                                  | unbound                             |
| Platform name in platform cards, Regular 16/20            | `--sl-text-new-body-lg-*` (24px)                                                     | 4px off                             |
| Search placeholder, Regular 16/21                         | `--sl-text-new-body-lg-*`                                                            | unbound                             |
| CTA label, Bold 14/24, ls 0.42px                          | none                                                                                 | unbound                             |
| Footer links / language label, SemiBold 14/24 capitalized | none                                                                                 | unbound                             |

### Icon registry status — `packages/themes/itslearning/icons.ts` (54 icons)

| Design icon                       | Registered?                          | Action                                         |
| --------------------------------- | ------------------------------------ | ---------------------------------------------- |
| `Icons/plus`                      | ✅ `plus`                            | use                                            |
| `Icons/search`                    | ✅ `search`                          | use                                            |
| `Icons/menu`                      | ✅ `menu`                            | use                                            |
| `external-link` ×7                | ⚠️ not by that name                  | use `square-arrow-up-right`                    |
| `Icon-right` (school switcher ▾)  | ⚠️ not by that name                  | use `chevron-down`                             |
| `Icon-right` rotated (language ▴) | ❌ no `chevron-up`/`angle-up`        | rotate `chevron-down` 180° (theme's own glyph) |
| `language_black_24dp` (globe)     | ❌ **no globe/language/earth entry** | **omit — Stage 4 discrepancy**                 |

**Never import `@fortawesome/*`** — not installed, no credential. Never hand-draw a replacement SVG.

### Image assets — no export step in the pipeline

`my vanin` logo, Sanoma payoff logo, Bingel / Kampus / Lexia Provia platform logos are remote
Figma asset URLs. They will 404 at render. Record as a Stage 4 discrepancy; do not fake them.
