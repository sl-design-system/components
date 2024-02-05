import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html, nothing } from 'lit';
import { property, queryAssignedElements } from 'lit/decorators.js';
import styles from './card.scss.js';

/**
 * Let the user know you are processing their data or that the (part of the) page is loading.
 *
 * ```html
 * <sl-card></sl-card>
 * ```

 */
export class Card extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** Observe the grid width. */
  #resizeObserver?: ResizeObserver = new ResizeObserver(() => {
    this.#setOrientation();
    return;
  });

  /** @private The slotted media. */
  @queryAssignedElements({ slot: 'media' }) media?: HTMLElement[];

  @property({ type: Boolean, reflect: true }) padding?: boolean;
  @property({ type: Boolean, reflect: true }) responsive?: boolean;
  @property({ reflect: true }) orientation = 'horizontal';
  @property({ reflect: true }) icon?: string;
  @property({ reflect: true, attribute: 'media-position' }) mediaPosition: string = 'start';

  override connectedCallback(): void {
    super.connectedCallback();
    this.#setOrientation();

    this.#resizeObserver?.observe(this);
  }

  override render(): TemplateResult {
    return html`
      <div class="container">
        <slot name="media" @slotchange=${this.#setOrientation}></slot>
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
    const breakpoint = parseInt(window.getComputedStyle(this).getPropertyValue('--card-horizontal-breakpoint')) || 0;
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
