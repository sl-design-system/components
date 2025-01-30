import { msg } from '@lit/localize';
import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { format } from '@sl-design-system/format-number/format.js';
import { Icon } from '@sl-design-system/icon';
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

export type StepButtonsPlacement = 'end' | 'edges'; // | 'none';

export class NumberField extends LocaleMixin(TextField) {
  // /** @internal */
  // static formAssociated = true;

  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  } // TODO: is this scopedElements needed? also check dependencies...

  /** @internal */
  static override styles = [TextField.styles, styles];

  // /** @internal Element internals. */
  // readonly internals = this.attachInternals();

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
  @property({ reflect: true, attribute: 'step-buttons' }) stepButtons?: StepButtonsPlacement;

  // TODO: maybe it should not extent TextField?

  override get formattedValue(): string {
    // TODO: sth is wrong here?
    console.log(
      'is it a number? what type?',
      typeof this.valueAsNumber,
      !Number.isNaN(this.valueAsNumber),
      this.valueAsNumber
    );
    if (typeof this.valueAsNumber === 'number' && !Number.isNaN(this.valueAsNumber)) {
      console.log(
        'this.valueAsNumber in formattedValue',
        this.valueAsNumber,
        format(this.valueAsNumber, this.locale, this.formatOptions)
      );
      return format(this.valueAsNumber, this.locale, this.formatOptions);
    } else {
      console.log('this.valueAsNumber in formattedValue in else should return empty string', this.valueAsNumber);
      return '';
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

  // /** Hides the step buttons if set. */
  // @property({ type: Boolean, reflect: true, attribute: 'no-step-buttons' }) noStepButtons?: boolean;

  /** @internal The raw value of the input. */
  // @state() override rawValue?: string;
  @state() override rawValue: string = '';

  /** The amount by which the value will be increased/decreased by a step up/down. */
  @property({ type: Number }) step?: number;

  // override set value(value: string) {
  //   const newValue = value === '' ? undefined : this.parseValue(value);
  //   const oldValue = this.valueAsNumber;

  //   if (newValue !== oldValue) {
  //     this.valueAsNumber = newValue;
  //     this.requestUpdate('value', oldValue);
  //   }
  // }

  get valueAsNumber() {
    return this.#value;
  }

  /** The value, as a number. */
  @property({ type: Number })
  set valueAsNumber(value: number | undefined) {
    this.#value = value;
    this.value = value === undefined ? '' : value.toString();
  }

  override connectedCallback(): void {
    super.connectedCallback();

    // this.setFormControlElement(this.input);

    this.input.setAttribute('inputmode', this.inputMode || 'numeric');
    // this.internals.setFormValue(this.valueAsNumber?.toString() || '');

    // this.setFormControlElement(this);

    console.log('min and max', this.min, this.max);

    // if (this.max) {
    //   this.input.max = this.max.toString();
    // }
    //
    // if (this.min) {
    //   this.input.min = this.min.toString();
    // }
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    console.log('min and max in willUpdate', this.min, this.max);

    if (this.max) {
      this.input.max = this.max.toString();
      // this.internals.ariaValueMax = this.max.toString();
    }

    if (this.min) {
      this.input.min = this.min.toString();
      // this.internals.ariaValueMin = this.min.toString();
    }

    if (changes.has('locale') || changes.has('formatOptions')) {
      this.#parser = new NumberParser(this.locale, this.formatOptions);
    }
  }

  override renderPrefix(): TemplateResult | typeof nothing {
    // TODO...
    return this.stepButtons === 'edges'
      ? html`
          <button
            @click=${() => this.stepDown()}
            ?disabled=${this.disabled || this.readonly}
            aria-label=${msg('Step down')}
            tabindex="-1"
          >
            <sl-icon name="minus" size="xs"></sl-icon>
          </button>
        `
      : nothing;
  }

  override renderSuffix(): TemplateResult | typeof nothing {
    console.log('stepButtons', this.stepButtons, this.size);
    return this.stepButtons
      ? this.stepButtons === 'end'
        ? html`
            <div class="step-buttons">
              <button
                @click=${() => this.stepDown()}
                ?disabled=${this.disabled || this.readonly}
                aria-label=${msg('Step down')}
                tabindex="-1"
              >
                <sl-icon name="minus" size="xs"></sl-icon>
              </button>
              <button
                @click=${() => this.stepUp()}
                ?disabled=${this.disabled || this.readonly}
                aria-label=${msg('Step up')}
                tabindex="-1"
              >
                <sl-icon name="plus" size="xs"></sl-icon>
              </button>
            </div>
          `
        : html`
            <div class="step-buttons">
              <button
                @click=${() => this.stepUp()}
                ?disabled=${this.disabled || this.readonly}
                aria-label=${msg('Step up')}
                tabindex="-1"
              >
                <sl-icon name="plus" size="xs"></sl-icon>
              </button>
            </div>
          `
      : nothing;
  } // TODO: plus and minus or chevron?

  /** Decreases the current value by the `step` amount. */
  stepDown(decrement: number = this.step ?? 1): void {
    const value = this.valueAsNumber ?? 0;

    this.valueAsNumber = Math.min(Math.max(value - decrement, this.min ?? -Infinity), this.max ?? Infinity);
    // this.internals.setFormValue(this.valueAsNumber?.toString() || '');
  }

  /** Increases the current value by the `step` amount. */
  stepUp(increment: number = this.step ?? 1): void {
    const value = this.valueAsNumber ?? 0;

    this.valueAsNumber = Math.min(Math.max(value + increment, this.min ?? -Infinity), this.max ?? Infinity);
    // this.internals.setFormValue(this.valueAsNumber?.toString() || '');
  }

  override onBlur(): void {
    if (this.rawValue !== undefined) {
      this.valueAsNumber = this.#convertValueToNumber(this.rawValue);
      // const parsedValue = this.#convertValueToNumber(this.rawValue);

      // TODO: maybe we don't want to clean the value when it's not a number typed in?

      if (!Number.isNaN(this.valueAsNumber /*parsedValue*/)) {
        // this.valueAsNumber = parsedValue;

        // check constraints, when it really is a number
        if (!!this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity)) {
          this.input.setCustomValidity('rangeOverflow...');
        } else if (!!this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity)) {
          this.input.setCustomValidity('rangeUnderflow...');
        } else {
          // Clear custom validity message
          this.input.setCustomValidity('');
        }
        console.log(
          'this.valueAsNumber on blur in IFFFF',
          this.rawValue,
          this.valueAsNumber,
          this.input.validity,
          'parsedValue',
          this.valueAsNumber,
          '!NaN>???',
          !isNaN(this.valueAsNumber),
          !Number.isNaN(this.valueAsNumber)
        );
      } else if (this.rawValue !== '') {
        console.log(
          'this.valueAsNumber on blur in ELSE',
          this.rawValue,
          this.valueAsNumber,
          this.input.validity,
          'parsedValue',
          this.valueAsNumber,
          '!NaN>???',
          !isNaN(this.valueAsNumber),
          !Number.isNaN(this.valueAsNumber)
        );
        // Handle NaN case, e.g., set to undefined or some default value
        // this.valueAsNumber = undefined;
        // Set custom validity message for NaN case
        this.input.setCustomValidity('Invalid number');
      } else {
        // Clear custom validity message
        this.input.setCustomValidity('');
      }
    }

    // TODO: what if returns NaN?

    // console.log('this.valueAsNumber on blur', this.valueAsNumber, this.input.validity);

    // this.internals.setValidity({
    //   rangeOverflow: !!this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity),
    //   rangeUnderflow: !!this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity)
    // });

    // this.internals.setValidity(
    //   {
    //     rangeOverflow: !!this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity),
    //     rangeUnderflow: !!this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity)
    //   },
    //   this.valueAsNumber &&
    //     (this.valueAsNumber > (this.max ?? Infinity) || this.valueAsNumber < (this.min ?? -Infinity))
    //     ? 'Invalid value'
    //     : ''
    // );

    // if (!!this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity)) {
    //   this.input.setCustomValidity('rangeOverflow...');
    // } else if (!!this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity)) {
    //   this.input.setCustomValidity('rangeUnderflow...');
    // } else {
    //   // Clear custom validity message
    //   this.input.setCustomValidity('');
    // }

    console.log(
      'this.valueAsNumber on blur',
      this.valueAsNumber,
      this.input.validity,
      this.input.validationMessage,
      this.input.value
    );

    // TODO: translation for messages msg(...)

    // this.internals.setValidity(
    //   {
    //     rangeOverflow: !!this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity),
    //     rangeUnderflow: !!this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity)
    //   },
    //   this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity)
    //     ? 'Value exceeds the maximum'
    //     : this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity)
    //       ? 'Value is below the minimum'
    //       : ''
    // ); // TODO: translation for messages msg(...)

    // this.input.setValidity({ rangeOverflow: this.valueAsNumber > (this.max ?? Infinity), rangeUnderflow: this.valueAsNumber < (this.min ?? -Infinity) });
    // this.internals.setValidity({ rangeOverflow: this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity), rangeUnderflow: this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity) });
    // this.input.setCustomValidity(this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity) || this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity) ? 'Invalid value' : '');

    // this.internals.checkValidity();

    // this.updateValidity();

    super.onBlur();
  }

  override onInput({ target }: Event & { target: HTMLInputElement }): void {
    this.rawValue = target.value;
    // this.internals.setFormValue(this.rawValue);

    // this.internals.setValidity({
    //   rangeOverflow: !!this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity),
    //   rangeUnderflow: !!this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity)
    // });

    // this.internals.setValidity(
    //   {
    //     rangeOverflow: !!this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity),
    //     rangeUnderflow: !!this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity)
    //   },
    //   this.valueAsNumber &&
    //     (this.valueAsNumber > (this.max ?? Infinity) || this.valueAsNumber < (this.min ?? -Infinity))
    //     ? 'Invalid value'
    //     : ''
    // ); // TODO: translation for message msg(...)

    // this.internals.setValidity(
    //   {
    //     rangeOverflow: !!this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity),
    //     rangeUnderflow: !!this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity)
    //   },
    //   this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity)
    //     ? 'Value exceeds the maximum'
    //     : this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity)
    //       ? 'Value is below the minimum'
    //       : ''
    // ); // TODO: translation for messages msg(...)
    //
    // this.internals.checkValidity();
    //
    // this.updateValidity();
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

  #convertValueToNumber(value: string): number {
    console.log('value and parseFloat in #convertValueToNumber', value, parseFloat(value));
    // return parseFloat(value);
    // const numericValue = value.replace(/[^\d.-]/g, ''); // Remove non-numeric characters
    const numericValue = this.#parser?.parse(value) ?? value.replace(/[^\d.-]/g, ''); // Use parser if available, fallback to removing non-numeric characters
    // new NumberParser(this.locale, this.formatOptions);
    console.log('value and parseFloat in #convertValueToNumber', numericValue, parseFloat(numericValue.toString()));
    // return parseFloat(numericValue);
    return parseFloat(numericValue.toString());
  }

  // TODO: this.#updateValueAndValidity();

  // TODO maybe setCustomValidity needs to be added to handle min/max values?
}
