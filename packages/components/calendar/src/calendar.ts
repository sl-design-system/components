import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter, LocaleMixin, event } from '@sl-design-system/shared';
import { dateConverter, dateListConverter } from '@sl-design-system/shared/converters.js';
import { type SlChangeEvent, type SlSelectEvent, type SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './calendar.scss.js';
import { SelectDay } from './select-day.js';
import { SelectMonth } from './select-month.js';
import { SelectYear } from './select-year.js';
import { Indicator, indicatorConverter, isSameDate } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-calendar': Calendar;
  }
}

/**
 * A calendar component for displaying and selecting dates.
 */
export class Calendar extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-select-day': SelectDay,
      'sl-select-month': SelectMonth,
      'sl-select-year': SelectYear
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /**
   * Tracks the previously active calendar mode (`'day' | 'month' | 'year'`) so the
   * component can restore the correct view when closing or switching between
   * month and year views.
   */
  #previousMode: 'day' | 'month' | 'year' = 'day';

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<Date>>;

  /** The list of dates that should be set as disabled. */
  @property({ attribute: 'disabled-dates', converter: dateListConverter }) disabledDates?: Date[];

  /** The first day of the week; 0 for Sunday, 1 for Monday. */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek?: number;

  /**
   * The list of dates that should display an indicator. Each item has a `date` and optional `color`
   * and `label` values that are used to improve accessibility.
   */
  @property({ attribute: 'indicator-dates', converter: indicatorConverter }) indicatorDates?: Indicator[];

  /**
   * The maximum date selectable in the calendar.
   * @default undefined
   */
  @property({ converter: dateConverter }) max?: Date;

  /**
   * The minimum date selectable in the calendar.
   * @default undefined
   */
  @property({ converter: dateConverter }) min?: Date;

  /** @internal The mode the calendar is currently in. */
  @state() mode: 'day' | 'month' | 'year' = 'day';

  /** The month that the calendar opens on. */
  @property({ converter: dateConverter }) month?: Date;

  /** Will disable the ability to select a date when set. */
  @property({ type: Boolean }) readonly?: boolean;

  /** The selected date. */
  @property({ converter: dateConverter }) selected?: Date;

  /** Highlights today's date when set. */
  @property({ type: Boolean, attribute: 'show-today' }) showToday?: boolean;

  /** Shows the week numbers. */
  @property({ type: Boolean, attribute: 'show-week-numbers' }) showWeekNumbers?: boolean;

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('selected') && this.selected) {
      // If only the `selected` property is set, make sure the `month` property is set
      // to the same date, so the selected day is visible in the calendar.
      this.month = this.selected;
    } else {
      // Otherwise default to the current month.
      this.month ??= new Date();
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-select-day
        @sl-select=${this.#onSelect}
        @sl-toggle=${this.#onToggleMonthYear}
        ?inert=${this.mode !== 'day'}
        ?readonly=${this.readonly}
        ?show-today=${this.showToday}
        ?show-week-numbers=${this.showWeekNumbers}
        .disabledDates=${this.disabledDates}
        .indicatorDates=${this.indicatorDates}
        .month=${this.month}
        .selected=${this.selected}
        aria-hidden=${ifDefined(this.mode !== 'day' ? 'true' : undefined)}
        first-day-of-week=${ifDefined(this.firstDayOfWeek)}
        locale=${ifDefined(this.locale)}
        max=${ifDefined(this.max?.toISOString())}
        min=${ifDefined(this.min?.toISOString())}
        style=${ifDefined(this.mode === 'day' ? undefined : 'visibility: hidden')}
      ></sl-select-day>
      ${choose(this.mode, [
        [
          'month',
          () => html`
            <sl-select-month
              @sl-select=${this.#onSelectMonth}
              @sl-toggle=${this.#onToggleMonthYear}
              ?show-today=${this.showToday}
              .selected=${this.selected}
              .month=${this.month}
              locale=${ifDefined(this.locale)}
              max=${ifDefined(this.max?.toISOString())}
              min=${ifDefined(this.min?.toISOString())}
            ></sl-select-month>
          `
        ],
        [
          'year',
          () => html`
            <sl-select-year
              @sl-select=${this.#onSelectYear}
              ?show-today=${this.showToday}
              .selected=${this.selected}
              .year=${this.month}
              max=${ifDefined(this.max?.toISOString())}
              min=${ifDefined(this.min?.toISOString())}
            ></sl-select-year>
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

    this.month = new Date(event.detail.getFullYear(), event.detail.getMonth(), this.month!.getDate());
    this.mode = 'day';

    requestAnimationFrame(() => {
      this.renderRoot.querySelector('sl-select-day')?.focus();
    });
  }

  #onSelectYear(event: SlSelectEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();

    this.month = new Date(event.detail.getFullYear(), this.month!.getMonth(), this.month!.getDate());
    this.mode = this.#previousMode ?? 'day';

    requestAnimationFrame(() => {
      this.renderRoot.querySelector('sl-select-day')?.focus();
    });
  }

  #onToggleMonthYear(event: SlToggleEvent<'month' | 'year'>): void {
    event.preventDefault();
    event.stopPropagation();

    this.#previousMode = this.mode;
    this.mode = event.detail;

    requestAnimationFrame(() => {
      this.renderRoot.querySelector(event.detail === 'month' ? 'sl-select-month' : 'sl-select-year')?.focus();
    });
  }
}
