import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, LocaleMixin, anchor, event } from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { FieldButton } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './time-field.scss.js';
import { type DateFormatPart, getDateFormat, getTimeUnitLetter, getTimeUnitName } from './utils.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-time-field': TimeField;
  }
}

type TimePartType = 'hour' | 'minute';

const timeSeparators = new Map<string, string>();

/**
 * A time field control for selecting a time.
 */
@localized()
export class TimeField extends LocaleMixin(FormControlMixin(ScopedElementsMixin(LitElement))) {
  /** The default step between each hour option. */
  static hourStep = 1;

  /** The default step between each minute option. */
  static minuteStep = 5;

  /** @internal The default offset of the popover to the text-field. */
  static offset = 6;

  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-field-button': FieldButton,
      'sl-icon': Icon
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = styles;

  /** @internal The default margin between the popover and the viewport. */
  static viewportMargin = 8;

  /**
   * Flag indicating whether the popover was just closed. We need to know this so we can
   * properly handle button clicks that close the popover. If the popover was just closed,
   * we don't want to show it again when the button click event fires.
   */
  #popoverJustClosed = false;

  /** The index of the active date part for roving tabindex. */
  #rovingIndex = 0;

  /**
   * The start time; the time that has the initial focus when the picker is opened when
   * there is no value set.
   */
  #startTime?: { hours: number; minutes: number } | undefined;

  /** The current value in numbers. */
  #valueAsNumbers: { hours: number; minutes: number } | undefined;

  /** The value in HH:mm format. */
  #value: string | undefined;

  /** Tracks how many digits have been entered for the current part. */
  #enteredDigits = 0;

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal */
  @query('sl-field-button') button?: FieldButton;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<string>>;

  /** @internal The dialog element that is also the popover. */
  @query('dialog') dialog?: HTMLDialogElement;

  /** Whether the time field is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** The step between each hour option. */
  @property({ type: Number, attribute: 'hour-step' }) hourStep = TimeField.hourStep;

  /** @internal The input element in the light DOM. */
  input!: HTMLInputElement;

  /**
   * The maximum time selectable in the field.
   * @default undefined
   */
  @property() max?: string;

  /**
   * The minimum time selectable in the field.
   * @default undefined
   */
  @property() min?: string;

  /** The step between each minute option. */
  @property({ type: Number, attribute: 'minute-step' }) minuteStep = TimeField.minuteStep;

  /**
   * The placeholder for the time field.
   * @default undefined
   */
  @property() placeholder?: string;

  /** @internal Whether the placeholder is currently shown. */
  @state() placeholderShown?: boolean;

  /**
   * Whether the time field is readonly.
   * @default false
   */
  @property({ type: Boolean }) readonly?: boolean;

  /**
   * Whether the time field is a required field.
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
   * The start time; the time that has the initial focus when the picker is opened without
   * a value. If will use the current time if not explicitly set.
   * @default undefined
   */
  @property() start?: string;

  /**
   * Stores the individual time parts when the user is editing.
   * These are stored separately from `value` to support partial times.
   * @internal
   */
  @state() timeParts: { hour?: number; minute?: number } = {};

  override get value(): string | undefined {
    return this.#value;
  }

  @property()
  override set value(value: string | undefined) {
    if (value) {
      const time = this.#parseTime(value);

      if (time && !Number.isNaN(time.hours) && !Number.isNaN(time.minutes)) {
        this.#value = this.#formatTime(time?.hours ?? 0, time?.minutes ?? 0);
        this.#valueAsNumbers = time;
        this.timeParts = { hour: time.hours, minute: time.minutes };
      } else {
        this.#value = undefined;
        this.#valueAsNumbers = undefined;
        this.timeParts = {};
      }
    } else {
      this.#value = undefined;
      this.#valueAsNumbers = undefined;
      this.timeParts = {};
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.input) {
      this.input = this.querySelector<HTMLInputElement>('input[slot="input"]') || document.createElement('input');
      this.input.autocomplete = 'off';
      this.input.slot = 'input';

      if (!this.input.parentElement) {
        this.append(this.input);
      }
    }

    // Hide the input visually; it is only used for form submission
    this.input.style.cssText = 'position:absolute;opacity:0;pointer-events:none;width:0;height:0;overflow:hidden;';

    this.setFormControlElement(this.input);
    this.#syncInputLang();
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.updateValidity();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('start')) {
      this.#startTime = this.start ? this.#parseTime(this.start) : undefined;
    }

