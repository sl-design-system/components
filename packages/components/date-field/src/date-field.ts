import { faCalendar } from '@fortawesome/pro-regular-svg-icons';
import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Calendar } from '@sl-design-system/calendar';
import { FormControlMixin, type SlFormControlEvent, type SlUpdateStateEvent } from '@sl-design-system/form';
import { Icon } from '@sl-design-system/icon';
import { type EventEmitter, anchor, event } from '@sl-design-system/shared';
import { type SlBlurEvent, type SlChangeEvent, type SlFocusEvent } from '@sl-design-system/shared/events.js';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, LitElement, type TemplateResult, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './date-field.scss.js';

Icon.register(faCalendar);

/**
 * A form component that allows the user to pick a date from a calendar.
 */
@localized()
export class DateField extends FormControlMixin(ScopedElementsMixin(LitElement)) {
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

  /** @internal Emits when the focus leaves the component. */
  @event({ name: 'sl-blur' }) blurEvent!: EventEmitter<SlBlurEvent>;

  /** @internal Emits when the value changes. */
  @event({ name: 'sl-change' }) changeEvent!: EventEmitter<SlChangeEvent<Date>>;

  /** @internal Emits when the component gains focus. */
  @event({ name: 'sl-focus' }) focusEvent!: EventEmitter<SlFocusEvent>;

  /** The placeholder for the text field. */
  @property() placeholder?: string;

  /**
   * Whether the component is select only. This means you cannot type in the text field,
   * but you can still pick a date via de popover.
   */
  @property({ type: Boolean, reflect: true, attribute: 'select-only' }) selectOnly?: boolean;

  /** @internal The wrapper element that is also the popover. */
  @query('[part="wrapper"]') wrapper?: HTMLSlotElement;

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
        .placeholder=${this.placeholder}
      >
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
        part="wrapper"
        popover
        tabindex="-1"
      >
        <sl-calendar></sl-calendar>
      </slot>
    `;
  }

  #onButtonClick(): void {
    this.wrapper?.showPopover();
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
}
