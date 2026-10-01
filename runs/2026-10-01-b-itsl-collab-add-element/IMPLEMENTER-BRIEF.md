# Shared implementer brief — run `b-itsl-collab-add-element`

Read this **and** the manifest (`manifest.md`, both sections) before writing code.
Reference screenshot: `screenshot.png` in this same folder — look at it.

- Framework **lit**. Framework skill: `/Users/marcin.ludwig/Repo/sl-design-system/components/tools/implement-design-plugin/skills/implement-design-lit/SKILL.md`
- Conventions: `/Users/marcin.ludwig/Repo/sl-design-system/components/tools/implement-design-plugin/skills/implement-design/component-conventions.md`
- **i18n is OFF.** Render the design's text directly. No `msg()`, no `@localized()`.
- Output root: `/Users/marcin.ludwig/Repo/sl-design-system/components/examples/lit/src/_runs/b-itsl-collab-add-element/`
- This is an **example**, not a published package: no `package.json`, no `register.ts`,
  no `src/` nesting, no spec, no website docs, no changeset.
- **Do not modify any file outside the output root.** In particular do NOT touch
  `examples/lit/package.json` (all needed packages are already linked) or `examples/lit/src/index.ts`.

## FIVE HARD RULES — these override the framework skill and the conventions doc

The framework skill and `component-conventions.md` both contain guidance that is WRONG for this
theme and this run. Where they conflict with the following, **these win**.

### 1. Icons — no Font Awesome, ever

`@fortawesome/*` is **not installed and there is no credential**. Both the Lit skill and the
conventions tell you to `import { faX } from '@fortawesome/pro-regular-svg-icons'` and call
`Icon.register(faX)`. **Do not.** It will not resolve.

Use **only** icons already registered by `packages/themes/itslearning/icons.ts`. Those need **no**
`Icon.register` call — the theme registers them. The complete list of 54:

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

An icon the design needs that is **not** on this list is **left out** and reported by you as a
Stage 4 discrepancy. **Never** install it, **never** write a `.d.ts` or module stub, **never**
hand-draw a replacement SVG — invented artwork corrupts a pixel comparison.

### 2. Typography — longhands only, NEVER the `font:` shorthand

The itslearning theme ships **no bare `--sl-text-new-*` token.** `font: var(--sl-text-new-body-md)`
resolves to nothing and the browser **silently drops the entire declaration** — clean type check,
quiet stylelint, no typography at all. The conventions doc's advice to use it as a `font:`
shorthand is wrong here.

Always write the four longhands separately:

```css
font-family: var(--sl-text-new-body-md-fontFamily);
font-size: var(--sl-text-new-body-md-fontSize);
line-height: var(--sl-text-new-body-md-lineHeight);
font-weight: var(--sl-text-new-body-md-fontWeight);
```

Verified values (resolved through the full `var()` chain):

| prefix `--sl-text-new-` | family    | size | line-height | weight longhand |
| ----------------------- | --------- | ---- | ----------- | --------------- |
| `body-sm-`              | Open Sans | 12px | 16px        | 400             |
| `body-md-`              | Open Sans | 14px | 20px        | 400             |
| `body-lg-`              | Open Sans | 16px | 24px        | 400             |
| `heading-sm-`           | Open Sans | 14px | 20px        | **MISSING**     |
| `heading-md-`           | Open Sans | 16px | 20px        | **MISSING**     |
| `heading-lg-`           | Open Sans | 24px | 32px        | **MISSING**     |
| `heading-xl-`           | Open Sans | 32px | 40px        | **MISSING**     |

**`heading-*` has NO `-fontWeight` longhand.** Add an explicit
`font-weight: var(--sl-fontWeight-700)` (bold) or `var(--sl-fontWeight-600)` (semibold) after it,
or the text renders regular.

Do **not** use `--sl-text-*`, `--sl-title-*` or `--sl-heading-*` (without `-new-`). They exist but
resolve to different sizes than their names suggest (`--sl-text-sm-fontSize` is **18px**,
`--sl-heading-lg-fontSize` is **40px**) and have **no `-fontFamily` longhand at all**.

### 3. Colour — use these exact tokens, verified by resolving the var() chain

| Design value | Role                     | Token                                                           |
| ------------ | ------------------------ | --------------------------------------------------------------- |
| `#008859`    | primary button fill      | supplied by `sl-button variant="primary"` — **do not restyle**  |
| `#ffffff`    | nav / course-bar surface | `--sl-color-white` (no surface token exists — recorded gap)     |
| `#f2f2f2`    | page background          | `--sl-color-background-neutral-bold`                            |
| `#e1e1e1`    | borders, dividers        | `--sl-color-border-plain`                                       |
| `#333333`    | body & heading text      | `--sl-color-foreground-plain` (resolves `#4a4a4a` — recorded Δ) |
| `#565656`    | secondary text           | `--sl-color-foreground-subtle`                                  |
| `#757575`    | muted text               | `--sl-color-foreground-subtlest`                                |
| `#ececec`    | placeholder square fill  | `--sl-color-background-inverted-interactive-plain`              |

**No `var()` fallbacks** — never `var(--x, #fff)`. **No raw hex.** If you cannot find a token,
report the gap; do not invent a name and do not hardcode.

### 4. Spacing — `--sl-size-*`, verified

2→`--sl-size-025` · 4→`--sl-size-050` · 8→`--sl-size-100` · 12→`--sl-size-150` ·
14→`--sl-size-175` · 16→`--sl-size-200` · 20→`--sl-size-250` · 24→`--sl-size-300` ·
28→`--sl-size-350` · 32→`--sl-size-400` · 48→`--sl-size-600`.
Border radius 4px → `--sl-size-borderRadius-md`.
Use **logical properties** (`padding-inline`, `block-size`, `inline-size`, `margin-block-start`).

### 5. No stub may make a gate pass

If `tsc` only goes green because a `.d.ts` masks a missing module, the gate is defeated, not
passed. Write no stub files. If something genuinely cannot type-check, report it as a failure.

## Component rules

- Only `sl-add-element-page` (the root) registers globally, via a **guarded**
  `customElements.define`. **Children must NOT call `customElements.define`** — they just export
  their class. The parent declares them in `static get scopedElements()`.
- Children are **presentational**: one `@property({ attribute: false }) model?: XModel` input, a
  cohesive typed object — never a pile of scalars. The root owns all data.
- Events via the **`@event` decorator + `EventEmitter`** from `@sl-design-system/shared`. Never
  hand-roll `new CustomEvent()` + `dispatchEvent()`. Declare the alias in `GlobalEventHandlersEventMap`.
- Styles: plain `.css`, imported `import styles from './x.css' with { type: 'css' };` →
  `static override styles = styles;`. No SCSS, no build step.
- **Never `<main>` or `role="main"`.**
- Import specifiers for local `.ts` modules use `.js` extensions.
