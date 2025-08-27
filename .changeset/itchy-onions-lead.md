---
'@sl-design-system/dialog': patch
---

Fixes closing the dialog when clicking the backdrop.
The dialog should close only when the dialog element itself is clicked, not when a child of the dialog is clicked.