import { localized, msg } from '@lit/localize';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { LocaleMixin } from '@sl-design-system/shared/mixins.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import styles from './month-view.scss.js';
import { type Calendar, type Day, createCalendar, getWeekdayNames } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-month-view': MonthView;
  }
}

@localized()
export class MonthView extends LocaleMixin(LitElement) {
  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal The calendar object. */
  @state() calendar?: Calendar;

  /** The first day of the week; 0 for Sunday, 1 for Monday. */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek = 1;

  /** Will only show the days of the current month, not the next or previous, when true. */
  @property({ type: Boolean, attribute: 'hide-days-other-months' }) hideDaysOtherMonths?: boolean;

  /** The current month to display. */
  @property({ converter: dateConverter }) month: Date = new Date();

  /** Will not use buttons for the days of the month if true. */
  @property({ type: Boolean, reflect: true }) readonly?: boolean;

  /** You can customize how a day is rendered by setting this property.  */
  @property({ attribute: false }) renderer?: (day: Day) => TemplateResult;

  /** Will render a column with the week numbers when true. */
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
      this.calendar = createCalendar(this.month, { firstDayOfWeek: this.firstDayOfWeek });
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
      template = this.renderer(day);
    } else {
      const parts = ['day', ...this.#getParts(day)].join(' ');

      template = this.readonly
        ? html`<span .part=${parts}>${day.date.getDate()}</span>`
        : html`<button .part=${parts}>${day.date.getDate()}</button>`;
    }

    return html`<td>${template}</td>`;
  }

  #getParts(day: Day): string[] {
    return [
      day.nextMonth ? 'next-month' : '',
      day.previousMonth ? 'previous-month' : '',
      day.selected ? 'selected' : '',
      day.today ? 'today' : ''
    ].filter(part => part !== '');
  }
}
