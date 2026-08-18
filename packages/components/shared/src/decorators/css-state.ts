import { type ReactiveController, type ReactiveElement } from 'lit';
import { type ElementInternalsMixinInterface } from '../mixins/element-internals-mixin.js';
import { dasherize } from '../string.js';

/**
 * Keeps a custom CSS state in sync with the value of a boolean property. The state is updated
 * before the host renders, so styles depending on it are applied in the same frame.
 */
class CssStateController implements ReactiveController {
  /** The value the state was last set from; undefined until the first update. */
  #previous?: boolean;

  constructor(
    private host: ReactiveElement,
    private read: () => unknown,
    private state: string
  ) {
    host.addController(this);
  }

  hostUpdate(): void {
    const value = !!this.read();

    if (value === this.#previous) {
      return;
    }

    this.#previous = value;

    const { elementInternals } = this.host as unknown as ElementInternalsMixinInterface;

    if (!elementInternals) {
      throw new Error(
        '@cssState: no element internals found; apply the ElementInternalsMixin to the element.'
      );
    }

    const { states } = elementInternals;

    if (value) {
      states.add(this.state);
    } else {
      states.delete(this.state);
    }
  }
}

/**
 * Decorator that adds a custom CSS state to the element while the decorated property is truthy, and
 * removes it again when it is not:
 *
 * ```ts
 * class MyElement extends ElementInternalsMixin(LitElement) {
 *   // Sets the `checked` state; style it with `my-element:state(checked)`
 *   @cssState() @property({ type: Boolean }) checked?: boolean;
 *
 *   // A getter works as well, for a state that is derived from other properties
 *   @cssState('no-label')
 *   get noLabel(): boolean {
 *     return !this.hasLabel;
 *   }
 * }
 * ```
 *
 * The element must have the `ElementInternalsMixin` applied. Works with both the legacy
 * (`experimentalDecorators`) and the standard TC39 decorators.
 *
 * @param name The name of the CSS state; defaults to the dasherized property name.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cssState(name?: string): any {
  return function (
    protoOrValue: unknown,
    nameOrContext:
      | PropertyKey
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | (DecoratorContext & { access: { get(object: any): unknown } })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    // Standard decorators pass a context object as the second argument
    if (typeof nameOrContext === 'object') {
      const context = nameOrContext,
        // Private names are reported including their `#` prefix
        state = name ?? dasherize(String(context.name).replace(/^#/, ''));

      context.addInitializer(function (this: unknown) {
        const host = this as ReactiveElement;

        new CssStateController(host, () => context.access.get(host), state);
      });

      return;
    }

    const key = nameOrContext,
      state = name ?? dasherize(String(key));

    ((protoOrValue as ReactiveElement).constructor as typeof ReactiveElement).addInitializer(el => {
      new CssStateController(el, () => (el as unknown as Record<PropertyKey, unknown>)[key], state);
    });
  };
}
