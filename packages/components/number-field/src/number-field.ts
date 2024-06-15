import { msg } from '@lit/localize';
import { EventsController } from '@sl-design-system/shared';
import { LocaleMixin } from '@sl-design-system/shared/mixins.js';
import { TextField } from '@sl-design-system/text-field';
import { type PropertyValues, type TemplateResult, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './number-field.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-number-field': NumberField;
  }
}

export class NumberField extends LocaleMixin(TextField) {
  /** @internal */
  static override styles = [TextField.styles, styles];

  /** Event controller. */
  #events = new EventsController(this, { keydown: this.#onKeydown });

  /** The formatter for formatting the value. */
  #formatter = new Intl.NumberFormat(this.locale, this.formatOptions);

  /** The number value. */
  #value?: number;

  /**
   * Number formatting options.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
   */
  @property({ type: Object, attribute: 'format-options' }) formatOptions?: Intl.NumberFormatOptions;

  override get formattedValue(): string {
    if (typeof this.valueAsNumber === 'number') {
      return this.#formatter.format(this.valueAsNumber);
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

  /** Hides the step buttons if set. */
  @property({ type: Boolean, reflect: true, attribute: 'no-step-buttons' }) noStepButtons?: boolean;

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

    this.input.setAttribute('inputmode', this.inputMode || 'numeric');
  }

  override willUpdate(changes: PropertyValues<this>): void {
    super.willUpdate(changes);

    if (changes.has('locale') || changes.has('formatOptions')) {
      this.#formatter = new Intl.NumberFormat(this.locale, this.formatOptions);
    }
  }

  override renderSuffix(): TemplateResult | typeof nothing {
    return this.noStepButtons
      ? nothing
      : html`
          <div class="step-buttons">
            <button
              @click=${() => this.stepUp()}
              ?disabled=${this.disabled || this.readonly}
              aria-label=${msg('Step up')}
            >
              <sl-icon name="chevron-up" size="xs"></sl-icon>
            </button>
            <button
              @click=${() => this.stepDown()}
              ?disabled=${this.disabled || this.readonly}
              aria-label=${msg('Step down')}
            >
              <sl-icon name="chevron-down" size="xs"></sl-icon>
            </button>
          </div>
        `;
  }

  stepDown(decrement: number = this.step ?? 1): void {
    const value = this.valueAsNumber ?? 0;

    this.valueAsNumber = Math.min(Math.max(value - decrement, this.min ?? -Infinity), this.max ?? Infinity);
  }

  stepUp(increment: number = this.step ?? 1): void {
    const value = this.valueAsNumber ?? 0;

    this.valueAsNumber = Math.min(Math.max(value + increment, this.min ?? -Infinity), this.max ?? Infinity);
  }

  #onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault();

      this.stepUp();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();

      this.stepDown();
    }
  }
}
