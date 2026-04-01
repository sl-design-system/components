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
 * Mixin that proxies ARIA attributes from the host element to a target element inside the shadow DOM.
 * For reference attributes (aria-labelledby, aria-describedby, aria-controls), it resolves the IDs
 * to actual elements and sets the corresponding Elements property on the target.
 * Other observed attributes are forwarded as-is.
 *
 * If no observedAttributes are specified, all aria-* attributes are proxied using a MutationObserver.
 */
export function ProxyAriaAttributesMixin<T extends Constructor<ReactiveElement> & { observedAttributes?: string[] }>(
  constructor: T,
  observedAttributes?: string[]
): T & Constructor<ProxyAriaAttributesMixinInterface> {
  class ProxyAriaAttributesImpl extends constructor {
    #observer?: MutationObserver;
    #pendingAttributes = new Set<string>();
    #targetElement?: HTMLElement;

    static override get observedAttributes(): string[] {
      return [...(super.observedAttributes ?? []), ...(observedAttributes ?? [])];
    }

    /** @internal */
    setProxyTarget(target: HTMLElement): void {
      this.#targetElement = target;

      // Forward any attributes that were set before the target was available
      this.#forwardAttributes();
    }

    override connectedCallback(): void {
      super.connectedCallback();

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

      if (observedAttributes?.includes(name) && newValue !== null) {
        this.#pendingAttributes.add(name);
        this.#forwardAttributes();
      }
    }

    #forwardAttributes(): void {
      if (!this.#targetElement || this.#pendingAttributes.size === 0) {
        return;
      }

      const root = this.getRootNode() as Document | ShadowRoot;

      for (const name of this.#pendingAttributes) {
        const value = this.getAttribute(name);
        if (!value) {
          continue;
        }

        const elementsProp = ELEMENT_REFERENCES[name];
        if (elementsProp) {
          const elements = value
            .split(/\s+/)
            .map(id => root.querySelector<HTMLElement>(`#${CSS.escape(id)}`))
            .filter((el): el is HTMLElement => el !== null);

          if (elementsProp.endsWith('Elements')) {
            (this.#targetElement as unknown as Record<string, Element[]>)[elementsProp] = elements;
          } else {
            (this.#targetElement as unknown as Record<string, Element | null>)[elementsProp] = elements[0] ?? null;
          }
        } else {
          this.#targetElement.setAttribute(name, value);
        }

        this.removeAttribute(name);
      }

      this.#pendingAttributes.clear();
    }
  }

  return ProxyAriaAttributesImpl;
}
