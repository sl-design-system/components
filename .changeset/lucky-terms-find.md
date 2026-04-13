---
'@sl-design-system/format-date': patch
---

Fix for empty `date-style` and `time-style` attributes

Previously, setting `date-style` or `time-style` to an empty string would cause an error due to invalid formatting options being passed to `Intl.DateTimeFormat`. This update ensures that empty string values are treated as `undefined`, allowing the component to fall back to default formatting behavior without throwing an error.
