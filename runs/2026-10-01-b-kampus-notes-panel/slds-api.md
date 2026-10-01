# SLDS component API reference for this run

There is **no Code Connect snippet** for any node in this design, so these were read from source.
Use only the literal values listed — do not invent a variant.

## `sl-button` (`Button`, `@sl-design-system/button`)

- `fill`: `'solid' | 'outline' | 'link' | 'ghost'`
- `shape`: `'rect' | 'pill'`
- `size`: `'sm' | 'md' | 'lg'`
- `variant`: `'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'inverted'`
- `type`: `'button' | 'reset' | 'submit'`
- `disabled`: boolean · `tooltip`: string
- Default slot = label. An icon-only button is `<sl-button fill="ghost"><sl-icon name="x"></sl-icon></sl-button>`
  and **needs an `aria-label`** — there is no visible text to name it.

## `sl-checkbox` (`Checkbox`)

- `checked`, `indeterminate`, `disabled`, `required`: boolean
- `size`: `'sm' | 'md' | 'lg'` · `description`: string · `value`: T
- Default slot = label text. Emits `sl-change`.

## `sl-switch` (`Switch`) — the "Student view" toggle

- `checked`, `disabled`, `reverse`: boolean
- `size`: `'sm' | 'md' | 'lg'`
- `iconOn` / `iconOff` (attributes `icon-on` / `icon-off`): icon names
- Default slot = label. `reverse` puts the label before the control.
  The design shows the control **left**, label right — that is the default, so no `reverse`.

## `sl-breadcrumbs` (`Breadcrumbs`)

- Crumbs are **slotted `<a>` elements**, not a property:
  ```html
  <sl-breadcrumbs><a href="…">Start page</a><a href="…">Chapter 1</a></sl-breadcrumbs>
  ```
- It renders its **own home link and its own separators**. `no-home` suppresses the home link;
  `hide-home-label` keeps the icon only; `home-url` sets its target; `inverted` for dark grounds.
- **It has a built-in collapse behaviour** (see its `Collapse` story) that folds middle crumbs into
  a popover past a width threshold. If crumbs go missing at 1280px that is this feature, not a CSS
  bug — read its source before touching styles.
- The design shows "Start page › Chapter 1" with **no** home icon → use `no-home`.

## `sl-badge` (`Badge`) — the "3" and "1" number tags

- `color`: `'blue' | 'green' | 'grey' | 'orange' | 'purple' | 'red' | 'teal' | 'yellow'`
- `emphasis`: `'subtle' | 'bold'` · `size`: `'sm' | 'md' | 'lg'`
- `variant`: `'neutral' | 'primary' | 'info' | 'danger' | 'success' | 'warning' | 'accent'`
- It is **inline only** — it does not anchor or position itself over another element. The design's
  bell badge and toolbar badges are absolutely positioned overlays, so the **parent** must provide
  `position: relative` and place the badge. That is composition, not reaching past the API.
- Design colour is `#DB7109`; `color="orange"` is the closest family. Record the delta.

## `sl-icon` (`Icon`)

- `<sl-icon name="chevron-right"></sl-icon>` — **no import, no `Icon.register`**; the kampus
  theme's `setup()` registers the whole set. See `token-map.md` for the 55 available names.

## ScopedElementsMixin — the trap that cost an earlier run its whole render

If a component uses `ScopedElementsMixin`, it gets a **private** element registry, and any tag not
listed in its `scopedElements` map is **not** resolved against the global registry — it renders as
an inert unknown element with no shadow root. The capture looks plausible and the page is empty.

So a root that uses the mixin must list **every** child tag, including this run's own components
even though each registers itself globally:

```ts
static override get scopedElements(): ScopedElementsMap {
  return {
    'sl-button': Button,
    'sl-icon': Icon,
    'sl-kampus-note-card': NoteCard   // ← own components too
  };
}
```

The simpler alternative, which this run prefers for its own components: **do not use
`ScopedElementsMixin`** on the run's components; let each module `customElements.define` itself
(guarded) and import the child module for its side effect.

## The story must import its component for the side effect

`import { type Thing } from './thing.js'` is **erased** at compile time — the module never runs and
`customElements.define` never happens. The type check passes either way, which is why nothing in
the pipeline catches it. Add a plain:

```ts
import './thing.js';
```
