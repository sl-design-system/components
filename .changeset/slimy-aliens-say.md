---
'@sl-design-system/date-field': patch
---

Fix `sl-date-field` behavior when `validate-on-blur` is enabled on the parent `sl-form`:

- The field is now correctly marked as dirty after user interaction, including partial date input and complete but invalid or out-of-range date input. This prevents required validation from being incorrectly suppressed on blur after the user has interacted with the field.
