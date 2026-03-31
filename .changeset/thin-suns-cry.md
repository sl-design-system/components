---
'@sl-design-system/select': patch
---

Prevent the select from closing when clicking the native scrollbar of the listbox by adding a `mousedown` listener to the listbox that prevents the focus from moving off the trigger
