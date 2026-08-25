import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type EventEmitter } from '@sl-design-system/shared';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-text-area': TextArea;
  }
}
export type TextAreaSize = 'md' | 'lg';
export type ResizeType = 'none' | 'vertical' | 'auto';
export type WrapType = 'soft' | 'hard';
declare const TextArea_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/form').FormControl> &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@sl-design-system/shared').ObserveAttributesMixinInterface
  >;
/**
 * Multi line text area component.
 *
 * Internal: Slot count-description - internal only, not intended for consumer use. This slot
 * projects a visually-hidden `<span>` that mirrors the character count text into the composed tree.
 * It must be slotted (rather than left as an unslotted light DOM node) because browsers and screen
 * readers only follow `aria-describedby` ID references to elements that are part of the
 * composed/rendered tree. An unslotted element is invisible to the accessibility layer and the
 * count therefore stops being announced when the textarea is focused.
 *
 * @slot textarea - The slot for the textarea element.
 */
export declare class TextArea extends TextArea_base {
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
  /** @internal Emits when the focus leaves the component. */
  blurEvent: EventEmitter<SlBlurEvent>;
  /** @internal Emits when the value changes. */
  changeEvent: EventEmitter<SlChangeEvent<string>>;
  /** @internal Emits when the component gains focus. */
  focusEvent: EventEmitter<SlFocusEvent>;
  /** The textarea in the light DOM. */
  textarea: HTMLTextAreaElement;
  /**
   * Specifies which type of data the browser can use to pre-fill the textarea.
   *
   * NOTE: Declare the type this way so it is backwards compatible with 4.9.5, which we still use in
   * `@sl-design-system/angular`.
   */
  autocomplete?: typeof HTMLTextAreaElement.prototype.autocomplete;
  /** Whether the textarea is disabled; when set no interaction is possible. */
  disabled?: boolean;
  /**
   * Maximum length (number of characters). Not recommended from a UX perspective, because it blocks
   * additional typing once the limit is reached and can cut off pasted text. Prefer `showCount` to
   * allow users to type or paste beyond the limit and then revise input.
   */
  maxLength?: number;
  /** Minimum length (number of characters). Not recommended from a UX perspective. */
  minLength?: number;
  /** Placeholder text in the textarea. */
  placeholder?: string;
  /** Whether you can interact with the textarea or if it is just a static, readonly display. */
  readonly?: boolean;
  /** Whether the textarea is a required field. */
  required?: boolean;
  /** The way the textarea can be resized. */
  resize: ResizeType;
  /**
   * The number of rows the textarea should have. For resize auto and vertical, this will determine
   * the _minimum_ height of the textarea. If not set, the component defaults to 3 rows.
   */
  rows?: number;
  /**
   * The maximum number of characters allowed (soft limit). When set, a character counter appears
   * below the textarea showing how many characters remain. When 90% of the limit is reached the
   * counter turns caution (orange). When the limit is exceeded it turns to a danger state, shows
   * how many characters are over the limit, and marks the textarea as invalid. Exceeding the limit
   * does not block input, the user can still type or paste more text and then edit it down.
   *
   * Please don't combine `showCount` with `maxLength`, as it will cause the textarea to block input
   * when the limit is reached. Use `showCount` alone to allow typing beyond the limit and show a
   * warning.
   */
  showCount?: number;
  /** When set will cause the control to show it is valid after reportValidity is called. */
  showValid?: boolean;
  /**
   * The size of the textarea.
   *
   * @default md
   */
  size?: TextAreaSize;
  /** The value for the textarea. */
  value: string;
  /** The way text should be wrapped during form submission. */
  wrap: WrapType;
  connectedCallback(): void;
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  focus(): void;
  reportValidity(): boolean;
  getLocalizedValidationMessage(): string;
  /**
   * Sets or clears the character count custom validity error. Only clears the error if we set it
   * ourselves, so we never accidentally overwrite a custom error set by the user.
   */
  updateInternalValidity(): void;
  /**
   * Override setCustomValidity to reset the count validity flag whenever an external custom error
   * is set. This ensures the component can distinguish between errors it set itself and errors set
   * externally by consumers.
   */
  setCustomValidity(message: string | Promise<string>): void;
}
export {};
