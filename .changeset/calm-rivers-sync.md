---
'@sl-design-system/combobox': patch
---

Accessibility improvements for combobox screen reader support

- Set `aria-activedescendant` when the popover opens so screen readers announce the current option immediately
- Set `aria-activedescendant` on mouse-open so AT context is maintained without applying a visual highlight
- Remove `aria-owns` from the combobox input because it is not needed for this implementation
- Fixes issue where you can select an option multiple times when the "group selected" option is true
