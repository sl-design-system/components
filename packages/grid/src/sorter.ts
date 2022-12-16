import type { PropertyValues, TemplateResult } from 'lit';
import type { DataSourceSortDirection } from '@sanomalearning/slds-core/utils/data-source';
import type { EventEmitter } from '@sanomalearning/slds-core/utils/decorators';
import { EventsController } from '@sanomalearning/slds-core/utils/controllers';
import { event } from '@sanomalearning/slds-core/utils/decorators';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import styles from './sorter.scss.js';

export type GridSorterChange = 'added' | 'removed';

export class GridSorter extends LitElement {
  /** @private */
  static override styles = styles;

  #events = new EventsController(this);

  /** The direction in which to sort the items. */
  @property({ reflect: true }) direction?: DataSourceSortDirection;

  @event() directionChange!: EventEmitter<DataSourceSortDirection | undefined>;

  @property() path?: string;

  @event() sorterChange!: EventEmitter<GridSorterChange>;

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
            ['asc', () => html`⬆️`],
            ['desc', () => html`⬇️`]
          ],
          () => html`↕️`
        )}
      </span>
    `;
  }

  reset(): void {
    this.direction = undefined;
  }

  #onClick(): void {
    this.#toggleDirection();
    this.directionChange.emit(this.direction);
  }

  #onKeydown(event: KeyboardEvent): void {
    if ([' ', 'Enter'].includes(event.key)) {
      event.preventDefault();

      this.#toggleDirection();
      this.directionChange.emit(this.direction);
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
