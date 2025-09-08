import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, EventsController, RovingTabindexController, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './select-year.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select-year': SelectYear;
  }
}

@localized()
export class SelectYear extends ScopedElementsMixin(LitElement) {
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
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

  /** @internal Emits when the user selects a year. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<Date>>;

  /** The current year. */
  @property({ converter: dateConverter }) year = new Date();

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

  /** @internal The year you can select from. */
  @state() years: number[] = [];

  override connectedCallback(): void {
    super.connectedCallback();

    this.#setYears(this.year.getFullYear() - 5, this.year.getFullYear() + 6);
  }

  override render(): TemplateResult {
    return html`
      <div part="header">
        <span class="current-range">${this.years.at(0)} - ${this.years.at(-1)}</span>
        <sl-button
          @click=${this.#onPrevious}
          aria-label=${msg('Go back 12 years', { id: 'sl.calendar.previousYears' })}
          fill="ghost"
          variant="primary"
          ?disabled=${this.years && this.#isUnselectable((this.years.at(0) || 0) - 1)}
        >
          <sl-icon name="chevron-left"></sl-icon>
        </sl-button>
        <sl-button
          @click=${this.#onNext}
          aria-label=${msg('Go forward 12 years', { id: 'sl.calendar.nextYears' })}
          fill="ghost"
          variant="primary"
          ?disabled=${this.years && this.#isUnselectable((this.years.at(-1) || 0) + 1)}
        >
          <sl-icon name="chevron-right"></sl-icon>
        </sl-button>
      </div>
      <ol class="years">
        ${this.years.map(year => {
          const parts = this.getYearParts(year).join(' ');
          return html`
            <li>
              ${this.#isUnselectable(year)
                ? html`<span .part=${parts}>${year}</span>`
                : html`
                    <button
                      .part=${parts}
                      @click=${() => this.#onClick(year)}
                      ?autofocus=${this.year.getFullYear() === year}
                      aria-pressed=${ifDefined(this.year.getFullYear() === year ? 'true' : undefined)}
                    >
                      ${year}
                    </button>
                  `}
            </li>
          `;
        })}
      </ol>
    `;
  }

  getYearParts = (year: number): string[] => {
    return [
      'year',
      year === new Date().getFullYear() ? 'today' : '',
      this.year.getFullYear() === year ? 'selected' : '',
      this.#isUnselectable(year) ? 'unselectable' : ''
    ].filter(part => part !== '');
  };

  #isUnselectable(year: number): boolean {
    if (!year) {
      return true;
    }
    return !!((this.min && year < this.min.getFullYear()) || (this.max && year > this.max.getFullYear()));
  }

  #onClick(year: number): void {
    this.selectEvent.emit(new Date(year, 0));
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();

      this.selectEvent.emit(this.year);
    }
  }

  #onPrevious(): void {
    this.#setYears(this.years[0] - 12, this.years[0] - 1);
  }

  #onNext(): void {
    this.#setYears(this.years[this.years.length - 1] + 1, this.years[this.years.length - 1] + 12);
  }

  #setYears(start: number, end: number): void {
    this.years = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
