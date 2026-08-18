---
'@sl-design-system/button': major
'@sl-design-system/button-bar': major
'@sl-design-system/checkbox': major
'@sl-design-system/combobox': major
'@sl-design-system/date-field': major
'@sl-design-system/editor': major
'@sl-design-system/radio-group': major
'@sl-design-system/select': major
'@sl-design-system/switch': major
'@sl-design-system/tag': major
'@sl-design-system/time-field': major
'@sl-design-system/toggle-button': major
'@sl-design-system/tool-bar': major
---

These components use the new `ElementInternalsMixin` for their `ElementInternals`. The `internals`
property has been renamed to `elementInternals`; if you relied on it, for example in tests, you
need to update your code.
