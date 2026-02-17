---
'@sl-design-system/menu': patch
---

Fix `menu button` and `tooltip` integration by using `ElementInternals.ariaDescribedByElements` and `ariaLabelledByElements` to get it working across shadow DOM boundaries.
