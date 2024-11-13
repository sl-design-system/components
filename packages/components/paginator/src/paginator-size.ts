import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type DataSource } from '@sl-design-system/data-source';
import { Label } from '@sl-design-system/form';
import { Select, SelectOption } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './paginator-size.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-page-size-change': SlChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-paginator-size': PaginatorSize;
  }
}

/**
 * A component that can be used with the paginator.
 * The component adds a possibility to select/change the amount of items that would be visible per page.
 */
@localized()
export class PaginatorSize extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-label': Label,
      'sl-select': Select,
      'sl-select-option': SelectOption
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Provided data source. */
  @property({ attribute: false }) dataSource?: DataSource;

  /** Items per page. Default to the first item of pageSizes, if pageSizes is not set - default to 10. */
  @property({ type: Number, attribute: 'page-size' }) pageSize?: number;

  /** @internal Emits when the page size has been selected/changed. */
  @event({ name: 'sl-page-size-change' }) pageSizeChangeEvent!: EventEmitter<SlChangeEvent<number>>;

  /** Page sizes - array of possible page sizes e.g. [5, 10, 15]. */
  @property({ type: Number, attribute: 'page-sizes' }) pageSizes?: number[];

  override disconnectedCallback(): void {
    this.dataSource?.removeEventListener('sl-update', this.#onUpdate);

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);
    if (changes.has('pageSize')) {
      if (!this.pageSize) {
        this.pageSize = this.pageSizes ? this.pageSizes[0] : 10;
      }
    }

    if (changes.has('dataSource')) {
      this.dataSource?.addEventListener('sl-update', this.#onUpdate);
    }
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    if (!this.pageSize) {
      this.pageSize = this.pageSizes ? this.pageSizes[0] : 10;
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-label for="select">${msg('Items per page')}:</sl-label>
      ${this.pageSizes
        ? html`
            <sl-select id="select" size="lg" value=${this.pageSize} @sl-change=${this.#onChange}>
              ${this.pageSizes.map(
                size => html`
                  <sl-select-option aria-label=${`${size} ${msg('Items per page')}`} .value=${size}>
                    ${size}
                  </sl-select-option>
                `
              )}
            </sl-select>
          `
        : nothing}
      <!-- We want this to be read every time the active page changes. -->
      <div id="live" aria-live="polite" aria-atomic="true">${msg(str`Amount of items per page: ${this.pageSize}`)}</div>
    `;
  }

  #onChange(event: Event): void {
    const newValue = Number((event.target as SelectOption).value);
    if (this.pageSize !== newValue) {
      this.pageSize = newValue;

      /** Emits amount of selected items per page */
      this.pageSizeChangeEvent.emit(newValue);

      this.dataSource?.setPageSize(newValue);
      this.dataSource?.update();
    }
  }

  #onUpdate = () => {
    const newPageSize = this.dataSource?.page?.pageSize;
    if (this.pageSize !== newPageSize) {
      this.pageSize = newPageSize;
    }
  };
}
