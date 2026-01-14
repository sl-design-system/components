---
'@sl-design-system/select': patch
---

Fixes styling inheritance issue in `sl-select-button` when an `sl-option` is selected.
The `sl-select-button` has been moved from the shadow DOM to the light DOM to ensure proper style inheritance from the selected `sl-option` element.