import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Select, SelectOption } from '@sl-design-system/select';
import {type EventEmitter, event} from '@sl-design-system/shared';
import {type CSSResultGroup, LitElement, type TemplateResult, html, nothing, type PropertyValues} from 'lit';
import { property } from 'lit/decorators.js';
import styles from './page-size.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-page-size-change': SlPageSizeChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-page-size': PageSize;
  }
}

export type SlPageSizeChangeEvent = CustomEvent<number>;

/**
 * A component that can be used with paginator.
 * The component adds a possibility to select/change the amount of items that would be visible per page.
 */
@localized()
export class PageSize extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-select': Select,
      'sl-select-option': SelectOption
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when the page size has been selected/changed. */
  @event({ name: 'sl-page-size-change' }) pageSizeChangeEvent!: EventEmitter<SlPageSizeChangeEvent>;

  /** Page sizes - array of possible page sizes e.g. [5, 10, 15] */
  @property({ type: Number, attribute: 'page-sizes' }) pageSizes?: number[];

  /** Items per page. Default to the first item of pageSizes, if pageSizes is not set - default to 10. */
  @property({ type: Number, attribute: 'items-per-page' }) itemsPerPage?: number;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.itemsPerPage) {
      this.itemsPerPage = this.pageSizes ? this.pageSizes[0] : 10;
    }
  }

  override render(): TemplateResult {
    return html`
        <span>${msg('Items per page')}:</span>
        ${this.pageSizes ?
      html`
        <sl-select aria-label=${`${this.itemsPerPage} ${msg('Items per page')}`} size="lg" value=${this.itemsPerPage}>
            ${this.pageSizes.map(
        (size) => html`
                <sl-select-option aria-label=${`${size} ${msg('Items per page')}`} @click=${this.#setValue} @keydown=${this.#onKeydown} .value=${size}>
                  ${size}
                </sl-select-option
              `
      )}
        </sl-select>
      `
      : nothing}
        <!-- We want this to be read every time the active page changes. -->
        <span id="live" aria-live="polite" aria-atomic="true">Currently selected amount of items: ${this.itemsPerPage}</span>
    `;
  }

  #setValue(event: Event & { target: SelectOption }): void {
    console.log('event', event);
    this.itemsPerPage = Number(event.target.value);

    /** Emits amount of selected items per page */
    this.pageSizeChangeEvent.emit(this.itemsPerPage);
  }

  #onKeydown(event: KeyboardEvent): void {
    console.log('event222', event);
    if (event.key === 'Enter' || event.key === ' ') {
      this.click();

      event.preventDefault();
      event.stopPropagation();
    }
  }
}

// TODO: accessibility
