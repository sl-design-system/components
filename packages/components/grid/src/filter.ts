import { faFilter } from '@fortawesome/pro-regular-svg-icons';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons';
import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Checkbox, CheckboxGroup } from '@sl-design-system/checkbox';
import { type DataSourceFilterFunction } from '@sl-design-system/data-source';
import { Icon } from '@sl-design-system/icon';
import { Popover } from '@sl-design-system/popover';
import { type EventEmitter, type PathKeys, event, getNameByPath, getValueByPath } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { type GridColumn } from './column.js';
import { type GridFilterMode, type GridFilterOption } from './filter-column.js';
import styles from './filter.scss.js';
import { type Grid } from './grid.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-filter-change': SlFilterChangeEvent;
    'sl-filter-value-change': SlFilterValueChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-grid-filter': GridFilter;
  }
}

export type SlFilterChangeEvent = CustomEvent<'added' | 'removed'>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlFilterValueChangeEvent<T = any> = CustomEvent<{
  grid: Grid;
  column: GridColumn<T>;
  value?: string | string[];
}>;

Icon.register(faFilter, faFilterSolid);

@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridFilter<T = any> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-checkbox': Checkbox,
      'sl-checkbox-group': CheckboxGroup,
      'sl-icon': Icon,
      'sl-text-field': TextField,
      'sl-popover': Popover
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

  /** @internal Emits when the filter has been added or removed. */
  @event({ name: 'sl-filter-change' }) filterChangeEvent!: EventEmitter<SlFilterChangeEvent>;

  /** @internal Emits when the value of the filter has changed. */
  @event({ name: 'sl-filter-value-change' }) filterValueChangeEvent!: EventEmitter<SlFilterValueChangeEvent<T>>;

  /** The mode of the filter. */
  @property({ type: String }) mode?: GridFilterMode;

  /** The filter options. */
  @property({ attribute: false }) options?: GridFilterOption[];

  /** The path to the field to filter on. */
  @property() path?: PathKeys<T>;

  /** The label as it needs to be shown in the filter popover. Only use this when the label needs to be something else than the column header converted to lowercase (and stripped of any html tags in case of a ColumnHeaderRenderer). */
  @property({ type: String, attribute: 'filter-label' }) filterLabel?: string;

  set value(value: string | string[] | undefined) {
    if (this.mode !== 'text') {
      this.#value = Array.isArray(value) ? value : (value?.split(',') ?? []);
    } else {
      this.#value = value;
    }

    this.active = Array.isArray(this.#value) ? this.#value.length > 0 : !!this.#value;
    this.requestUpdate('value');
  }

  @property({ attribute: false })
  get value(): string | string[] | undefined {
    return this.#value;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    if (this.mode === 'text' && !this.filter) {
      this.filter = item => {
        const itemValue = getValueByPath(item, this.column.path!);

        if (typeof itemValue !== 'string') {
          return false;
        }

        return itemValue.toLowerCase().includes((this.value?.toString() ?? '').toLowerCase());
      };
    }

    this.filterChangeEvent.emit('added');
  }

  override disconnectedCallback(): void {
    // FIXME: This event is not emitted when the component is removed from the DOM.
    this.filterChangeEvent.emit('removed');

    super.disconnectedCallback();
  }

  getFilterHeaderValue(): string {
    if (this.filterLabel) {
      return this.filterLabel;
    }

    const header = this.column.header;
    if (typeof header === 'string') {
      return header?.toString().toLocaleLowerCase();
    }
    if (typeof header !== 'string' && header !== undefined) {
      const div = document.createElement('div');
      div.innerHTML = (header as unknown as TemplateResult).strings[0];
      const textNodes = Array.from(div.childNodes)
        .filter(node => node.nodeType !== Node.ELEMENT_NODE && node.textContent?.trim())
        .map(node => node.textContent?.trim());
      return textNodes.join(' ').toString().toLocaleLowerCase();
    }

    return getNameByPath(this.column.path).toLocaleLowerCase();
  }

  override render(): TemplateResult {
    return html`
      <sl-button @click=${this.#onClick} class="toggle" id="anchor" fill="link">
        <slot></slot>
        <sl-icon .name=${this.active ? 'fas-filter' : 'far-filter'}></sl-icon>
      </sl-button>
      <sl-popover anchor="anchor" position="bottom">
        <header>
          <h1 id="title">${msg(str`Filter by ${this.getFilterHeaderValue()}`)}</h1>
          <sl-button @click=${this.#onHide} aria-label=${msg('Close')} fill="link" size="sm">
            <sl-icon name="xmark"></sl-icon>
          </sl-button>
        </header>
        ${this.mode === 'select'
          ? html`
              <sl-checkbox-group aria-labelledby="title" autofocus>
                ${repeat(
                  this.options ?? [],
                  option => option.value,
                  option => html`
                    <sl-checkbox
                      @sl-change=${(event: SlChangeEvent & { target: Checkbox }) => this.#onChange(event, option)}
                      .checked=${this.value?.includes(option.value?.toString() ?? '')}
                      .value=${option.value}
                    >
                      ${option.label}
                    </sl-checkbox>
                  `
                )}
              </sl-checkbox-group>
            `
          : html`
              <sl-text-field
                @input=${this.#onInput}
                @keydown=${this.#onKeydown}
                .placeholder=${msg('Type here to filter')}
                .value=${this.value?.toString() ?? ''}
                aria-labelledby="title"
                autofocus
              ></sl-text-field>
            `}
      </sl-popover>
    `;
  }

  #onChange(event: SlChangeEvent & { target: Checkbox }, option: GridFilterOption): void {
    if (!Array.isArray(this.value)) {
      return;
    }

    if (event.target.checked) {
      this.value = [...this.value, option.value?.toString() ?? ''];
    } else {
      this.value = this.value.filter(value => value !== option.value?.toString());
    }

    this.filterValueChangeEvent.emit({ grid: this.column.grid!, column: this.column, value: this.value });
  }

  #onClick(): void {
    this.renderRoot.querySelector<Popover>('sl-popover')?.togglePopover();
  }

  #onHide(): void {
    this.renderRoot.querySelector<Popover>('sl-popover')?.hidePopover();
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.#onClick();
    }
  }

  #onInput(event: Event & { target: HTMLInputElement }): void {
    this.value = event.target.value.trim();
    this.filterValueChangeEvent.emit({ grid: this.column.grid!, column: this.column, value: this.value });
  }
}
