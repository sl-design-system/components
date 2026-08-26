---
'@sl-design-system/shared': patch
---

`ForwardAriaMixin` now has a `hasAccessibleName()` method, which returns whether the element is
named from the outside: by an `aria-label`, an `aria-labelledby`, or the `<label>` of an
`<sl-label>`. Only the references the mixin itself forwarded count, so an `<sl-tooltip>` that
registered itself as the label of the target is not mistaken for a name.

The mixin also requests an update when a forward changes what the target exposes, so a component
that renders based on those attributes stays in sync with them.
