import { localized, msg, str } from '@lit/localize';
import {
  type ScopedElementsMap,
  ScopedElementsMixin
} from '@open-wc/scoped-elements/lit-element.js';
import { announce } from '@sl-design-system/announcer';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, NewFocusGroupController, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { type SlSelectEvent } from '@sl-design-system/shared/events.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  html
} from 'lit';
import { property, query, queryAll, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './select-year.css' with { type: 'css' };
import { isPeriodInRange } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-select-year': SelectYear;
  }
}

@localized()
export class SelectYear extends ScopedElementsMixin(LitElement) {
  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** Timeout id, to be used with `clearTimeout`. */
  #announceTimeoutId?: ReturnType<typeof setTimeout>;

  /** The focused year to restore after a responsive grid layout change. */
  #yearToFocus?: number;

  /**
   * Number of columns in the years grid. Used by keyboard navigation and the roving tabindex
   * controller to compute row/column movement and focus targets.
   */
  get #cols(): number {
    return this.numberOfMonths === 2 ? 5 : 3;
  }

  /** Focus management. */
  #focusGroupController = new NewFocusGroupController<HTMLButtonElement>(this, {
    autofocus: true,
    direction: 'grid',
    directionLength: this.#cols,
    elements: (): HTMLButtonElement[] => Array.from(this.buttons),
    isFocusableElement: (el: HTMLButtonElement) => !el.disabled,
    scope: (): HTMLTableElement => this.table,
    wrap: false
  });

  /** The buttons representing each year. */
  @queryAll('button') buttons!: NodeListOf<HTMLButtonElement>;

  /** The years grid table used as focus scope. */
  @query('table') table!: HTMLTableElement;

  /**
   * The maximum date selectable in the month.
   *
   * @default undefined
   */
  @property({ converter: dateConverter }) max?: Date;

  /**
   * The minimum date selectable in the month.
   *
   * @default undefined
   */
  @property({ converter: dateConverter }) min?: Date;

  /** The number of months represented by the calendar. Two months show 20 years in five columns. */
  @property({ type: Number, attribute: 'number-of-months' }) numberOfMonths: 1 | 2 = 1;

  /** The selected date range. Every overlapping year is highlighted. */
  @property({ attribute: false }) range?: Date[];

  /** The currently selected date. (In order to style current month) */
  @property({ converter: dateConverter }) selected?: Date;

  /** @internal Emits when the user selects a year. */
  @event({ name: 'sl-select' }) selectEvent!: EventEmitter<SlSelectEvent<Date>>;

  /**
   * Highlights the current year when set.
   *
   * @default false
   */
  @property({ type: Boolean, attribute: 'show-current' }) showCurrent?: boolean;

  /** The current year. */
  @property({ converter: dateConverter }) year = new Date();

  /** @internal The year you can select from. */
  @state() years: number[] = [];

  override disconnectedCallback(): void {
    if (this.#announceTimeoutId) {
      clearTimeout(this.#announceTimeoutId);
      this.#announceTimeoutId = undefined;
    }

    super.disconnectedCallback();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    const yearCount = this.#cols * 4;

    if (changes.has('year')) {
      const start = this.year.getFullYear() - 5;

      this.#setYears(start, start + yearCount - 1);
    } else if (changes.has('numberOfMonths')) {
      const focusedIndex = Array.from(this.buttons).findIndex(
          button => button === this.shadowRoot?.activeElement
        ),
        focusedYear = this.years[focusedIndex],
        browsedStart = this.years[0],
        start =
          focusedYear === undefined
            ? Math.max(browsedStart, (this.min?.getFullYear() ?? browsedStart) - yearCount + 1)
            : Math.max(browsedStart, focusedYear - yearCount + 1);

      this.#yearToFocus = focusedYear;
      this.#setYears(start, start + yearCount - 1);
    }

    if (changes.has('year') || changes.has('numberOfMonths')) {
      this.#focusGroupController.directionLength = this.#cols;
    }

    if (
      changes.has('max') ||
      changes.has('min') ||
      changes.has('years') ||
      changes.has('numberOfMonths')
    ) {
      this.#focusGroupController.clearElementCache();
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (this.#yearToFocus !== undefined) {
      const index = this.years.indexOf(this.#yearToFocus),
        button = this.buttons[index];

      this.#yearToFocus = undefined;
      if (button && !button.disabled) {
        this.#focusGroupController.focusToElement(index);
      }
    }
  }

  override render(): TemplateResult {
    const rows: number[][] = [];
    for (let i = 0; i < this.years.length; i += this.#cols) {
      rows.push(this.years.slice(i, i + this.#cols));
    }

    return html`
      <header>
        <span>${this.years.at(0)} - ${this.years.at(-1)}</span>

        <div class="arrows">
          <sl-button
            @click=${this.#onPrevious}
            ?disabled=${this.min && this.years.at(0)! < this.min.getFullYear()}
            aria-label=${msg(str`Go back ${this.years.length} years`, { id: 'sl.calendar.previousYears' })}
            fill="ghost"
            variant="secondary">
            <sl-icon name="chevron-left"></sl-icon>
          </sl-button>
          <sl-button
            @click=${this.#onNext}
            ?disabled=${this.max && this.years.at(-1)! > this.max.getFullYear()}
            aria-label=${msg(str`Go forward ${this.years.length} years`, { id: 'sl.calendar.nextYears' })}
            fill="ghost"
            variant="secondary">
            <sl-icon name="chevron-right"></sl-icon>
          </sl-button>
        </div>
      </header>

      <table
        aria-label=${msg(str`Years from ${this.years.at(0)!} to ${this.years.at(-1)!}`, {
          id: 'sl.calendar.yearsLabel'
        })}
        role="grid">
        <tbody>
          ${rows.map(
            (row, rowIndex) => html`
              <tr aria-rowindex=${rowIndex + 1} role="row">
                ${row.map((year, colIndex) => this.renderYear(year, rowIndex, colIndex))}
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  renderYear(year: number, rowIndex: number, colIndex: number): TemplateResult {
    const current = year === new Date().getFullYear(),
      disabled =
        (this.min && year < this.min.getFullYear()) || (this.max && year > this.max.getFullYear()),
      selected = this.range?.length
        ? isPeriodInRange(new Date(year, 0, 1), new Date(year + 1, 0, 1), this.range)
        : !!(this.selected && this.selected.getFullYear() === year);

    return html`
      <td aria-rowindex=${rowIndex + 1} aria-colindex=${colIndex + 1} role="gridcell">
        <button
          @click=${() => this.#onClick(year)}
          @keydown=${this.#onKeydown}
          ?disabled=${disabled}
          aria-current=${ifDefined(current ? 'date' : undefined)}
          aria-pressed=${selected.toString()}
          class=${classMap({ current, selected })}>
          <span>${year}</span>
        </button>
      </td>
    `;
  }

  #onClick(year: number): void {
    const date = new Date(year, 0, 1);

    this.selectEvent.emit(date);
    this.selected = date;
  }

  /**
   * For arrow keys, we need to detect if we're at a visual boundary (first/last button position)
   * and trying to navigate beyond it AND navigation is not blocked by min/max constraints. If we
   * can load a new range, do so. Otherwise, let the focus group controller handle it.
   */
  async #onKeydown(event: KeyboardEvent & { target: HTMLButtonElement }): Promise<void> {
    const buttons = Array.from(this.buttons);

    const currentIndex = buttons.indexOf(event.target);
    if (currentIndex === -1) {
      return;
    }

    const firstYear = this.years.at(0)!,
      lastYear = this.years.at(-1)!,
      canGoEarlier = !this.min || firstYear > this.min.getFullYear(),
      canGoLater = !this.max || lastYear < this.max.getFullYear();

    let shouldLoadNewRange = false;

    // Check if we're at a visual boundary position, trying to navigate beyond it,
    // and not blocked by min/max constraints
    if (event.key === 'ArrowLeft' && currentIndex === 0 && canGoEarlier) {
      shouldLoadNewRange = true;
      event.preventDefault();
      this.#onPrevious();
    } else if (event.key === 'ArrowRight' && currentIndex === buttons.length - 1 && canGoLater) {
      shouldLoadNewRange = true;
      event.preventDefault();
      this.#onNext();
    } else if (event.key === 'ArrowUp' && currentIndex < this.#cols && canGoEarlier) {
      shouldLoadNewRange = true;
      event.preventDefault();
      this.#onPrevious();
    } else if (
      event.key === 'ArrowDown' &&
      currentIndex >= buttons.length - this.#cols &&
      canGoLater
    ) {
      shouldLoadNewRange = true;
      event.preventDefault();
      this.#onNext();
    }

    if (shouldLoadNewRange) {
      await this.updateComplete;

      this.#focusAfterRangeChange(event.key, currentIndex);
    }

    // Otherwise, let the event bubble to the focus group controller
  }

  #onNext(): void {
    this.#setYears(this.years.at(-1)! + 1, this.years.at(-1)! + this.years.length);
    this.#announce(this.years);
  }

  #onPrevious(): void {
    this.#setYears(this.years.at(0)! - this.years.length, this.years.at(0)! - 1);
    this.#announce(this.years);
  }

  #setYears(start: number, end: number): void {
    this.years = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  /** Moves focus to the right year button after loading a new year range. */
  #focusAfterRangeChange(key: string, currentIndex: number): void {
    const buttons = Array.from(this.buttons),
      preferredIndices = this.#getPreferredBoundaryIndices(key, currentIndex, buttons.length),
      targetIndex = preferredIndices.find(index => {
        const button = buttons[index];

        return !!button && !button.disabled;
      });

    if (targetIndex !== undefined) {
      this.#focusGroupController.focusToElement(targetIndex);
    }
  }

  /** Returns preferred button indexes to focus after crossing a grid edge. */
  #getPreferredBoundaryIndices(key: string, currentIndex: number, length: number): number[] {
    const column = currentIndex % this.#cols,
      preferredIndices =
        key === 'ArrowUp' ? [length - this.#cols + column] : key === 'ArrowDown' ? [column] : [];

    // If that button cannot be focused, keep moving in the pressed direction.
    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      for (let i = length - 1; i >= 0; i -= 1) {
        preferredIndices.push(i);
      }
    } else {
      for (let i = 0; i < length; i += 1) {
        preferredIndices.push(i);
      }
    }

    return preferredIndices;
  }

  // Announce if needed, we don't want to have the same message announced twice
  #announce(yearsRange: number[]): void {
    // Clear any pending announcement
    if (this.#announceTimeoutId) {
      clearTimeout(this.#announceTimeoutId);
    }

    // Set a short timeout to debounce multiple calls
    this.#announceTimeoutId = setTimeout(() => {
      announce(
        msg(str`Years between ${yearsRange.at(0) ?? ''} and ${yearsRange.at(-1) ?? ''}`, {
          id: 'sl.calendar.announceYears'
        }),
        'polite'
      );

      this.#announceTimeoutId = undefined;
    }, 50);
  }
}
