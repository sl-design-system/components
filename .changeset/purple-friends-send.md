---
'@sl-design-system/form': minor
---

Add new `validate-on-blur` option to `sl-form`.

When you set this option, fields validate when they lose focus.

With `validate-on-blur`, the form:

- shows an error when a required field is left empty,
- shows an error when a field has an invalid value (for example wrong format).

Default validation behavior does not change. It only changes when `validate-on-blur` is used.
