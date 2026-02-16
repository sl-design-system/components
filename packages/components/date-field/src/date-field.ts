import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Calendar } from '@sl-design-system/calendar';
import { FormControlMixin, type SlFormControlEvent, type SlUpdateStateEvent } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, LocaleMixin, anchor, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { isSameDate } from '@sl-design-system/shared/date.js';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { FieldButton, TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './date-field.scss.js';
import { type DateFormatPart, getDateFormat, getDateTemplate, getDateUnitLetter } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-date-field': DateField;
  }
}

/**
 * A form component that allows the user to pick a date from a calendar.
 */
@localized()
export class DateField extends LocaleMixin(FormControlMixin(ScopedElementsMixin(LitElement))) {
  /** @internal The default offset of the popover to the text-field. */
  static offset = 6;

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-calendar': Calendar,
      'sl-field-button': FieldButton,
      'sl-icon': Icon,
      'sl-text-field': TextField
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal The default margin between the popover and the viewport. */
  static viewportMargin = 8;

  /**
   * Stores the individual date parts when the user is editing.
   * These are stored separately from `value` to support partial dates.
   */
  #dateParts: { day?: number; month?: number; year?: number } = {};

  /** Tracks the type of the currently selected/editing part. */
  #editingPartType?: string;

  /** Tracks how many digits have been entered for the current part. */
  #enteredDigits = 0;

  /** Formatter for displaying the value in the input. */
  #formatter?: Intl.DateTimeFormat;

  /**
   * Flag indicating whether the popover was just closed. We need to know this so we can
   * properly handle button clicks that close the popover. If the popover was just closed,
   * we don't want to show it again when the button click event fires.
   */
  #popoverJustClosed = false;

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /**
   * The calendar element. This will return an instance of the calendar
   * when the popover is shown or always when the calendar is slotted. Otherwise
   * it will return undefined. This is meant to be used for the extra controls
   * that are slotted into the popover, so they can interact with the calendar
   * (e.g., "Today" or "Clear" buttons). Do NOT use this to customize the
   * calendar itself. Use the calendar slot for that.
   */
  get calendar(): Calendar | null {
    return this.querySelector('sl-calendar[slot="calendar"]') ?? this.renderRoot.querySelector('sl-calendar');
  }

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<Date | undefined>>;

  /** @internal The dialog element that is also the popover. */
  @query('dialog') dialog?: HTMLDialogElement;

  /** @internal Whether the dialog is visible. */
  @state() dialogVisible?: boolean;

  /** Whether the date field is disabled; when set no interaction is possible. */
  @property({ type: Boolean }) override disabled?: boolean;

  /**
   * The first day of the week; 0 for Sunday, 1 for Monday.
   * @default 1
   */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek?: number;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** @internal The input element in the light DOM. */
  input!: HTMLInputElement;

  /**
   * The maximum date selectable in the calendar.
   * @default undefined
   */
  @property({ converter: dateConverter }) max?: Date;

  /**
   * The minimum date selectable in the calendar.
   * @default undefined
   */
  @property({ converter: dateConverter }) min?: Date;

  /** The current month to display. */
  @property({ converter: dateConverter }) month?: Date;

  /**
   * The placeholder for the date field.
   * @default undefined
   */
  @property() placeholder?: string;

  /**
   * Whether the date field is readonly.
   * @default false
   */
  @property({ type: Boolean }) readonly?: boolean;

  /**
   * When set, a "Confirm" button will be shown in the popover, and the user will
   * need to click it to confirm their date selection. This is useful when you want
   * to allow the user to make multiple changes in the calendar before confirming,
   * or if you want to provide extra controls in the popover (e.g., "Today" or "Clear"
   * buttons).
   */
  @property({ type: Boolean, attribute: 'require-confirmation' }) requireConfirmation?: boolean;

  /**
   * Whether the date field is a required field.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /**
   * Whether the component is select only. This means you cannot type in the text field,
   * but you can still pick a date via the popover.
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'select-only' }) selectOnly?: boolean;

  /**
   * Shows the week numbers.
   * @default false
   */
  @property({ type: Boolean, attribute: 'show-week-numbers' }) showWeekNumbers?: boolean;

