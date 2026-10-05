---
type: analysis
schema_version: 1
id: A-NOJIRA-design-system-architecture
title: How this design system is built, and which of its artifacts an agent can already rely on
description: 'A survey of the monorepo — architecture views, the component dependency graph, the token hierarchy, the Custom Elements Manifest, component stability, and thirteen recorded risks'
jira: null
resource: null
status: draft
owner: marcin.ludwig
created: 2026-10-05T00:00:00Z
updated: 2026-10-05T00:00:00Z
tags: [design-system, architecture, tokens, cem, reference]
---

# How this design system is built, and which of its artifacts an agent can already rely on

> Translated from `analiza-projektu.md`, written before the Figma-to-code effort began. Its
> stated purpose: _"produce component contract documentation for an AI agent, generated
> automatically in CI/CD."_ Several of its observations were borne out by that effort — see
> **Leads to**.

## Key questions

1. What is this monorepo made of, and how do its parts depend on each other?
2. Which artifacts already describe a component's API well enough for a machine to consume?
3. Where is the system fragile, and which of those weaknesses would an automated consumer meet
   first?

## Hypotheses

This is a **survey rather than an investigation** — it was not written to test a hypothesis but
to establish a baseline before building contract documentation. What it was surveying _for_ was
one thing: whether a machine-readable component contract could be generated from what already
exists, or whether it had to be authored. Section 9 answers that, and the answer is mostly the
former.

## Context & background

Sanoma Learning products — Magister, Itslearning, Sanoma Learning and others — consume
`@sl-design-system/*` web components from the GitHub npm registry. Two things sit alongside the
components: **20 CSS themes** and **Angular wrappers covering 12 components**.

## Findings

