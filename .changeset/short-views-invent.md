---
'@sl-design-system/select': patch
---

The selected option's content is now rendered in the `sl-select-button`'s light DOM via a slotted element instead of being cloned into its shadow DOM,
ensuring proper style inheritance from the selected `sl-option` element.