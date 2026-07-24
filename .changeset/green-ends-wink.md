---
'@sl-design-system/shared': minor
---

Improved how `ForwardAriaMixin` forwards ARIA element references (such as `ariaDescribedByElements` and `ariaLabelledByElements`) to its proxy target:

- References added by other code are no longer overwritten. This allows components that use the mixin to maintain their own ARIA relationships (such as a button registering its own tooltip) while still forwarding any additional ARIA attributes as needed.
- The mixin now keeps track of the references it forwarded itself, so re-forwarding replaces them instead of appending. Previously, changing an attribute like `aria-labelledby` left the old reference in place, which resulted in a stale accessible name.
- Removing a forwarded attribute now only clears the references the mixin added, leaving any other references on the target intact.
