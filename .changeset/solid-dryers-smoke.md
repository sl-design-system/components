---
'@sl-design-system/button': minor
---

Add helper functions for inspecting `sl-button` accessible state. Import from `@sl-design-system/button/helpers.js`.

| Function                               | Description                                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `getButtonAccessibleName(button)`      | Resolves the accessible name following: `aria-labelledby` → `aria-label` → slotted text content.                    |
| `getButtonDescription(button)`         | Resolves the accessible description following: `aria-describedby` → `aria-description`.                             |
| `isButtonDisabled(button)`             | Returns `false`, `true` (natively disabled), or `'aria'` (disabled via `aria-disabled`).                            |
| `getButtonAriaAttribute(button, name)` | Returns the value of a given ARIA attribute from the inner `<button>` where `ProxyAriaAttributesMixin` forwards it. |
