import { LitElement } from 'lit';
import { Constructor } from '../types.js';

export interface ObserveAttributesMixinInterface {
  setTargetElement(element: HTMLElement): void;
  setObservedAttributes(attributes: string[]): void;
}

export function ObserveAttributesMixin<T extends Constructor<LitElement>>(
  Base: T
): T & Constructor<ObserveAttributesMixinInterface> {
  class ObserveAttributesImpl extends Base implements ObserveAttributesMixinInterface {
    #targetElement: HTMLElement | null = null;
    static #observedAttributes: string[] = [];

    // static get observedAttributes(): string[] {
    //   // console.log('attributesToObserve in static', this.attributesToObserve);
    //   // console.log('in observedAttributes', (ObserveAttributesImpl as unknown as typeof LitElement).observedAttributes ?? []);
    //   //  return (ObserveAttributesImpl as unknown as typeof LitElement).observedAttributes ?? []; //['aria-disabled', 'aria-label'];
    //  // console.log('ObserveAttributesImpl.#observedAttributes', ObserveAttributesImpl.#observedAttributes);
    //  return [...ObserveAttributesImpl.#observedAttributes];
    //   // return ['aria-disabled', 'aria-label']; //[...ObserveAttributesImpl.#observedAttributes] || []; //['aria-disabled', 'aria-label'];// ObserveAttributesImpl.#observedAttributes; //['aria-disabled', 'aria-label'];
    // }

    setTargetElement(element: HTMLElement): void {
      console.log('element in setTarget', element);
      this.#targetElement = element;
    }

    setObservedAttributes(attributes: string[]): void {
      console.log('attributes', attributes);
      ObserveAttributesImpl.#observedAttributes = attributes;
      // ObserveAttributesImpl.observedAttributes = attributes;
    }

    // static get observedAttributes(): string[] {
    //     const baseClass = Base as unknown as { observedAttributes?: string[] };
    //     const baseObservedAttributes = baseClass.observedAttributes || [];
    //     console.log('ObserveAttributesImpl._observedAttributes', ObserveAttributesImpl._observedAttributes, this);
    //     return [...baseObservedAttributes, ...ObserveAttributesImpl._observedAttributes];
    // }

    // static get observedAttributes(): string[] {
    //         // const baseClass = Base as unknown as { observedAttributes?: string[] };
    //         // const baseObservedAttributes = baseClass.observedAttributes || [];
    //         // console.log('attrs', baseClass, baseObservedAttributes);
    //   // console.log('observedAttributes', this.observedAttributes);
    //     return [/*...baseObservedAttributes,*/ /*'aria-disabled', 'aria-label'*/ ...this.observedAttributes];
    // }

    override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
      super.attributeChangedCallback(name, oldValue, newValue);
      console.log('attributeChangedCallback', name, oldValue, newValue /*, this.observedAttributes*/);
      requestAnimationFrame(() => {
        console.log('attributeChangedCallback2', name, oldValue, newValue, this.#targetElement);
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

/*type SuperConstructor<T = {}> = new (...args: any[]) => T;

export const ObserveAttributesMixin = <T extends SuperConstructor<LitElement>>(superclass: T) => {
  class AttributeObserverClass extends superclass {
    static get observedAttributes(): string[] {
      const superObservedAttributes = (superclass as any).observedAttributes || [];
      return [...superObservedAttributes, 'aria-disabled', 'aria-label'];
    }

    #observedAttributes: string[] = ['aria-disabled', 'aria-label'];
    #targetElement: HTMLElement | null = null;

    set targetElement(element: HTMLElement | null) {
      this.#targetElement = element;
    }

    set observedAttributes(attributes: string[]) {
      this.#observedAttributes = attributes;
    }

    override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
      super.attributeChangedCallback(name, oldValue, newValue);
      requestAnimationFrame(() => {
        if (this.targetElement && this.observedAttributes.includes(name)) {
          this.observedAttributes.forEach(attr => {
            const value = this.getAttribute(attr);
            if (value !== null && this.targetElement) {
              this.targetElement.setAttribute(attr, value);
              this.removeAttribute(attr);
            }
          });
        }
      });
    }
  }

  return AttributeObserverClass;
};*/
