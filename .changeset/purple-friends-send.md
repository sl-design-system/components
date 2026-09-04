---
'@sl-design-system/form': minor
---

Add new `validate-on-blur` option to `sl-form`.

When you set this option, fields validate when they lose focus.

With `validate-on-blur`, the form:

- shows an error when a field has an invalid value (for example wrong format) after the user leaves it,
- skips required errors on blur only for pristine empty fields (for example when users only tab through). Required fields with non-empty invalid values still show errors on blur.

The last point is intentional: keyboard and screen reader users often tab through a form to learn its structure. Showing required errors on untouched fields would interrupt that flow with unexpected announcements.

Fields that were never interacted with are still validated when `reportValidity()` is called, for example on form submit.

Default validation behavior does not change. It only changes when `validate-on-blur` is used.
