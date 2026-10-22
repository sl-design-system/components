---
'@sl-design-system/shared': patch
---

Handle removed attributes in `dateListConverter` so removing a calendar's `range` or `disabled-dates` attribute clears the value without throwing.
