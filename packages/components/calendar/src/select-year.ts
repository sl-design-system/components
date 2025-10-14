import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, RovingTabindexController, event } from '@sl-design-system/shared';
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

  // #events = new EventsController(this, { keydown: this.#onKeydown });

  // #focusLastOnRender = false;

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

  #cols = 3;

  #lastTabstopYear?: number;

  #rovingTabindexController?: RovingTabindexController<HTMLButtonElement>;

  override connectedCallback(): void {
    super.connectedCallback();

    this.#setYears(this.year.getFullYear() - 5, this.year.getFullYear() + 6);
    this.addEventListener('focusout', this.#onFocusOut);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener('focusout', this.#onFocusOut);
  }

  override firstUpdated(): void {
    // this.#initRoving();
    this.#rovingTabindexController = new RovingTabindexController<HTMLButtonElement>(this, {
      direction: 'grid',
      directionLength: this.#cols,
      elements: () => this.#getYearButtons(),
      focusInIndex: els => {
        if (!els.length) return -1;
        const sel = els.findIndex(el => el.getAttribute('aria-selected') === 'true');
        if (sel > -1) return sel;
        const zero = els.findIndex(el => el.tabIndex === 0);
        return zero > -1 ? zero : 0;
      }
    });

    this.#rovingTabindexController.hostConnected();
    this.#enforceSingleTabstop();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    console.log('SelectYear willUpdate changes', changes);

    if (changes.has('selected')) {
      this.#lastTabstopYear = this.selected?.getFullYear();
    }
  }

  override updated(changes: PropertyValues<this>): void {
    if (changes.has('years') || changes.has('selected') || changes.has('min') || changes.has('max')) {
      this.#refreshRoving();
    }
  }

  override focus(options?: FocusOptions): void {
    const current = this.renderRoot.querySelector<HTMLButtonElement>('ol button[tabindex="0"]');
    if (current) current.focus(options);
    else {
      this.#enforceSingleTabstop();
      this.renderRoot.querySelector<HTMLButtonElement>('ol button[tabindex="0"]')?.focus(options);
    }
  }

  override render(): TemplateResult {
    return html`
      <div part="header">
        <span class="current-range">${this.years.at(0)} - ${this.years.at(-1)}</span>
        <div class="arrows">
          <sl-button
            @click=${this.#onPrevious}
            aria-label=${msg('Go back 12 years', { id: 'sl.calendar.previousYears' })}
            fill="ghost"
            variant="secondary"
            ?disabled=${this.#isUnselectable((this.years.at(0) || 0) - 1)}
          >
            <sl-icon name="chevron-left"></sl-icon>
          </sl-button>
          <sl-button
            @click=${this.#onNext}
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

  // #initRoving(): void {
  //   this.#rovingTabindexController = new RovingTabindexController<HTMLButtonElement>(this, {
  //     direction: 'grid',
  //     directionLength: this.#cols,
  //     elements: () => this.#getYearButtons(),
  //     focusInIndex: els => {
  //       if (!els.length) return -1;
  //       const sel = els.findIndex(el => el.getAttribute('aria-selected') === 'true');
  //       if (sel > -1) return sel;
  //       const zero = els.findIndex(el => el.tabIndex === 0);
  //       return zero > -1 ? zero : 0;
  //     }
  //   });
  // }

  #refreshRoving(): void {
    this.#rovingTabindexController?.clearElementCache();
    this.#rovingTabindexController?.hostUpdated();
    // Re-assert the single tab stop (controller may have cleared it).
    // this.#enforceSingleTabstop();
    // queueMicrotask(() => this.#enforceSingleTabstop());

    requestAnimationFrame(() => this.#enforceSingleTabstop());
  }

  #onClick(year: number): void {
    this.selectEvent.emit(new Date(year, 0));
    this.selected = new Date(year, 0);
    const btn = this.#findButtonByYear(year);
    if (btn) {
      this.#rovingTabindexController?.focusToElement(btn);
      this.#setActiveButton(btn, false); // roving already focused
    }
  }

  #onKeydown = (e: KeyboardEvent): void => {
    const target = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-year]');
    if (!target) return;

    const isArrow = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key);
    if (isArrow) {
      e.preventDefault();
      e.stopPropagation();
    }

    const buttons = this.#getEnabledYearButtons();
    const index = buttons.indexOf(target);
    if (index === -1) return;

    // const cols = this.#cols;
    const canPrevRange = !this.#isUnselectable(this.years[0] - 1);
    const canNextRange = !this.#isUnselectable(this.years[this.years.length - 1] + 1);
    const lastRowStart =
      buttons.length - (buttons.length % this.#cols === 0 ? this.#cols : buttons.length % this.#cols);

    const move = (btn: HTMLButtonElement) => {
      this.#rovingTabindexController?.focusToElement(btn);
      this.#setActiveButton(btn, false);
    };

    switch (e.key) {
      case 'ArrowLeft':
        if (index > 0) move(buttons[index - 1]);
        else if (canPrevRange) this.#shiftRange(-1, false, () => this.#focusLast());
        break;
      case 'ArrowRight':
        if (index < buttons.length - 1) move(buttons[index + 1]);
        else if (canNextRange) this.#shiftRange(1, false, () => this.#focusFirst());
        break;
      case 'ArrowUp': {
        const t = index - this.#cols;
        if (t >= 0) move(buttons[t]);
        else if (canPrevRange) {
          const col = index % this.#cols;
          this.#shiftRange(-1, false, () => this.#focusColumnFromBottom(col));
        }
        break;
      }
      case 'ArrowDown': {
        const t = index + this.#cols;
        if (t < buttons.length) move(buttons[t]);
        else if (index >= lastRowStart && canNextRange) {
          const col = index % this.#cols;
          this.#shiftRange(1, false, () => this.#focusColumnFromTop(col));
        }
        break;
      }
      case 'Home':
        e.preventDefault();
        this.#focusFirst();
        break;
      case 'End':
        e.preventDefault();
        this.#focusLast();
        break;
      case 'Escape':
        e.preventDefault();
        this.selectEvent.emit(this.year);
        break;
    }
  };

  // header = true when triggered by arrow buttons (keep focus on arrow).
  #shiftRange(direction: -1 | 1, header: boolean, after: () => void): void {
    const first = this.years[0];
    const last = this.years[this.years.length - 1];
    if (direction === -1) this.#setYears(first - 12, first - 1);
    else this.#setYears(last + 1, last + 12);

    const activeBefore = (this.getRootNode() as Document | ShadowRoot).activeElement as HTMLElement | null;

    void this.updateComplete.then(() => {
      this.#refreshRoving();
      if (header) {
        // Reapply a single tab stop without moving focus into the grid.
        const candidate = this.#choosePreferredYearButton();
        if (candidate) {
          this.#setActiveButton(candidate, false);
          queueMicrotask(() => this.#setActiveButton(candidate, false));
        }
        // Restore focus to the original arrow (avoid flicker).
        if (activeBefore && activeBefore.isConnected) activeBefore.focus();
      } else {
        after();
      }
    });
  }

  #onPrevious(): void {
    this.#shiftRange(-1, true, () => {});
  }

  #onNext(): void {
    this.#shiftRange(1, true, () => {});
  }

  #focusFirst(): void {
    const btn = this.#getEnabledYearButtons()[0];
    if (btn) {
      this.#rovingTabindexController?.focusToElement(btn);
      this.#setActiveButton(btn, false);
    }
  }

  #focusLast(): void {
    const btns = this.#getEnabledYearButtons();
    const btn = btns[btns.length - 1];
    if (btn) {
      this.#rovingTabindexController?.focusToElement(btn);
      this.#setActiveButton(btn, false);
    }
  }

  #focusColumnFromBottom(col: number): void {
    const btns = this.#getEnabledYearButtons();
    if (!btns.length) return;
    const total = btns.length;
    const lastRowStart = total - (total % this.#cols === 0 ? this.#cols : total % this.#cols);
    const target = btns[Math.min(lastRowStart + col, total - 1)];
    if (target) {
      this.#rovingTabindexController?.focusToElement(target);
      this.#setActiveButton(target, false);
    }
  }

  #focusColumnFromTop(col: number): void {
    const btns = this.#getEnabledYearButtons();
    if (!btns.length) return;
    const target = btns[col] ?? btns[btns.length - 1];
    if (target) {
      this.#rovingTabindexController?.focusToElement(target);
      this.#setActiveButton(target, false);
    }
  }

  #setActiveButton(btn: HTMLButtonElement, focus: boolean): void {
    this.#getYearButtons().forEach(b => (b.tabIndex = -1));
    btn.tabIndex = 0;
    this.#lastTabstopYear = Number(btn.dataset.year);
    if (focus) btn.focus();
  }

  #choosePreferredYearButton(): HTMLButtonElement | undefined {
    return (
      (this.#lastTabstopYear && this.#findButtonByYear(this.#lastTabstopYear)) ||
      (this.selected && this.#findButtonByYear(this.selected.getFullYear())) ||
      this.#getEnabledYearButtons()[0]
    );
  }

  #enforceSingleTabstop(): void {
    const candidate = this.#choosePreferredYearButton();
    if (!candidate) return;
    this.#getYearButtons().forEach(b => (b.tabIndex = -1));
    candidate.tabIndex = 0;
  }

  #findButtonByYear(year: number): HTMLButtonElement | undefined {
    return this.renderRoot.querySelector<HTMLButtonElement>(`button[data-year="${year}"]`) || undefined;
  }

  #onFocusOut = (): void => {
    queueMicrotask(() => {
      const active = (this.getRootNode() as Document | ShadowRoot).activeElement;
      if (!this.contains(active)) this.#enforceSingleTabstop();
    });
  };

  #getYearButtons(): HTMLButtonElement[] {
    return Array.from(this.renderRoot.querySelectorAll<HTMLButtonElement>('ol button[data-year]'));
  }

  #getEnabledYearButtons(): HTMLButtonElement[] {
    return this.#getYearButtons().filter(b => !b.disabled);
  }

  #setYears(start: number, end: number): void {
    this.years = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  #isUnselectable(year: number): boolean {
    return !!((this.min && year < this.min.getFullYear()) || (this.max && year > this.max.getFullYear()));
  }
}
