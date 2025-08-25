import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE, type ListDataSource } from '@sl-design-system/data-source';
import { Label } from '@sl-design-system/form';
import { Option } from '@sl-design-system/listbox';
import { Select } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './page-size.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-page-size-change': SlChangeEvent<number>;
  }

  interface HTMLElementTagNameMap {
    'sl-paginator-page-size': PaginatorPageSize;
  }
}

/**
 * A component that can be used with the paginator.
 * The component adds a possibility to select/change the amount of items that would be visible per page.
 */
@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class PaginatorPageSize<T = any> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-label': Label,
      'sl-option': Option,
      'sl-select': Select
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The data source that the paginator controls. */
  #dataSource?: ListDataSource<T>;

  /** The current page size. */
  #pageSize?: number;

  get dataSource(): ListDataSource<T> | undefined {
    return this.#dataSource;
  }

  /**
   * By setting a dataSource, the paginator will listen for changes on the data source
   * and control the data source when the user selects a new page in the component. This
   * can be very useful when the paginator is used in combination with a data source fed
   * component, such as `<sl-grid>`.
   */
  @property({ attribute: false })
  set dataSource(dataSource: ListDataSource<T> | undefined) {
    if (this.#dataSource) {
      this.#dataSource.removeEventListener('sl-update', this.#onUpdate);
    }

    this.#dataSource = dataSource;
    this.#dataSource?.addEventListener('sl-update', this.#onUpdate);

    this.#onUpdate();
  }

  /**
   * The label to display for the 'items' per page selector.
   * If not set, defaults to "Items".
   * You can use this to set a custom label, such as "Students" or "Books" or something else.
   * Please remember to provide a translation for the label in your application.
   */
  @property({ attribute: false }) itemLabel?: string;

  get pageSize(): number {
    return this.#dataSource?.pageSize ?? this.#pageSize ?? this.pageSizes?.at(0) ?? LIST_DATA_SOURCE_DEFAULT_PAGE_SIZE;
  }

  /** Items per page. */
  @property({ type: Number, attribute: 'page-size' })
  set pageSize(pageSize: number) {
    if (this.dataSource) {
      this.dataSource?.setPageSize(pageSize);
    } else {
      this.#pageSize = pageSize;
    }
  }

  /** @internal Emits when the page size has been selected/changed. */
  @event({ name: 'sl-page-size-change' }) pageSizeChangeEvent!: EventEmitter<SlChangeEvent<number>>;

  /** Available page sizes. */
  @property({ type: Array, attribute: 'page-sizes' }) pageSizes?: number[];

  override connectedCallback(): void {
    super.connectedCallback();

    this.dataSource?.addEventListener('sl-update', this.#onUpdate);
  }

  override disconnectedCallback(): void {
    this.dataSource?.removeEventListener('sl-update', this.#onUpdate);

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <sl-label for="sizes"
        >${msg(str`${this.itemLabel ? this.itemLabel : 'Items'} per page:`, { id: 'sl.paginator.itemsPerPage' })}
      </sl-label>
      <sl-select @sl-change=${this.#onChange} ?disabled=${!this.pageSizes} id="sizes" value=${ifDefined(this.pageSize)}>
        ${this.pageSizes?.map(
          size => html`
            <sl-option
              aria-label=${`${size} ${msg(str`${this.itemLabel ? this.itemLabel : 'items'} per page`, { id: 'sl.paginator.itemsPerPageOption' })}`}
              .value=${size}
              >${size}</sl-option
            >
          `
        )}
      </sl-select>
    `;
  }

  #onChange({ detail: pageSize }: SlChangeEvent<number>): void {
    this.pageSize = pageSize;
    this.pageSizeChangeEvent.emit(pageSize);

    this.dataSource?.setPageSize(pageSize);
    this.dataSource?.update();
  }

  #onUpdate = () => {
    this.pageSize = this.dataSource!.pageSize;
  };
}
