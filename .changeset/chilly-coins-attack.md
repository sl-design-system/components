---
'@sl-design-system/text-field': minor
---

Improve implicit form submit behavior

Previously when you pressed enter in a text field, it would call `requestSubmit()` on the associated `<form>` element. This mimics the behavior of the native `<input>` element. With this change, the behavior now also works if there is only a parent `<sl-form>` element. If both `<form>` and `<sl-form>` elements are present, then the `<form>` element will take precedence. This makes it a minor change.
