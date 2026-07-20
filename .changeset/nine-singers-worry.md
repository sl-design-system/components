---
'@sl-design-system/combobox': patch
'@sl-design-system/tag': patch
---

Improved keyboard and screen reader behavior for removable tags in comboboxes and tag lists. Comboboxes no longer move fake focus from the input to selected tags with Left/Right arrow keys, while tag navigation remains available once focus is inside the tag list. The hidden tag-list navigation instructions are now `aria-hidden` while still being exposed through `aria-describedby`.
