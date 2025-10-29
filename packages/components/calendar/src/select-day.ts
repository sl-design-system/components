import { msg, str } from '@lit/localize';
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
import { Indicator, getWeekdayNames, indicatorConverter, normalizeDateTime } from './utils.js';

declare global {
  // These are too new to be in every TypeScript version yet
  interface Event {
    snapTargetBlock?: Element;
    snapTargetInline?: Element;
  }

  interface HTMLElementTagNameMap {
    'sl-select-day': SelectDay;
  }
}

export class SelectDay extends LocaleMixin(ScopedElementsMixin(LitElement)) {
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

  /** The list of dates that should be set as disabled. */
  @property({ attribute: 'disabled-dates', converter: dateConverter }) disabledDates?: Date[];

  /** @internal The month/year that will be displayed in the header. */
  @state() displayMonth?: Date;

  /** The first day of the week; 0 for Sunday, 1 for Monday. */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek = 1;

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

  /** The month that is shown. */
  @property({ converter: dateConverter }) month?: Date;

  /** @internal The month-view element. */
  @query('sl-month-view') monthView?: HTMLElement;

  /** The list of dates that should have 'negative' styling. */
  @property({ converter: dateConverter }) negative?: Date[];

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

  observer?: IntersectionObserver;

  override disconnectedCallback(): void {
    this.observer?.disconnect();

    if (this.#announceTimeoutId) {
      clearTimeout(this.#announceTimeoutId);
      this.#announceTimeoutId = undefined;
    }

    super.disconnectedCallback();
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    requestAnimationFrame(() => {
      let totalHorizontal = 0;

      if (this.monthView) {
        const cs = getComputedStyle(this.monthView);
        const left = parseFloat(cs.paddingLeft) || 0;
        const right = parseFloat(cs.paddingRight) || 0;
        totalHorizontal = Math.round(left + right);
      }

      // Create the observer after the scroller exists so `root` is the scroller element
      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio === 1) {
              this.month = normalizeDateTime((entry.target as MonthView).month!);
              this.#scrollToMonth(0);
            }
          });
        },
        { root: this.scroller, rootMargin: `${totalHorizontal}px`, threshold: [0, 0.25, 0.5, 0.75, 1] }
      );

      this.#scrollToMonth(0);
      const monthViews = this.renderRoot.querySelectorAll('sl-month-view');
      monthViews.forEach(mv => this.observer?.observe(mv));
    });
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
      this.displayMonth = this.month;
      this.nextMonth = new Date(this.month.getFullYear(), this.month.getMonth() + 1);
      this.previousMonth = new Date(this.month.getFullYear(), this.month.getMonth() - 1);
    }
  }

  override render(): TemplateResult {
    const canSelectNextYear = this.displayMonth
        ? !this.max || (this.max && this.displayMonth.getFullYear() + 1 <= this.max.getFullYear())
        : false,
      canSelectPreviousYear = this.displayMonth
        ? !this.min || (this.min && this.displayMonth.getFullYear() - 1 >= this.min.getFullYear())
        : false,
      canSelectNextMonth = this.nextMonth
        ? !this.max || (this.max && this.nextMonth?.getTime() + 1 <= this.max.getTime())
        : false,
      canSelectPreviousMonth = this.previousMonth
        ? !this.min ||
          (this.min && this.previousMonth?.getTime() >= new Date(this.min.getFullYear(), this.min.getMonth()).getTime())
        : false;

    return html`
      <div part="header">
        <div>
          ${canSelectPreviousMonth || canSelectNextMonth
            ? html`
                <sl-button
                  @click=${this.#onToggleMonthSelect}
                  ?disabled=${this.readonly}
                  class="current-month"
                  fill="link"
                  variant="secondary"
                >
                  <sl-format-date
                    .date=${this.displayMonth}
                    locale=${ifDefined(this.locale)}
                    month="long"
                  ></sl-format-date>
                  <sl-icon name="caret-down-solid" size="md"></sl-icon>
                </sl-button>
              `
            : html`
                <span class="current-month"
                  ><sl-format-date
                    .date=${this.displayMonth}
                    locale=${ifDefined(this.locale)}
                    month="long"
                  ></sl-format-date
                ></span>
              `}
          ${canSelectPreviousYear || canSelectNextYear
            ? html`
                <sl-button
                  @click=${this.#onToggleYearSelect}
                  ?disabled=${this.readonly}
                  class="current-year"
                  fill="link"
                  variant="secondary"
                >
                  <sl-format-date
                    .date=${this.displayMonth}
                    locale=${ifDefined(this.locale)}
                    year="numeric"
                  ></sl-format-date>
                  <sl-icon name="caret-down-solid" size="md"></sl-icon>
                </sl-button>
              `
            : html`
                <span class="current-year"
                  ><sl-format-date
                    .date=${this.displayMonth}
                    locale=${ifDefined(this.locale)}
                    year="numeric"
                  ></sl-format-date
                ></span>
              `}
        </div>
        <div class="arrows">
          <sl-button
            @click=${this.#onPrevious}
            aria-label=${msg(
              str`Previous month, ${format(this.previousMonth!, this.locale, { month: 'long', year: 'numeric' })}`,
              { id: 'sl.calendar.previousMonth' }
            )}
            class="previous-month"
            fill="ghost"
            variant="secondary"
            ?disabled=${!canSelectPreviousMonth || this.readonly}
          >
            <sl-icon name="chevron-left"></sl-icon>
          </sl-button>
          <sl-button
            @click=${this.#onNext}
            aria-label=${msg(
              str`Next month, ${format(this.nextMonth!, this.locale, { month: 'long', year: 'numeric' })}`,
              { id: 'sl.calendar.nextMonth' }
            )}
            class="next-month"
            fill="ghost"
            variant="secondary"
            ?disabled=${!canSelectNextMonth || this.readonly}
          >
            <sl-icon name="chevron-right"></sl-icon>
          </sl-button>
        </div>
      </div>
      <div class="days-of-week" role="list">
        ${this.showWeekNumbers
          ? html`
              <span role="listitem" class="week-number" aria-label=${msg('Week', { id: 'sl.calendar.week' })}
                >${this.localizedWeekOfYear}</span
              >
            `
          : nothing}
        ${this.weekDays.map(
          day => html`<span role="listitem" class="day-of-week" aria-label=${day.long}>${day.short}</span>`
        )}
      </div>
      <div class="scroller" tabindex="-1">
        <sl-month-view
          ?readonly=${this.readonly}
          ?show-today=${this.showToday}
          ?show-week-numbers=${this.showWeekNumbers}
          .disabledDates=${this.disabledDates}
          .firstDayOfWeek=${this.firstDayOfWeek}
          .indicatorDates=${this.indicatorDates}
          .month=${this.previousMonth}
          .negative=${this.negative}
          .selected=${this.selected}
          aria-hidden="true"
          inert
          max=${ifDefined(this.max?.toISOString())}
          min=${ifDefined(this.min?.toISOString())}
          locale=${ifDefined(this.locale)}
        ></sl-month-view>
        <sl-month-view
          @sl-change=${this.#onChange}
          @sl-select=${this.#onSelect}
          ?readonly=${this.readonly}
          ?show-today=${this.showToday}
          ?show-week-numbers=${this.showWeekNumbers}
          .disabledDates=${this.disabledDates}
          .firstDayOfWeek=${this.firstDayOfWeek}
          .indicatorDates=${this.indicatorDates}
          .month=${this.month}
          .negative=${this.negative}
          .selected=${this.selected}
          ?inert=${this.inert}
          locale=${ifDefined(this.locale)}
          max=${ifDefined(this.max?.toISOString())}
          min=${ifDefined(this.min?.toISOString())}
        ></sl-month-view>
        <sl-month-view
          ?readonly=${this.readonly}
          ?show-today=${this.showToday}
          ?show-week-numbers=${this.showWeekNumbers}
          .disabledDates=${this.disabledDates}
          .firstDayOfWeek=${this.firstDayOfWeek}
          .indicatorDates=${this.indicatorDates}
          .month=${this.nextMonth}
          .negative=${this.negative}
          .selected=${this.selected}
          aria-hidden="true"
          inert
          locale=${ifDefined(this.locale)}
          max=${ifDefined(this.max?.toISOString())}
          min=${ifDefined(this.min?.toISOString())}
        ></sl-month-view>
      </div>
    `;
  }

  // Announce if needed, we don't want to have the same message announced twice
  #announce(month: Date): void {
    // Clear any pending announcement
    if (this.#announceTimeoutId) {
      clearTimeout(this.#announceTimeoutId);
    }

    // Set a short timeout to debounce multiple calls
    this.#announceTimeoutId = setTimeout(() => {
      const monthFormatted = format(month, this.locale, { month: 'long', year: 'numeric' });

      announce(`${monthFormatted}`, 'polite');

      this.#announceTimeoutId = undefined;
    }, 50);
  }

  async #onChange(event: SlChangeEvent<Date>): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    this.month = new Date(event.detail.getFullYear(), event.detail.getMonth());

    // Wait for the month views to rerender before focusing the day
    await this.updateComplete;

    requestAnimationFrame(() => {
      this.renderRoot.querySelector<MonthView>('sl-month-view:nth-child(2)')?.focusDay(event.detail);
    });
  }

  #onPrevious(): void {
    this.#scrollToMonth(-1, true);

    if (this.previousMonth !== undefined) {
      this.#announce(this.previousMonth);
    }
  }

  #onNext(): void {
    this.#scrollToMonth(1, true);

    if (this.nextMonth !== undefined) {
      this.#announce(this.nextMonth);
    }
  }

  #onSelect(event: SlSelectEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.readonly) {
      return;
    }

    this.selectEvent.emit(event.detail);
  }

  #onToggleMonthSelect(): void {
    this.toggleEvent.emit('month');
  }

  #onToggleYearSelect(): void {
    this.toggleEvent.emit('year');
  }

  #scrollToMonth(month: -1 | 0 | 1, smooth = false): void {
    const width = parseInt(getComputedStyle(this).width) || 0,
      left = width * month + width;

    this.scroller?.scrollTo({ left, behavior: smooth ? 'smooth' : 'instant' });
  }
}
