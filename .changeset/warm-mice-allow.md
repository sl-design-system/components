---
'@sl-design-system/checkbox': patch
---

Fix behavior to match native checkbox:
- If a checkbox has no value, the form value should be `"on"` when checked
- The value of the checkbox group should be an array of the form value of *all* checkboxes
- The form value will filter out any `null` values (so this change is not breaking)

This also fixes the inability to check a checkbox in a group that has no values.
