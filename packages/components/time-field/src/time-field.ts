import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormControlMixin, type SlFormControlEvent, type SlUpdateStateEvent } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { Listbox } from '@sl-design-system/listbox';
import { type EventEmitter, anchor, event } from '@sl-design-system/shared';
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

/**
 * A time field control for selecting a time.
 */
@localized()
export class TimeField extends FormControlMixin(ScopedElementsMixin(LitElement)) {
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
      'sl-listbox': Listbox,
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

  /** The current value in numbers. */
  #valueAsNumbers: { hours: number; minutes: number } | undefined;

  /** The value in HH:mm format. */
  #value: string | undefined;

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

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

  /** @internal The listbox element that is also the popover. */
  @query('[part="listbox"]') listbox?: HTMLSlotElement;

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

  /** The start time of the field. If not set, it will use the current time. */
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

      this.#value = this.#formatTime(time?.hours ?? 0, time?.minutes ?? 0);
      this.#valueAsNumbers = time;
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

    // This is a workaround, because :has is not working in Safari and Firefox with :host element as it works in Chrome
    const style = document.createElement('style');
    style.innerHTML = `
      sl-time-field:has(input:hover):not(:focus-within)::part(text-field) {
        --_bg-opacity: var(--sl-opacity-interactive-plain-hover);
      }
    `;
    this.prepend(style);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

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
          slot="suffix"
          tabindex=${this.disabled || this.readonly ? '-1' : '0'}
        >
          <sl-icon name="clock"></sl-icon>
        </sl-field-button>
      </sl-text-field>

