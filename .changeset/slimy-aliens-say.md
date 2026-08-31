---
'@sl-design-system/date-field': patch
---

Fix `sl-date-field` behavior when `validate-on-blur` is enabled on the parent `sl-form`:

- The field is now correctly marked as dirty when the user enters any date part (day, month, or year), even if no complete date has been formed yet. Previously, only completing a full date would mark the field dirty, which caused the required error to be suppressed even after the user had started typing.
