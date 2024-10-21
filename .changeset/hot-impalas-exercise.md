---
'@sl-design-system/button': minor
---

Improve form integration behavior

Previously, if you had an `<sl-button>` with `type` `reset` or `submit`, it would call the `<form>`'s `reset()` or `requestSubmit()` methods. With this change, the same behavior now works if you only have an `<sl-form>` element as the parent. If both `<form>` and `<sl-form>` elements are present, then the `<form>` element will take precedence. This makes it a minor change.
