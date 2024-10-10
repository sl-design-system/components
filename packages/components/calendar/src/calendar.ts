import { localized } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LocaleMixin } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './calendar.scss.js';
import { SelectDay } from './select-day.js';
import { SelectMonth } from './select-month.js';
import { SelectYear } from './select-year.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-calendar': Calendar;
  }
}

@localized()
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

  /** The first day of the week; 0 for Sunday, 1 for Monday. */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek = 1;

  /** @internal The mode the calendar currently is in. */
  @state() mode: 'day' | 'month' | 'year' = 'day';

  /** The month that the calendar opens on. */
  @property({ converter: dateConverter }) month = new Date();

  override render(): TemplateResult {
    return html`
      ${choose(this.mode, [
        [
          'day',
          () => html`
            <sl-select-day
              @sl-toggle=${this.#onToggleMonthYear}
              .firstDayOfWeek=${this.firstDayOfWeek}
              .month=${this.month}
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

  #onSelectMonth(event: SlSelectEvent<number>): void {
    this.month = new Date(this.month.getFullYear(), event.detail - 1, this.month.getDate());
    this.mode = 'day';
  }

  #onSelectYear(event: SlSelectEvent<number>): void {
    this.month = new Date(event.detail, this.month.getMonth() - 1, this.month.getDate());
    this.mode = 'month';
  }

  #onToggleMonthYear(): void {
    this.mode = 'year';
  }
}
