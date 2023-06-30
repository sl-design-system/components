import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { PopoverPosition } from '@sl-design-system/shared';
import { AnchorController, popoverPolyfillStyles } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './popover.scss.js';

/**
 * Base popover web component.
 *
 * @csspart container - The container for the popover
 */
export class Popover extends LitElement {
  /** @private */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @private */
  static override styles: CSSResultGroup = [popoverPolyfillStyles, styles];

  /** Controller for managing anchoring. */
  #anchor = new AnchorController(this, { arrow: '.arrow' });

  /** The position of this popover relative to its anchor. */
  @property() position?: PopoverPosition = 'top';

  constructor() {
    super();

    if (!this.hasAttribute('popover')) {
      this.setAttribute('popover', '');
    }
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('position')) {
      this.#anchor.position = this.position;
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="container" part="container">
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
}
