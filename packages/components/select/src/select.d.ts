import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { Listbox, Option, OptionGroup } from '@sl-design-system/listbox';
import { type EventEmitter } from '@sl-design-system/shared';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlClearEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { SelectButton } from './select-button.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-select': Select;
  }
  interface ShadowRoot {
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K];
  }
}
export type SelectFill = 'ghost' | 'outline';
export type SelectSize = 'md' | 'lg';
declare const Select_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/form').FormControl> &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@sl-design-system/shared').ObserveAttributesMixinInterface
  >;
/**
 * A form control that allows users to select one option from a list of options.
 *
 * @slot default - Place for `sl-option` and `sl-option-group` elements
 * @csspart listbox - Set `--sl-popover-max-block-size` and/or `--sl-popover-min-block-size` to control the minimum and maximum height of the dropdown (within the limits of the available screen real estate). Set `width` to override the default width (which matches the button width)
 * @csspart selected - The selected option element within the select's internal `sl-select-button`, exposed for styling via `<sl-select>`
 * @csspart selected-option - The container for the selected option within the select's internal `sl-select-button`, exposed for styling via `<sl-select>`
 * @csspart placeholder - The placeholder text when no option is selected within the select's internal `sl-select-button`, exposed for styling via `<sl-select>`
 */
export declare class Select<T = any> extends Select_base {
  #private;
  /** @internal */
  static formAssociated: boolean;
  /** @internal The default offset of the listbox to the button. */
  static offset: number;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal The default margin between the tooltip and the viewport. */
  static viewportMargin: number;
  /**
   * @internal Since we move the aria-label to the button, we need to proxy it here,
   * otherwise the `<sl-form-validation-errors>` component will not be able to read it.
   */
  get ariaLabel(): string;
  /** The button in the light DOM. */
  button: SelectButton;
  /** @internal Emits when the focus leaves the component. */
  blurEvent: EventEmitter<SlBlurEvent>;
  /** @internal Emits when the value changes. */
  changeEvent: EventEmitter<SlChangeEvent<T | undefined>>;
  /** @internal Emits when the value is cleared. */
  clearEvent: EventEmitter<SlClearEvent>;
  /** Will display a clear button when an option is selected. */
  clearable?: boolean;
  /**
   * The current option in the listbox. This is the option that will become the selected option if
   * the user presses Enter/Space.
   *
   * @internal
   */
  currentOption?: Option<T>;
  /** Whether the select is disabled; when set no interaction is possible. */
  disabled?: boolean;
  /**
   * The fill of the select.
   *
   * @default 'outline'
   */
  fill?: SelectFill;
  /** @internal Emits when the component gains focus. */
  focusEvent: EventEmitter<SlFocusEvent>;
  /** @internal */
  readonly internals: ElementInternals;
  /** @internal The clear button element. */
  clearButton?: HTMLButtonElement;
  /** @internal The listbox element that is also the popover. */
  listbox?: Listbox;
  /** @internal */
  optionGroups?: OptionGroup[];
  /** @internal A flattened array of all options (even grouped ones). */
  get options(): Array<Option<T>>;
  /** The placeholder text to show when no option is chosen. */
  placeholder?: string;
  /** Whether the select is a required field. */
  required?: boolean;
  /** @internal The selected option in the listbox. */
  selectedOption?: Option<T>;
  /** When set will cause the control to show it is valid after reportValidity is called. */
  showValid?: boolean;
  /**
   * The size of the select.
   *
   * @default md
   */
  size?: SelectSize;
  /**
   * The number of pixels from the top of the viewport the select should be hidden on scroll. Use
   * this when there is a sticky header you don't want dropdowns to fall on top of.
   */
  rootMarginTop: number;
  /** The value for the select, to be used in forms. */
  value?: T;
  connectedCallback(): void;
  disconnectedCallback(): void;
  formAssociatedCallback(): void;
  formResetCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  firstUpdated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  focus(options?: FocusOptions): void;
}
export {};
