import { type EventEmitter } from '@sl-design-system/shared';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { Checkbox, type CheckboxSize } from './checkbox.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-checkbox-group': CheckboxGroup;
  }
}
declare const CheckboxGroup_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/form').FormControl>;
/**
 * Checkbox group; treat a group of checkboxes as one form input with validation, hints and errors
 *
 * @slot default - A list of `sl-checkbox` elements.
 */
export declare class CheckboxGroup<T = any> extends CheckboxGroup_base {
  #private;
  /** @internal */
  static formAssociated: boolean;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal */
  readonly internals: ElementInternals;
  /** @internal The slotted checkboxes. */
  boxes?: Array<Checkbox<T>>;
  /** @internal Emits when the component loses focus. */
  blurEvent: EventEmitter<SlBlurEvent>;
  /** @internal Emits when the value of the group changes. */
  changeEvent: EventEmitter<SlChangeEvent<Array<T | null>>>;
  /** @internal Emits when the component receives focus. */
  focusEvent: EventEmitter<SlFocusEvent>;
  /** Whether the group is disabled; when set no interaction is possible. */
  disabled?: boolean;
  /** At least one checkbox in the group must be checked if true. */
  required?: boolean;
  /** The size of the checkboxes in the group. */
  size?: CheckboxSize;
  /** The value of the group. */
  value?: Array<T | null>;
  get formValue(): T[];
  /**
   * We need to override the setter as well, otherwise it won't work. See
   * https://github.com/sl-design-system/components/issues/1441
   */
  set formValue(value: T[]);
  connectedCallback(): void;
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues): void;
  render(): TemplateResult;
  focus(): void;
  reportValidity(): boolean;
}
export {};
