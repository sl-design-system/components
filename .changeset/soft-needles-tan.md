---
'@sl-design-system/shared': minor
---

Add new `closestElementComposed` DOM utility method

This new utility method is a wrapper around `HTMLElement.prototype.closest` that also considers the composed tree. This makes it easier to find the closest ancestor that matches a given selector, even if the element is in a shadow tree.
