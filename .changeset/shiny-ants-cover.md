---
'@sl-design-system/combobox': patch
---

Various combobox fixes:
- Add `aria-owns` for linking the input to the listbox
- Add `aria-posinset` and `aria-setsize` to the listbox options for virtual lists
- Add focus style to tags
- Remove `aria-current` from the listbox options (invalid usage of the attribute)
- Improve keyboard navigation between the input and the tags using the left/right arrow keys
- Fix the listbox popover not having the correct size on WebKit
- Fix VoiceOver not announcing any option navigation after the first/last selection
