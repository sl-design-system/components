---
'@sl-design-system/checkbox': patch
---

Fix `sl-checkbox` blur behavior:

- Emit `sl-blur` only when focus leaves the checkbox component.
- Keep focus behavior stable when moving focus inside the component.
