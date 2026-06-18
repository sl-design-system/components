---
'@sl-design-system/combobox': patch
'@sl-design-system/listbox': patch
---

Accessibility improvements: improve screen reader support for combobox and listbox components

- Set `aria-activedescendant` when the popover opens so screen readers announce the current option immediately
- Set `aria-activedescendant` on mouse-open so AT context is maintained without applying a visual highlight
- Remove non-standard `aria-owns` attribute from the combobox input
- Always set `aria-selected` on options, including grouped options in the selected group
- Set correct `aria-posinset` and `aria-setsize` on virtualized options, excluding group headers from the count
- Add group label context to the accessible name of grouped options for Safari/VoiceOver compatibility
