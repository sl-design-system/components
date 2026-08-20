---
'@sl-design-system/button-bar': patch
'@sl-design-system/calendar': patch
'@sl-design-system/card': patch
'@sl-design-system/checkbox': patch
'@sl-design-system/combobox': patch
'@sl-design-system/editor': patch
'@sl-design-system/emoji': patch
'@sl-design-system/form': patch
'@sl-design-system/listbox': patch
'@sl-design-system/message-dialog': patch
'@sl-design-system/paginator': patch
'@sl-design-system/panel': patch
'@sl-design-system/radio-group': patch
'@sl-design-system/text-area': patch
'@sl-design-system/time-field': patch
'@sl-design-system/toggle-button': patch
'@sl-design-system/toggle-group': patch
'@sl-design-system/tree': patch
---

Declare dependencies that were previously missing from `package.json`

These packages imported modules they never declared, relying on those packages happening to be present in the monorepo's hoisted `node_modules`. That works inside this repository, but it leaves consumers to install the transitive dependencies themselves, and it breaks under strict installers such as pnpm or Yarn PnP.

Newly declared runtime dependencies:

- `calendar`, `combobox`, `listbox`, `message-dialog`, `time-field` → `@sl-design-system/shared`
- `card` → `@sl-design-system/menu`, `@sl-design-system/toggle-button`
- `emoji` → `@sl-design-system/search-field`, `@sl-design-system/tabs`
- `form` → `@sl-design-system/icon`
- `paginator` → `@sl-design-system/data-source`, `@sl-design-system/listbox`
- `panel`, `toggle-button` → `@sl-design-system/button`
- `tree` → `@sl-design-system/menu`

Newly declared peer dependencies:

- `card`, `checkbox`, `editor`, `radio-group`, `toggle-group` → `@open-wc/scoped-elements`
- `text-area`, `time-field`, `tree` → `@lit/localize`
- `paginator` → `lit`

Existing dependency ranges were also brought up to date: `editor` on `@sl-design-system/form` and `@sl-design-system/shared`, `emoji` and `form` on `@sl-design-system/shared`, and `tree` on `@sl-design-system/skeleton`.
