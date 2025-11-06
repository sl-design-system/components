---
'@sl-design-system/time-field': patch
---

Multiple fixes:
- For `required` time-field, native validation message is now used. The custom message "Please enter a time." appears only when the entered value is not a valid time.
- Fixed an issue where the dialog time picker value did not update when the user typed a new value.