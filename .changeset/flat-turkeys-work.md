---
'@sl-design-system/combobox': patch
---

Various a11y related fixes/improvements:
- The label was associated with the `<sl-combobox>` element instead of the `<input>` element
- `aria-selected="false"` was missing on the non-selected options
- `aria-multiselectable="true"` was missing on the listbox when the multiple property is set
- Add an `aria-label` to the `<sl-tag-list>` with value `"Selected options"`
- Fix validation message not being translated
- Remove Form Associated Custom Element code in favor of native form association with `<input>`
