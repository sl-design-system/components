---
name: implement-design-lit
description: Lit/LitElement implementation conventions for the /implement-design pipeline. Loaded on demand by component-implementer (and component-author) when the chosen framework is Lit.
---

# Implementing an SLDS component in **Lit**

This is the framework skill for **Lit** in the `/implement-design` pipeline. The full, detailed Lit conventions live in **`../implement-design/component-conventions.md`** (relative to this skill's folder; the orchestrator also passes its absolute path) — read that file; it is the authoritative Lit reference. This skill is a checklist of the Lit-specific essentials it covers.

## Scaffolding

- A **published package** (`packages/components/<name>/`) has `package.json`, `tsconfig.json`, `index.ts` (re-export), `register.ts` (`customElements.define`), `src/<name>.ts`, `src/<name>.css`, `src/<name>.stories.ts`. An **example** (folder under the chosen app/example path) is lighter — `.ts` + `.css` + `.stories.ts` co-located, sharing the example's existing `index.ts`/`tsconfig.json`; no `package.json`/`register.ts`. Copy boilerplate from a neighbour; use `.js` import specifiers for `.ts` modules.
- Register the package in `tsconfig.all.json` **only** when it's a new package in the SLDS monorepo.

## The element

- `extends LitElement`; `@property({ reflect: true })` for attributes that drive selectors; exported string-union types for enums; full JSDoc.
- **Scoped custom elements**: a component that renders other custom elements in its shadow uses `ScopedElementsMixin(LitElement)` + `static scopedElements`; child components used only inside a parent do **not** `customElements.define` — only the root/public component registers globally.
- Accessibility: `formAssociated` / `FormControlMixin` for value-holding controls; `ForwardAriaMixin` to forward `aria-*`. Never `<main>`/`role="main"`.

## Events

- Emit with the **`@event` decorator + `EventEmitter`** from `@sl-design-system/shared` — **never** hand-roll `new CustomEvent(...)` + `this.dispatchEvent(...)`. Export a `CustomEvent` type alias (`export type SlSaveEvent = CustomEvent<{ value: T }>;`, `CustomEvent<void>` when no detail), add it to `GlobalEventHandlersEventMap` in the file's `declare global`, declare the emitter (`@event({ name: 'sl-save' }) saveEvent!: EventEmitter<SlSaveEvent>;`), and fire it via `this.saveEvent.emit(detail)` (or `.emit()` for void). `emit` already defaults to `bubbles: true, composed: true`. Mirror `packages/components/tabs`, `tree`, or `form`.

## Styles

- Plain **`.css`** (not `.scss`), imported via an import attribute: `import styles from './<name>.css' with { type: 'css' };` → `static override styles = styles;`. **No build step, no `.scss.ts`** — Storybook/Vite and the example `tsdown` build transform the `{ type: 'css' }` import into a `CSSStyleSheet` (typed by `vite-env.d.ts`), and `.css` edits **hot-reload** in the running dev server (no restart).
- Design tokens only — **no `var()` fallbacks**, **light-mode semantic tokens** even for dark designs, logical properties. Prefer styling a component's `::part()` over wrapper `<div>`s.
- A `--sl-text-new-*` token is a `font:` **shorthand** that resets `font-weight` to `normal` — add an explicit `font-weight: var(--sl-fontWeight-600|700)` after it for any semibold/bold text (otherwise headings/badges render un-bold).

## Icons

- Every `<sl-icon name="...">` needs `Icon.register(faX)` (import `faX` from `@fortawesome/pro-*-svg-icons`) at module load in the component that renders it.

## Forms

- A single `<sl-form>` wraps all controls **and** the action bar — and lives in the **same component** as the controls (don't wrap a child component in a parent-level form; that yields a separate/dummy form). Manage it with a **`FormController<T>(this)`** on that component — give each control a `name`, set the whole value from the component's `value` input (`this.#form.value = this.value` in `updated()`), and read `this.#form.value` / `reportValidity()` / `reset()` for the buttons. **Never bind `.value` per field.** The data-owner parent passes the initial `value` in and handles the form component's emitted save/cancel events.

## i18n (when enabled)

- **Reference:** Lit's own localization guide — <https://lit.dev/docs/localization/overview/> (covers `@lit/localize`, `msg()`, `@localized()`, runtime vs. transform mode, and `lit-localize` extraction). Consult it when unsure about the API.
- `import { localized, msg } from '@lit/localize';`, `@localized()` on every component that shows text, every user-visible label as `msg('<English>', { id: '<sl.namespaced.id>' })` **in that component's own `render`**.
- **Models carry data + stable keys, not translated strings.** Localize in `render` keyed off the model value via a **`switch` returning a literal `msg()` per case** — `msg()` requires a LITERAL source string **and** literal `id` (lit-localize extracts statically); `msg(map[key].en, { id: map[key].id })` silently fails to extract. Never accept a pre-translated `label`/`title` through a `@property` model. Per-record free text (names, titles from the data) is rendered directly. A non-English design renders its English source at runtime until the translated locale is loaded — expected.
- **Structural config** (column sets, fixed tabs, option lists) is a local constant in the component, not a model input.

## Stories (authored during implementation)

- Write a basic Storybook story (`@storybook/web-components-vite`) **as part of implementing the component** — before visual validation, which needs it to render. Page components set `parameters: { layout: 'fullscreen' }`. Stage 5 adds variant stories.

## Tests / Docs / Changeset (Stage 5) — only for published packages

- For a `packages/components/*` package: Vitest browser tests via `fixture`, website docs under `website/`, and a changeset. For an **example/app** target, skip these — produce only the component + story (match the neighbouring examples).

## Build / verify

- No style build step. Just `npx tsc -p <base>/tsconfig.json --noEmit`. Run the dev server with `yarn start`; `.css` and template edits hot-reload — **do not restart Storybook** to pick up changes.

See `component-conventions.md` for the full detail of every point above (data ownership, single `<sl-form>`, tab lazy-load with `sl-tab-group`+`sl-tab` only, reproduce-the-design content fidelity, naming).
