---
'@sl-design-system/message-dialog': minor
---

Refactor message-dialog to use contextual tokens
- Remove the `subtitle` attribute from `MessageDialogConfig` (this is a non-breaking change)
- Use new contextual tokens for styling
- Use a plain `<dialog>` instead of inheriting from `<sl-dialog>`
- Use same desktop animations as `<sl-dialog>`
