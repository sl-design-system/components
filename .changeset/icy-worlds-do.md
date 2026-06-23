---
'@sl-design-system/combobox': patch
---

Fix combobox selection matching when option values and the combobox value use different primitive types.

The combobox now treats primitive values such as `1` and "1" as equivalent when resolving selected options. This prevents the selected option from being cleared when a value is provided as a string while the matching `sl-option` value is a number.
