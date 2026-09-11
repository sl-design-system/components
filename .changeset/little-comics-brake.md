---
'@sl-design-system/checkbox': patch
---

Fix `sl-checkbox` and `sl-checkbox-group` blur and validation behavior:

- Emit `sl-blur` only when focus truly leaves the component, not when moving between elements inside it (for example between checkboxes in a group).
- When `validate-on-blur` is enabled on the parent `sl-form`: unchecking a required checkbox or removing the last selection in a required checkbox group with the mouse now shows the invalid state immediately, without needing to click elsewhere first.
