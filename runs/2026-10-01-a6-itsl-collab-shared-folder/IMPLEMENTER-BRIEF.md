## Shared constraints — case A6, every implementer

Repo root: /Users/marcin.ludwig/Repo/sl-design-system/components
Framework **lit** · i18n **off** (no `msg()`, no `@lit/localize`) · theme **itslearning**.
Output root: `examples/lit/src/_runs/a6-itsl-collab-shared-folder/` — an **example**, so:
no `package.json`, no `register.ts`, no `src/` nesting, no website docs, no changeset, no spec.
Component + `.css` + (root only) `.stories.ts` co-located. Mirror
`runs/2026-10-01-b-itsl-collab-add-element/generated/` for file shape.

Read: `.implement-design/a6-itsl-collab-shared-folder/manifest.md` (geometry + icons + annotations)
and `token-reference.md` (authoritative tokens). Reference image: `screenshot.png` (1280 × 1335).

### Hard rules, each learned the expensive way

1. **Tags and events are namespaced `sl-a6-*`.** A sibling run on the _same Figma file_ already
   registers `sl-add-element-page` globally, and the guarded-registration house style converts a
   collision into a silent mis-render rather than a throw.
2. **Only the root calls `customElements.define`** (guarded). Children are wired through
   `ScopedElementsMixin`'s `scopedElements` map.
3. **The story needs a separate bare `import './thing.js';`.** A value import whose binding is
   used only in a type position is elided, the module never runs, and `customElements.define`
   never happens — Storybook then renders an unknown element with no shadow root and the type
   check still passes. This is the single most common way a run's Stage 4 silently fails.
4. **Styles are plain `.css` imported with `{ type: 'css' }`.** No `.scss`, no build step.
5. **Never `font:` shorthand against a `--sl-text-new-*` family.** This theme ships **zero** bare
   shorthands — only longhands — so the shorthand drops the whole declaration. Write
   `font-family` / `font-size` / `line-height` / `font-weight` separately. `heading-*` has no
   `-fontWeight` longhand: add `var(--sl-fontWeight-bold)` (700) explicitly.
   `--sl-text-new-typeset-fontWeight-semiBold` is **600** and is not Figma's Bold.
6. **`--sl-size-borderWidth-default` is 2px in this theme.** The 1px card / row hairlines need
   `--sl-size-borderWidth-subtle`. The 2px search / select / checkbox / outline-button borders
   correctly use `-default`.
7. **Icons: only names registered in `packages/themes/itslearning/icons.ts`.** Never import
   `@fortawesome/*` — it is absent, so it is a **render** blocker, not just a type error. Never
   stub the module. Never hand-draw a replacement SVG. A missing glyph is **omitted with its
   footprint preserved** (an empty box of the right size, `aria-hidden`) and recorded.
8. **No stub may make a gate pass.** The Stage 3 gate is
   `node runs/harness/typecheck.mjs --scope examples/lit/src/_runs/a6-itsl-collab-shared-folder`;
   only `inScope` and `regressionsOutsideScope` are yours. Baseline is 2 upstream errors in
   `packages/components/grid/src/grid.ts` — tolerated by name, never "fixed".
9. **Every raw length must name its cause and show the arithmetic** in a comment. A fix that
   introduces a constant fitted to a measurement is rejected. If a number is derived
   (728 − 2×32 = 664), write the derivation.
10. **Touch no shared files.** No `examples/lit/package.json`, no `yarn install`, no
    `yarn extract-i18n`, no git command that writes. The six `@sl-design-system/*` packages are
    already linked in `node_modules/`.
11. **Do not render** the two a11y `Heading` annotation overlays (`4571:8205`, `4571:8212`) or any
    node the manifest lists as hidden.
12. Token names must be greppable in `packages/themes/itslearning/`. The run gate is
    `node runs/harness/check-tokens.mjs --scope <scope> --theme itslearning`.

### Where things are

- Manifest (geometry, icons, annotations, decomposition, 31 open questions):
  `.implement-design/a6-itsl-collab-shared-folder/manifest.md`
- Authoritative token table: `.implement-design/a6-itsl-collab-shared-folder/token-reference.md`
- Reference image (1280 × 1335, **no canvas bleed**):
  `.implement-design/a6-itsl-collab-shared-folder/screenshot.png`
- Verbatim Figma output, in three parts (your component's exact geometry is in here —
  grep for its `data-node-id`): `figma-design-context.md`, `-part2.md`, `-part3.md`
- Framework skill: `tools/implement-design-plugin/skills/implement-design-lit/SKILL.md`
- Conventions: `tools/implement-design-plugin/skills/implement-design/component-conventions.md`
- **Pattern to mirror** (same Figma file, same theme, finished and reviewed):
  `runs/2026-10-01-b-itsl-collab-add-element/generated/`

### Shape of every child component

```ts
export class Thing extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap { return { 'sl-button': Button }; }
  /** @internal */
  static override styles: CSSResultGroup = styles;      // import styles from './thing.css' with { type: 'css' }
  @property({ attribute: false }) model?: ThingModel;    // ONE cohesive typed object
  override render(): TemplateResult { … }
}
```

- `:host { display: block }` (or `grid`/`flex`) — a custom element defaults to `display: inline`
  and an inline host silently breaks block layout. The sibling run shipped this bug as C4.
- **Children do NOT register themselves.** No `customElements.define` outside the root.
- Events via the `@event` decorator from `@sl-design-system/shared` (defaults to
  `{bubbles: true, composed: true}`, so a child's event reaches the root unaided — never re-emit
  a child's event from its parent, and never declare the same event name twice).
- Export every model interface and event-type alias your parent needs.
- Structural config (column sets, option lists, tab lists, icon maps, label maps) lives as
  `const` **inside** the component. The model carries data and stable keys only.

### Icons registered in this theme (the only 54 names `sl-icon` can resolve)

`angle-down arrow-left arrow-right arrow-up-right-from-square badge-available badge-away
badge-donotdisturb badge-offline breadcrumb-separator calendar caret-down-solid caret-left-solid
caret-right-solid check check-solid chevron-down chevron-left chevron-right circle-check-solid
circle-exclamation-solid circle-solid circle-xmark circle-xmark-solid clock dash-solid
diamond-exclamation-solid ellipsis ellipsis-down ellipsis-vertical envelope error eye face-smile
fav grip-lines hand home-blank info menu minus mobile octagon-exclamation-solid octagon-xmark-solid
pinata plus search smile sort sort-down sort-up square-arrow-up-right star
triangle-exclamation-solid xmark`

**Needed but absent — omit, preserve the footprint, record:** `bell`, `comment`,
`graduation-cap`, `shared-folders`, `docx`/`xlsx`/`pptx`, `arrow-turn-down-right`, `download`,
`trash`, `users`, `pen-ruler`, and the `itslearning-logo-symbol` brand asset.
