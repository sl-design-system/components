import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import styles from './page.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-page': Page;
  }
}

/**
 * A page internal component, that is used as part of the paginator, representing pages in the paginator.
 */
export class Page extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Page number used for the aria-label. */
  #pageNumber = '';

  override connectedCallback(): void {
    super.connectedCallback();

    this.#pageNumber = Array.from(this.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent?.trim())
      .join('');
  }

  override render(): TemplateResult {
    return html`
      <button aria-label=${this.#pageNumber + ', page'}>
        <slot @slotchange=${this.#onSlotChange}></slot>
      </button>
    `;
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    this.#pageNumber = event.target
      .assignedNodes({ flatten: true })
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent?.trim())
      .join('');
  }
}
