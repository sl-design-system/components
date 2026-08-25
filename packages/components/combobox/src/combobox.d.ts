import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { Listbox, type ListboxItem, Option, OptionGroupHeader } from '@sl-design-system/listbox';
import { EventEmitter, type PathKeys } from '@sl-design-system/shared';
import {
  type SlBlurEvent,
  type SlChangeEvent,
  type SlFocusEvent
} from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox': Combobox;
  }
}
export type ComboboxItem<T = any, U = T> = ListboxItem<T, U> & {
  disabled?: boolean;
  element?: Option | OptionGroupHeader;
  current?: boolean;
  custom?: boolean;
  group?: string;
  index?: number;
  option?: T;
  selected?: boolean;
  type: 'option' | 'group';
  value?: U;
  visible: boolean;
};
export type ComboboxSize = 'md' | 'lg';
declare const Combobox_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor &
  import('@open-wc/dedupe-mixin').Constructor<import('@sl-design-system/form').FormControl> &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@sl-design-system/shared').ObserveAttributesMixinInterface
  >;
/**
 * Component for selecting one or more options from a list, similar to a native `<select>` element
 * but with the ability to search and filter options.
 *
 * @slot default - The input field
 * @slot options - Contains the listbox with options
 */
export declare class Combobox<T = any, U = T> extends Combobox_base {
  #private;
  /** @internal The default offset of the popover to the input. */
  static offset: number;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal The default margin between the popover and the viewport. */
  static viewportMargin: number;
  /** @internal */
  static formAssociated: boolean;
  /** Will allow custom values not in the listbox when set. */
  allowCustomValues?: boolean;
  /**
   * The behavior of the combobox when it comes to suggesting options based on user input. - 'off':
   * Suggest is off; the input field is read-only. - 'inline': Only suggest options inside the input
   * - 'list': Filter options in the list based on user input - 'both': Use both inline and list
   * suggestions
   *
   * Note: This property is ignored when `select-only` is true, as the input field is read-only in
   * that case.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-autocomplete
   */
  autocomplete?: 'off' | 'inline' | 'list' | 'both';
  /** @internal Emits when the focus leaves the component. */
  blurEvent: EventEmitter<SlBlurEvent>;
  /** @internal Emits when the value changes. */
  changeEvent: EventEmitter<SlChangeEvent<U | U[] | undefined>>;
  /** @internal The create custom option element (used when `allowCustomValues` is set). */
  createCustomOption?: ComboboxItem<T, U>;
  /** @internal The currently highlighted option in the listbox. */
  currentItem?: ComboboxItem<T, U>;
  /** Whether the text field is disabled; when set no interaction is possible. */
  disabled?: boolean;
  /** When set, will filter the results in the listbox based on user input. */
  filterResults?: boolean;
  /** @internal Emits when the component gains focus. */
  focusEvent: EventEmitter<SlFocusEvent>;
  /** When set will group all the selected options at the top of the listbox. */
  groupSelected?: boolean;
  /** @internal. */
  readonly internals: ElementInternals;
  /** @internal The input element in the light DOM. */
  input: HTMLInputElement;
  /** @internal The items rendered dynamically rendered by the listbox. */
  items: Array<ComboboxItem<T, U>>;
  /** @internal The listbox containing the options. */
  listbox?: Listbox<ComboboxItem<T, U>>;
  /** Will allow the selection of multiple options if true. */
  multiple?: boolean;
  /** @internal The ID of the label element for this form control. */
  labelId?: string;
  /** The path to use for grouping the options. */
  optionGroupPath?: PathKeys<T>;
  /** The path to use for the disabled state of the option. */
  optionDisabledPath?: PathKeys<T>;
  /** The path to use for the label of the option. */
  optionLabelPath?: PathKeys<T>;
  /** The path to use for the selected state of the option. */
  optionSelectedPath?: PathKeys<T>;
  /** The path to use for the value of the option. */
  optionValuePath?: PathKeys<T>;
  /**
   * There are 2 ways to provide options to the combobox:
   *
   * 1. By using this `options` property to provide an array of options.
   * 2. By rendering a listbox element in the light DOM and populate it with `<sl-option>` elements.
   *
   * This options property is used to provide options for the first method.
   */
  options?: T[];
  /** Placeholder text in the input. */
  placeholder?: string;
  /**
   * Whether the component is select only. This means the input field is read-only and you cannot
   * type to filter results but you can still select options.
   *
   * When enabled, any `autocomplete` property values are ignored and the component effectively uses
   * `aria-autocomplete="none"`.
   */
  selectOnly?: boolean;
  /** Whether the text field is a required field. */
  required?: boolean;
  /** @internal The selected items. */
  selectedItems: Array<ComboboxItem<T, U>>;
  /** When set will cause the control to show it is valid after reportValidity is called. */
  showValid?: boolean;
  /**
   * The size of the combobox.
   *
   * @default 'md'
   */
  size?: ComboboxSize;
  /**
   * The value of the combobox. If `multiple` selection is enabled, then this will be an array of
   * values. Otherwise, it will be a single value.
   */
  value?: U | U[];
  /** @internal The wrapper element that is also the popover. */
  wrapper?: HTMLSlotElement;
  connectedCallback(): void;
  disconnectedCallback(): void;
  willUpdate(changes: PropertyValues<this>): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  /** @internal */
  focus(options?: FocusOptions): void;
  getLocalizedValidationMessage(): string;
  /** @internal */
  updateInternalValidity(): void;
}
export {};
