---
'@sl-design-system/checkbox': patch
---

Fix checkbox group not working with tooltips (only `sl-checkbox` elements are tracked by `@queryAssignedElements`).
Use `ForwardAriaMixin` to forward `aria-describedby` as element references to the inner input element, enabling screen reader support across shadow DOM boundaries.
