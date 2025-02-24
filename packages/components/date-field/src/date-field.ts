import { faCalendar } from '@fortawesome/pro-regular-svg-icons';
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
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import styles from './date-field.scss.js';

Icon.register(faCalendar);

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

  /** The first day of the week; 0 for Sunday, 1 for Monday. */
  @property({ type: Number, attribute: 'first-day-of-week' }) firstDayOfWeek?: number;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** @internal The input element in the light DOM. */
  input!: HTMLInputElement;

  /** The placeholder for the text field. */
  @property() placeholder?: string;

  /** Whether the text field is a required field. */
  @property({ type: Boolean, reflect: true }) override required?: boolean;

  /**
   * Whether the component is select only. This means you cannot type in the text field,
   * but you can still pick a date via de popover.
   */
  @property({ type: Boolean, reflect: true, attribute: 'select-only' }) selectOnly?: boolean;

  /** Shows the week numbers. */
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
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('dateTimeFormat') && changes.has('locale')) {
      this.#formatter = new Intl.DateTimeFormat(this.locale, this.dateTimeFormat);
    }

    if (changes.has('value')) {
      console.log('value', this.value);

      this.input.value = this.value && this.#formatter ? this.#formatter.format(this.value) : '';
    }
  }

  override render(): TemplateResult {
    return html`
      <sl-text-field
        @input=${this.#onInput}
        @keydown=${this.#onKeydown}
        @sl-blur=${this.#onTextFieldBlur}
        @sl-change=${this.#onTextFieldChange}
        @sl-focus=${this.#onTextFieldFocus}
        @sl-form-control=${this.#onTextFieldFormControl}
        @sl-update-state=${this.#onTextFieldUpdateState}
        ?disabled=${this.disabled}
        ?readonly=${this.selectOnly}
        .placeholder=${this.placeholder}
      >
        <slot name="input" slot="input"></slot>
        <button
          @click=${this.#onButtonClick}
          ?disabled=${this.disabled}
          aria-label=${msg('Show calendar')}
          slot="suffix"
        >
          <sl-icon name="far-calendar"></sl-icon>
        </button>
      </sl-text-field>

      <slot
        ${anchor({
          element: this,
          offset: DateField.offset,
          position: 'bottom-start',
          viewportMargin: DateField.viewportMargin
        })}
        @toggle=${this.#onToggle}
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
                show-today
              ></sl-calendar>
            `
          : nothing}
      </slot>
    `;
  }

  #onButtonClick(): void {
    this.wrapper?.showPopover();
  }

  #onChange(event: SlSelectEvent<Date>): void {
    event.preventDefault();
    event.stopPropagation();

    this.value = event.detail;
    this.changeEvent.emit(this.value);

    setTimeout(() => {
      this.wrapper?.hidePopover();
      this.input.focus();
    }, 500);
  }

  #onInput(event: InputEvent): void {
    console.log('input', event);

    this.wrapper?.showPopover();
  }

  #onKeydown(event: KeyboardEvent): void {
    console.log('keydown', event.key);
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

  #onToggle(): void {
    this.requestUpdate();
  }
}
