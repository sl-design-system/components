---
'@sl-design-system/accordion': patch
---

Sync accessibility state on `sl-accordion-item` so disabled items are announced correctly by assistive technologies.

Disabled accordion items now expose `aria-disabled="true"` on the focusable host element, while also keeping `aria-expanded` in sync. This improves screen reader support in browsers where the disabled state was not announced consistently.
