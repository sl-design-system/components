import {type CSSResultGroup, LitElement, type TemplateResult, html, type PropertyValues} from 'lit';
import styles from './page.scss.js';

declare global {
  // interface GlobalEventHandlersEventMap {
  //   'sl-page-change': SlPageChangeEvent; // SlTabChangeEvent
  // }

  interface HTMLElementTagNameMap {
    'sl-page': Page;
  }
}

// export type SlPageChangeEvent = CustomEvent<number>;

/**
 * A page component that can be used as part of the paginator, representing pages in the paginator.
 *
 */
export class Page extends LitElement {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  // /** @internal Emits when the page has been selected/changed. */
  // @event({ name: 'sl-page-change' }) pageChangeEvent!: EventEmitter<SlPageChangeEvent>;

  /** @internal page number used for the aria-label */
  #pageNumber = '';


  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    // if (!this.hasAttribute('tabindex')) {
    //   this.setAttribute('tabindex', '0');
    // }

    // TODO: any arias needed here?

    this.#pageNumber = Array.from(this.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent?.trim())
      .join('');

    console.log('this.childNodes', this.childNodes, /*(this.childNodes as Node[]).filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent?.trim())
      .join('')*/
      Array.from(this.childNodes).filter(node => {
        return node.nodeType === Node.ELEMENT_NODE || (node.textContent && node.textContent.trim().length > 0);
      }),
      Array.from(this.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent?.trim())
        .join(''));

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
    const hasText = !!event.target
      .assignedNodes({ flatten: true })
      .filter(node => node.textContent && node.textContent.trim().length > 0).length;
    this.#pageNumber = event.target
      .assignedNodes({ flatten: true })
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent?.trim())
      .join('');

    console.log('hasText in page', hasText, !!event.target
      .assignedNodes({ flatten: true }).filter(node => node.textContent), Array.from(event.target.assignedElements({ flatten: true })), event.target,
       event.target
        .assignedNodes({ flatten: true })
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent?.trim())
        .join(''));
    console.log('pageNumber', this.#pageNumber);
  }
}
