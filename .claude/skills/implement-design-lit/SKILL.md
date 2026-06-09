---
name: implement-design-lit
description: Lit/LitElement implementation conventions for the /implement-design pipeline. Loaded on demand by component-implementer (and component-author) when the chosen framework is Lit.
---

# Implementing an SLDS component in **Lit**

This is the framework skill for **Lit** in the `/implement-design` pipeline. The full, detailed Lit conventions live in **`.claude/skills/implement-design/component-conventions.md`** — read that file; it is the authoritative Lit reference. This skill is a checklist of the Lit-specific essentials it covers.

## Scaffolding

- A component is a package folder (`packages/components/<name>/` in the monorepo, or a folder under the chosen app/example path) with `package.json`, `tsconfig.json`, `index.ts` (re-export), `register.ts` (`customElements.define`), `src/<name>.ts`, `src/<name>.scss`. Copy boilerplate from a neighbour; use `.js` import specifiers.
- Register the package in `tsconfig.all.json` **only** when it's in the SLDS monorepo.

## The element

- `extends LitElement`; `@property({ reflect: true })` for attributes that drive selectors; exported string-union types for enums; full JSDoc.
- **Scoped custom elements**: a component that renders other custom elements in its shadow uses `ScopedElementsMixin(LitElement)` + `static scopedElements`; child components used only inside a parent do **not** `customElements.define` — only the root/public component registers globally.
- Accessibility: `formAssociated` / `FormControlMixin` for value-holding controls; `ForwardAriaMixin` to forward `aria-*`. Never `<main>`/`role="main"`.

## Styles

- `src/<name>.scss` compiled to `<name>.scss.ts` via `node scripts/build-styles.js '<base>/**/*.scss'`; the class imports `./<name>.scss.js`.
- Design tokens only — **no `var()` fallbacks**, **light-mode semantic tokens** even for dark designs, logical properties. Prefer styling a component's `::part()` over wrapper `<div>`s.

## Icons

- Every `<sl-icon name="...">` needs `Icon.register(faX)` (import `faX` from `@fortawesome/pro-*-svg-icons`) at module load in the component that renders it.

## Forms

- A single `<sl-form>` wraps all controls **and** the action bar — and lives in the **same component** as the controls (don't wrap a child component in a parent-level form; that yields a separate/dummy form). Manage it with a **`FormController<T>(this)`** on that component — give each control a `name`, set the whole value from the component's `value` input (`this.#form.value = this.value` in `updated()`), and read `this.#form.value` / `reportValidity()` / `reset()` for the buttons. **Never bind `.value` per field.** The data-owner parent passes the initial `value` in and handles the form component's emitted save/cancel events.

## i18n (when enabled)

- `import { localized, msg } from '@lit/localize';`, `@localized()` on the class, every user-visible string as `msg('<English>', { id: '<sl.namespaced.id>' })`.

## Tests / Stories / Docs (Stage 5)

- Vitest browser tests via `fixture`; Storybook stories (`@storybook/web-components-vite`), page components set `parameters: { layout: 'fullscreen' }`; website docs under `website/`; a changeset.

## Build / verify

- Build styles, then `npx tsc -p <base>/tsconfig.json --noEmit`. Run the dev server with `yarn start`.

See `component-conventions.md` for the full detail of every point above (data ownership, single `<sl-form>`, tab lazy-load with `sl-tab-group`+`sl-tab` only, reproduce-the-design content fidelity, naming).
