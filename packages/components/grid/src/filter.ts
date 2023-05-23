import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { GridColumn } from './column.js';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import type { EventEmitter } from '@sl-design-system/shared';
import { faFilter, faFilterList } from '@fortawesome/pro-regular-svg-icons';
import { localized, msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Checkbox, CheckboxGroup } from '@sl-design-system/checkbox';
import { Icon } from '@sl-design-system/icon';
import { TextInput } from '@sl-design-system/text-input';
import { Popover } from '@sl-design-system/popover';
import { event } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './filter.scss.js';

export type GridFilterChange = 'added' | 'removed';

export type GridFilterMode = 'select' | 'text';

export interface GridFilterOption {
  label: string;
  selected?: boolean;
  value?: unknown;
}

Icon.registerIcon(faFilter, faFilterList);

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

  /** Whether the grid is currently being filtered by this column. */
  @property({ type: Boolean, reflect: true }) active = false;

  /** The grid column. */
  @property({ attribute: false }) column!: GridColumn;

  @event() filterChange!: EventEmitter<GridFilterChange>;

  @event() filterValueChange!: EventEmitter<GridFilterValueChangeEvent>;

  @property({ type: String }) mode?: GridFilterMode;

  @property({ attribute: false }) options?: GridFilterOption[];

  set value(value: string | string[] | undefined) {
    this.#value = value;
  }

  @property()
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

  override willUpdate(changes: PropertyValues<this>): void {
    if (changes.has('value')) {
      this.active = Array.isArray(this.value) ? this.value.length > 0 : !!this.value;
    }
  }

  override render(): TemplateResult {
    return html`
      <div id="anchor" class="wrapper">
        <slot></slot>
        <sl-icon .name=${this.active ? 'far-filter-list' : 'far-filter'}></sl-icon>
      </div>
      <sl-popover anchor="anchor">
        ${this.mode === 'select'
          ? html`
              <sl-checkbox-group>
                ${this.options?.map(
                  option =>
                    html`
                      <sl-checkbox
                        @sl-change=${(event: CustomEvent<boolean>) => this.#onChange(option, event.detail)}
                        ?checked=${option.selected}
                        .value=${option.value}
                      >
                        ${option.label}
                      </sl-checkbox>
                    `
                )}
              </sl-checkbox-group>
            `
          : html`<sl-text-input @input=${this.#onInput} .placeholder=${msg('Type here to filter')}></sl-text-input>`}
      </sl-popover>
    `;
  }

  #onChange(option: GridFilterOption, checked: boolean): void {
    option.selected = checked;

    this.value = this.options?.filter(option => option.selected).map(option => option.value?.toString() ?? '');
    this.filterValueChange.emit(new GridFilterValueChangeEvent(this.column, this.value));
    this.requestUpdate('value');
  }

  #onInput(event: Event & { target: HTMLInputElement }): void {
    this.value = event.target.value.trim();
    this.filterValueChange.emit(new GridFilterValueChangeEvent(this.column, this.value));
  }
}
