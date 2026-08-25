import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { type PathKeys } from '@sl-design-system/shared';
import { VirtualList } from '@sl-design-system/virtual-list';
import { type CSSResultGroup, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { Option, type OptionEmphasis } from './option.js';
declare global {
  interface HTMLElementTagNameMap {
    'sl-listbox': Listbox;
    'sl-virtual-list': VirtualList;
  }
  interface ShadowRoot {
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K];
  }
}
export type ListboxEmphasis = OptionEmphasis;
export type ListboxOption<T, U = T> = {
  id: string;
  label: string;
  group?: string;
  option: T;
  selected?: boolean;
  value: U;
};
export type ListboxOptionGroup = {
  id: string;
  label: string;
};
export type ListboxItem<T = any, U = T> = ListboxOption<T, U> | ListboxOptionGroup;
export type ListboxRenderer<T = any, U = T> = (
  item: ListboxItem<T, U>,
  index: number
) => Element | TemplateResult;
declare const Listbox_base: typeof LitElement &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/** Container for a list of selectable options. */
export declare class Listbox<T = any, U = T> extends Listbox_base {
  #private;
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /**
   * The emphasis of the selected options in the listbox.
   *
   * @default 'subtle'
   */
  emphasis?: ListboxEmphasis;
  /**
   * Use this property if you want to have full control over how the items are rendered using a
   * virtual list. You are expected to provide an array of ListboxItem<T, U> and most likely will
   * also want to provide a custom `renderer`.
   *
   * Only use this property if you know what you are doing. If you are unsure about using this
   * property, use the `options` property instead.
   */
  items?: Array<ListboxItem<T, U>>;
  /**
   * Use this property to set an array of options to render. When you set this property, the
   * component will render the options using a virtualizer. This means that it only renders the
   * options that are visible in the viewport, which allows it to handle a large number of options
   * efficiently.
   *
   * When using this property, you can also provide paths to the properties to use for the label,
   * value, selected state, and group. This allows you to render options that are objects and have
   * nested properties. See `optionGroupPath`, `optionLabelPath`, `optionSelectedPath`, and
   * `optionValuePath` for more information.
   *
   * If you don't need virtualization, you can omit this property and render the options
   * declaratively using the default slot and `<sl-option>` and `<sl-option-group>`.
   */
  options?: T[];
  /** The path to the property to use to group the options. */
  optionGroupPath?: PathKeys<T>;
  /** The path to the property to use for the label. */
  optionLabelPath?: PathKeys<T>;
  /** The path to the property to use for the selected state. */
  optionSelectedPath?: PathKeys<T>;
  /** The path to the property to use for the value. */
  optionValuePath?: PathKeys<T>;
  /**
   * By setting this property, you can customize how an option in the `options` array is rendered.
   * By default, this will render the option as an `<sl-option>`.
   */
  renderer?: ListboxRenderer<T>;
  connectedCallback(): void;
  firstUpdated(changes: PropertyValues<this>): void;
  willUpdate(changes: PropertyValues<this>): void;
  updated(changes: PropertyValues<this>): void;
  render(): TemplateResult;
  /**
   * Request a layout update for the virtual list. Call this method after the listbox becomes
   * visible (for example, when a popover opens) to ensure item positions are measured correctly.
   */
  requestLayout(): Promise<void>;
  /**
   * Scrolls to the item at the specified index.
   *
   * @remarks
   *   **Indexing semantics differ between rendering modes:**
   *
   *   - **Virtualized (via `options` or `items` properties):** Index refers to the `items` array,
   *     which may include both options and option-group headers. Only `block` and `behavior`
   *     options are supported; `inline` is ignored.
   *   - **Slotted (declarative `<sl-option>` elements):** Index refers only to visible `<sl-option>`
   *     elements, excluding group headers and hidden options.
   *
   * @param index - The zero-based index into the items/options array (see remarks for details)
   * @param options - Scroll options
   */
  scrollToIndex(index: number, options?: ScrollIntoViewOptions): void;
  /**
   * Applies flattened accessibility metadata to options.
   *
   * Kept public so composed consumers can trigger deterministic timing when options are projected
   * through nested slots.
   */
  applyFlattenedOptionAccessibility(options: Option[]): void;
  /**
   * Returns the 0-based flattened position of an option item among all option items (group headers
   * are excluded). Returns -1 if the item is a group header or is not in `items`.
   *
   * @internal Used by virtual-list consumers (e.g. combobox) so they don't need a duplicate cache.
   */
  getFlattenedPosition(item: ListboxItem<T, U>): number;
  /**
   * Returns the total number of option items (group headers excluded) in the current `items` array.
   *
   * @internal Companion to `getFlattenedPosition`.
   */
  getFlattenedSetSize(): number;
}
export {};
