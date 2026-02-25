---
'@sl-design-system/shared': patch
---

Fixes `AnchorController` that was clearing `ariaDescribedByElements` on the anchor element when a popover opens or closes. 
Changing the `aria-describedby` attribute also clears the `ariaDescribedByElements` property, which broke references set by other components (e.g. `sl-menu-button` forwarding tooltip references to its inner `sl-button`).

Fixes:
- On close: only remove `aria-describedby` if it was set by this controller
- On open: skip setting `aria-describedby` if `ariaDescribedByElements` is already set
