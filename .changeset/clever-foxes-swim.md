---
'@sl-design-system/select': patch
---

Fix listbox accessible name and aria-controls reference in sl-select

The listbox inside `sl-select` was not properly referenced by `aria-controls` on the combobox button, and the listbox was not receiving an accessible name from the associated form label. Both issues were caused by limitations of string-based IDREF attributes across shadow DOM boundaries.

- Replace `aria-controls` IDREF string with `ariaControlsElements` element reference to correctly associate the button with the listbox across shadow boundaries
- Use `ariaLabelledByElements` to propagate the form label to the listbox across shadow boundaries
