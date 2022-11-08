import type { TemplateResult } from 'lit-html';
import type { CSSResultGroup } from 'lit';
import type { ScopedElementsMap } from '@open-wc/scoped-elements';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { LitElement, html } from 'lit';
import { query } from 'lit/decorators.js';
import { ButtonBar } from '../button-bar/index.js';
import styles from './dialog.scss.js';

export class Dialog extends ScopedElementsMixin(LitElement) {
  /** @private */
  static get scopedElements(): ScopedElementsMap {
    return {
      'sl-button-bar': ButtonBar
    };
  }

  /** @private */
  static override styles: CSSResultGroup = styles;

  @query('dialog') dialog?: HTMLDialogElement;

  override render(): TemplateResult {
    return html`
      <dialog @click=${this.#onClick}>
        <slot name="header">
          <slot name="title"></slot>
        </slot>
        <slot name="body">
          <slot></slot>
        </slot>
        <slot name="footer">
          <sl-button-bar align="end"><slot name="action"></slot></sl-button-bar>
        </slot>
      </dialog>
    `;
  }

  showModal(): void {
    this.dialog?.showModal();
  }

  #onClick(event: Event & { target: HTMLElement }): void {
    if (event.target.matches('sl-button[sl-dialog-close]')) {
      this.dialog?.close(event.target.getAttribute('sl-dialog-close') || '');
    }
  }
}
