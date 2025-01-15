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
    #targetElement?: HTMLElement;

    setAttributesTarget(target: HTMLElement): void {
      this.#targetElement = target;
    }

    override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
      super.attributeChangedCallback(name, oldValue, newValue);

      requestAnimationFrame(() => {
        console.log(
          'attributeChangedCallback',
          this.#targetElement,
          observedAttributes,
          name,
          oldValue,
          newValue,
          this.#targetElement && observedAttributes.includes(name)
        );
        if (this.#targetElement && observedAttributes.includes(name)) {
          const value = this.getAttribute(name);
          if (value !== null) {
            console.log(
              'should set attribute?',
              this.#targetElement,
              observedAttributes,
              name,
              oldValue,
              newValue,
              'name and value???',
              name,
              value
            );
            this.#targetElement.setAttribute(name, value);
            this.removeAttribute(name);
          }
        }
      });
    }
  }

  return ObserveAttributesImpl;
}
