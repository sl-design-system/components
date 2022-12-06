import type { TemplateResult } from 'lit';
import { EventsController } from '@sanomalearning/slds-core/utils/controllers';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import styles from './sorter.scss.js';

export type GridSorterDirection = 'asc' | 'desc' | undefined;

export class GridSorter extends LitElement {
  /** @private */
  static override styles = styles;

  #events = new EventsController(this);

  /** The direction in which to sort the items. */
  @property({ reflect: true }) direction?: GridSorterDirection;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#events.listen(this, 'click', this.#onClick);
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

  #onClick(): void {
    if (this.direction === 'asc') {
      this.direction = 'desc';
    } else if (this.direction === 'desc') {
      this.direction = undefined;
    } else {
      this.direction = 'asc';
    }
  }
}
