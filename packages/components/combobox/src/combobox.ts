import { anchor } from '@sl-design-system/shared';
import { TextField } from '@sl-design-system/text-field';
import { type CSSResultGroup, type TemplateResult, html } from 'lit';
import { property, query } from 'lit/decorators.js';
import styles from './combobox.scss.js';

declare global {
  interface HTMLElementTagNameMap {
    'sl-combobox': Combobox;
  }
}

export class Combobox<T = string> extends TextField {
  /** The default offset of the popover to the input. */
  static offset = 6;

  /** @internal */
  static override styles: CSSResultGroup = [TextField.styles, styles];

  /** The default margin between the popover and the viewport. */
  static viewportMargin = 8;

  /** @internal The popover containing the list. */
  @query('.listbox') listbox?: HTMLElement;

  /** The options in the listbox. */
  @property({ type: Array }) options?: T[];

  /** The path to the label of T. */
  @property({ attribute: 'option-label-path' }) optionLabelPath?: string;

  /** The path to the value of T. */
  @property({ attribute: 'option-value-path' }) optionValuePath?: string;

  override render(): TemplateResult {
    return html`
      <div class="input">${this.renderInputSlot()}</div>
      <button @click=${this.#onClick}>
        <sl-icon name="chevron-down"></sl-icon>
      </button>

      <div
        ${anchor({
          element: this,
          offset: Combobox.offset,
          position: 'bottom-start',
          viewportMargin: Combobox.viewportMargin
        })}
        class="listbox"
        popover
      >
        HOHOHO
      </div>
    `;
  }

  #onClick(): void {
    this.listbox?.togglePopover();
  }
}
