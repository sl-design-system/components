import { faChevronLeft, faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { localized } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { Select, SelectOption } from '@sl-design-system/select';
import {type EventEmitter, event} from '@sl-design-system/shared';
import {type CSSResultGroup, LitElement, type TemplateResult, html, nothing, type PropertyValues} from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './page-size.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-page-size-change': SlPageSizeChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-page-size': PageSize;
  }
}

Icon.register(faChevronLeft, faChevronRight);

export type SlPageSizeChangeEvent = CustomEvent<number>;

/**
 * A component that can be used with paginator. Add possibility to select/change the amount of items
 * that would be visible per page.
 */
@localized()
export class PageSize extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-select': Select,
      'sl-select-option': SelectOption
    }; // TODO: update dependencies
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when the page size has been selected/changed. */
  @event({ name: 'sl-page-size-change' }) pageSizeChangeEvent!: EventEmitter<SlPageSizeChangeEvent>;

  // data - how to connect with data? make an example / story

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
        <div class="page-sizes">
        Items per page:
        ${this.pageSizes ?
      html`
        <sl-select size="lg" .value=${this.itemsPerPage}>
            ${this.pageSizes?.map(
        (size) => html`
                <sl-select-option @click=${this.#setValue} .value=${size}>${size}</sl-select-option
              `
      )}
        </sl-select>
        </div>
      `
      : nothing}
    `;
  }

  #setValue(event: Event & { target: SelectOption }): void {
    this.itemsPerPage = Number(event.target.value);

    /** Emits amount of selected items per page */
    this.pageSizeChangeEvent.emit(this.itemsPerPage);
  }
}

// TODO: accessibility

// TODO: translation with msg
