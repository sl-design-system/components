---
name: implement-design-angular
description: Angular implementation conventions for the /implement-design pipeline. Loaded on demand by component-implementer (and component-author) when the chosen framework is Angular.
---

# Implementing an SLDS-consuming component in **Angular**

This is the framework skill for **Angular** in the `/implement-design` pipeline. It maps the pipeline's design principles onto Angular idioms. The SLDS components themselves are Lit web components published as `@sl-design-system/*`; an Angular component **consumes** them (via the `@sl-design-system/angular` wrappers, or the raw custom elements). You are authoring an Angular component that reproduces the Figma design.

## Apply the shared design principles

These principles from `../implement-design/component-conventions.md` (relative to this skill's folder; the orchestrator also passes its absolute path) are framework-agnostic — follow them (ignore that file's Lit-specific mechanics: the `.css` + `{ type: 'css' }` import / no-build-step, `ScopedElementsMixin`, `Icon.register`, `@lit/localize`, `register.ts`, the `@event`/`EventEmitter` decorator):

- **Reproduce the design's content via data ownership** — the root/page component owns the data (a service / `HttpClient` fetch; a typed mock in an example with a comment) and passes subsets to **presentational** child components. Children don't fetch; the story/host doesn't fill in fixed design content.
- **Pass a cohesive "model" object, not many scalar props** — a child that renders several related fields takes **one typed object `@Input()`** (with an exported interface), the way a real app hands a child its slice of the domain model; split into separate inputs only for genuinely independent values. Use the **Shared Types / Contracts** from the decomposition verbatim. **The model holds data + stable keys only — no translated strings (localize in the template/component keyed off the key), no structural config (column/tab/option sets are constants in the component).**
- **Lists: be conservative** — a repeated row is usually a `<ul>`/`<li>` (or semantic list) + CSS with `@for`, not a component per row; build a row component only for genuine internal complexity.
- **Design tokens only** — no `var()` fallbacks; **light-mode semantic tokens** even for a dark design (theme switching handles dark); logical properties; prefer styling a component's `::part()` over wrapper `<div>`s.
- **No `<main>`** (host app owns it); **one `<sl-form>`** wrapping all controls + the action buttons, **colocated in the same component as the controls** (not a parent wrapping a child); **tabs** use `<sl-tab-group>` + `<sl-tab>` only (no `<sl-tab-panel>`), rendering the active tab's content on demand.
- **A basic Storybook story is authored during implementation** (before visual validation), and **Stage 5 scope follows the output location** — full test/docs/changeset set only for a published package; an example gets just the component + an enriched story.

## Angular component conventions

- **Standalone components** (`standalone: true`), one component per folder, kebab-case selector (app-prefixed, e.g. `app-course-settings-page`). Files: `<name>.component.ts`, `<name>.component.html`, `<name>.component.scss`.
- The SLDS elements are **custom elements**, so add `schemas: [CUSTOM_ELEMENTS_SCHEMA]` to the component, or import the matching wrapper components from `@sl-design-system/angular` (see `packages/angular` — wrappers re-emit events and proxy inputs via `CePassthrough`). Prefer the `@sl-design-system/angular` wrappers when one exists for the element; fall back to the raw custom element + `CUSTOM_ELEMENTS_SCHEMA` otherwise.
- **Inputs/Outputs**: presentational data in via `@Input()` (or `input()` signals on Angular ≥17); user actions out via `@Output() ... = new EventEmitter<…>()`. The root page emits the form-level events (save/cancel).
- **Templates**: bind SLDS element attributes/properties with Angular binding (`[heading]="…"`, `[value]="…"`, `(sl-change)="…"`). Component-owned children compose in the template; there is no scoped-registry concern (custom elements register globally via their `register.js` import — import `@sl-design-system/<x>/register.js` in `main.ts`/the component, or rely on the Angular wrapper's import).
- **Forms**: for a page of controls + actions, wrap them in a single `<sl-form>` and read its value / call `reportValidity()` via a `@ViewChild('form')` ref, or use Angular reactive forms bound to the SLDS controls — match the established pattern in `packages/angular/stories/forms.stories.ts`.
- **Styles**: `<name>.component.scss`, `ViewEncapsulation` default; SLDS design tokens as above. **Angular intentionally keeps `.scss`** (its compiler handles it) — the Lit `.css` + `{ type: 'css' }` import-attribute approach is a Vite/Lit-only mechanism and does **not** apply here. No build step beyond Angular's own.

## Icons

- Register FontAwesome icons the same way the app does (`Icon.register(faX)` from `@sl-design-system/icon` + `@fortawesome/pro-*-svg-icons`), typically once in app setup or in the component that renders `<sl-icon name="...">`.

## i18n (when enabled)

- Use Angular's built-in i18n: `i18n` attributes in templates (or `$localize` tagged strings in TS) with stable `@@id`s (e.g. `@@courseSettings.tabOverview`). Source locale `en`; a non-English design's strings become English sources with the original as a translation. Localize **in the displaying component, keyed off the model's data/keys** — don't pass translated text through `@Input()` models. Per-record free text (names/titles) is rendered directly.

## Build / verify

- Type-check / build with the Angular toolchain (`ng build` / the project's tsconfig). Run the Angular Storybook (`packages/angular` uses `ng run angular:storybook`) or the app's dev server for Stage 4 visual validation.
- Mirror existing patterns in `packages/angular/` (standalone components, `CePassthrough` wrappers, stories) — open a neighbour there before writing.

> This is the starting Angular convention set. If `packages/angular` reveals a more specific established pattern for a given concern, follow that and note any deviation in your report.
