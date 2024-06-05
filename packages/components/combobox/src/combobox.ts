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

export interface ComboboxModel {}

export type ComboboxMultipleSelectionType = 'automatic' | 'manual';

let nextUniqueId = 0;

export class Combobox extends TextField {
  /** The default offset of the popover to the input. */
  static offset = 6;

  /** @internal */
  static override styles: CSSResultGroup = [TextField.styles, styles];

  /** The default margin between the popover and the viewport. */
  static viewportMargin = 8;

  /** If true, automatically filter the results in the listbox based on the current text. */
  @property({ type: Boolean, attribute: 'filter-results' }) filterResults?: boolean;

  /** @internal The popover containing the list. */
  @query('[popover]') menu?: HTMLElement;

  /** Use a custom model for the options. */
  @property({ attribute: false }) model?: ComboboxModel;

  /** Will allow the selection of multiple options if true. */
  @property({ type: Boolean }) multiple?: boolean;

  /**
   * If set to 'automatic' (default), it will be one single text input with delimited values.
   * If set to "manual", you will only enter 1 option at a time, and then need to confirm selection, and then the input will clear,
   * and then you will add another selection.
   */
  @property({ attribute: 'multiple-selection-type' }) multipleSelectionType: ComboboxMultipleSelectionType =
    'automatic';

  override connectedCallback(): void {
    super.connectedCallback();

    this.input.setAttribute('role', 'combobox');
    this.input.setAttribute('aria-haspopup', 'listbox');
    this.input.setAttribute('aria-expanded', 'false');
    this.input.setAttribute('aria-autocomplete', 'both');
  }

  override render(): TemplateResult {
    return html`
      <div class="input">${this.renderInputSlot()}</div>
      <button @click=${this.#onClick}>
        <sl-icon name="chevron-down"></sl-icon>
      </button>

      <slot
        ${anchor({
          element: this,
          offset: Combobox.offset,
          position: 'bottom-start',
          viewportMargin: Combobox.viewportMargin
        })}
        @slotchange=${this.#onSlotChange}
        @toggle=${this.#onToggle}
        name="options"
        popover
      ></slot>
    `;
  }

  #onClick(): void {
    this.menu?.togglePopover();
  }

  #onSlotChange(event: Event & { target: HTMLSlotElement }): void {
    const listbox = event.target.assignedElements({ flatten: true }).at(0);

    if (listbox) {
      listbox.id ||= `sl-combobox-listbox-${nextUniqueId++}`;
      listbox.setAttribute('role', 'listbox');

      this.input.setAttribute('aria-controls', listbox.id);
    }
  }

  #onToggle(event: ToggleEvent): void {
    this.input.setAttribute('aria-expanded', event.newState === 'open' ? 'true' : 'false');
  }
}
