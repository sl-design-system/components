import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type FormControlShowValidity } from '@sl-design-system/form';
import { type Option } from '@sl-design-system/listbox';
import { type EventEmitter } from '@sl-design-system/shared';
import { type SlClearEvent } from '@sl-design-system/shared/events.js';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { type SelectFill, type SelectSize } from './select.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-select-button': SelectButton;
  }
}
declare const SelectButton_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/**
 * SelectButton is used internally by the Select component to display the selected option and handle
 * user interactions.
 *
 * @csspart placeholder - The placeholder text when no option is selected.
 * @csspart selected-option - The container for the selected option.
 */
export declare class SelectButton extends SelectButton_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** @internal */
  readonly internals: ElementInternals;
  /** Will display a clear button when an option is selected. */
  clearable?: boolean;
  /** @internal Whether the clear button is focused. */
  clearFocused?: boolean;
  /** @internal Emits when the user clears the selection via Backspace or Delete. */
  clearEvent: EventEmitter<SlClearEvent>;
  /** Whether the button is disabled. */
  disabled?: boolean;
  /**
   * The fill of the select.
   *
   * @default 'outline'
   */
  fill?: SelectFill;
  /** The width of the longest option. */
  optionSize?: number;
  /** The placeholder for when there is no selected option. */
  placeholder?: string;
  /** Mirrors the same property on the sl-select parent. */
  required?: boolean;
  /** The selected option. */
  selected?: Option | null;
  /** The size of the parent select. */
  size?: SelectSize;
  /** Indicates whether the control should indicate it is valid. */
  showValid?: boolean;
  /** Mirrors the same property on the sl-select parent. */
  showValidity: FormControlShowValidity;
  connectedCallback(): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
}
export {};
