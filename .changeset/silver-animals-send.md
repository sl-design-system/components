---
'@sl-design-system/number-field': patch
---

- Fix issue where the form value wasn't being set correctly when the value was a number.
- Fix number parser to remove any non essentials characters before parsing
- Fix missing `sl-change` and `sl-validate` events
- Change behavior so the formatted value is only updated when the value is programmatically changed, or when the input is blurred
- Move validation to new `updateInternalValidity()` hook
