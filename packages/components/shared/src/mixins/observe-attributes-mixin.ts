import { LitElement } from 'lit';
import { Constructor } from '../types.js';

export interface ObserveAttributesMixinInterface {
  setTargetElement(target: HTMLElement): void;
  setObservedAttributes(attributes: string[]): void;
}

/**
 * Mixin that is used to rewrite aria attributes in the component (based on the observedAttributes) to the focusable target element.
 */
export function ObserveAttributesMixin<T extends Constructor<LitElement>>(
  constructor: T
): T & Constructor<ObserveAttributesMixinInterface> {
  class ObserveAttributesImpl extends constructor {
    static #observedAttributes: string[] = [];

    #targetElement: HTMLElement | null = null;

    setTargetElement(target: HTMLElement): void {
      this.#targetElement = target;
    }

    setObservedAttributes(attributes: string[]): void {
      ObserveAttributesImpl.#observedAttributes = attributes;
    }

    override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
      super.attributeChangedCallback(name, oldValue, newValue);

      requestAnimationFrame(() => {
        if (this.#targetElement && ObserveAttributesImpl.#observedAttributes.includes(name)) {
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
