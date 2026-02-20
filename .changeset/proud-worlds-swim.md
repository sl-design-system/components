---
'@sl-design-system/menu': patch
---

Fix `menu button` and `tooltip` integration by using `ariaDescribedByElements` and `ariaLabelledByElements` (on the button element) to get it working across shadow DOM boundaries.
