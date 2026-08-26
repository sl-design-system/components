---
'@sl-design-system/button': minor
'@sl-design-system/button-bar': minor
'@sl-design-system/checkbox': minor
'@sl-design-system/combobox': minor
'@sl-design-system/date-field': minor
'@sl-design-system/editor': minor
'@sl-design-system/radio-group': minor
'@sl-design-system/select': minor
'@sl-design-system/switch': minor
'@sl-design-system/tag': minor
'@sl-design-system/time-field': minor
'@sl-design-system/toggle-button': minor
'@sl-design-system/tool-bar': minor
---

These components use the new `ElementInternalsMixin` for their `ElementInternals`. The `internals`
property has been renamed to `elementInternals`. The old `internals` property is still available as
a deprecated alias, so this is not a breaking change, but you should update your code, for example
in tests, to use `elementInternals` instead. Reading `internals` logs a deprecation warning to the
console in development builds.
