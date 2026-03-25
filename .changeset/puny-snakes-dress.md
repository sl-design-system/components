---
'@sl-design-system/select': patch
---

Accessibility improvements:
- Moved the clear button from `sl-select-button` to `sl-select`, the clear button is now focusable on its own,
- Added `aria-keyshortcuts` attribute to announce Backspace/Delete shortcuts to assistive technology,
- Added `sl-clear` event to `sl-select` with consistent event ordering across click and keyboard interactions.
