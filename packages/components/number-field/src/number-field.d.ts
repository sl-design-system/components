import { TextField } from '@sl-design-system/text-field';
import { type PropertyValues, type TemplateResult, nothing } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-number-field': NumberField;
  }
}
export type NumberFieldButtonsAlignment = 'end' | 'edges';
declare const NumberField_base: typeof TextField &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/shared').Locale>;
/**
 * A number field component.
 *
 * @omit type - We should not document the type property from TextField in the NumberField, as it is always 'text' internally.
 *
 * @slot prefix - Used for step buttons when `stepButtons` is set to 'edges'. If overridden, the step down button will not be rendered automatically, and you will need to implement your own button logic.
 * @slot suffix - Used for step buttons internally (when `stepButtons` is set). If overridden, the step buttons will not be rendered automatically, and you will need to implement your own button logic.
 */
export declare class NumberField extends NumberField_base {
  #private;
  /** @internal */
  static styles: import('lit').CSSResultGroup[];
  /**
   * Whether the number field is disabled; when set no interaction is possible.
   *
   * @override
   */
  disabled?: boolean;
  /**
   * Number formatting options. See [Intl.NumberFormat options
   * documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat)
   * for more details.
   */
  formatOptions?: Intl.NumberFormatOptions;
  get formattedValue(): string;
  get formValue(): unknown;
  set formValue(value: unknown);
  /**
   * The maximum value that is acceptable and valid. If the value is greater, the control will be
   * invalid.
   *
   * @default Infinity
   */
  max?: number;
  /**
   * The minimum value that is acceptable and valid. If the value is less, the control will be
   * invalid.
   *
   * @default -Infinity
   */
  min?: number;
  /**
   * Whether the number field is a required field.
   *
   * @override
   */
  required?: boolean;
  /**
   * The amount by which the value will be increased/decreased by a step up/down.
   *
   * @default 1
   */
  step?: number;
  /** Step buttons placement for incrementing / decrementing. No step buttons by default. */
  stepButtons?: NumberFieldButtonsAlignment;
  /**
   * The input type is always 'text' for number fields and cannot be changed.
   *
   * @override
   */
  type: 'text';
  get value(): string | undefined;
  /** The text value. */
  set value(value: string | undefined);
  get valueAsNumber(): number | undefined;
  /** The number value. */
  set valueAsNumber(value: number | undefined);
  connectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  /**
   * Renders the prefix slot content with step down button when step buttons are at edges.
   *
   * Remember that if you override this method, the step down button will no longer be rendered
   * automatically when `stepButtons` is set to 'edges'. You will need to implement your own button
   * logic if needed.
   */
  renderPrefix(): TemplateResult | typeof nothing;
  /**
   * Renders the suffix slot content with step buttons.
   *
   * Remember that if you override this method, the step buttons will no longer be rendered
   * automatically. You will need to implement your own button logic if needed.
   */
  renderSuffix(): TemplateResult | typeof nothing;
  /** Decreases the current value by the `step` amount. */
  stepDown(decrement?: number): void;
  /** Increases the current value by the `step` amount. */
  stepUp(increment?: number): void;
  /** @internal Bypass the setter's, so the formatted value isn't updated. */
  parseValue(value: string): void;
  /** @internal Update the formatted value on blur. */
  onBlur(): void;
  /** @internal */
  onKeydown(event: KeyboardEvent): void;
  setCustomValidity(message: string | Promise<string>): void;
  /** @internal Implement custom number validity checks. */
  updateInternalValidity(): void;
}
export {};
