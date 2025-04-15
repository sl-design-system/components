import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { type DataSourceSortDirection, type DataSourceSortFunction } from '@sl-design-system/data-source';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, event } from '@sl-design-system/shared';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { type GridColumn } from './column.js';
import { type Grid } from './grid.js';
import styles from './sorter.scss.js';

declare global {
  interface GlobalEventHandlersEventMap {
    'sl-sorter-change': SlSorterChangeEvent;
    'sl-sort-direction-change': SlSortDirectionChangeEvent;
  }

  interface HTMLElementTagNameMap {
    'sl-grid-sorter': GridSorter;
  }
}

export type SlSorterChangeEvent = CustomEvent<'added' | 'removed'>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlSortDirectionChangeEvent<T = any> = CustomEvent<{
  grid: Grid;
  column: GridColumn<T>;
  direction?: DataSourceSortDirection;
}>;

/**
 * Component that is used as the column header for a sortable column.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class GridSorter<T = any> extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The grid column.  */
  @property({ attribute: false }) column!: GridColumn<T>;

  /** The direction in which to sort the items. */
  @property({ reflect: true }) direction?: DataSourceSortDirection;

  /** The path to the field to sort on. */
  @property() path?: string;

  /** An optional custom sort function. */
  @property({ attribute: false }) sorter?: DataSourceSortFunction<T>;

  /** @internal Emits when the sorter has been added or removed. */
  @event({ name: 'sl-sorter-change' }) sorterChangeEvent!: EventEmitter<SlSorterChangeEvent>;

  /** @internal Emits when the direction has changed. */
  @event({ name: 'sl-sort-direction-change' }) sortDirectionChangeEvent!: EventEmitter<SlSortDirectionChangeEvent<T>>;

  override connectedCallback(): void {
    super.connectedCallback();

    this.sorterChangeEvent.emit('added');
  }

  override disconnectedCallback(): void {
    // FIXME: This event is not emitted when the component is removed from the DOM.
    this.sorterChangeEvent.emit('removed');

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <slot></slot>
      <sl-button
        @click=${this.#onClick}
        .fill=${this.direction ? 'solid' : 'ghost'}
        size="sm"
        .variant=${this.direction ? 'primary' : 'neutral'}
      >
        ${choose(
          this.direction,
          [
            ['asc', () => html`<sl-icon name="sort-up"></sl-icon>`],
            ['desc', () => html`<sl-icon name="sort-down"></sl-icon>`]
          ],
          () => html`<sl-icon name="sort"></sl-icon>`
        )}
      </sl-button>
    `;
  }

  reset(): void {
    this.direction = undefined;
  }

  #onClick(): void {
    this.#toggleDirection();
    this.sortDirectionChangeEvent.emit({ grid: this.column.grid!, column: this.column, direction: this.direction });
  }

  #toggleDirection(): void {
    if (this.direction === 'asc') {
      this.direction = 'desc';
    } else if (this.direction === 'desc') {
      this.direction = undefined;
    } else {
      this.direction = 'asc';
    }
  }
}
