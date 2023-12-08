import type { CSSResultGroup, TemplateResult } from 'lit';
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import styles from './error.scss.js';

export type ErrorSize = 'sm' | 'md' | 'lg';

/**
 * Component for displaying an error message for a form control.
 *
 * @slot error-text - The error message to display.
 */
export class Error extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  /** The light DOM slot. */
  #slot?: HTMLSlotElement;

  /** The size at which the error is displayed. */
  @property({ reflect: true }) size: ErrorSize = 'md';

  override connectedCallback(): void {
    super.connectedCallback();

    this.#slot ??= document.createElement('slot');
    this.#slot.name = 'error-text';
    this.append(this.#slot);

    // Make sure the error doesn't end up in the default slot
    if (this.parentElement?.tagName === 'SL-FORM-FIELD') {
      this.slot = 'error';
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
