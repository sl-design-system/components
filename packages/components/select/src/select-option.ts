import type { CSSResultGroup, TemplateResult } from 'lit';
import type { SelectSize } from './select.js';
import type { FormControlValue } from '@sl-design-system/shared';
import { observe } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-option.scss.js';

export class SelectOption extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** @ignore The size of the select, is set by the select component. */
  @property({ reflect: true }) size: SelectSize = 'md';

  /** @ignore Whether the content of the option item is a node*/
  @property({ reflect: true }) contentType?: 'string' | 'element';

  /** The value for the option item, to be used in forms.*/
  @property() value?: FormControlValue;

  /** Whether the option item is selected. */
  @property({ reflect: true, type: Boolean }) selected = false;

  /** Whether the option item is disabled. */
  @property({ reflect: true, type: Boolean }) disabled = false;

  /** @ignore Apply accessible attributes and values to the option. Observe the selected property if it changes */
  @observe('selected')
  protected handleSelectionChange(): void {
    this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
    this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'option');
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }

  async #onSlotchange(event: Event & { target: HTMLSlotElement }): Promise<void> {
    this.contentType = event.target.assignedNodes()[0].nodeType === 1 ? 'element' : 'string';
  }
}
