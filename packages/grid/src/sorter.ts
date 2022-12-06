import type { TemplateResult } from 'lit';
import type { EventEmitter } from '@sanomalearning/slds-core/utils/decorators';
import { EventsController } from '@sanomalearning/slds-core/utils/controllers';
import { event } from '@sanomalearning/slds-core/utils/decorators';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import styles from './sorter.scss.js';

export type GridSorterDirection = 'asc' | 'desc' | undefined;

export type GridSorterChange = 'added' | 'removed';

export class GridSorter extends LitElement {
  /** @private */
  static override styles = styles;

  #events = new EventsController(this);

  /** The direction in which to sort the items. */
  @property({ reflect: true }) direction?: GridSorterDirection;

  @event() directionChange!: EventEmitter<GridSorterDirection>;

  @event() sorterChange!: EventEmitter<GridSorterChange>;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#events.listen(this, 'click', this.#onClick);

    this.sorterChange.emit('added');
  }

  override disconnectedCallback(): void {
    this.sorterChange.emit('removed');

    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    return html`
      <slot></slot>
      ${choose(
        this.direction,
        [
          ['asc', () => html`⬆️`],
          ['desc', () => html`⬇️`]
        ],
        () => html`↕️`
      )}
    `;
  }

  reset(): void {
    this.direction = undefined;
  }

  #onClick(): void {
    if (this.direction === 'asc') {
      this.direction = 'desc';
    } else if (this.direction === 'desc') {
      this.direction = undefined;
    } else {
      this.direction = 'asc';
    }

    this.directionChange.emit(this.direction);
  }
}
