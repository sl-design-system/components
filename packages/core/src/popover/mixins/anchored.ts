import type { Constructor } from '../../utils/mixins/types.js';
import type { PropertyValues, ReactiveElement } from 'lit';
import { supportsAnchor } from '../../utils/css.js';

export interface AnchoredInterface {
  anchorElement?: HTMLElement;

  addEventListenersToAnchor(): void;
  removeEventListenersFromAnchor(): void;
}

export function AnchoredMixin<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<AnchoredInterface> {
  class AnchoredElement extends constructor {
    #anchorElement?: HTMLElement;

    get anchorElement(): HTMLElement | undefined {
      return this.#anchorElement;
    }

    set anchorElement(anchor: HTMLElement | undefined) {
      if (anchor === this.anchorElement) {
        return;
      }

      if (this.anchorElement) {
        this.removeEventListenersFromAnchor();

        if (supportsAnchor) {
          this.anchorElement.style.anchorName = '';
        }
      }

      this.#anchorElement = anchor;

      if (supportsAnchor && this.anchorElement) {
        this.anchorElement.style.anchorName = '--anchor';
      }

      console.log('anchorElement', this.anchorElement);

      this.addEventListenersToAnchor();
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    addEventListenersToAnchor(): void {}

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    removeEventListenersFromAnchor(): void {}

    override connectedCallback(): void {
      super.connectedCallback();

      if (this.anchorElement) {
        this.addEventListenersToAnchor();
      }
    }

    override disconnectedCallback(): void {
      this.removeEventListenersFromAnchor();

      super.disconnectedCallback();
    }

    override firstUpdated(changes: PropertyValues<this>): void {
      super.firstUpdated(changes);

      this.#resolveAnchor();
    }

    #resolveAnchor(): void {
      const id = this.getAttribute('anchor');
      if (!id) {
        return;
      }

      const root = this.getRootNode() as HTMLElement,
        target = root.querySelector(`#${id}`) as HTMLElement;

      if (!target) {
        return;
      }

      this.anchorElement = target;
    }
  }

  return AnchoredElement;
}
