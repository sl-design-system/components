---
'@sl-design-system/dialog': minor
---

Add support for the [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API) (`--show-modal`, `--close` and `--request-close` commands)

The dialog now listens for `command` events and responds to:

- `--show-modal` by calling `showModal()`
- `--close` by calling `close()`
- `--request-close` by calling `requestClose()`, which fires a `cancel` event that can be prevented

Additionally, `close()` and `requestClose()` now accept an optional `returnValue` parameter.

This allows buttons to declaratively open and close dialogs without writing any JavaScript.

Because we wrap the native `<dialog>` element inside `<sl-dialog>`, we use custom command names (`--show-modal`, `--close` and `--request-close`). Using the standard `show-modal` and `close` command names is not allowed and will result in the `command` event not being dispatched.
