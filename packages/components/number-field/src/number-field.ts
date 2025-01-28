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
  /** @internal */
  static formAssociated = true;

  /** @internal */
  static override get scopedElements(): ScopedElementsMap {
    return {
      'sl-icon': Icon
    };
  } // TODO: is this scopedElements needed? also check dependencies...

  /** @internal */
  static override styles = [TextField.styles, styles];

  /** @internal Element internals. */
  readonly internals = this.attachInternals();

  /** Parser used for user input.  */
  // eslint-disable-next-line no-unused-private-class-members
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
    if (typeof this.valueAsNumber === 'number' && !Number.isNaN(this.valueAsNumber)) {
      return format(this.valueAsNumber, this.locale, this.formatOptions);
    } else {
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
  @state() rawValue?: string;

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

    this.setFormControlElement(this);

    // this.input.setAttribute('inputmode', this.inputMode || 'numeric');
    this.internals.setFormValue(this.valueAsNumber?.toString() || '');

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
      // this.input.max = this.max.toString();
      this.internals.ariaValueMax = this.max.toString();
    }

    if (this.min) {
      // this.input.min = this.min.toString();
      this.internals.ariaValueMin = this.min.toString();
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
            <sl-icon name="dash-solid" size="xs"></sl-icon>
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
                <sl-icon name="dash-solid" size="xs"></sl-icon>
              </button>
              <button
                @click=${() => this.stepUp()}
                ?disabled=${this.disabled || this.readonly}
                aria-label=${msg('Step up')}
                tabindex="-1"
              >
                <sl-icon name="far-plus" size="xs"></sl-icon>
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
                <sl-icon name="far-plus" size="xs"></sl-icon>
              </button>
            </div>
          `
      : nothing;
  } // TODO: plus and minus or chevron?

  /** Decreases the current value by the `step` amount. */
  stepDown(decrement: number = this.step ?? 1): void {
    const value = this.valueAsNumber ?? 0;

    this.valueAsNumber = Math.min(Math.max(value - decrement, this.min ?? -Infinity), this.max ?? Infinity);
    this.internals.setFormValue(this.valueAsNumber?.toString() || '');
  }

  /** Increases the current value by the `step` amount. */
  stepUp(increment: number = this.step ?? 1): void {
    const value = this.valueAsNumber ?? 0;

    this.valueAsNumber = Math.min(Math.max(value + increment, this.min ?? -Infinity), this.max ?? Infinity);
    this.internals.setFormValue(this.valueAsNumber?.toString() || '');
  }

  override onBlur(): void {
    if (this.rawValue !== undefined) {
      this.valueAsNumber = this.#convertValueToNumber(this.rawValue);
    }

    // this.internals.setValidity({
    //   rangeOverflow: !!this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity),
    //   rangeUnderflow: !!this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity)
    // });

    this.internals.setValidity(
      {
        rangeOverflow: !!this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity),
        rangeUnderflow: !!this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity)
      },
      this.valueAsNumber &&
        (this.valueAsNumber > (this.max ?? Infinity) || this.valueAsNumber < (this.min ?? -Infinity))
        ? 'Invalid value'
        : ''
    );

    // this.input.setValidity({ rangeOverflow: this.valueAsNumber > (this.max ?? Infinity), rangeUnderflow: this.valueAsNumber < (this.min ?? -Infinity) });
    // this.internals.setValidity({ rangeOverflow: this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity), rangeUnderflow: this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity) });
    // this.input.setCustomValidity(this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity) || this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity) ? 'Invalid value' : '');

    this.internals.checkValidity();

    this.updateValidity();

    super.onBlur();
  }

  override onInput({ target }: Event & { target: HTMLInputElement }): void {
    this.rawValue = target.value;
    this.internals.setFormValue(this.rawValue);

    // this.internals.setValidity({
    //   rangeOverflow: !!this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity),
    //   rangeUnderflow: !!this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity)
    // });

    this.internals.setValidity(
      {
        rangeOverflow: !!this.valueAsNumber && this.valueAsNumber > (this.max ?? Infinity),
        rangeUnderflow: !!this.valueAsNumber && this.valueAsNumber < (this.min ?? -Infinity)
      },
      this.valueAsNumber &&
        (this.valueAsNumber > (this.max ?? Infinity) || this.valueAsNumber < (this.min ?? -Infinity))
        ? 'Invalid value'
        : ''
    );

    this.internals.checkValidity();

    this.updateValidity();
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
    return parseFloat(value);
  }

  // TODO: this.#updateValueAndValidity();

  // TODO maybe setCustomValidity needs to be added to handle min/max values?
}
