# A7 MyPortal "Materials / Overviews" — theme + token reference

> **CORRECTED 2026-10-01.** This file first recorded `bingel-dc`. That was wrong — see "Theme" below.
> Every colour, size and icon statement in it is unaffected (the two themes share them exactly);
> only the theme id and the border-radius default changed.

Produced by the run orchestrator from `figma-variable-defs.json`, `runs/harness/theme-match.mjs`
and a resolver over `packages/themes/bingel-int/theme.css` (light cascade only: the
`@container style(--color-scheme: dark)` block and the three `[data-user-group='…']` blocks are
excluded before resolving, otherwise the _dark_ declaration wins the lookup and every answer is
wrong — `--sl-color-foreground-plain` reads `#f7f8f8` instead of `#373a3e`).

## Theme: `bingel-int` — inherited from A3, not derived here

**This run's own data cannot decide the theme.** `theme-match` returns:

| field               | value                                                           |
| ------------------- | --------------------------------------------------------------- |
| `best`              | `bingel-dc`                                                     |
| `method`            | `hex-value-fallback` (the design binds **no** SLDS token names) |
| `absoluteAgreement` | `1.0` — 15 of 15 design hexes present                           |
| `marginOverSecond`  | `1.0` — i.e. **none**: `bingel-int` also scores 15/15           |
| `confident`         | **false**                                                       |

`bingel-dc` and `bingel-int` are colour-identical, so a colour-only ranking between them is a coin
flip, and `best: bingel-dc` is that coin flip rather than a finding.

**The tie is broken by the sibling run A3 — the same Figma file, a different frame.** A3 binds three
numeric tokens that this frame does not bind at all:

| token                       | design | `bingel-dc` | `bingel-int` |
| --------------------------- | -----: | ----------: | -----------: |
| `size/borderRadius/default` |      4 |         2px |      **4px** |
| `size/borderRadius/child`   |      2 |         1px |      **2px** |
| `size/borderWidth/action`   |      1 |         2px |      **1px** |

Three for three for `bingel-int`. **Basis of record: inherited from A3, same file, decided on size
tokens.** Not this run's own derivation.

### One weak corroboration from this frame, and one retraction

**Corroboration (weak, but independent).** This frame draws `rounded-[4px]` on the selectboxes, the
tree rows, the active pill and the cover — and `--sl-size-borderRadius-default` is **4px** under
`bingel-int` and **2px** under `bingel-dc`. That is a _drawn_ value rather than a bound token, so it
is weaker evidence than A3's, but it points the same way.

**Retraction.** This file originally broke the tie for `bingel-dc` on two arguments. Both fail:

1. _"The design names the theme"_ — it binds a variable literally called `bingel_dc_shadow`. That is
   a label, and it is **contradicted** by the size tokens. A designer's layer name is not a theme
   binding; treat it as a naming artefact of the file, not as evidence. Worth recording precisely
   because it is the most convincing-looking wrong signal in this run.
2. _"Typography family"_ — the claim was that `bingel-dc` sets the text families to `open-sans` and
   `bingel-int` to `proxima-nova`, and the design's `text/*` scale is Open Sans. The 46-line diff
   does say that, **but it differs only in the `--sl-brand-text-new-*-fontFamily` layer, which the
   public `--sl-text-new-*` tokens do not consume**: `--sl-text-new-body-md-fontFamily` resolves to
   `'Open Sans'` in **both** themes. The argument was reasoning from a layer with no effect on what
   renders. Retracted — and it never actually contradicted `bingel-int`.

The exact four-way match still holds and is theme-neutral: `text/body/md/normal` = Open Sans /
14 / 20 / 400 and `--sl-text-new-body-md` = `'Open Sans'` / 14px / 20px / 400, in either theme.

### The second vocabulary

The design carries **two** typography vocabularies. The `text/*` paths are the SLDS scale and are
Open Sans. The `href/*`, `breadcrumb/*`, `button/text/*`, `input/textField/text/*` and
`avatar/header/*` paths are **Proxima Nova** and belong to MyPortal's own component library, which
is not in this repository. Those faces have no token and will render in the theme's Open Sans.
This is a floor, not a defect.

## Colour: 15 of 15 have an exact public token

Every hex the design binds resolves exactly in `bingel-int`. Zero approximations needed.

| design value | role in the design                                        | public token to use                                                                                                                              |
| ------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `#FFFFFF`    | `body/background`, button/field fill                      | `--sl-elevation-surface-base-default` (page), `--sl-color-background-input-plain` (field), `--sl-color-foreground-inverted-plain` (text on bold) |
| `#002649`    | `foreground`, `body/foreground`, `href/active/foreground` | **`--sl-color-palette-blue-800`** — see the warning below                                                                                        |
| `#002F62`    | `button/default/solid/idle/foreground`                    | `--sl-color-foreground-primary-bold`                                                                                                             |
| `#8D959D`    | `breadcrumb/divider`                                      | `--sl-color-border-bold`                                                                                                                         |
| `#C7CDD3`    | `card/border`                                             | `--sl-color-palette-grey-200` / `--sl-color-background-input-interactive`                                                                        |
| `#E3E6EA`    | `button/default/solid/idle/border`                        | `--sl-color-border-secondary-bold` / `--sl-color-palette-grey-100`                                                                               |
| `#F2F3F5`    | `color/palette/neutral/50`                                | `--sl-color-background-neutral-bold` / `--sl-elevation-surface-raised-sunken`                                                                    |
| `#71777D`    | textfield placeholder, `neutral/600`                      | `--sl-color-foreground-subtlest`                                                                                                                 |
| `#B8C0C8`    | select group-title foreground                             | `--sl-color-foreground-disabled`                                                                                                                 |
| `#54585D`    | `color/palette/neutral/700`                               | `--sl-color-foreground-subtle`                                                                                                                   |
| `#001223`    | `color/palette/primary/900`                               | `--sl-color-background-primary-interactive-bold`                                                                                                 |
| `#0060B9`    | `color/palette/primary/500`                               | `--sl-color-link-hover` / `--sl-color-palette-blue-500`                                                                                          |
| `#0074DF`    | `button/default/outline/focus/border`                     | `--sl-color-background-primary-bold` (+21 more)                                                                                                  |
| `#235500`    | `button/success/link/focus/foreground`                    | `--sl-color-foreground-positive-bold`                                                                                                            |
| `#FF9D00`    | `button/warning/solid/idle/background`                    | `--sl-color-background-caution-bold`                                                                                                             |

