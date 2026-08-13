---
'@sl-design-system/shared': minor
---

Improved how `ForwardAriaMixin` forwards ARIA element references (such as `ariaDescribedByElements` and `ariaLabelledByElements`) to its proxy target:

- References added by other code are no longer overwritten. This allows components that use the mixin to maintain their own ARIA relationships (such as a button registering its own tooltip) while still forwarding any additional ARIA attributes as needed.
- The mixin now keeps track of the references it forwarded itself, so re-forwarding replaces them instead of appending. Previously, changing an attribute like `aria-labelledby` left the old reference in place, which resulted in a stale accessible name.
- Removing a forwarded attribute now only clears the references the mixin added, leaving any other references on the target intact.
- Removing an ARIA attribute in the same task in which it was set no longer leaves a stale value on the proxy target. The mixin used the presence of the attribute on the host to recognise its own cleanup after forwarding, which also matched this case when the host is watched by a `MutationObserver`.
