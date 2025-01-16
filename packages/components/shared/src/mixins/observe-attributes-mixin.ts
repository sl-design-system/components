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

      console.log(
        'attributeChangedCallback name before raf',
        name,
        observedAttributes.includes(name),
        this.#targetElement
      );

      requestAnimationFrame(() => {
        console.log(
          'attributeChangedCallback',
          this.#targetElement,
          observedAttributes,
          name,
          oldValue,
          newValue,
          this.#targetElement && observedAttributes.includes(name),
          'observedAttributes.includes(name)???????',
          observedAttributes.includes(name),
          name
        );

        console.log(
          'attributeChangedCallback name after raf',
          name,
          observedAttributes.includes(name),
          this.#targetElement
        );

        // console.log('attributeChangedCallback name', name, observedAttributes, observedAttributes.includes(name), 'this.getAttribute(name)???', this.getAttribute(name));
        if (this.#targetElement && observedAttributes.includes(name) && !this.#targetElement.hasAttribute(name)) {
          // TODO: will not work for double aria-describedby etc.?
          const value = this.getAttribute(name);
          // if (value !== null || value === '') {
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

          if (value === '') {
            this.#targetElement.setAttribute(name, '');
          } else if (value !== null) {
            this.#targetElement.setAttribute(name, value);
          }

          // this.#targetElement.setAttribute(name, value ?? '');
          this.removeAttribute(name);
          // }
          /*else if (name) {
            this.#targetElement.setAttribute(name, '');
            this.removeAttribute(name);
          }*/
        }
      });
    }
  }

  return ObserveAttributesImpl;
}
