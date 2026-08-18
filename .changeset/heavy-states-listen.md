---
'@sl-design-system/shared': minor
---

Add an `ElementInternalsMixin` and a `@cssState` decorator:

- `ElementInternalsMixin` attaches the `ElementInternals` and exposes them as `elementInternals`,
  so the component, its subclasses, other mixins and its tests all have one standardized way of
  getting to them.
- `@cssState` keeps a custom CSS state in sync with a boolean property or getter. The state name
  defaults to the dasherized property name. It works with both the legacy
  (`experimentalDecorators`) and the standard TC39 decorators.

```ts
import { cssState } from '@sl-design-system/shared/decorators/css-state.js';
import { ElementInternalsMixin } from '@sl-design-system/shared/mixins/element-internals.js';

class MyElement extends ElementInternalsMixin(LitElement) {
  // Sets the `checked` state; style it with `my-element:state(checked)`
  @cssState() @property({ type: Boolean }) checked?: boolean;

  // A getter works as well, for a state derived from other properties
  @cssState('no-label')
  get noLabel(): boolean {
    return !this.hasLabel;
  }
}
```
