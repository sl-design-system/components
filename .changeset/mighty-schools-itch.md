---
'@sl-design-system/date-field': patch
---

Fixes the issue where pressing the `Escape` key inside the date picker (calendar) closes parent containers (such as dialogs).
Prevents the Escape key event from bubbling up, so pressing Escape inside the date field does not close the dialog (or other parent container).