    if (changes.has('value')) {
      this.input.value = this.value || '';
      this.updateValidity();
    }
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('required')) {
      this.input.required = !!this.required;
    }

    this.#syncInputLang();
  }

  override focus(): void {
    this.renderRoot.querySelector<HTMLElement>('span[role="spinbutton"]')?.focus();
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
                      <div aria-hidden=${ifDefined(this.placeholderShown ? undefined : 'true')} class="placeholder">
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
          aria-expanded="false"
          aria-haspopup="listbox"
          aria-label=${msg('Select time', { id: 'sl.timeField.toggleDropdown' })}
          tabindex=${this.disabled || this.readonly ? '-1' : '0'}
        >
          <sl-icon name="clock"></sl-icon>
        </sl-field-button>
      </div>

      <dialog
        ${anchor({
          element: this,
          offset: TimeField.offset,
          position: 'bottom-start',
          viewportMargin: TimeField.viewportMargin
        })}
        @beforetoggle=${this.#onBeforeToggle}
        @toggle=${this.#onToggle}
        @keydown=${this.#onKeydown}
        id="dialog"
        popover
      >
        <ul
          aria-label=${msg('Select hours', { id: 'sl.timeField.selectHours' })}
          class="hours"
          role="listbox"
          tabindex="-1"
        >
          ${this.renderHours()}
        </ul>
        <hr />
        <ul
          aria-label=${msg('Select minutes', { id: 'sl.timeField.selectMinutes' })}
          class="minutes"
          role="listbox"
          tabindex="-1"
        >
          ${this.renderMinutes()}
        </ul>
      </dialog>
    `;
  }

  /** @internal */
  renderPart(part: DateFormatPart, locale: string): TemplateResult {
    if (part.type === 'literal') {
      return html`<span @pointerdown=${this.#onSeparatorPointerDown} class="separator">${part.value}</span>`;
    }

    const partType = part.type as TimePartType,
      formatParts = getDateFormat(locale),
      timePartTypes = formatParts.filter(p => p.type !== 'literal').map(p => p.type),
      timePartIndex = timePartTypes.indexOf(partType),
      placeholder = getTimeUnitLetter(locale, partType).repeat(part.value.length),
      currentValue = this.timeParts[partType],
      hasValue = currentValue !== undefined,
      displayValue = hasValue ? String(currentValue).padStart(part.value.length, '0') : placeholder,
      isHour = partType === 'hour',
      isValidHour = isHour && typeof currentValue === 'number' && currentValue >= 0 && currentValue <= 23,
      valueText = hasValue
        ? isHour
          ? isValidHour
            ? this.#getHourName(locale, currentValue)
            : String(currentValue).padStart(part.value.length, '0')
          : String(currentValue)
        : msg('Empty', { id: 'sl.timeField.empty' });

    return html`
      <span
        @beforeinput=${(e: Event) => e.preventDefault()}
        @blur=${this.#onPartBlur}
        @focus=${this.#onPartFocus}
        @keydown=${(e: KeyboardEvent) => this.#onPartKeydown(e, partType)}
        @paste=${this.#onPaste}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        aria-label=${getTimeUnitName(locale, partType)}
        aria-readonly=${this.readonly ? 'true' : 'false'}
        aria-valuemax=${this.#getMaxForType(partType)}
        aria-valuemin=${this.#getMinForType(partType)}
        aria-valuenow=${ifDefined(currentValue)}
        aria-valuetext=${valueText}
        class="${partType}s-spinbutton"
        contenteditable=${this.disabled ? 'false' : 'true'}
        inputmode="numeric"
        role="spinbutton"
        tabindex=${this.disabled ? '-1' : timePartIndex === this.#rovingIndex ? '0' : '-1'}
        >${displayValue}</span
      >
    `;
  }

  /**
   * Renders hour options (00–23) using hourStep, applies min/max constraints, and marks the selected hour with aria-selected.
   * Can be overridden.
   */
  renderHours(): TemplateResult[] {
    let hours = Array.from({ length: 24 / this.hourStep }, (_, i) => i * this.hourStep);

    if (this.min) {
      const minHour = this.#parseTime(this.min)?.hours;

      if (minHour !== undefined) {
        hours = hours.filter(h => h >= minHour);
      }
    }

    if (this.max) {
      const maxHour = this.#parseTime(this.max)?.hours;

      if (maxHour !== undefined) {
        hours = hours.filter(h => h <= maxHour);
      }
    }

    return hours.map(
      hour => html`
        <li
          @click=${() => this.#onHourClick(hour)}
          @keydown=${(event: KeyboardEvent) => this.#onHourKeydown(event, hour)}
          aria-selected=${hour === this.#valueAsNumbers?.hours}
          role="option"
          tabindex="-1"
        >
          ${hour.toString().padStart(2, '0')}
        </li>
      `
    );
  }

  /**
   * Renders minute options using minuteStep and marks the selected one with aria-selected.
   * Can be overridden.
   */
  renderMinutes(): TemplateResult[] {
    const minutes = Array.from({ length: 60 / this.minuteStep }, (_, i) => i * this.minuteStep);

    return minutes.map(minute => {
      const isDisabled = this.#isMinuteDisabled(minute);

      return html`
        <li
          @click=${() => this.#onMinuteClick(minute)}
          @keydown=${(event: KeyboardEvent) => this.#onMinuteKeydown(event, minute)}
          ?disabled=${isDisabled}
          aria-selected=${minute === this.#valueAsNumbers?.minutes && !isDisabled}
          role="option"
          tabindex=${ifDefined(isDisabled ? undefined : '-1')}
        >
          ${minute.toString().padStart(2, '0')}
        </li>
      `;
    });
  }

  /** @internal */
  override updateInternalValidity(): void {
    if (this.required && !this.value) {
      this.setCustomValidity(msg('Please enter a time.', { id: 'sl.timeField.valueMissing' }));
    } else if (this.input.value && (this.min || this.max)) {
      const time = this.#valueAsNumbers,
        minTime = this.min ? this.#parseTime(this.min) : undefined,
        maxTime = this.max ? this.#parseTime(this.max) : undefined;

      if (minTime && (time?.hours ?? 0) * 60 + (time?.minutes ?? 0) < minTime.hours * 60 + minTime.minutes) {
        this.setCustomValidity(
          msg(str`Please select a time that is no earlier than ${this.min}.`, {
            id: 'sl.timeField.validation.rangeUnderflow'
          })
        );
      } else if (maxTime && (time?.hours ?? 0) * 60 + (time?.minutes ?? 0) > maxTime.hours * 60 + maxTime.minutes) {
        this.setCustomValidity(
          msg(str`Please select a time that is no later than ${this.max}.`, {
            id: 'sl.timeField.validation.rangeOverflow'
          })
        );
      } else {
        this.setCustomValidity('');
      }
    } else {
      this.setCustomValidity('');
    }
  }

  timeFormatCache: Record<string, DateFormatPart[]> = {};
  timeUnitCache: Record<string, Record<string, string>> = {};

  /** Returns the formatted date string for the select-all input. */
  #getFormattedValue(): string {
    const locale = this.locale ?? 'default',
      parts = getDateFormat(locale);

    return parts
      .map(part => {
        if (part.type === 'literal') {
          return part.value;
        }

        const partType = part.type as TimePartType,
          currentValue = this.timeParts[partType];

        if (currentValue !== undefined) {
          return String(currentValue).padStart(part.value.length, '0');
        }

        return getTimeUnitLetter(locale, partType).repeat(part.value.length);
      })
      .join('');
  }

  #getMaxForType(partType: TimePartType): number {
    switch (partType) {
      case 'hour':
        return 23;
      case 'minute':
        return 59;
    }
  }

  #getMinForType(partType: TimePartType): number {
    switch (partType) {
      case 'hour':
      case 'minute':
        return 0;
    }
  }

  #onBeforeToggle(event: ToggleEvent): void {
    if (event.newState === 'open') {
      this.button?.setAttribute('aria-expanded', 'true');
    } else {
      this.button?.setAttribute('aria-expanded', 'false');
      this.#popoverJustClosed = true;
    }
  }

  #onButtonClick(event: MouseEvent): void {
    event.stopPropagation();

    if (this.disabled || this.readonly) {
      return;
    }

    // Prevents the popover from reopening immediately after it was just closed
    if (!this.#popoverJustClosed) {
      this.dialog?.togglePopover();
    }
  }

  #onHourClick(hours: number): void {
    const constrainedMinutes = this.#getConstrainedMinutes(hours, this.#valueAsNumbers?.minutes ?? 0);

    this.#valueAsNumbers = { hours, minutes: constrainedMinutes };
    this.#value = this.#formatTime(this.#valueAsNumbers.hours, this.#valueAsNumbers.minutes);
    this.requestUpdate('value');

    this.changeEvent.emit(this.value ?? '');
    this.updateState({ dirty: true });
    this.updateValidity();
  }

  #onHourKeydown(event: KeyboardEvent, hours: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      this.#onHourClick(hours);
    }
  }

  #onSeparatorPointerDown(event: Event & { target: HTMLElement }): void {
    event.preventDefault();
    event.stopImmediatePropagation();

    (event.target.previousElementSibling as HTMLElement)?.focus();
  }

  async #onKeydown(event: KeyboardEvent): Promise<void> {
    if (event.key === 'Escape') {
      // Prevents the Escape key event from bubbling up, so that pressing 'Escape' inside the date field
      // does not close parent containers (such as dialogs).
      event.stopPropagation();
    } else if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();

      const activeElement = this.shadowRoot?.activeElement;
      if (!activeElement || !(activeElement instanceof HTMLLIElement)) {
        return;
      }

      const elements = Array.from(activeElement.parentElement?.querySelectorAll('li') ?? []).filter(
        li => !li.hasAttribute('disabled')
      );

      if (elements.length === 0) {
        return;
      }

      let index = elements.indexOf(activeElement);

      // If current element is not in the enabled list (e.g., it's disabled), start from first enabled
      if (index === -1) {
        index = 0;
      }

      if (event.key === 'ArrowUp') {
        index = index === 0 ? elements.length - 1 : index - 1;
      } else if (event.key === 'ArrowDown') {
        index = index === elements.length - 1 ? 0 : index + 1;
      }

      elements[index]?.focus();
      elements[index]?.scrollIntoView({ block: 'nearest' });
    } else if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();

      await this.#scrollAndFocusStartTime(event.key === 'ArrowRight' ? 'minute' : 'hour');
    }
  }

  #onMinuteClick(minute: number): void {
    if (this.#isMinuteDisabled(minute)) {
      return;
    }

    this.#valueAsNumbers = { hours: this.#valueAsNumbers?.hours ?? this.#startTime?.hours ?? 0, minutes: minute };
    this.#value = this.#formatTime(this.#valueAsNumbers.hours ?? 0, this.#valueAsNumbers.minutes ?? 0);
    this.requestUpdate('value');

    this.changeEvent.emit(this.value ?? '');
    this.updateState({ dirty: true });
    this.updateValidity();

    this.dialog?.hidePopover();
    this.renderRoot.querySelector<HTMLElement>('span[role="spinbutton"]')?.focus();
  }

  #onMinuteKeydown(event: KeyboardEvent, minutes: number): void {
    if (this.#isMinuteDisabled(minutes)) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      this.#onMinuteClick(minutes);
    }
  }

  #onPartBlur(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as HTMLElement | null,
      isSpinbutton = relatedTarget?.getAttribute('role') === 'spinbutton' && this.renderRoot.contains(relatedTarget);

    if (!isSpinbutton) {
      this.renderRoot.ownerDocument.getSelection()?.removeAllRanges();

      if (!this.contains(relatedTarget) && !this.renderRoot.contains(relatedTarget)) {
        this.blurEvent.emit();
        this.updateState({ touched: true });
        this.updateValidity();
      }
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

    if (index === 0) {
      this.focusEvent.emit();
    }

    // Workaround for WebKit changing the selection on focus.
    requestAnimationFrame(() => this.#selectContent(span));
  }

  #onPartKeydown(event: KeyboardEvent, partType: TimePartType): void {
    const span = event.target as HTMLElement;

    // Check if the pressed key is a separator character
    const locale = this.locale ?? 'default',
      parts = getDateFormat(locale),
      separators = parts.filter((p: DateFormatPart) => p.type === 'literal').map((p: DateFormatPart) => p.value);

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

      if (this.readonly) {
        return;
      }

      const digit = parseInt(event.key, 10);
      this.#applyDigitToTimePart(partType, digit);

      // Auto-advance when max digits (2) reached
      if (this.#enteredDigits >= 2) {
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
        if (!this.readonly) {
          this.#adjustTimePart(partType, 1);
          this.#selectContent(span);
          this.#trySetValue();
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.readonly) {
          this.#adjustTimePart(partType, -1);
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
        if (!this.readonly) {
          this.timeParts = { ...this.timeParts, [partType]: undefined };
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

    // Backspace/Delete clears the value and time parts
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      this.timeParts = {};
      this.#enteredDigits = 0;
      this.value = undefined;
      this.changeEvent.emit(this.value ?? '');
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

  #exitSelectAll(refocus = false): void {
    this.selectAll = false;

    if (refocus) {
      requestAnimationFrame(() => {
        this.renderRoot.querySelector<HTMLElement>('span[role="spinbutton"]')?.focus();
      });
    }
  }

  /** Returns the formatted date string for the select-all input. */
  // #getFormattedValue(): string {
  //   const locale = this.locale ?? 'default',
  //     parts = this.getTimeFormat(locale);

  //   return parts
  //     .map(part => {
  //       if (part.type === 'literal') {
  //         return part.value;
  //       }

  //       const partType = part.type as TimePartType,
  //         currentValue = this.timeParts[partType];

  //       if (currentValue !== undefined) {
  //         return String(currentValue).padStart(part.value.length, '0');
  //       }

  //       return getDateUnitLetter(locale, partType).repeat(part.value.length);
  //     })
  //     .join('');
  // }

  #getHourName(locale: string, hour: number): string {
    const date = new Date(2000, 0, 1, hour, 0, 0, 0);
    return new Intl.DateTimeFormat(locale !== 'default' ? locale : undefined, {
      hour: '2-digit',
      hourCycle: 'h23'
    }).format(date);
  }

  #selectContent(span: HTMLElement): void {
    const range = document.createRange();
    range.selectNodeContents(span);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  #moveFocus(span: HTMLElement, direction: number): void {
    const spans = Array.from(this.renderRoot.querySelectorAll<HTMLElement>('span[role="spinbutton"]')),
      index = spans.indexOf(span),
      next = spans[index + direction];

    if (next) {
      next.focus();
    }
  }

  #applyDigitToTimePart(partType: TimePartType, digit: number): void {
    const currentValue = this.timeParts[partType],
      maxValue = this.#getMaxForType(partType);

    let newValue: number;

    if (currentValue === undefined || this.#enteredDigits === 0) {
      newValue = digit;
    } else {
      const combined = currentValue * 10 + digit;
      newValue = combined > maxValue ? digit : combined;
    }

    this.timeParts = { ...this.timeParts, [partType]: newValue };
    this.#enteredDigits++;
  }

  #adjustTimePart(partType: TimePartType, delta: number): void {
    const startTime = this.#getStartTime(),
      currentValue = this.timeParts[partType] ?? (partType === 'hour' ? startTime.hours : startTime.minutes),
      maxValue = this.#getMaxForType(partType),
      newValue = (((currentValue + delta) % (maxValue + 1)) + (maxValue + 1)) % (maxValue + 1);

    this.timeParts = { ...this.timeParts, [partType]: newValue };
    this.#enteredDigits = 0;
  }

  #trySetValue(): void {
    const { hour, minute } = this.timeParts;

    if (hour !== undefined && minute !== undefined) {
      const constrainedMinutes = this.#getConstrainedMinutes(hour, minute);

      this.#valueAsNumbers = { hours: hour, minutes: constrainedMinutes };
      this.#value = this.#formatTime(hour, constrainedMinutes);
      this.input.value = this.#value ?? '';
      this.requestUpdate('value');

      this.#scrollTimeIntoView(hour, constrainedMinutes);
      this.changeEvent.emit(this.value ?? '');
      this.updateState({ dirty: true });
      this.updateValidity();
    } else {
      this.#valueAsNumbers = undefined;
      this.#value = undefined;
      this.input.value = '';
      this.requestUpdate('value');
      this.updateValidity();
    }
  }

  #onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    if (this.readonly || this.disabled) {
      return;
    }

    const text = event.clipboardData?.getData('text/plain') ?? '',
      time = this.#parseTime(text);

    if (time && !Number.isNaN(time.hours) && !Number.isNaN(time.minutes)) {
      this.#valueAsNumbers = time;
      this.#value = this.#formatTime(time.hours, time.minutes);
      this.input.value = this.#value ?? '';
      this.requestUpdate('value');

      this.changeEvent.emit(this.value ?? '');
      this.updateState({ dirty: true });
      this.updateValidity();
    }
  }

  async #onToggle(event: ToggleEvent): Promise<void> {
    if (event.newState === 'closed') {
      this.#popoverJustClosed = false;
    } else {
      await this.#scrollAndFocusStartTime();
    }
  }

  #formatTime(hours: number, minutes: number): string | undefined {
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return undefined;
    }

    return `${hours.toString().padStart(2, '0')}${this.#getTimeSeparator()}${minutes.toString().padStart(2, '0')}`;
  }

  #isMinuteDisabled(minutes: number): boolean {
    const hour = this.#valueAsNumbers?.hours ?? this.#startTime?.hours ?? 0;

    if (this.min) {
      const minTime = this.#parseTime(this.min);

      if (minTime && hour === minTime.hours && minutes < minTime.minutes) {
        return true;
      }
    }

    if (this.max) {
      const maxTime = this.#parseTime(this.max);

      if (maxTime && hour === maxTime.hours && minutes > maxTime.minutes) {
        return true;
      }
    }

    return false;
  }

  #parseTime(value: string): { hours: number; minutes: number } | undefined {
    const timeParts = value.split(this.#getTimeSeparator()).map(Number);

    if (timeParts.length === 2) {
      return { hours: timeParts[0], minutes: timeParts[1] };
    } else {
      return undefined;
    }
  }

  #getStartTime(): { hours: number; minutes: number } {
    let time = this.#valueAsNumbers;
    if (!time && this.start) {
      time = this.#parseTime(this.start);
    }

    // Fallback to the current time, with minutes set to 0
    time ||= { hours: new Date().getHours(), minutes: 0 };

    return time;
  }

  #getConstrainedMinutes(hours: number, minutes: number): number {
    const minTime = this.min ? this.#parseTime(this.min) : undefined,
      maxTime = this.max ? this.#parseTime(this.max) : undefined;

    if (minTime && hours === minTime.hours && minutes < minTime.minutes) {
      const constrained = Math.ceil(minTime.minutes / this.minuteStep) * this.minuteStep;
      return Math.min(Math.max(constrained, 0), 59);
    }

    if (maxTime && hours === maxTime.hours && minutes > maxTime.minutes) {
      const constrained = Math.floor(maxTime.minutes / this.minuteStep) * this.minuteStep;
      return Math.min(Math.max(constrained, 0), 59);
    }

    return Math.min(Math.max(minutes, 0), 59);
  }

  #getTimeSeparator(): string {
    const locale = this.locale && this.locale !== 'default' ? this.locale : undefined;

    if (locale && timeSeparators.has(locale)) {
      return timeSeparators.get(locale)!;
    }

    const formatter = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }),
      parts = formatter.formatToParts(new Date()),
      separator = parts.find(part => part.type === 'literal')?.value ?? ':';

    timeSeparators.set(this.locale || 'default', separator);

    return separator;
  }

  async #scrollAndFocusStartTime(focus: 'hour' | 'minute' = 'hour'): Promise<void> {
    const time = (this.#startTime = { ...this.#getStartTime() }),
      minTime = this.min ? this.#parseTime(this.min) : undefined,
      maxTime = this.max ? this.#parseTime(this.max) : undefined;

    // Find the closest hour and minute based on the steps
    time.hours = Math.round(time.hours / this.hourStep) * this.hourStep;
    time.minutes = Math.round(time.minutes / this.minuteStep) * this.minuteStep;

    // Apply min/max constraints
    if (minTime && (time.hours < minTime.hours || (time.hours === minTime.hours && time.minutes < minTime.minutes))) {
      time.hours = minTime.hours;
      const roundedMinutes = Math.ceil(minTime.minutes / this.minuteStep) * this.minuteStep;

      if (roundedMinutes >= 60) {
        // When rounding up crosses the hour boundary (e.g. 10:59 with 5-minute steps),
        // Move to the next hour and reset minutes to 0, but avoid creating an invalid 24:xx time
        if (minTime.hours < 23) {
          time.hours = minTime.hours + 1;
          time.minutes = 0;
        } else {
          // Edge case: 23:59 with a step that would round to 60
          time.minutes = 59;
        }
      } else {
        time.minutes = roundedMinutes;
      }
    }

    if (maxTime && (time.hours > maxTime.hours || (time.hours === maxTime.hours && time.minutes > maxTime.minutes))) {
      time.hours = maxTime.hours;
      time.minutes = Math.floor(maxTime.minutes / this.minuteStep) * this.minuteStep;
    }

    // Request update after calculating constrained time and then await it
    this.requestUpdate();
    await this.updateComplete;

    // Scroll to the start time
    this.#scrollTimeIntoView(time.hours, time.minutes, 'start');

    // Focus the appropriate element
    this.#focusTimeElement(time.hours, time.minutes, focus);
  }

  #scrollTimeIntoView(hours: number, minutes?: number, block: ScrollLogicalPosition = 'nearest'): void {
    const hoursEl = this.renderRoot.querySelector<HTMLElement>('.hours')!,
      minutesEl = this.renderRoot.querySelector<HTMLElement>('.minutes')!;

    let minHour = 0;
    if (this.min) {
      minHour = this.#parseTime(this.min)?.hours ?? 0;
    }

    const hoursIndex = Math.floor((hours - minHour) / this.hourStep),
      minutesIndex = Math.floor((minutes ?? 0) / this.minuteStep);

    (hoursEl.children[hoursIndex] as HTMLElement)?.scrollIntoView({ block });

    if (minutes !== undefined) {
      (minutesEl.children[minutesIndex] as HTMLElement)?.scrollIntoView({ block });
    }
  }

  #focusTimeElement(hours: number, minutes: number, focus: 'hour' | 'minute'): void {
    const hoursEl = this.renderRoot.querySelector<HTMLElement>('.hours')!,
      minutesEl = this.renderRoot.querySelector<HTMLElement>('.minutes')!;

    let minHour = 0;
    if (this.min) {
      minHour = this.#parseTime(this.min)?.hours ?? 0;
    }

    const hoursIndex = Math.floor((hours - minHour) / this.hourStep),
      minutesIndex = Math.floor(minutes / this.minuteStep);

    if (focus === 'hour') {
      (hoursEl.children[hoursIndex] as HTMLElement)?.focus();
    } else if (focus === 'minute') {
      const targetMinuteEl = minutesEl.children[minutesIndex] as HTMLElement;

      if (targetMinuteEl?.hasAttribute('disabled')) {
        const firstEnabledMinute = Array.from(minutesEl.children).find(
          child => !child.hasAttribute('disabled')
        ) as HTMLElement;

        firstEnabledMinute?.focus();
      } else {
        targetMinuteEl?.focus();
      }
    }
  }

  /**
   * Syncs the input's lang attribute with the component's locale.
   */
  #syncInputLang(): void {
    if (!this.input) {
      return;
    }

    if (this.locale && this.locale !== 'default') {
      this.input.lang = this.locale;
    } else {
      this.input.removeAttribute('lang');
    }
  }
}
