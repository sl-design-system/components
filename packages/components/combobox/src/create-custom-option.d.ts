import { Option } from '@sl-design-system/listbox';
import { type CSSResultGroup, type TemplateResult } from 'lit';
declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox-create-custom-option': CreateCustomOption;
  }
}
/**
 * A custom element for creating a new option in a combobox. This element is used in combination
 * with the `allowCustomValues` property of the `sl-combobox` element.
 *
 * @slot default - The option's label.
 */
export declare class CreateCustomOption extends Option {
  /** @internal */
  static styles: CSSResultGroup;
  render(): TemplateResult;
}
