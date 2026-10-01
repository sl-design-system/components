# Run hints — b-itsl-bookmk-course-files (theme: itslearning)

Batch-supplied constraints for every agent in this run. Verified in this checkout, not assumed.

## Output location

`examples/lit/src/_runs/b-itsl-bookmk-course-files/` — an **example**, not a published package.
So: no `package.json`, no `register.ts`, no `src/` nesting, no website docs, no changeset, no
Vitest spec. Just `<name>.ts` + `<name>.css` + `<name>.stories.ts`, children in nested folders.
Mirror `examples/lit/src/_runs/b-nsp-home/` exactly — it is a finished peer run.

## Storybook story — the side-effect import

The story MUST contain a **plain** import of its component module:

```ts
import './thing.js'; // required: runs customElements.define
import { type ThingModel } from './thing.js'; // type-only: erased, does NOT register
```

`import { type X } from './thing.js'` alone is erased at transform time, `customElements.define`
never runs, and Storybook renders an unregistered element: present in the DOM, 0x0, no shadow
root. The type check passes either way, so nothing in the pipeline catches it.

Story title convention (matches the other runs): `Runs/B Itsl Bookmk Course Files/<Component>`.
Root/page stories take `parameters: { layout: 'fullscreen' }`.

## Typography in the itslearning theme — longhands only

**There is no bare `--sl-text-new-*` custom property in this theme.** Verified by grep of
`packages/themes/itslearning/theme.css`. Only longhands exist:

```
--sl-text-new-body-lg-fontFamily / -fontSize:16px / -fontWeight:400 / -lineHeight:24px
--sl-text-new-body-md-fontFamily / -fontSize:14px / -fontWeight:400 / -lineHeight:20px
--sl-text-new-body-sm-fontFamily / -fontSize:12px / -fontWeight:400 / -lineHeight:16px
--sl-text-new-heading-2xl-fontFamily / -fontSize:48px / -lineHeight:48px
--sl-text-new-heading-xl-fontFamily  / -fontSize:32px / -lineHeight:40px
--sl-text-new-heading-lg-fontFamily  / -fontSize:24px / -lineHeight:32px
--sl-text-new-heading-md-fontFamily  / -fontSize:16px / -lineHeight:20px
--sl-text-new-heading-sm-fontFamily  / -fontSize:14px / -lineHeight:20px
--sl-text-new-input-md-fontFamily / -fontSize:14px / -lineHeight:24px
--sl-text-new-input-lg-fontFamily / -fontSize:14px / -lineHeight:32px
```

Two consequences:

1. **Never write `font: var(--sl-text-new-body-md)`.** The property is undefined, and a `font:`
   shorthand with an undefined `var()` makes the browser **drop the entire declaration silently** —
   clean `tsc`, quiet stylelint, and no typography at all in the render. Write the four longhand
   declarations (`font-family` / `font-size` / `font-weight` / `line-height`) instead.
2. **The `heading-*` scale has no `-fontWeight` token.** Use
   `--sl-text-new-typeset-fontWeight-semiBold` (or `-regular`) for heading weight.

## Icons — only what the theme registers

`packages/themes/itslearning/icons.ts` registers exactly these 54 names:

```
angle-down arrow-left arrow-right arrow-up-right-from-square badge-available badge-away
badge-donotdisturb badge-offline breadcrumb-separator calendar caret-down-solid caret-left-solid
caret-right-solid check check-solid chevron-down chevron-left chevron-right circle-check-solid
circle-exclamation-solid circle-solid circle-xmark circle-xmark-solid clock dash-solid
diamond-exclamation-solid ellipsis ellipsis-down ellipsis-vertical envelope error eye face-smile
fav grip-lines hand home-blank info menu minus mobile octagon-exclamation-solid
octagon-xmark-solid pinata plus search smile sort sort-down sort-up square-arrow-up-right star
triangle-exclamation-solid xmark
```

- **Never** import from `@fortawesome/*`. The package is not installed and there is no credential.
- Never stub the module, never hand-draw a replacement SVG — invented artwork corrupts the pixel
  comparison this run exists to produce.
- An icon the design needs that is not in that list is **left out** and **recorded as a Stage 4
  discrepancy**.

## Gates

- No stub (`.d.ts`, shim module, `any` cast over a missing import) may be what makes `tsc` pass.
- `<img src="/assets/…">` will 404 — the pipeline has no asset-export step. Record it; do not
  substitute placeholder imagery.

---

## Resolved typography scale — READ THIS, it corrects the manifest

The manifest's Token Reference maps the design's 16px body text to `--sl-text-md` and its 14px
text to `--sl-text-sm`. **That is off by one step.** The `--sl-text-*` / `--sl-title-*` sizes in
this theme go through a three-level indirection
(`--sl-text-md-fontSize` → `-userGroup` → `-superuser` → `--sl-computed-desktop-…`) whose value
depends on a `[data-user-group]` attribute on an ancestor. **With no `data-user-group` attribute
set — which is the case in Storybook — the `superuser` branch wins** (it is the last `body {}`
block in `theme.css`). Resolved desktop defaults, traced through every hop:

