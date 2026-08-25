import { type ScopedElementsMap } from '@open-wc/scoped-elements/lit-element.js';
import { OptionGroup } from '@sl-design-system/listbox';
import { type CSSResultGroup, type TemplateResult } from 'lit';
import { type ComboboxItem } from './combobox';
declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox-selected-group': SelectedGroup;
  }
}
declare const SelectedGroup_base: typeof OptionGroup &
  import('@open-wc/dedupe-mixin').Constructor<
    import('@open-wc/scoped-elements/types.js').ScopedElementsHost
  > &
  import('@open-wc/scoped-elements/types.js').ScopedElementsHostConstructor;
/** A special option group that displays selected options at the top of the listbox. */
export declare class SelectedGroup extends SelectedGroup_base {
  /** @internal */
  static get scopedElements(): ScopedElementsMap;
  /** @internal */
  static styles: CSSResultGroup;
  /** The current option. */
  currentOption?: ComboboxItem;
  /** Indicates whether the options are grouped. */
  hasGroups?: boolean;
  /** The selected options to be displayed. */
  options: ComboboxItem[];
  connectedCallback(): void;
  render(): TemplateResult;
}
export {};
