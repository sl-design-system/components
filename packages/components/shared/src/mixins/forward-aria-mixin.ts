import { type Constructor } from '@open-wc/dedupe-mixin';
import { type ReactiveElement } from 'lit';

export interface ForwardAriaMixinInterface {
  getProxyTarget(): HTMLElement | undefined;
  setProxyTarget(target: HTMLElement): void;
}

const ELEMENT_REFERENCES: Record<string, keyof ARIAMixin> = {
  'aria-activedescendant': 'ariaActiveDescendantElement',
  'aria-controls': 'ariaControlsElements',
  'aria-describedby': 'ariaDescribedByElements',
  'aria-details': 'ariaDetailsElements',
  'aria-labelledby': 'ariaLabelledByElements',
  'aria-owns': 'ariaOwnsElements'
};

function setAriaDisabled(target: HTMLElement, value: string | null): void {
  target.ariaDisabled = value === 'true' ? 'true' : null;
}

/**
 * Mixin that forwards ARIA attributes from a custom element host to a target element inside its
 * shadow DOM. This is necessary because screen readers cannot pierce the shadow boundary, so ARIA
 * attributes set on the host (e.g. by a consumer) must be forwarded to the actual interactive
 * element (e.g. a native `<button>`).
 *
 * The host calls `setProxyTarget(element)` (typically in `firstUpdated`) to designate the element
 * that should receive the forwarded attributes.
 *
 * There are two categories of ARIA attributes:
 *
 * - **Reference attributes** like `aria-labelledby` and `aria-describedby` point to other elements by
 *   ID. These are resolved to actual DOM elements and set via the corresponding element reference
 *   properties (e.g. `ariaLabelledByElements`) on the target.
 * - **Value attributes** like `aria-label` and `aria-disabled` are simple strings and are forwarded
 *   as regular attributes on the target.
 *
 * In both cases the attribute is removed from the host after forwarding, so the host element does
 * not expose duplicate or stale ARIA information.
 *
 * **`ariaDisabled` property:** The mixin intercepts the `ariaDisabled` property directly so that
 * both setting and clearing it are forwarded to the target. Setting `ariaDisabled` to `'true'` adds
 * `aria-disabled="true"` on the target; setting it to `null` (or any value other than `'true'`)
 * removes `aria-disabled` from the target. This is necessary because the `MutationObserver` path
 * cannot detect attribute _removal_ and would otherwise leave the target in a stale disabled
 * state.
 *
 * **Nesting:** When two components using this mixin are nested (e.g. `<sl-menu-button>` containing
 * `<sl-button>`), the outer mixin sets element reference properties on the inner host. The inner
 * host intercepts these property assignments and forwards them to its own target, so references
 * propagate all the way to the deepest native element.
 *
 * **Observed attributes:** Pass an array of attribute names to forward only those. When omitted,
 * all `aria-*` attributes are forwarded automatically using a MutationObserver.
 */
export function ForwardAriaMixin<
  T extends Constructor<ReactiveElement> & { observedAttributes?: string[] }
