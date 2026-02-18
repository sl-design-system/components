import { localized, msg, str } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin, type SlFormControlEvent, type SlUpdateStateEvent } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, LocaleMixin, anchor, event } from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { FieldButton, TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './time-field.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-time-field': TimeField;
  }
}

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
      'sl-icon': Icon,
      'sl-text-field': TextField
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

  /**
   * The start time; the time that has the initial focus when the picker is opened when
   * there is no value set.
   */
  #startTime?: { hours: number; minutes: number } | undefined;

  /**
   * Flag for indicating whether the selected range needs to be set on focus. If the user
   * directly clicked on the input, we don't want to override the selection.
   */
  #updateSelectedRangeOnFocus = true;

  /** The current value in numbers. */
  #valueAsNumbers: { hours: number; minutes: number } | undefined;

  /** The value in HH:mm format. */
  #value: string | undefined;

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

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal */
  @query('sl-field-button') button?: FieldButton;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<string>>;

  /** Whether the time field is disabled; when set no interaction is possible. */
  @property({ type: Boolean, reflect: true }) override disabled?: boolean;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** The step between each hour option. */
  @property({ type: Number, attribute: 'hour-step' }) hourStep = TimeField.hourStep;

  /** @internal The input element in the light DOM. */
  input!: HTMLInputElement;

  /** @internal The dialog element that is also the popover. */
  @query('dialog') dialog?: HTMLDialogElement;

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

  /**
   * The start time; the time that has the initial focus when the picker is opened without
   * a value. If will use the current time if not explicitly set.
   * @default undefined
   */
  @property() start?: string;

  /** @internal The text field. */
  @query('sl-text-field') textField!: TextField;

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
      } else {
        this.#value = undefined;
        this.#valueAsNumbers = undefined;
      }
    } else {
      this.#value = undefined;
      this.#valueAsNumbers = undefined;
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

    this.setFormControlElement(this.input);
    this.#syncInputLang();

    // This is a workaround, because :has is not working in Safari and Firefox with :host element as it works in Chrome
    const style = document.createElement('style');
    style.innerHTML = `
      sl-time-field:has(input:hover):not(:focus-within)::part(text-field) {
        --_bg-opacity: var(--sl-opacity-interactive-plain-hover);
      }
    `;
    this.prepend(style);
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

    if (changes.has('required') && this.textField) {
      this.textField.required = !!this.required;
    }

    this.#syncInputLang();
  }

  override render(): TemplateResult {
    return html`
      <sl-text-field
        @sl-blur=${this.#onTextFieldBlur}
        @sl-change=${this.#onTextFieldChange}
        @sl-focus=${this.#onTextFieldFocus}
        @sl-form-control=${this.#onTextFieldFormControl}
        @sl-update-state=${this.#onTextFieldUpdateState}
        @click=${this.#onTextFieldClick}
        @keydown=${this.#onTextFieldKeydown}
        @pointerdown=${this.#onTextFieldPointerDown}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?required=${this.required}
        input-size="10"
        part="text-field"
        placeholder=${ifDefined(this.placeholder)}
        show-validity=${ifDefined(this.showValidity)}
        value=${ifDefined(this.value)}
      >
        <slot name="input" slot="input"></slot>
        <sl-field-button
          @click=${this.#onButtonClick}
          ?disabled=${this.disabled || this.readonly}
          aria-label=${msg('Toggle dropdown', { id: 'sl.timeField.toggleDropdown' })}
          aria-controls="dialog"
          aria-expanded="false"
          aria-haspopup="listbox"
          slot="suffix"
          tabindex=${this.disabled || this.readonly ? '-1' : '0'}
        >
          <sl-icon name="clock"></sl-icon>
        </sl-field-button>
      </sl-text-field>

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

    return minutes.map(
      minute => html`
        <li
          @click=${() => this.#onMinuteClick(minute)}
          @keydown=${(event: KeyboardEvent) => this.#onMinuteKeydown(event, minute)}
          ?disabled=${this.#isMinuteDisabled(minute)}
          aria-selected=${minute === this.#valueAsNumbers?.minutes && !this.#isMinuteDisabled(minute)}
          role="option"
          tabindex="-1"
        >
          ${minute.toString().padStart(2, '0')}
        </li>
      `
    );
  }

  /** @internal */
  override updateInternalValidity(): void {
    if (!this.textField || !this.textField.input) {
      return;
    }

    const time = this.#parseTime(this.textField.input.value),
      isInvalidTime =
        !time ||
        Number.isNaN(time.hours) ||
        Number.isNaN(time.minutes) ||
        !this.#formatTime(time?.hours, time?.minutes);

    if (isInvalidTime && !!this.textField.input.value) {
      this.setCustomValidity(
        msg(str`Please enter a valid time in HH${this.#getTimeSeparator()}MM.`, { id: 'sl.timeField.typeMismatch' })
      );
    } else if (this.required && !this.value) {
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

  #onKeydown(event: KeyboardEvent): void {
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

      this.#scrollAndFocusStartTime(event.key === 'ArrowRight' ? 'minute' : 'hour');
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
    this.textField.focus();
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

  #onTextFieldBlur(event: SlBlurEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const time = this.#parseTime(this.textField.input.value);
    if (!time || Number.isNaN(time.hours) || Number.isNaN(time.minutes)) {
      this.#valueAsNumbers = undefined;
      this.#value = undefined;
      this.requestUpdate();

      this.changeEvent.emit(this.value ?? '');
    } else if (time && (time.hours !== this.#valueAsNumbers?.hours || time.minutes !== this.#valueAsNumbers?.minutes)) {
      this.#valueAsNumbers = time;
      this.#value = this.#formatTime(time.hours, time.minutes);
      this.requestUpdate();

      this.changeEvent.emit(this.value ?? '');

      this.#scrollTimeIntoView(time.hours, time.minutes);
    }

    this.blurEvent.emit();
    this.updateState({ touched: true });
    this.updateValidity();
  }

  #onTextFieldChange(event: SlChangeEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.updateState({ dirty: true });
    this.updateValidity();
  }

  #onTextFieldClick(event: MouseEvent): void {
    if (this.readonly || this.disabled) {
      return;
    }

    this.dialog?.showPopover();

    // If the user clicks on the input, show the dialog but focus the input
    if (event.target === this.input) {
      this.dialog?.addEventListener(
        'toggle',
        () => {
          this.#updateSelectedRangeOnFocus = false;
          this.textField.focus();
        },
        { once: true }
      );
    }
  }

  #onTextFieldFocus(event: SlFocusEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.focusEvent.emit();

    if (!this.readonly && this.#updateSelectedRangeOnFocus) {
      this.input.setSelectionRange(0, 2);
    }

    this.#updateSelectedRangeOnFocus = true;
  }

  #onTextFieldFormControl(event: SlFormControlEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  #onTextFieldKeydown(event: KeyboardEvent): void {
    if (this.readonly) {
      return;
    }

    const selectionStart = this.input.selectionStart || 0;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();

      let { hours, minutes } = this.#getStartTime();

      if (selectionStart < 3) {
        hours += event.key === 'ArrowUp' ? 1 : -1;
        hours = (hours + 24) % 24;

        if (this.min) {
          const minHour = this.#parseTime(this.min)?.hours;
          if (minHour !== undefined && hours <= minHour) {
            hours = minHour;
          }
        }

        if (this.max) {
          const maxHour = this.#parseTime(this.max)?.hours;
          if (maxHour !== undefined && hours > maxHour) {
            hours = maxHour;
          }
        }
      } else {
        minutes += event.key === 'ArrowUp' ? 1 : -1;
        minutes = (minutes + 60) % 60;

        if (this.min) {
          const minTime = this.#parseTime(this.min);
          if (minTime !== undefined) {
            if (hours < minTime.hours) {
              hours = minTime.hours;
              minutes = minTime.minutes;
            } else if (hours === minTime.hours && minutes < minTime.minutes) {
              minutes = minTime.minutes;
            }
          }
        }

        if (this.max) {
          const maxTime = this.#parseTime(this.max);
          if (maxTime !== undefined) {
            if (hours > maxTime.hours) {
              hours = maxTime.hours;
              minutes = maxTime.minutes;
            } else if (hours === maxTime.hours && minutes > maxTime.minutes) {
              minutes = maxTime.minutes;
            }
          }
        }
      }

      this.#valueAsNumbers = { hours, minutes };
      this.#value = this.#formatTime(hours, minutes);

      this.input.value = this.#value ?? '';
      this.input.setSelectionRange(selectionStart < 3 ? 0 : 3, selectionStart < 3 ? 2 : 5);

      this.#scrollTimeIntoView(hours, minutes);

      this.changeEvent.emit(this.value ?? '');

      this.requestUpdate();
    } else if (event.key === 'ArrowRight' && (selectionStart === 2 || this.input.selectionEnd === 2)) {
      event.preventDefault();

      this.input.setSelectionRange(3, 5);
    } else if (event.key === 'ArrowLeft' && selectionStart === 3) {
      event.preventDefault();

      this.input.setSelectionRange(0, 2);
    } else if (event.key === this.#getTimeSeparator() && this.input.value.includes(this.#getTimeSeparator())) {
      event.preventDefault();

      this.input.setSelectionRange(3, 5);
    }
  }

  #onTextFieldPointerDown(event: Event): void {
    if (event.target === this.input) {
      // If the user directly clicked on the input, we don't want to override the selection on focus
      this.#updateSelectedRangeOnFocus = false;
    }
  }

  #onTextFieldUpdateState(event: SlUpdateStateEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.updateValidity();
  }

  #onToggle(event: ToggleEvent): void {
    if (event.newState === 'closed') {
      this.#popoverJustClosed = false;
    } else {
      this.#scrollAndFocusStartTime();
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

  #scrollAndFocusStartTime(focus: 'hour' | 'minute' = 'hour'): void {
    const time = (this.#startTime = this.#getStartTime()),
      minTime = this.min ? this.#parseTime(this.min) : undefined,
      maxTime = this.max ? this.#parseTime(this.max) : undefined;

    this.requestUpdate();

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
}