| Token                                                 | Resolves to     | Design role                                                       |
| ----------------------------------------------------- | --------------- | ----------------------------------------------------------------- |
| `--sl-text-lg-fontSize` / `--sl-text-lg-lineHeight`   | **16px / 24px** | nav item labels, course-name link, Teacher and Last-updated cells |
| `--sl-text-md-fontSize` / `--sl-text-md-lineHeight`   | **14px / 20px** | banner body text, status-chip label, table column headers         |
| `--sl-text-sm-fontSize` / `--sl-text-sm-lineHeight`   | 12px / 16px     | not used by this design                                           |
| `--sl-title-lg-fontSize` / `--sl-title-lg-lineHeight` | **22px / 28px** | closest to the 26px page title — **no exact 26px token exists**   |
| `--sl-title-md-fontSize` / `--sl-title-md-lineHeight` | **16px / 20px** | the 18px "Files" secondary-nav label has no exact token either    |

Families (exact match to the design's `default-font: Lato`): `--sl-text-fontFamily: Lato`,
`--sl-title-fontFamily: Lato`, `--sl-heading-fontFamily: Lato`, `--sl-label-fontFamily: Lato`.

Weights: `--sl-typography-text-{sm,md,lg}-fontWeight: 400` (matches the design's regular text).
The design's **bold is 700**, but `--sl-typography-title-*-fontWeight` and
`--sl-typography-label-*-fontWeight` are **600**. Use `--sl-fontWeight-bold` (**= 700**, exact)
for every bold run in this design — page title, "Files" label, table column headers, course-name
link. Record the 600-vs-700 gap as a note, not as a reason to hardcode `700`.

**Do not use the `--sl-text-new-*` namespace here.** It exists in this theme but its
`-fontFamily` is `'Open Sans'`, not Lato, so it would change the typeface the whole design is
drawn in. Use `--sl-text-*` / `--sl-title-*` (Lato) for everything.

### Known size gaps (use the nearest token and record the delta; do not hardcode px)

- Page title 26px → nearest `--sl-title-lg-fontSize` (22px). Delta −4px.
- "Files" secondary-nav label 18px → nearest `--sl-title-md-fontSize` (16px). Delta −2px.

## Colour mapping — every one of these was verified by grep, none is unbound

| Figma variable         | Hex       | SLDS token (exists in `packages/themes/itslearning/theme.css`) |
| ---------------------- | --------- | -------------------------------------------------------------- |
| `$gray--0`             | `#ffffff` | `--sl-color-white`                                             |
| `$gray--50`            | `#f9f9f9` | `--sl-color-palette-grey-050`                                  |
| `$gray--100`           | `#f4f4f4` | `--sl-color-palette-grey-100`                                  |
| `$gray--150`           | `#f2f2f2` | `--sl-color-palette-grey-150`                                  |
| `$gray--300`           | `#e1e1e1` | `--sl-color-palette-grey-300`                                  |
| `$gray--400`           | `#cfcfcf` | `--sl-color-palette-grey-400`                                  |
| `$gray--600`           | `#757575` | `--sl-color-palette-grey-600`                                  |
| `$gray--700`           | `#565656` | `--sl-color-palette-grey-700`                                  |
| `$gray--900` / `$text` | `#333333` | `--sl-color-palette-grey-900`                                  |
| `$blue--100`           | `#ecf8ff` | `--sl-color-palette-blue-050`                                  |
| `$blue--700`           | `#00458f` | `--sl-color-palette-blue-700`                                  |
| `$pigeongrey--100`     | `#d9e3e8` | **none — genuinely unbound**, grepped the whole repo           |

## Spacing mapping (Figma's `Size/N` index differs from `--sl-size-NNN`; the px values match)

`Size/5`→1px `--sl-size-010` · `Size/10`→2px `--sl-size-025` · `Size/25`→4px `--sl-size-050` ·
`Size/50`→8px `--sl-size-100` · `Size/100`→12px `--sl-size-150` · `Size/200`→14px `--sl-size-175` ·
`Size/300`→16px `--sl-size-200` · `Size/500`→20px `--sl-size-250` · `Size/700`→24px `--sl-size-300` ·
`Size/900`→32px `--sl-size-400` · `ca-horisontal-margin`→48px `--sl-size-600` ·
`border-radius`→4px `--sl-size-borderRadius-md`. Fully-round → `--sl-size-borderRadius-full`.
No token for 18px (`Size/400`) or 26px (`Size/800`).

Shadow `0 4px 8px #0000000D`: **no exact token.** `--sl-elevation-shadow-sm` and
`--sl-elevation-shadow-overlay` are both different geometries. Record as unbound.
