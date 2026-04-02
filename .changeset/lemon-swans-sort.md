---
'@sl-design-system/shared': minor
---

Add `ProxyAriaAttributesMixin` that forwards ARIA attributes from a custom element host to a target element inside its shadow DOM.

- **Reference attributes** (`aria-labelledby`, `aria-describedby`, `aria-controls`, etc.) are resolved to DOM elements and set via element reference properties (e.g. `ariaLabelledByElements`) on the target.
- **Value attributes** (`aria-label`, `aria-disabled`, etc.) are forwarded as regular attributes on the target.
- Supports **nesting**: when two components using this mixin are nested, element reference properties propagate all the way to the deepest native element.
- Supports an optional list of observed attributes; when omitted, all `aria-*` attributes are proxied automatically via a `MutationObserver`.

`ProxyAriaAttributesMixin` is the successor to `ObserveAttributesMixin`; `ObserveAttributesMixin` remains exported for backwards compatibility and may be removed in a future release.
