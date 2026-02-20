import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { format } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, NewFocusGroupController, event } from '@sl-design-system/shared';
import { dateConverter, dateListConverter } from '@sl-design-system/shared/converters.js';
import { type SlChangeEvent, type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { LocaleMixin } from '@sl-design-system/shared/mixins.js';
import { Tooltip } from '@sl-design-system/tooltip';
import '@sl-design-system/tooltip/register.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './month-view.scss.js';
import {
  type Calendar,
  type Day,
  Indicator,
  createCalendar,
  getWeekdayNames,
  indicatorConverter,
  isDateInList,
  isSameDate
} from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-month-view': MonthView;
  }
}

export type MonthViewRenderer = (day: Day, monthView: MonthView) => TemplateResult | undefined;

const DAYS_IN_WEEK = 7;

/**
 * Component that renders a single month of a calendar.
 *
 * @csspart day - The day button.
 * @csspart disabled - The day button when shown as disabled.
 * @csspart indicator - The day button for a date with an indicator.
 * @csspart next-month - The day button for a day in the next month.
 * @csspart previous-month - The day button for a day in the previous month.
 * @csspart selected - The day button for the selected date.
 * @csspart today - The day button for today's date.
 * @csspart week-day - The week day header cell.
 * @csspart week-number - The week number cell.
 */
