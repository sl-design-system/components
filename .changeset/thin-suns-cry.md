---
'@sl-design-system/select': patch
---

Prevent the select from closing when interacting with the listbox surface (including scrollbar area) by handling `mousedown` on the listbox element itself and preventing focus from moving off the trigger.
