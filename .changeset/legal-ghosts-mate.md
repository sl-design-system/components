---
'@sl-design-system/tooltip': patch
---

Fix the `tooltip` to get it working with focusable elements across shadow DOM boundaries (by using `ElementInternals.ariaDescribedByElements` and `ariaLabelledByElements`). This resolves accessibility issues when `tooltip` is used with components like `sl-menu-button`.