>(constructor: T, observedAttributes?: string[]): T & Constructor<ForwardAriaMixinInterface> {
  // Build the set of element reference properties (e.g. ariaLabelledByElements) that
  // correspond to the observed attributes. These need prototype-level property interceptors
  // to support nesting (see the defineProperty loop below).
  const interceptedProps = new Set<keyof ARIAMixin>();
  if (observedAttributes) {
    for (const attr of observedAttributes) {
      const prop = ELEMENT_REFERENCES[attr];
      if (prop) {
        interceptedProps.add(prop);
      }
    }
  } else {
    for (const prop of Object.values(ELEMENT_REFERENCES)) {
      interceptedProps.add(prop);
    }
  }

  // WeakMaps keyed by instance so private state is accessible from both the class
  // methods and the defineProperty interceptors (which can't access #private fields).
  const targetElements = new WeakMap<ForwardAriaImpl, HTMLElement>(),
    propertyStorage = new WeakMap<ForwardAriaImpl, Map<string, Element[] | Element | null>>(),
    ariaDisabledStorage = new WeakMap<ForwardAriaImpl, string | null>(),
    // Tracks which elements each attribute forward contributed to the target's element
    // reference properties, so a re-forward or removal only replaces our own references
    // and leaves references added by others (e.g. a tooltip registering itself) intact.
    forwardedElementsStorage = new WeakMap<ForwardAriaImpl, Map<string, Element[]>>();

  class ForwardAriaImpl extends constructor {
    #observer?: MutationObserver;
    #pendingAttributes = new Set<string>();

    static override get observedAttributes(): string[] {
      return [...(super.observedAttributes ?? []), ...(observedAttributes ?? [])];
    }

    /** @internal */
    getProxyTarget(): HTMLElement | undefined {
      return targetElements.get(this);
    }

    /** @internal */
    setProxyTarget(target: HTMLElement): void {
      targetElements.set(this, target);

      // Forward any element reference properties that were set before the target was available
      const stored = propertyStorage.get(this);
      if (stored) {
        for (const [prop, value] of stored) {
          (target as unknown as Record<string, Element[] | Element | null>)[prop] = value;
        }
      }

      // Forward ariaDisabled if it was set via property before the target was available
      if (ariaDisabledStorage.has(this)) {
        const value = ariaDisabledStorage.get(this) ?? null;
        setAriaDisabled(target, value);
      }

      // Forward any attributes that were set before the target was available
      this.#forwardAttributes();
    }

    override connectedCallback(): void {
      super.connectedCallback();

      // When no explicit list of attributes is provided, use a MutationObserver to
      // catch any aria-* attribute that gets set on the host (including ones set
      // before the element upgraded or before the target is available).
      if (!observedAttributes) {
        // Collect any aria-* attributes already present on the element
        for (const { name } of this.attributes) {
          if (name.startsWith('aria-')) {
            this.#pendingAttributes.add(name);
          }
        }

        this.#observer = new MutationObserver(mutations => {
          for (const { attributeName } of mutations) {
            if (attributeName?.startsWith('aria-')) {
              this.#pendingAttributes.add(attributeName);
            }
          }

          this.#forwardAttributes();
        });
        this.#observer.observe(this, { attributes: true });
      }
    }

    override disconnectedCallback(): void {
      this.#observer?.disconnect();
      this.#observer = undefined;

      super.disconnectedCallback();
    }

    override attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      super.attributeChangedCallback(name, oldValue, newValue);

      // Only intercept attributes from our explicit list (the MutationObserver
      // path handles the "observe everything" case in connectedCallback).
      if (observedAttributes?.includes(name) && newValue !== null) {
        this.#pendingAttributes.add(name);
        this.#forwardAttributes();
      }
    }

    override removeAttribute(name: string): void {
      if (observedAttributes ? observedAttributes.includes(name) : name.startsWith('aria-')) {
        // Always remove from pending so a queued forward doesn't re-add it.
        this.#pendingAttributes.delete(name);

        // If the attribute is still present on the host, this call came from
        // #forwardAttributes cleaning up after forwarding — the proxy was just
        // set correctly, so don't touch it. Only clear the proxy when the
        // attribute is already absent (i.e. an explicit external removal call).
        if (!this.hasAttribute(name)) {
          const target = targetElements.get(this);
          if (target) {
            if (name === 'aria-disabled') {
              setAriaDisabled(target, null);
              ariaDisabledStorage.set(this, null);
            } else {
              const elementsProp = ELEMENT_REFERENCES[name];
              if (elementsProp?.endsWith('Elements')) {
                const forwarded = forwardedElementsStorage.get(this),
                  previous = forwarded?.get(elementsProp) ?? [],
                  current =
                    (target as unknown as Record<string, Element[] | null>)[elementsProp] ?? [],
                  remaining = current.filter(el => !previous.includes(el));

                (target as unknown as Record<string, Element[] | null>)[elementsProp] =
                  remaining.length ? remaining : null;
                forwarded?.delete(elementsProp);
              } else if (elementsProp) {
                (target as unknown as Record<string, Element | null>)[elementsProp] = null;
              } else {
                target.removeAttribute(name);
              }
            }
          }
        }
      }

      super.removeAttribute(name);
    }

    #forwardAttributes(): void {
      const targetElement = targetElements.get(this);

      if (!targetElement || this.#pendingAttributes.size === 0) {
        return;
      }

      // Resolve IDs from the host's root (light DOM document or parent shadow root),
      // not from our own shadow root.
      const root = this.getRootNode() as Document | ShadowRoot;

      for (const name of this.#pendingAttributes) {
        const value = this.getAttribute(name);
        if (!value) {
          continue;
        }

        const elementsProp = ELEMENT_REFERENCES[name];
        if (elementsProp) {
          // Reference attribute: resolve space-separated IDs to DOM elements and
          // assign via the element reference property (singular or plural).
          const elements = value
            .split(/\s+/)
            .map(id => root.querySelector<HTMLElement>(`#${CSS.escape(id)}`))
            .filter((el): el is HTMLElement => el !== null);

          if (elementsProp.endsWith('Elements')) {
            let forwarded = forwardedElementsStorage.get(this);
            if (!forwarded) {
              forwarded = new Map();
              forwardedElementsStorage.set(this, forwarded);
            }

            const current =
                (targetElement as unknown as Record<string, Element[] | null>)[elementsProp] ?? [],
              ours = new Set<Element>([...(forwarded.get(elementsProp) ?? []), ...elements]);

            // Keep references added by others, but replace the ones from our previous forward
            (targetElement as unknown as Record<string, Element[]>)[elementsProp] = [
              ...current.filter(el => !ours.has(el)),
              ...elements
            ];

            forwarded.set(elementsProp, elements);
          } else {
            (targetElement as unknown as Record<string, Element | null>)[elementsProp] =
              elements[0] ?? null;
          }
        } else {
          targetElement.setAttribute(name, value);
        }

        this.removeAttribute(name);
      }

      this.#pendingAttributes.clear();
    }
  }

  // Intercept the ariaDisabled property so that setting it to null/false removes
  // aria-disabled from the target, which the MutationObserver/attributeChangedCallback
  // path cannot do (it skips null attribute values in #forwardAttributes).
  Object.defineProperty(ForwardAriaImpl.prototype, 'ariaDisabled', {
    configurable: true,
    enumerable: true,
    get(this: ForwardAriaImpl): string | null {
      return ariaDisabledStorage.get(this) ?? null;
    },
    set(this: ForwardAriaImpl, value: string | null) {
      ariaDisabledStorage.set(this, value);

      const target = targetElements.get(this);
      if (target) {
        setAriaDisabled(target, value);
      }
    }
  });

  // Intercept element reference property assignments on the prototype. This is what
  // enables nesting: when a parent mixin resolves e.g. aria-labelledby to elements and
  // sets ariaLabelledByElements on this host, the setter stores the value *and* forwards
  // it to our own proxy target. If the target isn't available yet (it renders later),
  // the value is buffered in propertyStorage and flushed in setProxyTarget.
  for (const prop of interceptedProps) {
    Object.defineProperty(ForwardAriaImpl.prototype, prop, {
      configurable: true,
      enumerable: true,
      get(this: ForwardAriaImpl) {
        return propertyStorage.get(this)?.get(prop) ?? null;
      },
      set(this: ForwardAriaImpl, value: Element[] | Element | null) {
        let stored = propertyStorage.get(this);
        if (!stored) {
          stored = new Map();
          propertyStorage.set(this, stored);
        }
        stored.set(prop, value);

        const target = targetElements.get(this);
        if (target) {
          (target as unknown as Record<string, Element[] | Element | null>)[prop] = value;
        }
      }
    });
  }

  return ForwardAriaImpl;
}
