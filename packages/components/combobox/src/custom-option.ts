import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { localized, msg, str } from '@lit/localize';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { type CSSResultGroup, type TemplateResult, html } from 'lit';
import styles from './custom-option.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox-custom-option': CustomOption;
  }
}

Icon.register(faPlus);

/**
 * A custom option in a combobox; used in combination with the `allowCustomValues`
 * property of the `sl-combobox` element.
 *
 * @slot default - The option's label.
 */
@localized()
export class CustomOption extends Option {
  /** @internal */
  static override styles: CSSResultGroup = [Option.styles, styles];

  override render(): TemplateResult {
    return html`
      <div class="container">
        <sl-icon name="far-plus"></sl-icon>
        <div class="wrapper">${msg(str`Create "${this.value}"`)}</div>
      </div>
    `;
  }
}
