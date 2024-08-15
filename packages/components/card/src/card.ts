/* eslint-disable wc/no-self-class */
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './card.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-card': Card;
  }
}

export type CardHeightOptions = 'fixed' | 'flex';
export type CardOrientation = 'horizontal' | 'vertical';
export type CardMediaPosition = 'start' | 'end';

/**
 * Use cards to display media and text in a compact, appealing way.
 *
 * ```html
 * <sl-card></sl-card>
 * ```
 *
 * @cssprop --sl-card-media-aspect-ratio - The aspectratio of the media container (default is 4/3). By default this ratio is always maintained, and will cause the media to become smaller when there isn't sufficient space for the full width.
 * @cssprop --sl-card-media-width - The width of the media in relation to the text. Can be set in pixels or `fr`.
 * @cssprop --sl-card-media-x - X-Focuspoint of the media; this is taken as the center when the media is cropped.
 * @cssprop --sl-card-media-y - Y-Focuspoint of the media; this is taken as the center when the media is cropped.
 * @cssprop --sl-card-orientation-breakpoint - When card is smaller than this size it will switch from horizontal (when set) to vertical layout.
 * @cssprop --sl-card-stretch-image - Set this to 100% when the aspectratio of the media doesn't matter and you want it to fill the full height of the card.
 * @cssprop --sl-card-text-width - The width of the text in relation to the media. Can be set in pixels (not recommended) or `fr`.
 *
 * @slot default - Title of the card
 * @slot media - Media, this can be an image or video
 * @slot header - Subtitle or badges
 * @slot body - Body text of the card
 * @slot actions - Icon button for actions on the card.
 */
export class Card extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Observe the card width. */
  #resizeObserver?: ResizeObserver = new ResizeObserver(() => {
    this.#setOrientation();
  });

  /** @internal The slotted media. */
  @queryAssignedElements({ slot: 'media' }) media?: HTMLElement[];
  /** @internal The slotted icon. */
  @queryAssignedElements({ slot: 'icon' }) icon?: HTMLElement[];

  /** Indicates whether there is a padding around the media. Recommended to set to true when the `--sl-card-stretch-image` isn't set to 100% */
  @property({ type: Boolean, reflect: true }) padding: boolean = false;
  /** When the height of the card is set (or constrained) by its container (for example in a grid with fixed rows) this needs to be set to be added in order to assure the correct rendering */
  @property({ type: Boolean, attribute: 'explicit-height' }) explicitHeight?: boolean;
  /** When the height is `fixed` the image will determine the height of the card, when it is `flex` the height of the text will determine the height of the card. */
  @property({ reflect: true }) height: CardHeightOptions = 'fixed';
  /** The position of the media in relation to the text */
  @property({ reflect: true }) orientation: CardOrientation = 'horizontal';
  /** Show the media at the start or at the end. */
  @property({ reflect: true, attribute: 'media-position' }) mediaPosition: CardMediaPosition = 'start';

  override connectedCallback(): void {
    super.connectedCallback();
    this.#setOrientation();

    this.#resizeObserver?.observe(this);
  }

  override disconnectedCallback(): void {
    this.#resizeObserver?.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('orientation')) {
      this.#setOrientation();
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="media-wrapper">
        <slot name="media" @slotchange=${this.#setOrientation}></slot>
      </div>
      <div class="content">
        <slot name="icon" @slotchange=${this.#setIcon}></slot>
        <header>
          <slot class="title"></slot>
          <slot name="header"></slot>
        </header>
        <article><slot name="body"></slot></article>
      </div>
      <slot name="actions"></slot>
    `;
  }

  #setIcon(): void {
    const hasIcon = this.icon ? this.icon.length > 0 : false;
    this.classList.remove('sl-has-icon');
    if (!hasIcon) return;
    this.classList.add('sl-has-icon');
  }

  #setOrientation(): void {
    const breakpoint = parseInt(window.getComputedStyle(this).getPropertyValue('--sl-card-horizontal-breakpoint')) || 0;
    const hasMedia = this.media ? this.media.length > 0 : false;
    this.classList.remove('sl-horizontal', 'sl-has-media');
    if (!hasMedia) return;

    if (this.orientation === 'horizontal' && (this.getBoundingClientRect().width > breakpoint || breakpoint === 0)) {
      this.classList.add('sl-horizontal');
    } else {
      this.classList.add('sl-has-media');
    }
  }
}
