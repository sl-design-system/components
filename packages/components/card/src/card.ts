import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
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

  @property({ type: Boolean, reflect: true }) padding?: boolean;
  @property({ type: Boolean, reflect: true }) responsive?: boolean;
  @property({ reflect: true }) orientation = 'horizontal';
  @property({ reflect: true }) icon?: string;

  override connectedCallback(): void {
    super.connectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <div class="container">
        <slot name="media"></slot>
        <slot name="actions"></slot>
        <div class="content">
          ${this.icon ? html`<sl-icon .name=${this.icon}></sl-icon>` : nothing}
          <header>
            <slot class="title"></slot>
            <slot name="header"></slot>
          </header>
          <slot name="body"></slot>
        </div>
      </div>
    `;
  }
}
