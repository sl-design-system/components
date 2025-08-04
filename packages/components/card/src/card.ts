import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { MenuButton } from '@sl-design-system/menu';
import { ToggleButton } from '@sl-design-system/toggle-button';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './card.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-card': Card;
  }
}

export type CardOrientation = 'horizontal' | 'vertical';

/**
 * Use cards to display media and text in a compact, appealing way.
 *
 * ```html
 * <sl-card></sl-card>
 * ```
 *
 * @cssprop --sl-card-media-size - Depending on the orientation, this will set the height or width of the media. Can be set in pixels, percentage or `fr`.
 * @cssprop --sl-card-horizontal-breakpoint - When card is smaller than this size it will switch from horizontal (when set) to vertical layout.
 * @cssprop --sl-card-image-backdrop - Color of the image backdrop when `fit-image` is set.
 *
 * @slot default - Title of the card
 * @slot media - Image of the card.
 * @slot header - Subtitle or badges
 * @slot body - Body text of the card
 * @slot actions - Main actions of the card, these will be displayed at the bottom of the card, This can be a single button or a button-bar.
 * @slot menu-button - A menu button to display additional actions or a toggle button. This will be displayed in the header of the card.
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

  /** When set the image won't be stretched and cropped to fill the whole container, but instead shown fully, with a margin around it.
   *  In horizontal mode this will need the card to have an explicit image size set, either by subgrid or by `--sl-card-media-size`*/
  @property({ reflect: true, attribute: 'fit-image', type: Boolean }) fitImage?: boolean;

  /** Adds a little margin around the image */
  @property({ reflect: true, attribute: 'media-margin', type: Boolean }) mediaMargin?: boolean;

  /** When fit-image is set, setting this will create a blurred copy of the image in the margin around the image. */
  @property({ reflect: true, attribute: 'image-backdrop', type: Boolean }) imageBackdrop?: boolean;

  /** When the grid inside the card is defined by a parent grid, ideal for layout consistency, even when the contents of the card change. */
  @property({ type: Boolean }) subgrid?: boolean;

  /** The position of the media in relation to the text */
  @property({ reflect: true }) orientation: CardOrientation = 'horizontal';

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
    if (changes.has('subgrid')) {
      this.#setMedia();
    }
  }

  override render(): TemplateResult {
    return html`
      <figure><slot name="media" @slotchange=${this.#setMedia}></slot></figure>
      <div class="content">
        <div class="header">
          <slot class="title" @slotchange=${this.#setTitle}></slot>
          <slot name="header"></slot>
        </div>
        <slot name="menu-button" @slotchange=${this.#setMenuButton}></slot>
        <slot name="body" @slotchange=${this.#setLineClamp}></slot>
        <slot name="actions" @slotchange=${this.#setActions}></slot>
      </div>
    `;
  }

  #setOrientation(): void {
    if (!this.media || this.media.length === 0) {
      return;
    }

    const breakpoint = parseInt(window.getComputedStyle(this).getPropertyValue('--sl-card-horizontal-breakpoint')) || 0;
    this.classList.remove('sl-horizontal');
    if (this.orientation === 'horizontal' && (this.getBoundingClientRect().width > breakpoint || breakpoint === 0)) {
      this.classList.add('sl-horizontal');
    }

    requestAnimationFrame(() => {
      this.#setGridSpan();
      this.#setMedia();
    }); // wait for the next frame to ensure the styles are applied
  }

  #setMedia(): void {
    this.classList.remove('sl-has-media');
    this.classList.remove('sl-media-explicit-size');

    // if there is no media, we don't need to do anything
    if (!this.media || this.media.length === 0) {
      return;
    }

    if (
      this.subgrid ||
      window.getComputedStyle(this).getPropertyValue('--sl-card-media-size') ||
      this.classList.contains('sl-horizontal')
    ) {
      this.classList.add('sl-media-explicit-size');
    }

    this.classList.add('sl-has-media');

    if (this.imageBackdrop) {
      this.#setBackdrop();
    }
  }

  #setBackdrop(): void {
    // if the media is an image and fitImage is set, we create a copy of the first media element and set it as the backdrop
    if (!this.media || this.media.length === 0 || !this.fitImage || !this.imageBackdrop) {
      this.shadowRoot?.querySelector('.backdrop')?.remove();
      return;
    }
    const media = this.media[0];
    if (this.shadowRoot?.querySelector('.backdrop')) {
      this.shadowRoot.querySelector('.backdrop')?.setAttribute('href', media.getAttribute('href') || '');
    } else {
      const backdrop = this.shadowRoot?.querySelector('figure');
      if (!backdrop) {
        return;
      }
      const backdropClone = media.cloneNode(true) as HTMLElement;
      backdropClone.classList.add('backdrop');
      backdrop.appendChild(backdropClone);
    }
  }

  #setLineClamp(): void {
    //calculate the number of lines in the article
    const article = this.renderRoot.querySelector('slot[name="body"]');
    if (!article) {
      return;
    }

    (article as HTMLElement).style.removeProperty('--_line-clamp'); // otherwise it can't calculate the height correctly
    const lineHeight = getComputedStyle(article).lineHeight;

    const lineHeightFont =
      !lineHeight || lineHeight === 'normal'
        ? parseInt(getComputedStyle(article).fontSize) * 1.2
        : parseInt(lineHeight);
    const lines = Math.floor(article.getBoundingClientRect().height / lineHeightFont);
    if (!isNaN(lines) && lines > 0) {
      (article as HTMLElement).style.setProperty('--_line-clamp', lines.toString());
    }
    this.#setGridSpan();
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
    let verticalElements = 1; // header is always present
    let horizontalElements = 1;

    if (!this.shadowRoot) {
      return;
    }

    const article: HTMLSlotElement | null = this.shadowRoot.querySelector('slot[name="body"]');

    if (article && article.assignedNodes({ flatten: true }).length > 0) {
      verticalElements++; // actions
    }

    const actions: HTMLSlotElement | null = this.shadowRoot.querySelector('slot[name="actions"]');

    if (actions && actions.assignedNodes({ flatten: true }).length > 0) {
      verticalElements++; // actions
    }

    if (!this.classList.contains('sl-horizontal') && this.media && this.media.length > 0) {
      verticalElements++; // media
    }

    if (this.classList.contains('sl-horizontal') && this.media && this.media.length > 0) {
      horizontalElements++; // media
    }

    this.style.setProperty('--_vertical-elements', verticalElements.toString());
    this.style.setProperty('--_horizontal-elements', horizontalElements.toString());
  }

  #setTitle(): void {
    if (!this.shadowRoot) {
      return;
    }

    const title: HTMLSlotElement | null = this.shadowRoot.querySelector('slot.title');

    if (title && title.assignedNodes({ flatten: true }).length > 0) {
      const link = title.assignedNodes({ flatten: true }).find(el => el instanceof HTMLAnchorElement);
      if (!link) {
        this.classList.remove('sl-has-link');
        this.removeEventListener('click', () => {});
      } else {
        this.classList.add('sl-has-link');
        this.addEventListener('click', (e: MouseEvent) => {
          const shouldStopPropagation = e
            .composedPath()
            .find(el => el instanceof Element && (el.matches('sl-button') || el.matches('slot.title')));
          if (!shouldStopPropagation) {
            link.click();
          }
        });
      }
    }
  }

  #setMenuButton(): void {
    if (!this.shadowRoot) {
      return;
    }

    const menu: HTMLSlotElement | null = this.shadowRoot.querySelector('slot[name="menu-button"]');

    if (!menu || menu.assignedNodes({ flatten: true }).length === 0) {
      this.classList.remove('sl-has-menu-button');
    } else {
      const menuButton = menu.assignedNodes({ flatten: true })[0];

      if (menuButton instanceof MenuButton) {
        this.classList.add('sl-has-menu-button');
        menuButton.fill = 'ghost';
        menuButton.size = 'md';
      } else if (menuButton instanceof ToggleButton) {
        this.classList.add('sl-has-menu-button');
        menuButton.size = 'md';
      }
    }
  }
}
