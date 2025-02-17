import { localized, msg, str } from '@lit/localize';
import { format } from '@sl-design-system/format-number/format.js';
import { LocaleMixin } from '@sl-design-system/shared/mixins.js';
import { TextField } from '@sl-design-system/text-field';
import { type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
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
  #parser?: NumberParser;

  /** The number value. */
  #value?: number;

  /**
   * Number formatting options.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
   */
  @property({ type: Object, attribute: 'format-options' }) formatOptions?: Intl.NumberFormatOptions;

  /** Step buttons placement for incrementing / decrementing. No step buttons by default. */
  @property({ reflect: true, attribute: 'step-buttons' }) stepButtons?: NumberFieldButtonsAlignment;

  override get formattedValue(): string {
    if (typeof this.valueAsNumber === 'number' && !Number.isNaN(this.valueAsNumber)) {
      if (this.formatOptions && this.formatOptions.style === 'percent') {
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
   */
  @property({ type: Number }) max?: number;

  /**
   * The minimum value that is acceptable and valid.
   * If the value is less, the control will be invalid.
   */
  @property({ type: Number }) min?: number;

  /** @internal The raw value of the input. */
  @state() override rawValue: string = '';

  /** The amount by which the value will be increased/decreased by a step up/down. */
  @property({ type: Number }) step?: number;

  get valueAsNumber() {
    return this.#value;
  }

  /** The value, as a number. */
  @property({ type: Number })
  set valueAsNumber(value: number | undefined) {
    this.#value = value;
    this.value = value === undefined ? '' : value.toString();
    this.requestUpdate('value');
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.input.setAttribute('inputmode', this.inputMode || 'numeric');

    this.#parser = new NumberParser(this.locale, this.formatOptions);
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (this.max) {
      this.input.max = this.max.toString();
    }

    if (this.min) {
      this.input.min = this.min.toString();
    }

    if (changes.has('locale') || changes.has('formatOptions')) {
      this.#parser = new NumberParser(this.locale, this.formatOptions);
      this.requestUpdate('value');
    }
  }

  override firstUpdated(changes: PropertyValues<this>): void {
    super.firstUpdated(changes);

    if (!this.rawValue && this.value && this.valueAsNumber) {
      this.rawValue = this.value;
    } else if (!this.rawValue && this.value && !this.valueAsNumber) {
      this.rawValue = this.value;
      this.valueAsNumber = this.#convertValueToNumber(this.rawValue ? this.rawValue : '');
    }

    this.#validateInput();
  }

  override renderPrefix(): TemplateResult | typeof nothing {
    return this.stepButtons === 'edges'
      ? html`
          <button
            @click=${() => this.stepDown()}
            ?disabled=${this.disabled ||
            this.readonly ||
            (this.min !== undefined && this.valueAsNumber !== undefined && this.min === this.valueAsNumber)}
            aria-label=${msg('Step down')}
            tabindex="-1"
          >
            <sl-icon name="minus" size="md"></sl-icon>
          </button>
        `
      : nothing;
  }

  override renderSuffix(): TemplateResult | typeof nothing {
    return this.stepButtons
      ? this.stepButtons === 'end'
        ? html`
            <div class="step-buttons">
              <button
                @click=${() => this.stepDown()}
                ?disabled=${this.disabled ||
                this.readonly ||
                (this.min !== undefined && this.valueAsNumber !== undefined && this.min === this.valueAsNumber)}
                aria-label=${msg('Step down')}
                tabindex="-1"
              >
                <sl-icon name="minus" size="md"></sl-icon>
              </button>
              <button
                @click=${() => this.stepUp()}
                ?disabled=${this.disabled ||
                this.readonly ||
                (this.max !== undefined && this.valueAsNumber !== undefined && this.max === this.valueAsNumber)}
                aria-label=${msg('Step up')}
                tabindex="-1"
              >
                <sl-icon name="plus" size="md"></sl-icon>
              </button>
            </div>
          `
        : html`
            <div class="step-buttons">
              <button
                @click=${() => this.stepUp()}
                ?disabled=${this.disabled ||
                this.readonly ||
                (this.max !== undefined && this.valueAsNumber !== undefined && this.max === this.valueAsNumber)}
                aria-label=${msg('Step up')}
                tabindex="-1"
              >
                <sl-icon name="plus" size="md"></sl-icon>
              </button>
            </div>
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

  override onBlur(): void {
    if (this.rawValue !== undefined && this.rawValue !== '') {
      this.valueAsNumber = this.#convertValueToNumber(
        this.rawValue ? this.rawValue : this.#value !== undefined ? this.#value.toString() : ''
      );

      this.#validateInput();
    }

    super.onBlur();
  }

  override onInput({ target }: Event & { target: HTMLInputElement }): void {
    this.rawValue = target.value;
  }

  override onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault();

      this.stepUp();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();

      this.stepDown();
    } else {
      super.onKeydown(event);
    }
  }

  #validateInput(): void {
    if (this.valueAsNumber !== undefined && !Number.isNaN(this.valueAsNumber)) {
      // check constraints, when it really is a number
      if (this.valueAsNumber > (this.max ?? Infinity)) {
        this.input.setCustomValidity(msg(str`The value must be less than or equal to ${this.max}.`));
      } else if (this.valueAsNumber < (this.min ?? -Infinity)) {
        this.input.setCustomValidity(msg(str`The value must be greater than or equal to ${this.min}.`));
      } else {
        this.input.setCustomValidity('');
      }
    } else if (this.rawValue !== '' || this.value !== '') {
      // Set custom validity message for NaN case
      if (this.valueAsNumber === undefined || isNaN(this.valueAsNumber)) {
        this.input.setCustomValidity(msg('Please enter a valid number.'));
      } else {
        this.input.setCustomValidity('');
      }
    } else {
      this.input.setCustomValidity('');
    }
  }

  #convertValueToNumber(value: string): number | undefined {
    return this.#parser?.parse(value);
  }
}
