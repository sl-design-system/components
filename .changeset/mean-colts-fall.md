---
'@sl-design-system/combobox': patch
---

Fix `sl-combobox` validation behavior when `validate-on-blur` is enabled on the parent `sl-form`:

- Keyboard deselecting the last selected option in a required single or multiple combobox now shows the invalid state immediately, without needing to move focus elsewhere first.
