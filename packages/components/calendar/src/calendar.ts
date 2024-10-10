import { faChevronLeft } from '@fortawesome/pro-regular-svg-icons';
import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { FormatDate } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import { LocaleMixin } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import styles from './calendar.scss.js';
import { MonthView } from './month-view.js';
import { getWeekdayNames } from './utils.js';

declare global {
  // These are too new to be in every TypeScript version yet
  interface Event {
    snapTargetBlock?: Element;
    snapTargetInline?: Element;
  }
}

Icon.register(faChevronLeft);

@localized()
export class Calendar extends LocaleMixin(ScopedElementsMixin(LitElement)) {
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

  /** @internal The month/year that will be displayed in the header. */
  @state() displayMonth?: Date;

  /** The first day of the week; 0 for Sunday, 1 for Monday. */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek = 1;

  /** The month that the calendar opens on. */
  @property({ converter: dateConverter }) month = new Date();

  /** @internal The next month in the calendar. */
  @state() nextMonth?: Date;

  /** @internal The previous month in the calendar. */
  @state() previousMonth?: Date;

  /** @internal The scroller element. */
  @query('[part="scroller"]') scroller?: HTMLElement;

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

    if (changes.has('month')) {
      this.displayMonth = this.month;
      this.nextMonth = new Date(this.month.getFullYear(), this.month.getMonth() + 1);
      this.previousMonth = new Date(this.month.getFullYear(), this.month.getMonth() - 1);
    }
  }

  override render(): TemplateResult {
    return html`
      <div part="header">
        <sl-button @click=${this.#onToggleMonthYear} part="current-month-year" fill="link">
          <sl-format-date .date=${this.displayMonth} month="long" year="numeric"></sl-format-date>
        </sl-button>
        <sl-button @click=${this.#onPrevious} aria-label=${msg('Previous month')} fill="ghost" variant="primary">
          <sl-icon name="far-chevron-left"></sl-icon>
        </sl-button>
        <sl-button @click=${this.#onNext} aria-label=${msg('Next month')} fill="ghost" variant="primary">
          <sl-icon name="chevron-right"></sl-icon>
        </sl-button>
      </div>
      <div part="days-of-week">
        ${this.weekDays.map(day => html`<span part="day-of-week" aria-label=${day.long}>${day.short}</span>`)}
      </div>
      <div
        @scrollsnapchange=${this.#onScrollSnapChange}
        @scrollsnapchanging=${this.#onScrollSnapChanging}
        part="scroller"
      >
        <sl-month-view aria-hidden="true" inert .locale=${this.locale} .month=${this.previousMonth}></sl-month-view>
        <sl-month-view .locale=${this.locale} .month=${this.month}></sl-month-view>
        <sl-month-view aria-hidden="true" inert .locale=${this.locale} .month=${this.nextMonth}></sl-month-view>
      </div>
    `;
  }

  #onPrevious(): void {
    this.#scrollToMonth(-1, true);
  }

  #onNext(): void {
    this.#scrollToMonth(1, true);
  }

  #onScrollSnapChange(event: Event): void {
    this.month = (event.snapTargetInline as MonthView).month;
    this.#scrollToMonth(0);
  }

  #onScrollSnapChanging(event: Event): void {
    this.displayMonth = (event.snapTargetInline as MonthView).month;
  }

  #onToggleMonthYear(): void {
    console.log('Toggle month/year');
  }

  #scrollToMonth(month: -1 | 0 | 1, smooth = false): void {
    const width = parseInt(getComputedStyle(this).width),
      left = width * month + width;

    this.scroller?.scrollTo({ left, behavior: smooth ? 'smooth' : 'instant' });
  }
}
