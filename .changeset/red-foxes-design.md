---
'@sl-design-system/dialog': patch
---

Fix bug where you could still close a dialog with `disableCancel` by pressing
the Escape key twice. This is because when you press the Escape key, both the
`cancel` *and* `close` events are fired. With this fix, we no longer rely
on the `cancel` event from the dialog itself, but handle the keydown event ourselves.
