---
'@sl-design-system/shared': minor
---

When forwarding ARIA labels or descriptions, the `ForwardAriaMixin` no longer overrides any existing `ariaDescribedByElements` or `ariaLabelledByElements` values. This allows components that use the mixin to maintain their own ARIA relationships without interference, while still forwarding any additional ARIA attributes as needed.
