import { localized, msg, str } from '@lit/localize';
import { format } from '@sl-design-system/format-number/format.js';
import { LocaleMixin } from '@sl-design-system/shared/mixins.js';
import { TextField } from '@sl-design-system/text-field';
import { type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './number-field.scss.js';
import { NumberParser } from './number-parser.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-number-field': NumberField;
  }
}

export type NumberFieldButtonsAlignment = 'end' | 'edges';

/**
 * A number field component.
 */
@localized()
export class NumberField extends LocaleMixin(TextField) {
  /** @internal */
  static override styles = [TextField.styles, styles];

  /** Parser used for user input.  */
  #parser = new NumberParser(this.locale);

  /** The string value. */
  #value?: string;

  /** The number value. */
  #valueAsNumber?: number;

  /**
   * Number formatting options.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
   */
  @property({ type: Object, attribute: 'format-options' }) formatOptions?: Intl.NumberFormatOptions;

  override get formattedValue(): string {
    if (typeof this.valueAsNumber === 'number' && !Number.isNaN(this.valueAsNumber)) {
      if (this.formatOptions?.style === 'percent') {
        const percentageValue = this.valueAsNumber * 0.01;

        return format(percentageValue, this.locale, this.formatOptions);
      }

      return format(this.valueAsNumber, this.locale, this.formatOptions);
    } else {
      return this.rawValue ?? this.valueAsNumber;
    }
  }

  /**
   * The maximum value that is acceptable and valid.
   * If the value is greater, the control will be invalid.
   * @default Infinity
   */
  @property({ type: Number }) max?: number;

  /**
   * The minimum value that is acceptable and valid.
   * If the value is less, the control will be invalid.
   * @default -Infinity
   */
  @property({ type: Number }) min?: number;

  /**
   * The amount by which the value will be increased/decreased by a step up/down.
   * @default 1
   */
  @property({ type: Number }) step?: number;

  /** Step buttons placement for incrementing / decrementing. No step buttons by default. */
  @property({ reflect: true, attribute: 'step-buttons' }) stepButtons?: NumberFieldButtonsAlignment;

  override get value(): string | undefined {
    return this.#value;
  }

  /** The text value. */
  @property()
  override set value(value: string | undefined) {
    this.#value = value;

    const number = value ? this.#parser.parse(value) : undefined;
    if (this.valueAsNumber !== number) {
      this.valueAsNumber = number;
    }
  }

  get valueAsNumber() {
    return this.#valueAsNumber;
  }

  /** The number value. */
  @property({ type: Number })
  set valueAsNumber(value: number | undefined) {
    this.#valueAsNumber = value;

    // Keep the text value in sync with the number value
    if (this.#value !== value?.toString()) {
      this.#value = value?.toString();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.input.setAttribute('inputmode', this.inputMode || 'numeric');

    // This is a workaround, because :has is not working in Safari and Firefox with :host element as it works in Chrome
    const style = document.createElement('style');
    style.innerHTML = `
      sl-number-field:has(input:hover):not(:focus-within) {
        --_bg-opacity: var(--sl-opacity-light-interactive-plain-hover);
      }
    `;
    this.prepend(style);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('formatOptions') || changes.has('locale')) {
      this.#parser = new NumberParser(this.locale, this.formatOptions);

      // Trigger an update of the formatted value in the parent class
      this.requestUpdate('formattedValue');
    }

    if (this.max) {
      this.input.max = this.max.toString();
    }

    if (this.min) {
      this.input.min = this.min.toString();
    }

    if (changes.has('value') || changes.has('valueAsNumber')) {
      this.requestUpdate('formattedValue');

      this.#validateInput();
    }
  }

  /** @internal */
  override renderPrefix(): TemplateResult | typeof nothing {
    return this.stepButtons === 'edges'
      ? html`
          <sl-field-button
            @click=${() => this.stepDown()}
            ?disabled=${this.#isButtonDisabled('down')}
            aria-label=${msg('Step down', { id: 'sl.numberField.stepDownFieldButtonLabel' })}
            class="minus"
          >
            <sl-icon name="minus" size="md"></sl-icon>
          </sl-field-button>
        `
      : nothing;
  }

