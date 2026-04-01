import { type Constructor } from '@open-wc/dedupe-mixin';
import { type ReactiveElement } from 'lit';

export interface ProxyAriaAttributesMixinInterface {
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

/**
 * Mixin that proxies ARIA attributes from a custom element host to a target element
 * inside its shadow DOM. This is necessary because screen readers cannot pierce the
 * shadow boundary, so ARIA attributes set on the host (e.g. by a consumer) must be
 * forwarded to the actual interactive element (e.g. a native `<button>`).
 *
 * The host calls `setProxyTarget(element)` (typically in `firstUpdated`) to designate
 * the element that should receive the forwarded attributes.
 *
 * There are two categories of ARIA attributes:
 * - **Reference attributes** like `aria-labelledby` and `aria-describedby` point to other
 *   elements by ID. These are resolved to actual DOM elements and set via the corresponding
 *   element reference properties (e.g. `ariaLabelledByElements`) on the target.
 * - **Value attributes** like `aria-label` and `aria-disabled` are simple strings and are
 *   forwarded as regular attributes on the target.
 *
 * In both cases the attribute is removed from the host after forwarding, so the host
 * element does not expose duplicate or stale ARIA information.
 *
 * **Nesting:** When two components using this mixin are nested (e.g. `<sl-menu-button>`
 * containing `<sl-button>`), the outer mixin sets element reference properties on the
 * inner host. The inner host intercepts these property assignments and forwards them to
 * its own target, so references propagate all the way to the deepest native element.
 *
 * **Observed attributes:** Pass an array of attribute names to proxy only those. When
 * omitted, all `aria-*` attributes are proxied automatically using a MutationObserver.
 */
export function ProxyAriaAttributesMixin<T extends Constructor<ReactiveElement> & { observedAttributes?: string[] }>(
  constructor: T,
  observedAttributes?: string[]
): T & Constructor<ProxyAriaAttributesMixinInterface> {
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
  const targetElements = new WeakMap<ProxyAriaAttributesImpl, HTMLElement>(),
    propertyStorage = new WeakMap<ProxyAriaAttributesImpl, Map<string, Element[] | Element | null>>();

  class ProxyAriaAttributesImpl extends constructor {
    #observer?: MutationObserver;
    #pendingAttributes = new Set<string>();

    static override get observedAttributes(): string[] {
      return [...(super.observedAttributes ?? []), ...(observedAttributes ?? [])];
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

    override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
      super.attributeChangedCallback(name, oldValue, newValue);

      // Only intercept attributes from our explicit list (the MutationObserver
      // path handles the "observe everything" case in connectedCallback).
      if (observedAttributes?.includes(name) && newValue !== null) {
        this.#pendingAttributes.add(name);
        this.#forwardAttributes();
      }
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
            (targetElement as unknown as Record<string, Element[]>)[elementsProp] = elements;
          } else {
            (targetElement as unknown as Record<string, Element | null>)[elementsProp] = elements[0] ?? null;
          }
        } else {
          targetElement.setAttribute(name, value);
        }

        this.removeAttribute(name);
      }

      this.#pendingAttributes.clear();
    }
  }

  // Intercept element reference property assignments on the prototype. This is what
  // enables nesting: when a parent mixin resolves e.g. aria-labelledby to elements and
  // sets ariaLabelledByElements on this host, the setter stores the value *and* forwards
  // it to our own proxy target. If the target isn't available yet (it renders later),
  // the value is buffered in propertyStorage and flushed in setProxyTarget.
  for (const prop of interceptedProps) {
    Object.defineProperty(ProxyAriaAttributesImpl.prototype, prop, {
      configurable: true,
      enumerable: true,
      get(this: ProxyAriaAttributesImpl) {
        return propertyStorage.get(this)?.get(prop) ?? null;
      },
      set(this: ProxyAriaAttributesImpl, value: Element[] | Element | null) {
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

  return ProxyAriaAttributesImpl;
}
