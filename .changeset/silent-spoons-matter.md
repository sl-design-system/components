---
'@sl-design-system/accordion': patch
---

Sync accessibility state on `sl-accordion-item` so disabled items are announced correctly by assistive technologies.

Disabled accordion items now expose `aria-disabled="true"` and keep `aria-expanded` in sync. This improves screen reader support in browsers where the disabled state was not announced consistently.
