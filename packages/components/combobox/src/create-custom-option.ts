import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { localized, msg, str } from '@lit/localize';
import { Icon } from '@sl-design-system/icon';
import { Option } from '@sl-design-system/listbox';
import { type CSSResultGroup, type TemplateResult, html } from 'lit';
import styles from './create-custom-option.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox-create-custom-option': CreateCustomOption;
  }
}

Icon.register(faPlus);

/**
 * A custom element for creating a new option in a combobox.
 * This element is used in combination with the `allowCustomValues`
 * property of the `sl-combobox` element.
 *
 * @slot default - The option's label.
 */
@localized()
export class CreateCustomOption extends Option {
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
