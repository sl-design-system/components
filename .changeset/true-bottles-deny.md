---
'@sl-design-system/menu': minor
---

Add helper functions for inspecting `sl-menu-button` accessible state. Import from `@sl-design-system/menu/helpers.js`.

| Function                                  | Description                                                                                        |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `getMenuButtonAccessibleName(menuButton)` | Resolves the accessible name following: `aria-labelledby` → `aria-label` → slotted button content. |
| `getMenuButtonDescription(menuButton)`    | Resolves the accessible description following: `aria-describedby` → `aria-description`.            |
| `isMenuButtonDisabled(menuButton)`        | Returns `false`, `true` (natively disabled), or `'aria'` (disabled via `aria-disabled`).           |
