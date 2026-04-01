import { type Constructor } from '@open-wc/dedupe-mixin';
import { type ReactiveElement } from 'lit';

export interface ObserveAttributesMixinInterface {
  setAttributesTarget(target: HTMLElement): void;
}

/**
 * Mixin that is used to rewrite aria attributes in the component (based on the observedAttributes) to the focusable target element.
 */
export function ObserveAttributesMixin<T extends Constructor<ReactiveElement> & { observedAttributes?: string[] }>(
  constructor: T,
  observedAttributes: string[] = []
): T & Constructor<ObserveAttributesMixinInterface> {
  class ObserveAttributesImpl extends constructor {
    #pendingAttributes = new Set<string>();
    #targetElement?: Element;

    static override get observedAttributes(): string[] {
      return [...(super.observedAttributes ?? []), ...observedAttributes];
    }

    /** @internal */
    setAttributesTarget(target: Element): void {
      this.#targetElement = target;

      // Forward any attributes that were set before the target was available
      this.#forwardAttributes();
    }

    override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
      super.attributeChangedCallback(name, oldValue, newValue);

      if (observedAttributes.includes(name) && newValue !== null) {
        this.#pendingAttributes.add(name);
        this.#forwardAttributes();
      }
    }

    #forwardAttributes(): void {
      if (!this.#targetElement || this.#pendingAttributes.size === 0) {
        return;
      }

      for (const name of this.#pendingAttributes) {
        const value = this.getAttribute(name);

        if (value !== null) {
          this.#targetElement.setAttribute(name, value);
          this.removeAttribute(name);
        }
      }

      this.#pendingAttributes.clear();
    }
  }

  return ObserveAttributesImpl;
}
