---
'@sl-design-system/tag': patch
---

Various a11y related fixes

`<sl-tag-list>`:
- Use `aria-labelledby` for the tooltip instead of `aria-describedby`
- Do not set an `aria-label` on the host element; `role="list"` provides enough information

`<sl-tag>`:
- Add ability to use Delete or Backspace keys to remove the tag
- Use `aria-description` to describe how to remove the tag using the keyboard
- Make the delete button have `aria-hidden="true"`
- Remove `tabindex` from the `.wrapper` element in the shadow DOM
