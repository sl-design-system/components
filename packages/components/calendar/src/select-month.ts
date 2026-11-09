import { localized, msg, str } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { Button } from '@sl-design-system/button';
import { FormatDate, format } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, NewFocusGroupController, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type SlSelectEvent, SlToggleEvent } from '@sl-design-system/shared/events.js';
import { LocaleMixin } from '@sl-design-system/shared/mixins/locale.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html
} from 'lit';
import { property, query, queryAll, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './select-month.css' with { type: 'css' };
import { Month } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select-month': SelectMonth;
  }
}

@localized()
export class SelectMonth extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-format-date': FormatDate,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Timeout id, to be used with `clearTimeout`. */
  #announceTimeoutId?: ReturnType<typeof setTimeout>;

  /** The focused month to restore after changing the responsive layout. */
  #monthToFocus?: Date;

  /**
   * Number of columns in the months grid. Used by keyboard navigation and the focus group
   * controller to compute row/column movement and focus targets.
   */
  #cols = 3;

  /** Focus management. */
  #focusGroupController = new NewFocusGroupController<HTMLButtonElement>(this, {
    autofocus: true,
    direction: 'grid',
    directionLength: this.#cols,
    elements: (): HTMLButtonElement[] => Array.from(this.buttons),
    isFocusableElement: (el: HTMLButtonElement) => !el.disabled,
    scope: (): HTMLElement => this.grids,
    wrap: false
  });

  /** The buttons representing each month. */
  @queryAll('button') buttons!: NodeListOf<HTMLButtonElement>;

  /** The container of both month grids, used as a shared focus scope. */
  @query('.month-grids') grids!: HTMLElement;

  /**
   * The maximum date selectable in the month.
   *
   * @default undefined
   */
  @property({ converter: dateConverter }) max?: Date;

  /**
   * The minimum date selectable in the month.
   *
   * @default undefined
   */
  @property({ converter: dateConverter }) min?: Date;

  /** The month/year to display. */
  @property({ converter: dateConverter }) month = new Date();

  /** The number of month panels. Two panels show consecutive years. */
  @property({ type: Number, attribute: 'number-of-months', reflect: true }) numberOfMonths: 1 | 2 =
    1;

  /** @internal The months to display. */
  @state() months: Month[] = [];

  /** The currently selected date. (In order to style current month) */
  @property({ converter: dateConverter }) selected?: Date;

  /** @internal Emits when the user selects a month. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<Date>>;

  /**
   * Highlights the current month when set.
   *
   * @default false
   */
  @property({ type: Boolean, attribute: 'show-current' }) showCurrent?: boolean;

  /** @internal Emits when the user clicks the month/year button. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<'month' | 'year'>>;

  override disconnectedCallback(): void {
    if (this.#announceTimeoutId) {
      clearTimeout(this.#announceTimeoutId);
      this.#announceTimeoutId = undefined;
    }

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('numberOfMonths')) {
      if (!changes.has('month')) {
        const index = Array.from(this.buttons).findIndex(
          button => button === this.shadowRoot?.activeElement
        );
        this.#monthToFocus = this.months[index]?.date;

        if (this.numberOfMonths === 1 && this.#monthToFocus) {
          this.month = new Date(this.#monthToFocus);
        }
      }
    }

    if (
      changes.has('locale') ||
      changes.has('month') ||
      changes.has('min') ||
      changes.has('max') ||
      changes.has('numberOfMonths')
    ) {
      const formatShort = new Intl.DateTimeFormat(this.locale, { month: 'short' }),
        formatLong = new Intl.DateTimeFormat(this.locale, { month: 'long' });

      this.months = Array.from({ length: 12 * this.numberOfMonths }, (_, i) => {
        const date = new Date(this.month.getFullYear(), i, 1);

        return {
          short: formatShort.format(date),
          long: formatLong.format(date),
          date,
          value: date.getMonth(),
          disabled: !(
            (!this.min || date >= new Date(this.min.getFullYear(), this.min.getMonth(), 1)) &&
            (!this.max || date <= new Date(this.max.getFullYear(), this.max.getMonth(), 1))
          )
        };
      });
    }

    if (
      changes.has('min') ||
      changes.has('max') ||
      changes.has('month') ||
      changes.has('numberOfMonths')
    ) {
      this.#focusGroupController.clearElementCache();
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (this.#monthToFocus) {
      const date = this.#monthToFocus,
        index = this.months.findIndex(month => month.date.getTime() === date.getTime()),
        button = this.buttons[index];

      this.#monthToFocus = undefined;
      if (button && !button.disabled) {
        this.#focusGroupController.focusToElement(button);
      }
    }
  }

  override render(): TemplateResult {
    const currentYear = this.month.getFullYear();

    return html`
      <header>
        ${
          this.#canSelectYear(-1) || this.#canSelectYear(1)
            ? html`
                <sl-button
                  @click=${this.#onToggleYearSelect}
                  aria-label=${msg(
                    str`${format(this.month, this.locale, { year: 'numeric' })}, change year`,
                    {
                      id: 'sl.calendar.changeYear'
                    }
                  )}
                  class="current-year"
                  fill="link"
                  variant="secondary">
                  <sl-format-date
                    .date=${this.month}
                    locale=${ifDefined(this.locale)}
                    year="numeric"></sl-format-date>
                  <sl-icon name="caret-down-solid"></sl-icon>
                </sl-button>
              `
            : html`<span class="current-year">${currentYear}</span>`
        }
        ${
          this.numberOfMonths === 2
            ? html`
                <span class="following-year-label">
                  <sl-format-date
                    .date=${new Date(currentYear + 1, 0, 1)}
                    locale=${ifDefined(this.locale)}
                    year="numeric"></sl-format-date>
                </span>
              `
            : undefined
        }
        <div class="arrows">
          <sl-button
            @click=${this.#onPrevious}
            ?disabled=${!this.#canSelectYear(-1)}
            aria-label=${msg(str`Previous year, ${currentYear - this.numberOfMonths}`, {
              id: 'sl.calendar.previousYear'
            })}
            fill="ghost"
            variant="secondary">
            <sl-icon name="chevron-left"></sl-icon>
          </sl-button>
          <sl-button
            @click=${this.#onNext}
            ?disabled=${!this.#canSelectYear(1)}
            aria-label=${msg(str`Next year, ${currentYear + this.numberOfMonths}`, { id: 'sl.calendar.nextYear' })}
            fill="ghost"
            variant="secondary">
            <sl-icon name="chevron-right"></sl-icon>
          </sl-button>
        </div>
      </header>

      <div class="month-grids">
        ${Array.from({ length: this.numberOfMonths }, (_, yearIndex) => this.#renderYear(yearIndex))}
      </div>
    `;
  }

  #renderYear(yearIndex: number): TemplateResult {
    const currentYear = this.month.getFullYear() + yearIndex,
      rows = Array.from({ length: 4 }, (_, row) =>
        this.months.slice(yearIndex * 12 + row * 3, yearIndex * 12 + row * 3 + 3)
      );

    return html`
      <table
        aria-label=${msg(str`Months of ${currentYear}`, { id: 'sl.calendar.monthsLabel' })}
        role="grid">
        <tbody>
          ${rows.map(
            (row, rowIndex) => html`
              <tr aria-rowindex=${rowIndex + 1} role="row">
                ${row.map((month, colIndex) => this.renderMonth(month, rowIndex, colIndex))}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  renderMonth(month: Month, rowIndex: number, colIndex: number): TemplateResult {
    const current =
        month.value === new Date().getMonth() &&
        month.date.getFullYear() === new Date().getFullYear(),
      selected = !!(
        this.selected &&
        this.selected.getMonth() === month.value &&
        this.selected.getFullYear() === month.date.getFullYear()
      );

    return html`
      <td aria-rowindex=${rowIndex + 1} aria-colindex=${colIndex + 1} role="gridcell">
        <button
          @click=${() => this.#onClick(month)}
          @keydown=${this.#onKeydown}
          ?disabled=${month.disabled}
          aria-label=${format(month.date, this.locale, { month: 'long', year: 'numeric' })}
          aria-current=${ifDefined(current ? 'date' : undefined)}
          aria-pressed=${selected.toString()}
          class=${classMap({ current, selected })}>
          <span>${month.long}</span>
        </button>
      </td>
    `;
  }

  #onClick(month: Month): void {
    const date = new Date(month.date);

    this.selectEvent.emit(date);
    this.selected = new Date(date);
  }

  /**
   * For arrow keys, we need to detect if we're at a visual boundary (first/last button position)
   * and trying to navigate beyond it AND navigation is not blocked by min/max constraints. If we
   * can load a new range, do so. Otherwise, let the focus group controller handle it.
   */
  async #onKeydown(event: KeyboardEvent & { target: HTMLButtonElement }): Promise<void> {
    const buttons = Array.from(this.buttons),
      currentIndex = buttons.indexOf(event.target);

    if (currentIndex === -1) {
      return;
    }

    const canGoEarlier = !this.#allYearDisabled(-1),
      canGoLater = !this.#allYearDisabled(1);

    let shouldLoadNewRange = false;

    // Check if we're at a visual boundary position, trying to navigate beyond it,
    // and not blocked by min/max constraints
    if (event.key === 'ArrowLeft' && currentIndex === 0 && canGoEarlier) {
      shouldLoadNewRange = true;
      event.preventDefault();
      this.#onPrevious();
    } else if (event.key === 'ArrowRight' && currentIndex === buttons.length - 1 && canGoLater) {
      shouldLoadNewRange = true;
      event.preventDefault();
      this.#onNext();
    } else if (event.key === 'ArrowUp' && currentIndex < this.#cols && canGoEarlier) {
      shouldLoadNewRange = true;
      event.preventDefault();
      this.#onPrevious();
    } else if (
      event.key === 'ArrowDown' &&
      currentIndex >= buttons.length - this.#cols &&
      canGoLater
    ) {
      shouldLoadNewRange = true;
      event.preventDefault();
      this.#onNext();
    }

    if (shouldLoadNewRange) {
      await this.updateComplete;

      this.#focusAfterRangeChange(event.key, currentIndex);
    }

    // Otherwise, let the event bubble to the focus group controller
  }

  #onNext(): void {
    this.month = new Date(
      this.month.getFullYear() + this.numberOfMonths,
      this.month.getMonth(),
      this.month.getDate()
    );

    this.#announce(this.month);
  }

  #onPrevious(): void {
    this.month = new Date(
      this.month.getFullYear() - this.numberOfMonths,
      this.month.getMonth(),
      this.month.getDate()
    );

    this.#announce(this.month);
  }

  #onToggleYearSelect(): void {
    this.toggleEvent.emit('year');
  }

  /** Moves focus to the right month button after loading a new year range. */
  #focusAfterRangeChange(key: string, currentIndex: number): void {
    const buttons = Array.from(this.buttons),
      preferredIndices = this.#getPreferredBoundaryIndices(key, currentIndex, buttons.length),
      targetIndex = preferredIndices.find(index => {
        const button = buttons[index];

        return !!button && !button.disabled;
      });

    if (targetIndex !== undefined) {
      this.#focusGroupController.focusToElement(targetIndex);
    }
  }

  /** Builds a list of preferred focus positions for boundary key navigation. */
  #getPreferredBoundaryIndices(key: string, currentIndex: number, length: number): number[] {
    const column = currentIndex % this.#cols,
      preferredIndices =
        key === 'ArrowUp' ? [length - this.#cols + column] : key === 'ArrowDown' ? [column] : [];

    // If that target cannot be focused, fall back to the same arrow direction.
    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      for (let i = length - 1; i >= 0; i -= 1) {
        preferredIndices.push(i);
      }
    } else {
      for (let i = 0; i < length; i += 1) {
        preferredIndices.push(i);
      }
    }

    return preferredIndices;
  }

  #isDisabled(year: number, month: number): boolean {
    const date = new Date(year, month, 1);

    if (this.min && date < new Date(this.min.getFullYear(), this.min.getMonth(), 1)) {
      return true;
    }

    return !!(this.max && date > new Date(this.max.getFullYear(), this.max.getMonth(), 1));
  }

  #allYearDisabled(offset: number): boolean {
    return this.months.every(month =>
      this.#isDisabled(month.date.getFullYear() + offset * this.numberOfMonths, month.value)
    );
  }

  #canSelectYear(offset: number): boolean {
    const targetYear = this.month.getFullYear() + offset * this.numberOfMonths;

    if (offset > 0) {
      return !this.max || targetYear <= this.max.getFullYear();
    } else {
      return !this.min || targetYear + this.numberOfMonths - 1 >= this.min.getFullYear();
    }
  }

  // Announce if needed, we don't want to have the same message announced twice
  #announce(month: Date): void {
    // Clear any pending announcement
    if (this.#announceTimeoutId) {
      clearTimeout(this.#announceTimeoutId);
    }

    // Set a short timeout to debounce multiple calls
    this.#announceTimeoutId = setTimeout(() => {
      announce(
        msg(
          str`Months of the year ${Intl.DateTimeFormat(this.locale, { year: 'numeric' }).format(month)}`,
          {
            id: 'sl.calendar.announceMonthsOfYear'
          }
        ),
        'polite'
      );

      this.#announceTimeoutId = undefined;
    }, 50);
  }
}
