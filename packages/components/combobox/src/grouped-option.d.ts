import { Option } from '@sl-design-system/listbox';
import { type CSSResultGroup, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox-grouped-option': GroupedOption;
  }
}
/**
 * An option in a combobox that is grouped. This is a special type of option that displays a group
 * label.
 *
 * @slot default - The option's label.
 */
export declare class GroupedOption extends Option {
  /** @internal */
  static styles: CSSResultGroup;
  /** The group this option belongs to. */
  group?: string;
  render(): TemplateResult;
}
