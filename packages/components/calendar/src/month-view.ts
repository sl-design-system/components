import { localized, msg } from '@lit/localize';
import { type EventEmitter, RovingTabindexController, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { LocaleMixin } from '@sl-design-system/shared/mixins.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './month-view.scss.js';
import { type Calendar, type Day, createCalendar, getWeekdayNames, isSameDate } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-month-view': MonthView;
  }
}

export type MonthViewRenderer = (day: Day, monthView: MonthView) => TemplateResult;

/**
 * Component that renders a single month of a calendar.
 */
@localized()
export class MonthView extends LocaleMixin(LitElement) {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #rovingTabindexController = new RovingTabindexController<HTMLButtonElement>(this, {
    direction: 'grid',
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
    elements: (): HTMLButtonElement[] => Array.from(this.renderRoot.querySelectorAll('button')),
    isFocusableElement: el => !el.disabled
  });

  /** @internal The calendar object. */
  @state() calendar?: Calendar;

  /**
   * The first day of the week; 0 for Sunday, 1 for Monday.
   * @default 1
   */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek = 1;

  /**
   * Will only show the days of the current month, not the next or previous, when true.
   * @default false
   */
  @property({ type: Boolean, attribute: 'hide-days-other-months' }) hideDaysOtherMonths?: boolean;

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
    if (changes.has('locale') || changes.has('firstDayOfWeek')) {
      const { locale, firstDayOfWeek } = this,
        longDays = getWeekdayNames({ firstDayOfWeek, locale, style: 'long' }),
        shortDays = getWeekdayNames({ firstDayOfWeek, locale, style: 'short' });

      this.weekDays = longDays.map((day, i) => ({ long: day, short: shortDays[i] }));
    }

    if (changes.has('month')) {
      const { firstDayOfWeek, showToday } = this;

      this.calendar = createCalendar(this.month ?? new Date(), { firstDayOfWeek, showToday });
    }
  }

  override render(): TemplateResult {
    return html`
      <table>
        ${this.renderHeader()}
        <tbody>
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
          ${this.showWeekNumbers ? html`<th part="week-number">${msg('wk')}</th>` : nothing}
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
      const parts = this.getDayParts(day).join(' ');

      template =
        this.readonly || !day.currentMonth
          ? html`<span .part=${parts}>${day.date.getDate()}</span>`
          : html`
              <button .part=${parts} aria-current=${ifDefined(parts.includes('selected') ? 'date' : undefined)}>
                ${day.date.getDate()}
              </button>
            `;
    }

    return html`<td @click=${(event: Event) => this.#onClick(event, day)}>${template}</td>`;
  }

  /** Returns an array of part names for a day. */
  getDayParts = (day: Day): string[] => {
    return [
      'day',
      day.nextMonth ? 'next-month' : '',
      day.previousMonth ? 'previous-month' : '',
      day.today ? 'today' : '',
      this.selected && isSameDate(day.date, this.selected) ? 'selected' : ''
    ].filter(part => part !== '');
  };

  #onClick(event: Event, day: Day): void {
    if (event.target instanceof HTMLButtonElement && !event.target.disabled) {
      this.selectEvent.emit(day.date);
    }
  }
}
