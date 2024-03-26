import { faFilter, faXmark } from '@fortawesome/pro-regular-svg-icons';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons';
import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Checkbox, CheckboxGroup } from '@sl-design-system/checkbox';
import { Icon } from '@sl-design-system/icon';
import { Popover } from '@sl-design-system/popover';
import { type DataSourceFilterFunction, type EventEmitter, event, getNameByPath } from '@sl-design-system/shared';
import { type SlChangeEvent } from '@sl-design-system/shared/events.js';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
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

Icon.register(faFilter, faFilterSolid, faXmark);

@localized()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridFilter<T = any> extends ScopedElementsMixin(LitElement) {
  /** @private */
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

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The filter value(s). */
  #value?: string | string[];

  /**
   * Whether the grid is currently being filtered by this column.
   * @private
   */
  @property({ type: Boolean, reflect: true }) active = false;

  /** The grid column. */
  @property({ attribute: false }) column!: GridColumn<T>;

  /** The custom filter */
  @property({ attribute: false }) filter?: DataSourceFilterFunction<T>;

  /** Emits when the filter has been added or removed. */
  @event({ name: 'sl-filter-change' }) filterChangeEvent!: EventEmitter<SlFilterChangeEvent>;

  /** Emits when the value of the this filter has changed. */
  @event({ name: 'sl-filter-value-change' }) filterValueChangeEvent!: EventEmitter<SlFilterValueChangeEvent<T>>;

  /** The mode of the filter. */
  @property({ type: String }) mode?: GridFilterMode;

  /** The filter options. */
  @property({ attribute: false }) options?: GridFilterOption[];

  /** The path to the field to filter on. */
  @property() path?: string;

  set value(value: string | string[] | undefined) {
    if (this.mode !== 'text') {
      this.#value = Array.isArray(value) ? value : value?.split(',') ?? [];
    } else {
      this.#value = value;
    }

    this.active = Array.isArray(this.#value) ? this.#value.length > 0 : !!this.#value;
    this.requestUpdate('value');
  }

  @property({ type: String })
  get value(): string | string[] | undefined {
    return this.#value;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.filterChangeEvent.emit('added');
  }

  override disconnectedCallback(): void {
    this.filterChangeEvent.emit('removed');

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <sl-button @click=${this.#onClick} class="toggle" id="anchor" fill="link">
        <slot></slot>
        <sl-icon .name=${this.active ? 'fas-filter' : 'far-filter'}></sl-icon>
      </sl-button>
      <sl-popover anchor="anchor" position="bottom">
        <header>
          <h1 id="title">
            ${msg('Filter by')} <span>${this.column.header?.toString() || getNameByPath(this.column.path)}</span>
          </h1>
          <sl-button @click=${this.#onHide} aria-label=${msg('Close')} fill="link" size="sm">
            <sl-icon name="far-xmark"></sl-icon>
          </sl-button>
        </header>
        ${this.mode === 'select'
          ? html`
              <sl-checkbox-group aria-labelledby="title" autofocus>
                ${this.options?.map(
                  option => html`
                    <sl-checkbox
                      @sl-change=${(event: SlChangeEvent<boolean>) => this.#onChange(option, event.detail)}
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
                @keydown=${this.#onKeydown}
                @input=${this.#onInput}
                .placeholder=${msg('Type here to filter')}
                .value=${this.value?.toString() ?? ''}
                aria-labelledby="title"
                autofocus
              ></sl-text-field>
            `}
      </sl-popover>
    `;
  }

  #onChange(option: GridFilterOption, checked: boolean): void {
    if (!Array.isArray(this.value)) {
      return;
    }

    if (checked) {
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
