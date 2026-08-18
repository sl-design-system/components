import { type Constructor } from '@open-wc/dedupe-mixin';
import { type ReactiveElement } from 'lit';

export interface ElementInternalsMixinInterface {
  readonly elementInternals: ElementInternals;
}

/**
 * Mixin that attaches the `ElementInternals` to the element and exposes them, so the component, its
 * subclasses, other mixins and its tests all have one standardized way of getting to them:
 *
 * ```ts
 * class MyElement extends ElementInternalsMixin(LitElement) {
 *   toggle(): void {
 *     this.elementInternals.states.add('checked');
 *   }
 * }
 * ```
 *
 * `attachInternals()` can only be called once per element, so a component using this mixin should
 * not call it itself.
 *
 * Unlike a decorator, a mixin does add the property to the type of the class, so there is no need
 * to declare it. See `@cssState` for a decorator that builds on this mixin.
 */
export function ElementInternalsMixin<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<ElementInternalsMixinInterface> {
  class ElementInternalsImpl extends constructor implements ElementInternalsMixinInterface {
    /** The element internals of this element. */
    #internals = this.attachInternals();

    /** The element internals of this element. */
    get elementInternals(): ElementInternals {
      return this.#internals;
    }
  }

  return ElementInternalsImpl;
}
