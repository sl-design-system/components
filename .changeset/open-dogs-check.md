---
'@sl-design-system/combobox': patch
'@sl-design-system/tag': patch
---

Fixed stacked tag lists and multi-select comboboxes so at least one selected tag remains visible and removable when selected values overflow. Long visible tags are now constrained and truncated instead of being hidden entirely behind the stack counter, and comboboxes no longer create a large gap between the visible tags and the input caret when stacking is active.