  /** @internal */
  override renderSuffix(): TemplateResult | typeof nothing {
    return this.stepButtons
      ? this.stepButtons === 'end'
        ? html`
            <div class="step-buttons">
              <sl-field-button
                @click=${() => this.stepDown()}
                ?disabled=${this.#isButtonDisabled('down')}
                aria-label=${msg('Step down', { id: 'sl.numberField.stepDownFieldButtonLabel' })}
                class="minus"
              >
                <sl-icon name="minus" size="md"></sl-icon>
              </sl-field-button>
              <sl-field-button
                @click=${() => this.stepUp()}
                ?disabled=${this.#isButtonDisabled('up')}
                aria-label=${msg('Step up', { id: 'sl.numberField.stepUpFieldButtonLabel' })}
                class="plus"
              >
                <sl-icon name="plus" size="md"></sl-icon>
              </sl-field-button>
            </div>
          `
        : html`
            <sl-field-button
              @click=${() => this.stepUp()}
              ?disabled=${this.#isButtonDisabled('up')}
              aria-label=${msg('Step up', { id: 'sl.numberField.stepUpFieldButtonLabel' })}
              class="plus"
            >
              <sl-icon name="plus" size="md"></sl-icon>
            </sl-field-button>
          `
      : nothing;
  }

  /** Decreases the current value by the `step` amount. */
  stepDown(decrement: number = this.step ?? 1): void {
    const value = this.valueAsNumber ?? 0;

    this.valueAsNumber = Math.min(Math.max(value - decrement, this.min ?? -Infinity), this.max ?? Infinity);
    this.#validateInput();
  }

  /** Increases the current value by the `step` amount. */
  stepUp(increment: number = this.step ?? 1): void {
    const value = this.valueAsNumber ?? 0;

    this.valueAsNumber = Math.min(Math.max(value + increment, this.min ?? -Infinity), this.max ?? Infinity);
    this.#validateInput();
  }

  /**
   * Handles the blur event when the input field loses focus.
   * Parses the raw value, validates the input, and updates the state.
   */
  override onBlur(): void {
    if (this.rawValue !== undefined && this.rawValue !== '') {
      this.valueAsNumber = this.#parser.parse(
        this.rawValue ? this.rawValue : this.#value !== undefined ? this.#value.toString() : ''
      );

      this.#validateInput();
    }

    super.onBlur();
  }

  /** @internal */
  override onInput({ target }: Event & { target: HTMLInputElement }): void {
    this.rawValue = target.value;
  }

  /** @internal */
  override onKeydown(event: KeyboardEvent): void {
    if (this.disabled || this.readonly) {
      return;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();

      this.stepUp();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();

      this.stepDown();
    } else {
      super.onKeydown(event);
    }
  }

  #isButtonDisabled(button: string): boolean {
    if (button === 'up') {
      return (
        this.disabled ||
        this.readonly ||
        (this.max !== undefined && this.valueAsNumber !== undefined && this.max === this.valueAsNumber)
      );
    } else if (button === 'down') {
      return (
        this.disabled ||
        this.readonly ||
        (this.min !== undefined && this.valueAsNumber !== undefined && this.min === this.valueAsNumber)
      );
    } else {
      return false;
    }
  }

  #validateInput(): void {
    if (this.valueAsNumber !== undefined && !Number.isNaN(this.valueAsNumber)) {
      // check constraints, when it really is a number
      if (this.valueAsNumber > (this.max ?? Infinity)) {
        this.setCustomValidity(
          msg(str`The value must be less than or equal to ${this.max}.`, {
            id: 'sl.numberField.validation.exceedsMaximum'
          })
        );
      } else if (this.valueAsNumber < (this.min ?? -Infinity)) {
        this.setCustomValidity(
          msg(str`The value must be greater than or equal to ${this.min}.`, {
            id: 'sl.numberField.validation.belowMinimum'
          })
        );
      } else {
        this.setCustomValidity('');
      }
    } else if (this.rawValue !== '' || this.value !== '') {
      // Set custom validity message for NaN case
      if (this.valueAsNumber === undefined || isNaN(this.valueAsNumber)) {
        this.setCustomValidity(msg('Please enter a valid number.', { id: 'sl.numberField.validation.invalidNumber' }));
      } else {
        this.setCustomValidity('');
      }
    } else {
      this.setCustomValidity('');
    }
  }
}
