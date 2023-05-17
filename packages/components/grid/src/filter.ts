import type { CSSResultGroup, TemplateResult } from 'lit';
import type { GridColumn } from './column.js';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import type { EventEmitter } from '@sl-design-system/shared';
import { faFilter } from '@fortawesome/pro-regular-svg-icons';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Checkbox, CheckboxGroup } from '@sl-design-system/checkbox';
import { Icon } from '@sl-design-system/icon';
import { Popover } from '@sl-design-system/popover';
import { event } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './filter.scss.js';

export type GridFilterChange = 'added' | 'removed';

Icon.registerIcon(faFilter);

export class GridFilterValueChangeEvent extends Event {
  constructor(public readonly column: GridColumn, public readonly value: string) {
    super('sl-filter-value-change', { bubbles: true, composed: true });
  }
}

export class GridFilter extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-checkbox': Checkbox,
      'sl-checkbox-group': CheckboxGroup,
      'sl-icon': Icon,
      'sl-popover': Popover
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The filter value. */
  #value = '';

  /** The grid column. */
  @property({ attribute: false }) column!: GridColumn;

  @event() filterChange!: EventEmitter<GridFilterChange>;

  @event() filterValueChange!: EventEmitter<GridFilterValueChangeEvent>;

  set value(value: string) {
    this.#value = value;
  }

  @property()
  get value(): string {
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
      <div id="anchor" class="wrapper">
        <slot></slot>
        <sl-icon name="far-filter"></sl-icon>
      </div>
      <sl-popover anchor="anchor">
        <sl-checkbox-group>
          <sl-checkbox>VMBO-K</sl-checkbox>
          <sl-checkbox>VMBO-TL</sl-checkbox>
          <sl-checkbox>HAVO</sl-checkbox>
          <sl-checkbox>VWO</sl-checkbox>
        </sl-checkbox-group>
      </sl-popover>
    `;
  }
}