  /** @internal The text field. */
  @query('sl-text-field') textField!: TextField;

  /** The selected date in the calendar. */
  @property({ converter: dateConverter }) override value?: Date;

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.input) {
      this.input = this.querySelector<HTMLInputElement>('input[slot="input"]') || document.createElement('input');
      this.input.ariaExpanded = 'false';
      this.input.autocomplete = 'off';
      this.input.slot = 'input';
      this.input.addEventListener('blur', () => this.#onInputBlur());
      this.input.addEventListener('click', () => this.#onInputClick());
      this.input.addEventListener('focus', () => this.#onInputFocus());
      this.input.addEventListener('input', () => this.#onInputInput());
      this.input.addEventListener('keydown', (event: KeyboardEvent) => this.#onInputKeydown(event));

      if (!this.input.parentElement) {
        this.append(this.input);
      }
    }

    this.setFormControlElement(this.input);

    // This is a workaround, because :has is not working in Safari and Firefox with :host element as it works in Chrome
    const style = document.createElement('style');
    style.innerHTML = `
      sl-date-field:has(input:hover):not(:focus-within)::part(text-field) {
        --_bg-opacity: var(--sl-opacity-interactive-plain-hover);
      }
    `;
    this.prepend(style);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('locale')) {
      // Always use 2 digits for day and month and 4 digits for year to prevent
      // shifting when the user types in the input. This matches the behavior in getDateFormat.
      this.#formatter = new Intl.DateTimeFormat(this.locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    if (changes.has('required')) {
      if (this.textField) {
        this.textField.required = !!this.required;
      }
    }

    if (changes.has('showValid') || changes.has('showValidity')) {
      if (this.textField) {
        this.textField.showValid = this.showValid;
      }
    }

    if (changes.has('locale') || changes.has('value')) {
      if (this.value) {
        // Sync date parts from value
        this.#dateParts = {
          day: this.value.getDate(),
          month: this.value.getMonth() + 1,
          year: this.value.getFullYear()
        };

        this.input.value = this.#formatter ? this.#formatter.format(this.value) : '';
      } else {
        this.input.value = '';
        this.#dateParts = {};
        this.#editingPartType = undefined;
        this.#enteredDigits = 0;
      }
    }

    if (changes.has('value')) {
      // If the calendar is slotted, we need to keep the value in sync
      if (this.calendar && !isSameDate(this.value, this.calendar?.selected)) {
        this.calendar.selected = this.value;
      }
    }

    if (changes.has('min') || changes.has('max') || changes.has('required') || changes.has('value')) {
      this.updateValidity();
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-text-field
        @sl-blur=${this.#onTextFieldBlur}
        @sl-change=${this.#onTextFieldChange}
        @sl-focus=${this.#onTextFieldFocus}
        @sl-form-control=${this.#onTextFieldFormControl}
        @sl-update-state=${this.#onTextFieldUpdateState}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly || this.selectOnly}
        ?required=${this.required}
        part="text-field"
        placeholder=${ifDefined(this.placeholder)}
        show-validity=${ifDefined(this.showValidity)}
      >
        <slot name="input" slot="input"></slot>
        <sl-field-button
          @click=${this.#onButtonClick}
          ?disabled=${this.disabled || this.readonly}
          aria-controls="dialog"
          aria-label=${msg('Toggle calendar', { id: 'sl.dateField.toggleCalendar' })}
          slot="suffix"
          tabindex=${this.disabled || this.readonly ? '-1' : '0'}
        >
          <sl-icon name="calendar"></sl-icon>
        </sl-field-button>
      </sl-text-field>

      <dialog
        ${anchor({
          element: this,
          offset: DateField.offset,
          position: 'bottom-start',
          viewportMargin: DateField.viewportMargin
        })}
        @beforetoggle=${this.#onBeforeToggle}
        @toggle=${this.#onToggle}
        @keydown=${this.#onKeydown}
        id="dialog"
        popover
      >
        ${this.dialogVisible
          ? html`
              <slot @slotchange=${this.#onSlotChange} @sl-change=${this.#onChange} name="calendar">
                <sl-calendar
                  .selected=${this.value}
                  ?show-week-numbers=${this.showWeekNumbers}
                  first-day-of-week=${ifDefined(this.firstDayOfWeek)}
                  locale=${ifDefined(this.locale)}
                  max=${ifDefined(this.max?.toISOString())}
                  min=${ifDefined(this.min?.toISOString())}
                  month=${ifDefined(this.month?.toISOString())}
                  show-today
                ></sl-calendar>
              </slot>
              <sl-button-bar>
                <slot></slot>
                ${this.requireConfirmation
                  ? html`
                      <sl-button @click=${this.#onConfirm} variant="primary">
                        ${msg('Confirm', { id: 'sl.dateField.confirm' })}
                        <sl-icon name="check"></sl-icon>
                      </sl-button>
                    `
                  : nothing}
              </sl-button-bar>
            `
          : nothing}
      </dialog>
    `;
  }

  /** @internal */
  override updateInternalValidity(): void {
    const hasPartialDate = this.#hasPartialDate(),
      hasCompleteDate =
        this.#dateParts.day !== undefined && this.#dateParts.month !== undefined && this.#dateParts.year !== undefined;

    if (hasCompleteDate && !this.value) {
      // User entered all parts but the date is invalid (e.g., Feb 30)
      this.setCustomValidity(msg('Please enter a valid date.', { id: 'sl.dateField.typeMismatch' }));
    } else if (hasPartialDate && !this.value) {
      // User entered some parts but not all
      this.setCustomValidity(msg('Please enter a complete date.', { id: 'sl.dateField.incomplete' }));
    } else if (this.required && !this.value) {
      this.setCustomValidity(msg('Please enter a date.', { id: 'sl.dateField.valueMissing' }));
    } else if (this.value && this.min && this.value < this.min) {
      const formattedMin = this.#formatter?.format(this.min) ?? this.min.toLocaleDateString();

      this.setCustomValidity(
        msg(str`Please select a date that is no earlier than ${formattedMin}.`, {
          id: 'sl.dateField.rangeUnderflow'
        })
      );
    } else if (this.value && this.max && this.value > this.max) {
      const formattedMax = this.#formatter?.format(this.max) ?? this.max.toLocaleDateString();

      this.setCustomValidity(
        msg(str`Please select a date that is no later than ${formattedMax}.`, {
          id: 'sl.dateField.rangeOverflow'
        })
      );
    } else {
      this.setCustomValidity('');
    }
  }

  /** Show the date picker. */
  showPicker(): void {
    this.dialog?.showPopover();
  }

  /** Hide the date picker. */
  hidePicker(): void {
    this.dialog?.hidePopover();
  }

  #onBeforeToggle(event: ToggleEvent): void {
    if (event.newState === 'open') {
      this.dialogVisible = true;
      this.input.setAttribute('aria-expanded', 'true');
    } else {
      this.input.setAttribute('aria-expanded', 'false');
      this.#popoverJustClosed = true;
    }
  }

  #onButtonClick(): void {
    // Prevents the popover from reopening immediately after it was just closed
    if (!this.#popoverJustClosed) {
      this.dialog?.togglePopover();
    }
  }

  #onChange(event: SlChangeEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.requireConfirmation) {
      // If requireConfirmation is set, we wait to update the value until the user clicks the confirm button
      return;
    }

    this.#setValueAndCloseDialog(event.detail);
  }

  #onConfirm(): void {
    this.#setValueAndCloseDialog(this.calendar?.selected);
  }

  #onInputBlur(): void {
    if (this.value) {
      return;
    }

    if (this.#hasPartialDate()) {
      this.#updateInputDisplay();
    } else {
      this.input.value = '';
    }
  }

  #onInputClick(): void {
    const { selectionStart, selectionEnd } = this.input;

    if (selectionStart === 0 && selectionEnd === this.input.value.length) {
      // If the user has selected the entire input, don't change the selection
      return;
    } else if (selectionStart !== null) {
      const parts = this.#getCurrentParts(),
        part = parts.find(p => p.type !== 'literal' && selectionStart >= p.start && selectionStart <= p.end);

      if (part) {
        this.#editingPartType = part.type;
        this.#enteredDigits = 0;
        this.#setSelectedPart(part);
      }
    }
  }

  #onInputFocus(): void {
    if (this.readonly || this.selectOnly || this.value || this.#hasPartialDate()) {
      return;
    }

    // Replace any placeholder with the date template
    this.input.value = getDateTemplate(this.locale ?? 'default');

    // Set the editing part type to the first non-literal part
    const parts = this.#getCurrentParts(),
      firstPart = parts.find(p => p.type !== 'literal');

    if (firstPart) {
      this.#editingPartType = firstPart.type;
      this.#enteredDigits = 0;
      this.#setSelectedPart(firstPart);
    }
  }

  #onInputInput(): void {
    const partType = this.#editingPartType;
    if (!partType) {
      return;
    }

    const newDigit = this.#parseInputDigit(partType);
    if (newDigit === undefined) {
      return;
    }

    this.#applyDigitToDatePart(partType, newDigit);
    this.#updateInputDisplay();
    this.#handlePartNavigation(partType);
    this.#trySetValue();
  }

  #onInputKeydown(event: KeyboardEvent): void {
    const selectedPart = this.#getSelectedPart();
    if (!selectedPart) {
      return;
    }

    // Check if the key is a separator character (literal part)
    const parts = this.#getCurrentParts(),
      separators = parts.filter(p => p.type === 'literal').map(p => p.value);

    if (separators.includes(event.key)) {
      event.preventDefault();

      // Move to the next part
      const nonLiteralParts = parts.filter(p => p.type !== 'literal'),
        index = nonLiteralParts.findIndex(p => p.type === selectedPart.type);

      if (index < nonLiteralParts.length - 1) {
        const nextPart = nonLiteralParts[index + 1];
        this.#editingPartType = nextPart.type;
        this.#enteredDigits = 0;

        // Set selection synchronously for separator key
        const currentPart = parts.find(p => p.type === nextPart.type);
        if (currentPart) {
          this.input.setSelectionRange(currentPart.start, currentPart.end);
        }
      }
      return;
    }

    if (!event.key.startsWith('Arrow')) {
      return;
    }

    event.preventDefault();

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      const nonLiteralParts = parts.filter(p => p.type !== 'literal'),
        index = nonLiteralParts.findIndex(p => p.type === selectedPart.type),
        newIndex = event.key === 'ArrowLeft' ? Math.max(0, index - 1) : Math.min(nonLiteralParts.length - 1, index + 1),
        newPart = nonLiteralParts[newIndex];

      this.#editingPartType = newPart.type;
      this.#enteredDigits = 0;
      this.#setSelectedPart(newPart);
    } else if (!this.readonly && !this.selectOnly && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      this.#adjustDatePart(selectedPart.type, event.key === 'ArrowUp' ? 1 : -1);
    }
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      // Prevents the Escape key event from bubbling up, so that pressing 'Escape' inside the date field
      // does not close parent containers (such as dialogs).
      event.stopPropagation();
    }
  }

  #onSlotChange(): void {
    if (!this.calendar) {
      return;
    }

    // If the calendar is slotted, we need to explicitly set the selected date
    this.calendar.selected = this.value;
  }

  #onTextFieldBlur(event: SlBlurEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.blurEvent.emit();
    this.updateState({ touched: true });
  }

  #onTextFieldChange(event: SlChangeEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.updateValidity();
  }

  #onTextFieldFocus(event: SlFocusEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.focusEvent.emit();
  }

  #onTextFieldFormControl(event: SlFormControlEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  #onTextFieldUpdateState(event: SlUpdateStateEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.updateValidity();
  }

  #onToggle(event: ToggleEvent): void {
    if (event.newState === 'closed') {
      this.#popoverJustClosed = false;

      // Wait for the close animation to finish before removing the calendar from the DOM
      const animations = this.dialog?.getAnimations();

      if (animations?.length) {
        void Promise.all(animations.map(a => a.finished)).then(() => {
          this.dialogVisible = false;
        });
      } else {
        this.dialogVisible = false;
      }
    } else {
      // Wait for the calendar to render in the popover
      requestAnimationFrame(() => this.calendar?.focus());
    }

    // Trigger a rerender so the calendar will be rendered
    this.requestUpdate();
  }

  /**
   * Adjusts a date part by the given delta, with wrapping.
   * @param partType The type of part to adjust ('day', 'month', 'year')
   * @param delta The amount to adjust by (1 or -1)
   */
  #adjustDatePart(partType: string, delta: number): void {
    if (partType !== 'day' && partType !== 'month' && partType !== 'year') {
      return;
    }

    const currentValue = this.#dateParts[partType];

    if (currentValue === undefined) {
      // No value yet: ArrowUp sets to min, ArrowDown sets to max
      if (partType === 'day') {
        this.#dateParts.day = delta > 0 ? 1 : 31;
      } else if (partType === 'month') {
        this.#dateParts.month = delta > 0 ? 1 : 12;
      } else {
        // For year, use current year as a reasonable default
        this.#dateParts.year = new Date().getFullYear();
      }
    } else {
      // Increment/decrement with wrapping
      if (partType === 'day') {
        this.#dateParts.day = currentValue + delta;
        if (this.#dateParts.day > 31) this.#dateParts.day = 1;
        if (this.#dateParts.day < 1) this.#dateParts.day = 31;
      } else if (partType === 'month') {
        this.#dateParts.month = currentValue + delta;
        if (this.#dateParts.month > 12) this.#dateParts.month = 1;
        if (this.#dateParts.month < 1) this.#dateParts.month = 12;
      } else {
        // Year doesn't wrap, but we can set reasonable bounds
        this.#dateParts.year = Math.max(1, Math.min(9999, currentValue + delta));
      }
    }

    this.#updateInputDisplay();
    this.#trySetValue();

    // Re-select the same part after updating
    requestAnimationFrame(() => {
      const parts = this.#getCurrentParts().filter(p => p.type !== 'literal'),
        part = parts.find(p => p.type === partType);

      if (part) {
        this.#setSelectedPart(part);
      }
    });
  }

  /** Applies a new digit to the specified date part, combining with existing digits if continuing to type. */
  #applyDigitToDatePart(partType: string, newDigit: number): void {
    const maxDigits = partType === 'year' ? 4 : 2;
    let currentValue: number | undefined;

    if (partType === 'day') {
      currentValue = this.#dateParts.day;
    } else if (partType === 'month') {
      currentValue = this.#dateParts.month;
    } else if (partType === 'year') {
      currentValue = this.#dateParts.year;
    }

    // Calculate the new value by combining existing digits with the new one
    let newValue: number;
    if (this.#enteredDigits > 0 && this.#enteredDigits < maxDigits && currentValue !== undefined) {
      newValue = currentValue * 10 + newDigit;
    } else {
      newValue = newDigit;
      this.#enteredDigits = 0;
    }

    this.#enteredDigits++;

    if (partType === 'day') {
      this.#dateParts.day = newValue;
    } else if (partType === 'month') {
      this.#dateParts.month = newValue;
    } else if (partType === 'year') {
      this.#dateParts.year = newValue;
    }
  }

  /**
   * Gets the current date format parts with correct start/end indices
   * based on the actual values in #dateParts (padded to match the display).
   */
  #getCurrentParts(): DateFormatPart[] {
    const locale = this.locale ?? 'default',
      templateParts = getDateFormat(locale);

    let index = 0;
    return templateParts.map(part => {
      let value: string;

      if (part.type === 'day') {
        value =
          this.#dateParts.day !== undefined
            ? String(this.#dateParts.day).padStart(part.value.length, '0')
            : getDateUnitLetter(locale, 'day').repeat(part.value.length);
      } else if (part.type === 'month') {
        value =
          this.#dateParts.month !== undefined
            ? String(this.#dateParts.month).padStart(part.value.length, '0')
            : getDateUnitLetter(locale, 'month').repeat(part.value.length);
      } else if (part.type === 'year') {
        value =
          this.#dateParts.year !== undefined
            ? String(this.#dateParts.year)
            : getDateUnitLetter(locale, 'year').repeat(part.value.length);
      } else {
        value = part.value;
      }

      const start = index,
        end = index + value.length;

      index = end;

      return { ...part, value, start, end };
    });
  }

  #getSelectedPart(): DateFormatPart | null {
    const { selectionStart, selectionEnd } = this.input;

    if (selectionStart !== null && selectionStart !== selectionEnd) {
      const parts = this.#getCurrentParts(),
        part = parts.find(p => p.type !== 'literal' && selectionStart >= p.start && selectionStart <= p.end);

      return part || null;
    }

    return null;
  }

  /** Handles navigation to the next part or staying on current part after input. */
  #handlePartNavigation(partType: string): void {
    const maxDigits = partType === 'year' ? 4 : 2;

    requestAnimationFrame(() => {
      const parts = this.#getCurrentParts().filter(p => p.type !== 'literal');

      if (this.#enteredDigits >= maxDigits) {
        const currentIndex = parts.findIndex(p => p.type === partType);

        if (currentIndex < parts.length - 1) {
          const nextPart = parts[currentIndex + 1];
          this.#editingPartType = nextPart.type;
          this.#enteredDigits = 0;
          this.#setSelectedPart(nextPart);
        } else {
          this.#setSelectedPart(parts[currentIndex]);
        }
      } else {
        const currentPart = parts.find(p => p.type === partType);
        if (currentPart) {
          this.#setSelectedPart(currentPart);
        }
      }
    });
  }

  #hasPartialDate(): boolean {
    return (
      this.#dateParts.day !== undefined || this.#dateParts.month !== undefined || this.#dateParts.year !== undefined
    );
  }

  /** Parses the current input to extract the newly typed digit for the given part. */
  #parseInputDigit(partType: string): number | undefined {
    const inputValue = this.input.value,
      currentParts = this.#getCurrentParts();

    for (const part of currentParts) {
      if (part.type === partType) {
        // Extract the value from the current input at this part's position
        const valueStr = inputValue.slice(part.start, part.end).replace(/\D/g, '');

        if (valueStr.length === 0) {
          return undefined;
        }

        const value = parseInt(valueStr, 10);
        // Get the last digit typed (the new one)
        return isNaN(value) ? undefined : value % 10;
      }
    }

    return undefined;
  }

  #setSelectedPart(part: DateFormatPart): void {
    // Recalculate the part position based on current input values
    const parts = this.#getCurrentParts(),
      currentPart = parts.find(p => p.type === part.type);

    if (currentPart) {
      this.input.setSelectionRange(currentPart.start, currentPart.end);
    }
  }

  #setValueAndCloseDialog(date: Date | undefined): void {
    this.value = date;
    this.value?.setHours(0, 0, 0, 0); // We don't need a time for the date picker.
    this.changeEvent.emit(this.value);

    this.textField?.updateValidity();

    this.updateState({ dirty: true });
    this.updateValidity();

    this.dialog?.hidePopover();
    this.input.focus();
  }

  /** Tries to set the value if all date parts are defined. */
  #trySetValue(): void {
    const { day, month, year } = this.#dateParts;

    if (day !== undefined && month !== undefined && year !== undefined) {
      // Validate the date
      const date = new Date(year, month - 1, day);

      // Check if the date is valid (e.g., Feb 30 would roll over to March)
      if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
        this.value = date;
        this.changeEvent.emit(this.value);
        this.updateState({ dirty: true });
        this.updateValidity();
      } else {
        this.reportValidity();
      }
    }
  }

  /** Updates the input display based on current date parts. */
  #updateInputDisplay(): void {
    const locale = this.locale ?? 'default',
      parts = getDateFormat(locale);

    const display = parts
      .map(part => {
        if (part.type === 'day') {
          if (this.#dateParts.day !== undefined) {
            return String(this.#dateParts.day).padStart(part.value.length, '0');
          }

          return getDateUnitLetter(locale, 'day').repeat(part.value.length);
        } else if (part.type === 'month') {
          if (this.#dateParts.month !== undefined) {
            return String(this.#dateParts.month).padStart(part.value.length, '0');
          }

          return getDateUnitLetter(locale, 'month').repeat(part.value.length);
        } else if (part.type === 'year') {
          if (this.#dateParts.year !== undefined) {
            return String(this.#dateParts.year);
          }
          return getDateUnitLetter(locale, 'year').repeat(part.value.length);
        }

        return part.value;
      })
      .join('');

    this.input.value = display;
  }
}
