import { Option } from '@sl-design-system/listbox';
import { type CSSResultGroup } from 'lit';
import styles from './custom-option.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox-custom-option': CustomOption;
  }
}

/**
 * A custom option in a combobox; used in combination with the `allowCustomValues`
 * property of the `sl-combobox` element.
 *
 * @slot default - The option's label.
 */
export class CustomOption extends Option {
  /** @internal */
  static override styles: CSSResultGroup = [Option.styles, styles];

  override get textContent(): string {
    return Array.from(this.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent)
      .join('');
  }

  override set textContent(value: string) {
    super.textContent = value;
  }
}
