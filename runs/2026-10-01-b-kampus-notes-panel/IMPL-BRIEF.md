# Stage 3 implementation brief — b-kampus-notes-panel

Every implementer on this run reads this file **plus** `token-map.md` and `slds-api.md` in the same
folder, and the reference `screenshot.png`. These override the decomposition wherever they differ —
the corrections below were measured against the repo and the design, and several reverse a default
the decomposer chose without that evidence.

## Fixed parameters

- Framework **lit** · i18n **OFF** (strings verbatim, mixed Finnish/English) · theme **kampus**
- Output root: `examples/lit/src/_runs/b-kampus-notes-panel/`
- Example path → **no** `package.json`, **no** `register.ts`, **no** website docs, **no** changeset,
  **no** `.spec.ts`.
- Styles are plain `.css` imported `with { type: 'css' }`. No build step.

## Registration — do it this way, the alternative has already emptied one run's page

**Do not use `ScopedElementsMixin` anywhere in this run.** A host that uses it owns a _private_
registry, and any tag missing from its `scopedElements` map renders as an inert unknown element
with no shadow root — the screenshot looks plausible and the page is empty. An earlier run in this
batch lost its entire render that way.

Instead, in **every** component module:

```ts
// SLDS elements: import the register side effect for each one you use
import '@sl-design-system/button/register.js';
import '@sl-design-system/icon/register.js';

// …class definition…

// guarded global define, at the bottom of the module
if (!customElements.get('sl-kampus-thing')) {
  customElements.define('sl-kampus-thing', Thing);
}
```

The root imports each child module for its side effect. A `import { type X } from './x.js'` is
**erased** — it does not register anything. Use a value import or a bare `import './x.js';`.

## Corrections to the decomposition — these are measured, apply them

| #      | Decomposer's default                                            | Correction                                                                                                                                                                                                                                                                                                               |
| ------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **G6** | use `@fortawesome/pro-regular-svg-icons` + `Icon.register(...)` | **Forbidden.** The package is not in `node_modules`; Vite cannot resolve it, the module throws at load and the page renders **nothing**. Use only the 55 theme-registered names in `token-map.md`, bare, with no import and no `Icon.register`. An icon the theme lacks is **left out** and recorded — never hand-drawn. |
| **G2** | export the 8 cover photos from Figma into `assets/`             | **No.** This pipeline has no asset-export step. Emit `<img src="/assets/kampus/<name>.jpg">` that 404s, with **explicit `width`/`height` (or `aspect-ratio`) so the layout does not reflow**, and record the 404s as an `[ENV]` discrepancy. Do not substitute remote images.                                            |
| **F3** | accept 600 where the design wants 700                           | **`--sl-fontWeight-700` exists in the kampus theme** (=700). Use it for the h1 and the card titles. Use `--sl-text-new-typeset-fontWeight-semiBold` (600) for the 600 cases.                                                                                                                                             |
| **G7** | no 10px step exists; substitute                                 | **10px exists**: `--sl-typography-caption-md-fontSize`. Use it for the rail captions.                                                                                                                                                                                                                                    |
| **I1** | sample the highlight yellow / re-probe                          | **Resolved by measurement: `#FFEF99`.** Use `--sl-color-background-highlight` (`#FFF7C5`) — the semantically correct token — and record the delta.                                                                                                                                                                       |
| **G1** | 5 note cards, maybe 4                                           | **4 visible notes**, confirmed from the node tree. Group 1: one plain + one highlight. Group 2: one highlight with a body line + one highlight without.                                                                                                                                                                  |
| **A5** | compose `sl-card` if its slots fit                              | **Use a plain `<article>`.** `sl-card`'s `setTitle` only inspects _direct_ assigned elements and it force-colours slotted title links with an `!important` rule — both bit an earlier run. The locked variant needs a dashed border and reduced opacity on the outer surface, which is simpler on our own element.       |
| **F7** | `filter: drop-shadow(...)` with a raw hex                       | Use `box-shadow: 0 2px 8px var(--sl-color-shadow-overflow1)`. No token matches the geometry; the colour token is close. `filter` on a host creates a containing block and is worse.                                                                                                                                      |

