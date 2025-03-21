---
'@sl-design-system/checkbox': patch
---

Fix the issue with infinite loop when there is a null value. Prevent unnecessary updates, when the value changes in the checkbox-group.
