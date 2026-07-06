---
'@sl-design-system/select': patch
---

Accessibility improvements: fix `aria-controls` and `aria-labelledby` relationships in sl-select.

- Add `ariaControlsElements` element reference via `ElementInternals` on the select button to correctly associate with the listbox across shadow DOM boundary.
- Set `ariaLabelledByElements` on the listbox to propagate the associated form label across the shadow DOM boundary.
