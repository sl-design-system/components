---
'@sl-design-system/calendar': patch
'@sl-design-system/date-field': patch
---

Normalize date time components when generating calendar days and validating `min`/`max` boundaries so `min` and `max` dates remain selectable regardless of the time of day on `value`, `selected`, `month`, `min`, or `max`.
