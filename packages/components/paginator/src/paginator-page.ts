import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import styles from './paginator-page.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-paginator-page': PaginatorPage;
  }
}

/**
 * A page internal component, that is used as part of the paginator, representing pages in the paginator.
 */
export class PaginatorPage extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Page number used for the aria-label. */
  @state() page?: string;

  override render(): TemplateResult {
    return html`
      <button aria-label=${this.page + ', page'}>
        <slot @slotchange=${this.#onSlotChange}></slot>
      </button>
    `;
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.page = event.target
      .assignedNodes({ flatten: true })
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent?.trim())
      .join('');
  }
}
