import { LitElement } from 'lit';
import { Constructor } from '../types.js';

export interface ObserveAttributesMixinInterface {
  setAttributesTarget(target: HTMLElement): void;
}

/**
 * Mixin that is used to rewrite aria attributes in the component (based on the observedAttributes) to the focusable target element.
 */
export function ObserveAttributesMixin<T extends Constructor<LitElement>>(
  constructor: T,
  observedAttributes: string[] = []
): T & Constructor<ObserveAttributesMixinInterface> {
  class ObserveAttributesImpl extends constructor {
    #targetElement?: Element;

    setAttributesTarget(target: Element): void {
      this.#targetElement = target;
    }

    override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
      super.attributeChangedCallback(name, oldValue, newValue);

      requestAnimationFrame(() => {
        if (this.#targetElement && observedAttributes.includes(name)) {
          const value = this.getAttribute(name);
          if (value !== null) {
            this.#targetElement.setAttribute(name, value);
            this.removeAttribute(name);
          }
        }
      });
    }
  }

  return ObserveAttributesImpl;
}
