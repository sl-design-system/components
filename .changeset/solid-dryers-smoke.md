---
'@sl-design-system/shared': minor
---

Add helper functions for inspecting accessible state of elements using `ForwardAriaMixin`. Import from `@sl-design-system/shared/helpers/forward-aria.js`.

| Function                               | Description                                                                                               |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `getForwardedAccessibleName(host)`     | Resolves the accessible name following: `aria-labelledby` → `aria-label` → slotted text content.          |
| `getForwardedDescription(host)`        | Resolves the accessible description following: `aria-describedby` → `aria-description`.                   |
| `isForwardedDisabled(host)`            | Returns `false`, `true` (natively disabled), or `'aria'` (disabled via `aria-disabled`).                  |
| `getForwardedAriaAttribute(host, name)`| Returns the value of a given ARIA attribute from the forwarding target where `ForwardAriaMixin` forwards it. |
| `getForwardedAriaProperty(host, name)` | Returns the value of a given ARIA property (e.g. `ariaLabelledByElements`) from the forwarding target.    |