@localized()
export class MonthView extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  /** @internal */
  static override get observedAttributes(): string[] {
    // Observe the `inert` attribute to update the roving tabindex
    return [...(super.observedAttributes ?? []), 'inert'];
  }

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** The current month. */
  #month = new Date();

  /** Manage focus group for day buttons. */
  #focusGroupController = new NewFocusGroupController<HTMLButtonElement>(this, {
    direction: 'grid',
    directionLength: DAYS_IN_WEEK,
    focusInIndex: (elements: HTMLButtonElement[]) => {
      if (!elements || elements.length === 0) {
        return -1;
      }

      // If there is a selected day, focus that one
      const selectedIndex = elements.findIndex(el => !el.disabled && el.getAttribute('aria-pressed') === 'true');
      if (selectedIndex > -1) {
        return selectedIndex;
      }

      // Otherwise, focus today if visible
      const todayIndex = elements.findIndex(el => !el.disabled && el.part.contains('today'));
      if (todayIndex > -1) {
        return todayIndex;
      }

      // Otherwise, focus the first available day of the month
      return elements.findIndex(
        el => !el.disabled && !el.part.contains('previous-month') && !el.part.contains('next-month')
      );
    },
    elements: (): HTMLButtonElement[] => {
      return this.inert ? [] : Array.from(this.renderRoot.querySelectorAll('button'));
    },
    isFocusableElement: el =>
      !!el && !el.disabled && !el.part.contains('previous-month') && !el.part.contains('next-month')
  });

  /** @internal The calendar object. */
  @state() calendar?: Calendar;

  /** @internal Emits when the user uses the keyboard to navigate to the next/previous month. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<Date>>;

  /** @internal Days element. */
  @query('.days') days?: HTMLElement;

  /** The list of dates that should be disabled. */
  @property({ attribute: 'disabled-dates', converter: dateListConverter }) disabledDates?: Date[];

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

  /**
   * The list of dates that should display an indicator. Each item is an Indicator with a `date`, an
   * optional `color` and 'label' that is used to improve accessibility (added as a tooltip).
   */
  @property({ attribute: 'indicator-dates', converter: indicatorConverter }) indicatorDates?: Indicator[];

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

  get month(): Date {
    return this.#month;
  }

  /**
   * The current month to display.
   * @default new Date()
   */
  @property({ converter: dateConverter })
  set month(value: Date) {
    this.#month = value;
  }

  /**
   * If set, will not render buttons for each day.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) readonly?: boolean;

  /** You can customize how a day is rendered by providing a custom renderer callback.  */
  @property({ attribute: false }) renderer?: MonthViewRenderer;

  /** @internal Emits when the user selects a day. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<Date>>;

  /**
   * The selected date.
   * @default undefined
   */
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

  /** @internal Whether per day indicator tooltips are rendered into the DOM. */
  @state() tooltipsRendered = false;

  /** @internal The translated days of the week. */
  @state() weekDays: Array<{ long: string; short: string }> = [];

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'inert') {
      this.#focusGroupController.clearElementCache();
    }
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

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

    if (
      changes.has('disabledDates') ||
      changes.has('indicatorDates') ||
      changes.has('max') ||
      changes.has('min') ||
      changes.has('month') ||
      changes.has('showToday')
    ) {
      const { disabledDates, firstDayOfWeek, indicatorDates, max, min, showToday } = this;

      this.calendar = createCalendar(this.month, {
        disabledDates,
        firstDayOfWeek,
        indicatorDates,
        max,
        min,
        showToday
      });

      this.#focusGroupController.clearElementCache();
    }
  }

  override render(): TemplateResult {
    return html`
      <table
        aria-label=${msg(
          str`Days of ${format(this.month ?? new Date(), this.locale, { month: 'long', year: 'numeric' })}`,
          { id: 'sl.calendar.daysLabel' }
        )}
        role="grid"
      >
        ${this.renderHeader()}
        <tbody>
          ${this.calendar?.weeks.map(
            week => html`
              <tr class="days" role="row">
                ${this.showWeekNumbers
                  ? html`
                      <td
                        aria-label=${msg(str`Week ${week.number}`, { id: 'sl.monthView.week' })}
                        part="week-number"
                        role="rowheader"
                      >
                        ${week.number}
                      </td>
                    `
                  : nothing}
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
        <tr role="row">
          ${this.showWeekNumbers
            ? html`
                <th aria-label=${msg('Week', { id: 'sl.calendar.week' })} part="week-number">
                  ${this.localizedWeekOfYear}
                </th>
              `
            : nothing}
          ${this.weekDays.map(day => html`<th aria-label=${day.long} part="week-day"><span>${day.short}</span></th>`)}
        </tr>
      </thead>
    `;
  }

  renderDay(day: Day): TemplateResult {
    let template: TemplateResult | undefined;

    if (this.renderer) {
      template = this.renderer(day, this);
    } else if (this.hideDaysOtherMonths && (day.nextMonth || day.previousMonth)) {
      return html`<td role="gridcell"></td>`;
    }

    const parts = this.getDayParts(day),
      selected = parts.includes('selected');

    // If the custom renderer returned `undefined`, we fall back to the default rendering
    if (!template) {
      const autofocus = this.#hasAutofocus(day, selected);

      template =
        this.readonly || day.disabled || day.outOfRange
          ? html`
              <button aria-label=${this.getDayLabel(day)} disabled part=${parts.join(' ')}>
                <span>${day.date.getDate()}</span>
              </button>
            `
          : html`
              <button
                @click=${(event: Event & { target: HTMLElement }) => this.#onClick(event, day)}
                @keydown=${(event: KeyboardEvent) => this.#onKeydown(event, day)}
                ?autofocus=${autofocus}
                aria-current=${ifDefined(parts.includes('today') ? 'date' : undefined)}
                aria-describedby=${ifDefined(day.indicator?.label ? `indicator-${day.date.toISOString()}` : undefined)}
                aria-label=${this.getDayLabel(day)}
                aria-pressed=${selected.toString()}
                part=${parts.join(' ')}
              >
                <span>${day.date.getDate()}</span>
              </button>
              ${day.indicator?.label
                ? html`
                    <sl-tooltip id="indicator-${day.date.toISOString()}" offset="4">${day.indicator.label}</sl-tooltip>
                  `
                : nothing}
            `;
    }

    return html`
      <td data-date=${day.date.toISOString()} role="gridcell">${template}</td>
    `;
  }

  /** Returns the default aria-label for a given day. */
  getDayLabel = (day: Day): string => {
    return `${day.date.getDate()}, ${format(day.date, this.locale, { weekday: 'long' })} ${format(day.date, this.locale, { month: 'long', year: 'numeric' })}`;
  };

  /** Returns an array of part names for a given day. */
  getDayParts = (day: Day): string[] => {
    return [
      'day',
      day.disabled ? 'disabled' : '',
      day.indicator ? 'indicator' : '',
      day.indicator?.color ? `indicator-${day.indicator.color}` : '',
      day.nextMonth ? 'next-month' : '',
      day.outOfRange ? 'out-of-range' : '',
      day.previousMonth ? 'previous-month' : '',
      day.today ? 'today' : '',
      this.selected && isSameDate(day.date, this.selected) ? 'selected' : ''
    ].filter(part => part !== '');
  };

  override focus(options?: FocusOptions): void;
  override focus(date: Date): void;
  override focus(dateOrOptions?: Date | FocusOptions): void {
    if (dateOrOptions instanceof Date) {
      const button = this.renderRoot.querySelector<HTMLButtonElement>(
        `td[data-date="${dateOrOptions.toISOString()}"] button`
      )!;

      this.#focusGroupController.clearElementCache();
      this.#focusGroupController.focusToElement(button);
    } else {
      super.focus(dateOrOptions);
    }
  }

  #onClick(event: Event & { target: HTMLElement }, day: Day): void {
    const button = event.target.closest('button');

    if (!button?.disabled) {
      const isAlreadySelected = this.selected && isSameDate(day.date, this.selected);

      if (!isAlreadySelected) {
        this.selectEvent.emit(day.date);
        this.selected = day.date;
      }
    }

    // Emit the `sl-select` event before the `sl-change` event, so the date-field
    // can choose to close the popover containing the month-view before it changes month.
    if (button?.part.contains('previous-month') || button?.part.contains('next-month')) {
      this.changeEvent.emit(day.date);
    }
  }

  #onKeydown(event: KeyboardEvent, day: Day): void {
    if (event.key === 'ArrowLeft' && day.firstActiveDayOfMonth) {
      event.preventDefault();
      event.stopPropagation();

      this.changeEvent.emit(new Date(day.date.getFullYear(), day.date.getMonth(), 0));
    } else if (event.key === 'ArrowRight' && day.lastActiveDayOfMonth) {
      event.preventDefault();
      event.stopPropagation();

      this.changeEvent.emit(new Date(day.date.getFullYear(), day.date.getMonth() + 1, 1));
    } else if (event.key === 'ArrowUp' && day.currentMonth) {
      // Whether it's possible to move to the same weekday in previous weeks (skipping disabled)
      const possibleDay = this.#getEnabledSameWeekday(day.date, -1);
      if (!possibleDay) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const crossesMonth =
        possibleDay.getMonth() !== day.date.getMonth() || possibleDay.getFullYear() !== day.date.getFullYear();

      if (crossesMonth) {
        event.preventDefault();
        event.stopPropagation();

        this.changeEvent.emit(possibleDay);
      }
    } else if (event.key === 'ArrowDown' && day.currentMonth) {
      // Whether it's possible to move to the same weekday in following weeks (skipping disabled)
      const possibleDay = this.#getEnabledSameWeekday(day.date, 1);
      if (!possibleDay) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const crossesMonth =
        possibleDay.getMonth() !== day.date.getMonth() || possibleDay.getFullYear() !== day.date.getFullYear();

      if (crossesMonth) {
        event.preventDefault();
        event.stopPropagation();

        this.changeEvent.emit(possibleDay);
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();

      this.selectEvent.emit(day.date);
      this.selected = day.date;
    }
  }

  /** Nearest enabled same-weekday date (weekly steps: -1 or 1) */
  #getEnabledSameWeekday(start: Date, direction: 1 | -1): Date | undefined {
    const findEnabledSameWeekday = (current: Date): Date | undefined => {
      const possibleDay = new Date(
        current.getFullYear(),
        current.getMonth(),
        current.getDate() + DAYS_IN_WEEK * direction
      );

      if ((this.min && possibleDay < this.min) || (this.max && possibleDay > this.max)) {
        return undefined;
      }

      if (!(this.disabledDates && isDateInList(possibleDay, this.disabledDates))) {
        return possibleDay;
      }

      return findEnabledSameWeekday(possibleDay);
    };

    return findEnabledSameWeekday(start);
  }

  /**
   * Determines if a button should autofocus.
   * A button should autofocus when:
   * - it is the selected date
   * - or it is today
   * - or it is the first enabled day of the month
   */
  #hasAutofocus(day: Day, selected: boolean): boolean {
    const isFirstEnabledDay =
      day.currentMonth &&
      !day.disabled &&
      !day.outOfRange &&
      !this.selected &&
      !this.showToday &&
      !this.calendar?.weeks.some(week =>
        week.days.some(d => d.currentMonth && !d.disabled && !d.outOfRange && d.date < day.date)
      );

    return !!(selected || (day.today && !this.selected) || isFirstEnabledDay);
  }
}
