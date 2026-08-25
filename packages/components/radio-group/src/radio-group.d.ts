import { type EventEmitter } from '@sl-design-system/shared';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { type Radio, type RadioButtonSize } from './radio.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-radio-group': RadioGroup;
  }
}
declare const RadioGroup_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/form').FormControl>;
/**
 * A group of radio buttons.
 *
 * ```html
 * <sl-radio-group>
 *   <sl-radio value="1">Option 1</sl-radio>
 *   <sl-radio value="2">Option 2</sl-radio>
 *   <sl-radio value="3">Option 3</sl-radio>
 * </sl-radio-group>
 * ```
 *
 * @slot default - A list of `sl-radio` elements.
 */
export declare class RadioGroup<T = any> extends RadioGroup_base {
  #private;
  /** @internal */
  static formAssociated: boolean;
  /** @internal */
  static shadowRootOptions: ShadowRootInit;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal Element internals. */
  readonly internals: ElementInternals;
  /** @internal The slotted radios. */
  radios?: Array<Radio<T>>;
  /** @internal Emits when the component loses focus. */
  blurEvent: EventEmitter<SlBlurEvent>;
  /** @internal Emits when the value changes. */
  changeEvent: EventEmitter<SlChangeEvent<T | undefined>>;
  /** @internal Emits when the component receives focus. */
  focusEvent: EventEmitter<SlFocusEvent>;
  /** Whether the group is disabled; when set no interaction is possible. */
  disabled?: boolean;
  /**
   * The orientation of the radio options; when true, the radio buttons are displayed next to each
   * other instead of below each other.
   */
  horizontal?: boolean;
  /** Whether the user is required to select an option in the group. */
  required?: boolean;
  /** When set will cause the control to show it is valid after reportValidity is called. */
  showValid?: boolean;
  /**
   * The size of the radio buttons in the group.
   *
   * @default md
   */
  size?: RadioButtonSize;
  /** The value for the radio group, to be used in forms. */
  value?: T;
  connectedCallback(): void;
  disconnectedCallback(): void;
  formAssociatedCallback(): void;
  formResetCallback(): void;
  firstUpdated(changes: PropertyValues<this>): void;
  willUpdate(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  focus(): void;
}
export {};
