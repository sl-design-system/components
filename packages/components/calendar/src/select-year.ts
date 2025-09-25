import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, EventsController, RovingTabindexController, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
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

  // #focusLastOnRender = false;

  #rovingTabindexController = new RovingTabindexController(this, {
    direction: 'grid',
    directionLength: 3,
    elements: (): HTMLElement[] => Array.from(this.renderRoot.querySelectorAll('ol button')),
    focusInIndex: elements => {
      const index = elements.findIndex(el => el.hasAttribute('aria-pressed'));

      return index === -1 ? 0 : index;

      // const pressedIndex = elements.findIndex(el => el.hasAttribute('aria-pressed'));
      // if (pressedIndex !== -1) {
      //   return pressedIndex;
      // }
      // // console.log('focusing last element', this.#focusLastOnRender);
      // if (this.#focusLastOnRender) {
      //  // console.log('focusing last element', this.#focusLastOnRender);
      //   return elements.length - 1;
      // }
      // return 0;
    },
    listenerScope: (): HTMLElement => this.renderRoot.querySelector('ol')!
  });

  /** @internal Emits when the user selects a year. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<Date>>;

  /** The current year. */
  @property({ converter: dateConverter }) year = new Date();

  /** The currently selected date. (In order to style current month) */
  @property({ converter: dateConverter }) selected?: Date;

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

  override willUpdate(changes: PropertyValues<this>): void {
    console.log('SelectYear willUpdate changes', changes);

    if (changes.has('years') || changes.has('inert')) {
      this.#rovingTabindexController.clearElementCache();
      // this.#rovingTabindexController.focusToElement(this.selected);
    }
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
      this.selected && this.selected.getFullYear() === year ? 'selected' : '',
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
    if (event.key === 'ArrowLeft' /*&& year.currentMonth && day.date.getDate() === 1*/) {
      // this.#onPrevious();

      const buttons = Array.from(this.renderRoot.querySelectorAll('ol button'));
      const activeEl = this.shadowRoot?.activeElement as HTMLButtonElement | null;
      const index = activeEl ? buttons.indexOf(activeEl) : -1;
      if (index === 0) {
        console.log('left on first year of range');
        event.preventDefault();
        event.stopPropagation();
        // this.#onPrevious();

        const start = this.years[0] - 12;
        const end = this.years[0] - 1;
        this.#setYears(start, end);
        // void this.updateComplete.then(() => {
        //   const buttons = this.renderRoot.querySelectorAll('ol button');
        //   (buttons[buttons.length - 1] as HTMLButtonElement | undefined)?.focus();
        // });
        void this.updateComplete.then(() => {
          // this.#rovingTabindexController.clearElementCache();
          // this.#focusLastOnRender = true;
          // (buttons[buttons.length - 1] as HTMLButtonElement | undefined)?.focus();
          // this.#rovingTabindexController.clearElementCache();
          this.#rovingTabindexController.focusToElement(buttons[buttons.length - 1] as HTMLButtonElement);
        });
        // this.#rovingTabindexController.clearElementCache();
      }
    } else if (event.key === 'ArrowRight' /*&& day.currentMonth && day.lastDayOfMonth*/) {
      const buttons = Array.from(this.renderRoot.querySelectorAll('ol button'));
      const activeEl = this.shadowRoot?.activeElement as HTMLButtonElement | null;
      const index = activeEl ? buttons.indexOf(activeEl) : -1;
      if (index === buttons.length - 1) {
        event.preventDefault();
        event.stopPropagation();

        this.#onNext();
        void this.updateComplete.then(() => {
          // this.#rovingTabindexController.clearElementCache();
          const first = this.renderRoot.querySelector('ol button') as HTMLButtonElement;
          if (first) {
            this.#rovingTabindexController.focusToElement(first);
          }
        }); // TODO: should work as well when we have limited years with min and max...
      }
    } else if (event.key === 'ArrowUp' /*&& day.date.getDate() === 1*/) {
      // event.preventDefault();
      // event.stopPropagation();
      //
      // this.changeEvent.emit(new Date(day.date.getFullYear(), day.date.getMonth(), 0));

      const buttons = Array.from(this.renderRoot.querySelectorAll('ol button'));
      const activeEl = this.shadowRoot?.activeElement as HTMLButtonElement | null;
      const index = activeEl ? buttons.indexOf(activeEl) : -1;
      if (index === 0) {
        event.preventDefault();
        event.stopPropagation();
        this.#onPrevious();
      }
    } else if (event.key === 'ArrowDown' /* && day.currentMonth*/ /*&& day.lastDayOfMonth*/) {
      console.log('down on last day of month');

      const buttons = Array.from(this.renderRoot.querySelectorAll('ol button'));
      const activeEl = this.shadowRoot?.activeElement as HTMLButtonElement | null;
      const index = activeEl ? buttons.indexOf(activeEl) : -1;
      if (index === buttons.length - 1) {
        event.preventDefault();
        event.stopPropagation();
        this.#onNext();
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();

      this.selectEvent.emit(this.year);
    }
  }

  #onPrevious(): void {
    this.#setYears(this.years[0] - 12, this.years[0] - 1);

    // this.#focusLastOnRender = true;
    // this.#setYears(this.years[0] - 12, this.years[0] - 1);
    // void this.updateComplete.then(() => {
    //   this.#focusLastOnRender = false;
    // });
  }

  #onNext(): void {
    this.#setYears(this.years[this.years.length - 1] + 1, this.years[this.years.length - 1] + 12);
  }

  #setYears(start: number, end: number): void {
    this.years = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
