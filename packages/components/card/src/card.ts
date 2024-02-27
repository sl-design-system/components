import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import { LitElement, html, nothing } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './card.scss.js';

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
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Observe the grid width. */
  #resizeObserver?: ResizeObserver = new ResizeObserver(() => {
    this.#setOrientation();
  });

  /** @private The slotted media. */
  @queryAssignedElements({ slot: 'media' }) media?: HTMLElement[];

  @property({ type: Boolean, reflect: true }) padding: boolean = false;
  @property({ reflect: true }) height: CardHeightOptions = 'fixed';
  @property({ reflect: true }) orientation: CardOrientation = 'horizontal';
  @property({ reflect: true }) icon?: string;
  @property({ reflect: true, attribute: 'media-position' }) mediaPosition: CardMediaPosition = 'start';

  override connectedCallback(): void {
    super.connectedCallback();
    this.#setOrientation();

    this.#resizeObserver?.observe(this);
  }

  override disconnectedCallback(): void {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = undefined;

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
      <div class="container">
        <div class="media-wrapper">
          <slot name="media" @slotchange=${this.#setOrientation}></slot>
        </div>
        <div class="content">
          ${this.icon ? html`<sl-icon .name=${this.icon}></sl-icon>` : nothing}
          <header>
            <slot class="title"></slot>
            <slot name="header"></slot>
          </header>
          <article><slot name="body"></slot></article>
        </div>
        <slot name="actions"></slot>
      </div>
    `;
  }

  #setOrientation(): void {
    const breakpoint = parseInt(window.getComputedStyle(this).getPropertyValue('--sl-card-horizontal-breakpoint')) || 0;
    const hasMedia = this.media ? this.media?.length > 0 : false;
    this.classList.remove('horizontal', 'has-media');
    if (!hasMedia) return;

    if (this.orientation === 'horizontal' && (this.getBoundingClientRect().width > breakpoint || breakpoint === 0)) {
      this.classList.add('horizontal');
    } else {
      this.classList.add('has-media');
    }
  }
}
