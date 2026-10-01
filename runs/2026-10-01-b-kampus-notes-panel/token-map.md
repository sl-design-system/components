# Kampus token map for this run — USE THIS, do not hardcode hex

The design binds **no SLDS tokens** (see manifest). Every colour below was resolved by walking the
kampus theme's full `var()` indirection chain. Columns: the design's value, the token to write, and
whether it is exact.

## Colour — exact matches (use these, no discussion)

| Design                    | Token                                                                                                                                                             | Resolves to |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `#643695` brand purple    | `--sl-color-foreground-primary-bold` (text/icon) · `--sl-color-border-primary-bold` (border) · `--sl-color-palette-purple-700` (background wash)                  | `#643695`   |
| `#FFFFFF`                 | `--sl-elevation-surface-base-default` (page/panel ground) · `--sl-elevation-surface-raised-default` (card surface) · `--sl-color-background-input-plain` (inputs) | `#ffffff`   |
| `#0E0E0F` near-black text | `--sl-color-foreground-bold`                                                                                                                                      | `#0e0e0f`   |
| `#F5F5F6` card grey       | `--sl-color-background-neutral-bold`                                                                                                                              | `#f5f5f6`   |
| `#F9963B`                 | `--sl-color-palette-orange-300`                                                                                                                                   | `#f9963b`   |

## Colour — NO token at this value anywhere in any theme; use the nearest and record it

| Design                   | Nearest token                                        | Resolves to | Δ                     |
| ------------------------ | ---------------------------------------------------- | ----------- | --------------------- |
| `#CECFD2` gray-3 border  | `--sl-color-border-accent-grey-faint`                | `#cfd0d2`   | 1 — effectively exact |
| `#6D6E73` gray-6         | `--sl-color-background-accent-grey-interactive-bold` | `#696a71`   | 6                     |
| `#DFE3E6` lightgrey      | `--sl-color-background-accent-grey-bold`             | `#e5e5e8`   | 7                     |
| `#F0ECF5` purple-1       | `--sl-color-palette-purple-100`                      | `#f2ebfc`   | 8 (correct hue)       |
| `#444548` gray-7         | `--sl-color-background-inverted-interactive-bold`    | `#4c4d52`   | 15                    |
| `#DB7109` orange-8 badge | `--sl-color-palette-orange-500`                      | `#e85f0e`   | 22                    |
| `#29292B` gray-8         | `--sl-color-background-interactive-bold`             | `#3b3b3e`   | 32 — worst            |

Every row in this second table is a **Stage 4 discrepancy to record**, not a defect to fix.

## Typography — LONGHANDS ONLY

The kampus theme has **no bare `--sl-text-new-*` shorthand**. `font: var(--sl-text-new-heading-lg)`
resolves to nothing and the browser drops the **entire declaration** — wrong family, size and
line-height at once, with no error anywhere. Two shipped SLDS components carry this bug; do not
copy them.

Available: `--sl-text-new-{body-sm,body-md,body-lg}-{fontFamily,fontSize,lineHeight,fontWeight}`,
`--sl-text-new-{heading-sm,heading-md,heading-lg,heading-xl,heading-2xl}-{fontFamily,fontSize,lineHeight}`
(**headings have no `-fontWeight`** — take it from `--sl-text-new-typeset-fontWeight-semiBold` or
`-regular`), `--sl-text-new-{input-md,input-lg}-{fontFamily,fontSize,lineHeight}`.

Write it out:

```css
font-family: var(--sl-text-new-heading-md-fontFamily);
font-size: var(--sl-text-new-heading-md-fontSize);
line-height: var(--sl-text-new-heading-md-lineHeight);
font-weight: var(--sl-text-new-typeset-fontWeight-semiBold);
```

`--sl-text-new-typeset-fontFamily-body` is `'Open Sans'` **with no generic fallback**. The kampus
Typekit sheet may not load in the harness; if text renders in a fallback face that is an
environment discrepancy to record, not something to patch.

## Sizes — CHECK THE RESOLVED VALUE, NOT THE NAME

`--sl-size-500` is **40px**, not 20. An earlier run in this batch shipped a 2× padding defect by
reading the Figma name `Size/500` as if it were the CSS token. This design binds no size variables
at all, so every spacing number in the manifest is a **measured pixel**. Find the token whose
resolved value equals that pixel count:

```sh
node -e 'const c=require("fs").readFileSync("packages/themes/kampus/theme.css","utf8");
for(const m of c.matchAll(/(--sl-(?:size|space)-[\w-]+)\s*:\s*([^;]+);/g))console.log(m[1],m[2].trim())' | sort -u
```

## Icons — only what the theme registers

The registered set is **identical in every theme** (55 icons; the per-theme `icons.ts` files differ
only in file name). Use `<sl-icon name="x">` with **no import and no `Icon.register`** — the theme's
`setup()` already registered the set.

