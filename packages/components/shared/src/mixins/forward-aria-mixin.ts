import { type Constructor } from '@open-wc/dedupe-mixin';
import { type ReactiveElement } from 'lit';

/** Counter for generating stable unique IDs for elements that lack one. */
let nextAutoId = 0;

/** Ensures the element has an `id` attribute, auto-assigning one if missing. */
function ensureId(el: HTMLElement): string {
  if (!el.id) {
    el.id = `sl-aria-ref-${nextAutoId++}`;
  }
  return el.id;
}

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
    ariaDisabledStorage = new WeakMap<ForwardAriaImpl, string | null>();

  class ForwardAriaImpl extends constructor {
    /** Maximum number of deferred retries before giving up on unresolved IDs. */
    static readonly #MAX_RETRIES = 3;

    #observer?: MutationObserver;
    #pendingAttributes = new Set<string>();

    /** Tracks the number of deferred resolution attempts per attribute. */
    #retryCounts = new Map<string, number>();

    /**
     * Stores attribute values at the time they were observed, as a fallback when Lit's ARIA
     * reflection removes the attribute before resolution.
     */
    #storedValues = new Map<string, string>();

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

      // Forward any element reference properties that were set before the target was available.
      // Apply the same scope-aware logic as #forwardAttributes: when the target shares the
      // same root as the host, use string attributes (IDs) instead of element references,
      // because Chrome clears the content attribute when ariaLabelledByElements is assigned.
      const stored = propertyStorage.get(this);
      if (stored) {
        const root = this.getRootNode();
        const targetRoot = target.getRootNode();

        for (const [prop, value] of stored) {
          // Skip null/empty values to avoid adding empty aria-* content attributes
          const isEmpty = value === null || (Array.isArray(value) && value.length === 0);
          if (isEmpty) {
            continue;
          }

          if (targetRoot === root) {
            // Same scope: convert element references to a string ID attribute.
            const attrName = Object.entries(ELEMENT_REFERENCES).find(([, p]) => p === prop)?.[0];
            if (attrName) {
              const elements = Array.isArray(value) ? value : [value];
              const ids = elements.map(el => ensureId(el as HTMLElement)).join(' ');
              if (ids) {
                target.setAttribute(attrName, ids);
              }
            }
          } else {
            // Cross-scope: element references are required.
            (target as unknown as Record<string, Element[] | Element | null>)[prop] = value;
          }
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
        for (const { name, value } of this.attributes) {
          if (name.startsWith('aria-')) {
            this.#pendingAttributes.add(name);
            this.#storedValues.set(name, value);
          }
        }

        this.#observer = new MutationObserver(mutations => {
          for (const { attributeName } of mutations) {
            if (attributeName?.startsWith('aria-')) {
              const value = this.getAttribute(attributeName);
              if (value !== null) {
                this.#pendingAttributes.add(attributeName);
                this.#storedValues.set(attributeName, value);
              }
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
      // Store the value BEFORE calling super, since Lit's ARIA reflection may
      // remove or empty the attribute during super.attributeChangedCallback.
      if (observedAttributes?.includes(name) && newValue) {
        this.#pendingAttributes.add(name);
        this.#storedValues.set(name, newValue);
      }

      super.attributeChangedCallback(name, oldValue, newValue);

      // Only intercept attributes from our explicit list (the MutationObserver
      // path handles the "observe everything" case in connectedCallback).
      if (observedAttributes?.includes(name) && newValue) {
        // Attempt to forward; if #pendingAttributes was already consumed (e.g. by a
        // re-entrant call triggered from super), re-add and retry.
        if (!this.#pendingAttributes.has(name)) {
          this.#pendingAttributes.add(name);
        }
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
      const unresolved = new Set<string>();

      for (const name of this.#pendingAttributes) {
        // Read from the host attribute first; fall back to stored value if Lit's
        // built-in ARIA reflection removed the attribute (or set it to empty string)
        // before we could process it.
        const value = this.getAttribute(name) || this.#storedValues.get(name);
        if (!value) {
          continue;
        }

        const elementsProp = ELEMENT_REFERENCES[name];
        if (elementsProp) {
          // Reference attribute: resolve space-separated IDs to DOM elements and
          // assign via the element reference property (singular or plural).
          const ids = value.split(/\s+/),
            elements = ids
              .map(id => root.querySelector<HTMLElement>(`#${CSS.escape(id)}`))
              .filter((el): el is HTMLElement => el !== null);

          // If not all IDs could be resolved, defer until the referenced elements
          // are in the DOM (e.g. when a sibling is connected after this element).
          // Only defer when at least one element was found (partial resolution),
          // indicating siblings are still rendering. When nothing resolves at all,
          // forward immediately so consumers get a deterministic empty result.
          // After MAX_RETRIES attempts, give up and forward whatever was resolved
          // so permanently-missing IDs don't block indefinitely.
          if (elements.length < ids.length && elements.length > 0) {
            const retries = this.#retryCounts.get(name) ?? 0;
            if (retries < ForwardAriaImpl.#MAX_RETRIES) {
              this.#retryCounts.set(name, retries + 1);
              unresolved.add(name);
              continue;
            }
            // Fallback: forward partially-resolved elements.
            // Clean up retry state since we're done trying.
            this.#retryCounts.delete(name);
          }

          // Clean up retry count on successful resolution.
          this.#retryCounts.delete(name);

          // Mirror the element reference in propertyStorage so that external code
          // (e.g. tooltip anchor matching) can discover the relation via the host.
          let stored = propertyStorage.get(this);
          if (!stored) {
            stored = new Map();
            propertyStorage.set(this, stored);
          }
          const refValue = elementsProp.endsWith('Elements') ? elements : (elements[0] ?? null);
          stored.set(elementsProp, refValue);

          // If no elements could be resolved at all, handle based on scope:
          // - Same scope: forward the string IDREF attribute anyway — the browser's
          //   native resolution works dynamically and will pick up elements that
          //   appear in the DOM later.
          // - Cross scope: forward an empty array so consumers reading the native
          //   property get a deterministic []. Element references can't resolve
          //   natively across shadow boundaries.
          if (elements.length === 0) {
            const targetRoot = targetElement.getRootNode();
            if (targetRoot === root) {
              targetElement.setAttribute(name, value);
            } else {
              (targetElement as unknown as Record<string, Element[] | Element | null>)[
                elementsProp
              ] = refValue;
            }
            this.removeAttribute(name);
            this.#storedValues.delete(name);
            continue;
          }

          // Determine the target's root to decide how to forward the relationship.
          const targetRoot = targetElement.getRootNode();

          if (targetRoot === root) {
            // Same scope: the string attribute reliably resolves IDs. Do NOT set
            // element reference properties here — Chrome replaces the content attribute
            // with an empty marker when ariaLabelledByElements/ariaDescribedByElements
            // is assigned, which breaks the accessibility tree.
            targetElement.setAttribute(name, value);
          } else {
            // Cross-scope (target is inside a shadow root): string IDs cannot resolve
            // across the shadow boundary, so element references are required.
            (targetElement as unknown as Record<string, Element[] | Element | null>)[elementsProp] =
              refValue;
          }
        } else {
          targetElement.setAttribute(name, value);
        }

        this.removeAttribute(name);
        this.#storedValues.delete(name);
      }

      this.#pendingAttributes = unresolved;

      // If some IDs could not be resolved, retry to give sibling elements time to
      // connect to the DOM. Use both setTimeout (new macrotask, after all synchronous
      // rendering) and rAF (next frame) to cover different rendering pipelines.
      if (unresolved.size > 0) {
        setTimeout(() => this.#forwardAttributes(), 0);
        requestAnimationFrame(() => this.#forwardAttributes());
      }
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
          // Only forward non-empty values to the target. Forwarding null or empty arrays
          // can cause the browser to add an empty aria-describedby/aria-labelledby content
          // attribute on the target, which interferes with deferred ID resolution.
          const isEmpty = value === null || (Array.isArray(value) && value.length === 0);
          if (!isEmpty) {
            const root = (this as unknown as Element).getRootNode();
            const targetRoot = target.getRootNode();

            if (targetRoot === root) {
              // Same scope: use string attribute to avoid Chrome clearing it.
              const attrName = Object.entries(ELEMENT_REFERENCES).find(([, p]) => p === prop)?.[0];
              if (attrName) {
                const elements = Array.isArray(value) ? value : [value];
                const ids = elements.map(el => ensureId(el as HTMLElement)).join(' ');
                if (ids) {
                  target.setAttribute(attrName, ids);
                }
              }
            } else {
              // Cross-scope: element references required.
              (target as unknown as Record<string, Element[] | Element | null>)[prop] = value;
            }
          }
        }
      }
    });
  }

  return ForwardAriaImpl;
}
