import { type Infotip } from '@sl-design-system/infotip';
import { type EventEmitter } from '@sl-design-system/shared';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-checkbox': Checkbox;
  }
}
export type CheckboxSize = 'sm' | 'md' | 'lg';
declare const Checkbox_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/form').FormControl> &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@sl-design-system/shared').ForwardAriaMixinInterface
  >;
/**
 * A checkbox with 3 states; unchecked, checked and intermediate.
 *
 * @csspart outer - The outer container of the checkbox.
 * @csspart inner - The inner container of the checkbox.
 * @csspart label - The label of the checkbox.
 *
 * @slot default - Text label of the checkbox. Technically there are no limits what can be put here; text, images, icons etc.
 * @slot input - The slot for the input element
 * @slot infotip - The slot for the infotip element
 */
export declare class Checkbox<T = any> extends Checkbox_base {
  #private;
  /** @internal */
  static shadowRootOptions: ShadowRootInit;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal Emits when the component loses focus. */
  blurEvent: EventEmitter<SlBlurEvent>;
  /** @internal Emits when the checked state changes. */
  changeEvent: EventEmitter<SlChangeEvent<T | null>>;
  /** @internal Emits when the component receives focus. */
  focusEvent: EventEmitter<SlFocusEvent>;
  /**
   * Whether the checkbox is checked.
   *
   * @default false
   */
  checked?: boolean;
  /**
   * Whether the checkbox is disabled; when set no interaction is possible.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the checkbox has the indeterminate state.
   *
   * @default false
   */
  indeterminate?: boolean;
  /** The input element in the light DOM. */
  input: HTMLInputElement;
  /**
   * Whether the checkbox is required.
   *
   * @default false
   */
  required?: boolean;
  /**
   * When set will cause the control to show it is valid after reportValidity is called.
   *
   * @default false
   */
  showValid?: boolean;
  infotip?: Infotip;
  /**
   * The size of the checkbox.
   *
   * @default 'md'
   */
  size?: CheckboxSize;
  /**
   * The value of the checkbox when the checkbox is checked. See the formValue property for easy
   * access.
   */
  value?: T;
  get formValue(): T | null;
  set formValue(value: T | null);
  connectedCallback(): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  focus(): void;
  blur(): void;
  getLocalizedValidationMessage(): string;
}
export {};
