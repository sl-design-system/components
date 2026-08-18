import { type ReactiveController, type ReactiveElement } from 'lit';
import { type ElementInternalsMixinInterface } from '../mixins/element-internals-mixin.js';
import { dasherize } from '../string.js';

/** The controller of an element, so all its CSS states are handled by a single one. */
const controllers = new WeakMap<ReactiveElement, CssStateController>();

/** A property whose value is reflected into a custom CSS state. */
interface CssStateEntry {
  /** Returns the current value of the property. */
  read(): unknown;

  /** The value the state was last set from; undefined until the first update. */
  previous?: boolean;

  /** The name of the custom CSS state. */
  state: string;
}

/**
 * Keeps custom CSS states in sync with the values of boolean properties. The states are updated
 * before the host renders, so styles depending on them are applied in the same frame.
 *
 * An element has at most one controller, no matter how many properties it decorates; use
 * `CssStateController.for()` to get it.
 */
class CssStateController implements ReactiveController {
  /** The properties reflected into a custom CSS state, in the order they were decorated. */
  #entries: CssStateEntry[] = [];

  /** Returns the controller of the given element, creating it on first use. */
  static for(host: ReactiveElement): CssStateController {
    let controller = controllers.get(host);

    if (!controller) {
      controller = new CssStateController(host);
      controllers.set(host, controller);
    }

    return controller;
  }

  private constructor(private host: ReactiveElement) {
    host.addController(this);
  }

  /** Reflects the value returned by `read` into the given custom CSS state. */
  observe(read: () => unknown, state: string): void {
    this.#entries.push({ read, state });
  }

  hostUpdate(): void {
    const { elementInternals } = this.host as unknown as ElementInternalsMixinInterface;

    if (!elementInternals) {
      throw new Error(
        '@cssState: no element internals found; apply the ElementInternalsMixin to the element.'
      );
    }

    for (const entry of this.#entries) {
      const value = !!entry.read();

      if (value === entry.previous) {
        continue;
      }

      entry.previous = value;

      if (value) {
        elementInternals.states.add(entry.state);
      } else {
        elementInternals.states.delete(entry.state);
      }
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

        CssStateController.for(host).observe(() => context.access.get(host), state);
      });

      return;
    }

    const key = nameOrContext,
      state = name ?? dasherize(String(key));

    ((protoOrValue as ReactiveElement).constructor as typeof ReactiveElement).addInitializer(el => {
      CssStateController.for(el).observe(
        () => (el as unknown as Record<PropertyKey, unknown>)[key],
        state
      );
    });
  };
}
