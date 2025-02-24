---
'@sl-design-system/listbox': patch
---

Add ability to render grouped items using lit-virtualizer:
- New `optionGroupPath` property to specify the path to the group name in the option object
- New `<sl-option-group-header>` component to render the group header
- Add `items` property for advanced customization of how options are rendered (used in combobox)
- Add `scrollToIndex(index: number)` method to scroll to a specific index in the listbox
