import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Button } from '@sl-design-system/button';
import { ButtonBar } from '@sl-design-system/button-bar';
import { Calendar } from '@sl-design-system/calendar';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, LocaleMixin, anchor, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import { isSameDate } from '@sl-design-system/shared/date.js';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { FieldButton } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './date-field.scss.js';
import {
  type DateFormatPart,
  getDateFormat,
  getDateUnitLetter,
  getDateUnitName,
  getMonthName,
  parseDateString
} from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-date-field': DateField;
  }
}

type DatePartType = 'day' | 'month' | 'year';

/**
 * A form component that allows the user to pick a date from a calendar.
 * Uses individual spinbutton inputs per date part for improved accessibility.
 *
 * @cssState has-value - Set when the date field has a value.
 * @cssState placeholder-shown - Set when the date field is empty and has a placeholder.
 */
@localized()
export class DateField extends LocaleMixin(FormControlMixin(ScopedElementsMixin(LitElement))) {
  /** @internal */
  static formAssociated = true;

  /** @internal The default offset of the popover to the field. */
  static offset = 6;

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button': Button,
      'sl-button-bar': ButtonBar,
      'sl-calendar': Calendar,
      'sl-field-button': FieldButton,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal The default margin between the popover and the viewport. */
  static viewportMargin = 8;

  /** Tracks how many digits have been entered for the current part. */
  #enteredDigits = 0;

  /** Formatter for displaying the value and validation messages. */
  #formatter?: Intl.DateTimeFormat;

  /**
   * Flag to prevent willUpdate from clearing dateParts when the value is set
   * to undefined internally (e.g. when the user enters an invalid date).
   */
  #preserveDateParts = false;

  /**
   * Flag indicating whether the popover was just closed. We need to know this so we can
   * properly handle button clicks that close the popover. If the popover was just closed,
   * we don't want to show it again when the button click event fires.
   */
  #popoverJustClosed = false;

  /** The index of the active date part for roving tabindex. */
  #rovingIndex = 0;

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /**
   * The calendar element. This will return an instance of the calendar
   * when the popover is shown or always when the calendar is slotted. Otherwise
   * it will return undefined.
   */
  get calendar(): Calendar | null {
    return this.querySelector('sl-calendar[slot="calendar"]') ?? this.renderRoot.querySelector('sl-calendar');
  }

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<Date | undefined>>;

  /**
   * Stores the individual date parts when the user is editing.
   * These are stored separately from `value` to support partial dates.
   * @internal
   */
  @state() dateParts: { day?: number; month?: number; year?: number } = {};

  /** @internal The dialog element that is also the popover. */
  @query('dialog') dialog?: HTMLDialogElement;

  /** Whether the date field is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /**
   * The first day of the week; 0 for Sunday, 1 for Monday.
   * @default 1
   */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek?: number;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  override get formValue(): string | null {
    if (!this.value) {
      return null;
    }

    const y = this.value.getFullYear(),
      m = String(this.value.getMonth() + 1).padStart(2, '0'),
      d = String(this.value.getDate()).padStart(2, '0');

    return `${y}-${m}-${d}`;
  }

  override set formValue(value: Date | string | null) {
    if (value instanceof Date) {
      this.value = value;
    } else if (typeof value === 'string') {
      this.value = parseDateString(value, this.locale ?? 'default');
    } else {
      this.value = undefined;
    }
  }

  /** @internal */
  readonly internals = this.attachInternals();

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
   * Placeholder text shown when there is no value and the field is not focused.
   * @default undefined
   */
  @property() placeholder?: string;

  /**
   * Whether the date field is readonly.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) readonly?: boolean;

  /**
   * When set, a "Confirm" button will be shown in the popover, and the user will
   * need to click it to confirm their date selection.
   */
  @property({ type: Boolean, attribute: 'require-confirmation' }) requireConfirmation?: boolean;

  /**
   * Whether the date field is a required field.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /** @internal Whether the component is in "select all" mode, showing a single text input. */
  @state() selectAll?: boolean;

  /**
   * Whether the component is select only. This means you cannot type in the inputs,
   * but you can still pick a date via the popover.
   * @default false
   */
  @property({ type: Boolean, reflect: true, attribute: 'select-only' }) selectOnly?: boolean;

  /**
   * Shows the week numbers.
   * @default false
   */
  @property({ type: Boolean, attribute: 'show-week-numbers' }) showWeekNumbers?: boolean;

