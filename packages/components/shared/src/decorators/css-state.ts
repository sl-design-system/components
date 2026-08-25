import { type ReactiveController, type ReactiveElement } from 'lit';
import { type ElementInternalsMixinInterface } from '../mixins/element-internals.js';
import { dasherize } from '../string.js';

/** The controller of an element, so all its CSS states are handled by a single one. */
const controllers = new WeakMap<ReactiveElement, CssStateController>();

/** Options for the `@cssState` decorator. */
export interface CssStateOptions {
  /** Set the state while the property is falsy, instead of while it is truthy. */
  invert?: boolean;
}

/**
 * The part of a standard (TC39) decorator context that `@cssState` uses. `access.get` is optional,
 * because a setter context only gets an `access.set`.
 */
interface StandardDecoratorContext {
  kind: string;
  name: string | symbol;
  private?: boolean;
  static?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  access: { get?(object: any): unknown };

  addInitializer(initializer: (this: unknown) => void): void;
}

/** A property whose value is reflected into a custom CSS state. */
interface CssStateEntry {
  /** Whether the state is set while the property is falsy. */
  invert: boolean;

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
  observe(read: () => unknown, state: string, { invert = false }: CssStateOptions = {}): void {
    this.#entries.push({ invert, read, state });
  }

  hostUpdate(): void {
    const { elementInternals } = this.host as unknown as ElementInternalsMixinInterface;

    if (!elementInternals) {
      throw new Error(
        '@cssState: no element internals found; apply the ElementInternalsMixin to the element.'
      );
    }

    for (const entry of this.#entries) {
      const value = entry.invert ? !entry.read() : !!entry.read();

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
 *   @property({ type: Boolean }) @cssState() checked?: boolean;
 *
 *   // Sets the `no-label` state while `hasLabel` is falsy
 *   @state() @cssState('no-label', { invert: true }) hasLabel = false;
 *
 *   // A getter works as well, for a state that is derived from other properties
 *   @cssState('has-name')
 *   get hasName(): boolean {
 *     return this.hasLabel || this.hasAccessibleName();
 *   }
 * }
 * ```
 *
 * The element must have the `ElementInternalsMixin` applied. Works with both the legacy
 * (`experimentalDecorators`) and the standard TC39 decorators.
 *
 * @param name The name of the CSS state; defaults to the dasherized property name.
 * @param options Options for the state; set `invert` to set it while the property is falsy.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cssState(name?: string, options?: CssStateOptions): any {
  return function (
    protoOrValue: unknown,
    nameOrContext: PropertyKey | StandardDecoratorContext
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    // Standard decorators pass a context object as the second argument
    if (typeof nameOrContext === 'object') {
      const context = nameOrContext,
        // Private names are reported including their `#` prefix
        state = name ?? dasherize(String(context.name).replace(/^#/, '')),
        get = context.access.get;

      // A setter context only has an `access.set`, so the value has to be read off the host
      // through the paired getter. There is no paired getter to reach for a private setter.
      if (!get && context.private) {
        throw new Error(
          `@cssState: cannot read the private ${context.kind} '${String(context.name)}'; ` +
            'decorate a getter or a field instead.'
        );
      }

      const read = get
        ? (host: ReactiveElement) => get(host)
        : (host: ReactiveElement) =>
            (host as unknown as Record<PropertyKey, unknown>)[context.name];

      context.addInitializer(function (this: unknown) {
        const host = this as ReactiveElement;

        CssStateController.for(host).observe(() => read(host), state, options);
      });

      return;
    }

    const key = nameOrContext,
      state = name ?? dasherize(String(key));

    ((protoOrValue as ReactiveElement).constructor as typeof ReactiveElement).addInitializer(el => {
      CssStateController.for(el).observe(
        () => (el as unknown as Record<PropertyKey, unknown>)[key],
        state,
        options
      );
    });
  };
}
