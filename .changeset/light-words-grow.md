---
'@sl-design-system/select': patch
---

Fix `sl-select` blur behavior:

- Emit `sl-blur` after clear when focus leaves the field.
- Emit `sl-blur` when clicking outside.
