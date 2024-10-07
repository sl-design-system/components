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


  override async connectedCallback(): Promise<void> {
    super.connectedCallback();

    // if (!this.hasAttribute('tabindex')) {
    //   this.setAttribute('tabindex', '0');
    // }

    // TODO: any arias needed here?

  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    console.log('changes in updated', changes);
  }

  override render(): TemplateResult {
    return html`
      <button>
        <slot></slot>
      </button>
    `;
  }
}
