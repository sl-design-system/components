import { type CSSResultGroup, html, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import styles from './page.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-page': Page;
  }
}

/**
 * A page component that can be used as part of the paginator, representing pages in the paginator.
 *
 */
export class Page extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal page number used for the aria-label */
  #pageNumber = '';

  override connectedCallback(): void {
    super.connectedCallback();

    // TODO: any arias needed here?

    this.#pageNumber = Array.from(this.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent?.trim())
      .join('');
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    console.log('changes in updated', changes);
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
