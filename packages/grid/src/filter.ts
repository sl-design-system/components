import type { CSSResultGroup, TemplateResult } from 'lit';
import type { GridColumn } from './column.js';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import type { EventEmitter } from '@sanomalearning/slds-core/utils/decorators';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Input } from '@sanomalearning/slds-core/input';
import { event } from '@sanomalearning/slds-core/utils/decorators';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './filter.scss.js';

export class GridFilterChangeEvent extends Event {
  constructor(public readonly column: GridColumn, public readonly value: string) {
    super('sl-filter-change', { bubbles: true, composed: true });
  }
}

export class GridFilter extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-input': Input
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The filter value. */
  #value = '';

  /** The grid column. */
  @property({ attribute: false }) column!: GridColumn;

  @event() filterChange!: EventEmitter<GridFilterChangeEvent>;

  set value(value: string) {
    this.#value = value;
  }

  @property()
  get value(): string {
    return this.#value;
  }

  override render(): TemplateResult {
    return html`
      <div class="name">
        <slot></slot>
      </div>
      <sl-input @input=${this.#onInput} placeholder="Filter"></sl-input>
    `;
  }

  #onInput({ target }: Event & { target: Input }): void {
    this.value = target.value.trim();
    this.filterChange.emit(new GridFilterChangeEvent(this.column, this.value));
  }
}
