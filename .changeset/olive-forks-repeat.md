---
'@sl-design-system/form': major
---

A Form Associated Custom Element must now expose its `ElementInternals` as `elementInternals`
instead of `internals`, so `FormControlMixin` can read the validity and form value from it. Apply
the new `ElementInternalsMixin` from `@sl-design-system/shared` to the element; it attaches the
internals and exposes them under that name:

```ts
class MyControl extends ElementInternalsMixin(FormControlMixin(LitElement)) {
  // no more `internals = this.attachInternals()`
}
```