```
angle-down arrow-left arrow-right arrow-up-right-from-square badge-available badge-away
badge-donotdisturb badge-offline breadcrumb-separator calendar caret-down-solid caret-left-solid
caret-right-solid check check-solid chevron-down chevron-left chevron-right circle-check-solid
circle-exclamation-solid circle-solid circle-xmark circle-xmark-solid clock dash-solid
diamond-exclamation-solid ellipsis ellipsis-down ellipsis-vertical envelope error eye face-smile
fav grip-lines hand home-blank info menu minus mobile octagon-exclamation-solid octagon-xmark-solid
pinata plus search smile sort sort-down sort-up square-arrow-up-right star
triangle-exclamation-solid xmark
```

**Never `import ... from '@fortawesome/*'`.** The package is not in `node_modules`; Vite cannot
resolve it, the module throws at load, and the page renders **nothing**. It is a render blocker,
not a type error.

**An icon the theme lacks is left out and recorded as a Stage 4 discrepancy.** Never hand-draw a
replacement — invented artwork inside a pixel-compared region corrupts the measurement.

Icons this design needs, checked against the set above:

| Design icon                              | Available?                      | Action                       |
| ---------------------------------------- | ------------------------------- | ---------------------------- |
| home ("My page")                         | `home-blank`                    | use it                       |
| search                                   | `search`                        | use it                       |
| help "?"                                 | **no**                          | leave out, record            |
| account / profile                        | **no**                          | leave out, record            |
| bell / notification                      | **no**                          | leave out, record            |
| chevron-left / chevron-right (prev/next) | `chevron-left`, `chevron-right` | use them                     |
| ellipsis (card menus, title actions)     | `ellipsis`                      | use it                       |
| close X (panel)                          | `xmark`                         | use it                       |
| link / chain (title)                     | **no**                          | leave out, record            |
| pencil / edit (note card)                | **no**                          | leave out, record            |
| table-of-contents (toolbar)              | **no**                          | leave out, record            |
| edit-content (toolbar)                   | **no**                          | leave out, record            |
| assignments (toolbar)                    | **no**                          | leave out, record            |
| notes (toolbar)                          | **no**                          | leave out, record            |
| access-key (toolbar)                     | **no**                          | leave out, record            |
| expand / fullscreen                      | **no**                          | leave out, record            |
| breadcrumb separator                     | `breadcrumb-separator`          | `sl-breadcrumbs` supplies it |
| checkbox tick                            | —                               | `sl-checkbox` supplies it    |

## Size token ladder, resolved (kampus)

`--sl-size-N00` resolves to **N × 8px**, so the numeric part of the token name is _not_ the pixel
value. Figma's `Size/500` is 20; the CSS `--sl-size-500` is **40px**.

| px     | token                                                                                   |
| ------ | --------------------------------------------------------------------------------------- |
| 4      | `--sl-size-050` (also `--sl-size-borderRadius-default` / `-md`)                         |
| 8      | `--sl-size-100` · `--sl-space-100` · `--sl-space-new-md` · `--sl-size-borderRadius-lg`  |
| 12     | `--sl-size-150` · `--sl-size-borderRadius-xl`                                           |
| 14     | `--sl-size-175`                                                                         |
| 16     | `--sl-size-200`                                                                         |
| 20     | `--sl-size-250`                                                                         |
| 24     | `--sl-size-300`                                                                         |
| 32     | `--sl-size-400`                                                                         |
| 40     | `--sl-size-500` · `--sl-space-500`                                                      |
| 56     | `--sl-size-700` · `--sl-space-700` — the header height                                  |
| 64     | `--sl-size-800`                                                                         |
| 72, 74 | **no token** — the notes-panel header height (72) and left-toolbar width (74) have none |

## CORRECTION (post-implementation) — `--sl-color-background-plain` does not exist

This document originally named `--sl-color-background-plain` for every white surface. **That token
is declared in no theme in this repository**, including kampus. An undefined `var()` makes the
browser drop the whole declaration, so it would have silently produced transparent surfaces with
no error from `tsc`, no error from the linters, and a render report that still said `rendered`.

`runs/harness/check-tokens.mjs` caught it mechanically, and three of the five implementers caught
it independently by grepping the theme. The white tokens that actually exist in kampus:

| Use                  | Token                                   |
| -------------------- | --------------------------------------- |
| page / panel ground  | `--sl-elevation-surface-base-default`   |
| raised card surface  | `--sl-elevation-surface-raised-default` |
| input field ground   | `--sl-color-background-input-plain`     |
| inverted bold ground | `--sl-color-background-inverted-bold`   |

The error was the orchestrator's, not any implementer's — it originated in this file and was
carried into all five implementer briefs.
