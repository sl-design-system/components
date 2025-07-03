import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
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
export class Card extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Observe the card width. */
  #resizeObserver?: ResizeObserver = new ResizeObserver(() => {
    this.#setOrientation();
    this.#setLineClamp();
  });

  /** @internal The slotted media. */
  @queryAssignedElements({ slot: 'media' }) media?: HTMLElement[];

  /** this will need the card to have an explicit image size set, either by subgrid or by `--sl-card-media-size`*/
  @property({ reflect: true, attribute: 'fit-image', type: Boolean }) fitImage?: boolean;
  /** When the height is `fixed` the image will determine the height of the card, when it is `flex` the height of the text will determine the height of the card. */
  @property({ reflect: true, attribute: 'image-backdrop', type: Boolean }) imageBackdrop?: boolean;

  /** When the height of the card is set (or constrained) by its container (for example in a grid with fixed rows) this needs to be set to be added in order to assure the correct rendering */
  @property({ type: Boolean, attribute: 'explicit-height' }) explicitHeight?: boolean;
  /** When the grid inside the card is defined by a parent grid */
  @property({ type: Boolean }) subgrid?: boolean;
  /** When the height is `fixed` the image will determine the height of the card, when it is `flex` the height of the text will determine the height of the card. */
  @property({ reflect: true }) height: CardHeightOptions = 'fixed';
  /** The position of the media in relation to the text */
  @property({ reflect: true }) orientation: CardOrientation = 'horizontal';
  /** Show the media at the start or at the end. */
  @property({ reflect: true, attribute: 'media-position' }) mediaPosition: CardMediaPosition = 'start';

  override connectedCallback(): void {
    super.connectedCallback();
    this.#setOrientation();
    this.#setGridSpan();

    this.#resizeObserver?.observe(this);
  }

  override disconnectedCallback(): void {
    this.#resizeObserver?.disconnect();

    super.disconnectedCallback();
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);
    if (this.subgrid) {
      this.#setGridSpan();
    }

    if (changes.has('orientation')) {
      this.#setOrientation();
    }
    if (changes.has('imageBackdrop')) {
      this.#setBackdrop();
    }
  }

  override render(): TemplateResult {
    return html`
      <figure><slot name="media" @slotchange=${this.#setMedia}></slot></figure>
      <div class="header">
        <slot class="title"></slot>
        <slot name="header"></slot>
        <slot name="menu-button"></slot>
      </div>
      <article><slot name="body" @slotchange=${this.#setLineClamp}></slot></article>
      <slot name="actions" @slotchange=${this.#setActions}></slot>
    `;
  }

  #setOrientation(): void {
    if (!this.media || this.media.length === 0) {
      return;
    }

    const breakpoint = parseInt(window.getComputedStyle(this).getPropertyValue('--sl-card-horizontal-breakpoint')) || 0;
    console.log('breakpoint', breakpoint, this.getBoundingClientRect().width);
    this.classList.remove('sl-horizontal');
    if (this.orientation === 'horizontal' && (this.getBoundingClientRect().width > breakpoint || breakpoint === 0)) {
      console.log('set horizontal');
      this.classList.add('sl-horizontal');
    }
  }

  #setMedia(): void {
    this.classList.remove('sl-has-media');

    // if there is no media, we don't need to do anything
    if (!this.media || this.media.length === 0) {
      return;
    }

    this.classList.add('sl-has-media');
    this.#setOrientation();

    console.log(this.imageBackdrop);
    if (this.imageBackdrop) {
      this.#setBackdrop();
    }
  }

  #setBackdrop(): void {
    // if the media is an image, we create a copy of the first media element and set it as the backdrop
    if (!this.media || this.media.length === 0) {
      return;
    }
    const media = this.media[0];
    const backdrop = this.shadowRoot?.querySelector('figure');
    if (!backdrop) {
      return;
    }
    const backdropClone = media.cloneNode(true) as HTMLElement;
    backdropClone.classList.add('backdrop');
    backdrop.appendChild(backdropClone);
  }

  #setLineClamp(): void {
    //calculate the number of lines in the article
    const article = this.renderRoot.querySelector('article');
    if (!article) return;

    article.style.removeProperty('--_line-clamp'); // otherwise it can't calculate the height correctly
    const lineHeight = getComputedStyle(article).lineHeight;

    const lineHeightFont =
      !lineHeight || lineHeight === 'normal'
        ? parseInt(getComputedStyle(article).fontSize) * 1.2
        : parseInt(lineHeight);
    const lines = Math.floor(article.getBoundingClientRect().height / lineHeightFont);
    if (!isNaN(lines) && lines > 0) {
      article.style.setProperty('--_line-clamp', lines.toString());
    }
  }

  #setActions(): void {
    this.#setGridSpan();
    if (!this.shadowRoot) {
      return;
    }
    const actions: HTMLSlotElement | null = this.shadowRoot.querySelector('slot[name="actions"]');

    if (!actions || actions.assignedNodes({ flatten: true }).length === 0) {
      this.classList.remove('sl-has-actions');
    } else {
      this.classList.add('sl-has-actions');
    }
  }

  #setGridSpan(): void {
    let verticalElements = 2; // header and article are always present
    let horizontalElements = 1; // the bare minimum :)
    if (!this.shadowRoot) {
      return;
    }

    const actions: HTMLSlotElement | null = this.shadowRoot.querySelector('slot[name="actions"]');

    if (actions && actions.assignedNodes({ flatten: true }).length > 0) {
      verticalElements++; // actions
    }

    if (this.orientation === 'vertical' && this.media && this.media.length > 0) {
      verticalElements++; // media
    }

    if (this.orientation === 'horizontal' && this.media && this.media.length > 0) {
      horizontalElements++; // media
    }

    this.style.setProperty('--_vertical-elements', verticalElements.toString());
    this.style.setProperty('--_horizontal-elements', horizontalElements.toString());
  }
}
