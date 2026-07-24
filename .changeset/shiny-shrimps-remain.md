---
'@sl-design-system/combobox': patch
---

Improved keyboard focus behavior for removable selected tags in multi-select comboboxes. Focus now stays within the selected tag list when removing tags one by one and only returns to the input after the last tag is removed. The combobox also avoids showing a separate fake tag focus indicator when focus is on a tag remove button
