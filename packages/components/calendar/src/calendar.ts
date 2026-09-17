import { localized, msg, str } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { format } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, EventsController, event } from '@sl-design-system/shared';
import { dateConverter, dateListConverter } from '@sl-design-system/shared/converters.js';
import { isSameDate } from '@sl-design-system/shared/date.js';
import {
  type SlChangeEvent,
  type SlSelectEvent,
  type SlToggleEvent
} from '@sl-design-system/shared/events.js';
import { LocaleMixin } from '@sl-design-system/shared/mixins/locale.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html,
  nothing
} from 'lit';
import { property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './calendar.css' with { type: 'css' };
import { SelectDay } from './select-day.js';
import { SelectMonth } from './select-month.js';
import { SelectYear } from './select-year.js';
import { Indicator, indicatorConverter } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-calendar': Calendar;
  }
}

/** A calendar component for displaying and selecting dates. */
@localized()
export class Calendar extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon,
      'sl-select-day': SelectDay,
      'sl-select-month': SelectMonth,
      'sl-select-year': SelectYear
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Events controller. */
  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, {
    focusin: this.#onFocusIn,
    keydown: this.#onKeydown
  });

  /**
   * Tracks the previously active calendar mode (`'day' | 'month' | 'year'`) so the component can
   * restore the correct view when closing or switching between month and year views.
   */
  #previousView: 'day' | 'month' | 'year' = 'day';

  /** The first date selected while composing a range. */
  @state() rangeStart?: Date;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<Date | Date[]>>;

  /** The list of dates that should be set as disabled. */
  @property({ attribute: 'disabled-dates', converter: dateListConverter }) disabledDates?: Date[];

  /** The first day of the week; 0 for Sunday, 1 for Monday. */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek?: number;

  /**
   * The list of dates that should display an indicator. Each item has a `date` and optional `color`
   * and `label` values that are used to improve accessibility. Use `indicator-dates` to highlight
   * specific dates with a visual indicator (for example, exam dates or assignment deadlines)
   * without disabling them.
   */
  @property({ attribute: 'indicator-dates', converter: indicatorConverter })
  indicatorDates?: Indicator[];

  /**
   * The maximum date selectable in the calendar. Dates outside the range are visually disabled and
   * cannot be selected.
   *
   * @default undefined
   */
  @property({ converter: dateConverter }) max?: Date;

  /**
   * The minimum date selectable in the calendar. Dates outside the range are visually disabled and
   * cannot be selected.
   *
   * @default undefined
   */
  @property({ converter: dateConverter }) min?: Date;

  /** Determines whether the calendar selects a single date or a date range. */
  @property() mode: 'single' | 'range' = 'single';

  /** @internal The view the calendar is currently showing. */
  @state() view: 'day' | 'month' | 'year' = 'day';

  /** The month that the calendar opens on. */
  @property({ converter: dateConverter }) month?: Date;

  /** Will disable the ability to select a date when set. */
  @property({ type: Boolean }) readonly?: boolean;

  /** The selected date range. The order of the dates does not matter. */
  @property({ converter: dateListConverter }) range?: Date[];

  /** The selected date. */
  @property({ converter: dateConverter }) selected?: Date;

  /** Highlights today's date when set. */
  @property({ type: Boolean, attribute: 'show-today' }) showToday?: boolean;

  /** Shows the week numbers. */
  @property({ type: Boolean, attribute: 'show-week-numbers' }) showWeekNumbers?: boolean;

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('mode') && this.mode !== 'range') {
      this.rangeStart = undefined;
    }

    if (changes.has('selected') && this.selected && this.mode !== 'range') {
      // If only the `selected` property is set, make sure the `month` property is set
      // to the same date, so the selected day is visible in the calendar.
      this.month = this.selected;
    } else if (changes.has('range') && this.range?.length && this.mode === 'range' && !this.month) {
      this.month = this.#normalizeRange(this.range)[0];
    } else {
      // Otherwise default to the current month.
      this.month ??= new Date();
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-select-day
        @sl-change=${this.#onChange}
        @sl-select=${this.#onSelect}
        @sl-toggle=${this.#onToggleMonthYear}
        ?autofocus=${this.view === 'day'}
        ?inert=${this.view !== 'day'}
        ?readonly=${this.readonly}
        ?show-today=${this.showToday}
        ?show-week-numbers=${this.showWeekNumbers}
        .disabledDates=${this.disabledDates}
        .indicatorDates=${this.indicatorDates}
        .month=${this.month}
        .range=${this.range}
        .rangeSelection=${this.mode === 'range'}
        .rangeStart=${this.rangeStart}
        .selected=${this.mode === 'range' ? undefined : this.selected}
        aria-hidden=${ifDefined(this.view !== 'day' ? 'true' : undefined)}
        first-day-of-week=${ifDefined(this.firstDayOfWeek)}
        locale=${ifDefined(this.locale)}
        max=${ifDefined(this.max?.toISOString())}
        min=${ifDefined(this.min?.toISOString())}
        style=${ifDefined(this.view === 'day' ? undefined : 'visibility: hidden')}></sl-select-day>
      ${choose(this.view, [
        [
          'month',
          () => html`
            <sl-select-month
              @sl-select=${this.#onSelectMonth}
              @sl-toggle=${this.#onToggleMonthYear}
              ?show-current=${this.showToday}
              .selected=${this.selected}
              .month=${this.month}
              locale=${ifDefined(this.locale)}
              max=${ifDefined(this.max?.toISOString())}
              min=${ifDefined(this.min?.toISOString())}></sl-select-month>
          `
        ],
        [
          'year',
          () => html`
            <sl-select-year
              @sl-select=${this.#onSelectYear}
              ?show-current=${this.showToday}
              .selected=${this.selected}
              .year=${this.month}
              max=${ifDefined(this.max?.toISOString())}
              min=${ifDefined(this.min?.toISOString())}></sl-select-year>
          `
        ]
      ])}
      ${
        this.min && this.max
          ? html`
              <div class="helper-text">
                <sl-icon name="info"></sl-icon>
                ${msg(
                  str`Between ${format(this.min, this.locale, this.#helperTextFormatOptions)} and ${format(this.max, this.locale, this.#helperTextFormatOptions)}`,
                  { id: 'sl.calendar.rangeBetween' }
                )}
              </div>
            `
          : this.min
            ? html`
                <div class="helper-text">
                  <sl-icon name="info"></sl-icon>
                  ${msg(
                    str`No earlier than ${format(this.min, this.locale, this.#helperTextFormatOptions)}`,
                    {
                      id: 'sl.calendar.rangeNoEarlierThan'
                    }
                  )}
                </div>
              `
            : this.max
              ? html`
                  <div class="helper-text">
                    <sl-icon name="info"></sl-icon>
                    ${msg(
                      str`No later than ${format(this.max, this.locale, this.#helperTextFormatOptions)}`,
                      {
                        id: 'sl.calendar.rangeNoLaterThan'
                      }
                    )}
                  </div>
                `
              : nothing
      }
    `;
  }

  /**
   * Adds the helper-text to `ariaDescribedByElements` on the first button that receives focus
   * inside the calendar grid.
   *
   * This is an accessibility hack necessary because of
   * https://github.com/nvaccess/nvda/issues/13392. NVDA automatically switches to browse mode when
   * detecting interactive elements inside grid cells. Because of that focus is not moved to another
   * day and the ARIA descriptions aren't read. As a workaround, we're adding the helper text to the
   * first button that receives focus, so NVDA will at least read the helper text once. Once this
   * NVDA issue is resolved, we can remove this workaround and add the helper text to the min/max
   * day as expected.
   */
  #onFocusIn(event: FocusEvent): void {
    if (!this.min && !this.max) {
      return;
    }

    const helperText = this.renderRoot.querySelector('.helper-text');
    if (!helperText) {
      return;
    }

    const button = event
      .composedPath()
      .find(
        (el): el is HTMLButtonElement =>
          el instanceof HTMLButtonElement && !!el.closest('table[role="grid"]')
      );

    if (button) {
      const existing = (button.ariaDescribedByElements ?? []).filter(
        el => !el.classList?.contains('helper-text')
      );

      button.ariaDescribedByElements = [...existing, helperText];
    }
  }

  /**
   * Returns the format options for the helper text, omitting the year when min and max are in the
   * same year.
   */
  get #helperTextFormatOptions(): Intl.DateTimeFormatOptions {
    return this.min && this.max && this.min.getFullYear() === this.max.getFullYear()
      ? { day: 'numeric', month: 'long' }
      : { day: '2-digit', month: '2-digit', year: 'numeric' };
  }

  #onChange(event: SlChangeEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();
  }

  #onSelect(event: SlSelectEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.mode === 'range') {
      this.#selectRangeDate(event.detail);
    } else if (!this.selected || !isSameDate(this.selected, event.detail)) {
      this.selected = new Date(event.detail);
      this.changeEvent.emit(this.selected);
    }
  }

  #onSelectMonth(event: SlSelectEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();

    this.month = new Date(
      event.detail.getFullYear(),
      event.detail.getMonth(),
      this.month!.getDate()
    );
    this.view = 'day';

    requestAnimationFrame(() => {
      this.renderRoot.querySelector('sl-select-day')?.focus();
    });
  }

  #onSelectYear(event: SlSelectEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();

    this.month = new Date(
      event.detail.getFullYear(),
      this.month!.getMonth(),
      this.month!.getDate()
    );
    this.view = this.#previousView ?? 'day';

    requestAnimationFrame(() => {
      this.#focusActiveMode();
    });
  }

  #onToggleMonthYear(event: SlToggleEvent<'month' | 'year'>): void {
    event.preventDefault();
    event.stopPropagation();

    this.#previousView = this.view;
    this.view = event.detail;

    // Wait until the new mode has rendered before focusing the correct element
    requestAnimationFrame(() => {
      const subComponent = this.renderRoot.querySelector(
        event.detail === 'month' ? 'sl-select-month' : 'sl-select-year'
      );

      if (subComponent) {
        subComponent.focus();

        this.#setHelperTextOnFirstButton(subComponent);
      }
    });
  }

  /**
   * Sets `ariaDescribedByElements` on the first focusable button (day, month or year depending on
   * view)
   */
  #setHelperTextOnFirstButton(subComponent: Element): void {
    const helperText = this.renderRoot.querySelector('.helper-text');

    if (!helperText) {
      return;
    }

    const button = subComponent.shadowRoot?.querySelector<HTMLButtonElement>(
      'table button:not(:disabled)'
    );

    if (button) {
      const existingDescription = (button.ariaDescribedByElements ?? []).filter(
        el => !el.classList?.contains('helper-text')
      );

      button.ariaDescribedByElements = [...existingDescription, helperText];
    }
  }

  #focusActiveMode(): void {
    const selector =
        this.view === 'month'
          ? 'sl-select-month'
          : this.view === 'year'
            ? 'sl-select-year'
            : 'sl-select-day',
      subComponent = this.renderRoot.querySelector(selector);

    if (subComponent) {
      subComponent.focus();
      this.#setHelperTextOnFirstButton(subComponent);
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.mode === 'range' && this.rangeStart) {
      event.preventDefault();
      event.stopPropagation();
      this.rangeStart = undefined;
    }
  }

  #selectRangeDate(date: Date): void {
    if (!this.rangeStart) {
      this.rangeStart = new Date(date);
      announce(
        msg(
          str`${format(date, this.locale, { day: 'numeric', month: 'long', year: 'numeric' })} selected. Select second date.`,
          { id: 'sl.calendar.rangeStartSelected' }
        ),
        'polite'
      );
      return;
    }

    const range = this.#normalizeRange([this.rangeStart, date]);
    this.range = range;
    this.rangeStart = undefined;
    this.changeEvent.emit(range);
    announce(
      msg(
        str`You selected range from ${format(range[0], this.locale, { day: 'numeric', month: 'long', year: 'numeric' })} to ${format(range[1], this.locale, { day: 'numeric', month: 'long', year: 'numeric' })}.`,
        { id: 'sl.calendar.rangeSelected' }
      ),
      'polite'
    );
  }

  #normalizeRange(range: Date[]): [Date, Date] {
    const [first, second = first] = range;

    return first.getTime() <= second.getTime() ? [first, second] : [second, first];
  }
}