### F1 — System context (C1)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Sanoma Learning ecosystem                     │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Magister    │  │  Itslearning  │  │  Sanoma Learning     │  │
│  │  (product)   │  │  (product)    │  │  (product)           │  │
│  └──────┬───────┘  └──────┬────────┘  └──────────┬───────────┘  │
│         │                 │                        │              │
│         └─────────────────┼────────────────────────┘              │
│                           ▼                                       │
│              ┌────────────────────────┐                          │
│              │  @sl-design-system/*   │  ← npm (GitHub registry)│
│              │  Web Components (Lit)  │                          │
│              └────────────────────────┘                          │
│                           │                                       │
│              ┌────────────┴────────────┐                         │
│              │                         │                         │
│   ┌──────────▼──────┐    ┌─────────────▼──────┐                │
│   │  CSS Themes      │    │  Angular wrappers  │                │
│   │  (20 themes)     │    │  (12 components)   │                │
│   └─────────────────┘    └────────────────────┘                │
└─────────────────────────────────────────────────────────────────┘
```

### F2 — Containers (C2): the monorepo

```
sl-design-system/components (monorepo – Yarn Workspaces)
│
├── packages/components/*     ←── 54 Web Components (Lit + TypeScript)
│   ├── shared/               ←── infrastructure: mixins, controllers, decorators
│   └── [accordion..virtual-list]
│
├── packages/themes/*         ←── 20 CSS themes (Style Dictionary → CSS vars)
│   └── [sanoma-learning, magister, itslearning, neon, ...]
│
├── packages/tokens/          ←── token source (Token Studio JSON → StyleDict)
│
├── packages/locales/         ←── translations (lit-localize, XLF)
│   └── en, es-ES, it, nl, pl
│
├── packages/angular/         ←── Angular wrappers (12 form-centric components)
│
├── packages/checklist/       ←── installation verification tool
│
├── tools/
│   ├── eslint-plugin-slds    ←── 3 custom rules (button-has-label, html-template)
│   ├── eslint-config
│   ├── stylelint-config
│   └── vitest-browser-lit    ←── fixture() helper for in-browser tests
│
├── scripts/
│   ├── build-packages.js     ←── esbuild (TS → JS, no bundling)
│   ├── build-styles.js       ←── sass + stylelint → *.scss.ts (Lit css``)
│   ├── build-themes.js       ←── Style Dictionary + Tokens Studio → CSS vars
│   ├── build-metadata.js     ←── CEM Analyzer → custom-elements.json (!)
│   └── cem-plugins.js        ←── custom CEM plugins (event, field, sort, filter)
│
├── .storybook/               ←── Storybook 10 + Vitest addon
├── website/                  ←── documentation (11ty)
└── chromatic/                ←── visual regression (Chromatic)
```

### F3 — Component internals (C3) and the implementation pattern (C4)

Every component is an independent npm package with an identical structure:

```
packages/components/button/
├── index.ts              → re-exports src/button.ts
├── register.ts           → customElements.define('sl-button', Button)
├── package.json          → { "status": "stable", "type": "module", exports: {...} }
├── tsconfig.json
└── src/
    ├── button.ts         → implementation (Lit + TypeScript)
    ├── button.scss       → SCSS styles (compiled to button.scss.ts)
    ├── button.spec.ts    → tests (Vitest + Playwright/Chromium)
    └── button.stories.ts → Storybook stories
```

```typescript
// 1. Public types (exported)
export type ButtonVariant = 'primary' | 'secondary' | ...;

// 2. declare global – registration in HTMLElementTagNameMap
declare global { interface HTMLElementTagNameMap { 'sl-button': Button } }

// 3. Class with mixins
export class Button extends ForwardAriaMixin(LitElement) {
  // Static (styles, formAssociated, shadowRootOptions)
  static override styles = styles;

  // Private fields (#)
  #events = new EventsController(this, { click: this.#onClick });

  // Internals
  readonly internals = this.attachInternals();

  // @query
  @query('button') button!: HTMLButtonElement;

  // @property / @state (public)
  @property() variant?: ButtonVariant;

  // @event (public events)
  @event({ name: 'sl-click' }) clickEvent!: EventEmitter<SlClickEvent>;

  // render()
  override render() { return html`<button>...</button>`; }

  // Private methods (#)
  #onClick() { ... }
}
```

### F4 — The dependency graph

**Hubs — depended on by the most:**

```
shared (0.12.0)    ← almost ALL components (42+)
icon (1.4.2)       ← button, dialog, form, select, text-field, ...
button (2.0.1)     ← date-field, dialog, drawer, message-dialog, ...
form (1.4.0)       ← checkbox, combobox, date-field, number-field, ...
listbox (1.1.3)    ← combobox, select
```

**Most complex, by dependency count:**

| Component  | Dependencies                                                                     |
| ---------- | -------------------------------------------------------------------------------- |
| tree       | button-bar, checkbox, data-source, icon, shared, skeleton, spinner, virtual-list |
| date-field | button, button-bar, calendar, form, icon, shared, text-field                     |
| combobox   | form, icon, listbox, tag, text-field                                             |
| tool-bar   | button, icon, menu, toggle-button, toggle-group                                  |

**Leaves — minimal or no inter-component dependencies:** badge, card, skeleton, spinner,
scrollbar.

### F5 — The token system

```
primitives.json           → base scale: 8px unit (100=8px, 200=16px, 300=24px...)
       ↓
system.json               → typography, breakpoints, icon sets
       ↓
{theme}/base-new.json     → component-level overrides for a theme
       ↓
{theme}/{variant}-new.json → light / dark variant
       ↓
[Style Dictionary + @tokens-studio/sd-transforms]
       ↓
CSS vars: --sl-{category}-{subcategory}-{property}-{state}
```

```
--sl-size-300                          → spacing/size (24px)
--sl-color-border-plain                → border colour
--sl-color-foreground-plain            → text colour
--sl-elevation-surface-base-default    → background
--sl-size-borderRadius-default         → corner radius
--sl-text-new-body-md                  → font shorthand

Pattern: --sl-{CATEGORY}-{SUBCATEGORY}-{PROPERTY?}-{STATE?}
```

Categories: `--sl-size-*` (dimensions and spacing, 8px scale) · `--sl-color-*` (foreground,
border, background, palette) · `--sl-elevation-*` (surface layers) · `--sl-text-*` (typography)
· `--sl-shadow-*` · `--sl-animation-*`.

**The 20 themes:**

| Theme                                   | Variants         | Status      |
| --------------------------------------- | ---------------- | ----------- |
| sanoma-learning                         | light            | production  |
| itslearning                             | light            | production  |
| magister                                | light + **dark** | production  |
| neon                                    | light            | production  |
| sanoma-pro                              | light            | production  |
| sanoma-utbildning                       | light            | production  |
| bingel-dc/int                           | light            | production  |
| clickedu                                | light            | production  |
| editorial-suite                         | light            | production  |
| kampus, max, teas, tig, my-digital-book | light            | production  |
| myvanin, sanoma-utbildning_onhold       | light            | **on hold** |

**Only `magister` has a dark mode.** The rest are light only.

**Working rules:** never hardcode a value — always `var(--sl-size-300)` rather than `24px` ·
a component's private tokens are prefixed `--_` inside `:host` and are **not public API** ·
tokens are edited in Figma through the Token Studio plugin, which emits JSON · build a theme
with `node scripts/build-themes.js` · **`core.json` is DEPRECATED** — use `system.json` +
`primitives.json` + `*-new.json`.

### F6 — The Custom Elements Manifest, and why it matters to an agent

`custom-elements.json` is generated by `scripts/build-metadata.js` using
`@custom-elements-manifest/analyzer`.

```json
{
  "schemaVersion": "1.0.0",
  "modules": [{
    "path": "src/button.ts",
    "declarations": [{
      "kind": "class",
      "name": "Button",
      "tagName": "sl-button",
      "description": "A single, simple button...",
      "attributes": [
        { "name": "variant", "type": { "text": "ButtonVariant" }, "description": "..." }
      ],
      "members": [
        { "kind": "field", "name": "disabled", "type": { "text": "boolean" } },
        { "kind": "method", "name": "reportValidity", "description": "..." }
      ],
      "events": [
        { "name": "sl-click", "type": { "text": "SlClickEvent" }, "description": "..." }
      ],
      "slots": [
        { "name": "", "description": "Text label of the button..." }
      ],
      "cssParts": [...],
      "cssProperties": [...]
    }]
  }]
}
```

**Custom CEM plugins** (`scripts/cem-plugins.js`):

| Plugin                  | What it does                                     |
| ----------------------- | ------------------------------------------------ |
| `litPlugin`             | reads Lit decorators (@property, @state, @query) |
| `eventDecoratorPlugin`  | parses @event → adds to `events[]`               |
| `methodAndFieldPlugin`  | extracts fields and methods separately           |
| `noPrivateFieldsPlugin` | strips `#private` and `@internal` from output    |
| `sortMembersPlugin`     | sorts alphabetically                             |
| `omitPlugin`            | removes unnecessary fields from the JSON         |

### F7 — Component stability is declared, per package

The `"status"` field in each component's `package.json`: **stable** — API frozen, semver
guaranteed · **preview** — API may change · **draft** — API unstable and may change
significantly · **deprecated** — slated for removal · absent — internal tooling (shared,
data-source).

The original document counted 22 stable, 9 preview and 19 draft. Re-counted 2026-10-05:
**29 stable, 7 preview, 16 draft**, 2 without a status.

### F8 — Thirteen recorded risks

Original numbering preserved so that anyone holding the Polish source can follow.

**Critical / architectural**

- **P1 — no dark mode for 19 of 20 themes.** Only `magister` has one. A problem for any product
  that requires dark mode.
- **P2 — the Angular wrapper covers 12 of 54 components**, form components only. The rest must
  be used natively or through custom wrappers.
- **P3 — the legacy token system still exists.** `core.json` is marked deprecated, but
  `build-themes.js` supports both the legacy `core` format and the new `*-new.json`. **Maintaining
  both may lead to divergence.**
- **P4 — no RTL.** `LocaleMixin` watches `<html lang>` but does not handle text direction, which
  blocks Arabic and Hebrew markets.

**Significant / technical**

- **P5 — timing race conditions.** `requestAnimationFrame` is used in `RovingTabindexController`,
  `ObserveAttributesMixin` and form-control registration. `Form` uses it to defer control
  registration, which can cause flicker under SSR or in fast tests.
- **P6 — the config system is incomplete.** `window.SLDSConfig` is polled every 100ms up to ten
  times — a polling mechanism with no schema, unused in practice.
- **P7 — `FocusGroupController` carries a TODO**: _"more specific query selection"_. May not work
  correctly with complex shadow DOM structures.
- **P8 — `EventEmitter` has no runtime validation.** `emit(value)` accepts both `T` and
  `T['detail']`, with no runtime type checking.
- **P9 — 19 components are `draft`.** Using them in production — calendar, combobox, drawer,
  virtual-list and others — risks breaking changes on a patch update.
- **P10 — few project ESLint rules.** Three custom rules only, and **none enforcing tokens over
  hardcoded CSS values**.

**Minor / to watch**

- **P11 — no generated `index.ts` for `shared/`.** Imports come from
  `@sl-design-system/shared/controllers.js`, `/mixins.js` and so on — inconsistent granularity,
  with possible import-path confusion.
- **P12 — `custom-elements.json` is not committed.** It is generated by `yarn dist` and absent
  from the repository, so CI/CD must generate it before deploying documentation.
- **P13 — only five locales**: en, es-ES, it, nl, pl. Missing de, fr, da, fi, sv — the last three
  relevant to Sanoma Utbildning.

### F9 — Developer infrastructure

```
yarn build
 ├── build:components:styles   (sass → *.scss.ts)
 ├── build:components          (esbuild TS → JS, not bundled)
 ├── build:themes              (Style Dictionary → CSS vars)
 ├── build:locales             (lit-localize → TS)
 └── build:types               (tsc --build, d.ts only)

yarn dist  (production, additionally)
 └── dist:components           (build-metadata.js → custom-elements.json) ← IMPORTANT for AI
```

**Tests:** Vitest 4.x with Playwright Chromium, headless — **a real browser, not JSDOM**. Setup
loads `sanoma-learning/light.css` plus chai-dom and sinon-chai. Fixture helper:
`@sl-design-system/vitest-browser-lit`. A single file runs with
`vitest packages/components/button/src/button.spec.ts`.

**Versioning:** Changesets, not Lerna or nx. Incremental versioning via GitHub Actions, published
to the **GitHub npm registry**. Six packages are excluded from versioning; internal dependencies
always take a patch bump.

### F10 — What the document proposed for an AI-facing contract

Its closing section is the most directly relevant part of the survey.

**Artifacts that already exist and can be used:** `custom-elements.json`, CEM 1.0, containing
attributes, properties, methods, events, slots, cssProperties and cssParts — _"this is the
foundation of the contract"_ · `package.json["status"]` for API stability ·
`package.json["version"]` · JSDoc comments, which feed CEM.

**What is missing:** usage examples, which CEM does not carry but `*.stories.ts` does ·
available visual variants, which live in Storybook `argTypes` as enum values · which `--sl-*`
properties a component accepts from outside versus which `--_private` ones it uses internally ·
**which components work together** — CEM does not describe that `form` and `text-field` are
related · which tokens each component actually uses.

The proposed per-component contract shape, and a CI/CD flow ending in a
`generate-ai-contracts.js` that reads each `custom-elements.json` plus its `package.json`,
optionally parses stories for examples and enum values, and aggregates into one
`all-components-api` file.

## What would change our mind

The survey is descriptive, so most of it can only be invalidated by the repository changing. Two
claims are time-sensitive and were already stale when re-checked: the **component status counts**
(22/9/19 then, 29/7/16 now) and the **version numbers** quoted for hub packages. Treat both as
samples, not as current state.

## Conclusion / recommendation

**A machine-readable component contract does not need to be authored — it needs to be
generated.** CEM already carries attributes, events, slots, cssParts and cssProperties; the gaps
are examples, enum values and inter-component relationships, and two of the three are recoverable
from Storybook.

The practical blocker is **P12**: `custom-elements.json` is not committed, so any consumer must
run the generator first.

## Open questions

1. Should CEM be committed, or generated on demand by every consumer? P12 states the problem and
   not the decision.
2. Can inter-component relationships be derived rather than authored — from `package.json`
   dependencies, or from which components appear together in stories?
3. Is `core.json` worth removing now, given P3, or does something still depend on it?

## Leads to

**P3 was borne out, and it cost the Figma-to-code batch directly.** The divergence it warned
about is real: the `--sl-text-*` namespace works, while `--sl-text-new-*` is declared **only as
longhands** and names a font family the provider does not register, so a `font:` shorthand
against it drops the whole declaration. **Six shipped components reference the broken namespace.**
Measured and recorded in
[`design-system-defects.md`](../NOJIRA-figma-to-code/design-system-defects.md). The risk was
written down before anybody met it, which is worth knowing about the value of surveys like this
one.

**F6 is an input to `T-NOJIRA-html-contract-00`.** `custom-elements.json` declares slots,
`cssParts` and `cssProperties` — exactly the component surface that pipeline runs have been
inferring from screenshots. One run gave `sl-avatar` an `icon` slot it does not have (it is
`fallback`); `sl-select` documents a `::part(selected-option)` that cannot match. Both are
declared facts rather than inferences, and the contract being drafted should consume CEM rather
than re-derive it. See [`what-to-do-next.md`](../NOJIRA-figma-to-code/what-to-do-next.md).

**F7 is a missing dimension in the run record.** No pipeline run has recorded whether it mapped a
design onto a `stable` or a `draft` component, and those carry different risk.

**F10 overlaps the metadata contract.** Anyone drafting that contract should read it first — it
is a prior proposal for the same artifact, and this effort has already twice re-derived a
document that existed.
