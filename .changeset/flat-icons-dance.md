---
'@sl-design-system/combobox': patch
---

Accessibility improvements:
- Forward ARIA attributes (`aria-label`, `aria-describedby`, `aria-labelledby`) from host element to the input element for proper screen reader support
- Automatically associate label with input via `aria-labelledby` when a label is present
