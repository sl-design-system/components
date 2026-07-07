---
'@sl-design-system/listbox': patch
---

Prevent scroll chaining from listboxes to the underlying page by containing overscroll on the listbox host. This fixes unstable scrolling and flickering options in virtualized combobox popovers when wheel scrolling at the end of the list.
