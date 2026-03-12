import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, LocaleMixin, anchor, event, isPopoverOpen } from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { FieldButton } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './time-field.scss.js';
import {
  type DateFormatPart,
  type PartialTimePart,
  TimePart,
  getDateFormat,
  getTimeUnitLetter,
  getTimeUnitName
} from './utils.js';

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
  /** @internal */
  static formAssociated = true;

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
   * Flag indicating that focus should not be restored to the text-field when the popover
   * closes. This is set when focus moves away from the dialog to either an internal control
   * (e.g. the clock button via Shift+Tab) or outside the component (e.g. via Tab).
   */
  #focusLeavingComponent = false;

  /** Track when the popover is in the process of closing. */
  #popoverClosing = false;

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
  #startTime?: TimePart | undefined;

  /** The current value in numbers. */
  #valueAsNumbers: TimePart | undefined;

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

  /** @internal */
  readonly internals = this.attachInternals();

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
   * but you can still pick a time via the popover.
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
  @state() timeParts: PartialTimePart = {};

  override get value(): string | undefined {
    return this.#value;
  }

  @property()
  override set value(value: string | undefined) {
    if (value) {
      const time = this.#parseTime(value);

      if (time && !Number.isNaN(time.hour) && !Number.isNaN(time.minute)) {
        this.#value = this.#formatTime(time.hour, time.minute);
        this.#valueAsNumbers = time;
        this.timeParts = { hour: time.hour, minute: time.minute };
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

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    this.updateValidity();
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('start')) {
      this.#startTime = this.start ? this.#parseTime(this.start) : undefined;
    }

    if (changes.has('timeParts') || changes.has('placeholder') || changes.has('value')) {
      if (this.value || this.timeParts.hour !== undefined || this.timeParts.minute !== undefined) {
        this.placeholderShown = false;
      } else if (this.placeholder) {
        this.placeholderShown = true;
      } else {
        this.placeholderShown = false;
      }
    }

    if (changes.has('placeholderShown')) {
      if (this.placeholderShown) {
        this.internals.states.add('placeholder-shown');
      } else {
        this.internals.states.delete('placeholder-shown');
      }
    }

    if (changes.has('value')) {
      if (this.value) {
        this.internals.states.add('has-value');
      } else {
        this.internals.states.delete('has-value');
      }

      this.internals.setFormValue(this.value || null);
    }

    if (changes.has('min') || changes.has('max') || changes.has('required') || changes.has('value')) {
      this.updateValidity();
    }
  }

  override focus(): void {
    const selectAll = this.renderRoot.querySelector<HTMLElement>('.select-all');

    if (selectAll) {
      selectAll.focus();
      return;
    }

    this.renderRoot.querySelector<HTMLElement>('span[role="spinbutton"]')?.focus();
  }

  override render(): TemplateResult {
    const locale = this.locale || 'default',
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
          aria-expanded=${this.dialog && isPopoverOpen(this.dialog) ? 'true' : 'false'}
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
        @focusin=${this.#onDialogFocusin}
        @focusout=${this.#onDialogFocusout}
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
      valueText = hasValue
        ? String(currentValue).padStart(part.value.length, '0')
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
        aria-readonly=${this.readonly || this.selectOnly ? 'true' : 'false'}
        aria-valuemax=${this.#getMaxForType(partType)}
        aria-valuemin=${this.#getMinForType(partType)}
        aria-valuenow=${ifDefined(currentValue)}
        aria-valuetext=${valueText}
        contenteditable=${this.disabled || this.readonly || this.selectOnly ? 'false' : 'true'}
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
      const minHour = this.#parseTime(this.min)?.hour;

      if (minHour !== undefined) {
        hours = hours.filter(h => h >= minHour);
      }
    }

    if (this.max) {
      const maxHour = this.#parseTime(this.max)?.hour;

      if (maxHour !== undefined) {
        hours = hours.filter(h => h <= maxHour);
      }
    }

    return hours.map(
      hour => html`
        <li
          @click=${() => this.#onHourClick(hour)}
          @keydown=${(event: KeyboardEvent) => this.#onHourKeydown(event, hour)}
          aria-selected=${hour === this.#valueAsNumbers?.hour}
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
          aria-selected=${minute === this.#valueAsNumbers?.minute && !isDisabled}
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
    // Don't override custom validity set by the user
    if (this.validity.customError) {
      return;
    }

    const { hour, minute } = this.timeParts,
      hasCompleteTime = hour !== undefined && minute !== undefined;

    // Check for incomplete time with partial input (bad input)
    if (hasCompleteTime && !this.value) {
      const completeParts = this.timeParts as TimePart, // safe: hasCompleteTime guarantees both are defined
        minTime = this.min ? this.#parseTime(this.min) : undefined,
        maxTime = this.max ? this.#parseTime(this.max) : undefined;

      if (minTime && this.#compareTimes(completeParts, minTime) < 0) {
        this.internals.setValidity(
          { rangeUnderflow: true },
          msg(str`Please select a time that is no earlier than ${this.min}.`, {
            id: 'sl.timeField.rangeUnderflow'
          })
        );
        return;
      } else if (maxTime && this.#compareTimes(completeParts, maxTime) > 0) {
        this.internals.setValidity(
          { rangeOverflow: true },
          msg(str`Please select a time that is no later than ${this.max}.`, {
            id: 'sl.timeField.rangeOverflow'
          })
        );
        return;
      } else {
        this.internals.setValidity(
          { badInput: true },
          msg('Please enter a valid time.', { id: 'sl.timeField.typeMismatch' })
        );
        return;
      }
    }

    // Check for required field without value
    if (this.required && !this.value) {
      this.internals.setValidity(
        { valueMissing: true },
        msg('Please enter a time.', { id: 'sl.timeField.valueMissing' })
      );
      return;
    }

    // Check for value below minimum
    if (this.value && this.min && this.value < this.min) {
      this.internals.setValidity(
        { rangeUnderflow: true },
        msg(str`Please select a time that is no earlier than ${this.min}.`, {
          id: 'sl.timeField.rangeUnderflow'
        })
      );
      return;
    }

    // Check for value above maximum
    if (this.value && this.max && this.value > this.max) {
      this.internals.setValidity(
        { rangeOverflow: true },
        msg(str`Please select a time that is no later than ${this.max}.`, {
          id: 'sl.timeField.rangeOverflow'
        })
      );
      return;
    }

    // All valid - clear any validity errors
    this.internals.setValidity({});
  }

  /** Returns the formatted time string for the select-all input. */
  #getFormattedValue(): string {
    const locale = this.locale || 'default',
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
      this.#popoverClosing = true;
      this.button?.setAttribute('aria-expanded', 'false');
      this.#popoverJustClosed = true;
    }
  }

  #onDialogFocusin(event: FocusEvent): void {
    const target = event.target;

    if (!(target instanceof HTMLLIElement)) {
      return;
    }

    // Reset previously focused <li> so only one has tabindex="0"
    this.dialog?.querySelectorAll('li[tabindex="0"]').forEach(li => {
      if (li !== target) {
        li.setAttribute('tabindex', '-1');
      }
    });

    target.tabIndex = 0;
  }

  #onDialogFocusout(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget;

    if (
      this.#popoverClosing ||
      !(relatedTarget instanceof Node) ||
      this.dialog?.contains(relatedTarget) ||
      this.renderRoot.contains(relatedTarget)
    ) {
      return;
    }

    this.#focusLeavingComponent = true;
    this.dialog?.hidePopover();
  }

  #onFocusIn = (event: FocusEvent): void => {
    // Only emit when focus enters from outside the component
    const relatedTarget = event.relatedTarget;

    if (!relatedTarget || (!this.contains(relatedTarget) && !this.shadowRoot?.contains(relatedTarget))) {
      this.focusEvent.emit();
    }

    this.placeholderShown = false;
  };

  #onFocusOut = (event: FocusEvent): void => {
    // Check if focus is leaving the component entirely
    const relatedTarget = event.relatedTarget;
    const leavingComponent =
      !(relatedTarget instanceof Node) || (!this.contains(relatedTarget) && !this.shadowRoot?.contains(relatedTarget));

    if (leavingComponent) {
      // Update form state and emit blur event
      this.placeholderShown = !this.value && !!this.placeholder;
      this.blurEvent.emit();
      this.updateState({ touched: true });
      this.updateValidity();

      // Handle popover closing
      const dialogIsOpen = isPopoverOpen(this.dialog);
      if (dialogIsOpen) {
        // Only mark as "focus leaving" when the popover is not already in the process of closing
        if (!this.#popoverClosing) {
          this.#focusLeavingComponent = true;
        }
        this.dialog?.hidePopover();
      }
    }
  };

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

  #onHourClick(hour: number): void {
    const constrainedMinutes = this.#getConstrainedMinutes(hour, this.#valueAsNumbers?.minute ?? 0);

    this.#valueAsNumbers = { hour, minute: constrainedMinutes };
    this.#value = this.#formatTime(this.#valueAsNumbers.hour, this.#valueAsNumbers.minute);
    const { hour: normalizedHours, minute: normalizedMinutes } = this.#valueAsNumbers;
    this.timeParts = { hour: normalizedHours, minute: normalizedMinutes };
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

    this.#valueAsNumbers = { hour: this.#valueAsNumbers?.hour ?? this.#startTime?.hour ?? 0, minute: minute };
    this.#value = this.#formatTime(this.#valueAsNumbers.hour ?? 0, this.#valueAsNumbers.minute ?? 0);
    const { hour: normalizedHours, minute: normalizedMinutes } = this.#valueAsNumbers;
    this.timeParts = { hour: normalizedHours, minute: normalizedMinutes };
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

  #onPartKeydown(event: KeyboardEvent, partType: TimePartType): void {
    const span = event.target as HTMLElement;

    // Check if the pressed key is a separator character
    const locale = this.locale || 'default',
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
        if (!this.readonly && !this.selectOnly) {
          this.#adjustTimePart(partType, 1);
          this.#selectContent(span);
          this.#trySetValue();
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.readonly && !this.selectOnly) {
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
          this.timeParts = {
            hour: partType === 'hour' ? undefined : this.timeParts.hour,
            minute: partType === 'minute' ? undefined : this.timeParts.minute
          };
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

  #selectContent(span: HTMLElement): void {
    const ownerDocument = span.ownerDocument;

    if (!ownerDocument) {
      return;
    }

    const selection = ownerDocument.getSelection();

    if (!selection) {
      return;
    }

    selection.removeAllRanges();

    // Prefer setBaseAndExtent when available (consistent with other components),
    // fall back to using a Range otherwise.
    if (typeof selection.setBaseAndExtent === 'function') {
      selection.setBaseAndExtent(span, 0, span, span.childNodes.length);
    } else {
      const range = ownerDocument.createRange();
      range.selectNodeContents(span);
      selection.addRange(range);
    }
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

    this.timeParts = {
      hour: partType === 'hour' ? newValue : this.timeParts.hour,
      minute: partType === 'minute' ? newValue : this.timeParts.minute
    };
    this.#enteredDigits++;
  }

  #adjustTimePart(partType: TimePartType, delta: number): void {
    const startTime = this.#getStartTime(),
      currentValue = this.timeParts[partType] ?? (partType === 'hour' ? startTime.hour : startTime.minute),
      maxValue = this.#getMaxForType(partType),
      minTime = this.min ? this.#parseTime(this.min) : undefined,
      maxTime = this.max ? this.#parseTime(this.max) : undefined,
      wrapped = ((((currentValue || 0) + delta) % (maxValue + 1)) + (maxValue + 1)) % (maxValue + 1),
      currentHour = this.timeParts.hour ?? startTime.hour,
      effectiveMin =
        partType === 'hour'
          ? (minTime?.hour ?? 0)
          : minTime && currentHour === minTime.hour
            ? (minTime.minute ?? 0)
            : 0,
      effectiveMax =
        partType === 'hour'
          ? (maxTime?.hour ?? maxValue)
          : maxTime && currentHour === maxTime.hour
            ? (maxTime.minute ?? maxValue)
            : maxValue,
      newValue = Math.min(Math.max(wrapped, effectiveMin), effectiveMax);

    this.timeParts = {
      hour: partType === 'hour' ? newValue : this.timeParts.hour,
      minute: partType === 'minute' ? newValue : this.timeParts.minute
    };
    this.#enteredDigits = 0;
  }

  /**
   * Compares two time objects.
   * @param time1 The first time as a TimePart object.
   * @param time2 The second time as a TimePart object.
   * @returns A negative number if time1 is earlier than time2, a positive number if time1 is later than time2, or 0 if they are equal.
   */
  #compareTimes(time1: TimePart, time2: TimePart): number {
    const totalMinutes1 = time1.hour * 60 + time1.minute,
      totalMinutes2 = time2.hour * 60 + time2.minute;

    return totalMinutes1 - totalMinutes2;
  }

  #trySetValue(): void {
    const { hour, minute } = this.timeParts;

    if (hour !== undefined && minute !== undefined) {
      const constrainedMinutes = this.#getConstrainedMinutes(hour, minute);

      this.#valueAsNumbers = { hour, minute: constrainedMinutes };
      this.#value = this.#formatTime(hour, constrainedMinutes);
      this.requestUpdate('value');

      this.#scrollTimeIntoView(hour, constrainedMinutes);
      this.changeEvent.emit(this.value ?? '');
      this.updateState({ dirty: true });
      this.updateValidity();
    } else {
      this.#valueAsNumbers = undefined;
      this.#value = undefined;
      this.requestUpdate('value');
      this.updateValidity();
    }
  }

  #onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    if (this.readonly || this.disabled || this.selectOnly) {
      return;
    }

    const text = event.clipboardData?.getData('text/plain') ?? '',
      time = this.#parseTime(text);

    if (time && !Number.isNaN(time.hour) && !Number.isNaN(time.minute)) {
      this.#valueAsNumbers = time;
      this.#value = this.#formatTime(time.hour, time.minute);
      const { hour: normalizedHours, minute: normalizedMinutes } = this.#valueAsNumbers;
      this.timeParts = { hour: normalizedHours, minute: normalizedMinutes };

      this.requestUpdate('value');

      this.changeEvent.emit(this.value ?? '');
      this.updateState({ dirty: true });
      this.updateValidity();
    }
  }

  async #onToggle(event: ToggleEvent): Promise<void> {
    if (event.newState === 'closed') {
      if (!this.#focusLeavingComponent) {
        this.renderRoot.querySelector<HTMLElement>('span[role="spinbutton"]')?.focus();
      }

      this.#popoverClosing = false;
      this.#popoverJustClosed = false;
      this.#focusLeavingComponent = false;
    } else {
      await this.#scrollAndFocusStartTime();
    }
  }

  #formatTime(hours: number | undefined, minutes: number | undefined): string | undefined {
    if (hours === undefined || minutes === undefined || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return undefined;
    }

    return `${hours.toString().padStart(2, '0')}${this.#getTimeSeparator()}${minutes.toString().padStart(2, '0')}`;
  }

  #isMinuteDisabled(minutes: number): boolean {
    const hour = this.#valueAsNumbers?.hour ?? this.#startTime?.hour ?? 0;

    if (this.min) {
      const minTime = this.#parseTime(this.min);

      if (minTime && hour === minTime.hour && minutes < (minTime.minute ?? 0)) {
        return true;
      }
    }

    if (this.max) {
      const maxTime = this.#parseTime(this.max);

      if (maxTime && hour === maxTime.hour && minutes > (maxTime.minute ?? 59)) {
        return true;
      }
    }

    return false;
  }

  #parseTime(value: string): TimePart | undefined {
    const timeParts = value.split(this.#getTimeSeparator()).map(Number);

    if (timeParts.length === 2) {
      return { hour: timeParts[0], minute: timeParts[1] };
    } else {
      return undefined;
    }
  }

  #getStartTime(): TimePart {
    let time = this.#valueAsNumbers;
    if (!time && this.start) {
      time = this.#parseTime(this.start);
    }

    // Fallback to the current time, with minutes set to 0
    time ||= { hour: new Date().getHours(), minute: 0 };

    return time;
  }

  #getConstrainedMinutes(hours: number, minutes: number): number {
    const minTime = this.min ? this.#parseTime(this.min) : undefined,
      maxTime = this.max ? this.#parseTime(this.max) : undefined;

    if (minTime && hours === minTime.hour && minutes < (minTime.minute ?? 0)) {
      const constrained = Math.ceil((minTime.minute ?? 0) / this.minuteStep) * this.minuteStep;
      return Math.min(Math.max(constrained, 0), 59);
    }

    if (maxTime && hours === maxTime.hour && minutes > (maxTime.minute ?? 59)) {
      const constrained = Math.floor((maxTime.minute ?? 59) / this.minuteStep) * this.minuteStep;
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
    time.hour = Math.round(time.hour / this.hourStep) * this.hourStep;
    time.minute = Math.round(time.minute / this.minuteStep) * this.minuteStep;

    // Apply min/max constraints
    if (minTime && (time.hour < minTime.hour || (time.hour === minTime.hour && time.minute < minTime.minute))) {
      time.hour = minTime.hour;
      const roundedMinutes = Math.ceil(minTime.minute / this.minuteStep) * this.minuteStep;

      if (roundedMinutes >= 60) {
        // When rounding up crosses the hour boundary (e.g. 10:59 with 5-minute steps),
        // Move to the next hour and reset minutes to 0, but avoid creating an invalid 24:xx time
        if (minTime.hour < 23) {
          time.hour = minTime.hour + 1;
          time.minute = 0;
        } else {
          // Edge case: 23:59 with a step that would round to 60
          time.minute = 59;
        }
      } else {
        time.minute = roundedMinutes;
      }
    }

    if (maxTime && (time.hour > maxTime.hour || (time.hour === maxTime.hour && time.minute > maxTime.minute))) {
      time.hour = maxTime.hour;
      time.minute = Math.floor(maxTime.minute / this.minuteStep) * this.minuteStep;
    }

    // Request update after calculating constrained time and then await it
    this.requestUpdate();
    await this.updateComplete;

    // Scroll to the start time
    this.#scrollTimeIntoView(time.hour, time.minute, 'start');

    // Focus the appropriate element
    this.#focusTimeElement(time.hour, time.minute, focus);
  }

  #scrollTimeIntoView(hours: number, minutes?: number, block: ScrollLogicalPosition = 'nearest'): void {
    const hoursEl = this.renderRoot.querySelector<HTMLElement>('.hours')!,
      minutesEl = this.renderRoot.querySelector<HTMLElement>('.minutes')!;

    let minHour = 0;
    if (this.min) {
      minHour = this.#parseTime(this.min)?.hour ?? 0;
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
      minHour = this.#parseTime(this.min)?.hour ?? 0;
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
}
