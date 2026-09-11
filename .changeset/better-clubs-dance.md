---
'@sl-design-system/radio-group': patch
---

Fix `sl-radio-group` blur behavior:

- Emit `sl-blur` only when focus leaves the radio group.
- Keep focus behavior stable when moving focus inside the group (for example with arrow keys).
