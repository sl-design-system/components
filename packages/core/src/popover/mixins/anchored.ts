import type { Constructor } from '../../utils/mixin-types.js';
import type { PropertyValues, ReactiveElement } from 'lit';
import { supportsAnchor } from '../../utils/css.js';

export interface AnchoredInterface {
  anchorElement: HTMLElement;
}

export function AnchoredMixin<T extends Constructor<ReactiveElement>>(
  constructor: T
): T & Constructor<AnchoredInterface> {
  class AnchoredElement extends constructor {
    get anchorElement(): HTMLElement {
      return this._anchorElement;
    }

    set anchorElement(anchor: HTMLElement) {
      if (anchor === this.anchorElement) return;
      if (this.anchorElement) {
        this.removeEventListenersFromAnchor();
        if (supportsAnchor) {
          this.anchorElement.style.anchorName = '';
        }
      }
      this._anchorElement = anchor;
      if (supportsAnchor) {
        this.anchorElement.style.anchorName = '--anchor';
      }
      console.log('y');
      this.addEventListenersToAnchor();
    }

    private _anchorElement!: HTMLElement;

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

      this.resolveAnchor();
    }

    resolveAnchor(): void {
      const id = this.getAttribute('anchor');
      if (!id) return;
      const parent = this.getRootNode() as HTMLElement;
      const target = parent.querySelector(`#${id}`) as HTMLElement;
      if (!target) return;
      this.anchorElement = target;
    }
  }

  return AnchoredElement;
}
