---
'@sl-design-system/number-field': patch
---

Fix `sl-number-field` so custom validity messages set externally via `setCustomValidity(...)` are preserved when `reportValidity()` runs. This prevents internal validity updates from clearing user-defined errors. Also adds a regression test for this behavior
