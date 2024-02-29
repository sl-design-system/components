import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { PopoverPosition } from '@sl-design-system/shared';
import { AnchorController } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './popover.scss.js';

let nextUniqueId = 0;

/**
 * A floating overlay that appears on top of other elements.
 *
 * @csspart container - The container for the popover
 * @slot default - Body content for the popover
 */
export class Popover extends LitElement {
  /** The default padding of the arrow. */
  static arrowPadding = 8;

  /** The default offset of the popover to its anchor. */
  static offset = 12;

  /** @private */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The default margin between the tooltip and the viewport. */
  static viewportMargin = 8;

  /** Controller for managing anchoring. */
  #anchor = new AnchorController(this, {
    arrowElement: '.arrow',
    arrowPadding: Popover.arrowPadding,
    offset: Popover.offset,
    viewportMargin: Popover.viewportMargin
  });

  /**
   * The position of popover relative to its anchor.
   * @type {'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end'}
   */
  @property() position?: PopoverPosition = 'bottom';

  override connectedCallback(): void {
    super.connectedCallback();

    this.id ||= `sl-popover-${nextUniqueId++}`;

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
        <svg viewBox="410.746 247 16 6" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              x1="418.746"
              y1="252.5"
              x2="418.746"
              y2="253"
              id="gradient-1"
            >
              <stop offset="0" style="stop-color: var(--_border-color);" />
              <stop offset="1" style="stop-color: var(--_background);" />
            </linearGradient>
          </defs>
          <path
            d="M 425.226 252.411 C 425.322 252.505 425.429 252.588 425.543 252.661 C 425.658 252.733 425.782 252.795 425.911 252.845 C 426.041 252.896 426.177 252.934 426.317 252.96 C 426.457 252.987 426.601 253 426.746 253 L 422.746 253 L 418.746 253 L 414.746 253 L 410.746 253 C 410.891 253 411.035 252.987 411.175 252.96 C 411.315 252.934 411.45 252.896 411.58 252.845 C 411.709 252.795 411.833 252.733 411.948 252.661 C 412.062 252.588 412.169 252.505 412.265 252.411 L 413.504 251.206 L 414.744 250 L 415.983 248.795 L 417.222 247.589 C 417.424 247.393 417.665 247.246 417.925 247.148 C 418.186 247.049 418.466 247 418.746 247 C 419.026 247 419.306 247.049 419.566 247.148 C 419.827 247.246 420.067 247.393 420.269 247.589 L 421.508 248.795 L 422.747 250 L 423.986 251.206 L 425.226 252.411"
            style="isolation:isolate"
            transform="matrix(0.9999999999999999, 0, 0, 0.9999999999999999, 0, 2.842170943040401e-14)"
            stroke-miterlimit="5.4"
            filter="none"
            paint-order="stroke"
            stroke-opacity=".92"
            stroke="url(#gradient-1)"
          />
        </svg>
      </div>
    `;
  }
}
