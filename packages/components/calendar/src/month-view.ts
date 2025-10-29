import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { format } from '@sl-design-system/format-date';
import { type EventEmitter, RovingTabindexController, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
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

export type MonthViewRenderer = (day: Day, monthView: MonthView) => TemplateResult;

/**
 * Component that renders a single month of a calendar.
 */
@localized()
export class MonthView extends LocaleMixin(LitElement) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-tooltip': Tooltip
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  #rovingTabindexController = new RovingTabindexController<HTMLButtonElement>(this, {
    direction: 'grid',
    directionLength: 7,
    focusInIndex: (elements: HTMLButtonElement[]) => {
      if (!elements || elements.length === 0) {
        return -1;
      }
      const selectedIndex = elements.findIndex(el => el.getAttribute('aria-current') === 'date' && !el.disabled);

      if (selectedIndex > -1) {
        return selectedIndex;
      }
      const todayIndex = elements.findIndex(el => (el.getAttribute('part') ?? '').includes('today') && !el.disabled);

      if (todayIndex > -1) {
        return todayIndex;
      }

      return elements.findIndex(el => !el.disabled);
    },
    elements: (): HTMLButtonElement[] => {
      if (this.inert) {
        return [];
      }

      return Array.from(this.renderRoot.querySelectorAll('button'));
    },
    isFocusableElement: el => !el.disabled
  });

  /** @internal The calendar object. */
  @state() calendar?: Calendar;

  /** @internal Emits when the user uses the keyboard to navigate to the next/previous month. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<Date>>;

  /** @internal Days elements. */
  @query('.days') days?: HTMLElement;

  /** The list of dates that should be disabled. */
  @property({ converter: dateConverter }) disabled?: Date[];

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
   * The list of dates that should display an indicator.
   * Each item is an Indicator with a `date`, an optional `color`
   * and 'label' that is used to improve accessibility (added as a tooltip). */
  @property({
    attribute: 'indicator-dates',
    converter: indicatorConverter
  })
  indicatorDates?: Indicator[];

  // eslint-disable-next-line lit/no-native-attributes
  @property({ type: Boolean }) override inert = false;

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

  /** The list of dates that should have 'negative' styling. */
  @property({ converter: dateConverter }) negative?: Date[];

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

  /** @internal Whether per day indicator tooltips are rendered into the DOM. */
  @state() tooltipsRendered = false;

  override disconnectedCallback(): void {
    this.renderRoot.querySelectorAll<HTMLButtonElement>('button[part~="indicator"]').forEach(button => {
      const btn = button as unknown as { tooltip?: Tooltip | (() => void) | undefined };

      if (btn.tooltip instanceof Tooltip) {
        btn.tooltip.remove();
      } else if (btn.tooltip) {
        btn.tooltip();
      }
    });

    super.disconnectedCallback();
  }

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

    if (changes.has('max') || changes.has('min') || changes.has('month') || changes.has('showToday')) {
      const { firstDayOfWeek, max, min, showToday } = this;

      this.calendar = createCalendar(this.month ?? new Date(), { firstDayOfWeek, max, min, showToday });
    }

    if (changes.has('max') || changes.has('min') || changes.has('month') || changes.has('inert')) {
      this.#rovingTabindexController.clearElementCache();
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('indicatorDates') || changes.has('calendar') || changes.has('disabled') || changes.has('month')) {
      this.renderRoot.querySelectorAll<HTMLButtonElement>('button').forEach(button => {
        const dataDate = button.closest('td')?.getAttribute('data-date'),
          dayButton = button as unknown as { tooltip?: Tooltip | (() => void) | undefined };

        const indicatorsForDay = dataDate
          ? (this.indicatorDates ?? []).filter(i => isSameDate(i.date, new Date(dataDate)))
          : [];
        const labels = indicatorsForDay.map(i => i.label).filter(Boolean) as string[];

        const removeTooltip = () => {
          if (dayButton.tooltip instanceof Tooltip) {
            dayButton.tooltip.remove();
            dayButton.tooltip = undefined;
          } else if (dayButton.tooltip) {
            dayButton.tooltip();
            dayButton.tooltip = undefined;
          }
        };

        // If no labels or no data-date, ensure tooltip is removed
        if (!dataDate || labels.length === 0) {
          removeTooltip();
          return;
        }

        // If element doesn't actually have an indicator part, remove tooltip
        if (!button.matches('[part~="indicator"]')) {
          removeTooltip();
          return;
        }

        dayButton.tooltip ||= Tooltip.lazy(
          button,
          (tooltip: Tooltip) => {
            dayButton.tooltip = tooltip;
            tooltip.textContent = labels.join(', ');
          },
          { context: this.shadowRoot! }
        );
        Tooltip.offset = 8;
      });
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
          ${this.weekDays.map(day => html`<th aria-label=${day.long} part="week-day">${day.short}</th>`)}
        </tr>
      </thead>
    `;
  }

  renderDay(day: Day): TemplateResult {
    let template: TemplateResult | undefined;

    const partsArr = this.getDayParts(day),
      isSelected = partsArr.includes('selected');

    if (this.renderer) {
      template = this.renderer(day, this);
    } else if (this.hideDaysOtherMonths && (day.nextMonth || day.previousMonth)) {
      return html`<td role="gridcell"></td>`;
    } else {
      const parts = this.getDayParts(day).join(' ');

      let ariaLabel = `${day.date.getDate()}, ${format(day.date, this.locale, { weekday: 'long' })} ${format(day.date, this.locale, { month: 'long', year: 'numeric' })}`;

      const isNegative = isDateInList(day.date, this.negative ?? []);

      if (isNegative) {
        ariaLabel += `, ${msg('Unavailable', { id: 'sl.calendar.unavailable' })}`;
      }

      template =
        this.readonly || day.unselectable || day.disabled || isDateInList(day.date, this.disabled)
          ? html`<button .part=${parts} aria-label=${ariaLabel} disabled>${day.date.getDate()}</button>`
          : html`
              <button
                @keydown=${(event: KeyboardEvent) => this.#onKeydown(event, day)}
                .part=${parts}
                aria-current=${ifDefined(parts.includes('today') ? 'date' : undefined)}
                aria-label=${ariaLabel}
                aria-pressed=${parts.includes('selected') ? 'true' : 'false'}
              >
                ${day.date.getDate()}
              </button>
            `;
    }

    return html`
      <td
        @click=${(event: Event) => this.#onClick(event, day)}
        aria-selected=${isSelected ? 'true' : 'false'}
        data-date=${day.date.toISOString()}
        role="gridcell"
      >
        ${template}
      </td>
    `;
  }

  /** Returns an array of part names for a day. */
  getDayParts = (day: Day): string[] => {
    return [
      'day',
      day.nextMonth ? 'next-month' : '',
      day.previousMonth ? 'previous-month' : '',
      day.today ? 'today' : '',
      day.unselectable ? 'unselectable' : '',
      this.disabled && isDateInList(day.date, this.disabled) ? 'unselectable' : '',
      this.negative && isDateInList(day.date, this.negative) ? 'negative' : '',
      this.indicatorDates &&
      isDateInList(
        day.date,
        this.indicatorDates.map(indicator => indicator.date)
      )
        ? (() => {
            const indicator = this.indicatorDates && this.indicatorDates.find(i => isSameDate(i.date, day.date));
            return indicator?.color ? `indicator indicator-${indicator.color}` : 'indicator';
          })()
        : '',
      this.selected && isSameDate(day.date, this.selected) ? 'selected' : ''
    ].filter(part => part !== '');
  };

  /** @internal */
  focusDay(day: Date): void {
    const button = this.renderRoot.querySelector<HTMLButtonElement>(`td[data-date="${day.toISOString()}"] button`)!;

    this.#rovingTabindexController.clearElementCache();
    this.#rovingTabindexController.focusToElement(button);
  }

  #onClick(event: Event, day: Day): void {
    if (event.target instanceof HTMLButtonElement && !event.target.disabled) {
      this.selectEvent.emit(day.date);
      this.selected = day.date;
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
      // Whether it's possible to move to the same weekday in previous weeks (skipping disabled)
      const possibleDay = this.#getEnabledSameWeekday(day.date, -1);

      if (!possibleDay) {
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
      const possibleDay = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 7 * direction);

      if ((this.min && possibleDay < this.min) || (this.max && possibleDay > this.max)) {
        return undefined;
      }

      if (!(this.disabled && isDateInList(possibleDay, this.disabled))) {
        return possibleDay;
      }

      return findEnabledSameWeekday(possibleDay);
    };

    return findEnabledSameWeekday(start);
  }
}
