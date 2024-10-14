import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter, LocaleMixin, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type SlChangeEvent, type SlSelectEvent, type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './calendar.scss.js';
import { SelectDay } from './select-day.js';
import { SelectMonth } from './select-month.js';
import { SelectYear } from './select-year.js';
import { isSameDate } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-calendar': Calendar;
  }
}

/**
 * A calendar component for displaying and selecting dates.
 */
export class Calendar extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-select-day': SelectDay,
      'sl-select-month': SelectMonth,
      'sl-select-year': SelectYear
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<Date>>;

  /** The first day of the week; 0 for Sunday, 1 for Monday. */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek?: number;

  /** @internal The mode the calendar currently is in. */
  @state() mode: 'day' | 'month' | 'year' = 'day';

  /** The month that the calendar opens on. */
  @property({ converter: dateConverter }) month = new Date();

  /** Will disable the ability to select a date when set. */
  @property({ type: Boolean }) readonly?: boolean;

  /** The selected date. */
  @property({ converter: dateConverter }) selected?: Date;

  /** Highlights today's date when set. */
  @property({ type: Boolean, attribute: 'show-today' }) showToday?: boolean;

  /** Shows the week numbers. */
  @property({ type: Boolean, attribute: 'show-week-numbers' }) showWeekNumbers?: boolean;

  override render(): TemplateResult {
    return html`
      ${choose(this.mode, [
        [
          'day',
          () => html`
            <sl-select-day
              @sl-select=${this.#onSelect}
              @sl-toggle=${this.#onToggleMonthYear}
              ?readonly=${this.readonly}
              ?show-today=${this.showToday}
              ?show-week-numbers=${this.showWeekNumbers}
              .month=${this.month}
              .selected=${this.selected}
              first-day-of-week=${ifDefined(this.firstDayOfWeek)}
              locale=${ifDefined(this.locale)}
            ></sl-select-day>
          `
        ],
        [
          'month',
          () => html`
            <sl-select-month
              @sl-select=${this.#onSelectMonth}
              .month=${this.month}
              locale=${ifDefined(this.locale)}
            ></sl-select-month>
          `
        ],
        [
          'year',
          () => html`
            <sl-select-year @sl-select=${this.#onSelectYear} .year=${this.month.getFullYear()}></sl-select-year>
          `
        ]
      ])}
    `;
  }

  #onSelect(event: SlSelectEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.selected || !isSameDate(this.selected, event.detail)) {
      this.selected = new Date(event.detail);
      this.changeEvent.emit(this.selected);
    }
  }

  #onSelectMonth(event: SlSelectEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();

    this.month = new Date(event.detail.getFullYear(), event.detail.getMonth(), this.month.getDate());
    this.mode = 'day';
  }

  #onSelectYear(event: SlSelectEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();

    this.month = new Date(event.detail.getFullYear(), this.month.getMonth(), this.month.getDate());
    this.mode = 'day';
  }

  #onToggleMonthYear(event: SlToggleEvent<'month' | 'year'>): void {
    event.preventDefault();
    event.stopPropagation();

    this.mode = event.detail;
  }
}
