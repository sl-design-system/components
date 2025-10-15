import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, EventsController, RovingTabindexController, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators.js';
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
  #events = new EventsController(this, { keydown: this.#onSelectYearKeydown });

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

  /**
   * Number of columns in the years grid.
   * Used by keyboard navigation and the roving tabindex controller to compute
   * row/column movement and focus targets.
   */
  #cols = 3;

  #rovingTabindexController?: RovingTabindexController<HTMLButtonElement>;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#setYears(this.year.getFullYear() - 5, this.year.getFullYear() + 6);
  }

  override firstUpdated(): void {
    this.#rovingTabindexController = new RovingTabindexController<HTMLButtonElement>(this, {
      direction: 'grid',
      directionLength: this.#cols,
      elements: () => this.#getYearButtons() ?? [],
      focusInIndex: elements => {
        const index = elements.findIndex(el => el.hasAttribute('aria-selected'));

        return index === -1 ? 0 : index;
      },
      listenerScope: (): HTMLElement => this.renderRoot.querySelector('ol.years')!
    });

    this.#rovingTabindexController?.focus();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    if (changes.has('max') || changes.has('min') || changes.has('years') || changes.has('inert')) {
      this.#rovingTabindexController?.clearElementCache();
    }
  }

  override render(): TemplateResult {
    return html`
      <div part="header">
        <span class="current-range">${this.years.at(0)} - ${this.years.at(-1)}</span>
        <div class="arrows">
          <sl-button
            @click=${this.#onPrevious}
            @keydown=${this.#onHeaderArrowKeydown}
            aria-label=${msg('Go back 12 years', { id: 'sl.calendar.previousYears' })}
            fill="ghost"
            variant="secondary"
            ?disabled=${this.#isUnselectable((this.years.at(0) || 0) - 1)}
          >
            <sl-icon name="chevron-left"></sl-icon>
          </sl-button>
          <sl-button
            @click=${this.#onNext}
            @keydown=${this.#onHeaderArrowKeydown}
            aria-label=${msg('Go forward 12 years', { id: 'sl.calendar.nextYears' })}
            fill="ghost"
            variant="secondary"
            ?disabled=${this.#isUnselectable((this.years.at(-1) || 0) + 1)}
          >
            <sl-icon name="chevron-right"></sl-icon>
          </sl-button>
        </div>
      </div>
      <ol class="years" role="grid" @keydown=${this.#onKeydown}>
        ${this.years.map(year => {
          const disabled = this.#isUnselectable(year);
          const selected = !!(this.selected && this.selected.getFullYear() === year);
          return html`
            <li role="row">
              <button
                role="gridcell"
                @click=${() => !disabled && this.#onClick(year)}
                part=${this.getYearParts(year).join(' ')}
                ?disabled=${disabled}
                aria-selected=${selected ? 'true' : 'false'}
                data-year=${year}
              >
                ${year}
              </button>
            </li>
          `;
        })}
      </ol>
    `;
  }

  getYearParts(year: number): string[] {
    return [
      'year',
      year === new Date().getFullYear() ? 'today' : '',
      this.selected && this.selected.getFullYear() === year ? 'selected' : '',
      this.#isUnselectable(year) ? 'unselectable' : ''
    ].filter(Boolean);
  }

  #onClick(year: number): void {
    this.selectEvent.emit(new Date(year, 0));
    this.selected = new Date(year, 0);
  }

  #onHeaderArrowKeydown(event: KeyboardEvent): void {
    // Prevent arrow keys on header buttons from being handled by the roving controller.
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.stopPropagation();
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    console.log('SelectYear onKeydown...', event.key);

    const canGoPrevious = !this.#isUnselectable(this.years[0] - 1),
      canGoNext = !this.#isUnselectable(this.years[this.years.length - 1] + 1),
      buttons = this.#getYearButtons(),
      activeElement = this.shadowRoot?.activeElement as HTMLButtonElement | null,
      index = activeElement ? buttons.indexOf(activeElement) : -1;

    if (event.key === 'ArrowLeft' && canGoPrevious) {
      if (index === 0) {
        event.preventDefault();
        event.stopPropagation();

        this.#onPrevious();
        void this.updateComplete.then(() => {
          this.#rovingTabindexController?.clearElementCache();

          const newButtons = this.#getYearButtons();

          this.#rovingTabindexController?.focusToElement(newButtons[newButtons.length - 1]);
        });
      }
    } else if (event.key === 'ArrowRight' && canGoNext) {
      if (index === buttons.length - 1) {
        event.preventDefault();
        event.stopPropagation();

        this.#onNext();
        void this.updateComplete.then(() => {
          this.#rovingTabindexController?.clearElementCache();

          const first = this.#getYearButtons()[0];

          if (first) {
            this.#rovingTabindexController?.focusToElement(first);
          }
        });
      }
    } else if (event.key === 'ArrowUp' && canGoPrevious) {
      // When on first row (any of the first 3 buttons), jump to previous range
      // and focus the button in the last row, same column.
      if (index > -1 && index < this.#cols) {
        event.preventDefault();
        event.stopPropagation();

        const col = index % this.#cols;

        this.#onPrevious();

        void this.updateComplete.then(() => {
          this.#rovingTabindexController?.clearElementCache();

          const newButtons = this.#getYearButtons();
          const total = newButtons.length;

          if (!total) {
            return;
          }

          // Start index of last (possibly partial) row
          const lastRowStart = total - (total % this.#cols === 0 ? this.#cols : total % this.#cols);
          const targetIndex = Math.min(lastRowStart + col, total - 1);

          const target = newButtons[targetIndex];
          if (target) {
            this.#rovingTabindexController?.focusToElement(target);
          }
        });
      }
    } else if (event.key === 'ArrowDown' && canGoNext) {
      // console.log('down on last day of month');
      if (index > -1) {
        const total = buttons.length;
        const lastRowStart = total - (total % this.#cols === 0 ? this.#cols : total % this.#cols);
        // If on any button in the last row, move to next range keeping column
        if (index >= lastRowStart) {
          event.preventDefault();
          event.stopPropagation();

          const col = index % this.#cols;

          this.#onNext();

          void this.updateComplete.then(() => {
            this.#rovingTabindexController?.clearElementCache();

            const newButtons = this.#getYearButtons();

            if (!newButtons.length) {
              return;
            }

            let target = newButtons[col];
            if (!target) {
              // Last button if fewer buttons than expected
              target = newButtons[newButtons.length - 1];
            }
            if (target) {
              this.#rovingTabindexController?.focusToElement(target);
            }
          });
        }
      }
    }
  }

  #onSelectYearKeydown(event: KeyboardEvent): void {
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

  #getYearButtons(): HTMLButtonElement[] {
    return Array.from(this.renderRoot.querySelectorAll<HTMLButtonElement>('ol.years button[part~="year"]'));
  }

  #setYears(start: number, end: number): void {
    this.years = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  #isUnselectable(year: number): boolean {
    return !!((this.min && year < this.min.getFullYear()) || (this.max && year > this.max.getFullYear()));
  }
}