      <sl-listbox
        ${anchor({
          element: this,
          offset: TimeField.offset,
          position: 'bottom-start',
          viewportMargin: TimeField.viewportMargin
        })}
        @beforetoggle=${this.#onBeforeToggle}
        @toggle=${this.#onToggle}
        @keydown=${this.#onKeydown}
        part="listbox"
        popover
      >
        <div class="wrapper">
          <div class="hours" tabindex="-1">
            ${Array.from({ length: 24 / this.hourStep }, (_, i) => {
              const hour = i * this.hourStep,
                hourString = hour.toString().padStart(2, '0');

              return html`
                <button
                  @click=${() => this.#onHourClick(hour)}
                  @keydown=${(event: KeyboardEvent) => this.#onHourKeydown(event, hour)}
                  ?selected=${hour === this.#valueAsNumbers?.hours}
                  tabindex="-1"
                >
                  ${hourString}
                </button>
              `;
            })}
          </div>
          <div class="separator"></div>
          <div class="minutes" tabindex="-1">
            ${Array.from({ length: 60 / this.minuteStep }, (_, i) => {
              const minute = i * this.minuteStep,
                minuteString = minute.toString().padStart(2, '0');

              return html`
                <button
                  @click=${() => this.#onMinuteClick(minute)}
                  @keydown=${(event: KeyboardEvent) => this.#onMinuteKeydown(event, minute)}
                  ?selected=${minute === this.#valueAsNumbers?.minutes}
                  tabindex="-1"
                >
                  ${minuteString}
                </button>
              `;
            })}
          </div>
        </div>
      </sl-listbox>
    `;
  }

  #onBeforeToggle(event: ToggleEvent): void {
    if (event.newState === 'open') {
      this.input.setAttribute('aria-expanded', 'true');
    } else {
      this.input.setAttribute('aria-expanded', 'false');
      this.#popoverJustClosed = true;
    }
  }

  #onButtonClick(): void {
    // Prevents the popover from reopening immediately after it was just closed
    if (!this.#popoverJustClosed) {
      this.listbox?.togglePopover();
    }
  }

  #onHourClick(hours: number): void {
    this.#valueAsNumbers = { hours, minutes: this.#valueAsNumbers?.minutes ?? 0 };
    this.#value = this.#formatTime(this.#valueAsNumbers.hours ?? 0, this.#valueAsNumbers.minutes ?? 0);
    this.requestUpdate('value');
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

      const activeElement = (this.renderRoot as ShadowRoot).activeElement as HTMLElement;
      if (!activeElement || !(activeElement instanceof HTMLButtonElement)) {
        return;
      }

      const buttons = Array.from(activeElement.parentElement?.querySelectorAll('button') ?? []);
      let index = buttons.indexOf(activeElement);

      if (event.key === 'ArrowUp') {
        index = index === 0 ? buttons.length - 1 : index - 1;
      } else if (event.key === 'ArrowDown') {
        index = index === buttons.length - 1 ? 0 : index + 1;
      }

      buttons[index]?.focus();
      buttons[index]?.scrollIntoView({ block: 'nearest' });
    } else if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();

      const activeElement = (this.renderRoot as ShadowRoot).activeElement as HTMLElement;
      if (!activeElement || !(activeElement instanceof HTMLButtonElement)) {
        return;
      }

      const container = activeElement.parentElement;
      if (container?.classList.contains('hours') && event.key === 'ArrowRight') {
        const minutes = this.renderRoot.querySelector<HTMLElement>('.minutes')!;

        (
          minutes.querySelector<HTMLElement>('button[selected]') ||
          minutes.querySelector<HTMLElement>('button:first-of-type')
        )?.focus();
      } else if (container?.classList.contains('minutes') && event.key === 'ArrowLeft') {
        const hours = this.renderRoot.querySelector<HTMLElement>('.hours')!;

        (
          hours.querySelector<HTMLElement>('button[selected]') ||
          hours.querySelector<HTMLElement>('button:first-of-type')
        )?.focus();
      }
    }
  }

  #onMinuteClick(minutes: number): void {
    this.#valueAsNumbers = { hours: this.#valueAsNumbers?.hours ?? 0, minutes };
    this.#value = this.#formatTime(this.#valueAsNumbers.hours ?? 0, this.#valueAsNumbers.minutes ?? 0);
    this.requestUpdate('value');

    this.listbox?.hidePopover();
    this.textField.focus();
  }

  #onMinuteKeydown(event: KeyboardEvent, minutes: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      this.#onMinuteClick(minutes);
    }
  }

  #onTextFieldBlur(event: SlBlurEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const time = this.#parseTime(this.textField.input.value);
    if (time && time.hours !== this.#valueAsNumbers?.hours && time.minutes !== this.#valueAsNumbers?.minutes) {
      this.#valueAsNumbers = time;
      this.#value = this.#formatTime(time.hours, time.minutes);
      this.requestUpdate('value');
      this.changeEvent.emit(this.value ?? '');
    }

    this.blurEvent.emit();
    this.updateState({ touched: true });
  }

  #onTextFieldChange(event: SlChangeEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.updateValidity();
  }

  #onTextFieldClick(): void {
    if (this.readonly || this.disabled) {
      return;
    }

    this.listbox?.showPopover();
  }

  #onTextFieldFocus(event: SlFocusEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.focusEvent.emit();

    if (!this.readonly) {
      this.input.setSelectionRange(0, 2);
    }
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

      if (selectionStart === 0) {
        hours += event.key === 'ArrowUp' ? 1 : -1;
        hours = (hours + 24) % 24;
      } else {
        minutes += event.key === 'ArrowUp' ? 1 : -1;
        minutes = (minutes + 60) % 60;
      }

      this.#valueAsNumbers = { hours, minutes };
      this.#value = this.#formatTime(hours, minutes);

      this.input.value = this.#value ?? '';
      this.input.setSelectionRange(selectionStart, selectionStart + 2);

      this.requestUpdate();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();

      if (selectionStart === 0) {
        this.input.setSelectionRange(3, 5);
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();

      if (selectionStart === 3) {
        this.input.setSelectionRange(0, 2);
      }
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
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  #parseTime(value: string): { hours: number; minutes: number } | undefined {
    const timeParts = value.split(':').map(Number);

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

    // Fallback to the current time
    time ||= { hours: new Date().getHours(), minutes: new Date().getMinutes() };

    return time;
  }

  #scrollAndFocusStartTime(): void {
    const time = this.#getStartTime();

    // Find the closest hour and minute based on the steps
    time.hours = Math.round(time.hours / this.hourStep) * this.hourStep;
    time.minutes = Math.round(time.minutes / this.minuteStep) * this.minuteStep;

    // Scroll to the closest hour and minute
    const hours = this.renderRoot.querySelector<HTMLElement>('.hours')!,
      minutes = this.renderRoot.querySelector<HTMLElement>('.minutes')!;

    const hoursIndex = Math.floor(time.hours / this.hourStep),
      minutesIndex = Math.floor(time.minutes / this.minuteStep);

    (hours.children[hoursIndex] as HTMLElement)?.focus();
    (hours.children[hoursIndex] as HTMLElement)?.scrollIntoView({ block: 'start' });
    (minutes.children[minutesIndex] as HTMLElement)?.scrollIntoView({ block: 'start' });
  }
}
