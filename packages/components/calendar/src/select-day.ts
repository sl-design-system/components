import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { Button } from '@sl-design-system/button';
import { FormatDate, format } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, LocaleMixin, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type SlChangeEvent, type SlSelectEvent, SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MonthView } from './month-view.js';
import styles from './select-day.scss.js';
import { Indicator, getWeekdayNames, indicatorConverter, isSameDate, normalizeDateTime } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select-day': SelectDay;
  }
}

@localized()
export class SelectDay extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-format-date': FormatDate,
      'sl-icon': Icon,
      'sl-month-view': MonthView
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Timeout id, to be used with `clearTimeout`. */
  #announceTimeoutId?: ReturnType<typeof setTimeout>;

  /** Use an intersection observer as a workaround until `scrollsnapchange` events are widely supported. */
  #intersectionObserver?: IntersectionObserver;

  /**
   * Use a resize observer as a cross browser solution to know when to initialize the intersection observer
   * and also to know when to center the current month in the scroller during initialization.
   */
  #resizeObserver = new ResizeObserver(() => {
    if (!this.#intersectionObserver) {
      this.#intersectionObserver = new IntersectionObserver(
        entries => {
          entries
            .filter(entry => entry.isIntersecting)
            .forEach(entry => {
              if (entry.intersectionRatio >= 0.5) {
                const monthView = entry.target as MonthView;

                // Make sure the header reflects the currently visible month
                this.displayMonth = normalizeDateTime(monthView.month);
              }
            });
        },
        { root: this.scroller, threshold: [0, 0.5, 1] }
      );

      this.renderRoot.querySelectorAll('sl-month-view').forEach(mv => this.#intersectionObserver?.observe(mv));
    }

    // Whenever the size of the calendar changes, make sure the current month is centered
    this.#scrollToMonth(0);
  });

  /** The list of dates that should be set as disabled. */
  @property({ attribute: 'disabled-dates', converter: dateConverter }) disabledDates?: Date[];

  /** @internal The month/year that will be displayed in the header. */
  @state() displayMonth?: Date;

  /** The first day of the week; 0 for Sunday, 1 for Monday. */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek = 1;

  /**
   * The list of dates that should display an indicator.
   * Each item is an Indicator with a `date`, an optional `color`
   * and 'label' that is used to improve accessibility (added as a tooltip).
   */
  @property({
    attribute: 'indicator-dates',
    converter: indicatorConverter
  })
  indicatorDates?: Indicator[];

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

  /** The month that is shown. */
  @property({ converter: dateConverter }) month = new Date();

  /** @internal The next month in the calendar. */
  @state() nextMonth?: Date;

  /** @internal The previous month in the calendar. */
  @state() previousMonth?: Date;

  /** Will disable selecting a date when set. */
  @property({ type: Boolean }) readonly?: boolean;

  /** @internal The scroller element. */
  @query('.scroller') scroller?: HTMLElement;

  /** The selected date. */
  @property({ converter: dateConverter }) selected?: Date;

  /** @internal Emits when the user selects a day. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<Date>>;

  /** Highlights today's date when set. */
  @property({ type: Boolean, attribute: 'show-today' }) showToday?: boolean;

  /** Shows the week numbers. */
  @property({ type: Boolean, reflect: true, attribute: 'show-week-numbers' }) showWeekNumbers?: boolean;

  /** @internal Emits when the user clicks the month/year button. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<'month' | 'year'>>;

  /** @internal The translated days of the week. */
  @state() weekDays: Array<{ long: string; short: string }> = [];

  override connectedCallback(): void {
    super.connectedCallback();

    this.#resizeObserver.observe(this);
  }

  override disconnectedCallback(): void {
    this.#resizeObserver.disconnect();

    this.#intersectionObserver?.disconnect();
    this.#intersectionObserver = undefined;

    if (this.#announceTimeoutId) {
      clearTimeout(this.#announceTimeoutId);
      this.#announceTimeoutId = undefined;
    }

    super.disconnectedCallback();
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

    if (changes.has('month') && this.month) {
      this.displayMonth = new Date(this.month.getFullYear(), this.month.getMonth());
      this.nextMonth = new Date(this.month.getFullYear(), this.month.getMonth() + 1);
      this.previousMonth = new Date(this.month.getFullYear(), this.month.getMonth() - 1);
    }
  }

  override render(): TemplateResult {
    const canSelectNextMonth = this.#canSelectNextMonth(),
      canSelectPreviousMonth = this.#canSelectPreviousMonth(),
      canSelectNextYear = this.displayMonth
        ? !this.max || (this.max && this.displayMonth.getFullYear() + 1 <= this.max.getFullYear())
        : false,
      canSelectPreviousYear = this.displayMonth
        ? !this.min || (this.min && this.displayMonth.getFullYear() - 1 >= this.min.getFullYear())
        : false;

    const scrollerLocked = !canSelectNextMonth && !canSelectPreviousMonth;

    return html`
      <header>
        <div class="month-year">
          ${canSelectPreviousMonth || canSelectNextMonth
            ? html`
                <sl-button @click=${this.#onToggleMonthSelect} class="current-month" fill="link" variant="secondary">
                  <sl-format-date
                    .date=${this.displayMonth}
                    locale=${ifDefined(this.locale)}
                    month="long"
                  ></sl-format-date>
                  <sl-icon name="caret-down-solid"></sl-icon>
                </sl-button>
              `
            : html`
                <span class="current-month">
                  <sl-format-date
                    .date=${this.displayMonth}
                    locale=${ifDefined(this.locale)}
                    month="long"
                  ></sl-format-date>
                </span>
              `}
          ${canSelectPreviousYear || canSelectNextYear
            ? html`
                <sl-button @click=${this.#onToggleYearSelect} class="current-year" fill="link" variant="secondary">
                  <sl-format-date
                    .date=${this.displayMonth}
                    locale=${ifDefined(this.locale)}
                    year="numeric"
                  ></sl-format-date>
                  <sl-icon name="caret-down-solid"></sl-icon>
                </sl-button>
              `
            : html`
                <span class="current-year">
                  <sl-format-date
                    .date=${this.displayMonth}
                    locale=${ifDefined(this.locale)}
                    year="numeric"
                  ></sl-format-date>
                </span>
              `}
        </div>
        <div class="arrows">
          <sl-button
            @click=${this.#onPrevious}
            ?disabled=${!canSelectPreviousMonth}
            aria-label=${msg(
              str`Previous month, ${format(this.previousMonth!, this.locale, { month: 'long', year: 'numeric' })}`,
              { id: 'sl.calendar.previousMonth' }
            )}
            class="previous-month"
            fill="ghost"
            variant="secondary"
          >
            <sl-icon name="chevron-left"></sl-icon>
          </sl-button>
          <sl-button
            @click=${this.#onNext}
            ?disabled=${!canSelectNextMonth}
            aria-label=${msg(
              str`Next month, ${format(this.nextMonth!, this.locale, { month: 'long', year: 'numeric' })}`,
              { id: 'sl.calendar.nextMonth' }
            )}
            class="next-month"
            fill="ghost"
            variant="secondary"
          >
            <sl-icon name="chevron-right"></sl-icon>
          </sl-button>
        </div>
      </header>

      <div class="days-of-week" role="list">
        ${this.showWeekNumbers
          ? html`
              <span aria-label=${msg('Week', { id: 'sl.calendar.week' })} class="week-number" role="listitem">
                ${this.localizedWeekOfYear}
              </span>
            `
          : nothing}
        ${this.weekDays.map(
          day => html`<span aria-label=${day.long} class="day-of-week" role="listitem">${day.short}</span>`
        )}
      </div>

      <div
        @scrollend=${this.#onScrollEnd}
        class="scroller"
        data-locked=${ifDefined(scrollerLocked ? 'true' : undefined)}
        data-locked-prev=${ifDefined(!canSelectPreviousMonth ? 'true' : undefined)}
        data-locked-next=${ifDefined(!canSelectNextMonth ? 'true' : undefined)}
        tabindex="-1"
      >
        <sl-month-view
          ?readonly=${this.readonly}
          ?show-today=${this.showToday}
          ?show-week-numbers=${this.showWeekNumbers}
          .disabledDates=${this.disabledDates}
          .indicatorDates=${this.indicatorDates}
          aria-hidden="true"
          first-day-of-week=${ifDefined(this.firstDayOfWeek)}
          inert
          locale=${ifDefined(this.locale)}
          max=${ifDefined(this.max?.toISOString())}
          min=${ifDefined(this.min?.toISOString())}
          month=${ifDefined(this.previousMonth?.toISOString())}
          selected=${ifDefined(this.selected?.toISOString())}
        ></sl-month-view>
        <sl-month-view
          @sl-change=${this.#onChange}
          @sl-select=${this.#onSelect}
          ?readonly=${this.readonly}
          ?show-today=${this.showToday}
          ?show-week-numbers=${this.showWeekNumbers}
          .disabledDates=${this.disabledDates}
          .indicatorDates=${this.indicatorDates}
          first-day-of-week=${ifDefined(this.firstDayOfWeek)}
          locale=${ifDefined(this.locale)}
          max=${ifDefined(this.max?.toISOString())}
          min=${ifDefined(this.min?.toISOString())}
          month=${ifDefined(this.month?.toISOString())}
          selected=${ifDefined(this.selected?.toISOString())}
        ></sl-month-view>
        <sl-month-view
          ?readonly=${this.readonly}
          ?show-today=${this.showToday}
          ?show-week-numbers=${this.showWeekNumbers}
          .disabledDates=${this.disabledDates}
          .indicatorDates=${this.indicatorDates}
          aria-hidden="true"
          first-day-of-week=${ifDefined(this.firstDayOfWeek)}
          inert
          locale=${ifDefined(this.locale)}
          max=${ifDefined(this.max?.toISOString())}
          min=${ifDefined(this.min?.toISOString())}
          month=${ifDefined(this.nextMonth?.toISOString())}
          selected=${ifDefined(this.selected?.toISOString())}
        ></sl-month-view>
      </div>
    `;
  }

  #onChange(event: SlChangeEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();

    this.month = new Date(event.detail.getFullYear(), event.detail.getMonth());

    // // Wait for the month views to rerender before focusing the day
    // await this.updateComplete;

    // requestAnimationFrame(() => {
    //   this.renderRoot.querySelector<MonthView>('sl-month-view:nth-child(2)')?.focusDay(event.detail);
    // });
  }

  #onPrevious(): void {
    this.#scrollToMonth(-1, true);
    this.#announce(this.previousMonth);
  }

  #onNext(): void {
    this.#scrollToMonth(1, true);
    this.#announce(this.nextMonth);
  }

  #onScrollEnd(): void {
    if (this.displayMonth && !isSameDate(this.month, this.displayMonth)) {
      // Update the month, so it rerenders the month-views
      this.month = normalizeDateTime(this.displayMonth);

      // Now instantly scroll back to the center month (so the user doesn't notice)
      this.#scrollToMonth(0);
    }
  }

  #onSelect(event: SlSelectEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();

    this.selectEvent.emit(event.detail);
  }

  #onToggleMonthSelect(): void {
    this.toggleEvent.emit('month');
  }

  #onToggleYearSelect(): void {
    this.toggleEvent.emit('year');
  }

  #announce(month?: Date): void {
    if (!month) {
      return;
    }

    // Clear any pending announcement
    if (this.#announceTimeoutId) {
      clearTimeout(this.#announceTimeoutId);
    }

    // Announce if needed, we don't want to have the same message announced twice
    this.#announceTimeoutId = setTimeout(() => {
      const monthFormatted = format(month, this.locale, { month: 'long', year: 'numeric' });

      announce(`${monthFormatted}`, 'polite');

      this.#announceTimeoutId = undefined;
    }, 50);
  }

  #canSelectNextMonth(): boolean {
    return this.nextMonth ? !this.max || this.nextMonth.getTime() + 1 <= this.max.getTime() : false;
  }

  #canSelectPreviousMonth(): boolean {
    return this.previousMonth
      ? !this.min || this.previousMonth.getTime() >= new Date(this.min.getFullYear(), this.min.getMonth()).getTime()
      : false;
  }

  #scrollToMonth(month: -1 | 0 | 1, smooth = false): void {
    if (!this.scroller) {
      return;
    }

    const width = parseInt(getComputedStyle(this).width) || 0,
      left = width * month + width;

    // Block scroll when target month is not selectable
    if ((month === -1 && !this.#canSelectPreviousMonth()) || (month === 1 && !this.#canSelectNextMonth())) {
      this.scroller?.scrollTo({ left: width, behavior: 'auto' });
    } else {
      this.scroller?.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
    }
  }
}
