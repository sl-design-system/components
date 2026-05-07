---
'@sl-design-system/combobox': patch
---

Functional changes:
- The popover opens when you click in the combobox, no longer when you enter the combobox with keyboard navigation.

Accessibility improvements:
- Forward ARIA attributes (`aria-label`, `aria-describedby`, `aria-labelledby`) from host element to the input element for proper screen reader support
- Automatically associate label with input via `aria-labelledby` when a label is present

