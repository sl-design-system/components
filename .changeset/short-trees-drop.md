---
'@sl-design-system/date-field': patch
---

Accessibility improvements: the calendar picker changed from a popover to a native `<dialog>` using `showModal()` for better focus trapping and screen reader support. Added `aria-label` to the dialog, improved backdrop click detection and kept `aria-expanded` in sync when closing.
