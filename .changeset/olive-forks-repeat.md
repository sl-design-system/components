---
'@sl-design-system/form': minor
---

A Form Associated Custom Element should now expose its `ElementInternals` as `elementInternals`
instead of `internals`, so `FormControlMixin` can read the validity and form value from it. Apply
the new `ElementInternalsMixin` to the element; it attaches the internals and exposes them under
that name:

```ts
import { ElementInternalsMixin } from '@sl-design-system/shared/mixins/element-internals.js';

class MyControl extends FormControlMixin(ElementInternalsMixin(LitElement)) {
  // no more `internals = this.attachInternals()`
}
```

`FormControlMixin` still falls back to the deprecated `internals` property when `elementInternals`
is not present, so this is not a breaking change. Development builds log a deprecation warning when
the fallback is used; support for it will be removed in a future version.
