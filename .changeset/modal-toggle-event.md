---
'@sl-design-system/shared': minor
'@sl-design-system/dialog': patch
'@sl-design-system/drawer': patch
---

Add a composed `sl-modal-toggle` event (and `dispatchModalToggle()` helper) that `<sl-dialog>` and `<sl-drawer>` now emit when their modal dialog opens or closes, so the notification stack can stay above it.
