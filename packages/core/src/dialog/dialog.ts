import type { TemplateResult } from 'lit-html';
import type { CSSResultGroup } from 'lit';
import { LitElement, html } from 'lit';
import { query } from 'lit/decorators.js';
import styles from './dialog.scss.js';

export class Dialog extends LitElement {
  /** @private */
  static override styles: CSSResultGroup = styles;

  @query('dialog') dialog?: HTMLDialogElement;

  override render(): TemplateResult {
    return html`
      <dialog>
        <slot></slot>
      </dialog>
    `;
  }

  showModal(): void {
    this.dialog?.showModal();
  }
}
