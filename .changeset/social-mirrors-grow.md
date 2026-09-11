---
'@sl-design-system/time-field': patch
---

Fix `sl-time-field` behavior when `validate-on-blur` is enabled on the parent `sl-form`:

- The field is now correctly marked as dirty when the user enters any time part (hour or minute), even if no complete time has been formed yet. Previously, only completing a full time value would mark the field dirty, which caused the required error to be suppressed even after the user had started typing.
