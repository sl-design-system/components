import type { CSSResultGroup, PropertyValues, TemplateResult } from 'lit';
import type { SelectSize } from './select.js';
import type { FormControlValue } from '@sl-design-system/shared';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './select-option.scss.js';

export class SelectOption extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** @ignore Whether the content of the option item is a node. */
  @property({ reflect: true }) contentType?: 'string' | 'element';

  /** Whether the option item is disabled. */
  @property({ reflect: true, type: Boolean }) disabled?: boolean;

  /** Whether the option item is selected. */
  @property({ reflect: true, type: Boolean }) selected?: boolean;

  /** @ignore The size of the select, is set by the select component. */
  @property({ reflect: true }) size: SelectSize = 'md';

  /** The value for the option item, to be used in forms.*/
  @property() value?: FormControlValue;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'option');
  }

  override updated(changes: PropertyValues<this>): void {
    super.updated(changes);

    if (changes.has('selected')) {
      this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
    }

    if (changes.has('disabled')) {
      this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    }
  }

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#onSlotchange}></slot>`;
  }

  async #onSlotchange(event: Event & { target: HTMLSlotElement }): Promise<void> {
    this.contentType = event.target.assignedNodes()[0].nodeType === 1 ? 'element' : 'string';
  }
}
