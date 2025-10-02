import { localized } from '@lit/localize';
import { format } from '@sl-design-system/format-date';
import { type EventEmitter, RovingTabindexController, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type SlChangeEvent, type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { LocaleMixin } from '@sl-design-system/shared/mixins.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './month-view.scss.js';
import { type Calendar, type Day, createCalendar, getWeekdayNames, isDateInList, isSameDate } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-month-view': MonthView;
  }
}

export type IndicatorColor = 'blue' | 'red' | 'yellow' | 'green' | 'grey';

export type MonthViewRenderer = (day: Day, monthView: MonthView) => TemplateResult;

export type Indicator = { date: Date; color?: IndicatorColor };

/**
 * Component that renders a single month of a calendar.
 */
@localized()
export class MonthView extends LocaleMixin(LitElement) {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  #rovingTabindexController = new RovingTabindexController<HTMLButtonElement>(this, {
    direction: 'grid',
    // NOTE: If we add the ability to toggle the weekend days, we'll need to update this value.
    directionLength: 7,
    focusInIndex: elements => {
      let index = elements.findIndex(el => el.part.contains('selected') && !el.disabled);
      if (index > -1) {
        return index;
      }

      index = elements.findIndex(el => el.part.contains('today') && !el.disabled);
      if (index > -1) {
        return index;
      }

      return elements.findIndex(el => !el.disabled);
    },
    elements: (): HTMLButtonElement[] => {
      // console.log(
      //   'elements',
      //   Array.from(this.renderRoot.querySelectorAll('button')),
      //   this.renderRoot.querySelectorAll('button')
      // );
      return Array.from(this.renderRoot.querySelectorAll('button'));
    },
    isFocusableElement: el => !el.disabled
  });

  /** @internal The calendar object. */
  @state() calendar?: Calendar;

  /** @internal Emits when the user uses the keyboard to navigate to the next/previous month. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<Date>>;

  /**
   * The first day of the week; 0 for Sunday, 1 for Monday.
   *
   * NOTE: Remove this property once `Intl.Locale.prototype.getWeekInfo` is widely available.
   * See https://caniuse.com/mdn-javascript_builtins_intl_locale_getweekinfo
   *
   * @default 1
   */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek = 1;

  /**
   * Will only show the days of the current month, not the next or previous, when true.
   * @default false
   */
  @property({ type: Boolean, attribute: 'hide-days-other-months' }) hideDaysOtherMonths?: boolean;

  /** @internal The localized "week of year" label. */
  @state() localizedWeekOfYear?: string;

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

  /** The current month to display. */
  @property({ converter: dateConverter }) month?: Date;

  /**
   * If set, will not render buttons for each day.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) readonly?: boolean;

  /** You can customize how a day is rendered by providing a custom renderer callback.  */
  @property({ attribute: false }) renderer?: MonthViewRenderer;

  /** @internal Emits when the user selects a day. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<Date>>;

  /** The selected date. */
  @property({ converter: dateConverter }) selected?: Date;

  /** The list of dates that should have 'negative' styling. */
  @property({ converter: dateConverter }) negative?: Date[];

  /** The list of dates that should have an indicator. */
  // @property({ converter: dateConverter }) indicator?: Indicator[]; // Date[];
  // @property({ type: Object }) indicator?: Indicator[]; // Date[];

  @property({
    attribute: 'indicator',
    converter: {
      toAttribute: (value?: Indicator[]) =>
        value
          ? JSON.stringify(
              value.map(i => ({
                ...i,
                date: dateConverter.toAttribute?.(i.date)
              }))
            )
          : undefined,
      fromAttribute: (value: string | null, _type?: unknown) =>
        value
          ? (JSON.parse(value) as Array<{ date: string; color?: IndicatorColor }>).map(i => ({
              ...i,
              date: dateConverter.fromAttribute?.(i.date)
            }))
          : undefined
    }
  })
  indicator?: Indicator[];

  // TODO: maybe implement indicator color and indicator (date) separately?

  // /**
  //  * The color of the indicator.
  //  * Should be used together with the `indicator` property.
  //  * @default 'blue'
  //  */
  // @property({ reflect: true, attribute: 'indicator-color' }) indicatorColor?: IndicatorColor;

  // eslint-disable-next-line lit/no-native-attributes
  @property({ type: Boolean }) override inert = false;

  /**
   * Highlights today's date when set.
   * @default false
   */
  @property({ type: Boolean, attribute: 'show-today' }) showToday?: boolean;

  /**
   * Will render a column with the week numbers when true.
   * @default false
   */
  @property({ type: Boolean, attribute: 'show-week-numbers' }) showWeekNumbers?: boolean;

  /** @internal The translated days of the week. */
  @state() weekDays: Array<{ long: string; short: string }> = [];

  override willUpdate(changes: PropertyValues<this>): void {
    if (changes.has('firstDayOfWeek') || changes.has('locale')) {
      const { locale, firstDayOfWeek } = this,
        longDays = getWeekdayNames({ firstDayOfWeek, locale, style: 'long' }),
        shortDays = getWeekdayNames({ firstDayOfWeek, locale, style: 'short' });

      this.weekDays = longDays.map((day, i) => ({ long: day, short: shortDays[i] }));
    }

    if (changes.has('locale') || changes.has('showWeekNumbers')) {
      this.localizedWeekOfYear = new Intl.DisplayNames(this.locale, { style: 'short', type: 'dateTimeField' }).of(
        'weekOfYear'
      );
    }

    if (changes.has('max') || changes.has('min') || changes.has('month')) {
      const { firstDayOfWeek, max, min, showToday } = this;

      this.calendar = createCalendar(this.month ?? new Date(), { firstDayOfWeek, max, min, showToday });
    }

    if (changes.has('month') || changes.has('inert')) {
      this.#rovingTabindexController.clearElementCache();
    }
  }

  override render(): TemplateResult {
    return html`
      <table>
        ${this.renderHeader()}
        <tbody>
          <tr>
            <td colspan="7">${1 + (this.month?.getMonth() ?? 0)}</td>
          </tr>
          ${this.calendar?.weeks.map(
            week => html`
              <tr>
                ${this.showWeekNumbers ? html`<td part="week-number">${week.number}</td>` : nothing}
                ${week.days.map(day => this.renderDay(day))}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  renderHeader(): TemplateResult {
    return html`
      <thead part="header">
        <tr>
          ${this.showWeekNumbers ? html`<th part="week-number">${this.localizedWeekOfYear}</th>` : nothing}
          ${this.weekDays.map(day => html`<th aria-label=${day.long} part="week-day">${day.short}</th>`)}
        </tr>
      </thead>
    `;
  }

  renderDay(day: Day): TemplateResult {
    let template: TemplateResult | undefined;

    if (this.renderer) {
      template = this.renderer(day, this);
    } else if (this.hideDaysOtherMonths && (day.nextMonth || day.previousMonth)) {
      return html`<td></td>`;
    } else {
      const parts = this.getDayParts(day).join(' '),
        ariaLabel = `${day.date.getDate()}, ${format(day.date, this.locale, { weekday: 'long' })} ${format(day.date, this.locale, { month: 'long', year: 'numeric' })}`;

      template =
        this.readonly || day.unselectable
          ? html`<span .part=${parts} aria-label=${ariaLabel}>${day.date.getDate()}</span>`
          : html`
              <button
                @keydown=${(event: KeyboardEvent) => this.#onKeydown(event, day)}
                .part=${parts}
                aria-current=${ifDefined(parts.includes('selected') ? 'date' : undefined)}
                aria-label=${ariaLabel}
              >
                ${day.date.getDate()}
              </button>
            `;
    }

    return html`
      <td @click=${(event: Event) => this.#onClick(event, day)} data-date=${day.date.toISOString()}>${template}</td>
    `;
  }

  /** Returns an array of part names for a day. */
  getDayParts = (day: Day): string[] => {
    console.log(
      'indicator in getDayParts',
      this.indicator,
      this.indicator ? this.indicator[0].date : 'no indicator',
      this.indicator?.length
    );
    console.log(
      'indicator part applied?',
      this.indicator &&
        isDateInList(
          day.date,
          this.indicator.map(i => i.date)
        )
        ? 'indicator'
        : ''
    );

    return [
      'day',
      day.nextMonth ? 'next-month' : '',
      day.previousMonth ? 'previous-month' : '',
      day.today ? 'today' : '',
      day.unselectable ? 'unselectable' : '',
      this.negative && isDateInList(day.date, this.negative) ? 'negative' : '',
      // this.indicator && isDateInList(day.date, this.indicator) ? 'indicator' : '',
      // this.indicator &&
      // isDateInList(
      //   day.date,
      //   this.indicator.map(i => i.date)
      // )
      //   ? 'indicator'
      //   : '',
      this.indicator &&
      isDateInList(
        day.date,
        this.indicator.map(i => i.date)
      )
        ? (() => {
            const indicator = this.indicator && this.indicator.find(i => isSameDate(i.date, day.date));
            return indicator?.color ? `indicator indicator-${indicator.color}` : 'indicator';
          })()
        : '',
      this.selected && isSameDate(day.date, this.selected) ? 'selected' : ''
    ].filter(part => part !== '');
  };

  focusDay(day: Date): void {
    const button = this.renderRoot.querySelector<HTMLButtonElement>(`td[data-date="${day.toISOString()}"] button`)!;

    this.#rovingTabindexController.clearElementCache();
    this.#rovingTabindexController.focusToElement(button);
  }

  #onClick(event: Event, day: Day): void {
    if (event.target instanceof HTMLButtonElement && !event.target.disabled) {
      this.selectEvent.emit(day.date);
    }
  }

  #onKeydown(event: KeyboardEvent, day: Day): void {
    if (event.key === 'ArrowLeft' && day.currentMonth && day.date.getDate() === 1) {
      event.preventDefault();
      event.stopPropagation();

      this.changeEvent.emit(new Date(day.date.getFullYear(), day.date.getMonth(), 0));
    } else if (event.key === 'ArrowRight' && day.currentMonth && day.lastDayOfMonth) {
      event.preventDefault();
      event.stopPropagation();

      this.changeEvent.emit(new Date(day.date.getFullYear(), day.date.getMonth() + 1, 1));
    } else if (event.key === 'ArrowUp' && day.currentMonth) {
      const crossesMonthBoundary = day.date.getDate() - 7 < 1;

      // Move to the same weekday in previous month
      if (crossesMonthBoundary) {
        event.preventDefault();
        event.stopPropagation();

        const targetDate = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate() - 7);
        this.changeEvent.emit(targetDate);
      }
    } else if (event.key === 'ArrowDown' && day.currentMonth) {
      const lastDateOfMonth = new Date(day.date.getFullYear(), day.date.getMonth() + 1, 0).getDate(),
        crossesMonthBoundary = day.date.getDate() + 7 > lastDateOfMonth;

      // Move to the same weekday in next month
      if (crossesMonthBoundary) {
        event.preventDefault();
        event.stopPropagation();

        const targetDate = new Date(day.date.getFullYear(), day.date.getMonth(), day.date.getDate() + 7);
        this.changeEvent.emit(targetDate);
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();

      this.selectEvent.emit(day.date);
    }
  }
}
