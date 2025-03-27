import { AnchorController, type PopoverPosition } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './popover.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-popover': Popover;
  }
}

let nextUniqueId = 0;

/**
 * A floating overlay that appears on top of other elements.
 *
 * @csspart container - The container for the popover
 * @slot default - Body content for the popover
 */
export class Popover extends LitElement {
  /** @internal The default padding of the arrow. */
  static arrowPadding = 16;

  /** @internal The default offset of the popover to its anchor. */
  static offset = 12;

  /** @internal */
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal The default margin between the tooltip and the viewport. */
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
   * @default bottom
   */
  @property() position?: PopoverPosition = 'bottom';

  /**
   * When the contents of your popover is too long to be read inline this should be set to true so the user
   * can navigate to the popover content themselves. `aria-details` is always set, regardless of this property.
   * Read more about this in the [accessibility documentation](https://sanomalearning.design/categories/components/popover/accessibility/).
   */
  @property({ type: Boolean, attribute: 'no-describedby' }) noDescribedby?: boolean;

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
      <div class="arrow" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" clip-rule="evenodd" viewBox="0 0 16 6">
          <path
            d="M14.48 5.911c.196.191.429.338.685.434.266.104.549.156.835.155H0c.424.002.841-.116 1.202-.339.114-.073.221-.156.317-.25l1.239-1.205L3.998 3.5l1.239-1.205 1.239-1.206c.202-.196.443-.343.703-.441C7.441.549 7.72.499 8 .5c.28 0 .56.049.82.148.261.098.501.245.703.441l1.239 1.206L12.001 3.5l1.239 1.206 1.24 1.205"
          />
        </svg>
      </div>
    `;
  }
}
