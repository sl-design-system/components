---
'@sl-design-system/shared': minor
---

Every mixin now has its own entry point, the same way `ElementInternalsMixin` has one, and the
`-mixin` suffix was dropped from their file names. The `@sl-design-system/shared/mixins.js` entry
point has been removed, and the mixins are no longer exported from `@sl-design-system/shared`
either; import them from their own entry point instead:

```ts
import { ForwardAriaMixin } from '@sl-design-system/shared/mixins/forward-aria.js';
import { LocaleMixin } from '@sl-design-system/shared/mixins/locale.js';
import { ObserveAttributesMixin } from '@sl-design-system/shared/mixins/observe-attributes.js';
```

The `Locale`, `ForwardAriaMixinInterface` and `ObserveAttributesMixinInterface` types moved along
with the mixin they belong to.
