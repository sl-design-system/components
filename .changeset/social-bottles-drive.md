---
'@sl-design-system/calendar': patch
---

Fix `autofocus` behavior

This fix ensures that when a calendar is focused, it focuses the correct day. By default it will focus the current day, but if a date is already selected it will focus that one instead.
