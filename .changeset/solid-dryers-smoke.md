---
'@sl-design-system/shared': minor
---

Add helper functions for inspecting accessible state of elements using `ProxyAriaAttributesMixin`. Import from `@sl-design-system/shared/helpers/proxy-aria-attributes.js`.

| Function                              | Description                                                                                                     |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `getProxiedAccessibleName(host)`      | Resolves the accessible name following: `aria-labelledby` → `aria-label` → slotted text content.                |
| `getProxiedDescription(host)`         | Resolves the accessible description following: `aria-describedby` → `aria-description`.                         |
| `isProxiedDisabled(host)`             | Returns `false`, `true` (natively disabled), or `'aria'` (disabled via `aria-disabled`).                        |
| `getProxiedAriaAttribute(host, name)` | Returns the value of a given ARIA attribute from the proxy target where `ProxyAriaAttributesMixin` forwards it. |
| `getProxiedAriaProperty(host, name)`  | Returns the value of a given ARIA property (e.g. `ariaLabelledByElements`) from the proxy target.               |