  /** The selected date in the calendar. */
  @property({ converter: dateConverter }) override value?: Date;

  override connectedCallback(): void {
    super.connectedCallback();

    this.internals.role = 'group';
    this.setFormControlElement(this);

    this.addEventListener('focusin', this.#onFocusIn);
    this.addEventListener('focusout', this.#onFocusOut);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener('focusin', this.#onFocusIn);
    this.removeEventListener('focusout', this.#onFocusOut);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('locale')) {
      this.#formatter = new Intl.DateTimeFormat(this.locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    if (changes.has('locale') || changes.has('value')) {
      if (this.value) {
        this.dateParts = {
          day: this.value.getDate(),
          month: this.value.getMonth() + 1,
          year: this.value.getFullYear()
        };
      } else if (changes.get('value') !== undefined && !this.#preserveDateParts) {
        // Only clear parts if value was explicitly set to undefined (not on first render)
        this.dateParts = {};
        this.#enteredDigits = 0;
      }

      this.#preserveDateParts = false;
    }

    if (changes.has('dateParts') || changes.has('placeholder') || changes.has('value')) {
      if (this.value || this.#hasPartialDate()) {
        this.internals.states.delete('placeholder-shown');
      } else if (this.placeholder) {
        this.internals.states.add('placeholder-shown');
      } else {
        this.internals.states.delete('placeholder-shown');
      }
    }

    if (changes.has('value')) {
      if (this.calendar && !isSameDate(this.value, this.calendar?.selected)) {
        this.calendar.selected = this.value;
      }

      if (this.value) {
        this.internals.states.add('has-value');
      } else {
        this.internals.states.delete('has-value');
      }

      this.internals.setFormValue(this.formValue);
    }

    if (changes.has('min') || changes.has('max') || changes.has('required') || changes.has('value')) {
      this.updateValidity();
    }
  }

  override render(): TemplateResult {
    const locale = this.locale ?? 'default',
      parts = getDateFormat(locale);

    return html`
      <div class="field">
        <div class="wrapper">
          ${this.selectAll
            ? html`
                <span
                  @blur=${this.#onSelectAllBlur}
                  @keydown=${this.#onSelectAllKeydown}
                  @mousedown=${this.#onSelectAllMouseDown}
                  class="select-all"
                  contenteditable="true"
                >
                  ${this.#getFormattedValue()}
                </span>
              `
            : html`
                <div class="parts">${parts.map(part => this.renderPart(part, locale))}</div>
                ${this.placeholder
                  ? html`
                      <div aria-hidden=${ifDefined(this.value ? 'true' : undefined)} class="placeholder">
                        ${this.placeholder}
                      </div>
                    `
                  : nothing}
              `}
        </div>

        <sl-field-button
          @click=${this.#onButtonClick}
          ?disabled=${this.disabled || this.readonly}
          aria-controls="dialog"
          aria-expanded=${this.dialog?.matches(':popover-open') ? 'true' : 'false'}
          aria-haspopup="dialog"
          aria-label=${msg('Select date', { id: 'sl.dateField.selectDate' })}
          tabindex=${this.disabled || this.readonly ? '-1' : '0'}
        >
          <sl-icon name="calendar"></sl-icon>
        </sl-field-button>
      </div>

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
        ${this.dialog?.matches(':popover-open')
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
  renderPart(part: DateFormatPart, locale: string): TemplateResult {
    if (part.type === 'literal') {
      return html`<span @pointerdown=${this.#onSeparatorPointerDown} class="separator">${part.value}</span>`;
    }

    const partType = part.type as DatePartType,
      formatParts = getDateFormat(locale),
      datePartTypes = formatParts.filter(p => p.type !== 'literal').map(p => p.type),
      datePartIndex = datePartTypes.indexOf(partType),
      placeholder = getDateUnitLetter(locale, partType).repeat(part.value.length),
      currentValue = this.dateParts[partType],
      hasValue = currentValue !== undefined,
      displayValue = hasValue ? String(currentValue).padStart(part.value.length, '0') : placeholder,
      isMonth = partType === 'month',
      isValidMonth = isMonth && typeof currentValue === 'number' && currentValue >= 1 && currentValue <= 12,
      valueText = hasValue
        ? isMonth
          ? isValidMonth
            ? getMonthName(locale, currentValue)
            : String(currentValue).padStart(part.value.length, '0')
          : String(currentValue)
        : msg('Empty', { id: 'sl.dateField.empty' });

    return html`
      <span
        @beforeinput=${(e: Event) => e.preventDefault()}
        @blur=${this.#onPartBlur}
        @focus=${this.#onPartFocus}
        @keydown=${(e: KeyboardEvent) => this.#onPartKeydown(e, partType)}
        @paste=${this.#onPaste}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-label=${getDateUnitName(locale, partType)}
        aria-readonly=${this.readonly || this.selectOnly ? 'true' : 'false'}
        aria-valuemax=${this.#getMaxForType(partType)}
        aria-valuemin=${this.#getMinForType(partType)}
        aria-valuenow=${ifDefined(currentValue)}
        aria-valuetext=${valueText}
        contenteditable=${this.disabled || this.readonly || this.selectOnly ? 'false' : 'true'}
        inputmode="numeric"
        role="spinbutton"
        tabindex=${this.disabled ? undefined : datePartIndex === this.#rovingIndex ? '0' : '-1'}
        >${displayValue}</span
      >
    `;
  }

  /** @internal */
  override updateInternalValidity(): void {
    const hasCompleteDate =
      this.dateParts.day !== undefined && this.dateParts.month !== undefined && this.dateParts.year !== undefined;

    if (hasCompleteDate && !this.value) {
      this.setCustomValidity(msg('Please enter a valid date.', { id: 'sl.dateField.typeMismatch' }));
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
    if (event.newState !== 'open') {
      this.#popoverJustClosed = true;
    }
  }

  #onButtonClick(): void {
    if (!this.#popoverJustClosed) {
      this.dialog?.togglePopover();
    }
  }

  #onChange(event: SlChangeEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.requireConfirmation) {
      return;
    }

    this.#setValueAndCloseDialog(event.detail);
  }

  #onConfirm(): void {
    this.#setValueAndCloseDialog(this.calendar?.selected);
  }

  #onFocusIn = (event: FocusEvent): void => {
    // Only emit when focus enters from outside the component
    const relatedTarget = event.relatedTarget as Node | null;

    if (!relatedTarget || (!this.contains(relatedTarget) && !this.renderRoot.contains(relatedTarget))) {
      this.focusEvent.emit();
    }
  };

  #onFocusOut = (event: FocusEvent): void => {
    // Only emit when focus leaves the component entirely
    const relatedTarget = event.relatedTarget as Node | null;

    if (!relatedTarget || (!this.contains(relatedTarget) && !this.renderRoot.contains(relatedTarget))) {
      this.blurEvent.emit();
      this.updateState({ touched: true });
      this.updateValidity();
    }
  };

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.stopPropagation();
    }
  }

  #onPartBlur(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as HTMLElement | null,
      isSpinbutton = relatedTarget?.getAttribute('role') === 'spinbutton' && this.renderRoot.contains(relatedTarget);

    if (!isSpinbutton) {
      this.renderRoot.ownerDocument.getSelection()?.removeAllRanges();
    }
  }

  #onPartFocus(event: FocusEvent): void {
    const span = event.composedPath().at(0) as HTMLElement,
      spans = Array.from(this.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]')),
      index = spans.indexOf(span);

    if (index >= 0 && index !== this.#rovingIndex) {
      this.#rovingIndex = index;
      this.requestUpdate();
    }

    this.#enteredDigits = 0;

    // Workaround for WebKit changing the selection on focus.
    requestAnimationFrame(() => this.#selectContent(span));
  }

  #onPartKeydown(event: KeyboardEvent, partType: DatePartType): void {
    const span = event.target as HTMLElement;

    // Check if the pressed key is a separator character
    const locale = this.locale ?? 'default',
      parts = getDateFormat(locale),
      separators = parts.filter(p => p.type === 'literal').map(p => p.value);

    if (separators.includes(event.key)) {
      event.preventDefault();
      this.#moveFocus(span, 1);
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();

      this.selectAll = true;

      requestAnimationFrame(() => {
        const selectAll = this.renderRoot.querySelector<HTMLElement>('.select-all')!;
        selectAll.focus();
        this.#selectContent(selectAll);
      });

      return;
    }

    if (event.key >= '0' && event.key <= '9') {
      event.preventDefault();

      if (this.readonly || this.selectOnly) {
        return;
      }

      const digit = parseInt(event.key, 10);
      this.#applyDigitToDatePart(partType, digit);

      // Auto-advance when max digits reached
      const maxDigits = partType === 'year' ? 4 : 2;
      if (this.#enteredDigits >= maxDigits) {
        this.#enteredDigits = 0;
        this.#moveFocus(span, 1);
      } else {
        requestAnimationFrame(() => this.#selectContent(span));
      }

      this.#trySetValue();
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        if (!this.readonly && !this.selectOnly) {
          this.#adjustDatePart(partType, 1);
          this.#selectContent(span);
          this.#trySetValue();
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.readonly && !this.selectOnly) {
          this.#adjustDatePart(partType, -1);
          this.#selectContent(span);
          this.#trySetValue();
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        this.#moveFocus(span, -1);
        break;

      case 'ArrowRight':
        event.preventDefault();
        this.#moveFocus(span, 1);
        break;

      case 'Backspace':
      case 'Delete':
        event.preventDefault();
        if (!this.readonly && !this.selectOnly) {
          this.dateParts = { ...this.dateParts, [partType]: undefined };
          this.#enteredDigits = 0;
          this.#selectContent(span);
          this.#trySetValue();
        }
        break;
    }

    // Prevent any other character input (letters, symbols, etc.)
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
    }
  }

  #onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    if (this.readonly || this.selectOnly) {
      return;
    }

    const text = event.clipboardData?.getData('text/plain')?.trim();
    if (!text) {
      return;
    }

    const date = parseDateString(text, this.locale ?? 'default');
    if (date) {
      this.value = date;
      this.changeEvent.emit(this.value);
      this.updateState({ dirty: true });
      this.updateValidity();
    }
  }

  #onSelectAllBlur(): void {
    this.#exitSelectAll();
  }

  #onSelectAllKeydown(event: KeyboardEvent): void {
    // Allow modifier keys on their own (Ctrl, Meta, Shift, Alt) so copy shortcut works
    if (['Control', 'Meta', 'Shift', 'Alt'].includes(event.key)) {
      return;
    }

    // Allow copy shortcut
    if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'C')) {
      return;
    }

    // Tab focuses the field-button; Shift-Tab lets the browser move focus outside
    if (event.key === 'Tab') {
      event.preventDefault();
      this.#exitSelectAll();

      if (!event.shiftKey) {
        requestAnimationFrame(() => {
          this.renderRoot.querySelector<HTMLElement>('sl-field-button')?.focus();
        });
      }

      return;
    }

    // Backspace/Delete clears the value and date parts
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      this.dateParts = {};
      this.#enteredDigits = 0;
      this.value = undefined;
      this.changeEvent.emit(this.value);
      this.updateState({ dirty: true });
      this.updateValidity();
      this.#exitSelectAll(true);

      return;
    }

    event.preventDefault();
    this.#exitSelectAll(true);
  }

  #onSelectAllMouseDown(event: MouseEvent): void {
    event.preventDefault();
    this.#exitSelectAll(true);
  }

  #onSeparatorPointerDown(event: Event & { target: HTMLElement }): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    (event.target.previousElementSibling as HTMLElement)?.focus();
  }

  #onSlotChange(): void {
    if (!this.calendar) {
      return;
    }

    this.calendar.selected = this.value;
  }

  #onToggle(event: ToggleEvent): void {
    if (event.newState === 'closed') {
      this.#popoverJustClosed = false;
    } else {
      requestAnimationFrame(() => this.calendar?.focus());
    }

    this.requestUpdate();
  }

  /**
   * Adjusts a date part by the given delta, with wrapping.
   * @param partType The type of part to adjust
   * @param delta The amount to adjust by (1 or -1)
   */
  #adjustDatePart(partType: DatePartType, delta: number): void {
    const currentValue = this.dateParts[partType];
    let newValue: number;

    if (currentValue === undefined) {
      if (partType === 'day') {
        newValue = delta > 0 ? 1 : 31;
      } else if (partType === 'month') {
        newValue = delta > 0 ? 1 : 12;
      } else {
        newValue = new Date().getFullYear();
      }
    } else {
      if (partType === 'day') {
        newValue = currentValue + delta;
        if (newValue > 31) newValue = 1;
        if (newValue < 1) newValue = 31;
      } else if (partType === 'month') {
        newValue = currentValue + delta;
        if (newValue > 12) newValue = 1;
        if (newValue < 1) newValue = 12;
      } else {
        newValue = Math.max(1, Math.min(9999, currentValue + delta));
      }
    }

    this.dateParts = { ...this.dateParts, [partType]: newValue };
  }

  /** Applies a new digit to the specified date part, combining with existing digits if continuing to type. */
  #applyDigitToDatePart(partType: DatePartType, newDigit: number): void {
    const maxDigits = partType === 'year' ? 4 : 2,
      currentValue = this.dateParts[partType];

    let newValue: number;
    if (this.#enteredDigits > 0 && this.#enteredDigits < maxDigits && currentValue !== undefined) {
      newValue = currentValue * 10 + newDigit;
    } else {
      newValue = newDigit;
      this.#enteredDigits = 0;
    }

    this.#enteredDigits++;
    this.dateParts = { ...this.dateParts, [partType]: newValue };
  }

  #exitSelectAll(refocus = false): void {
    this.selectAll = false;

    if (refocus) {
      requestAnimationFrame(() => {
        this.renderRoot.querySelector<HTMLElement>('span[role="spinbutton"]')?.focus();
      });
    }
  }

  /** Returns the formatted date string for the select-all input. */
  #getFormattedValue(): string {
    const locale = this.locale ?? 'default',
      parts = getDateFormat(locale);

    return parts
      .map(part => {
        if (part.type === 'literal') {
          return part.value;
        }

        const partType = part.type as DatePartType,
          currentValue = this.dateParts[partType];

        if (currentValue !== undefined) {
          return String(currentValue).padStart(part.value.length, '0');
        }

        return getDateUnitLetter(locale, partType).repeat(part.value.length);
      })
      .join('');
  }

  #getMaxForType(partType: DatePartType): number {
    switch (partType) {
      case 'day':
        return 31;
      case 'month':
        return 12;
      case 'year':
        return 9999;
    }
  }

  #getMinForType(partType: DatePartType): number {
    switch (partType) {
      case 'day':
      case 'month':
        return 1;
      case 'year':
        return 1;
    }
  }

  #hasPartialDate(): boolean {
    return this.dateParts.day !== undefined || this.dateParts.month !== undefined || this.dateParts.year !== undefined;
  }

  /** Selects all text content in a contenteditable element. */
  #selectContent(element: HTMLElement): void {
    const selection = element.ownerDocument.getSelection();

    if (selection) {
      selection.setBaseAndExtent(element, 0, element, element.childNodes.length);
    }
  }

  /** Moves focus to the next or previous spinbutton input. */
  #moveFocus(current: HTMLElement, direction: 1 | -1): void {
    const spans = Array.from(this.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]')),
      index = spans.indexOf(current),
      target = spans[index + direction];

    if (target) {
      target.focus();
      this.#selectContent(target);
    }
  }

  #setValueAndCloseDialog(date: Date | undefined): void {
    this.value = date;
    this.value?.setHours(0, 0, 0, 0);
    this.changeEvent.emit(this.value);

    this.updateState({ dirty: true });
    this.updateValidity();

    this.dialog?.hidePopover();

    // Focus the first spinbutton after closing the dialog
    requestAnimationFrame(() => {
      const firstSpan = this.renderRoot.querySelector<HTMLElement>('span[role="spinbutton"]');
      firstSpan?.focus();
    });
  }

  /** Tries to set the value if all date parts are defined, or clears it. */
  #trySetValue(): void {
    const { day, month, year } = this.dateParts,
      hadValue = this.value !== undefined;

    if (day !== undefined && month !== undefined && year !== undefined) {
      const date = new Date(year, month - 1, day);

      if (date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year) {
        if ((this.min && date < this.min) || (this.max && date > this.max)) {
          this.#preserveDateParts = true;
          this.value = undefined;

          if (hadValue) {
            this.changeEvent.emit(this.value);
            this.updateState({ dirty: true });
          }

          this.updateValidity();
        } else {
          this.value = date;
          this.changeEvent.emit(this.value);
          this.updateState({ dirty: true });
          this.updateValidity();
        }
      } else {
        this.#preserveDateParts = true;
        this.value = undefined;

        if (hadValue) {
          this.changeEvent.emit(this.value);
          this.updateState({ dirty: true });
        }

        this.updateValidity();
      }
    } else {
      this.#preserveDateParts = true;
      this.value = undefined;

      if (hadValue) {
        this.changeEvent.emit(this.value);
        this.updateState({ dirty: true });
      }

      this.updateValidity();
    }
  }
}
