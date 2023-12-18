import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { GridColumn } from './column.js';
import type { ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import type { DataSourceSortDirection, DataSourceSortFunction, EventEmitter } from '@sl-design-system/shared';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Icon } from '@sl-design-system/icon';
import { EventsController, event } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { GridSortDirectionChangeEvent } from './events.js';
import styles from './sorter.scss.js';

export type GridSorterChange = 'added' | 'removed';

export class GridSorter<T> extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  #events = new EventsController(this);

  /** The grid column.  */
  @property({ attribute: false }) column!: GridColumn<T>;

  /** The direction in which to sort the items. */
  @property({ reflect: true }) direction?: DataSourceSortDirection;

  /** The path to the field to sort on. */
  @property() path?: string;

  /** An optional custom sort function. */
  @property({ attribute: false }) sorter?: DataSourceSortFunction<T>;

  /** Emits when the sorter has been added or removed. */
  @event() sorterChange!: EventEmitter<GridSorterChange>;

  /** Emits when the direction has changed. */
  @event() sortDirectionChange!: EventEmitter<GridSortDirectionChangeEvent<T>>;

  override connectedCallback(): void {
    super.connectedCallback();

    this.tabIndex = 0;

    this.#events.listen(this, 'click', this.#onClick);
    this.#events.listen(this, 'keydown', this.#onKeydown);

    this.sorterChange.emit('added');
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('direction')) {
      const header = this.closest('th');

      if (!this.direction) {
        header?.removeAttribute('aria-sort');
      } else {
        header?.setAttribute('aria-sort', this.direction === 'asc' ? 'ascending' : 'descending');
      }
    }
  }

  override disconnectedCallback(): void {
    this.sorterChange.emit('removed');

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <slot></slot>
      <span aria-hidden="true" class="direction">
        ${choose(
          this.direction,
          [
            ['asc', () => html`<sl-icon name="sort-up"></sl-icon>`],
            ['desc', () => html`<sl-icon name="sort-down"></sl-icon>`]
          ],
          () => html`<sl-icon name="sort"></sl-icon>`
        )}
      </span>
    `;
  }

  reset(): void {
    this.direction = undefined;
  }

  #onClick(): void {
    this.#toggleDirection();
    this.sortDirectionChange.emit(new GridSortDirectionChangeEvent(this.column, this.direction));
  }

  #onKeydown(event: KeyboardEvent): void {
    if ([' ', 'Enter'].includes(event.key)) {
      event.preventDefault();

      this.#toggleDirection();
      this.sortDirectionChange.emit(new GridSortDirectionChangeEvent(this.column, this.direction));
    }
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
