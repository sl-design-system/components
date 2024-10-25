---
'@sl-design-system/listbox': patch
---

Various improvements:
- Support `<option>` and `<optgroup>` elements in addition to `<sl-option>` and `<sl-option-group>` inside `<sl-listbox>`
- Override `textContent` in `<sl-option>` to return only the text directly inside the element
