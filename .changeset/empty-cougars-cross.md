---
'@sl-design-system/checkbox': patch
---

Fix checkbox group not working with tooltips (only `sl-checkbox` elements are tracked by `@queryAssignedElements`).
Forward `aria-describedby` to the inner input element for screen reader support.
