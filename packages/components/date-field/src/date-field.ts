import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Calendar } from '@sl-design-system/calendar';
import { FormControlMixin, type SlFormControlEvent, type SlUpdateStateEvent } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, LocaleMixin, anchor, event } from '@sl-design-system/shared';
import { dateConverter } from '@sl-design-system/shared/converters.js';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent,
  type SlSelectEvent
} from '@sl-design-system/shared/events.js';
import { FieldButton, TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './date-field.scss.js';

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

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<Date>>;

  /**
   * Date and time format that will be used for formatting the date in the input.
   * This support the `Intl.DateTimeFormatOptions` format.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
   */
  @property({ type: Object, attribute: 'date-time-format' })
  dateTimeFormat: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'numeric', year: 'numeric' };

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
   * Whether the date field is a required field.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /**
   * Whether the component is select only. This means you cannot type in the text field,
   * but you can still pick a date via de popover.
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

  /** @internal The wrapper element that is also the popover. */
  @query('[part="wrapper"]') wrapper?: HTMLSlotElement;

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
      sl-date-field:has(input:hover):not(:focus-within)::part(text-field) {
        --_bg-opacity: var(--sl-opacity-light-interactive-plain-hover);
      }
    `;
    this.prepend(style);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('dateTimeFormat') && changes.has('locale')) {
      this.#formatter = new Intl.DateTimeFormat(this.locale, this.dateTimeFormat);
    }

    if (changes.has('value')) {
      this.input.value = this.value && this.#formatter ? this.#formatter.format(this.value) : '';
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
      >
        <slot name="input" slot="input"></slot>
        <sl-field-button
          @click=${this.#onButtonClick}
          ?disabled=${this.disabled || this.readonly}
          aria-label=${msg('Toggle calendar')}
          slot="suffix"
          tabindex=${this.disabled ? '-1' : '0'}
        >
          <sl-icon name="calendar"></sl-icon>
        </sl-field-button>
      </sl-text-field>

      <slot
        ${anchor({
          element: this,
          offset: DateField.offset,
          position: 'bottom-start',
          viewportMargin: DateField.viewportMargin
        })}
        @beforetoggle=${this.#onBeforeToggle}
        @toggle=${this.#onToggle}
        name="calendar"
        part="wrapper"
        popover
        tabindex="-1"
      >
        ${this.wrapper?.matches(':popover-open')
          ? html`
              <sl-calendar
                @sl-change=${this.#onChange}
                .selected=${this.value}
                ?show-week-numbers=${this.showWeekNumbers}
                first-day-of-week=${ifDefined(this.firstDayOfWeek)}
                locale=${ifDefined(this.locale)}
                max=${ifDefined(this.max?.toISOString())}
                min=${ifDefined(this.min?.toISOString())}
                show-today
              ></sl-calendar>
            `
          : nothing}
      </slot>
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
      this.wrapper?.togglePopover();
    }
  }

  #onChange(event: SlSelectEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();

    this.value = event.detail;
    this.changeEvent.emit(this.value);

    this.updateState({ dirty: true });
    this.updateValidity();

    setTimeout(() => {
      this.wrapper?.hidePopover();
      this.input.focus();
    }, 500);
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
  }

  #onToggle(event: ToggleEvent): void {
    if (event.newState === 'closed') {
      this.#popoverJustClosed = false;
    } else {
      // Wait for the calendar to render in the popover
      requestAnimationFrame(() => {
        this.renderRoot.querySelector('sl-calendar')?.focus();
      });
    }

    // Trigger a rerender so the calendar will be rendered
    this.requestUpdate();
  }
}