### Valid-but-wrong, and the one real colour trap

**`--sl-color-foreground-plain` is NOT the design's body foreground.** The semantically obvious
token resolves to `#373a3e` in `bingel-int`; the design's body text is `#002649`. Using the
semantic token is a 1-line change that is _valid_, type-checks, passes the token check, and is
**visibly wrong** (warm dark grey instead of navy). `#002649` has **no semantic foreground token
at all** in this theme — only `--sl-color-palette-blue-800` (a palette token) and
`--sl-color-link-focused-hover` (a semantically unrelated name). Use the palette token and say so.

**`--sl-color-background-plain`, `--sl-color-background-surface`, `--sl-color-border-subtle` and
`--sl-elevation-shadow-raised` are NOT DECLARED in this theme.** Do not write them.

## Size tokens — names are not values

`--sl-size-100` = 8px, `-200` = 16px, `-300` = 24px, `-400` = 32px, `-500` = **40px**.
A Figma `Size/500` of 20 does **not** map to `--sl-size-500`. Resolve by value.
`--sl-size-borderRadius-default` = **4px** in `bingel-int`, which is exactly the radius this design
draws. (It is 2px in `bingel-dc` — the single most useful difference between the two themes.)
Radii: `sm`=2 · `md`=4 · `lg`=8 · `xl`=12 · `full`=50rem · **`xs` IS NOT DECLARED**. The drawn **6px**
radius on the material-header card has no token; nearest is `md` at 4px, a **−2px** delta to record.

Sizes in `bingel-int` are additionally gated behind `[data-user-group='early'|'developing'|'advanced']`
blocks. The harness renders with no `data-user-group`, so the default cascade applies — but a
token can exist and still resolve differently under a user group.

## Typography — the deltas that cannot be closed

| design                                                         | nearest token                                                     | delta                                                    |
| -------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------- |
| `text/body/md/normal` Open Sans 14/20 w400                     | `--sl-text-new-body-md`                                           | **exact**                                                |
| `text/body/md/demibold` Open Sans 14/20 w600                   | `--sl-text-new-body-md` + `font-weight: var(--sl-fontWeight-600)` | **exact**                                                |
| `text/body/sm/normal` Open Sans 12/16 w400                     | `--sl-text-new-body-sm`                                           | **exact**                                                |
| `text/heading/2` Open Sans Bold 24/**34**                      | `--sl-text-new-heading-lg` 24/**32**                              | line-height **−2px** per line                            |
| `text/heading/4` Open Sans Bold 16/**24**, letterSpacing **1** | `--sl-text-new-heading-md` 16/**20**                              | line-height **−4px**, and no letter-spacing token exists |

`--sl-text-new-*` is a `font:` **shorthand** and resets `font-weight` to 400. Every bold/demibold
run needs an explicit `font-weight: var(--sl-fontWeight-700|600)` **after** the shorthand.
Check for a longhand-only family before writing a `font:` shorthand against a bare `var()` —
a bare family in a shorthand drops the whole declaration.

Expect text to render in a **fallback face**: the theme declares `'Open Sans'` (spaced, title
case) while the Typekit kit `qya8xxo` registers Adobe's `open-sans`. Measure, do not pad.

## Icons — `bingel-int` registers exactly 34

(The `bingel-dc` and `bingel-int` icon registries are **byte-identical**, so the icon analysis done
under the wrong theme carries over unchanged.)

```
angle-down arrow-left arrow-right arrow-up-right-from-square badge-available badge-away
badge-donotdisturb badge-offline breadcrumb-separator caret-down-solid caret-left-solid
caret-right-solid check-solid chevron-down chevron-left chevron-right circle-check-solid
circle-exclamation-solid circle-solid circle-xmark circle-xmark-solid dash-solid
diamond-exclamation-solid ellipsis-down ellipsis-vertical face-smile grip-lines home-blank
octagon-exclamation-solid octagon-xmark-solid sort-down sort-up square-arrow-up-right
triangle-exclamation-solid
```

Anything else the design draws is **omitted with its footprint preserved** (an empty box of the
right size) and recorded as a Stage 4 discrepancy. **Never** import `@fortawesome/*` — the
registry is unreachable here, so the import is a _render_ blocker, not a type error. **Never**
hand-draw a replacement SVG: that puts invented artwork into a pixel comparison.
