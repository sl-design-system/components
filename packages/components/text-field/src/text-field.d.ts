import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter, ObserveAttributesMixinInterface } from '@sl-design-system/shared';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import {
  type CSSResultGroup,
  LitElement,
  type PropertyValues,
  type TemplateResult,
  nothing
} from 'lit';
import { FieldButton } from './field-button.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-text-field': TextField;
  }
}
export type TextFieldSize = 'md' | 'lg';
declare const TextField_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/form').FormControl> &
  import('@open-wc/dedupe-mixin').Constructor<ObserveAttributesMixinInterface>;
/**
 * Single line text field component.
 *
 * @slot prefix - Content shown before the input
 * @slot input - The slot for the input element
 * @slot suffix - Content shown after the input
 */
export declare class TextField extends TextField_base implements ObserveAttributesMixinInterface {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static shadowRootOptions: {
    delegatesFocus: boolean;
    clonable?: boolean;
    customElementRegistry?: CustomElementRegistry | null;
    mode: ShadowRootMode;
    serializable?: boolean;
    slotAssignment?: SlotAssignmentMode;
    customElements?: CustomElementRegistry;
    registry?: CustomElementRegistry;
  };
  /** @internal */
  static styles: CSSResultGroup;
  /**
   * Specifies which type of data the browser can use to pre-fill the input.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
   */
  autocomplete?: string;
  /** @internal Emits when the focus leaves the component. */
  blurEvent: EventEmitter<SlBlurEvent>;
  /** @internal Emits when the value changes. */
  changeEvent: EventEmitter<SlChangeEvent<string | undefined>>;
  /** Whether the text field is disabled; when set no interaction is possible. */
  disabled?: boolean;
  /** @internal Emits when the component gains focus. */
  focusEvent: EventEmitter<SlFocusEvent>;
  /** @internal Embedded or slotted field buttons. */
  fieldButtons: FieldButton[];
  /** The formatted value, to be used as the input value. */
  get formattedValue(): string;
  /** @internal Used for styling the focus ring of the input. */
  hasFocusRing?: boolean;
  /** The input element in the light DOM. */
  input: HTMLInputElement;
  /**
   * The size attribute of the input element.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/size
   */
  inputSize?: number;
  /** Maximum length (number of characters). */
  maxLength?: number;
  /** Minimum length (number of characters). */
  minLength?: number;
  /** This will validate the value of the input using the given pattern. */
  pattern?: string;
  /** Placeholder text in the input. */
  placeholder?: string;
  /** The raw (string) value of the input. */
  rawValue: string;
  /** Whether you can interact with the input or if it is just a static, readonly display. */
  readonly?: boolean;
  /** Whether the text field is a required field. */
  required?: boolean;
  /** When set will cause the control to show it is valid after reportValidity is called. */
  showValid?: boolean;
  /**
   * The size of the input.
   *
   * @default md
   */
  size?: TextFieldSize;
  /**
   * The input type. Only text types are valid here. For other types, see their respective
   * components. For the number type, please see the `<sl-number-field>` component.
   */
  type: 'email' | 'number' | 'tel' | 'text' | 'url' | 'password';
  get value(): string | undefined;
  /** The value of the text field. */
  set value(value: string | undefined);
  connectedCallback(): void;
  firstUpdated(changes: PropertyValues): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  /** Renders the prefix slot; can be overridden to customize the prefix. */
  renderPrefix(): TemplateResult | typeof nothing;
  /** Render the input slot; separate method so it is composable for child components. */
  renderInputSlot(): TemplateResult;
  /**
   * Renders the suffix slot; can be overridden to customize the suffix. Remember that if you
   * override this method, it will no longer automatically show the valid checkmark when the input
   * is valid.
   */
  renderSuffix(): TemplateResult | typeof nothing;
  getLocalizedValidationMessage(): string;
  /**
   * Method that parses the string input and converts it to a specific value. Override this method
   * if you want to convert the value in a different way. Throw an error if the value is invalid.
   */
  parseValue(value: string): void;
  /** @internal */
  focus(): void;
  /**
   * Handles the blur event when the input field loses focus. Emits a `sl-blur` event if the
   * component had focus and updates the state.
   */
  protected onBlur(): void;
  /** This method is called when the input changes. */
  protected onChange(): void;
  /**
   * Handles the focus event when the input field gains focus. Emits a focus event and updates the
   * focus ring state.
   */
  protected onFocus(): void;
  /** Handles input events to update the raw and parsed values. */
  protected onInput({
    target
  }: Event & {
    target: HTMLInputElement;
  }): void;
  /**
   * Handles the `keydown` event for the field. Simulates the native behavior of submitting a form
   * when the Enter key is pressed.
   */
  protected onKeydown(event: KeyboardEvent): void;
  /**
   * Handles changes to the prefix slot. Detects and adds any `FieldButton` elements assigned to the
   * prefix slot to the `fieldButtons` state for further processing.
   */
  protected onPrefixSlotChange(
    event: Event & {
      target: HTMLSlotElement;
    }
  ): void;
  /**
   * Handles changes to the input slot. Updates the `input` element reference and synchronizes its
   * attributes with the component's properties.
   */
  protected onSlotChange(
    event: Event & {
      target: HTMLSlotElement;
    }
  ): void;
  /**
   * Handles changes to the suffix slot. Detects and adds any `FieldButton` elements assigned to the
   * suffix slot to the `fieldButtons` state for further processing.
   */
  protected onSuffixSlotChange(
    event: Event & {
      target: HTMLSlotElement;
    }
  ): void;
  /** @internal Synchronize the input element with the component properties. */
  protected updateInputElement(input: HTMLInputElement): void;
}
export {};
