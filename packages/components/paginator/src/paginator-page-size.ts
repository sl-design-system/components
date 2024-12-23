import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type DataSource } from '@sl-design-system/data-source';
import { Label } from '@sl-design-system/form';
import { Select, SelectOption } from '@sl-design-system/select';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './paginator-page-size.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-page-size-change': SlChangeEvent;
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
      'sl-select': Select,
      'sl-select-option': SelectOption
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The data source that the paginator controls. */
  #dataSource?: DataSource<T>;

  get dataSource(): DataSource<T> | undefined {
    return this.#dataSource;
  }

  /**
   * By setting a dataSource, the paginator will listen for changes on the data source
   * and control the data source when the user selects a new page in the component. This
   * can be very useful when the paginator is used in combination with a data source fed
   * component, such as `<sl-grid>`.
   */
  @property({ attribute: false })
  set dataSource(dataSource: DataSource<T> | undefined) {
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
  @property({ type: Number, attribute: 'page-size' }) pageSize?: number;

  /** @internal Emits when the page size has been selected/changed. */
  @event({ name: 'sl-page-size-change' }) pageSizeChangeEvent!: EventEmitter<SlChangeEvent<number>>;

  /** Available page sizes. */
  @property({ type: Array, attribute: 'page-sizes' }) pageSizes?: number[];

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
            <sl-select id="select" size="lg" value=${ifDefined(this.pageSize)} @sl-change=${this.#onChange}>
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
