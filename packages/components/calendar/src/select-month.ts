import { msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { FormatDate } from '@sl-design-system/format-date';
import { Icon } from '@sl-design-system/icon';
import {
  type EventEmitter,
  EventsController,
  LocaleMixin,
  RovingTabindexController,
  event
} from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type SlSelectEvent, SlToggleEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './select-month.scss.js';
import { Month } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select-month': SelectMonth;
  }
}

export class SelectMonth extends LocaleMixin(ScopedElementsMixin(LitElement)) {
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-format-date': FormatDate,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = { ...LitElement.shadowRootOptions, delegatesFocus: true };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  // eslint-disable-next-line no-unused-private-class-members
  #events = new EventsController(this, { keydown: this.#onKeydown });

  // eslint-disable-next-line no-unused-private-class-members
  #rovingTabindexController = new RovingTabindexController(this, {
    direction: 'grid',
    directionLength: 3,
    elements: (): HTMLElement[] => Array.from(this.renderRoot.querySelectorAll('ol sl-button')),
    focusInIndex: elements => {
      const index = elements.findIndex(el => el.hasAttribute('aria-pressed'));

      return index === -1 ? 0 : index;
    },
    listenerScope: (): HTMLElement => this.renderRoot.querySelector('ol')!
  });

  /** The month/year to display. */
  @property({ converter: dateConverter }) month = new Date();

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

  /**
   * Highlights the current month when set.
   * @default false
   */
  @property({ type: Boolean, attribute: 'show-today' }) showToday?: boolean;

  /** @internal The months to display. */
  @state() months: Month[] = [];

  /** @internal Emits when the user clicks the month/year button. */
  @event({ name: 'sl-toggle' }) toggleEvent!: EventEmitter<SlToggleEvent<'month' | 'year'>>;

  /** @internal Emits when the user selects a month. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<Date>>;

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('locale') || changes.has('month') || changes.has('min') || changes.has('max')) {
      const formatShort = new Intl.DateTimeFormat(this.locale, { month: 'short' }),
        formatLong = new Intl.DateTimeFormat(this.locale, { month: 'long' });

      this.months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(this.month.getFullYear(), i, 1);

        return {
          short: formatShort.format(date),
          long: formatLong.format(date),
          value: i,
          unselectable: !(
            (!this.min || date >= new Date(this.min.getFullYear(), this.min.getMonth(), 1)) &&
            (!this.max || date <= new Date(this.max.getFullYear(), this.max.getMonth(), 1))
          )
        };
      });
    }
  }

  override render(): TemplateResult {
    const currentMonth = this.month.getMonth(),
      currentYear = this.month.getFullYear(),
      canSelectNextYear = !this.max || (this.max && this.month.getFullYear() + 1 <= this.max.getFullYear()),
      canSelectPreviousYear = !this.min || (this.min && this.month.getFullYear() - 1 >= this.min.getFullYear());

    return html`
      <div part="header">
        ${canSelectPreviousYear || canSelectNextYear
          ? html`
              <sl-button @click=${this.#onToggleYearSelect} class="current-year" fill="link" variant="secondary">
                <sl-format-date .date=${this.month} locale=${ifDefined(this.locale)} year="numeric"></sl-format-date>
                <sl-icon name="caret-down-solid" size="md"></sl-icon>
              </sl-button>
            `
          : html`<span class="current-year">${currentYear}</span>`}
        <sl-button
          @click=${this.#onPrevious}
          aria-label=${msg(str`Previous year, ${currentYear - 1}`, { id: 'sl.calendar.previousYear' })}
          fill="ghost"
          variant="primary"
          ?disabled=${!canSelectPreviousYear}
        >
          <sl-icon name="chevron-left"></sl-icon>
        </sl-button>
        <sl-button
          @click=${this.#onNext}
          aria-label=${msg(str`Next year, ${currentYear + 1}`, { id: 'sl.calendar.nextYear' })}
          fill="ghost"
          variant="primary"
          ?disabled=${!canSelectNextYear}
        >
          <sl-icon name="chevron-right"></sl-icon>
        </sl-button>
      </div>
      <ol class="months">
        ${this.months.map(month => {
          const parts = this.getMonthParts(month).join(' ');
          return html`
            <li>
              ${month.unselectable
                ? html`<span .part=${parts}>${month.long}</span>`
                : html`
                    <button
                      .part=${parts}
                      @click=${() => this.#onClick(month.value)}
                      ?autofocus=${currentMonth === month.value}
                      aria-pressed=${ifDefined(currentMonth === month.value ? 'true' : undefined)}
                    >
                      ${month.long}
                    </button>
                  `}
            </li>
          `;
        })}
      </ol>
    `;
  }

  /** Returns an array of part names for a day. */
  getMonthParts = (month: Month): string[] => {
    return [
      'month',
      month.value === new Date().getMonth() && this.month.getFullYear() === new Date().getFullYear() ? 'today' : '',
      month.unselectable ? 'unselectable' : '',
      this.month.getMonth() === month.value && this.month.getFullYear() === new Date().getFullYear() ? 'selected' : ''
    ].filter(part => part !== '');
  };

  #onClick(month: number): void {
    this.selectEvent.emit(new Date(this.month.getFullYear(), month));
  }

  #onToggleYearSelect(): void {
    this.toggleEvent.emit('year');
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();

      this.selectEvent.emit(this.month);
    }
  }

  #onNext(): void {
    this.month = new Date(this.month.getFullYear() + 1, this.month.getMonth(), this.month.getDate());
  }

  #onPrevious(): void {
    this.month = new Date(this.month.getFullYear() - 1, this.month.getMonth(), this.month.getDate());
  }
}
