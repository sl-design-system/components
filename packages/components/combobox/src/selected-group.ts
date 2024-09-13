import { localized, msg } from '@lit/localize';
import { type ScopedElementsMap, ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { Option, OptionGroup } from '@sl-design-system/listbox';
import { type CSSResultGroup, type TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { type ComboboxOption } from './combobox';
import styles from './selected-group.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox-selected-group': SelectedGroup;
  }
}

/**
 * A special option group that displays selected options at the top of the listbox.
 */
@localized()
export class SelectedGroup extends ScopedElementsMixin(OptionGroup) {
  /** @internal */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-option': Option
    };
  }

  /** @internal */
  static override styles: CSSResultGroup = [OptionGroup.styles, styles];

  /** The current option. */
  @property({ attribute: false }) currentOption?: ComboboxOption;

  /** The selected options to be displayed. */
  @property({ attribute: false }) options: ComboboxOption[] = [];

  override render(): TemplateResult {
    return html`
      <div part="wrapper">
        <div class="label">${msg('Selected')}</div>
        ${this.options.map(
          option => html`
            <sl-option
              aria-current=${ifDefined(option === this.currentOption ? 'true' : undefined)}
              selected
              .id=${option.id}
              .value=${option.value}
              >${option.content}</sl-option
            >
          `
        )}
      </div>
      <div class="label other">${msg('All options')}</div>
    `;
  }
}
