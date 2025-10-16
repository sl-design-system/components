import { msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { FormatDate } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import {
  type EventEmitter,
  EventsController,
  LocaleMixin,
  RovingTabindexController,
  event
} from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type SlSelectEvent, SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './select-month.scss.js';
import { Month } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select-month': SelectMonth;
  }
}

export class SelectMonth extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-format-date': FormatDate,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, { keydown: this.#onSelectMonthKeydown });

  #rovingTabindexController = new RovingTabindexController<HTMLButtonElement>(this, {
    direction: 'grid',
    directionLength: 3,
    elements: (): HTMLButtonElement[] => {
      const list = this.renderRoot.querySelector('table.months');
      if (!list) return [];
      return Array.from(list.querySelectorAll<HTMLButtonElement>('button')).filter(btn => !btn.disabled);
    },
    focusInIndex: elements => {
      const index = elements.findIndex(el => {
        if (el.disabled) {
          return false;
        }
        const cell = el.closest('td[role="gridcell"]');
        return !!cell && cell.getAttribute('aria-selected') === 'true';
      });

      if (index !== -1) {
        return index;
      }

      const firstEnabled = elements.findIndex(el => !el.disabled);
      return firstEnabled === -1 ? 0 : firstEnabled;
    },
    listenerScope: (): HTMLElement => this.renderRoot.querySelector('table.months')!
  });

  /** The month/year to display. */
  @property({ converter: dateConverter }) month = new Date();

  /** The currently selected date. (In order to style current month) */
  @property({ converter: dateConverter }) selected?: Date;

  /**
   * The maximum date selectable in the month.
   * @default undefined
   */
  @property({ converter: dateConverter }) max?: Date;

  /**
   * The minimum date selectable in the month.
   * @default undefined
   */
  @property({ converter: dateConverter }) min?: Date;

  /**
   * Highlights the current month when set.
   * @default false
   */
  @property({ type: Boolean, attribute: 'show-today' }) showToday?: boolean;

  /** @internal The months to display. */
  @state() months: Month[] = [];

  /** @internal Emits when the user clicks the month/year button. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<'month' | 'year'>>;

  /** @internal Emits when the user selects a month. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<Date>>;

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.#rovingTabindexController.clearElementCache();
    this.#rovingTabindexController.focus();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('locale') || changes.has('month') || changes.has('min') || changes.has('max')) {
      const formatShort = new Intl.DateTimeFormat(this.locale, { month: 'short' }),
        formatLong = new Intl.DateTimeFormat(this.locale, { month: 'long' });

      this.months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(this.month.getFullYear(), i, 1);

        return {
          short: formatShort.format(date),
          long: formatLong.format(date),
          date,
          value: i,
          unselectable: !(
            (!this.min || date >= new Date(this.min.getFullYear(), this.min.getMonth(), 1)) &&
            (!this.max || date <= new Date(this.max.getFullYear(), this.max.getMonth(), 1))
          )
        };
      });
    }

    if (changes.has('month') || changes.has('min') || changes.has('max') || changes.has('inert')) {
      this.#rovingTabindexController.clearElementCache();
    }
  }

  override render(): TemplateResult {
    const currentMonth = this.month.getMonth(),
      currentYear = this.month.getFullYear(),
      canSelectNextYear = !this.max || (this.max && this.month.getFullYear() + 1 <= this.max.getFullYear()),
      canSelectPreviousYear = !this.min || (this.min && this.month.getFullYear() - 1 >= this.min.getFullYear());

    const monthRows = this.#getMonthRows();

    return html`
      <div part="header">
        ${canSelectPreviousYear || canSelectNextYear
          ? html`
              <sl-button @click=${this.#onToggleYearSelect} class="current-year" fill="link" variant="secondary">
                <sl-format-date .date=${this.month} locale=${ifDefined(this.locale)} year="numeric"></sl-format-date>
                <sl-icon name="caret-down-solid" size="md"></sl-icon>
              </sl-button>
            `
          : html`<span class="current-year">${currentYear}</span>`}
        <div class="arrows">
          <sl-button
            @click=${this.#onPrevious}
            @keydown=${this.#onHeaderArrowKeydown}
            aria-label=${msg(str`Previous year, ${currentYear - 1}`, { id: 'sl.calendar.previousYear' })}
            fill="ghost"
            variant="secondary"
            ?disabled=${!canSelectPreviousYear}
          >
            <sl-icon name="chevron-left"></sl-icon>
          </sl-button>
          <sl-button
            @click=${this.#onNext}
            @keydown=${this.#onHeaderArrowKeydown}
            aria-label=${msg(str`Next year, ${currentYear + 1}`, { id: 'sl.calendar.nextYear' })}
            fill="ghost"
            variant="secondary"
            ?disabled=${!canSelectNextYear}
          >
            <sl-icon name="chevron-right"></sl-icon>
          </sl-button>
        </div>
      </div>
      <table
        class="months"
        role="grid"
        @keydown=${this.#onKeydown}
        aria-label=${msg(str`Months of ${currentYear}`, { id: 'sl.calendar.monthsLabel' })}
      >
        <tbody>
          ${monthRows.map(
            (row, rowIndex) => html`
              <tr role="row" aria-rowindex=${rowIndex + 1}>
                ${row.map((month, colIndex) => {
                  const parts = this.getMonthParts(month).join(' ');
                  return html`
                    <td
                      role="gridcell"
                      aria-rowindex=${rowIndex + 1}
                      aria-colindex=${colIndex + 1}
                      aria-selected=${currentMonth === month.value ? 'true' : 'false'}
                    >
                      <button
                        .part=${parts}
                        @click=${() => this.#onClick(month.value)}
                        ?autofocus=${currentMonth === month.value}
                        ?disabled=${month.unselectable}
                      >
                        ${month.long}
                      </button>
                    </td>
                  `;
                })}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  /** Returns an array of part names for a day. */
  getMonthParts = (month: Month): string[] => {
    return [
      'month',
      month.value === new Date().getMonth() && this.month.getFullYear() === new Date().getFullYear() ? 'today' : '',
      month.unselectable ? 'unselectable' : '',
      this.selected &&
      this.selected.getMonth() === month.value &&
      this.selected.getFullYear() === month.date.getFullYear()
        ? 'selected'
        : ''
    ].filter(part => part !== '');
  };

  #onClick(month: number): void {
    this.selectEvent.emit(new Date(this.month.getFullYear(), month));
    this.selected = new Date(this.month.getFullYear(), month);
  }

  #onToggleYearSelect(): void {
    this.toggleEvent.emit('year');
  }

  #isUnselectable(year: number, month: number): boolean {
    const date = new Date(year, month, 1);
    if (this.min && date < new Date(this.min.getFullYear(), this.min.getMonth(), 1)) {
      return true;
    }
    return !!(this.max && date > new Date(this.max.getFullYear(), this.max.getMonth(), 1));
  }

  #allPreviousUnselectable(): boolean {
    const prevY = this.month.getFullYear() - 1;
    return this.months.every(m => this.#isUnselectable(prevY, m.value));
  }

  #allNextUnselectable(): boolean {
    const nextY = this.month.getFullYear() + 1;
    return this.months.every(m => this.#isUnselectable(nextY, m.value));
  }

  #getMonthsButtons(): HTMLButtonElement[] {
    return Array.from(this.renderRoot.querySelectorAll('.months button'));
  }

  #getMonthRows(): Month[][] {
    const rows: Month[][] = [];
    for (let i = 0; i < this.months.length; i += 3) {
      rows.push(this.months.slice(i, i + 3));
    }
    return rows;
  }

  #onKeydown(event: KeyboardEvent): void {
    const buttons = Array.from(this.renderRoot.querySelectorAll<HTMLButtonElement>('.months button')),
      activeElement = this.shadowRoot?.activeElement as HTMLButtonElement | null,
      index = activeElement ? buttons.indexOf(activeElement) : -1,
      cols = 3;

    if (event.key === 'ArrowLeft' && !this.#allPreviousUnselectable()) {
      if (index === 0) {
        event.preventDefault();
        event.stopPropagation();

        this.#onPrevious();

        void this.updateComplete.then(() => {
          this.#rovingTabindexController.clearElementCache();

          const newButtons = this.#getMonthsButtons();

          this.#rovingTabindexController.focusToElement(newButtons[newButtons.length - 1]);
        });
      }
    } else if (event.key === 'ArrowRight' && !this.#allNextUnselectable()) {
      if (index === buttons.length - 1) {
        event.preventDefault();
        event.stopPropagation();

        this.#onNext();

        void this.updateComplete.then(() => {
          this.#rovingTabindexController.clearElementCache();

          const first = this.#getMonthsButtons()[0];

          if (first) {
            this.#rovingTabindexController.focusToElement(first);
          }
        });
      }
    } else if (event.key === 'ArrowUp' && !this.#allPreviousUnselectable()) {
      if (index > -1 && index < cols) {
        event.preventDefault();
        event.stopPropagation();

        const col = index % cols;

        this.#onPrevious();

        void this.updateComplete.then(() => {
          this.#rovingTabindexController.clearElementCache();

          const newButtons = this.#getMonthsButtons(),
            total = newButtons.length;

          if (!total) {
            return;
          }

          // Start index of last (possibly partial) row
          const lastRowStart = total - (total % cols === 0 ? cols : total % cols),
            targetIndex = Math.min(lastRowStart + col, total - 1),
            target = newButtons[targetIndex];

          if (target) {
            this.#rovingTabindexController.focusToElement(target);
          }
        });
      }
    } else if (event.key === 'ArrowDown' && !this.#allNextUnselectable()) {
      if (index > -1) {
        const total = buttons.length,
          lastRowStart = total - (total % cols === 0 ? cols : total % cols);

        // If on any button in the last row, move to next range keeping column
        if (index >= lastRowStart) {
          event.preventDefault();
          event.stopPropagation();

          const col = index % cols;

          this.#onNext();

          void this.updateComplete.then(() => {
            this.#rovingTabindexController.clearElementCache();

            const newButtons = this.#getMonthsButtons();

            if (!newButtons.length) {
              return;
            }

            let target = newButtons[col];
            if (!target) {
              // Last button if fewer buttons than expected
              target = newButtons[newButtons.length - 1];
            }
            if (target) {
              this.#rovingTabindexController.focusToElement(target);
            }
          });
        }
      }
    }
  }

  #onHeaderArrowKeydown(event: KeyboardEvent): void {
    // Prevent arrow keys on header buttons from being handled by the roving controller.
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.stopPropagation();
    }
  }

  #onNext(): void {
    this.month = new Date(this.month.getFullYear() + 1, this.month.getMonth(), this.month.getDate());
  }

  #onPrevious(): void {
    this.month = new Date(this.month.getFullYear() - 1, this.month.getMonth(), this.month.getDate());
  }

  #onSelectMonthKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();

      this.selectEvent.emit(this.month);
    }
  }
}
