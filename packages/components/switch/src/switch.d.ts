import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
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
    'sl-switch': Switch;
  }
}
export type SwitchSize = 'sm' | 'md' | 'lg';
declare const Switch_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/form').FormControl> &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@sl-design-system/shared').ObserveAttributesMixinInterface
  >;
/**
 * A toggle switch.
 *
 * ```html
 * <sl-switch>Foo</sl-switch>
 * ```
 *
 * @slot default - Text label of the switch. Technically there are no limits what can be put here; text, images, icons etc.
 * @slot input - The slot for the input element
 * @slot infotip - The slot for the infotip element
 */
export declare class Switch<T = any> extends Switch_base {
  #private;
  /** @internal */
  static formAssociated: boolean;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
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
  /** Whether the switch is on or off. */
  checked?: boolean;
  /** Whether the switch is disabled; when set no interaction is possible. */
  disabled?: boolean;
  /** Custom icon in "off" state. */
  iconOff?: string;
  /** Custom icon in "on" state. */
  iconOn?: string;
  /** Whether the toggle should be shown _after_ the text. */
  reverse?: boolean;
  infotip?: Infotip;
  /**
   * The size of the switch.
   *
   * @default md
   */
  size?: SwitchSize;
  /** The value of the switch when the switch is checked. See the formValue property for easy access. */
  value?: T;
  /** The input element in the light DOM. */
  input: HTMLInputElement;
  get formValue(): T | null;
  set formValue(value: T | null);
  connectedCallback(): void;
  formAssociatedCallback(): void;
  formResetCallback(): void;
  firstUpdated(changes: PropertyValues<this>): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  focus(): void;
  blur(): void;
}
export {};
