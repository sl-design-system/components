import type { Placement } from './utils/position-anchored-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { AnchoredPopoverMixin } from './mixins/anchored-popover.js';
import styles from './popover.scss.js';
import { popoverMixinStyles } from './mixins/popover.js';

/**
 * Base popover web component.
 *
 * @csspart container - The container for the popover
 */
export class Popover extends AnchoredPopoverMixin(LitElement) {
  /** @private */
  static override styles: CSSResultGroup = [popoverMixinStyles, styles];

  #onAnchorClick = (event: Event): void => {
    this.#onClick(event);
    event.preventDefault();
  };

  /** The arrow linking the popover to the anchor element. */
  @query('.arrow') arrow!: Element;

  /** Popover placement relative to the anchor. */
  @property() placement: Placement = 'top';

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.hasAttribute('popover')) {
      this.setAttribute('popover', '');
    }
  }

  override render(): TemplateResult {
    return html`
      <div @click=${(event: Event) => event.stopPropagation()} class="container" part="container">
        <slot></slot>
      </div>
      <div class="arrow">
        <svg xmlns="http://www.w3.org/svg/2000" width="24" height="12" viewBox="0 0 24 12">
          <defs>
            <clipPath id="modal-arrow-cut-stroke-top"><path d="m 24 0 l -10 10 q -2 2 -4 0 l -10 -10"></path></clipPath>
          </defs>
          <path clip-path="url(#modal-arrow-cut-stroke-top)" d="m 24 0 l -10 10 q -2 2 -4 0 l -10 -10"></path>
        </svg>
      </div>
    `;
  }

  override addEventListenersToAnchor(): void {
    this.anchorElement?.addEventListener('click', this.#onAnchorClick);
  }

  override removeEventListenersFromAnchor(): void {
    this.anchorElement?.removeEventListener('click', this.#onAnchorClick);
  }

  #onClick(event: Event): void {
    if (event.defaultPrevented) {
      return;
    }

    this.open = !this.open;
  }
}
