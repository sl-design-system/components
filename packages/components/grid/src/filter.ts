import type { CSSResultGroup, TemplateResult } from 'lit';
import type { GridColumn } from './column.js';
import type { GridFilterMode, GridFilterOption } from './filter-column.js';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import type { EventEmitter } from '@sl-design-system/shared';
import { faFilter, faXmark } from '@fortawesome/pro-regular-svg-icons';
import { faFilter as faFilterSolid } from '@fortawesome/pro-solid-svg-icons';
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Button } from '@sl-design-system/button';
import { Checkbox, CheckboxGroup } from '@sl-design-system/checkbox';
import { Icon } from '@sl-design-system/icon';
import { TextInput } from '@sl-design-system/text-input';
import { Popover } from '@sl-design-system/popover';
import { event, getNameByPath } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './filter.scss.js';

export type GridFilterChange = 'added' | 'removed';

Icon.registerIcon(faFilter, faFilterSolid, faXmark);

export class GridFilterValueChangeEvent extends Event {
  constructor(public readonly column: GridColumn, public readonly value: string | string[] | undefined) {
    super('sl-filter-value-change', { bubbles: true, composed: true });
  }
}

@localized()
export class GridFilter extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-checkbox': Checkbox,
      'sl-checkbox-group': CheckboxGroup,
      'sl-icon': Icon,
      'sl-text-input': TextInput,
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
  @property({ attribute: false }) column!: GridColumn;

  @event() filterChange!: EventEmitter<GridFilterChange>;

  @event() filterValueChange!: EventEmitter<GridFilterValueChangeEvent>;

  @property({ type: String }) mode?: GridFilterMode;

  @property({ attribute: false }) options?: GridFilterOption[];

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

    this.filterChange.emit('added');
  }

  override disconnectedCallback(): void {
    this.filterChange.emit('removed');

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <sl-button @click=${this.#onClick} class="toggle" id="anchor" fill="link">
        <slot></slot>
        <sl-icon .name=${this.active ? 'fas-filter' : 'far-filter'}></sl-icon>
      </sl-button>
      <sl-popover anchor="anchor">
        <header>
          <h1 id="title">
            ${msg(`Filter by`)} <span>${this.column.header?.toString() || getNameByPath(this.column.path)}</span>
          </h1>
          <sl-button @click=${this.#onHide} aria-label=${msg('Close')} fill="link" size="sm">
            <sl-icon name="far-xmark"></sl-icon>
          </sl-button>
        </header>
        ${this.mode === 'select'
          ? html`
              <sl-checkbox-group aria-labelledby="title" autofocus>
                ${this.options?.map(
                  option =>
                    html`
                      <sl-checkbox
                        @sl-change=${(event: CustomEvent<boolean>) => this.#onChange(option, event.detail)}
                        ?checked=${this.value?.includes(option.value?.toString() ?? '')}
                        .value=${option.value}
                      >
                        ${option.label}
                      </sl-checkbox>
                    `
                )}
              </sl-checkbox-group>
            `
          : html`
              <sl-text-input
                @keydown=${this.#onKeydown}
                @input=${this.#onInput}
                .placeholder=${msg('Type here to filter')}
                .value=${this.value?.toString() ?? ''}
                aria-labelledby="title"
                autofocus
              ></sl-text-input>
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

    this.filterValueChange.emit(new GridFilterValueChangeEvent(this.column, this.value));
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
    this.filterValueChange.emit(new GridFilterValueChangeEvent(this.column, this.value));
  }
}
