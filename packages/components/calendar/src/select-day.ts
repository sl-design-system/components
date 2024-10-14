import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons';
import { msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { FormatDate } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, LocaleMixin, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type SlSelectEvent, SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { MonthView } from './month-view.js';
import styles from './select-day.scss.js';
import { getWeekdayNames, normalizeDateTime } from './utils.js';

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

Icon.register(faCaretDown, faChevronLeft);

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
  static override styles: CSSResultGroup = styles;

  /** Ignore snap events before initialized. */
  #initialized = false;

  /** @internal The month/year that will be displayed in the header. */
  @state() displayMonth?: Date;

  /** The first day of the week; 0 for Sunday, 1 for Monday. */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek = 1;

  /** The month that is shown. */
  @property({ converter: dateConverter }) month?: Date;

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

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    requestAnimationFrame(() => this.#scrollToMonth(0));
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('firstDayOfWeek') || changes.has('locale')) {
      const { locale, firstDayOfWeek } = this,
        longDays = getWeekdayNames({ firstDayOfWeek, locale, style: 'long' }),
        shortDays = getWeekdayNames({ firstDayOfWeek, locale, style: 'short' });

      this.weekDays = longDays.map((day, i) => ({ long: day, short: shortDays[i] }));
    }

    if (changes.has('month') && this.month) {
      this.displayMonth = this.month;
      this.nextMonth = new Date(this.month.getFullYear(), this.month.getMonth() + 1);
      this.previousMonth = new Date(this.month.getFullYear(), this.month.getMonth() - 1);
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="header">
        <sl-button @click=${this.#onToggleMonthSelect} class="current-month" fill="link">
          <sl-format-date .date=${this.displayMonth} locale=${ifDefined(this.locale)} month="long"></sl-format-date>
          <sl-icon name="fas-caret-down" size="xs"></sl-icon>
        </sl-button>
        <sl-button @click=${this.#onToggleYearSelect} class="current-year" fill="link">
          <sl-format-date .date=${this.displayMonth} locale=${ifDefined(this.locale)} year="numeric"></sl-format-date>
          <sl-icon name="fas-caret-down" size="xs"></sl-icon>
        </sl-button>
        <sl-button @click=${this.#onPrevious} aria-label=${msg('Previous month')} fill="ghost" variant="primary">
          <sl-icon name="far-chevron-left"></sl-icon>
        </sl-button>
        <sl-button @click=${this.#onNext} aria-label=${msg('Next month')} fill="ghost" variant="primary">
          <sl-icon name="chevron-right"></sl-icon>
        </sl-button>
      </div>
      <div class="days-of-week">
        ${this.showWeekNumbers
          ? html`<span class="week-number" aria-label=${msg('Week')}>${msg('wk')}</span>`
          : nothing}
        ${this.weekDays.map(day => html`<span class="day-of-week" aria-label=${day.long}>${day.short}</span>`)}
      </div>
      <div
        @scrollend=${this.#onScrollEnd}
        @scrollsnapchange=${this.#onScrollSnapChange}
        @scrollsnapchanging=${this.#onScrollSnapChanging}
        class="scroller"
      >
        <sl-month-view
          ?readonly=${this.readonly}
          ?show-today=${this.showToday}
          ?show-week-numbers=${this.showWeekNumbers}
          .firstDayOfWeek=${this.firstDayOfWeek}
          .month=${this.previousMonth}
          .selected=${this.selected}
          aria-hidden="true"
          inert
          locale=${ifDefined(this.locale)}
        ></sl-month-view>
        <sl-month-view
          @sl-select=${this.#onSelect}
          ?readonly=${this.readonly}
          ?show-today=${this.showToday}
          ?show-week-numbers=${this.showWeekNumbers}
          .firstDayOfWeek=${this.firstDayOfWeek}
          .month=${this.month}
          .selected=${this.selected}
          locale=${ifDefined(this.locale)}
        ></sl-month-view>
        <sl-month-view
          ?readonly=${this.readonly}
          ?show-today=${this.showToday}
          ?show-week-numbers=${this.showWeekNumbers}
          .firstDayOfWeek=${this.firstDayOfWeek}
          .month=${this.nextMonth}
          .selected=${this.selected}
          aria-hidden="true"
          inert
          locale=${ifDefined(this.locale)}
        ></sl-month-view>
      </div>
    `;
  }

  #onPrevious(): void {
    this.#scrollToMonth(-1, true);
  }

  #onNext(): void {
    this.#scrollToMonth(1, true);
  }

  #onScrollEnd(): void {
    this.#initialized = true;
  }

  #onScrollSnapChange(event: Event): void {
    if (!this.#initialized) return;

    this.month = normalizeDateTime((event.snapTargetInline as MonthView).month!);
    this.#scrollToMonth(0);
  }

  #onScrollSnapChanging(event: Event): void {
    if (!this.#initialized) return;

    this.displayMonth = normalizeDateTime((event.snapTargetInline as MonthView).month!);
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

  #scrollToMonth(month: -1 | 0 | 1, smooth = false): void {
    const width = parseInt(getComputedStyle(this).width),
      left = width * month + width;

    this.scroller?.scrollTo({ left, behavior: smooth ? 'smooth' : 'instant' });
  }
}