Confirmed as-is from the decomposition: **G4** no purple cover wash (the screenshot shows
full-colour photos) · **C4** date formatted by a module-level `Intl.DateTimeFormat('fi-FI', {day:'2-digit',month:'2-digit',year:'numeric'})`
with a comment that a real app takes the locale from the profile · **G8** the orange `①` at
x≈347 y≈154 is a Figma annotation and is deliberately **not** implemented · **G9** hidden states
(TOC variant, add-new editors, empty states) are **not** implemented, not even as dead props.

## Measured colours from the reference PNG (ground truth, beats prose)

| Where            | Measured  | Use                                             |
| ---------------- | --------- | ----------------------------------------------- |
| header bar       | `#643695` | `--sl-color-palette-purple-700`                 |
| note card fill   | `#F5F5F6` | `--sl-color-background-neutral-bold` (exact)    |
| note body text   | `#29292B` | nearest per `token-map.md`, record              |
| panel ground     | `#FFFFFF` | `--sl-color-background-plain`                   |
| highlight marker | `#FFEF99` | `--sl-color-background-highlight`, record delta |
| annotation badge | `#F9963B` | not implemented (annotation)                    |

## Type sizes available in kampus (resolved)

10 `--sl-typography-caption-md-fontSize` · 12 `--sl-text-new-body-sm-fontSize` ·
14 `--sl-text-new-body-md-fontSize` · 16 `--sl-text-new-body-lg-fontSize` ·
18 `--sl-label-md-fontSize` · 24 `--sl-text-new-heading-lg-fontSize` ·
32 `--sl-text-new-heading-xl-fontSize`.

**30px (the h1) has no token** — nearest is 32. Use `--sl-text-new-heading-xl-fontSize` and record
the 2px delta. **Longhands only — never the `font:` shorthand** (see `token-map.md`).

## Layout dimensions vs spacing steps

The design binds **no** size variables, so every number is a measured pixel. Rule:

- **Spacing / padding / gap / radius** → the `--sl-size-*` or `--sl-space-*` token whose _resolved_
  value equals the measurement (ladder in `token-map.md`; `--sl-size-N00` = N × 8px, so
  `--sl-size-500` is **40px**, not 20).
- **Layout dimensions** with no matching step — the 74px rail, the 360px panel, the 328px content
  width, the 72px panel header, the 846px content column, the 250px card track — use the **raw px**
  with an inline comment saying it is a layout dimension, not a spacing step. Do not invent a token
  name and do not use a `var()` fallback.

## Shared types

Implement the decomposition's **Shared Types / Contracts** block verbatim — same names, same
fields, same event names. Each component exports its own model interface; the root imports all five.

## Accessibility (from the decomposition, unchanged)

No `<main>`, no `role="main"`, no `role="banner"`, no `<header>` at page level — the host app owns
those landmarks. `<nav aria-label="Primary">` in the header, `<nav aria-label="Chapter tools">` in
the rail. The notes panel is `<aside aria-labelledby="notes-heading">`, **not** a dialog. Icon-only
buttons need an `aria-label`. The five "Edit" buttons each need a distinguishing label. Subchapter
cards are wrapped in `<li>` **by the root** — never put a custom element directly inside `<ul>`.
Heading levels: `<h1>` "Chapter 1", `<h2>` "Notes", `<h2>` per card title, `<h3>` per note group.

## House rules that are checked

No raw hex. No `var()` fallbacks. No physical properties — use logical (`inline-size`,
`padding-inline`, `margin-block`). No hand-rolled `CustomEvent` — use `@event` / `EventEmitter`
from `@sl-design-system/shared`. All relative imports end in `.js`. JSDoc every exported
declaration.
