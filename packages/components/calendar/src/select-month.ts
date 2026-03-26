import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { Button } from '@sl-design-system/button';
import { FormatDate, format } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, LocaleMixin, NewFocusGroupController, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type SlSelectEvent, SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, queryAll, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './select-month.scss.js';
import { Month } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select-month': SelectMonth;
  }
}

@localized()
export class SelectMonth extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  /** @internal */
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

  /** Timeout id, to be used with `clearTimeout`. */
  #announceTimeoutId?: ReturnType<typeof setTimeout>;

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
    scope: (): HTMLElement => this.renderRoot.querySelector('table')!,
    wrap: false
  });

  /** The buttons representing each month. */
  @queryAll('button') buttons!: NodeListOf<HTMLButtonElement>;

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

  /** The month/year to display. */
  @property({ converter: dateConverter }) month = new Date();

  /** @internal The months to display. */
  @state() months: Month[] = [];

  /** The currently selected date. (In order to style current month) */
  @property({ converter: dateConverter }) selected?: Date;

  /** @internal Emits when the user selects a month. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<Date>>;

  /**
   * Highlights the current month when set.
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
          disabled: !(
            (!this.min || date >= new Date(this.min.getFullYear(), this.min.getMonth(), 1)) &&
            (!this.max || date <= new Date(this.max.getFullYear(), this.max.getMonth(), 1))
          )
        };
      });
    }

    if (changes.has('min') || changes.has('max') || changes.has('month')) {
      this.#focusGroupController.clearElementCache();
    }
  }

  override render(): TemplateResult {
    const currentYear = this.month.getFullYear();

    const rows: Month[][] = [];
    for (let i = 0; i < this.months.length; i += 3) {
      rows.push(this.months.slice(i, i + 3));
    }

    return html`
      <header>
        ${this.#canSelectYear(-1) || this.#canSelectYear(1)
          ? html`
              <sl-button
                @click=${this.#onToggleYearSelect}
                aria-label=${msg(str`${format(this.month, this.locale, { year: 'numeric' })}, change year`, {
                  id: 'sl.calendar.changeYear'
                })}
                class="current-year"
                fill="link"
                variant="secondary"
              >
                <sl-format-date .date=${this.month} locale=${ifDefined(this.locale)} year="numeric"></sl-format-date>
                <sl-icon name="caret-down-solid"></sl-icon>
              </sl-button>
            `
          : html`<span class="current-year">${currentYear}</span>`}
        <div class="arrows">
          <sl-button
            @click=${this.#onPrevious}
            ?disabled=${!this.#canSelectYear(-1)}
            aria-label=${msg(str`Previous year, ${currentYear - 1}`, { id: 'sl.calendar.previousYear' })}
            fill="ghost"
            variant="secondary"
          >
            <sl-icon name="chevron-left"></sl-icon>
          </sl-button>
          <sl-button
            @click=${this.#onNext}
            ?disabled=${!this.#canSelectYear(1)}
            aria-label=${msg(str`Next year, ${currentYear + 1}`, { id: 'sl.calendar.nextYear' })}
            fill="ghost"
            variant="secondary"
          >
            <sl-icon name="chevron-right"></sl-icon>
          </sl-button>
        </div>
      </header>

      <table aria-label=${msg(str`Months of ${currentYear}`, { id: 'sl.calendar.monthsLabel' })} role="grid">
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
    const current = month.value === new Date().getMonth() && this.month.getFullYear() === new Date().getFullYear(),
      selected = !!(
        this.selected &&
        this.selected.getMonth() === month.value &&
        this.selected.getFullYear() === month.date.getFullYear()
      );

    return html`
      <td aria-rowindex=${rowIndex + 1} aria-colindex=${colIndex + 1} role="gridcell">
        <button
          @click=${() => this.#onClick(month.value)}
          @keydown=${this.#onKeydown}
          ?disabled=${month.disabled}
          aria-current=${ifDefined(current ? 'date' : undefined)}
          aria-pressed=${selected.toString()}
          class=${classMap({ current, selected })}
        >
          <span>${month.long}</span>
        </button>
      </td>
    `;
  }

  #onClick(month: number): void {
    this.selectEvent.emit(new Date(this.month.getFullYear(), month));
    this.selected = new Date(this.month.getFullYear(), month);
  }

  /**
   * For arrow keys, we need to detect if we're at a visual boundary (first/last button position)
   * and trying to navigate beyond it AND navigation is not blocked by min/max constraints.
   * If we can load a new range, do so. Otherwise, let the focus group controller handle it.
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
    } else if (event.key === 'ArrowDown' && currentIndex >= buttons.length - this.#cols && canGoLater) {
      shouldLoadNewRange = true;
      event.preventDefault();
      this.#onNext();
    }

    if (shouldLoadNewRange) {
      await this.updateComplete;

      const newButtons = Array.from(this.buttons),
        newEnabledButtons = newButtons.filter(b => !b.disabled);

      let targetButton: HTMLButtonElement | undefined;

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        targetButton = newEnabledButtons.at(-1);
      } else {
        targetButton = newEnabledButtons.at(0);
      }

      targetButton?.focus();
    }

    // Otherwise, let the event bubble to the focus group controller
  }

  #onNext(): void {
    this.month = new Date(this.month.getFullYear() + 1, this.month.getMonth(), this.month.getDate());

    this.#announce(this.month);
  }

  #onPrevious(): void {
    this.month = new Date(this.month.getFullYear() - 1, this.month.getMonth(), this.month.getDate());

    this.#announce(this.month);
  }

  #onToggleYearSelect(): void {
    this.toggleEvent.emit('year');
  }

  #isDisabled(year: number, month: number): boolean {
    const date = new Date(year, month, 1);

    if (this.min && date < new Date(this.min.getFullYear(), this.min.getMonth(), 1)) {
      return true;
    }

    return !!(this.max && date > new Date(this.max.getFullYear(), this.max.getMonth(), 1));
  }

  #allYearDisabled(offset: number): boolean {
    const year = this.month.getFullYear() + offset;

    return this.months.every(m => this.#isDisabled(year, m.value));
  }

  #canSelectYear(offset: number): boolean {
    const targetYear = this.month.getFullYear() + offset;

    if (offset > 0) {
      return !this.max || targetYear <= this.max.getFullYear();
    } else {
      return !this.min || targetYear >= this.min.getFullYear();
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
        msg(str`Months of the year ${Intl.DateTimeFormat(this.locale, { year: 'numeric' }).format(month)}`, {
          id: 'sl.calendar.announceMonthsOfYear'
        }),
        'polite'
      );

      this.#announceTimeoutId = undefined;
    }, 50);
  }
}
