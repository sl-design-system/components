import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type DataSourceFilterFunction } from '@sl-design-system/data-source';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { SearchField } from '@sl-design-system/search-field';
import { Select } from '@sl-design-system/select';
import { type EventEmitter, type PathKeys, event, getNameByPath, getValueByPath } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html, render } from 'lit';
import { property } from 'lit/decorators.js';
import { type GridColumn } from './column.js';
import { type GridFilterMode, type GridFilterOption } from './filter-column.js';
import styles from './filter.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-filter-change': SlFilterChangeEvent;
    'sl-filter-register': SlFilterRegisterEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-grid-filter': GridFilter;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlFilterChangeEvent<T = any> = CustomEvent<{
  column: GridColumn<T>;
  value?: string | string[];
}>;

export type SlFilterRegisterEvent = CustomEvent<void>;

@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridFilter<T = any> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-option': Option,
      'sl-search-field': SearchField,
      'sl-select': Select
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The filter value(s). */
  #value?: string | string[];

  /**
   * Whether the grid is currently being filtered by this column.
   * @internal
   */
  @property({ type: Boolean, reflect: true }) active = false;

  /** The grid column. */
  @property({ attribute: false }) column!: GridColumn<T>;

  /** The custom filter */
  @property({ attribute: false }) filter?: DataSourceFilterFunction<T>;

  /** @internal Emits when the value of the filter has changed. */
  @event({ name: 'sl-filter-change' }) filterChangeEvent!: EventEmitter<SlFilterChangeEvent<T>>;

  /** @internal Emits when the filter has been connected. */
  @event({ name: 'sl-filter-register' }) filterRegisterEvent!: EventEmitter<SlFilterRegisterEvent>;

  /** The mode of the filter. */
  @property({ type: String }) mode?: GridFilterMode;

  /** The filter options. */
  @property({ attribute: false }) options?: GridFilterOption[];

  /** The path to the field to filter on. */
  @property() path?: PathKeys<T>;

  /** The label as it needs to be shown in the filter. Only use this when the label needs to be something else than the column header converted to lowercase (and stripped of any html tags in case of a ColumnHeaderRenderer). */
  @property({ type: String, attribute: 'filter-label' }) filterLabel?: string;

  get value(): string | string[] | undefined {
    return this.#value;
  }

  @property({ attribute: false })
  set value(value: string | undefined) {
    this.#value = value;
    this.active = !!this.#value;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    // Set a default filter function if none is provided
    if (this.mode === 'text' && this.column.path && !this.filter) {
      this.filter = item => {
        const itemValue = getValueByPath(item, this.column.path!);

        if (typeof itemValue !== 'string') {
          return false;
        }

        return itemValue.toLowerCase().includes((this.value?.toString() ?? '').toLowerCase());
      };
    }

    this.filterRegisterEvent.emit();
  }

  override render(): TemplateResult {
    if (this.mode === 'select') {
      return html`
        <sl-select
          @sl-change=${this.#onSelectChange}
          @sl-clear=${this.#onClear}
          .placeholder=${msg(str`Filter by ${this.#getFilterHeaderValue()}`)}
          clearable
        >
          ${this.options?.map(option => {
            return html`
              <sl-option ?selected=${this.value?.includes(option.value as string)} .value=${option.value}>
                ${option.label}
              </sl-option>
            `;
          })}
        </sl-select>
      `;
    } else {
      return html`
        <sl-search-field
          @sl-change=${this.#onSearchFieldChange}
          @sl-clear=${this.#onClear}
          .placeholder=${msg(str`Filter by ${this.#getFilterHeaderValue()}`)}
          .value=${this.value?.toString() ?? ''}
        ></sl-search-field>
      `;
    }
  }

  #onSearchFieldChange(event: Event & { target: SearchField }): void {
    this.value = event.target.value?.trim() ?? '';
    this.filterChangeEvent.emit({ column: this.column, value: this.value });
  }

  #onSelectChange(event: Event & { target: Select<T> }): void {
    if (event.target.value) {
      this.value = event.target.value.toString().trim() ?? '';
      this.filterChangeEvent.emit({ column: this.column, value: this.value });
    }
  }

  #onClear(): void {
    this.value = undefined;
    this.filterChangeEvent.emit({ column: this.column, value: this.value });
  }

  #getFilterHeaderValue(): string {
    if (this.filterLabel) {
      return this.filterLabel;
    } else if (!this.column) {
      return '';
    }

    const header = this.column.header;

    if (typeof header === 'string') {
      return header.toString().toLocaleLowerCase();
    } else if (header !== undefined) {
      const div = document.createElement('div');
      render(header, div);
      const textNodes = Array.from(div.childNodes)
        .filter(node => node.nodeType !== Node.ELEMENT_NODE && node.textContent?.trim())
        .map(node => node.textContent?.trim());
      return textNodes.join(' ').toString().toLocaleLowerCase();
    }

    return getNameByPath(this.column.path).toLocaleLowerCase();
  }
}
