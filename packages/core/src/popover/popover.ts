import type { Placement } from './utils/position-anchored-element.js';
import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
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

  /** Popover placement relative to the anchor. */
  @property() placement: Placement = 'top';

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('popover', '');
  }

  override render(): TemplateResult {
    return html`
      <div @click=${(event: Event) => event.stopPropagation()} class="container" part="container">
        <slot></slot>
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
