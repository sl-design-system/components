import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { DATA_SOURCE_DEFAULT_PAGE_SIZE, type ListDataSource } from '@sl-design-system/data-source';
import { Label } from '@sl-design-system/form';
import { Option } from '@sl-design-system/listbox';
import { Select } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
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
   * Items per page.
   * @default 10
   */
  @property({ type: Number, attribute: 'page-size' }) pageSize = DATA_SOURCE_DEFAULT_PAGE_SIZE;

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

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('pageSizes')) {
      this.pageSize = this.pageSizes?.at(0) ?? DATA_SOURCE_DEFAULT_PAGE_SIZE;
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-label for="sizes">${msg('Items per page:')}</sl-label>
      <sl-select
        @sl-change=${this.#onChange}
        ?disabled=${!this.pageSizes}
        id="sizes"
        size="lg"
        value=${ifDefined(this.pageSize)}
      >
        ${this.pageSizes?.map(
          size => html`<sl-option aria-label=${`${size} ${msg('items per page')}`} .value=${size}>${size}</sl-option>`
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
