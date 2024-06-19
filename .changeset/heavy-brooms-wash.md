---
'@sl-design-system/button': patch
---

Made sure slotted elements in sl-button don't capture events. This caused problems with tooltips unexpectedly disappearing when using something other than text or sl-icon inside a button
