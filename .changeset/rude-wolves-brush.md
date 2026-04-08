---
'@sl-design-system/form': patch
---

Fixed an infinite loop in `FormControlMixin` where resolving an async custom validity promise would re-emit the `sl-validate` event, causing the validation handler to create a new promise every 2 seconds indefinitely. The promise resolution now updates validity without re-emitting `sl-validate`.
