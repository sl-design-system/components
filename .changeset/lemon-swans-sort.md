---
'@sl-design-system/shared': minor
---

Add `ProxyAriaAttributesMixin` that forwards ARIA attributes from a custom element host to a target element inside its shadow DOM.

- **Reference attributes** (`aria-labelledby`, `aria-describedby`, `aria-controls`, etc.) are resolved to DOM elements and set via element reference properties (e.g. `ariaLabelledByElements`) on the target.
- **Value attributes** (`aria-label`, `aria-disabled`, etc.) are forwarded as regular attributes on the target.
- **`ariaDisabled` property** is explicitly intercepted: setting it to `'true'` sets `aria-disabled="true"` on the target; setting it to `null` removes `aria-disabled` from the target. This fixes a bug where the `MutationObserver` path could not propagate attribute *removal*, leaving the target in a stale disabled state.
- Supports **nesting**: when two components using this mixin are nested, element reference properties propagate all the way to the deepest native element.
- Supports an optional list of observed attributes; when omitted, all `aria-*` attributes are proxied automatically via a `MutationObserver`.

`ProxyAriaAttributesMixin` is the successor to `ObserveAttributesMixin`; `ObserveAttributesMixin` remains exported for backwards compatibility and may be removed in a future release.

Also add helper functions exported from `@sl-design-system/shared/helpers/proxied-aria-attributes.js` for inspecting the accessible state of elements that use `ProxyAriaAttributesMixin`:

- `getProxiedAccessibleName(host)` — resolves the accessible name via `aria-labelledby` → `aria-label` → slotted text content
- `getProxiedDescription(host)` — resolves the accessible description via `aria-describedby` → `aria-description`
- `isProxiedDisabled(host)` — returns `false`, `true`, or `'aria'`
- `getProxiedAriaAttribute(host, name)` — reads a forwarded ARIA attribute from the proxy target
- `getProxiedAriaProperty(host, name)` — reads a forwarded ARIA element-reference property from the proxy target
