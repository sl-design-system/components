---
'@sl-design-system/tooltip': patch
---

Fix the `tooltip` to get it working with focusable elements across shadow DOM boundaries by adding support for detecting anchors that reference the tooltip via `ariaLabelledByElements` or `ariaDescribedByElements` set directly on the element or via `ElementInternals`.
This resolves accessibility issues when `tooltip` is used with components like `sl-menu-button`.